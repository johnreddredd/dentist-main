import type { TreatmentFormData } from "@/types";

/** True when the prophylaxis (cleaning) constraint block applies to the prompt. */
export function isProfessionalCleaningActive(
  form: Pick<TreatmentFormData, "category" | "professionalCleaningSelected">,
): boolean {
  return form.category === "alignment" || !!form.professionalCleaningSelected;
}
