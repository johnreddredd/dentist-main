"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PreviewDisplay } from "@/components/generation/PreviewDisplay";
import { AssumptionBox } from "@/components/generation/AssumptionBox";
import { ApprovalGate } from "@/components/generation/ApprovalGate";
import { useCasesStore } from "@/lib/stores/cases";
import { useGenerateForm } from "@/lib/stores/generate-form";
import type { GenerateResponse } from "@/types";
import { formatDate } from "@/lib/utils";


// Next.js 16: params is a Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CaseDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const caseData = useCasesStore((s) => s.cases.find((c) => c.id === id));
  const updateCase = useCasesStore((s) => s.updateCase);

  const [regenerating, setRegenerating] = React.useState(false);
  const [approving, setApproving] = React.useState(false);
  const [regenCount, setRegenCount] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  if (!caseData) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Case not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[color:var(--color-warm-500)]">
              This case may have been deleted, or is stored on another device.
            </p>
            <Link
              href="/cases"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--color-warm-200)] bg-white px-4 text-sm font-medium hover:bg-[color:var(--color-warm-100)]"
            >
              Back to library
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      updateCase(caseData.id, {
        generatedImageUrl: data.generatedImageUrl,
        constraints: data.constraints,
        assumption: data.assumption,
      });
      setRegenCount((n) => n + 1);
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
    setTimeout(() => setApproving(false), 300);
  }

  function onAdjust() {
    if (!caseData) return;
    // Pre-fill the form store with this case's data and jump to step 3.
    useGenerateForm.setState({
      step: 3,
      form: caseData.treatmentData,
    });
    router.push("/generate");
  }

  const modeBadge =
    caseData.mode === "aspirational"
      ? "warning"
      : caseData.mode === "conservative"
        ? "success"
        : "teal";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link
          href="/cases"
          className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-warm-600)] hover:text-[color:var(--color-warm-900)]"
        >
          <ArrowLeft className="size-4" /> All cases
        </Link>
        {caseData.approved && (
          <Badge variant="success">
            <CheckCircle2 className="size-3" /> Approved
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          {caseData.constraints.treatmentType}
        </h1>
        <Badge variant={modeBadge}>{caseData.mode} mode</Badge>
        <span className="text-xs text-[color:var(--color-warm-500)]">
          {formatDate(caseData.createdAt)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <PreviewDisplay
            originalUrl={caseData.originalPhotoUrl}
            generatedUrl={caseData.generatedImageUrl ?? caseData.originalPhotoUrl}
            loading={regenerating}
          />

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <ApprovalGate
            onApprove={onApprove}
            onRegenerate={onRegenerate}
            onAdjust={onAdjust}
            regenerating={regenerating}
            approving={approving}
            regenerationCount={regenCount}
          />
        </div>

        <aside className="space-y-4">
          <AssumptionBox box={caseData.assumption} />

          <Card>
            <CardHeader>
              <CardTitle>Patient outcome</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-[color:var(--color-warm-500)]">
                After consult, log whether the patient accepted the treatment plan.
              </p>
              <div className="flex flex-wrap gap-2">
                {(["yes", "no", "pending"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => updateCase(caseData.id, { patientAccepted: v })}
                    className={
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                      (caseData.patientAccepted === v
                        ? "border-[color:var(--color-teal-700)] bg-[color:var(--color-teal-700)] text-white"
                        : "border-[color:var(--color-warm-200)] bg-white text-[color:var(--color-warm-700)] hover:bg-[color:var(--color-warm-100)]")
                    }
                  >
                    {v === "yes"
                      ? "Accepted"
                      : v === "no"
                        ? "Declined"
                        : "Pending"}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

    </div>
  );
}
