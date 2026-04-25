import type {
  Issue,
  ToothNumber,
  TreatmentCategory,
  TreatmentConstraints,
  TreatmentFormData,
} from "@/types";

export interface ModalityResult {
  partial: Partial<TreatmentConstraints>;
  issues: Issue[];
  flags: {
    whiteningOnly: boolean;
  };
}

/**
 * RULE FAMILY 3 — treatment modality (spec rules 2-5).
 *
 * Maps (category, material, full-arch flag) to:
 *   - what changes are allowed
 *   - what changes are explicitly forbidden
 *   - what scope of teeth may be altered
 */
export function evaluateTreatmentModality(
  form: TreatmentFormData,
  treatmentTeeth: ToothNumber[],
): ModalityResult {
  const allowedChanges: string[] = [];
  const forbiddenChanges: string[] = [];
  const preservationRules: string[] = [];
  const issues: Issue[] = [];

  const category: TreatmentCategory | null = form.category;
  let whiteningOnly = false;

  switch (category) {
    case "whitening": {
      whiteningOnly = true;
      allowedChanges.push("Color change to match selected VITA shade");
      forbiddenChanges.push(
        "Any shape change to teeth",
        "Any alignment change to teeth",
        "Any change to tooth edges, length, or contour",
      );
      break;
    }

    case "cosmetic": {
      if (form.material?.toLowerCase().includes("bonding")) {
        // Bonding = local repairs only
        allowedChanges.push(
          `Small composite repairs on selected teeth ${fmt(treatmentTeeth)}`,
        );
        forbiddenChanges.push(
          "Full-smile design or arch-wide redesign",
          "Shape changes to teeth not tagged for treatment",
        );
      } else if (
        form.material?.toLowerCase().includes("veneer") ||
        form.material?.toLowerCase().includes("e.max") ||
        form.material?.toLowerCase().includes("crown")
      ) {
        // Veneers / crowns scope
        const scope = form.fullArch
          ? "full upper arch"
          : `selected teeth ${fmt(treatmentTeeth)}`;
        allowedChanges.push(
          `Shape and color changes on ${scope} using ${form.material}`,
        );
        if (!form.fullArch && treatmentTeeth.length > 0) {
          forbiddenChanges.push(
            "Altering teeth outside the selected set — full-arch redesign",
          );
        }
      } else {
        allowedChanges.push(
          `Cosmetic changes on selected teeth using ${form.material ?? "selected material"}`,
        );
      }
      break;
    }

    case "restorative": {
      allowedChanges.push(
        `Restoration of selected teeth ${fmt(treatmentTeeth)} with ${form.material ?? "selected material"}`,
      );
      forbiddenChanges.push("Full-smile cosmetic redesign");
      break;
    }

    case "replacement": {
      // Implants / dentures — only selected sites; surrounding teeth preserved
      allowedChanges.push(
        `Replace missing/destroyed teeth with ${form.material ?? "selected prosthetic"}`,
      );
      forbiddenChanges.push(
        "Altering natural teeth adjacent to the implant site",
        "Cosmetic reshaping of teeth not marked for replacement",
      );
      preservationRules.push(
        "Surrounding natural teeth remain unchanged in shape, size, and color",
      );
      break;
    }

    case "alignment": {
      allowedChanges.push(
        `Alignment / position change across the visible arch using ${form.material ?? "orthodontic treatment"}`,
      );
      forbiddenChanges.push(
        "Shape change beyond what natural repositioning produces",
        "Color change — alignment alone does not whiten teeth",
      );
      break;
    }

    case "makeover": {
      allowedChanges.push(
        "Combined plan: shape, color, and alignment changes per form selections",
      );
      break;
    }

    default: {
      issues.push({
        severity: "error",
        code: "BONDING_SCOPE",
        message: "No treatment category selected.",
      });
    }
  }

  return {
    partial: { allowedChanges, forbiddenChanges, preservationRules },
    issues,
    flags: { whiteningOnly },
  };
}

function fmt(ns: ToothNumber[]): string {
  if (ns.length === 0) return "(none selected)";
  return `#${ns.join(", #")}`;
}
