/**
 * Always appended to dentist-note → image edit instructions for Gemini.
 * Keeps edits minimal: only named aspects change; everything else stays on the preview.
 */
export const GEMINI_EDIT_SCOPE_LOCK = [
  "SCOPE LOCK — Change ONLY what the dentist’s instruction above explicitly calls out.",
  "Preserve everything else from the first (preview) image as closely as the edit allows:",
  "if global lighting, shadows, exposure, white balance, specular highlights, or room/ambient color cast is not mentioned, keep the preview’s lighting and atmosphere unchanged—no relighting, no “studio polish”;",
  "preserve face shape, skin, eyes, brows, nose, ears, hair, neck, clothing, and background; do not beautify, de-age, or reshape anatomy that is not about teeth or gingiva;",
  "if tooth color, shade, chroma, or per-tooth brightness is not mentioned, do not change tooth color;",
  "if surface texture, enamel character, luster, gloss, or translucency is not mentioned, preserve them;",
  "if incisal edge shape, chipping, or irregularity of the front teeth is not mentioned, preserve them exactly as in the source—orthodontics must not straighten or flatten edges;",
  "if a specific tooth’s shape, length, width, thickness, or incisal edge is not mentioned, leave that tooth as in the preview;",
  "if gum line, gingiva, interdental papilla, or gum color is not mentioned, preserve gums;",
  "if spacing, alignment, crowding, or rotation is not mentioned, preserve arch form;",
  "if cleaning or stain removal is not mentioned, do not globally brighten enamel or remove natural shade variation near the gumline;",
  "if gum surgery is not mentioned, preserve natural gingival variation in tone and contour—no uniform Barbie pink;",
  "unless the instruction explicitly seeks bite idealization, keep occlusion plausible — believable post-orthodontic range, not textbook-perfect zero-overjet or over-open bite;",
  "if intrinsic enamel features (white spots, hypocalcification, fluorosis, opacity patterns) are not mentioned, preserve them exactly — no smoothing or removal; cleaning instructions may target extrinsic stain only;",
  "do not improve, idealize, or “beautify” aspects the dentist did not name—no unsolicited global touch-ups.",
].join(" ");
