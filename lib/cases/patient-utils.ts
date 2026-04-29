import type { Case, CasePatientRecord } from "@/types";

/** Office contact strip on patient-facing preview (optional fields). */
export interface PatientShareContact {
  phoneDisplay?: string;
  phoneTel?: string;
  email?: string;
}

export function buildPatientShareContactFromCase(
  c: Case,
): PatientShareContact | undefined {
  const phoneRaw = c.patient?.phone?.trim();
  const email = c.patient?.email?.trim();
  if (!phoneRaw && !email) return undefined;

  let phoneTel: string | undefined;
  let phoneDisplay: string | undefined;
  if (phoneRaw) {
    phoneDisplay = phoneRaw;
    const digits = phoneRaw.replace(/\D/g, "");
    phoneTel =
      digits.length === 10
        ? `+1${digits}`
        : phoneRaw.startsWith("+")
          ? phoneRaw.replace(/\s/g, "")
          : digits
            ? `+${digits}`
            : phoneRaw;
  }

  return {
    phoneDisplay,
    phoneTel,
    email: email || undefined,
  };
}

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
