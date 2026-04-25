/**
 * Re-export engine-facing types so `lib/constraints` is self-contained.
 *
 * The canonical definitions live in `types/index.ts` — this file is a
 * convenience import boundary for engine internals.
 */
export type {
  TreatmentFormData,
  TreatmentConstraints,
  EngineResult,
  Issue,
  IssueSeverity,
  RequiredAesthetic,
  Mode,
  TreatmentCategory,
  VitaShade,
  ToothShape,
  ToothMap,
  ToothNumber,
  ToothState,
} from "@/types";

export type RuleCode =
  | "PROSTHETIC_REQUIRED"
  | "WHITENING_ONLY_SHAPE_CONFLICT"
  | "BONDING_SCOPE"
  | "VENEERS_FULL_ARCH_CONFLICT"
  | "IMPLANTS_MISSING_SITES_MISMATCH"
  | "ORTHO_NOT_SELECTED"
  | "GUM_NOT_SELECTED"
  | "MODE_SEVERITY_CONFLICT"
  | "NO_TEETH_SELECTED";
