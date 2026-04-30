"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormStepper } from "@/components/form/FormStepper";
import { PhotoUpload } from "@/components/form/PhotoUpload";
import { TreatmentCategory } from "@/components/form/TreatmentCategory";
import { TreatmentSpecifics } from "@/components/form/TreatmentSpecifics";
import { ModeSelector } from "@/components/form/ModeSelector";
import { SummaryPanel } from "@/components/form/SummaryPanel";
import { useGenerateForm } from "@/lib/stores/generate-form";
import { useCasesStore, waitForCasesPersistWrites } from "@/lib/stores/cases";
import type { Case, CasePatientRecord, GenerateResponse } from "@/types";
import { PatientIntakeModal } from "@/components/patient/PatientIntakeModal";
import { createInitialGeneration } from "@/lib/cases/preview-history";
import { useAuthUser } from "@/components/providers/SupabaseAuthProvider";

export default function GeneratePage() {
  const router = useRouter();
  const { user } = useAuthUser();
  const step = useGenerateForm((s) => s.step);
  const setStep = useGenerateForm((s) => s.setStep);
  const back = useGenerateForm((s) => s.back);
  const next = useGenerateForm((s) => s.next);
  const canAdvanceFrom = useGenerateForm((s) => s.canAdvanceFrom);
  const form = useGenerateForm((s) => s.form);
  const addCase = useCasesStore((s) => s.addCase);

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pendingCase, setPendingCase] = React.useState<Case | null>(null);
  const [intakeOpen, setIntakeOpen] = React.useState(false);

  async function onGenerate() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Generation failed (${res.status})`);
      }
      const data = (await res.json()) as GenerateResponse;

      const initialGen = createInitialGeneration(
        data.caseId,
        data.generatedImageUrl,
        new Date().toISOString(),
      );
      const newCase: Case = {
        id: data.caseId,
        userId: user?.id ?? "local-dev",
        originalPhotoUrl: form.photoDataUrl ?? "",
        generatedImageUrl: data.generatedImageUrl,
        previewGenerations: [initialGen],
        selectedGenerationId: initialGen.id,
        aiReviewerBullets: data.reviewerBullets,
        treatmentData: form,
        constraints: data.constraints,
        assumption: data.assumption,
        mode: form.mode,
        approved: false,
        patientAccepted: "pending",
        createdAt: new Date().toISOString(),
      };
      setPendingCase(newCase);
      setIntakeOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  function finishNav(id: string) {
    void waitForCasesPersistWrites().then(() => router.push(`/cases/${id}`));
  }

  function onIntakeSave(patient: CasePatientRecord) {
    if (!pendingCase) return;
    const id = pendingCase.id;
    addCase({ ...pendingCase, patient });
    setPendingCase(null);
    setIntakeOpen(false);
    finishNav(id);
  }

  function onIntakeSkip() {
    if (!pendingCase) return;
    const id = pendingCase.id;
    addCase(pendingCase);
    setPendingCase(null);
    setIntakeOpen(false);
    finishNav(id);
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--color-warm-900)]">
          New preview
        </h1>
        <p className="text-sm text-[color:var(--color-warm-500)]">
          Four quick steps. Every preview is dentist-approved before a patient sees it.
        </p>
      </div>

      <div className="sticky top-14 z-[5] -mx-4 border-b border-[color:var(--color-warm-200)] bg-[color:var(--color-warm-50)]/80 px-4 py-3 backdrop-blur lg:top-16 lg:mx-0 lg:rounded-xl lg:border lg:bg-white lg:px-5 lg:py-3">
        <FormStepper />
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Patient photo</CardTitle>
            <CardDescription>
              Front-facing, teeth visible, even lighting. JPG or PNG up to 10 MB.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PhotoUpload />
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Treatment category</CardTitle>
            <CardDescription>
              Pick the treatment you&rsquo;re proposing. This constrains every
              change the preview is allowed to make.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TreatmentCategory onSelect={() => setStep(3)} />
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Treatment specifics</CardTitle>
            <CardDescription>
              Material, affected teeth, shade target, and shape.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TreatmentSpecifics />
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <Card>
            <CardHeader>
              <CardTitle>Choose a mode</CardTitle>
              <CardDescription>
                Mode determines realism. Aspirational auto-adds a disclaimer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ModeSelector />
            </CardContent>
          </Card>

          <SummaryPanel />
        </div>
      )}

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          onClick={back}
          disabled={step === 1}
        >
          <ArrowLeft className="size-4" /> Back
        </Button>

        {step < 4 ? (
          <Button
            size="lg"
            onClick={next}
            disabled={!canAdvanceFrom(step)}
          >
            Continue <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={onGenerate}
            loading={submitting}
            disabled={!canAdvanceFrom(4)}
          >
            Generate preview
          </Button>
        )}
      </div>
      <PatientIntakeModal
        open={intakeOpen}
        onSave={onIntakeSave}
        onSkip={onIntakeSkip}
      />
    </div>
  );
}
