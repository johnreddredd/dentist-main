"use client";

import { Sparkles } from "lucide-react";

export function PatientPreviewTopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E7E5E4]/60 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[#0F172A]">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#0F766E] text-white shadow-sm">
            <Sparkles className="size-4" strokeWidth={2} aria-hidden />
          </span>
          <span className="text-sm font-semibold tracking-tight sm:text-base">
            SmileAI
          </span>
        </div>
        <p className="text-right text-[11px] font-medium text-[#64748B] sm:text-xs">
          Created with your dentist
        </p>
      </div>
    </header>
  );
}
