import type { Case, PreviewGeneration } from "@/types";

export function createInitialGeneration(
  caseId: string,
  imageUrl: string,
  createdAt: string,
  idSuffix = "v0",
  label = "Smile preview",
): PreviewGeneration {
  return {
    id: `${caseId}-${idSuffix}`,
    imageUrl,
    createdAt,
    label,
  };
}

/** Normalize stored case into generation list + which one is active. */
export function ensurePreviewGenerations(c: Case): {
  generations: PreviewGeneration[];
  selectedId: string;
} {
  const url = c.generatedImageUrl;
  if (c.previewGenerations && c.previewGenerations.length > 0) {
    const list = c.previewGenerations;
    const selectedId =
      c.selectedGenerationId &&
      list.some((g) => g.id === c.selectedGenerationId)
        ? c.selectedGenerationId
        : list[list.length - 1].id;
    return { generations: list, selectedId };
  }
  if (url) {
    const g = createInitialGeneration(c.id, url, c.createdAt);
    return { generations: [g], selectedId: g.id };
  }
  return { generations: [], selectedId: "" };
}

export function appendRefinedGeneration(
  generations: PreviewGeneration[],
  imageUrl: string,
  note: string,
): { list: PreviewGeneration[]; newGen: PreviewGeneration } {
  const n = generations.length;
  const newGen: PreviewGeneration = {
    id: crypto.randomUUID(),
    imageUrl,
    createdAt: new Date().toISOString(),
    label: n === 0 ? "Initial preview" : `Version ${n + 1}`,
    dentistNote: note.trim() || undefined,
  };
  return { list: [...generations, newGen], newGen };
}
