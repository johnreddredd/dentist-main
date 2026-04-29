/**
 * Checklist Claude applies when visually reviewing first-pass vs original
 * (see `reviewInitialDentalPreview` in `lib/api/claude.ts`).
 * Keep in sync with POST-TREATMENT / ortho language in `templates.ts`.
 */
export const PREVIEW_REALISM_REVIEW_CHECKLIST = `
Clinical realism checklist — verify the AFTER draft mentally against BEFORE, then pick the 3 worst gaps to report as fixes:

1) Post-orthodontic realism — If BEFORE suggests braces/aligners or crowding that should resolve, AFTER should look like believable debond/finish: no brackets, bands, archwires, ligatures, or active aligner trays; not a half-treated arch.

2) Bite and occlusion — Overjet, overbite/open bite, crossbite, or midline shifts visible in BEFORE should move toward a plausible finished occlusion in AFTER if the treatment plan implies orthodontics. Do not render a textbook-perfect bite: allow believable post-orthodontic range, slight residual overlap/asymmetry, and natural lower-incisor visibility consistent with BEFORE — no over-opened or flattened idealization.

3) Arch form and curve — Visible arches should look coordinated (curve of Spee / Wilson plausible); teeth should not look “floating,” twisted independent of neighbors, or staggered without explanation.

4) Contacts and embrasures — No obvious AI gaps/black triangles that would not occur after real finishing; interproximal contacts should look plausible.

5) Gingiva — Papilla heights and zeniths consistent with new tooth positions; no uncanny scalpel-perfect tissue unless clearly an aspirational cosmetic case.

6) Shade and surface texture — For alignment-focused outcomes, teeth should not look like full veneer bleaching unless the plan implies whitening; enamel texture should stay believable. Intrinsic enamel features (white spots, fluorosis, hypocalcification, opacity patterns) must not be smoothed away or “whitened off” unless the plan explicitly includes masking them. Tooth shape lock: do not narrow, lengthen, widen, or symmetrize crowns for beauty; apparent differences from BEFORE should read as alignment/rotation, not sculpting. Incisal edges of anteriors: preserve irregularity, micro-chipping, and asymmetry from BEFORE; ortho must not straighten, flatten, or uniformize those edges.

7) Identity — Same patient as BEFORE; facial and dental proportions age-appropriate; no swapped identity.

8) VALIDATION — Reject an overly perfect draft: uniformly smooth glassy enamel, artificial blanket brightness, uniform gum pink, or textbook occlusion when BEFORE was severe. Prefer improved-but-natural per CASE-SEVERITY ADAPTATION and NON-IDEAL FINISH.
`.trim();
