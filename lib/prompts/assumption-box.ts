import type {
  AssumptionBox,
  Mode,
  TreatmentConstraints,
  TreatmentFormData,
} from "@/types";

/**
 * Deterministic assumption box — pure function of constraints + form.
 * Never hide what the system assumed. See docs/build-10-parts-cursor-models.md §6.
 */
export function buildAssumptionBox(
  form: TreatmentFormData,
  constraints: TreatmentConstraints,
): AssumptionBox {
  const treatmentTeeth = Object.entries(form.teeth)
    .filter(([, s]) => s === "treatment" || s === "missing" || s === "destroyed")
    .map(([n]) => `#${n}`);

  const bullets: string[] = [
    `Treatment: ${constraints.treatmentType}`,
    `Material: ${form.material ?? "(not selected)"}`,
    `Shade target: ${constraints.shadeRange}`,
    `Shape: ${form.shape}`,
    `Affected teeth: ${treatmentTeeth.length ? treatmentTeeth.join(", ") : "none"}`,
    `Mode: ${cap(form.mode)}`,
    "Untreated areas: preserved exactly as-is",
  ];

  // Exclusions.
  const exclusions: string[] = [];
  if (!form.orthoSelected) exclusions.push("no alignment / orthodontic change");
  if (!form.gumSurgerySelected) exclusions.push("no gum surgery or gumline change");
  if (form.category !== "whitening") {
    // whitening is the only category that implies a color-only result; if not
    // whitening, we make the "no implicit whitening elsewhere" clear.
    exclusions.push("no whitening on untreated teeth");
  }
  if (exclusions.length > 0) {
    bullets.push(`Excluded: ${exclusions.join("; ")}`);
  }

  if (form.category === "alignment") {
    bullets.push(
      "Post-preview pass: simulated professional cleaning (scaling + polish) on the alignment outcome — subtle plaque/stain reduction only; not whitening; no shape or shade change beyond extrinsic cleanup.",
    );
  }

  return {
    bullets,
    disclaimerFooter: disclaimerFor(form.mode),
    mode: form.mode,
  };
}

export function disclaimerFor(mode: Mode): string {
  switch (mode) {
    case "conservative":
      return "Realistic preview — actual results vary based on individual healing and treatment response. Not a treatment plan.";
    case "moderate":
      return "Expected cosmetic outcome — extensive treatment required. Visual representation only. Not a treatment plan.";
    case "aspirational":
      return "Aspirational preview — full-arch implant or equivalent premium treatment required. Not a treatment plan.";
  }
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
