import type { Mode, TreatmentFormData } from "@/types";

/**
 * Master prompt sections.
 *
 * These are plain strings / string builders. No HTTP, no Gemini.
 * The prompt constructor (constructor.ts) stitches them together
 * from the engine's TreatmentConstraints + form summary.
 */

export function postTreatmentOutcomeSection(
  form: Pick<TreatmentFormData, "category" | "orthoSelected">,
): string {
  const lines = [
    "POST-TREATMENT OUTCOME (CRITICAL):",
    "  - Depict the patient AFTER treatment is fully complete—not during active treatment.",
    "  - The image is a finished clinical result; do not show mid-treatment states.",
    "  - Do NOT show fixed orthodontic appliances: no metal/ceramic brackets, archwires, ligatures, powerchains, elastic chains, or similar hardware on the teeth.",
    "  - If the reference photo includes braces or wires, remove them and render a plausible post-debond smile consistent with the treatment plan above.",
    "  - Clear-aligner trays in the mouth should not be visible in the smile (post-treatment smile only).",
  ];

  const biteAndOrthoGuidance =
    form.category !== "whitening" &&
    (form.category === "alignment" ||
      form.category === "makeover" ||
      form.orthoSelected);

  if (biteAndOrthoGuidance) {
    lines.push(
      "  - OCCLUSION / BITE: If BEFORE shows malocclusion visible in the smile (deep bite, excessive overjet, anterior crossbite, open bite, edge-to-edge tendency, or clear upper–lower arch mismatch), correct AFTER toward a believable post-orthodontic relationship—realistic clinical finishing for fixed braces or aligners, age-appropriate, not cartoon-idealized.",
      "  - Coordinate visible upper and lower arch relationship where both show: midlines, overbite/overjet, and occlusal plane should look like plausible comprehensive treatment, not a single-arch fantasy.",
      "  - OCCLUSION REALISM LOCK: Correct overbite/overjet only to a believable post-orthodontic range. Do not create a perfect textbook bite. Preserve natural minor asymmetry and allow slight residual overlap. Lower incisors should remain naturally visible or partially covered based on the original bite. Do not over-open, flatten, or idealize the bite.",
    );
  }

  return lines.join("\n");
}

export function treatmentIdentityLock(args: {
  treatmentType: string;
  allowedChanges: string[];
  forbiddenChanges: string[];
}): string {
  const { treatmentType, allowedChanges, forbiddenChanges } = args;
  return [
    "TREATMENT IDENTITY LOCK:",
    `This image represents ONLY the result of ${treatmentType}.`,
    "",
    "ALLOWED CHANGES:",
    ...allowedChanges.map((c) => `  - ${c}`),
    "",
    "FORBIDDEN CHANGES:",
    ...forbiddenChanges.map((c) => `  - ${c}`),
    "",
    "The result MUST visually reflect only the selected treatment pathway.",
    "Any change outside the ALLOWED set is a clinical error.",
  ].join("\n");
}

export function upperTeethSection(args: {
  treatmentType: string;
  mode: Mode;
  hasUpperTreatment: boolean;
  preservedUpper: boolean;
}): string {
  if (!args.hasUpperTreatment || args.preservedUpper) {
    return "UPPER TEETH:\n  - Preserve exactly as in input photo.";
  }
  return [
    "UPPER TEETH:",
    `  - Apply ${args.treatmentType} per the allowed changes above.`,
    `  - Match the ${args.mode} mode aesthetic described in COLOR & TEXTURE.`,
  ].join("\n");
}

export function lowerTeethSection(args: {
  treatmentType: string;
  mode: Mode;
  hasLowerTreatment: boolean;
  preservedLower: boolean;
}): string {
  if (!args.hasLowerTreatment || args.preservedLower) {
    return "LOWER TEETH:\n  - Preserve exactly as in input photo.";
  }
  return [
    "LOWER TEETH:",
    `  - Apply ${args.treatmentType} per the allowed changes above.`,
    `  - Match the ${args.mode} mode aesthetic described in COLOR & TEXTURE.`,
  ].join("\n");
}

export function gumsSection(gumSurgerySelected: boolean): string {
  return gumSurgerySelected
    ? "GUMS:\n  - Modify gumline per selected gum procedure. Preserve skin tone adjacent to gums."
    : "GUMS:\n  - Preserve exactly. No changes to gingival zenith, gum display, or gumline contour.";
}

export function colorAndTextureSection(args: {
  shadeRange: string;
  mode: Mode;
}): string {
  const modeInstruction: Record<Mode, string> = {
    conservative:
      "Keep minor color variation tooth-to-tooth. Preserve age-appropriate wear and slight asymmetry. Do NOT produce a Hollywood-white result.",
    moderate:
      "Clean natural white with subtle variation. Quality mid-tier restorative aesthetic. Avoid uniform prosthetic look.",
    aspirational:
      "Uniform polished prosthetic. Premium full-arch aesthetic. Bright, even, consistent.",
  };
  return [
    "COLOR & TEXTURE:",
    `  - Target shade: ${args.shadeRange}`,
    `  - ${modeInstruction[args.mode]}`,
  ].join("\n");
}

