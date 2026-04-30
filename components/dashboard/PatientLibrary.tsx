"use client";

import * as React from "react";
import Link from "next/link";
import { Users, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useCasesStore } from "@/lib/stores/cases";
import { useGenerateForm } from "@/lib/stores/generate-form";
import { formatDate, formatRelative } from "@/lib/utils";
import {
  formatPatientListName,
  patientLibrarySearchHaystack,
} from "@/lib/cases/patient-utils";
import type { Mode, TreatmentCategory } from "@/types";

type Filter = {
  mode: Mode | "all";
  category: TreatmentCategory | "all";
  search: string;
};

export function PatientLibrary() {
  const cases = useCasesStore((s) => s.cases);
  const [filter, setFilter] = React.useState<Filter>({
    mode: "all",
    category: "all",
    search: "",
  });

  const filtered = cases.filter((c) => {
    if (filter.mode !== "all" && c.mode !== filter.mode) return false;
    if (filter.category !== "all" && c.treatmentData.category !== filter.category)
      return false;
    if (filter.search) {
      const needle = filter.search.toLowerCase().trim();
      if (!patientLibrarySearchHaystack(c).includes(needle)) return false;
    }
    return true;
  });

  if (cases.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[color:var(--color-warm-300)] bg-white p-12 text-center">
        <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-[color:var(--color-teal-50)] text-[color:var(--color-teal-700)]">
          <Users className="size-5" />
        </div>
        <p className="text-base font-medium text-[color:var(--color-warm-900)]">
          No patients in the library yet
        </p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-[color:var(--color-warm-500)]">
          Generate a preview and save it with a name — then search here by
          patient, chart ID, phone, or email.
        </p>
        <Link
          href="/generate"
          onClick={() => useGenerateForm.getState().reset()}
          className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--color-teal-700)] px-5 text-sm font-medium text-white hover:bg-[color:var(--color-teal-800)]"
        >
          <Users className="size-4" /> New preview
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by name, chart #, phone, email…"
          value={filter.search}
          onChange={(e) =>
            setFilter((f) => ({ ...f, search: e.target.value }))
          }
          className="sm:max-w-md"
        />
        <Select
          value={filter.mode}
          onChange={(e) =>
            setFilter((f) => ({ ...f, mode: e.target.value as Filter["mode"] }))
          }
          className="sm:w-44"
        >
          <option value="all">All modes</option>
          <option value="conservative">Conservative</option>
          <option value="moderate">Moderate</option>
          <option value="aspirational">Aspirational</option>
        </Select>
        <Select
          value={filter.category}
          onChange={(e) =>
            setFilter((f) => ({
              ...f,
              category: e.target.value as Filter["category"],
            }))
          }
          className="sm:w-52"
        >
          <option value="all">All categories</option>
          <option value="cosmetic">Cosmetic</option>
          <option value="restorative">Restorative</option>
          <option value="replacement">Replacement</option>
          <option value="alignment">Alignment</option>
          <option value="whitening">Whitening</option>
          <option value="makeover">Full Makeover</option>
        </Select>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <li key={c.id}>
            <Link
              href={`/cases/${c.id}`}
              className="group block overflow-hidden rounded-2xl border border-[color:var(--color-warm-200)] bg-white transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[color:var(--color-warm-100)]">
                {c.generatedImageUrl || c.originalPhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.generatedImageUrl ?? c.originalPhotoUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[color:var(--color-warm-400)]">
                    No preview
                  </div>
                )}
                <div className="absolute right-2 top-2 flex gap-1.5">
                  {c.approved ? (
                    <Badge variant="success">
                      <CheckCircle2 className="size-3" /> Approved
                    </Badge>
                  ) : (
                    <Badge variant="warning">
                      <Clock className="size-3" /> Pending
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2 p-4">
                <p className="line-clamp-1 text-sm font-semibold text-[color:var(--color-warm-900)]">
                  {formatPatientListName(c.patient)}
                </p>
                <p className="line-clamp-1 text-xs text-[color:var(--color-warm-500)]">
                  {c.constraints?.treatmentType ?? "Treatment plan"}
                </p>
                <div className="flex items-center justify-between text-xs text-[color:var(--color-warm-500)]">
                  <Badge
                    variant={
                      c.mode === "aspirational"
                        ? "warning"
                        : c.mode === "conservative"
                          ? "success"
                          : "teal"
                    }
                  >
                    {c.mode}
                  </Badge>
                  <CaseCreatedLabel createdAt={c.createdAt} />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && cases.length > 0 ? (
        <p className="py-8 text-center text-sm text-[color:var(--color-warm-500)]">
          No patients match this search. Try another name or clear filters.
        </p>
      ) : null}
    </div>
  );
}

/** Stable date on SSR + first paint; switches to relative time after mount. */
function CaseCreatedLabel({ createdAt }: { createdAt: string }) {
  const [label, setLabel] = React.useState(() => formatDate(createdAt));
  React.useEffect(() => {
    setLabel(formatRelative(createdAt));
    const t = window.setInterval(() => {
      setLabel(formatRelative(createdAt));
    }, 60_000);
    return () => window.clearInterval(t);
  }, [createdAt]);
  return <span>{label}</span>;
}
