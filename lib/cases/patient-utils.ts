import type { Case, CasePatientRecord } from "@/types";

export function formatPatientListName(p?: CasePatientRecord): string {
  if (!p) return "Unnamed patient";
  const first = p.firstName?.trim() ?? "";
  const last = p.lastName?.trim() ?? "";
  if (!first && !last) return "Unnamed patient";
  if (!first) return last;
  if (!last) return first;
  return `${last}, ${first}`;
}

/** Lowercased string for client-side search (name, chart id, contacts, treatment). */
export function patientLibrarySearchHaystack(c: Case): string {
  const p = c.patient;
  return [
    p?.firstName,
    p?.lastName,
    p?.patientId,
    p?.phone,
    p?.email,
    p?.notes,
    c.constraints?.treatmentType,
    c.treatmentData?.material ?? "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
