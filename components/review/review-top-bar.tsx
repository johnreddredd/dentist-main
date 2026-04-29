"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

interface ReviewTopBarProps {
  status: "pending" | "approved";
  onBackHref: string;
}

export function ReviewTopBar({ status, onBackHref }: ReviewTopBarProps) {
  return (
    <header className="sticky top-0 z-40 grid h-16 shrink-0 grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-[#E7E5E4] bg-[#FAFAF9]/95 px-4 backdrop-blur-md sm:gap-4 sm:px-6">
      <Link
        href="/cases"
        className="flex shrink-0 items-center gap-2 rounded-lg text-[#0F172A] transition-opacity hover:opacity-80"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-[#0F766E] text-white shadow-sm">
          <Sparkles className="size-4" strokeWidth={2} />
        </span>
        <span className="hidden font-semibold tracking-tight sm:inline">
          SmileAI
        </span>
      </Link>

      <div className="min-w-0 justify-self-start pl-1 sm:pl-2">
        <h1 className="truncate text-base font-semibold text-[#0F172A] sm:text-lg">
          Case Review
        </h1>
        <p className="hidden truncate text-xs text-[#64748B] sm:block sm:text-sm">
          Review treatment preview before sharing with patient
        </p>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            status === "approved"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-900"
          }`}
        >
          {status === "approved" ? "Approved" : "Pending Review"}
        </span>
        <Link
          href={onBackHref}
          className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-[#E7E5E4] bg-white px-3.5 text-sm font-medium text-[#0F172A] shadow-sm transition-all hover:border-[#0F766E]/30 hover:shadow active:scale-[0.98]"
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">Back</span>
        </Link>
      </div>
    </header>
  );
}
