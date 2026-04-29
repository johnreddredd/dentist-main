"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaseDecisionActionsProps {
  onRegenerate: () => void;
  onAdjustRegenerate: () => void;
  approved: boolean;
  regenerating: boolean;
  /** Highlights “Adjust & Regenerate” when the note panel is open. */
  adjustPanelOpen?: boolean;
}

export function CaseDecisionActions({
  onRegenerate,
  onAdjustRegenerate,
  approved,
  regenerating,
  adjustPanelOpen = false,
}: CaseDecisionActionsProps) {
  if (approved) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-2 sm:max-w-xl sm:gap-3">
        <button
          type="button"
          disabled={regenerating}
          onClick={onRegenerate}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-[#E7E5E4] bg-white px-4 text-sm font-semibold text-[#0F172A] shadow-sm transition-all hover:bg-[#FAFAF9] disabled:opacity-60 sm:flex-none"
        >
          {regenerating ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Regenerating…
            </>
          ) : (
            "Regenerate"
          )}
        </button>
        <button
          type="button"
          disabled={regenerating}
          onClick={onAdjustRegenerate}
          className={cn(
            "inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border bg-white px-4 text-sm font-semibold text-[#0F172A] shadow-sm transition-all hover:bg-[#FAFAF9] disabled:opacity-60 sm:flex-none",
            adjustPanelOpen
              ? "border-[#0F766E] bg-[#ECFDF5] ring-2 ring-[#0F766E]/20"
              : "border-[#E7E5E4]",
          )}
        >
          Adjust &amp; Regenerate
        </button>
      </div>
    </div>
  );
}
