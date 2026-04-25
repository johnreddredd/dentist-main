"use client";

import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { ToothChart } from "./ToothChart";
import {
  MATERIALS_BY_CATEGORY,
  TOOTH_SHAPES,
  VITA_SHADES,
  type ToothShape,
  type VitaShade,
} from "@/types";
import { useGenerateForm } from "@/lib/stores/generate-form";

export function TreatmentSpecifics() {
  const form = useGenerateForm((s) => s.form);
  const setMaterial = useGenerateForm((s) => s.setMaterial);
  const setShade = useGenerateForm((s) => s.setShade);
  const setShape = useGenerateForm((s) => s.setShape);
  const setFullArch = useGenerateForm((s) => s.setFullArch);
  const setOrtho = useGenerateForm((s) => s.setOrtho);
  const setGumSurgery = useGenerateForm((s) => s.setGumSurgery);

  const materials = form.category
    ? MATERIALS_BY_CATEGORY[form.category]
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="material">Material</Label>
          <Select
            id="material"
            value={form.material ?? ""}
            onChange={(e) => setMaterial(e.target.value)}
          >
            <option value="" disabled>
              Select a material…
            </option>
            {materials.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shape">Shape</Label>
          <Select
            id="shape"
            value={form.shape}
            onChange={(e) => setShape(e.target.value as ToothShape)}
          >
            {TOOTH_SHAPES.map((s) => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Shade (VITA)</Label>
        <div className="flex flex-wrap gap-2">
          {VITA_SHADES.map((s) => {
            const active = form.shade === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setShade(s as VitaShade)}
                className={
                  "h-10 min-w-[56px] rounded-full border px-3 text-sm font-medium transition-colors " +
                  (active
                    ? "border-[color:var(--color-teal-700)] bg-[color:var(--color-teal-700)] text-white"
                    : "border-[color:var(--color-warm-200)] bg-white text-[color:var(--color-warm-800)] hover:border-[color:var(--color-teal-500)]")
                }
              >
                {s}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-[color:var(--color-warm-500)]">
          Mode will cap the achievable shade (A3 conservative, A2 moderate, BL1 aspirational).
        </p>
      </div>

      <ToothChart />

      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[color:var(--color-warm-200)] bg-white p-5 sm:grid-cols-3">
        <Toggle
          checked={form.fullArch}
          onCheckedChange={setFullArch}
          label="Full arch"
          description="Treatment spans the entire visible arch"
        />
        <Toggle
          checked={form.orthoSelected}
          onCheckedChange={setOrtho}
          label="Orthodontics"
          description="Alignment change allowed"
        />
        <Toggle
          checked={form.gumSurgerySelected}
          onCheckedChange={setGumSurgery}
          label="Gum surgery"
          description="Gumline modification allowed"
        />
      </div>
    </div>
  );
}
