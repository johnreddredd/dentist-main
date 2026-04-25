import { GoogleGenAI } from "@google/genai";

/**
 * Gemini image model via Google AI (API key).
 * Default: `gemini-3-pro-image-preview` — "Gemini 3 Pro Image" (Nano Banana Pro), image + text in, image out.
 * Override with `GEMINI_MODEL` (e.g. `gemini-2.5-flash-image` for the lighter tier).
 *
 * @see https://ai.google.dev/gemini-api/docs/models/gemini-3-pro-image-preview
 */

export interface GenerateImageArgs {
  photoDataUrl: string;
  prompt: string;
}

export interface GenerateImageResult {
  imageUrl: string;
  modelVersion: string;
  generationTimeMs: number;
  mock: boolean;
}

const DEFAULT_IMAGE_MODEL = "gemini-3-pro-image-preview";

function parseDataUrl(
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
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
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
  const ai = new GoogleGenAI({ apiKey });

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

function isGemini3ProImage(modelId: string): boolean {
  return /gemini-3-pro-image/i.test(modelId) || /gemini-3\.1-flash-image/i.test(modelId);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
