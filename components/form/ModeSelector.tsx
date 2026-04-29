"use client";

import type { ComponentType } from "react";
import { AlertTriangle, Check, Gauge, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Mode } from "@/types";
import { useGenerateForm } from "@/lib/stores/generate-form";

interface ModeCard {
  id: Mode;
  title: string;
  hollywoodLabel?: string;
  subtitle: string;
  /** Shade cap + one-line outcome. */
  summary: string;
  icon: ComponentType<{ className?: string }>;
  accent: string;
  warning?: string;
}

const CARDS: ModeCard[] = [
  {
    id: "conservative",
    title: "Conservative",
    subtitle: "Closest to natural — everyday restorative look.",
    summary: "VITA A3 max · keeps character & slight asymmetry.",
    icon: Check,
    accent: "from-emerald-50 to-white",
  },
  {
    id: "moderate",
    title: "Moderate",
    subtitle: "Bright, believable upgrade — not “Hollywood.”",
    summary: "VITA A2 max · clean white, still looks like real teeth.",
    icon: Gauge,
    accent: "from-[color:var(--color-teal-50)] to-white",
  },
  {
    id: "aspirational",
    title: "Aspirational",
    hollywoodLabel: "Hollywood",
    subtitle: "Full smile makeover / red-carpet territory.",
    summary: "VITA BL1 max · even, polished look (may read prosthetic).",
    icon: Sparkles,
    accent: "from-amber-50 to-white",
    warning:
      "Shows a stronger patient disclaimer — matches big multidisciplinary cases.",
  },
];

export function ModeSelector() {
  const mode = useGenerateForm((s) => s.form.mode);
  const setMode = useGenerateForm((s) => s.setMode);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {CARDS.map((card) => {
        const selected = mode === card.id;
        const Icon = card.icon;
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => setMode(card.id)}
            className={cn(
              "relative flex flex-col gap-3 rounded-2xl border bg-gradient-to-b p-5 text-left transition-all",
              card.accent,
              "hover:-translate-y-0.5 hover:shadow-md",
              selected
                ? "border-[color:var(--color-teal-600)] ring-2 ring-[color:var(--color-teal-600)]/20"
                : "border-[color:var(--color-warm-200)]",
            )}
          >
            <div className="flex flex-wrap items-center gap-2">
              <div
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-lg",
                  selected
                    ? "bg-[color:var(--color-teal-700)] text-white"
                    : "bg-white text-[color:var(--color-teal-700)] border border-[color:var(--color-warm-200)]",
                )}
              >
                <Icon className="size-4" />
              </div>
              <p className="text-lg font-semibold text-[color:var(--color-warm-900)]">
                {card.title}
              </p>
              {card.hollywoodLabel ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                  {card.hollywoodLabel}
                </span>
              ) : null}
              {selected ? (
                <span className="ml-auto rounded-full bg-[color:var(--color-teal-700)] px-2 py-0.5 text-xs font-medium text-white">
                  Selected
                </span>
              ) : null}
            </div>

            <p className="text-sm font-medium text-[color:var(--color-warm-800)] leading-snug">
              {card.subtitle}
            </p>
            <p className="text-sm text-[color:var(--color-warm-600)] leading-snug">
              {card.summary}
            </p>

            {card.warning && (
              <p className="mt-1 inline-flex items-start gap-1.5 rounded-lg bg-amber-100/70 px-2.5 py-1.5 text-xs text-amber-900">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                {card.warning}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
