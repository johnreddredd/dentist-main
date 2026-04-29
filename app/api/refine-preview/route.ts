import { NextRequest, NextResponse } from "next/server";
import { dentistNotesToGeminiEditPrompt } from "@/lib/api/claude";
import { refinePreviewImage } from "@/lib/api/gemini";
import { resolveImageToDataUrl } from "@/lib/api/image-fetch";
import type { RefinePreviewRequest, RefinePreviewResponse } from "@/types";

export const runtime = "nodejs";

const MAX_NOTES_LEN = 1000;

/**
 * POST /api/refine-preview
 *
 * 1. Dentist notes → Claude → short precise edit instruction for Gemini
 * 2. Gemini edits current preview using original photo as identity reference
 */
export async function POST(req: NextRequest) {
  let body: RefinePreviewRequest;
  try {
    body = (await req.json()) as RefinePreviewRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const notes = typeof body.dentistNotes === "string" ? body.dentistNotes : "";
  const previewUrl =
    typeof body.currentPreviewUrl === "string"
      ? body.currentPreviewUrl
      : "";
  const originalUrl =
    typeof body.originalPhotoUrl === "string" ? body.originalPhotoUrl : "";

  if (!notes.trim()) {
    return NextResponse.json({ error: "Describe what to change" }, { status: 400 });
  }
  if (notes.length > MAX_NOTES_LEN) {
    return NextResponse.json(
      { error: `Notes must be at most ${MAX_NOTES_LEN} characters` },
      { status: 400 },
    );
  }
  if (!previewUrl.trim() || !originalUrl.trim()) {
    return NextResponse.json(
      { error: "Missing preview or original image URL" },
      { status: 400 },
    );
  }

  let previewDataUrl: string;
  let originalDataUrl: string;
  try {
    [previewDataUrl, originalDataUrl] = await Promise.all([
      resolveImageToDataUrl(previewUrl),
      resolveImageToDataUrl(originalUrl),
    ]);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to load images";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const editPrompt = await dentistNotesToGeminiEditPrompt(notes);

  try {
    const image = await refinePreviewImage({
      previewDataUrl,
      originalDataUrl,
      editPrompt,
    });

    const response: RefinePreviewResponse = {
      generatedImageUrl: image.imageUrl,
      editPrompt,
      generationTimeMs: image.generationTimeMs,
      modelVersion: image.modelVersion,
      mock: image.mock,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : "Refinement failed — try again";
    console.error("[refine-preview]", e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
