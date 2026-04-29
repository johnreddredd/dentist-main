import type { Case, TreatmentCategory, TreatmentFormData } from "@/types";

const CATEGORY_LABEL: Record<TreatmentCategory, string> = {
  cosmetic: "Cosmetic",
  restorative: "Restorative",
  replacement: "Replacement",
  alignment: "Alignment",
  whitening: "Whitening",
  makeover: "Makeover",
};

export function teethSummarySegment(form: TreatmentFormData): string {
  if (form.fullArch) return "32 teeth";
  const nums = Object.entries(form.teeth)
    .filter(([, st]) => st != null)
    .map(([k]) => Number(k))
    .filter((n) => Number.isFinite(n));
  const n = nums.length;
  if (n === 0) return "Full smile context";
  if (n === 1) return "1 tooth";
  return `${n} teeth`;
}

export function buildCaseDecisionTitle(c: Case): string {
  const catKey = c.treatmentData.category;
  const cat =
    catKey != null ? CATEGORY_LABEL[catKey] : c.constraints.treatmentType.split(" ")[0] ?? "Treatment";
  const mat = c.treatmentData.material ?? c.constraints.treatmentType;
  const teeth = teethSummarySegment(c.treatmentData);
  const mode = c.mode.charAt(0).toUpperCase() + c.mode.slice(1) + " Mode";
  return `${cat} — ${mat} — ${teeth} (${mode})`;
}

export interface DecisionChip {
  label: string;
  value: string;
}

export function buildTreatmentSummaryChips(c: Case): DecisionChip[] {
  const treatment =
    c.treatmentData.material?.trim() ||
    c.constraints.treatmentType ||
    "Plan";
  return [
    { label: "Treatment", value: treatment },
    { label: "Teeth", value: teethSummarySegment(c.treatmentData) },
    {
      label: "Mode",
      value: c.mode.charAt(0).toUpperCase() + c.mode.slice(1),
    },
    { label: "Shade", value: `VITA ${c.treatmentData.shade}` },
    {
      label: "Shape",
      value:
        c.treatmentData.shape.charAt(0).toUpperCase() +
        c.treatmentData.shape.slice(1),
    },
  ];
}

export function buildWhatLooksGood(c: Case): string[] {
  const lines: string[] = ["Facial features unchanged"];
  const cat = c.treatmentData.category;

  if (cat === "whitening") {
    lines.unshift("Tooth brightness shift stays within selected shade");
  } else {
    lines.unshift("Natural tooth shade preserved");
  }

  if (cat === "alignment") {
    lines.splice(1, 0, "Alignment realistic for orthodontic mechanics");
  } else if (cat === "cosmetic" || cat === "makeover") {
    lines.splice(1, 0, "Smile refinements stay proportional to your plan");
  } else {
    lines.splice(1, 0, "Anatomy and proportions look consistent");
  }

  return lines.slice(0, 3);
}

export function buildConstraintsScannable(c: Case): string[] {
  const out: string[] = [];
  const shadeCap = c.constraints.shadeRange?.trim();
  if (shadeCap) out.push(`Whitening bounded (${shadeCap})`);
  else out.push(`No whitening beyond ${c.treatmentData.shade}`);

  const forbidden = c.constraints.forbiddenChanges ?? [];
  for (const f of forbidden) {
    if (out.length >= 5) break;
    if (f.trim()) out.push(f);
  }

  const preserve = c.constraints.preservationRules ?? [];
  for (const p of preserve) {
    if (out.length >= 5) break;
    if (p.trim() && !out.includes(p)) out.push(p);
  }

  const defaults = [
    "No shape alteration outside selected teeth",
    "Gumline unchanged in untreated areas",
    "Untreated areas preserved",
  ];
  for (const d of defaults) {
    if (out.length >= 5) break;
    if (!out.some((x) => x.toLowerCase().includes(d.slice(0, 8).toLowerCase()))) {
      out.push(d);
    }
  }

  return out.slice(0, 5);
}

export function confidenceLabel(): "High" {
  return "High";
}
