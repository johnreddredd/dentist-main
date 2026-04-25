/**
 * Public surface of the constraint engine.
 *
 * Callers should import ONLY from this file. Rule modules and internal
 * helpers are implementation details.
 */
export { evaluateTreatmentConstraints } from "./engine";
export type {
  TreatmentConstraints,
  EngineResult,
  Issue,
  IssueSeverity,
  RequiredAesthetic,
} from "@/types";
