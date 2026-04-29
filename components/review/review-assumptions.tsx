"use client";

import * as React from "react";
import {
  Ban,
  Droplets,
  Layers,
  Sparkles,
  Stethoscope,
  Sun,
} from "lucide-react";

export interface AssumptionRowItem {
  label: string;
  value: string;
  icon?: "treatment" | "material" | "shade" | "mode" | "teeth";
}

const iconMap = {
  treatment: Stethoscope,
  material: Layers,
  shade: Droplets,
  mode: Sun,
  teeth: Sparkles,
};

interface ReviewAssumptionsProps {
  rows: AssumptionRowItem[];
  exclusions: string;
}

export function ReviewAssumptions({ rows, exclusions }: ReviewAssumptionsProps) {
  return (
    <div className="rounded-2xl border border-[#E7E5E4] bg-[#F5F5F4]/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <h3 className="text-sm font-semibold text-[#0F172A]">Preview Assumptions</h3>
      <p className="mt-1 text-xs text-[#64748B]">What this image is based on</p>

      <ul className="mt-5 space-y-4">
        {rows.map((row) => {
          const Icon = row.icon ? iconMap[row.icon] : Sparkles;
          return (
            <li key={row.label} className="flex gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-sm ring-1 ring-[#E7E5E4]">
                <Icon className="size-4" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                  {row.label}
                </p>
                <p className="mt-0.5 text-sm font-medium text-[#0F172A]">{row.value}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex gap-3 rounded-xl border border-amber-200/80 bg-amber-50/80 p-4">
        <Ban className="mt-0.5 size-4 shrink-0 text-amber-700" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
            Exclusions
          </p>
          <p className="mt-1 text-sm leading-relaxed text-amber-950/90">{exclusions}</p>
        </div>
      </div>

      <p className="mt-5 rounded-xl bg-white/90 px-4 py-3 text-xs leading-relaxed text-[#64748B] ring-1 ring-[#E7E5E4]">
        <span className="font-semibold text-[#0F172A]">Note: </span>
        This preview reflects only the selected treatment assumptions.
      </p>
    </div>
  );
}
