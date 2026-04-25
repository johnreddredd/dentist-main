"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ToothNumber, ToothState } from "@/types";
import { UPPER_TEETH, LOWER_TEETH } from "@/lib/constraints/constants";
import { useGenerateForm } from "@/lib/stores/generate-form";

const STATE_CYCLE: (ToothState | null)[] = [
  null,
  "treatment",
  "missing",
  "destroyed",
  "healthy",
];

function stateColor(state: ToothState | undefined): string {
  switch (state) {
    case "missing":
    case "destroyed":
      return "bg-red-500 text-white border-red-600";
    case "treatment":
      return "bg-amber-400 text-amber-900 border-amber-500";
    case "healthy":
      return "bg-emerald-500 text-white border-emerald-600";
    default:
      return "bg-white text-[color:var(--color-warm-600)] border-[color:var(--color-warm-300)] hover:border-[color:var(--color-teal-500)]";
  }
}

function stateLabel(state: ToothState | undefined): string {
  switch (state) {
    case "missing":
      return "Missing";
    case "destroyed":
      return "Destroyed";
    case "treatment":
      return "Needs treatment";
    case "healthy":
      return "Healthy";
    default:
      return "Unmarked";
  }
}

export function ToothChart() {
  const teeth = useGenerateForm((s) => s.form.teeth);
  const setToothState = useGenerateForm((s) => s.setToothState);

  function cycle(n: ToothNumber) {
    const current = teeth[n];
    const idx = STATE_CYCLE.indexOf(current ?? null);
    const next = STATE_CYCLE[(idx + 1) % STATE_CYCLE.length];
    setToothState(n, next);
  }

  return (
    <div className="space-y-6 rounded-2xl border border-[color:var(--color-warm-200)] bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[color:var(--color-warm-900)]">
            Teeth (Universal #1–32)
          </p>
          <p className="text-xs text-[color:var(--color-warm-500)]">
            Tap a tooth to cycle: Unmarked → Needs treatment → Missing → Destroyed → Healthy
          </p>
        </div>
        <Legend />
      </div>

      {/* UPPER */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[color:var(--color-warm-500)]">
          Upper
        </p>
        <div className="flex flex-wrap gap-1.5">
          {UPPER_TEETH.map((n) => (
            <ToothButton
              key={n}
              n={n}
              state={teeth[n]}
              onClick={() => cycle(n)}
            />
          ))}
        </div>
      </div>

      {/* LOWER */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[color:var(--color-warm-500)]">
          Lower
        </p>
        <div className="flex flex-wrap gap-1.5">
          {LOWER_TEETH.map((n) => (
            <ToothButton
              key={n}
              n={n}
              state={teeth[n]}
              onClick={() => cycle(n)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ToothButton({
  n,
  state,
  onClick,
}: {
  n: ToothNumber;
  state: ToothState | undefined;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={`Tooth #${n} — ${stateLabel(state)}`}
      className={cn(
        "relative flex h-12 w-10 items-center justify-center rounded-md border text-xs font-semibold transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-teal-600)]",
        stateColor(state),
      )}
    >
      {n}
    </button>
  );
}

function Legend() {
  const items: { label: string; cls: string }[] = [
    { label: "Healthy", cls: "bg-emerald-500" },
    { label: "Treatment", cls: "bg-amber-400" },
    { label: "Missing", cls: "bg-red-500" },
  ];
  return (
    <div className="hidden gap-3 text-xs text-[color:var(--color-warm-600)] sm:flex">
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-1.5">
          <span className={cn("size-2.5 rounded-full", i.cls)} />
          {i.label}
        </span>
      ))}
    </div>
  );
}
