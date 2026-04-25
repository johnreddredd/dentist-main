import type {
  Issue,
  Mode,
  TreatmentConstraints,
  TreatmentFormData,
  VitaShade,
} from "@/types";
import {
  MODE_SHADE_CAP,
  SEVERE_DAMAGE_THRESHOLD,
  SHADE_ORDER,
} from "../constants";

export interface ModeResult {
  partial: Partial<TreatmentConstraints>;
  issues: Issue[];
  flags: { aspirational: boolean };
}

/**
 * RULE FAMILY 5 — mode aesthetic (caps + metadata).
 *
 * - Conservative: VITA A3 cap, imperfection language required.
 * - Moderate: VITA A2 cap, clean natural white with subtle variation.
 * - Aspirational: VITA BL1 cap, uniform polished prosthetic language.
 *
 * CLAMP RULE: mode caps the shade. If the dentist selects a lighter shade
 * than the mode permits, the mode wins (documented product rule — prevents
 * conservative mode drifting into Hollywood).
 */
export function evaluateModeAesthetic(
  form: TreatmentFormData,
  severeDamageCount: number,
): ModeResult {
  const allowedChanges: string[] = [];
  const forbiddenChanges: string[] = [];
  const preservationRules: string[] = [];
  const issues: Issue[] = [];

  const mode: Mode = form.mode;
  const clampedShade = clampShadeToMode(form.shade, mode);
  const shadeRange = shadeRangeForMode(mode, clampedShade);

  switch (mode) {
    case "conservative": {
      allowedChanges.push(
        "Age-appropriate color with minor variation tooth-to-tooth",
        "Slight asymmetry and natural wear preserved",
      );
      preservationRules.push(
        "Do NOT remove existing minor imperfections — they are the signature of a natural smile",
      );
      forbiddenChanges.push(
        "Hollywood-white or uniform prosthetic appearance",
        "Perfect bilateral symmetry if the input photo does not have it",
      );
      break;
    }
    case "moderate": {
      allowedChanges.push(
        "Clean natural white with subtle tooth-to-tooth variation",
        "Mild symmetry improvement within realistic bounds",
      );
      forbiddenChanges.push(
        "Bright prosthetic uniformity — keep subtle variation",
      );
      break;
    }
    case "aspirational": {
      allowedChanges.push(
        "Uniform polished prosthetic appearance appropriate for premium restorative dentistry",
        "High-value aesthetic bright white",
      );
      forbiddenChanges.push(
        "Obvious natural imperfections (this is the polished tier)",
      );
      break;
    }
  }

  // Conservative + many missing/destroyed teeth => force prosthetic budget tier.
  if (mode === "conservative" && severeDamageCount >= SEVERE_DAMAGE_THRESHOLD) {
    allowedChanges.push(
      "Budget restorative prosthetic finish — functional, not cosmetic",
    );
    issues.push({
      severity: "warning",
      code: "MODE_SEVERITY_CONFLICT",
      message:
        "Many teeth marked missing/destroyed under Conservative mode — outcome will render as a budget prosthetic, not natural teeth.",
    });
  }

  return {
    partial: {
      allowedChanges,
      forbiddenChanges,
      preservationRules,
      shadeRange,
    },
    issues,
    flags: { aspirational: mode === "aspirational" },
  };
}

function shadeOrderIndex(shade: VitaShade): number {
  return SHADE_ORDER.indexOf(shade);
}

/**
 * Clamp a user-chosen shade to the cap allowed by the current mode.
 * Lighter than cap => use cap. Darker than cap => use the user value.
 */
export function clampShadeToMode(shade: VitaShade, mode: Mode): VitaShade {
  const cap = MODE_SHADE_CAP[mode];
  const capIdx = shadeOrderIndex(cap);
  const userIdx = shadeOrderIndex(shade);
  return userIdx < capIdx ? cap : shade;
}

function shadeRangeForMode(mode: Mode, clamped: VitaShade): string {
  switch (mode) {
    case "conservative":
      return `VITA ${clamped} (conservative cap)`;
    case "moderate":
      return `VITA ${clamped} (moderate cap, subtle variation allowed)`;
    case "aspirational":
      return `VITA ${clamped} (aspirational — uniform polished)`;
  }
}
