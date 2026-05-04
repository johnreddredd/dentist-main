import type { TreatmentFormData } from "@/types";

type CeramicPick = Pick<TreatmentFormData, "category" | "material">;

/**
 * Veneers, crowns (any tooth-borne crown in dropdown), zirconia/e.max, and fixed replacements
 * where crown-shaped units need coherent occlusion (implant, bridge, All-on-X). Not composite bonding alone.
 */
export function matchesCeramicRestorationSurface(form: CeramicPick): boolean {
  const m = form.material?.toLowerCase() ?? "";
  const cat = form.category;

  if (!cat || cat === "whitening") return false;

  const indirectAnteriorPosterior =
    m.includes("veneer") ||
    m.includes("crown") ||
    m.includes("e.max") ||
    m.includes("emax") ||
    m.includes("zirconia") ||
    m.includes("pfm") ||
    m.includes("porcelain-fused");

  const fixedReplacementProsthesis =
    m.includes("implant") ||
    m.includes("bridge") ||
    m.includes("all-on-4") ||
    m.includes("all-on-6") ||
    m.includes("all on 4") ||
    m.includes("all on 6");

  if (cat === "cosmetic") {
    if (m.includes("bonding")) return false;
    return indirectAnteriorPosterior;
  }

  if (cat === "restorative") {
    return (
      m.includes("crown") ||
      m.includes("zirconia") ||
      m.includes("e.max") ||
      m.includes("emax")
    );
  }

  if (cat === "replacement") {
    return fixedReplacementProsthesis;
  }

  if (cat === "makeover") {
    return (
      m.includes("combined") ||
      m.includes("treatment plan") ||
      indirectAnteriorPosterior ||
      fixedReplacementProsthesis
    );
  }

  return false;
}

/** Bite/occlusion prompt block applies (all modes), alongside ortho/alignment paths. */
export function isCeramicRestorationBiteGuidance(form: CeramicPick): boolean {
  if (form.category === "whitening") return false;
  return matchesCeramicRestorationSurface(form);
}

/**
 * Veneers / ceramic crowns — Moderate or Aspirational shade & surface rules only.
 * Conservative keeps generic color/shape rules; bite guidance still applies via
 * {@link isCeramicRestorationBiteGuidance}.
 */
export function isCeramicVeneerModerateOrAspirational(
  form: TreatmentFormData,
): boolean {
  if (form.mode !== "moderate" && form.mode !== "aspirational") return false;
  return matchesCeramicRestorationSurface(form);
}
