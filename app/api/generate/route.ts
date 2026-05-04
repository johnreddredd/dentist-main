import { NextRequest, NextResponse } from "next/server";
import { evaluateTreatmentConstraints } from "@/lib/constraints";
import { buildAssumptionBox, buildPrompt } from "@/lib/prompts";
import { generateImage, refinePreviewImage } from "@/lib/api/gemini";
import { polishPrompt, reviewInitialDentalPreview } from "@/lib/api/claude";
import type { GenerateRequest, GenerateResponse } from "@/types";

export const runtime = "nodejs";

/** Wall-clock budget for Gemini (+ optional Claude). Vercel: requires Pro+ (Hobby is 10s). @see https://vercel.com/docs/functions/configuring-functions/duration */
export const maxDuration = 60;

/**
 * Post–initial-generation: Claude vision review → 3 bullets → second Gemini edit.
 * OFF by default. Set to `true` to use first-pass + review + final again.
 * You can also set env `SMILEAI_POST_INITIAL_REVIEW=true` without editing this file.
 */
const POST_INITIAL_REVIEW_PIPELINE_IN_CODE = false;

const runPostInitialReview =
  POST_INITIAL_REVIEW_PIPELINE_IN_CODE ||
  process.env.SMILEAI_POST_INITIAL_REVIEW === "true";

/**
 * POST /api/generate
 *
 * Pipeline:
 *   1. Constraint engine → prompt constructor → optional Claude text polish.
 *   2. Gemini: first-pass outcome image from patient photo + prompt.
 *   3. (Optional) Claude (vision): before first, after second → top 3 fix bullets.
 *   4. (Optional) Gemini: edit draft using bullets + original → final image.
 *   5. Assumption box from engine (unchanged).
 *
 * When steps 3–4 are off, `generatedImageUrl` is the first-pass image; `reviewerBullets` is [].
 */
export async function POST(req: NextRequest) {
  let body: GenerateRequest;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const form = body?.form;
  if (!form) {
    return NextResponse.json({ error: "Missing form" }, { status: 400 });
  }
  if (!form.photoDataUrl) {
    return NextResponse.json(
      { error: "Missing patient photo" },
      { status: 400 },
    );
  }

  const engine = evaluateTreatmentConstraints(form);

  const hardErrors = engine.issues.filter((i) => i.severity === "error");
  if (hardErrors.length > 0) {
    return NextResponse.json(
      { error: "Constraint error", issues: hardErrors },
      { status: 422 },
    );
  }

  try {
    const { prompt: basePrompt } = buildPrompt(form, engine.constraints);
    const prompt = await polishPrompt({ prompt: basePrompt });
    const assumption = buildAssumptionBox(form, engine.constraints);

    const draft = await generateImage({
      photoDataUrl: form.photoDataUrl,
      prompt,
    });

    let generatedImageUrl = draft.imageUrl;
    let reviewerBullets: string[] = [];
    let draftImageUrl: string | undefined;
    let generationTimeMs = draft.generationTimeMs;
    let modelVersion = draft.modelVersion;

    if (runPostInitialReview) {
      const review = await reviewInitialDentalPreview({
        originalDataUrl: form.photoDataUrl,
        draftPreviewDataUrl: draft.imageUrl,
      });

      const editPrompt = `An expert clinical reviewer compared the original patient photo to this first-pass AI dental preview. Apply ALL THREE improvements below to the first image (the preview). Use the second image only for facial identity reference — preserve non-dental features unless a change is required to integrate the dental work.

1. ${review.bullets[0]}
2. ${review.bullets[1]}
3. ${review.bullets[2]}`;

      const final = await refinePreviewImage({
        previewDataUrl: draft.imageUrl,
        originalDataUrl: form.photoDataUrl,
        editPrompt,
      });

      generatedImageUrl = final.imageUrl;
      reviewerBullets = [...review.bullets];
      draftImageUrl = draft.imageUrl;
      generationTimeMs =
        draft.generationTimeMs + review.reviewTimeMs + final.generationTimeMs;
      modelVersion = `${draft.modelVersion}→review→${final.modelVersion}`;
    }

    const caseId = crypto.randomUUID();

    const response: GenerateResponse = {
      caseId,
      generatedImageUrl,
      draftImageUrl,
      reviewerBullets,
      prompt,
      constraints: engine.constraints,
      assumption,
      issues: engine.issues,
      generationTimeMs,
      modelVersion,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[api/generate]", detail, err);
    return NextResponse.json(
      { error: "Generation failed", detail },
      { status: 502 },
    );
  }
}
