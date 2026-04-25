import type {
  Issue,
  ToothMap,
  ToothNumber,
  TreatmentConstraints,
} from "@/types";

export interface ToothStateResult {
  partial: Partial<TreatmentConstraints>;
  issues: Issue[];
  flags: {
    missingOrDestroyed: ToothNumber[];
    treatmentTeeth: ToothNumber[];
    healthyTeeth: ToothNumber[];
  };
}

/**
 * RULE FAMILY 1 — tooth state gate.
 *
 * - MISSING / DESTROYED teeth force a prosthetic aesthetic and forbid
 *   "natural teeth in edentulous sites" (rule 1 from spec).
 * - HEALTHY teeth are added to preservationRules.
 * - TREATMENT-tagged teeth are eligible for alteration (scope set by
 *   later rules).
 */
export function evaluateToothState(teeth: ToothMap): ToothStateResult {
  const entries = Object.entries(teeth) as [string, ToothMap[ToothNumber]][];

  const missingOrDestroyed: ToothNumber[] = [];
  const treatmentTeeth: ToothNumber[] = [];
  const healthyTeeth: ToothNumber[] = [];

  for (const [key, state] of entries) {
    const n = Number(key) as ToothNumber;
    if (state === "missing" || state === "destroyed") missingOrDestroyed.push(n);
    else if (state === "treatment") treatmentTeeth.push(n);
    else if (state === "healthy") healthyTeeth.push(n);
  }

  const allowedChanges: string[] = [];
  const forbiddenChanges: string[] = [];
  const preservationRules: string[] = [];
  const issues: Issue[] = [];

  if (missingOrDestroyed.length > 0) {
    allowedChanges.push(
      `Prosthetic restoration of teeth ${fmt(missingOrDestroyed)}`,
    );
    forbiddenChanges.push(
      "Natural teeth appearing in edentulous (missing-tooth) sites",
    );
    forbiddenChanges.push(
      "Regrowing or regenerating natural tooth structure",
    );
  }

  if (healthyTeeth.length > 0) {
    preservationRules.push(
      `Healthy teeth ${fmt(healthyTeeth)} remain completely unchanged`,
    );
  }

  if (entries.length === 0) {
    issues.push({
      severity: "warning",
      code: "NO_TEETH_SELECTED",
      message:
        "No teeth selected. The preview will be constrained to color-only changes.",
    });
  }

  const requiredAesthetic =
    missingOrDestroyed.length > 0 ? ("prosthetic" as const) : ("natural" as const);

  return {
    partial: {
      allowedChanges,
      forbiddenChanges,
      preservationRules,
      requiredAesthetic,
    },
    issues,
    flags: { missingOrDestroyed, treatmentTeeth, healthyTeeth },
  };
}

function fmt(ns: ToothNumber[]): string {
  if (ns.length === 0) return "(none)";
  return `#${ns.join(", #")}`;
}
