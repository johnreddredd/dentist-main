import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Stub route — the app syncs cases from the browser to Supabase (`cases` table)
 * when NEXT_PUBLIC_SUPABASE_* env vars are set. This endpoint remains for future
 * server-backed import/export or admin tools.
 */
export async function GET() {
  return NextResponse.json({
    cases: [],
    note: "Cases are stored client-side until Supabase is wired.",
  });
}

export async function POST() {
  return NextResponse.json(
    { error: "Not implemented yet — Supabase integration pending." },
    { status: 501 },
  );
}
