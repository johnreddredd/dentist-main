"use client";

import * as React from "react";
import { BeforeAfterSlider } from "@/components/review/before-after-slider";

interface ReviewPreviewHeroProps {
  modeLabel: string;
  beforeSrc: string;
  afterSrc: string;
}

export function ReviewPreviewHero({
  modeLabel,
  beforeSrc,
  afterSrc,
}: ReviewPreviewHeroProps) {
  return (
    <div className="rounded-2xl border border-[#E7E5E4] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-3 z-20 inline-flex items-center rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#0F172A] shadow-sm ring-1 ring-[#E7E5E4] backdrop-blur-sm">
          {modeLabel}
        </span>
        <span className="pointer-events-none absolute right-3 top-3 z-20 inline-flex items-center rounded-lg bg-[#0F766E] px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
          Dentist Review
        </span>

        <BeforeAfterSlider
          beforeSrc={beforeSrc}
          afterSrc={afterSrc}
          beforeLabel="Before"
          afterLabel="After"
          className="w-full"
          frameClassName="rounded-xl bg-[#F5F5F4]"
        />
      </div>

      <p className="mt-5 text-center text-sm leading-relaxed text-[#64748B]">
        Preview generated from selected treatment assumptions.
      </p>
    </div>
  );
}
