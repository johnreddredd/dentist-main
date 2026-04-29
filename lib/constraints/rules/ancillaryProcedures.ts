import type { Issue, TreatmentConstraints, TreatmentFormData } from "@/types";

export interface AncillaryResult {
  partial: Partial<TreatmentConstraints>;
  issues: Issue[];
}

/**
 * RULE FAMILY 4 — ancillary procedures (spec rules 6-9).
 *
 * If the dentist did not explicitly select ortho / gum / arch work,
 * those changes are forbidden and their baseline state is preserved.
 */
export function evaluateAncillaryProcedures(
  form: TreatmentFormData,
): AncillaryResult {
  const allowedChanges: string[] = [];
  const forbiddenChanges: string[] = [];
  const preservationRules: string[] = [];
  const issues: Issue[] = [];

  if (!form.orthoSelected) {
    forbiddenChanges.push(
      "Improving alignment, rotations, crowding, or spacing",
    );
    preservationRules.push(
      "Current tooth alignment preserved exactly as in the input photo",
    );
  }

  if (!form.gumSurgerySelected) {
    forbiddenChanges.push(
      "Altering gumline, gingival zenith, or gum display on smile",
    );
    preservationRules.push(
      "Gumline and gingival contours preserved exactly as in the input photo",
    );
  }

  // Spec rule 9 — original bite/arch form preserved unless treatment requires otherwise.
  const archChangeExpected =
    form.category === "alignment" ||
    form.category === "makeover" ||
    (form.orthoSelected && form.category !== "whitening");

  if (
    form.orthoSelected &&
    form.category !== "whitening" &&
    form.category !== "alignment"
  ) {
    allowedChanges.push(
      "Orthodontic alignment, arch coordination, and bite/occlusal improvement in the visible arches where indicated — plausible appliance-off finishing (no brackets/wires)",
    );
  }

  if (!archChangeExpected) {
    forbiddenChanges.push(
      "Changing arch form, bite, or jaw position",
    );
    preservationRules.push(
      "Original bite and arch form preserved",
    );
  }

  // Spec rule 8 — untreated teeth remain unchanged (expressed positively).
  preservationRules.push(
    "All teeth not explicitly marked for treatment remain unchanged",
  );

  return {
    partial: { allowedChanges, forbiddenChanges, preservationRules },
    issues,
  };
}
