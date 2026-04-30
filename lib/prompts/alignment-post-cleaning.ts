/**
 * Second-pass edit for **alignment** cases only: professional cleaning simulation
 * on the post-orthodontic preview (not on the raw before photo).
 */
export const ALIGNMENT_PROFESSIONAL_CLEANING_EDIT_PROMPT = `PROFESSIONAL DENTAL CLEANING (SCALING + POLISH) — STRICT REALISM

GOAL:
Simulate a real post-cleaning result after orthodontic treatment, preserving full biological and visual realism.

ALLOWED CHANGES (SUBTLE ONLY):
- Remove plaque and tartar buildup, especially near the gumline
- Reduce extrinsic (surface) stains slightly (coffee, tea, smoking)
- Apply a very light natural polish effect (minimal increase in reflectivity)

STRICT CONSTRAINTS (NON-NEGOTIABLE):
- DO NOT whiten teeth or change intrinsic tooth color
- DO NOT brighten the overall shade of the teeth
- DO NOT make tooth color uniform — preserve natural variation across and within teeth
- DO NOT remove or reduce intrinsic discoloration (e.g., white spots, yellow patches, enamel defects)
- DO NOT smooth enamel texture — preserve natural ridges, translucency, and micro-variation
- DO NOT alter tooth shape, size, or edges
- DO NOT change tooth anatomy in any way

COLOR RULE:
- Any color change must be minimal and limited to surface stain removal only
- Underlying yellow tone and dentin influence must remain visible

INTENSITY LIMIT:
- Cleaning effect should be subtle (5–10% visual change max)
- Result should look like the same teeth, just slightly cleaner — not cosmetically improved

REALISM CHECK:
- Output must resemble a typical dental cleaning result, not whitening or cosmetic treatment`;
