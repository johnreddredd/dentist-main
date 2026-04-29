import type { Case } from "@/types";

export const BACKUP_FORMAT_VERSION = 1;

export interface CasesBackupFile {
  smileaiCasesBackup: true;
  version: number;
  exportedAt: string;
  cases: Case[];
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Rough structural check after JSON parse. */
export function parseCasesBackupJson(text: string):
  | { ok: true; data: CasesBackupFile }
  | { ok: false; error: string } {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "Invalid JSON file." };
  }
  if (!isRecord(raw)) {
    return { ok: false, error: "Backup must be a JSON object." };
  }
  if (raw.smileaiCasesBackup !== true) {
    return { ok: false, error: "Not a SmileAI cases backup (missing marker)." };
  }
  if (!Array.isArray(raw.cases)) {
    return { ok: false, error: "Backup has no cases array." };
  }
  for (const c of raw.cases) {
    if (!isRecord(c) || typeof c.id !== "string") {
      return { ok: false, error: "Backup contains an invalid case entry." };
    }
  }
  return {
    ok: true,
    data: raw as unknown as CasesBackupFile,
  };
}

export function buildCasesBackupPayload(cases: Case[]): CasesBackupFile {
  return {
    smileaiCasesBackup: true,
    version: BACKUP_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    cases,
  };
}

export function caseHasBlobUrl(c: Case): boolean {
  const urls = [
    c.originalPhotoUrl,
    c.generatedImageUrl,
    c.treatmentData?.photoDataUrl,
    ...(c.previewGenerations?.map((g) => g.imageUrl) ?? []),
  ];
  return urls.some((u) => typeof u === "string" && u.startsWith("blob:"));
}

export function casesWithBlobRefs(cases: Case[]): Case[] {
  return cases.filter(caseHasBlobUrl);
}
