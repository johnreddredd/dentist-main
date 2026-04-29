"use client";

import Link from "next/link";
import { Menu, Sparkles } from "lucide-react";
import { useGenerateForm } from "@/lib/stores/generate-form";

export function TopBar() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-[color:var(--color-warm-200)] bg-white/80 px-4 backdrop-blur lg:h-16 lg:px-6">
      <button
        type="button"
        className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-[color:var(--color-warm-100)] lg:hidden"
        aria-label="Menu"
      >
        <Menu className="size-5" />
      </button>
      <Link href="/" className="flex items-center gap-2 lg:hidden">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[color:var(--color-teal-700)] text-white">
          <Sparkles className="size-4" />
        </div>
        <span className="text-sm font-semibold">SmileAI</span>
      </Link>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Link
          href="/generate"
          onClick={() => useGenerateForm.getState().reset()}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[color:var(--color-teal-700)] bg-white px-3 text-xs font-semibold text-[color:var(--color-teal-700)] hover:bg-[color:var(--color-teal-50)] sm:h-10 sm:px-4 sm:text-sm"
        >
          <Sparkles className="size-3.5 sm:size-4" />
          New preview
        </Link>
        <span className="hidden text-xs text-[color:var(--color-warm-500)] sm:inline">
          Dr. Preview Practice
        </span>
        <div className="inline-flex size-9 items-center justify-center rounded-full bg-[color:var(--color-teal-100)] text-sm font-semibold text-[color:var(--color-teal-800)]">
          PP
        </div>
      </div>
    </header>
  );
}
