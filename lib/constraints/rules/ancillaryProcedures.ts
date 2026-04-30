import type { Issue, TreatmentConstraints, TreatmentFormData } from "@/types";
import { isProfessionalCleaningActive } from "../professional-cleaning";

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

  if (isProfessionalCleaningActive(form)) {
    allowedChanges.push(
      "Professional prophylaxis (cleaning) only: remove surface stains, plaque, and calculus (extrinsic) at cervical margins and interproximally; subtle enamel polish and reflectivity on sound enamel where extrinsic buildup existed — preserve base VITA shade category and all intrinsic enamel defects unchanged",
    );
    forbiddenChanges.push(
      "Bleaching or global whitening (cleaning is not whitening)",
      "Changing base tooth color or shifting overall shade category (e.g., A3 must stay A3 range)",
      "Altering tooth shape, size, or anatomy for cleaning",
      "Removing, lightening, or reducing visibility of white spots, hypomineralization, fluorosis, opacity patches, or other enamel defects",
      "Blending defects into surrounding enamel, smoothing defect texture, or altering defect shape, opacity, or boundaries",
      "Homogenizing enamel or making it more uniform beyond extrinsic stain/biofilm removal",
      "Plastic over-smoothing of natural enamel",
      "Uniformly perfect or artificially bright coloration",
    );
    preservationRules.push(
      "Enamel defects (white spots, hypomineralization, fluorosis, opacity patches, etc.) remain identical; when surrounding extrinsic stain is removed they may appear more visible — cleaning reveals variation, it does not whiten, homogenize, or improve enamel structure",
    );
  }

  return {
    partial: { allowedChanges, forbiddenChanges, preservationRules },
    issues,
  };
}
