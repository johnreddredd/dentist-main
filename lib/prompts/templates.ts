import type { Mode } from "@/types";

/**
 * Master prompt sections.
 *
 * These are plain strings / string builders. No HTTP, no Gemini.
 * The prompt constructor (constructor.ts) stitches them together
 * from the engine's TreatmentConstraints + form summary.
 */

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
