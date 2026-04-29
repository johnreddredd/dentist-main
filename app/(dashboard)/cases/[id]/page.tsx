"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CasePreviewHero, type PreviewViewMode } from "@/components/case/CasePreviewHero";
import { CasePreviewDecision } from "@/components/case/CasePreviewDecision";
import { CaseTrustPanel } from "@/components/case/CaseTrustPanel";
import { CaseDecisionActions } from "@/components/case/CaseDecisionActions";
import { CasePatientShareCard } from "@/components/case/CasePatientShareCard";
import {
  appendRefinedGeneration,
  createInitialGeneration,
  ensurePreviewGenerations,
} from "@/lib/cases/preview-history";
import { ReviewPreviewVersions } from "@/components/review/review-preview-versions";
import { ReviewRefinePanel } from "@/components/review/review-refine-panel";
import { useCasesStore, waitForCasesPersistWrites } from "@/lib/stores/cases";
import type { GenerateResponse } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CaseDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const caseData = useCasesStore((s) => s.cases.find((c) => c.id === id));
  const updateCase = useCasesStore((s) => s.updateCase);

  const [regenerating, setRegenerating] = React.useState(false);
  const [refineBusy, setRefineBusy] = React.useState(false);
  const [approving, setApproving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<PreviewViewMode>("split");
  const [adjustOpen, setAdjustOpen] = React.useState(false);
  const [refineBaseId, setRefineBaseId] = React.useState("");

  const { generations: gens, selectedId: selId } = React.useMemo(() => {
    if (!caseData) {
      return { generations: [], selectedId: "" } as ReturnType<
        typeof ensurePreviewGenerations
      >;
    }
    return ensurePreviewGenerations(caseData);
  }, [caseData]);

  React.useEffect(() => {
    if (!caseData) return;
    if (!refineBaseId && gens.length) {
      setRefineBaseId(selId);
      return;
    }
    if (refineBaseId && !gens.some((g) => g.id === refineBaseId)) {
      setRefineBaseId(selId);
    }
  }, [caseData, gens, refineBaseId, selId]);

  const selectedGen = gens.find((g) => g.id === selId);
  const generatedUrl =
    (caseData &&
      (selectedGen?.imageUrl ??
        caseData.generatedImageUrl ??
        caseData.originalPhotoUrl)) ??
    "";
  const refineBase = refineBaseId || selId;

  const onSelectVersion = React.useCallback(
    (genId: string) => {
      if (!caseData) return;
      const g = gens.find((x) => x.id === genId);
      if (!g) return;
      const { generations: fullList } = ensurePreviewGenerations(caseData);
      updateCase(caseData.id, {
        previewGenerations: fullList,
        selectedGenerationId: genId,
        generatedImageUrl: g.imageUrl,
      });
      setRefineBaseId(genId);
    },
    [caseData, gens, updateCase],
  );

  const onRefinedFromNote = React.useCallback(
    async (url: string, note: string) => {
      if (!caseData) return;
      const { generations: list } = ensurePreviewGenerations(caseData);
      const { list: next, newGen } = appendRefinedGeneration(list, url, note);
      updateCase(caseData.id, {
        previewGenerations: next,
        selectedGenerationId: newGen.id,
        generatedImageUrl: newGen.imageUrl,
      });
      await waitForCasesPersistWrites();
      requestAnimationFrame(() => setRefineBaseId(newGen.id));
    },
    [caseData, updateCase],
  );

  async function onRegenerate() {
    if (!caseData) return;
    setRegenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form: caseData.treatmentData }),
      });
      if (!res.ok) throw new Error((await res.json())?.error ?? "Failed");
      const data = (await res.json()) as GenerateResponse;
      const regenGen = createInitialGeneration(
        caseData.id,
        data.generatedImageUrl,
        new Date().toISOString(),
        `regen-${Date.now()}`,
      );
      updateCase(caseData.id, {
        generatedImageUrl: data.generatedImageUrl,
        previewGenerations: [regenGen],
        selectedGenerationId: regenGen.id,
        aiReviewerBullets: data.reviewerBullets,
        constraints: data.constraints,
        assumption: data.assumption,
      });
      await waitForCasesPersistWrites();
      setRefineBaseId(regenGen.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setRegenerating(false);
    }
  }

  function onApprove() {
    if (!caseData) return;
    setApproving(true);
    updateCase(caseData.id, { approved: true });
    window.setTimeout(() => setApproving(false), 450);
  }

  function onAdjustRegenerate() {
    setAdjustOpen((o) => !o);
  }

  if (!caseData) {
    return (
      <div className="mx-auto max-w-lg">
        <Card className="border-[#E7E5E4] shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#0F172A]">
              Case not found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#64748B]">
              This case may have been deleted, or is stored on another device.
            </p>
            <Link
              href="/cases"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-xl border border-[#E7E5E4] bg-white px-4 text-sm font-semibold text-[#0F172A] shadow-sm transition-colors hover:bg-[#FAFAF9]"
            >
              Back to Case Library
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const caseRow = caseData;
  const originalUrl = caseRow.originalPhotoUrl;

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start lg:gap-8 xl:gap-10">
        <div className="flex min-w-0 flex-col gap-7">
          <CasePreviewHero
            beforeSrc={originalUrl}
            afterSrc={generatedUrl}
            loading={regenerating || refineBusy}
            mode={viewMode}
            onModeChange={setViewMode}
            caseId={caseRow.id}
          />

          <CasePreviewDecision
            approved={caseRow.approved}
            approving={approving}
            regenerating={regenerating || refineBusy}
            onApprove={onApprove}
          />

          <CaseDecisionActions
            approved={caseRow.approved}
            regenerating={regenerating || refineBusy}
            adjustPanelOpen={adjustOpen}
            onRegenerate={onRegenerate}
            onAdjustRegenerate={onAdjustRegenerate}
          />

          {adjustOpen && !caseRow.approved && gens.length > 0 ? (
            <div className="space-y-4 rounded-2xl border border-[#E7E5E4] bg-[#FAFAF9]/80 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">
                    Adjust &amp; regenerate from your note
                  </h3>
                  <p className="mt-0.5 max-w-xl text-xs text-[#64748B]">
                    Describe the change in the box below. Your text is turned
                    into a precise image instruction, then a new preview is
                    generated—same flow as on the review page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAdjustOpen(false)}
                  className="shrink-0 text-xs font-medium text-[#0F766E] hover:underline"
                >
                  Close
                </button>
              </div>
              {gens.length > 1 ? (
                <ReviewPreviewVersions
                  generations={gens}
                  selectedId={selId}
                  onSelectId={onSelectVersion}
                />
              ) : null}
              <ReviewRefinePanel
                notesFieldId="case-adjust-refine-notes"
                originalPhotoUrl={originalUrl}
                generations={gens}
                refineBaseId={refineBase}
                onRefineBaseIdChange={setRefineBaseId}
                onRefined={onRefinedFromNote}
                onBusyChange={setRefineBusy}
              />
            </div>
          ) : null}

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-800">
              {error}
            </p>
          ) : null}
        </div>

        <CaseTrustPanel
          caseData={caseRow}
          patientAccepted={caseRow.patientAccepted}
          onPatientOutcome={(v) =>
            updateCase(caseRow.id, { patientAccepted: v })
          }
        />
      </div>

      <CasePatientShareCard caseId={caseRow.id} className="mt-8 lg:mt-10" />
    </div>
  );
}
