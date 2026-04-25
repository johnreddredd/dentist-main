import type {
  EngineResult,
  Issue,
  TreatmentConstraints,
  TreatmentFormData,
} from "@/types";
import { evaluateToothState } from "./rules/toothState";
import { evaluateTreatmentModality } from "./rules/treatmentModality";
import { evaluateAncillaryProcedures } from "./rules/ancillaryProcedures";
import { evaluateModeAesthetic } from "./rules/modeAesthetic";

/**
 * MERGE ORDER (documented per constraint-engine-cursor.md §3):
 *
 *   1. toothState          — drives prosthetic gate, marks healthy teeth.
 *   2. treatmentModality   — caps what the category / material can do.
 *   3. ancillaryProcedures — adds hard forbids for ortho / gum / arch if off.
 *   4. modeAesthetic       — mode-level caps on shade + imperfection language.
 *
 * Each step MAY narrow or append to allowedChanges / forbiddenChanges /
 * preservationRules. The last step that writes `requiredAesthetic` /
 * `shadeRange` wins, and we document that here:
 *
 *   - `requiredAesthetic`: set by toothState (natural vs prosthetic). Mode
 *     never downgrades to "natural" — if tooth state forced prosthetic,
 *     we stay prosthetic.
 *   - `shadeRange`: modeAesthetic owns this. Mode caps the user shade.
 *
 * Interaction matrix cases handled explicitly:
 *
 *   - Missing anywhere + cosmetic-only path  -> requiredAesthetic forced to
 *     prosthetic; natural-teeth language stripped from allowed.
 *   - Whitening + shape change in form       -> modality forbids shape.
 *   - Veneers + not full arch                -> scope capped to selected.
 *   - Implants + replace only selected       -> others in preservationRules.
 *   - No ortho                               -> alignment in forbidden.
 *   - No gum surgery                         -> gumline in forbidden.
 *   - Mode conservative + severe damage      -> budget prosthetic outcome.
 */
export function evaluateTreatmentConstraints(
  form: TreatmentFormData,
): EngineResult {
  const issues: Issue[] = [];

  // Step 1 — tooth state.
  const tooth = evaluateToothState(form.teeth);
  issues.push(...tooth.issues);

  // Step 2 — treatment modality.
  const modality = evaluateTreatmentModality(form, tooth.flags.treatmentTeeth);
  issues.push(...modality.issues);

  // Step 3 — ancillary procedures.
  const ancillary = evaluateAncillaryProcedures(form);
  issues.push(...ancillary.issues);

  // Step 4 — mode aesthetic.
  const mode = evaluateModeAesthetic(
    form,
    tooth.flags.missingOrDestroyed.length,
  );
  issues.push(...mode.issues);

  // ---- Merge ----
  const constraints: TreatmentConstraints = {
    treatmentType: buildTreatmentTypeString(form, tooth.flags.treatmentTeeth),
    allowedChanges: dedupe([
      ...(tooth.partial.allowedChanges ?? []),
      ...(modality.partial.allowedChanges ?? []),
      ...(ancillary.partial.allowedChanges ?? []),
      ...(mode.partial.allowedChanges ?? []),
    ]),
    forbiddenChanges: dedupe([
      ...(tooth.partial.forbiddenChanges ?? []),
      ...(modality.partial.forbiddenChanges ?? []),
      ...(ancillary.partial.forbiddenChanges ?? []),
      ...(mode.partial.forbiddenChanges ?? []),
    ]),
    preservationRules: dedupe([
      ...(tooth.partial.preservationRules ?? []),
      ...(modality.partial.preservationRules ?? []),
      ...(ancillary.partial.preservationRules ?? []),
      ...(mode.partial.preservationRules ?? []),
    ]),
    // toothState owns requiredAesthetic; don't downgrade prosthetic.
    requiredAesthetic:
      tooth.partial.requiredAesthetic ??
      modality.partial.requiredAesthetic ??
      "natural",
    // mode owns shadeRange (last writer wins).
    shadeRange: mode.partial.shadeRange ?? `VITA ${form.shade}`,
  };

  // Interaction fix-up — whitening-only must never allow shape edits,
  // even if an earlier rule slipped one in.
  if (modality.flags.whiteningOnly) {
    constraints.allowedChanges = constraints.allowedChanges.filter(
      (c) => !/shape|align|arch/i.test(c),
    );
  }

  return {
    constraints,
    flags: {
      requiresProsthetic: constraints.requiredAesthetic === "prosthetic",
      whiteningOnly: modality.flags.whiteningOnly,
      aspirational: mode.flags.aspirational,
    },
    issues,
  };
}

function buildTreatmentTypeString(
  form: TreatmentFormData,
  treatmentTeeth: number[],
): string {
  const parts: string[] = [];
  if (form.category) parts.push(cap(form.category));
  if (form.material) parts.push(form.material);
  if (treatmentTeeth.length > 0) {
    parts.push(`on ${treatmentTeeth.length} tooth${treatmentTeeth.length === 1 ? "" : "s"}`);
  } else if (form.category === "whitening") {
    parts.push("full arch");
  }
  parts.push(`(${cap(form.mode)} mode)`);
  return parts.join(" — ");
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
