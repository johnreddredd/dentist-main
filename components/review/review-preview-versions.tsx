"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PreviewGeneration } from "@/types";

interface ReviewPreviewVersionsProps {
  generations: PreviewGeneration[];
  /** Shown in the large preview and used for patient link / download. */
  selectedId: string;
  onSelectId: (id: string) => void;
}

export function ReviewPreviewVersions({
  generations,
  selectedId,
  onSelectId,
}: ReviewPreviewVersionsProps) {
  if (generations.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[#E7E5E4] bg-[#FAFAF9] p-4 shadow-sm sm:p-5">
      <h3 className="text-left text-sm font-semibold text-[#0F172A]">
        Preview versions
      </h3>
      <p className="mt-1 text-left text-xs leading-relaxed text-[#64748B]">
        <span className="font-medium text-[#334155]">Shown above</span> is the
        version with the teal border. That same image is what your patient link
        and download use—tap another thumbnail to switch back.
      </p>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {generations.map((g, idx) => {
          const isSelected = g.id === selectedId;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onSelectId(g.id)}
              className={cn(
                "flex w-[7.5rem] shrink-0 flex-col gap-1.5 rounded-xl border-2 bg-white p-2 text-left transition-all",
                isSelected
                  ? "border-[#0F766E] shadow-md ring-2 ring-[#0F766E]/15"
                  : "border-[#E7E5E4] hover:border-[#CBD5E1]",
              )}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#E7E5E4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.imageUrl}
                  alt=""
                  className="size-full object-cover object-center"
                />
                {isSelected ? (
                  <span className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-[#0F766E] text-white shadow">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                ) : null}
              </div>
              <span className="line-clamp-2 text-[11px] font-medium leading-tight text-[#0F172A]">
                {g.label}
              </span>
              {idx === generations.length - 1 && generations.length > 1 ? (
                <span className="text-[10px] font-medium uppercase tracking-wide text-[#0F766E]">
                  Latest
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
