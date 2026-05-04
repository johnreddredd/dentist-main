import Anthropic from "@anthropic-ai/sdk";
import { parseDataUrl } from "@/lib/api/gemini";
import { PREVIEW_REALISM_REVIEW_CHECKLIST } from "@/lib/prompts/clinical-review-checklist";
import { withSmileAiClinicalTask } from "@/lib/prompts/clinical-system-prompt";

/**
 * Optional Claude "polish / tighten" layer for the final image prompt.
 *
 * Runs *after* the constraint engine and template constructor, *before* Gemini.
 * The model must not invent new procedures or undo TREATMENT IDENTITY LOCK.
 */
export interface PolishArgs {
  prompt: string;
  notes?: string;
}

const DEFAULT_MODEL = "claude-3-5-haiku-20241022";

export async function polishPrompt(args: PolishArgs): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return args.prompt;

  const model = process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;
  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model,
      max_tokens: 4096,
      system: withSmileAiClinicalTask(`You are operating in ROLE 1 — PROMPT CONSTRUCTOR, as a clinical copy editor on text that is already routed through SmileAI’s constraint engine. You receive the pre-built prompt for a photorealistic dental clinical-outcome image generator (Gemini / Nano Banana).

Apply the constitution above: core philosophy, constraint priority, geometry rule for whitening, gum rules, preservation language, and universal forbids.

Your job is ONLY to:
- Tighten wording, remove redundancy, and improve scanability
- Prefer positive rendering language per PRESERVATION LANGUAGE where you touch phrasing
- Keep every clinical constraint: allowed changes, forbidden changes, and preservation rules must remain equivalent in meaning
- You MUST keep all section headers and the TREATMENT IDENTITY LOCK block; do not delete or relax constraints
- Keep the POST-TREATMENT OUTCOME (CRITICAL) block; it must remain at least as strict about finished results and no fixed braces/hardware — including OCCLUSION / BITE lines when present
- When present, keep OCCLUSION REALISM LOCK (VENEERS / CROWNS / CERAMIC — FUNCTIONAL FIRST) verbatim in meaning — it requires plausible functional overlap/overjet and coherent arches for crowns and bridges as well as veneers; do not substitute the generic non-ceramic OCCLUSION REALISM LOCK
- If present, keep the BITE / OCCLUSION (MANDATORY — VENEERS / CROWNS / CERAMIC RESTORATIONS) block verbatim in meaning (PRIORITY / CONFLICT RESOLUTION, bullets, HARD INVALIDATION, CONSTRAINTS, FINAL RULE); do not delete or relax overbite/overjet, contacts, arch curvature, midline, no floating or clipping teeth
- If present, keep BITE RECAP (VENEERS / CROWNS / CERAMICS — REPEAT BEFORE RENDER) and BITE & OCCLUSION VALIDATION (VENEERS / CROWNS / CERAMICS — HARD GATE) verbatim in meaning
- Keep the COLOR & TEXTURE block verbatim in meaning; if the prompt uses COLOR & TEXTURE (CERAMIC / VENEER — MODERATE OR ASPIRATIONAL), keep that block verbatim in meaning (do not substitute the generic three-line COLOR & TEXTURE)
- Keep the TOOTH SHAPE LOCK (CRITICAL) block verbatim in meaning; do not relax or delete it OR, if the prompt instead uses TOOTH SHAPE & CONTOUR (CRITICAL — CERAMIC / VENEER — MODERATE OR ASPIRATIONAL), keep that ceramic/veneer block verbatim in meaning
- Keep the INCISAL EDGE PRESERVATION (CRITICAL) and INCISAL EDGE NON-UNIFORMITY (CRITICAL) blocks verbatim in meaning; do not relax or delete them OR, if the prompt uses INCISAL CHARACTER (CRITICAL — CERAMIC / VENEER — MODERATE OR ASPIRATIONAL), keep that block verbatim in meaning
- Keep the CLINICAL OUTCOME REALISM & VALIDATION (CRITICAL) block verbatim in meaning; do not relax, delete, or idealize away its rules OR, if the prompt uses CLINICAL OUTCOME REALISM & VALIDATION (CRITICAL — CERAMIC / VENEER — MODERATE OR ASPIRATIONAL OR — CONSERVATIVE), keep that ceramic/veneer block verbatim in meaning including BITE & OCCLUSION VALIDATION
- If present, keep the PROFESSIONAL CLEANING CONSTRAINT (CRITICAL) block verbatim in meaning; do not relax, delete, or substitute bleaching/whitening language — including the ENAMEL DEFECT + CLEANING LOCK subsection
- Keep the PERCEPTUAL CLEANLINESS (VISUAL ONLY) block verbatim in meaning; do not relax or delete it
- Keep the INTRINSIC ENAMEL FEATURES (CRITICAL) block verbatim in meaning; do not relax or delete it OR, if the prompt uses INTRINSIC ENAMEL & SURFACE (CRITICAL — CERAMIC / VENEER — MODERATE OR ASPIRATIONAL), keep that block verbatim in meaning
- Do NOT add new teeth, materials, or procedures that are not already implied
- Do NOT add marketing language

Output the FULL revised prompt as plain text only. No preface, no markdown code fences.`),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Revise the following prompt. Return the complete prompt only.${
                args.notes
                  ? `\n\nEditor notes: ${args.notes}`
                  : ""
              }\n\n---\n\n${args.prompt}`,
            },
          ],
        },
      ],
    });

    const block = message.content.find((b) => b.type === "text");
    if (block && block.type === "text" && block.text?.trim()) {
      return block.text.trim();
    }
  } catch (err) {
    console.error("[claude] polishPrompt failed, using original prompt:", err);
  }

  return args.prompt;
}

/**
 * Turn informal dentist tweak notes into a short, precise instruction for Gemini
 * (image-edit on the current preview; original photo may be passed separately).
 */
export async function dentistNotesToGeminiEditPrompt(
  dentistNotes: string,
): Promise<string> {
  const trimmed = dentistNotes.trim();
  if (!trimmed) {
    return "Make subtle photorealistic improvements to the dental preview, preserving identity.";
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return `Photorealistic dental preview adjustment: ${trimmed.slice(0, 400)}`.slice(
      0,
      500,
    );
  }

  const model = process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;
  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model,
      max_tokens: 512,
      system: withSmileAiClinicalTask(`You are operating under DENTIST FEEDBACK TRANSLATION: convert plain-language dentist requests into ONE short English instruction for Google Gemini image models editing a dental smile preview.

