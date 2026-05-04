import { GoogleGenAI } from "@google/genai";
import { GEMINI_EDIT_SCOPE_LOCK } from "@/lib/prompts/edit-scope-preservation";

/**
 * Gemini image generation — Google AI Studio **or** Vertex AI (`@google/genai`).
 *
 * **Developer API (default):** set `GEMINI_API_KEY` or `GOOGLE_API_KEY`.
 *
 * **Vertex AI — Express (API key):** set `GEMINI_USE_VERTEX=true` (or `GOOGLE_GENAI_USE_VERTEXAI=true`)
 * and `GEMINI_API_KEY` / `GOOGLE_API_KEY` with your Vertex Express key.
 * If `GOOGLE_CLOUD_PROJECT` is also present (e.g. platform default), add `GEMINI_VERTEX_EXPRESS=true`
 * so the client uses the API key and not ADC+project.
 *
 * **Vertex AI — project + ADC:** set `GEMINI_USE_VERTEX=true`, `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`
 * (e.g. `us-central1`), and credentials via `GOOGLE_APPLICATION_CREDENTIALS` (or workload identity on GCP).
 *
 * Default model: `gemini-3-pro-image-preview`. Override with `GEMINI_MODEL`.
 *
 * @see https://ai.google.dev/gemini-api/docs/models/gemini-3-pro-image-preview
 * @see https://cloud.google.com/vertex-ai/docs
 */

