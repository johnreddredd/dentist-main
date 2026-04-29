"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PatientSmileExperience } from "@/components/patient-preview/PatientSmileExperience";
import {
  appendRefinedGeneration,
  createInitialGeneration,
  ensurePreviewGenerations,
} from "@/lib/cases/preview-history";
import {
  REVIEW_CHECKLIST_LENGTH,
  ReviewChecklist,
} from "@/components/review/review-checklist";
import { ReviewRefinePanel } from "@/components/review/review-refine-panel";
import { ReviewPreviewVersions } from "@/components/review/review-preview-versions";
import { ReviewStickyActions } from "@/components/review/review-sticky-actions";
import { ReviewSuccessState } from "@/components/review/review-success-state";
import { ReviewTopBar } from "@/components/review/review-top-bar";
import { previewLinkDisplayPath } from "@/lib/public-app-url";
import { useCasesStore, waitForCasesPersistWrites } from "@/lib/stores/cases";
import { useGenerateForm } from "@/lib/stores/generate-form";
import { downloadImageFromUrl } from "@/lib/download-image";
import type { Case, PreviewGeneration } from "@/types";

const MOCK_BEFORE =
  "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1200&h=900&fit=crop&crop=faces";
const MOCK_AFTER =
  "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&h=900&fit=crop&crop=faces";

interface PageProps {
  params: Promise<{ id: string }>;
}

type DemoPreviewState = {
  generations: PreviewGeneration[];
  selectedId: string;
};