The model receives:
1) First image = current AI dental preview to edit
2) Second image = original patient photo (identity / face reference only)

Your job: convert the dentist's free-text request into ONE short English instruction for the image model.

Rules:
- Output ONLY the instruction text (max 500 characters). No quotes, labels, markdown, or JSON.
- Only address what the dentist asked for — nothing extra (align with constitution operational principles).
- A fixed "scope lock" is appended after your text for the image model; do not restate it.
- Focus edits on teeth and gingiva (shade, shape, alignment, gum line, length, symmetry, etc.). Do NOT add instructions to relight the scene, change global brightness, or alter skin, eyes, brows, nose, hair, clothing, or background unless the dentist explicitly asked for that.
- Preserve patient identity and all non–teeth-and-gums appearance unless the dentist explicitly asks otherwise.
- Use positive rendering language where possible; imperative, clinical-neutral wording. No marketing fluff.`),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Dentist request:\n${trimmed}`,
            },
          ],
        },
      ],
    });

    const block = message.content.find((b) => b.type === "text");
    if (block && block.type === "text" && block.text?.trim()) {
      return block.text.trim().slice(0, 500);
    }
  } catch (err) {
    console.error(
      "[claude] dentistNotesToGeminiEditPrompt failed, using fallback:",
      err,
    );
  }

  return `Photorealistic dental preview adjustment: ${trimmed.slice(0, 400)}`.slice(
    0,
    500,
  );
}

const DEFAULT_REVIEW_BULLETS: readonly [string, string, string] = [
  "Improve consistency of tooth shade and translucency with the proposed treatment",
  "Refine gingival contours at the smile line for a natural look",
  "Adjust incisal edge shape and symmetry for a balanced smile",
];

