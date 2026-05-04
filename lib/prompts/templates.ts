import type { Mode, TreatmentFormData } from "@/types";
import {
  isCeramicRestorationBiteGuidance,
  isCeramicVeneerModerateOrAspirational,
} from "./ceramic-veneer-plan";

/**
 * Master prompt sections.
 *
 * These are plain strings / string builders. No HTTP, no Gemini.
 * The prompt constructor (constructor.ts) stitches them together
 * from the engine's TreatmentConstraints + form summary.
 */

export function postTreatmentOutcomeSection(
  form: Pick<TreatmentFormData, "category" | "material" | "orthoSelected">,
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
      form.orthoSelected ||
      isCeramicRestorationBiteGuidance(form));

  if (biteAndOrthoGuidance) {
    lines.push(
      "  - OCCLUSION / BITE: If BEFORE shows malocclusion visible in the smile — including excessive OVERBITE (deep bite / too much vertical overlap of upper over lower incisors) or UNDERBITE / reverse overjet (lower incisors ahead of or edge-to-edge with uppers, Class III tendency in the smile), plus excessive overjet the other way, anterior crossbite, open bite, edge-to-edge tendency, or clear upper–lower arch mismatch — correct AFTER toward a believable improved relationship. Use orthodontics when selected; when veneers, crowns (full or partial coverage), ceramic units, implants, bridges, or similar are in the plan, plausible improvement may also come from restorative incisal position, crown height, emergence profile, and re-established occlusal stops visible in the photo. Age-appropriate and clinically plausible, not cartoon-idealized.",
      "  - Coordinate visible upper and lower arch relationship where both show: midlines, overbite/overjet, and occlusal plane should read like comprehensive care — including restorative correction of overbite or underbite in the smile — not a single-arch fantasy.",
    );
    if (isCeramicRestorationBiteGuidance(form)) {
      lines.push(
        "  - OCCLUSION REALISM LOCK (VENEERS / CROWNS / CERAMIC — FUNCTIONAL FIRST): No orthognathic surgery or cartoon jaw displacement. Within that limit, you MUST still deliver a clinically believable, functional anterior relationship: visible ~1–2 mm overbite and ~1–2 mm overjet where incisors show, teeth closing without interdental food gaps or interpenetration, and upper–lower curves that work together — including full-coverage crowns, implant crowns, and fixed bridge units in the smile. Minor natural asymmetry is required; leaving the patient visibly edge-to-edge, in anterior crossbite, open-bite when closing, or with a single-arch \"Hollywood\" row while the opposing arch still collides or floats is NOT acceptable.",
        "  - INDIRECT RESTORATIONS & BITE DISPLAY (VENEERS / CROWNS / BRIDGE / IMPLANT CROWNS): For porcelain, zirconia, e.max, PFM-equivalent, or similar — including single crowns, veneer cases, and fixed replacements — use restorative incisal length, axial inclination, contour, and contact placement so the photograph reads as a finished case with a corrected bite display — not just whiter/changed facings or isolated units on a still-broken occlusion. When BEFORE shows deep bite, underbite tendency, or edge-to-edge in the smile, AFTER must move meaningfully toward the functional targets in the BITE / OCCLUSION (MANDATORY) block (still within prosthodontic/restorative range, not skeletal leap).",
      );
    } else {
      lines.push(
        "  - OCCLUSION REALISM LOCK: Improve only into a believable real-world range. Do not create a perfect textbook bite or major surgical jaw advancement/setback. Preserve natural minor asymmetry and allow slight residual overlap where realistic. Lower incisors should stay believable relative to the starting relationship unless a modest shift is clearly indicated by the treatment type — do not over-open, flatten, or idealize the bite.",
      );
    }
  }

  return lines.join("\n");
}

/**
 * Mandatory bite/occlusion checklist for veneers, crowns, ceramic units, and fixed implant/bridge prostheses (not whitening/bonding-only).
 */
