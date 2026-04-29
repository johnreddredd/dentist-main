import type {
  PromptOutput,
  TreatmentConstraints,
  TreatmentFormData,
} from "@/types";
import {
  avoidSection,
  clinicalOutcomeRealismSection,
  colorAndTextureSection,
  gumsSection,
  incisalEdgePreservationSection,
  intrinsicEnamelIntegritySection,
  lowerTeethSection,
  outputSection,
  perceptualCleanlinessVisualSection,
  postTreatmentOutcomeSection,
  preserveExactlySection,
  toothShapeLockSection,
  treatmentIdentityLock,
  upperTeethSection,
} from "./templates";
import { LOWER_TEETH, UPPER_TEETH } from "../constraints/constants";

/**
 * Build the master prompt from the engine's TreatmentConstraints + form.
 *
 * This module is pure. Do NOT call Gemini / Claude here.
 * Same input => same output; regeneration does NOT change the prompt
 * (that is by design — regen asks the image model for a different draw
 *  of the same constraints).
 */
export function buildPrompt(
  form: TreatmentFormData,
  constraints: TreatmentConstraints,
): PromptOutput {
  const treatedUpper = hasTreatment(form, UPPER_TEETH);
  const treatedLower = hasTreatment(form, LOWER_TEETH);

  const identityLock = treatmentIdentityLock({
    treatmentType: constraints.treatmentType,
    allowedChanges: constraints.allowedChanges,
    forbiddenChanges: constraints.forbiddenChanges,
  });

  const prompt = [
    `${constraints.treatmentType.toUpperCase()} — TREATMENT OUTCOME DOCUMENTATION`,
    "",
    "Subject: clinical outcome photograph of the same patient in the input image, post-treatment.",
    "",
    postTreatmentOutcomeSection(form),
    "",
    "TREATMENT REPRESENTED:",
    `  - ${constraints.treatmentType}`,
    `  - Shade target: ${constraints.shadeRange}`,
    `  - Required aesthetic: ${constraints.requiredAesthetic}`,
    "",
    identityLock,
    "",
    upperTeethSection({
      treatmentType: constraints.treatmentType,
      mode: form.mode,
      hasUpperTreatment: treatedUpper,
      preservedUpper: !treatedUpper,
    }),
    "",
    lowerTeethSection({
      treatmentType: constraints.treatmentType,
      mode: form.mode,
      hasLowerTreatment: treatedLower,
      preservedLower: !treatedLower,
    }),
    "",
    gumsSection(form.gumSurgerySelected),
    "",
    colorAndTextureSection({
      shadeRange: constraints.shadeRange,
      mode: form.mode,
    }),
    "",
    intrinsicEnamelIntegritySection(),
    "",
    toothShapeLockSection(),
    "",
    incisalEdgePreservationSection(),
    "",
    clinicalOutcomeRealismSection(),
    "",
    preserveExactlySection(constraints.preservationRules),
    "",
    avoidSection(form.mode, constraints.forbiddenChanges),
    "",
    perceptualCleanlinessVisualSection(),
    "",
    outputSection(constraints.treatmentType),
  ].join("\n");

  return { prompt, identityLock };
}

function hasTreatment(
  form: TreatmentFormData,
  archTeeth: readonly number[],
): boolean {
  for (const t of archTeeth) {
    const state = form.teeth[t as keyof typeof form.teeth];
    if (state === "treatment" || state === "missing" || state === "destroyed") {
      return true;
    }
  }
  return false;
}
