import type { Mode, ToothNumber, VitaShade } from "@/types";

export const TOOTH_NUMBERS: readonly ToothNumber[] = Array.from(
  { length: 32 },
  (_, i) => (i + 1) as ToothNumber,
);

// Upper arch = 1-16, Lower arch = 17-32 (Universal numbering)
export const UPPER_TEETH: readonly ToothNumber[] = TOOTH_NUMBERS.slice(0, 16);
export const LOWER_TEETH: readonly ToothNumber[] = TOOTH_NUMBERS.slice(16, 32);

// Anterior (visible) teeth: 6-11 upper, 22-27 lower
export const ANTERIOR_TEETH: readonly ToothNumber[] = [
  6, 7, 8, 9, 10, 11, 22, 23, 24, 25, 26, 27,
] as ToothNumber[];

// Shade ordering from lightest to darkest (for clamp logic).
export const SHADE_ORDER: readonly VitaShade[] = [
  "BL1",
  "BL2",
  "BL3",
  "B1",
  "A1",
  "A2",
  "B2",
  "A3",
  "A3.5",
  "A4",
];

// Max allowable shade per mode (darker is more natural / more conservative).
export const MODE_SHADE_CAP: Record<Mode, VitaShade> = {
  conservative: "A3",
  moderate: "A2",
  aspirational: "BL1",
};

// Severity threshold: if more than this many teeth are missing/destroyed
// AND the user picked conservative mode, we force a prosthetic aesthetic
// (you can't realistically regrow that many teeth).
export const SEVERE_DAMAGE_THRESHOLD = 4;

// Regenerate => same engine output => same prompt path. No silent drift.
export const MODEL_VERSION = "smileai-engine-0.1.0";