function envTruthy(name: string): boolean {
  const v = process.env[name]?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function useVertexAI(): boolean {
  return (
    envTruthy("GEMINI_USE_VERTEX") ||
    envTruthy("GOOGLE_GENAI_USE_VERTEXAI")
  );
}

function apiKeyFromEnv(): string | undefined {
  const a = process.env.GOOGLE_API_KEY?.trim();
  const b = process.env.GEMINI_API_KEY?.trim();
  return a || b || undefined;
}

/**
 * Single auth surface for the SDK. Avoids relying on mixed implicit env (project + key) inside the client.
 */
function createGoogleGenAI(): GoogleGenAI {
  const vertex = useVertexAI();
  const apiKey = apiKeyFromEnv();
  const project = process.env.GOOGLE_CLOUD_PROJECT?.trim();
  const location =
    process.env.GOOGLE_CLOUD_LOCATION?.trim() || "us-central1";

  if (!vertex) {
    return new GoogleGenAI({ apiKey });
  }

  const forceExpress = envTruthy("GEMINI_VERTEX_EXPRESS");

  if (project && !forceExpress) {
    return new GoogleGenAI({
      vertexai: true,
      project,
      location,
    });
  }

  if (apiKey) {
    return new GoogleGenAI({
      vertexai: true,
      apiKey,
    });
  }

  throw new Error(
    "Vertex AI is enabled (GEMINI_USE_VERTEX or GOOGLE_GENAI_USE_VERTEXAI) but no credentials: set GOOGLE_CLOUD_PROJECT (+ ADC) or GEMINI_API_KEY / GOOGLE_API_KEY (Express). For Express when GOOGLE_CLOUD_PROJECT is also set, add GEMINI_VERTEX_EXPRESS=true.",
  );
}

function hasConfiguredCredentials(): boolean {
  if (!useVertexAI()) {
    return !!apiKeyFromEnv();
  }
  const apiKey = apiKeyFromEnv();
  const project = process.env.GOOGLE_CLOUD_PROJECT?.trim();
  const forceExpress = envTruthy("GEMINI_VERTEX_EXPRESS");
  if (forceExpress) {
    return !!apiKey;
  }
  return !!(apiKey || project);
}

export interface GenerateImageArgs {
  photoDataUrl: string;
  prompt: string;
}

export interface RefinePreviewImageArgs {
  /** Current AI preview — primary edit target */
  previewDataUrl: string;
  /** Original patient photo — identity reference */
  originalDataUrl: string;
  /** Short edit instruction (e.g. from Claude) */
  editPrompt: string;
}

export interface GenerateImageResult {
  imageUrl: string;
  modelVersion: string;
  generationTimeMs: number;
  mock: boolean;
}

const DEFAULT_IMAGE_MODEL = "gemini-3-pro-image-preview";

export function parseDataUrl(
  dataUrl: string,
): { mimeType: string; base64: string } | null {
  const m = dataUrl.match(/^data:([^;]+);base64,([\s\S]+)$/);
  if (!m) return null;
  return { mimeType: m[1], base64: m[2] };
}

export async function generateImage(
  args: GenerateImageArgs,
): Promise<GenerateImageResult> {
  const start = Date.now();

  if (!hasConfiguredCredentials()) {
    await sleep(1200);
    return {
      imageUrl: args.photoDataUrl,
      modelVersion: "mock-no-GEMINI_API_KEY",
      generationTimeMs: Date.now() - start,
      mock: true,
    };
  }

  const parsed = parseDataUrl(args.photoDataUrl);
  if (!parsed) {
    throw new Error("Patient photo must be a base64 data URL (e.g. image/jpeg).");
  }

  const modelId = process.env.GEMINI_MODEL ?? DEFAULT_IMAGE_MODEL;
  const ai = createGoogleGenAI();

  // Image editing: reference photo + full clinical prompt (per Google docs).
  // Gemini 3 Pro Image supports 2K output via imageConfig (optional).
  const response = await ai.models.generateContent({
    model: modelId,
    contents: [
      { text: args.prompt },
      {
        inlineData: {
          mimeType: parsed.mimeType,
          data: parsed.base64,
        },
      },
    ],
    config: isGemini3ProImage(modelId)
      ? {
          imageConfig: {
            imageSize: "2K",
          },
        }
      : undefined,
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts?.length) {
    throw new Error("Gemini returned no candidates — check model access and safety blocks.");
  }

  for (const part of parts) {
    if (part.inlineData?.data) {
      const mime = part.inlineData.mimeType ?? "image/png";
      const out = `data:${mime};base64,${part.inlineData.data}`;
      return {
        imageUrl: out,
        modelVersion: modelId,
        generationTimeMs: Date.now() - start,
        mock: false,
      };
    }
  }

  throw new Error("Gemini response contained no image part — try another GEMINI_MODEL.");
}

/**
 * Dentist-driven preview refinement: edit the preview image using an instruction + original for identity.
 */
export async function refinePreviewImage(
  args: RefinePreviewImageArgs,
): Promise<GenerateImageResult> {
  const start = Date.now();

  if (!hasConfiguredCredentials()) {
    await sleep(1200);
    return {
      imageUrl: args.previewDataUrl,
      modelVersion: "mock-no-GEMINI_API_KEY-refine",
      generationTimeMs: Date.now() - start,
      mock: true,
    };
  }

  const previewParsed = parseDataUrl(args.previewDataUrl);
  const originalParsed = parseDataUrl(args.originalDataUrl);
  if (!previewParsed) {
    throw new Error("Preview image must be a base64 data URL.");
  }
  if (!originalParsed) {
    throw new Error("Original photo must be a base64 data URL.");
  }

  const modelId = process.env.GEMINI_MODEL ?? DEFAULT_IMAGE_MODEL;
  const ai = createGoogleGenAI();

  const instruction = `Edit the first image (current dental smile preview) photorealistically using the instruction below. The second image is the original pre-treatment patient photo — use it only to preserve facial identity, skin, and non-dental features; do not revert the intended treatment unless asked. The result must remain a POST-TREATMENT outcome only: do not depict fixed braces, brackets, archwires, or other orthodontic appliances on the teeth unless the dentist explicitly requests otherwise.

Keep the preview’s lighting, shadows, and environment consistent unless the instruction explicitly calls for a lighting change. Do not change face, skin, eyes, hair, clothing, or background except as needed for seamless integration of tooth and gum edits.

Instruction: ${args.editPrompt}

${GEMINI_EDIT_SCOPE_LOCK}`;

  const contentParts: Array<
    { text: string } | { inlineData: { mimeType: string; data: string } }
  > = [
    { text: instruction },
    {
      inlineData: {
        mimeType: previewParsed.mimeType,
        data: previewParsed.base64,
      },
    },
    {
      inlineData: {
        mimeType: originalParsed.mimeType,
        data: originalParsed.base64,
      },
    },
  ];

  const response = await ai.models.generateContent({
    model: modelId,
    contents: contentParts,
    config: isGemini3ProImage(modelId)
      ? {
          imageConfig: {
            imageSize: "2K",
          },
        }
      : undefined,
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts?.length) {
    throw new Error("Gemini returned no candidates — check model access and safety blocks.");
  }

  for (const part of parts) {
    if (part.inlineData?.data) {
      const mime = part.inlineData.mimeType ?? "image/png";
      const out = `data:${mime};base64,${part.inlineData.data}`;
      return {
        imageUrl: out,
        modelVersion: modelId,
        generationTimeMs: Date.now() - start,
        mock: false,
      };
    }
  }

  throw new Error("Gemini response contained no image part — try another GEMINI_MODEL.");
}

function isGemini3ProImage(modelId: string): boolean {
  return /gemini-3-pro-image/i.test(modelId) || /gemini-3\.1-flash-image/i.test(modelId);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
