"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { User } from "lucide-react";
import { useCasesStore } from "@/lib/stores/cases";
import { buildCaseDecisionTitle } from "@/lib/case-decision-copy";

export function CaseDetailTopBar() {
  const params = useParams();
  const id = params.id as string;
  const caseRow = useCasesStore((s) => s.cases.find((c) => c.id === id));

  const title = caseRow ? buildCaseDecisionTitle(caseRow) : "Case preview";

  return (
    <header className="sticky top-0 z-20 flex min-h-14 shrink-0 items-center gap-3 border-b border-[#E7E5E4] bg-[#FAFAF9]/95 px-4 py-2 backdrop-blur-md sm:min-h-16 sm:gap-4 sm:px-6">
      <h1 className="min-w-0 flex-1 text-sm font-semibold leading-snug text-[#0F172A] sm:text-base lg:text-[0.95rem]">
        <span className="line-clamp-2 sm:line-clamp-1">{title}</span>
      </h1>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link
          href={`/cases/${id}/review`}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E7E5E4] bg-white px-3.5 text-xs font-semibold text-[#0F172A] shadow-sm transition-all hover:border-[#0F766E]/35 hover:bg-white active:scale-[0.98] sm:h-11 sm:px-4 sm:text-sm"
        >
          Open review
        </Link>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-[#E7E5E4] bg-white text-[#0F766E] shadow-sm transition-all hover:border-[#0F766E]/30 active:scale-[0.98]"
          aria-label="Profile"
        >
          <User className="size-[18px]" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