export default function CaseReviewPage(props: PageProps) {
  const params = React.use(props.params);
  const { id } = params;
  const router = useRouter();
  const caseData = useCasesStore((s) => s.cases.find((c) => c.id === id));
  const updateCase = useCasesStore((s) => s.updateCase);

  const [checklist, setChecklist] = React.useState<boolean[]>(() =>
    Array.from({ length: REVIEW_CHECKLIST_LENGTH }, () => false),
  );
  const [refineBusy, setRefineBusy] = React.useState(false);
  const [demoApproved, setDemoApproved] = React.useState(false);
  const [demoPreview, setDemoPreview] = React.useState<DemoPreviewState | null>(
    null,
  );
  const [refineBaseId, setRefineBaseId] = React.useState<string>("");

  const demoSeed = React.useMemo<DemoPreviewState>(() => {
    const g = createInitialGeneration(id, MOCK_AFTER, new Date().toISOString());
    return { generations: [g], selectedId: g.id };
  }, [id]);

  React.useEffect(() => {
    setChecklist(Array.from({ length: REVIEW_CHECKLIST_LENGTH }, () => false));
    setDemoApproved(false);
    setDemoPreview(null);
    setRefineBaseId("");
  }, [id]);

  const effectiveCase = React.useMemo<Case>(() => {
    if (caseData) return caseData;
    return {
      id,
      userId: "demo",
      originalPhotoUrl: MOCK_BEFORE,
      generatedImageUrl: MOCK_AFTER,
      treatmentData: {
        photoDataUrl: null,
        photoConfirmed: false,
        category: "cosmetic",
        material: "e.max veneers",
        teeth: { 8: "treatment", 9: "treatment" },
        shade: "BL2",
        shape: "natural",
        fullArch: false,
        orthoSelected: false,
        gumSurgerySelected: false,
        mode: "moderate",
      },
      constraints: {
        treatmentType: "Anterior veneer smile enhancement",
        allowedChanges: [],
        forbiddenChanges: [],
        requiredAesthetic: "natural",
        shadeRange: "BL1–A2",
        preservationRules: [],
      },
      assumption: {
        bullets: [],
        disclaimerFooter: "",
        mode: "moderate",
      },
      mode: "moderate",
      approved: false,
      createdAt: new Date().toISOString(),
    };
  }, [caseData, id]);

  const mergedForEnsure = React.useMemo(() => {
    if (!caseData && demoPreview) {
      return {
        ...effectiveCase,
        generatedImageUrl:
          demoPreview.generations.find((g) => g.id === demoPreview.selectedId)
            ?.imageUrl ?? MOCK_AFTER,
        previewGenerations: demoPreview.generations,
        selectedGenerationId: demoPreview.selectedId,
      } satisfies Case;
    }
    return effectiveCase;
  }, [caseData, demoPreview, effectiveCase]);

  const { generations, selectedId } = React.useMemo(
    () => ensurePreviewGenerations(mergedForEnsure),
    [mergedForEnsure],
  );

  React.useEffect(() => {
    if (!refineBaseId && generations.length) {
      setRefineBaseId(selectedId);
      return;
    }
    if (refineBaseId && !generations.some((g) => g.id === refineBaseId)) {
      setRefineBaseId(selectedId);
    }
  }, [generations, refineBaseId, selectedId]);

  const beforeSrc = effectiveCase.originalPhotoUrl;
  const selectedGen = generations.find((g) => g.id === selectedId);
  const afterSrc =
    selectedGen?.imageUrl ??
    effectiveCase.generatedImageUrl ??
    effectiveCase.originalPhotoUrl;

  const allChecked = checklist.every(Boolean);
  const showSuccess = caseData ? caseData.approved : demoApproved;

  const previewUrlDisplay = previewLinkDisplayPath(effectiveCase.id);

  const onSelectVersion = React.useCallback(
    (genId: string) => {
      const g = generations.find((x) => x.id === genId);
      if (!g) return;
      if (caseData) {
        const { generations: fullList } = ensurePreviewGenerations(caseData);
        updateCase(caseData.id, {
          previewGenerations: fullList,
          selectedGenerationId: genId,
          generatedImageUrl: g.imageUrl,
        });
      } else {
        setDemoPreview((s) => {
          const base = s ?? demoSeed;
          return { generations: base.generations, selectedId: genId };
        });
      }
      setRefineBaseId(genId);
    },
    [caseData, demoSeed, generations, updateCase],
  );

  const onRefinedPreview = React.useCallback(
    async (url: string, note: string) => {
      if (caseData) {
        const { generations: list } = ensurePreviewGenerations(caseData);
        const { list: next, newGen } = appendRefinedGeneration(list, url, note);
        updateCase(caseData.id, {
          previewGenerations: next,
          selectedGenerationId: newGen.id,
          generatedImageUrl: newGen.imageUrl,
        });
        await waitForCasesPersistWrites();
        setRefineBaseId(newGen.id);
        return;
      }
      setDemoPreview((s) => {
        const base = s ?? demoSeed;
        const { list, newGen } = appendRefinedGeneration(
          base.generations,
          url,
          note,
        );
        requestAnimationFrame(() => setRefineBaseId(newGen.id));
        return { generations: list, selectedId: newGen.id };
      });
    },
    [caseData, demoSeed, updateCase],
  );

  function toggleCheck(i: number) {
    setChecklist((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }

  function onApprove() {
    if (!allChecked) return;
    if (caseData) updateCase(caseData.id, { approved: true });
    else setDemoApproved(true);
  }

  function onAdjustInputs() {
    if (caseData) {
      useGenerateForm.setState({ step: 3, form: caseData.treatmentData });
    }
    router.push("/generate");
  }

  async function onDownload() {
    await downloadImageFromUrl(
      afterSrc,
      `smile-preview-${effectiveCase.id}.jpg`,
    );
  }

  const refineBase = refineBaseId || selectedId;

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <ReviewTopBar
        status={showSuccess ? "approved" : "pending"}
        onBackHref={caseData ? `/cases/${caseData.id}` : "/cases"}
      />

      <div className="flex-1 px-4 pb-32 pt-2 sm:px-6 lg:px-10">
        <PatientSmileExperience
          beforeSrc={beforeSrc}
          afterSrc={afterSrc}
          loading={refineBusy}
          mainClassName="px-0 pt-4 pb-6 sm:px-0 sm:pb-8 sm:pt-6"
          footer={
            showSuccess ? (
              <ReviewSuccessState
                previewUrl={previewUrlDisplay}
                caseId={effectiveCase.id}
              />
            ) : null
          }
          belowCompareSlot={
            !showSuccess && generations.length > 0 ? (
              <div className="flex w-full max-w-2xl flex-col gap-4">
                <ReviewPreviewVersions
                  generations={generations}
                  selectedId={selectedId}
                  onSelectId={onSelectVersion}
                />
                <ReviewRefinePanel
                  notesFieldId="review-refine-notes"
                  originalPhotoUrl={beforeSrc}
                  generations={generations}
                  refineBaseId={refineBase}
                  onRefineBaseIdChange={setRefineBaseId}
                  onRefined={onRefinedPreview}
                  onBusyChange={setRefineBusy}
                  heading="Optional feedback"
                  description=""
                  placeholder="Example: a little less bright, or slightly shorter front teeth."
                />
              </div>
            ) : undefined
          }
        />

        {!showSuccess ? (
          <div className="mx-auto mt-2 max-w-2xl lg:mt-4">
            <ReviewChecklist checked={checklist} onToggle={toggleCheck} />
          </div>
        ) : null}
      </div>

      <ReviewStickyActions
        approved={showSuccess}
        approveDisabled={!allChecked}
        onApprove={onApprove}
        onAdjustInputs={onAdjustInputs}
        onDownload={onDownload}
      />
    </div>
  );
}

