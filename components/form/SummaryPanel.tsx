"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGenerateForm } from "@/lib/stores/generate-form";

export function SummaryPanel() {
  const form = useGenerateForm((s) => s.form);

  const teethCount = Object.keys(form.teeth).length;
  const missing = Object.entries(form.teeth).filter(
    ([, s]) => s === "missing" || s === "destroyed",
  ).length;
  const treatment = Object.entries(form.teeth).filter(
    ([, s]) => s === "treatment",
  ).length;

  const rows: [string, string][] = [
    ["Category", form.category ?? "—"],
    ["Material", form.material ?? "—"],
    ["Shade", form.shade],
    ["Shape", form.shape],
    ["Teeth marked", teethCount ? `${teethCount} (${treatment} treatment, ${missing} missing)` : "—"],
    ["Full arch", form.fullArch ? "Yes" : "No"],
    ["Orthodontics", form.orthoSelected ? "Yes" : "No"],
    ["Gum surgery", form.gumSurgerySelected ? "Yes" : "No"],
    ["Mode", form.mode],
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-[color:var(--color-warm-200)]">
          {rows.map(([k, v]) => (
            <div
              key={k}
              className="flex items-start justify-between gap-4 py-2.5 text-sm"
            >
              <dt className="text-[color:var(--color-warm-500)]">{k}</dt>
              <dd className="text-right font-medium text-[color:var(--color-warm-900)]">
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
