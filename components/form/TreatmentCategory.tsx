"use client";

import { Sparkles, Wrench, Replace, AlignCenter, Sun, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TreatmentCategory } from "@/types";
import { useGenerateForm } from "@/lib/stores/generate-form";

interface CategoryTile {
  id: TreatmentCategory;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TILES: CategoryTile[] = [
  {
    id: "cosmetic",
    title: "Cosmetic",
    subtitle: "Veneers, bonding, crowns",
    icon: Sparkles,
  },
  {
    id: "restorative",
    title: "Restorative",
    subtitle: "Fillings, inlays, crowns",
    icon: Wrench,
  },
  {
    id: "replacement",
    title: "Replacement",
    subtitle: "Implants, bridges, dentures",
    icon: Replace,
  },
  {
    id: "alignment",
    title: "Alignment",
    subtitle: "Invisalign, clear aligners, braces",
    icon: AlignCenter,
  },
  {
    id: "whitening",
    title: "Whitening",
    subtitle: "In-office or at-home bleaching",
    icon: Sun,
  },
  {
    id: "makeover",
    title: "Full Makeover",
    subtitle: "Combined treatment plan",
    icon: Crown,
  },
];

export function TreatmentCategory({ onSelect }: { onSelect?: () => void }) {
  const category = useGenerateForm((s) => s.form.category);
  const setCategory = useGenerateForm((s) => s.setCategory);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {TILES.map((tile) => {
        const selected = category === tile.id;
        const Icon = tile.icon;
        return (
          <button
            key={tile.id}
            type="button"
            onClick={() => {
              setCategory(tile.id);
              onSelect?.();
            }}
            className={cn(
              "group relative flex flex-col items-start gap-3 rounded-2xl border bg-white p-6 text-left transition-all tap-target",
              "hover:-translate-y-0.5 hover:shadow-md",
              selected
                ? "border-[color:var(--color-teal-600)] ring-2 ring-[color:var(--color-teal-600)]/20"
                : "border-[color:var(--color-warm-200)]",
            )}
          >
            <div
              className={cn(
                "rounded-xl p-2.5",
                selected
                  ? "bg-[color:var(--color-teal-700)] text-white"
                  : "bg-[color:var(--color-teal-50)] text-[color:var(--color-teal-700)]",
              )}
            >
              <Icon className="size-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-[color:var(--color-warm-900)]">
                {tile.title}
              </p>
              <p className="text-sm text-[color:var(--color-warm-500)]">
                {tile.subtitle}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