/** Hypocalcification, fluorosis, etc. — preserve through cleaning, whitening, and ortho. */
export function intrinsicEnamelIntegritySection(): string {
  return [
    "INTRINSIC ENAMEL FEATURES (CRITICAL):",
    "  - Do NOT alter, remove, smooth, or reduce any intrinsic enamel features (including white spots, hypocalcification, fluorosis, or opacity patterns).",
    "  - These features must remain identical in shape, size, brightness, and texture.",
    "  - They must move only with the tooth position during alignment and remain visually unchanged.",
    "  - Cleaning may remove surface stains ONLY — it must NOT affect intrinsic enamel features.",
  ].join("\n");
}

export function incisalEdgePreservationSection(): string {
  return [
    "INCISAL EDGE PRESERVATION (CRITICAL):",
    "  - Do NOT alter the shape, smoothness, or uniformity of the incisal edges (bottom edges of the front teeth).",
    "  - Preserve all natural irregularities, chipping, and asymmetry exactly as in the original image.",
    "  - Orthodontic treatment must NOT make edges straighter, flatter, or more uniform.",
  ].join("\n");
}

/** Severity scaling, non-ideal finish, enamel/gum/occlusion realism, validation gate. */
export function clinicalOutcomeRealismSection(): string {
  return [
    "CLINICAL OUTCOME REALISM & VALIDATION (CRITICAL):",
    "",
    "CASE-SEVERITY ADAPTATION:",
    "  - Scale the result to the initial condition. Severe cases must NOT become perfectly aligned. Preserve small residual irregularities (minor rotations, slight asymmetry).",
    "",
    "NON-IDEAL FINISH:",
    "  - Do NOT produce a perfect or textbook smile. The result must look improved, not idealized. Maintain slight natural imperfections (uneven edges, non-uniform alignment). Incisal edges of anterior teeth follow INCISAL EDGE PRESERVATION (CRITICAL) above.",
    "",
    "ENAMEL FEATURE LOCK:",
    "  - Do NOT remove or alter intrinsic enamel features (white spots, opacity, fluorosis). These must remain identical in shape, position, and intensity.",
    "",
    "ENAMEL TEXTURE:",
    "  - Preserve natural enamel texture (ridges, surface variation). Do NOT smooth or polish teeth.",
    "",
    "SHADE CONSERVATION:",
    "  - Cleaning removes surface stains ONLY. Do NOT whiten or globally brighten enamel. Maintain natural color variation, especially near the gumline.",
    "",
    "GUM REALISM:",
    "  - Preserve natural gum variation (tone, slight redness, uneven contour). Do NOT normalize gums to uniform pink.",
    "",
    "OCCLUSION REALISM:",
    "  - Improve bite to a natural functional range only. Maintain slight overlap and asymmetry. Do NOT create a perfect or textbook bite.",
    "",
    "VALIDATION RULE:",
    "  - If the result appears overly perfect, uniformly smooth, or artificially brightened, it is INVALID.",
  ].join("\n");
}

export const PRESERVE_EXACTLY_BASELINE = [
  "Face, eyes, eyebrows, nose, hair, hairstyle",
  "Skin tone, skin texture, blemishes, scars",
  "Lips (shape and color), expression, smile width",
  "Lighting, shadows, background, clothing",
  "Head pose and camera angle",
];

export function preserveExactlySection(extra: string[] = []): string {
  const items = [...PRESERVE_EXACTLY_BASELINE, ...extra];
  return ["PRESERVE EXACTLY:", ...items.map((i) => `  - ${i}`)].join("\n");
}

export function avoidSection(mode: Mode, forbiddenChanges: string[]): string {
  const modeAvoid: Record<Mode, string[]> = {
    conservative: [
      "Hollywood-white / BL1-type brightness",
      "Uniform prosthetic appearance on natural teeth",
      "Removing age-appropriate minor imperfections",
    ],
    moderate: [
      "Obvious prosthetic uniformity",
      "Over-whitening beyond the target shade",
    ],
    aspirational: [
      "Visible natural imperfections",
      "Color variation that reads as natural decay",
    ],
  };
  const items = [...modeAvoid[mode], ...forbiddenChanges];
  return ["AVOID:", ...items.map((i) => `  - ${i}`)].join("\n");
}

export function outputSection(treatmentType: string): string {
  return [
    "OUTPUT:",
    "  - Photorealistic clinical outcome photograph.",
    `  - A dentist should recognize this as a plausible ${treatmentType} outcome.`,
    "  - Match framing, resolution, and exposure of the input photo.",
  ].join("\n");
}
