"use client";

import * as React from "react";
import { Check } from "lucide-react";

const CHECKS = [
  "Treatment matches selected plan",
  "Tooth shade looks appropriate",
  "Face, lips, and lighting preserved",
  "No unintended changes visible",
  "Safe to show patient",
] as const;

interface ReviewChecklistProps {
  items?: readonly string[];
  checked: boolean[];
  onToggle: (index: number) => void;
  disabled?: boolean;
}

export function ReviewChecklist({
  items = CHECKS,
  checked,
  onToggle,
  disabled = false,
}: ReviewChecklistProps) {
  return (
    <div className="rounded-2xl border border-[#E7E5E4] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <h3 className="text-sm font-semibold text-[#0F172A]">Review Before Approval</h3>
      <p className="mt-1 text-xs text-[#64748B]">
        Confirm clinical alignment before sharing.
      </p>

      <ul className="mt-5 space-y-3">
        {items.map((label, i) => {
          const isChecked = checked[i];
          return (
            <li key={label}>
              <label
                className={`group flex cursor-pointer items-start gap-4 rounded-xl border border-transparent p-2 transition-colors hover:bg-[#FAFAF9] ${
                  disabled ? "pointer-events-none opacity-60" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => !disabled && onToggle(i)}
                  className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200 ease-out active:scale-95 ${
                    isChecked
                      ? "border-[#0F766E] bg-[#0F766E] text-white shadow-sm"
                      : "border-[#E7E5E4] bg-white group-hover:border-[#CBD5E1]"
                  }`}
                  aria-pressed={isChecked}
                >
                  <Check
                    className={`size-3.5 transition-all duration-200 ${
                      isChecked ? "scale-100 opacity-100" : "scale-50 opacity-0"
                    }`}
                    strokeWidth={3}
                  />
                </button>
                <span className="text-sm leading-snug text-[#0F172A]">{label}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export const REVIEW_CHECKLIST_LENGTH = CHECKS.length;
