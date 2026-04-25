"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCasesStore } from "@/lib/stores/cases";
import type { TreatmentCategory } from "@/types";

export function Stats() {
  const cases = useCasesStore((s) => s.cases);

  const total = cases.length;
  const approved = cases.filter((c) => c.approved).length;
  const accepted = cases.filter((c) => c.patientAccepted === "yes").length;
  const reviewed = cases.filter(
    (c) => c.patientAccepted === "yes" || c.patientAccepted === "no",
  ).length;
  const acceptRate = reviewed > 0 ? Math.round((accepted / reviewed) * 100) : 0;

  const byCategory: Record<string, number> = {};
  for (const c of cases) {
    const cat = c.treatmentData.category ?? "unknown";
    byCategory[cat] = (byCategory[cat] ?? 0) + 1;
  }
  const topCategories = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const stats: { label: string; value: string | number; hint?: string }[] = [
    { label: "Total previews", value: total },
    {
      label: "Approved",
      value: approved,
      hint: `${total ? Math.round((approved / total) * 100) : 0}% of total`,
    },
    {
      label: "Patient accept rate",
      value: `${acceptRate}%`,
      hint: `${accepted} accepted of ${reviewed} reviewed`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--color-warm-500)]">
                {s.label}
              </p>
              <p className="mt-1 text-3xl font-semibold text-[color:var(--color-warm-900)]">
                {s.value}
              </p>
              {s.hint && (
                <p className="mt-1 text-xs text-[color:var(--color-warm-500)]">
                  {s.hint}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top treatment types</CardTitle>
        </CardHeader>
        <CardContent>
          {topCategories.length === 0 ? (
            <p className="text-sm text-[color:var(--color-warm-500)]">
              No data yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {topCategories.map(([cat, n]) => (
                <li key={cat} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium capitalize text-[color:var(--color-warm-900)]">
                      {cat as TreatmentCategory}
                    </span>
                    <span className="text-[color:var(--color-warm-500)]">
                      {n} case{n === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[color:var(--color-warm-200)]">
                    <div
                      className="h-full bg-[color:var(--color-teal-600)]"
                      style={{
                        width: `${total > 0 ? (n / total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
