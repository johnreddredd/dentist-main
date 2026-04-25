"use client";

import { AlertTriangle, Check, Gauge, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Mode } from "@/types";
import { useGenerateForm } from "@/lib/stores/generate-form";

interface ModeCard {
  id: Mode;
  title: string;
  subtitle: string;
  tier: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  warning?: string;
}

const CARDS: ModeCard[] = [
  {
    id: "conservative",
    title: "Conservative",
    subtitle: "Realistic outcome I can deliver",
    tier: "$12–15K budget restorative tier",
    description:
      "VITA A3 shade. Preserves imperfections, age-appropriate. Natural variation, slight asymmetry maintained.",
    icon: Check,
    accent: "from-emerald-50 to-white",
  },
  {
    id: "moderate",
    title: "Moderate",
    subtitle: "Clean aesthetic improvement",
    tier: "$18–25K mid-tier restorative",
    description:
      "VITA A2 shade. Clean natural white with subtle variation. Quality dentistry aesthetic.",
    icon: Gauge,
    accent: "from-[color:var(--color-teal-50)] to-white",
  },
  {
    id: "aspirational",
    title: "Aspirational",
    subtitle: "Best-case Hollywood transformation",
    tier: "$40–60K All-on-4 / full zirconia",
    description:
      "VITA BL1 shade. Uniform polished prosthetic. Auto-adds disclaimer overlay.",
    icon: Sparkles,
    accent: "from-amber-50 to-white",
    warning: "Auto-adds disclaimer overlay — premium full-arch work required.",
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
            <div className="flex items-center gap-2">
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
              {selected && (
                <span className="ml-auto rounded-full bg-[color:var(--color-teal-700)] px-2 py-0.5 text-xs font-medium text-white">
                  Selected
                </span>
              )}
            </div>

            <p className="text-sm font-medium text-[color:var(--color-warm-700)]">
              {card.subtitle}
            </p>
            <p className="text-sm text-[color:var(--color-warm-600)]">
              {card.description}
            </p>
            <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--color-teal-800)]">
              {card.tier}
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
