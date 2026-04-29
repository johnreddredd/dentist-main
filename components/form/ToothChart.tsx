"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ToothNumber, ToothState } from "@/types";
import {
  UPPER_TEETH,
  LOWER_TEETH,
  TOOTH_NUMBERS,
} from "@/lib/constraints/constants";
import { useGenerateForm } from "@/lib/stores/generate-form";
import { Button } from "@/components/ui/button";

function stateColor(state: ToothState | undefined): string {
  if (state === "treatment") {
    return "bg-amber-400 text-amber-900 border-amber-500";
  }
  return "bg-white text-[color:var(--color-warm-600)] border-[color:var(--color-warm-300)] hover:border-[color:var(--color-teal-500)]";
}

function archAllTreatment(
  teeth: Record<number, ToothState | undefined>,
  arch: readonly ToothNumber[],
): boolean {
  if (arch.length === 0) return false;
  return arch.every((n) => teeth[n] === "treatment");
}

export function ToothChart() {
  const teeth = useGenerateForm((s) => s.form.teeth);
  const setToothState = useGenerateForm((s) => s.setToothState);
  const setManyToothStates = useGenerateForm((s) => s.setManyToothStates);

  function toggleTooth(n: ToothNumber) {
    if (teeth[n] === "treatment") {
      setToothState(n, null);
    } else {
      setToothState(n, "treatment");
    }
  }

  function toggleArch(arch: readonly ToothNumber[]) {
    if (archAllTreatment(teeth, arch)) {
      setManyToothStates(arch, null);
    } else {
      setManyToothStates(arch, "treatment");
    }
  }

  const upperAll = archAllTreatment(teeth, UPPER_TEETH);
  const lowerAll = archAllTreatment(teeth, LOWER_TEETH);
  const fullAll = archAllTreatment(teeth, TOOTH_NUMBERS);

  return (
    <div className="space-y-6 rounded-2xl border border-[color:var(--color-warm-200)] bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[color:var(--color-warm-900)]">
            Teeth (Universal #1–32)
          </p>
          <p className="text-xs text-[color:var(--color-warm-500)]">
            Tap a tooth to select it for this plan, tap again to deselect. Use
            the arch buttons to select or clear a whole arch at once.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 rounded-lg border-[color:var(--color-warm-200)] text-xs"
            onClick={() => toggleArch(TOOTH_NUMBERS)}
          >
            {fullAll ? "Clear all teeth" : "Select all teeth"}
          </Button>
          <Legend />
        </div>
      </div>

      {/* UPPER */}
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--color-warm-500)]">
            Upper
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 rounded-lg border-[color:var(--color-warm-200)] text-xs"
            onClick={() => toggleArch(UPPER_TEETH)}
          >
            {upperAll ? "Clear upper" : "Select all upper"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {UPPER_TEETH.map((n) => (
            <ToothButton
              key={n}
              n={n}
              state={teeth[n]}
              onClick={() => toggleTooth(n)}
            />
          ))}
        </div>
      </div>

      {/* LOWER */}
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--color-warm-500)]">
            Lower
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 rounded-lg border-[color:var(--color-warm-200)] text-xs"
            onClick={() => toggleArch(LOWER_TEETH)}
          >
            {lowerAll ? "Clear lower" : "Select all lower"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {LOWER_TEETH.map((n) => (
            <ToothButton
              key={n}
              n={n}
              state={teeth[n]}
              onClick={() => toggleTooth(n)}
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
      title={`Tooth #${n} — ${state === "treatment" ? "Selected" : "Not selected"}`}
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
    { label: "Not selected", cls: "bg-white border border-[color:var(--color-warm-300)]" },
    { label: "In plan", cls: "bg-amber-400" },
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