export interface ReviewInitialPreviewArgs {
  /** Original patient photo (before / pre-treatment). */
  originalDataUrl: string;
  /** First-pass AI dental preview (after). */
  draftPreviewDataUrl: string;
}

export interface ReviewInitialPreviewResult {
  bullets: [string, string, string];
  rawText: string;
  reviewTimeMs: number;
  skippedVision: boolean;
}

function parseThreeBullets(text: string): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-*•]\s*/, "").trim())
    .filter(Boolean);
  const out: string[] = [];
  for (const line of lines) {
    const cleaned = line.replace(/^\d+[.)]\s*/, "").trim();
    if (cleaned.length > 2) out.push(cleaned);
    if (out.length >= 3) break;
  }
  while (out.length < 3) {
    out.push(DEFAULT_REVIEW_BULLETS[out.length] ?? DEFAULT_REVIEW_BULLETS[0]);
  }
  return out.slice(0, 3);
}

/**
 * Vision review: compare original vs first Gemini draft; return exactly 3 fix bullets for a final edit pass.
 * Image order for the model: 1st = before (original), 2nd = after (draft preview).
 */
export async function reviewInitialDentalPreview(
  args: ReviewInitialPreviewArgs,
): Promise<ReviewInitialPreviewResult> {
  const start = Date.now();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  const orig = parseDataUrl(args.originalDataUrl);
  const draft = parseDataUrl(args.draftPreviewDataUrl);

  if (!apiKey || !orig || !draft) {
    const b = [...DEFAULT_REVIEW_BULLETS] as [string, string, string];
    return {
      bullets: b,
      rawText: "",
      reviewTimeMs: Date.now() - start,
      skippedVision: true,
    };
  }

  const model = process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;
  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model,
      max_tokens: 600,
      system: withSmileAiClinicalTask(`You are operating in ROLE 2 — QUALITY CHECKER on first-pass AI dental preview output.

Mentally grade the draft using the four criteria in the constitution (SHADE, CONSTRAINT, TREATMENT ACCURACY, CLINICAL REALISM). Do NOT output PASS/FAIL or a correction paragraph — your only output is exactly three hyphen bullets as specified below.

You will see TWO images in this exact order:
1) FIRST image — the patient's original BEFORE photo (pre-treatment).
2) SECOND image — the FIRST-PASS AI outcome preview (AFTER).

${PREVIEW_REALISM_REVIEW_CHECKLIST}

Your job: list exactly the 3 MOST IMPORTANT improvements the AFTER image still needs so it is clinically believable, natural, and consistent with the BEFORE person's identity. Use the checklist and the four QA criteria to judge; your 3 bullets should target the largest remaining errors. Use simple, short phrases dentists understand.

Rules:
- Output ONLY 3 lines. Each line starts with "- " (hyphen space).
- You may reference bite, occlusion, alignment, or debond realism if those are among the top problems — do not avoid them when the checklist flags a clear issue.
- Focus on teeth, gingiva, arch form, bite relationship, proportions, shade/texture as they relate to the treatment — not generic photography advice unless something clearly breaks realism.
- Do NOT mention changing lighting, background, skin, eyes, or unrelated facial features unless the error is unmistakable and central to the smile result.
- Do not add titles, numbering other than the hyphens, or prose before/after the list.`),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Review these images in order: first = BEFORE (original), second = AFTER (AI draft). Output exactly 3 hyphen bullets as instructed.",
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: orig.mimeType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
                data: orig.base64,
              },
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: draft.mimeType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
                data: draft.base64,
              },
            },
          ],
        },
      ],
    });

    const block = message.content.find((b) => b.type === "text");
    const rawText =
      block && block.type === "text" && block.text?.trim()
        ? block.text.trim()
        : "";
    const parsed = parseThreeBullets(rawText || "");
    const bullets = parsed as [string, string, string];
    return {
      bullets,
      rawText,
      reviewTimeMs: Date.now() - start,
      skippedVision: false,
    };
  } catch (err) {
    console.error("[claude] reviewInitialDentalPreview failed:", err);
    const b = [...DEFAULT_REVIEW_BULLETS] as [string, string, string];
    return {
      bullets: b,
      rawText: "",
      reviewTimeMs: Date.now() - start,
      skippedVision: true,
    };
  }
}
