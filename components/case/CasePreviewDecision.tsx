"use client";

import { Loader2, ShieldCheck } from "lucide-react";
import { confidenceLabel } from "@/lib/case-decision-copy";

interface CasePreviewDecisionProps {
  approved: boolean;
  approving: boolean;
  regenerating: boolean;
  onApprove: () => void;
}

export function CasePreviewDecision({
  approved,
  approving,
  regenerating,
  onApprove,
}: CasePreviewDecisionProps) {
  const conf = confidenceLabel();

  if (approved) {
    return (
      <div className="mt-4 flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-semibold text-[#0F766E]">
          Approved for patient view
        </p>
        <p className="max-w-md text-xs text-[#64748B]">
          They will see this exact preview in the shared experience.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 flex w-full max-w-[53rem] flex-col items-center gap-3 px-0 sm:gap-3.5">
      <p className="text-center text-sm text-[#64748B]">
        Ready to present to patient
      </p>

      <div className="flex w-full flex-col items-center gap-3 sm:max-w-2xl">
        <div className="flex w-full max-w-md items-center justify-center gap-2.5 rounded-xl border border-[#0F766E]/35 bg-white px-4 py-3 text-sm text-[#0F172A] shadow-sm sm:w-auto sm:min-w-[14rem]">
          <ShieldCheck
            className="size-[1.35rem] shrink-0 text-[#0F766E]"
            strokeWidth={2}
            aria-hidden
          />
          <span className="font-semibold tracking-tight">
            Confidence: {conf}
          </span>
        </div>

        <button
          type="button"
          disabled={approving || regenerating}
          onClick={onApprove}
          className="inline-flex h-[3.75rem] min-h-[60px] w-full max-w-2xl items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-8 text-base font-semibold text-white shadow-md transition-all hover:bg-[#0D6861] hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#94A3B8] disabled:opacity-85"
        >
          {approving ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Approving…
            </>
          ) : (
            "Approve & Show to Patient"
          )}
        </button>
      </div>

      <p className="max-w-md px-2 text-center text-xs leading-relaxed text-[#64748B]">
        Patient will see this exact preview after approval.
      </p>
    </div>
  );
}
