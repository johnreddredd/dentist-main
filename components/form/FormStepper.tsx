"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGenerateForm, type Step } from "@/lib/stores/generate-form";

const STEPS: { id: Step; label: string }[] = [
  { id: 1, label: "Photo" },
  { id: 2, label: "Category" },
  { id: 3, label: "Specifics" },
  { id: 4, label: "Mode" },
];

export function FormStepper() {
  const step = useGenerateForm((s) => s.step);
  const setStep = useGenerateForm((s) => s.setStep);
  const canAdvanceFrom = useGenerateForm((s) => s.canAdvanceFrom);

  return (
    <ol className="flex items-center gap-3 overflow-x-auto no-scrollbar">
      {STEPS.map((s, idx) => {
        const isCurrent = step === s.id;
        const isComplete = step > s.id;
        const canJump = s.id <= step || (s.id === step + 1 && canAdvanceFrom(step));

        return (
          <li key={s.id} className="flex items-center gap-3">
            <button
              type="button"
              disabled={!canJump}
              onClick={() => canJump && setStep(s.id)}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors",
                isCurrent
                  ? "bg-[color:var(--color-teal-700)] text-white"
                  : isComplete
                    ? "bg-[color:var(--color-teal-50)] text-[color:var(--color-teal-800)]"
                    : "bg-transparent text-[color:var(--color-warm-500)] hover:bg-[color:var(--color-warm-100)]",
                !canJump && "cursor-not-allowed opacity-50",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                  isCurrent
                    ? "bg-white/20 text-white"
                    : isComplete
                      ? "bg-[color:var(--color-teal-700)] text-white"
                      : "bg-[color:var(--color-warm-200)] text-[color:var(--color-warm-600)]",
                )}
              >
                {isComplete ? <Check className="size-3.5" /> : s.id}
              </span>
              {s.label}
            </button>
            {idx < STEPS.length - 1 && (
              <span
                aria-hidden
                className="hidden h-px w-6 bg-[color:var(--color-warm-200)] sm:block"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