export function ceramicVeneerBiteOcclusionMandatorySection(
  form: Pick<TreatmentFormData, "category" | "material">,
): string | null {
  if (!isCeramicRestorationBiteGuidance(form)) return null;
  return [
    "BITE / OCCLUSION (MANDATORY — VENEERS / CROWNS / CERAMIC RESTORATIONS):",
    "",
    "PRIORITY / CONFLICT RESOLUTION:",
    "This section is NON-NEGOTIABLE for any indirect plan in scope: veneers, full/partial crowns, zirconia/e.max/PFM-style ceramics, implant crowns, and fixed bridgework visible in the smile. If any softer wording elsewhere suggests \"minimal bite change\" or \"do not idealize the bite\", it does NOT excuse edge-to-edge incisors, crossbite, open bite on closure, floating contacts, or interpenetrating teeth. You still avoid cartoon jaw surgery — but you MUST fix the bite relationship as below.",
    "",
    "Adjust BOTH upper and lower teeth so they meet in a natural, functional occlusion.",
    "",
    "- Upper incisors must slightly overlap lower incisors (natural overbite ~1–2 mm visually).",
    "- Maintain slight horizontal spacing (overjet ~1–2 mm), not edge-to-edge.",
    "- Teeth must close together naturally with no visible gaps and no collisions.",
    "- Contact points should align consistently across the arch.",
    "- Lower teeth should follow the curvature of the upper arch.",
    "- Midline should be centered or minimally deviated in a natural way.",
    "",
    "HARD INVALIDATION (reject the render if any apply):",
    "- Anterior edge-to-edge or underbite/reverse overjet when a natural overjet is required.",
    "- Open bite appearance between anteriors when the patient is shown with teeth nearly closed.",
    "- Obvious interproximal black triangles or daylight where solid interproximal contact should exist for a finished case.",
    "- Teeth volumes intersecting/colliding or clearly impossible to close.",
    "- Only one arch \"done\" while the opposing arch still contradicts a workable bite (including crown or bridge units that ignore the opposing arch).",
    "",
    "CONSTRAINTS:",
    "- Do not modify teeth in isolation; ensure the entire bite relationship is coherent.",
    "- Do not create floating teeth or overlapping/clipping teeth.",
    "- Avoid perfectly flat or identical alignment; maintain slight natural variation.",
    "",
    "FINAL RULE:",
    "The result must look like a clinically functional bite where the patient can comfortably close their teeth — including crown, bridge, and implant-supported units meeting natural stops.",
  ].join("\n");
}

/** Short recap so the model sees bite rules again after long middle sections. */
export function ceramicVeneerBiteOcclusionRecapSection(
  form: Pick<TreatmentFormData, "category" | "material">,
): string | null {
  if (!isCeramicRestorationBiteGuidance(form)) return null;
  return [
    "BITE RECAP (VENEERS / CROWNS / CERAMICS — REPEAT BEFORE RENDER):",
    "  - Deliver ~1–2 mm overbite and ~1–2 mm overjet on visible anteriors, coherent contacts, lower arch following upper curve, believable midline — full-arch bite coherence for crowns and bridges as well as veneers; no edge-to-edge/open bite/collisions/floating teeth.",
    "  - The detailed checklist and INVALIDATION rules in BITE / OCCLUSION (MANDATORY — VENEERS / CROWNS / CERAMIC RESTORATIONS) above are still binding.",
  ].join("\n");
}

