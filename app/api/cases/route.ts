import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Stub route — cases are currently persisted client-side via Zustand
 * (localStorage). Once Supabase is wired, move persistence here and
 * return the case from the DB.
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
