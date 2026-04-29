"use client";

import * as React from "react";

interface ReviewStickyActionsProps {
  onAdjustInputs?: () => void;
  onDownload?: () => void;
  onApprove: () => void;
  approveDisabled: boolean;
  approved?: boolean;
}

export function ReviewStickyActions({
  onAdjustInputs,
  onDownload,
  onApprove,
  approveDisabled,
  approved = false,
}: ReviewStickyActionsProps) {
  if (approved) return null;

  return (
    <div className="sticky bottom-0 z-40 -mx-1 border-t border-[#E7E5E4] bg-[#FAFAF9]/90 px-4 py-4 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <GhostButton onClick={onAdjustInputs}>Adjust Inputs</GhostButton>
          <GhostButton onClick={onDownload}>Download</GhostButton>
        </div>
        <div className="flex flex-col items-stretch sm:items-end">
          <button
            type="button"
            disabled={approveDisabled}
            onClick={onApprove}
            className="h-12 min-h-[48px] rounded-xl bg-[#0F766E] px-8 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0D6861] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#94A3B8] disabled:opacity-70 disabled:hover:bg-[#94A3B8] disabled:hover:shadow-sm"
          >
            Approve & Create Patient Link
          </button>
          <p className="mt-2 max-w-sm text-center text-xs text-[#64748B] sm:text-right">
            Creates a patient-ready preview instantly.
          </p>
        </div>
      </div>
    </div>
  );
}

function GhostButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-[#E7E5E4] bg-white px-4 py-2.5 text-sm font-medium text-[#0F172A] shadow-sm transition-all hover:border-[#CBD5E1] hover:bg-[#FAFAF9] active:scale-[0.98]"
    >
      {children}
    </button>
  );
}