function ceramicRestorationBiteValidationLines(): string[] {
  return [
    "",
    "BITE & OCCLUSION VALIDATION (VENEERS / CROWNS / CERAMICS — HARD GATE):",
    "  - INVALID if the image contradicts the BITE / OCCLUSION (MANDATORY) block: wrong overbite/overjet, edge-to-edge when overlap is required, crossbite, open bite on closure, gaps at contacts, colliding roots/crowns, or single-arch fantasy vs opposing arch — applies equally to full crowns and fixed prostheses.",
    "  - These rules override generic NON-IDEAL FINISH or \"do not idealize the bite\" lines where they would excuse a non-functional occlusion on indirect restorations.",
  ];
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

export function colorAndTextureSection(
  args: {
    shadeRange: string;
    mode: Mode;
  },
  form?: TreatmentFormData,
): string {
  if (form && isCeramicVeneerModerateOrAspirational(form)) {
    const aspirational = args.mode === "aspirational";
    return [
      "COLOR & TEXTURE (CERAMIC / VENEER — MODERATE OR ASPIRATIONAL):",
      `  - Target shade: ${args.shadeRange} — restored surfaces must read in this VITA family (often BL1-class when selected); it must not look like pre-op color showing through.`,
      aspirational
        ? "  - ASPIRATIONAL: clear residual yellow, brown, olive, or grey chroma from the BEFORE on veneered/ceramic units; premium high-value ceramic, more uniform brilliance, minimal but believable gradation (cervical warmth, incisal translucency, slight neighbor steps)."
        : "  - MODERATE: remove obvious pre-op discoloration on those units; refined white ceramic centered on the selected shade with a bit more natural variation tooth-to-tooth than Aspirational.",
      "  - Keep subtle optical variation so the arch is photographic, not flat — but the dominant read is still the chosen shade, not stained natural enamel.",
      "  - Believable ceramic gloss and highlights consistent with the scene lighting.",
    ].join("\n");
  }

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
export function intrinsicEnamelIntegritySection(form?: TreatmentFormData): string {
  if (form && isCeramicVeneerModerateOrAspirational(form)) {
    return [
      "INTRINSIC ENAMEL & SURFACE (CRITICAL — CERAMIC / VENEER — MODERATE OR ASPIRATIONAL):",
      "  - Teeth NOT in the treatment plan: preserve intrinsic enamel character as in the BEFORE (white spots, opacity, etc.) unless another explicit rule applies.",
      "  - Veneered / ceramic-restored teeth (per ALLOWED CHANGES): do NOT carry pre-operative stains, mottling, or yellow–brown body color through the restoration.",
      "  - Render new porcelain/zirconia-style surfaces at the chosen shade; controlled ceramic microtexture and glaze — not a photocopy of defective natural enamel on those units.",
      "  - Prophylaxis / cleaning clauses apply only where that scope is active; they never require retaining chroma from old enamel under planned ceramics.",
    ].join("\n");
  }
  return [
    "INTRINSIC ENAMEL FEATURES (CRITICAL):",
    "  - Do NOT alter, remove, smooth, or reduce any intrinsic enamel features (including white spots, hypocalcification, fluorosis, or opacity patterns).",
    "  - These features must remain identical in shape, size, brightness, and texture.",
    "  - They must move only with the tooth position during alignment and remain visually unchanged.",
    "  - Cleaning may remove surface stains, plaque, and calculus ONLY — it must NOT affect intrinsic enamel features (see ENAMEL DEFECT + CLEANING LOCK when cleaning is in scope).",
  ].join("\n");
}

export function toothShapeLockSection(form?: TreatmentFormData): string {
  if (form && isCeramicVeneerModerateOrAspirational(form)) {
    return [
      "TOOTH SHAPE & CONTOUR (CRITICAL — CERAMIC / VENEER — MODERATE OR ASPIRATIONAL):",
      "  - Untreated natural teeth: preserve outline, width, and length as in the BEFORE.",
      "  - Veneer / ceramic units: design believable new contours — you are not bound to copy pre-op anatomy. Aim for realistic premium-lab proportions with slight asymmetry and neighbor-to-neighbor variation.",
      "  - Avoid identical blocky units or perfectly synchronized geometry; the smile should look human and photographable, not novelty-perfect.",
    ].join("\n");
  }
  return [
    "TOOTH SHAPE LOCK (CRITICAL):",
    "  - Preserve the exact natural tooth anatomy.",
    "  - Do NOT alter tooth shape, edge contours, width, height, or symmetry.",
    "  - Do NOT smooth, refine, or idealize incisal edges.",
    "  - Any apparent change must result only from alignment or positioning — not reshaping.",
  ].join("\n");
}

export function incisalEdgePreservationSection(form?: TreatmentFormData): string {
  if (form && isCeramicVeneerModerateOrAspirational(form)) {
    return [
      "INCISAL CHARACTER (CRITICAL — CERAMIC / VENEER — MODERATE OR ASPIRATIONAL):",
      "  - Untreated anteriors: preserve incisal edge character from the BEFORE.",
      "  - Ceramic / veneer fronts: incisal lines may be re-established for a believable porcelain finish; avoid one perfectly straight ruled line across all units — keep subtle vertical scatter and slight irregularity between neighbors.",
    ].join("\n");
  }
  return [
    "INCISAL EDGE PRESERVATION (CRITICAL):",
    "  - Do NOT alter the shape, smoothness, or uniformity of the incisal edges (bottom edges of the front teeth).",
    "  - Preserve all natural irregularities, chipping, and asymmetry exactly as in the original image.",
    "  - Orthodontic treatment must NOT make edges straighter, flatter, or more uniform.",
    "",
    "INCISAL EDGE NON-UNIFORMITY (CRITICAL):",
    "  - Do NOT align incisal edges into a smooth, continuous, or evenly curved line.",
    "  - Maintain slight vertical variation between adjacent teeth (subtle height differences).",
    "  - Teeth must NOT appear evenly leveled or perfectly spaced along the edge.",
    "  - Even after alignment, preserve micro-asymmetry in edge height and positioning.",
  ].join("\n");
}

/** Severity scaling, non-ideal finish, enamel/gum/occlusion realism, validation gate. */
export function clinicalOutcomeRealismSection(form?: TreatmentFormData): string {
  if (form && isCeramicVeneerModerateOrAspirational(form)) {
    const aspir = form.mode === "aspirational";
    return [
      "CLINICAL OUTCOME REALISM & VALIDATION (CRITICAL — CERAMIC / VENEER — MODERATE OR ASPIRATIONAL):",
      "",
      "SHADE ON RESTORED UNITS:",
      aspir
        ? "  - INVALID if obvious BEFORE yellow, brown, grey, or patchy stain still reads on veneered/ceramic teeth. Aspirational: dominant high-value ceramic aligned to the selected shade (typically BL-class when chosen), with only minimal believable gradation."
        : "  - INVALID if clear pre-op discoloration still dominates restored surfaces. Moderate: centered on the selected VITA with believable ceramic variation — not the old natural chroma.",
      "",
      "SHAPE / FINISH:",
      "  - Avoid textbook-perfect symmetry and identical units; keep subtle human variation.",
      "  - Restored surfaces: believable ceramic polish — not mandatory preservation of pre-op enamel defects on those teeth.",
      "",
      "UNTREATED STRUCTURES:",
      "  - Gingiva, lips, face, and teeth outside the plan follow normal preservation rules unless the identity lock allows change.",
      "",
      "PERCEPTUAL CLEANLINESS:",
      "  - May supplement highlight/shadow clarity only; do not use it as an excuse to leave chroma from the BEFORE on ceramics. The shade shift comes from the restorations themselves.",
      ...ceramicRestorationBiteValidationLines(),
    ].join("\n");
  }
  if (form && isCeramicRestorationBiteGuidance(form)) {
    return [
      "CLINICAL OUTCOME REALISM & VALIDATION (CRITICAL — CERAMIC / VENEER — CONSERVATIVE):",
      "",
      "NON-IDEAL FINISH:",
      "  - Avoid Hollywood-perfect uniformity; keep slight natural variation compatible with conservative mode.",
      "",
      "OCCLUSION ON INDIRECT RESTORATIONS (NOT THE GENERIC ORTHO LINE):",
      "  - A bad bite is INVALID even in conservative mode. You MUST still satisfy the BITE / OCCLUSION (MANDATORY — VENEERS / CROWNS / CERAMIC RESTORATIONS) block and the VENEERS / CROWNS / CERAMIC OCCLUSION REALISM LOCK in POST-TREATMENT OUTCOME.",
      "  - Generic \"OCCLUSION REALISM: do not create a perfect bite\" elsewhere does NOT excuse edge-to-edge, open bite, crossbite, collisions, or floating contacts on crowns, bridges, or veneers.",
      ...ceramicRestorationBiteValidationLines(),
    ].join("\n");
  }
  return [
    "CLINICAL OUTCOME REALISM & VALIDATION (CRITICAL):",
    "",
    "CASE-SEVERITY ADAPTATION:",
    "  - Scale the result to the initial condition. Severe cases must NOT become perfectly aligned. Preserve small residual irregularities (minor rotations, slight asymmetry).",
    "",
    "NON-IDEAL FINISH:",
    "  - Do NOT produce a perfect or textbook smile. The result must look improved, not idealized. Maintain slight natural imperfections (uneven edges, non-uniform alignment). Tooth form and apparent change from ortho follow TOOTH SHAPE LOCK (CRITICAL) above; incisal edges of anterior teeth also follow INCISAL EDGE PRESERVATION (CRITICAL) and INCISAL EDGE NON-UNIFORMITY (CRITICAL) above.",
    "",
    "ENAMEL FEATURE LOCK:",
    "  - Do NOT remove or alter intrinsic enamel features (white spots, opacity, fluorosis, hypomineralization). These must remain identical in shape, position, and intensity.",
    "  - With professional cleaning in scope, do NOT reduce defect visibility, blend defects into surrounding enamel, or homogenize enamel; stains may lift while defects stay unchanged and may look more visible.",
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
    "  - If the result appears overly perfect, uniformly smooth, or artificially brightened in tooth shade or enamel, it is INVALID. Subtle visual-only lighting and contrast that does not remove stains or defects, shift base tooth color, or change uniformity is permitted per PERCEPTUAL CLEANLINESS (VISUAL ONLY).",
  ].join("\n");
}

export const PRESERVE_EXACTLY_BASELINE = [
  "Face, eyes, eyebrows, nose, hair, hairstyle",
  "Skin tone, skin texture, blemishes, scars",
  "Lips (shape and color), expression, smile width",
  "Lighting, shadows, background, clothing",
  "Head pose and camera angle",
];

export function perceptualCleanlinessVisualSection(): string {
  return [
    "PERCEPTUAL CLEANLINESS (VISUAL ONLY — CRITICAL):",
    "  - Enhance the appearance of cleanliness through lighting and contrast only.",
    "  - Slightly increase brightness in enamel highlights and deepen natural shadows near the gumline.",
    "  - Improve clarity and sharpness subtly to simulate professional dental photography.",
    "  - Do NOT remove stains, white spots, or enamel defects.",
    "  - Do NOT change base tooth color or uniformity.",
    "  - Teeth must appear cleaner due to lighting — not due to actual modification.",
    "  - This overrides strict preservation of capture lighting in PRESERVE EXACTLY only as needed for global photograph rendering per above — not facial identity, pose, background content, or dental anatomy.",
  ].join("\n");
}

/**
 * Full constraint when professional cleaning / prophylaxis is in scope (alignment auto-includes this).
 * Supplements identity lock; does not replace TOOTH SHAPE LOCK or intrinsic enamel preservation for internal defects.
 */
export function professionalCleaningConstraintSection(): string {
  return [
    "PROFESSIONAL CLEANING CONSTRAINT (PROPHYLAXIS — CRITICAL; ONLY WHEN CLEANING IS IN SCOPE):",
    "",
    "PRIMARY GOAL:",
    "  - Simulate a realistic post-prophylaxis (dental cleaning) result while preserving the patient's natural tooth shade category and anatomy.",
    "",
    "HARD CONSTRAINTS (NON-NEGOTIABLE):",
    "  - Do NOT change the base tooth color (no whitening effect).",
    "  - Do NOT shift overall shade category (e.g., A3 must remain A3 range).",
    "  - Do NOT alter tooth shape, size, or anatomy.",
    "  - Do NOT create unnaturally uniform or “perfect” coloration.",
    "  - Do NOT remove intrinsic stains (e.g., white spots, enamel defects, internal discoloration).",
    "  - Do NOT brighten the entire tooth globally.",
    "",
    "ENAMEL DEFECT + CLEANING LOCK (CRITICAL):",
    "  - Cleaning may remove surface stains, plaque, and calculus only.",
    "  - White spots, hypomineralization, fluorosis, opacity patches, and enamel defects must remain unchanged.",
    "  - Do NOT reduce defect visibility.",
    "  - Do NOT blend defects into surrounding enamel or “add too much” cleaning to defects.",
    "  - Do NOT smooth defect texture.",
    "  - Do NOT alter defect shape, opacity, or boundaries.",
    "  - Do NOT make enamel more uniform.",
    "  - When surrounding surface stains are removed, enamel defects may become more visible — that is acceptable.",
    "  - Cleaning reveals enamel variation — it does NOT homogenize, whiten, smooth, or improve enamel structure.",
    "",
    "REQUIRED CHANGES (CLEANING EFFECT ONLY):",
    "  - Reduce surface-level staining, especially along the gumline and between teeth.",
    "  - Remove visible plaque/tartar buildup at cervical margins (near gums).",
    "  - Slightly reduce intensity of yellow/orange/brown surface stains ONLY where extrinsic buildup exists.",
    "  - Improve surface smoothness and enamel reflectivity only on sound enamel where extrinsic stain/biofilm was present (subtle prophy polish — clinical, not wax/plastic). Do NOT apply uniform polish that erases defect texture.",
    "  - Increase natural light reflection slightly (teeth appear cleaner, not whiter).",
    "  - Maintain natural translucency and enamel texture; keep subtle surface variation and all defect morphology.",
    "",
    "VISUAL DIRECTION:",
    "  - Teeth should look “cleaner and polished,” not “whiter.”",
    "  - Gumline should appear clearer with less buildup.",
    "  - Interproximal areas should appear less dark/stained, but not artificially bright.",
    "  - Overall result must still clearly resemble the same untreated tooth structure.",
    "",
    "FAIL CONDITIONS (MUST NEVER HAPPEN):",
    "  - Teeth becoming significantly whiter or jumping shade tabs.",
    "  - New stains appearing or existing intrinsic defects becoming darker or erased.",
    "  - Loss of natural enamel texture, defect softening, or over-smoothing / plastic artificial look.",
    "",
    "INTERACTION:",
    "  - Where this block applies, a subtle prophy polish at cervical/interproximal surfaces is allowed even if generic ENAMEL TEXTURE language elsewhere favors maximal preservation — stay within REQUIRED CHANGES and ENAMEL DEFECT + CLEANING LOCK above; never trade defect preservation for a “cleaner” look.",
  ].join("\n");
}

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
    "  - Match framing and resolution of the input photo; apply PERCEPTUAL CLEANLINESS (VISUAL ONLY) above for patient-facing presentation without changing clinical outcome.",
  ].join("\n");
}
