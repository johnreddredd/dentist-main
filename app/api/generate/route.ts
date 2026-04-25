import { NextRequest, NextResponse } from "next/server";
import { evaluateTreatmentConstraints } from "@/lib/constraints";
import { buildAssumptionBox, buildPrompt } from "@/lib/prompts";
import { generateImage } from "@/lib/api/gemini";
import { polishPrompt } from "@/lib/api/claude";
import type { GenerateRequest, GenerateResponse } from "@/types";

export const runtime = "nodejs";

/**
 * POST /api/generate
 *
 * Pipeline (matches the build-order doc):
 *   1. Parse form (no auth yet — Supabase layer will add it).
 *   2. Constraint engine runs first.
 *   3. Prompt constructor builds the master prompt (w/ TREATMENT IDENTITY LOCK).
 *   3b. If ANTHROPIC_API_KEY is set, Claude polishes wording (no constraint drift).
 *   4. Gemini (mock) returns an image URL.
 *   5. Assumption box is built deterministically.
 *
 * In mock mode (no GOOGLE_APPLICATION_CREDENTIALS), the "generated" image
 * is the input photo so the full UI flow is testable end-to-end.
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

  // 1 — constraint engine (always before prompt construction)
  const engine = evaluateTreatmentConstraints(form);

  const hardErrors = engine.issues.filter((i) => i.severity === "error");
  if (hardErrors.length > 0) {
    return NextResponse.json(
      { error: "Constraint error", issues: hardErrors },
      { status: 422 },
    );
  }

  // 2 — prompt constructor
  const { prompt: basePrompt } = buildPrompt(form, engine.constraints);

  // 3 — optional Claude polish (same engine output; wording only)
  const prompt = await polishPrompt({ prompt: basePrompt });

  // 4 — assumption box (from structured engine + form, not from polished text)
  const assumption = buildAssumptionBox(form, engine.constraints);

  // 5 — call image model (mock in dev)
  const image = await generateImage({
    photoDataUrl: form.photoDataUrl,
    prompt,
  });

  const caseId = crypto.randomUUID();

  const response: GenerateResponse = {
    caseId,
    generatedImageUrl: image.imageUrl,
    prompt,
    constraints: engine.constraints,
    assumption,
    issues: engine.issues,
    generationTimeMs: image.generationTimeMs,
    modelVersion: image.modelVersion,
  };

  return NextResponse.json(response, { status: 200 });
}
