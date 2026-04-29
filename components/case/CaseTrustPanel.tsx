"use client";

import * as React from "react";
import { Check } from "lucide-react";
import type { Case } from "@/types";
import {
  buildConstraintsScannable,
  buildTreatmentSummaryChips,
  buildWhatLooksGood,
} from "@/lib/case-decision-copy";

interface CaseTrustPanelProps {
  caseData: Case;
  patientAccepted: Case["patientAccepted"];
  onPatientOutcome: (v: NonNullable<Case["patientAccepted"]>) => void;
}

export function CaseTrustPanel({
  caseData,
  patientAccepted,
  onPatientOutcome,
}: CaseTrustPanelProps) {
  const chips = buildTreatmentSummaryChips(caseData);
  const good = buildWhatLooksGood(caseData);
  const constraints = buildConstraintsScannable(caseData);

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      {caseData.aiReviewerBullets && caseData.aiReviewerBullets.length > 0 ? (
        <section className="rounded-2xl border border-[#0F766E]/25 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
            Pre-review refinements
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[#64748B]">
            Before this preview was finalized, a reviewer model compared your
            patient&rsquo;s original photo to the first AI draft and applied these
            three fixes in a second render:
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-snug text-[#0F172A]">
            {caseData.aiReviewerBullets.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#0F766E]"
                  aria-hidden
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-[#E7E5E4] bg-white p-5 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
          Treatment Summary
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((c) => (
            <span
              key={c.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E5E4] bg-[#FAFAF9] px-3 py-1.5 text-xs font-medium text-[#0F172A]"
            >
              <span className="text-[#64748B]">{c.label}:</span>
              {c.value}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#0F766E]/20 bg-[#F0FDFA]/60 p-5 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
          What Looks Good
        </h2>
        <ul className="mt-3 space-y-2.5">
          {good.map((line) => (
            <li
              key={line}
              className="flex gap-2.5 text-sm leading-snug text-[#0F172A]"
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-white">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[#E7E5E4] bg-white p-5 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
          Constraints Applied
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#475569]">
          {constraints.map((line) => (
            <li key={line} className="flex gap-2">
              <span
                className="mt-2 size-1 shrink-0 rounded-full bg-[#CBD5E1]"
                aria-hidden
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-[11px] leading-relaxed text-[#94A3B8]">
        Visual representation only. Not a treatment plan.
      </p>

      <section className="mt-auto rounded-2xl border border-[#E7E5E4] bg-white p-5 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
          Patient Outcome
        </h2>
        <p className="mt-1 text-xs text-[#94A3B8]">After consult</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              { v: "yes" as const, label: "Accepted" },
              { v: "no" as const, label: "Declined" },
              { v: "pending" as const, label: "Pending" },
            ] as const
          ).map(({ v, label }) => (
            <button
              key={v}
              type="button"
              onClick={() => onPatientOutcome(v)}
              className={
                "min-h-10 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all active:scale-[0.98] " +
                (patientAccepted === v
                  ? "border-[#0F766E] bg-[#0F766E] text-white shadow-sm"
                  : "border-[#E7E5E4] bg-white text-[#475569] hover:border-[#CBD5E1]")
              }
            >
              {label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
