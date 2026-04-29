/** Mock clinic contact for `/preview/[id]` share links until real office data is wired. */
export const PATIENT_PREVIEW_MOCK_CONTACT = {
  phoneDisplay: "(555) 201-4422",
  /** E.164-style for `tel:` — no spaces. */
  phoneTel: "+15552014422",
  email: "care@oaklanedental.example",
} as const;

/** Fixed patient-facing reassurance lines — no clinical jargon. */
export const PATIENT_WHAT_LOOKS_GOOD = [
  "Based on your actual teeth",
  "Your natural color is preserved",
  "Your facial features are unchanged",
  "Designed from your dentist's treatment plan",
] as const;
