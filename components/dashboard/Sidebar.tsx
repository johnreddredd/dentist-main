"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderOpen,
  Settings,
  Sparkles,
  BarChart3,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGenerateForm } from "@/lib/stores/generate-form";

const LINKS = [
  { href: "/generate", label: "New Preview", icon: Sparkles, primary: true },
  { href: "/cases", label: "Case Library", icon: FolderOpen },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[#E7E5E4] bg-[#F5F5F4] p-4 lg:flex">
      <Link
        href="/"
        className="mb-6 flex items-center gap-2 rounded-xl px-2 py-2"
      >
        <div className="flex size-9 items-center justify-center rounded-xl bg-[color:var(--color-teal-700)] text-white">
          <Sparkles className="size-5" />
        </div>
        <div>
          <p className="text-base font-semibold leading-none text-[color:var(--color-warm-900)]">
            SmileAI
          </p>
          <p className="text-xs text-[color:var(--color-warm-500)]">
            Clinical preview
          </p>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        {LINKS.map((l) => {
          const Icon = l.icon;
          const active = pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={
                l.href === "/generate"
                  ? () => useGenerateForm.getState().reset()
                  : undefined
              }
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white text-[#0F766E] shadow-sm ring-1 ring-[#E7E5E4]"
                  : l.primary
                    ? "bg-[color:var(--color-teal-700)] text-white hover:bg-[color:var(--color-teal-800)]"
                    : "text-[#57534E] hover:bg-white/70",
              )}
            >
              <Icon className="size-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4">
        <div className="rounded-xl border border-[color:var(--color-warm-200)] bg-[color:var(--color-warm-50)] p-3">
          <p className="text-xs font-medium text-[color:var(--color-warm-700)]">
            Trial — 14 days
          </p>
          <p className="mt-1 text-xs text-[color:var(--color-warm-500)]">
            Upgrade to unlock unlimited previews.
          </p>
          <Link
            href="/settings"
            className="mt-2 inline-flex text-xs font-medium text-[color:var(--color-teal-800)] hover:underline"
          >
            Upgrade plan →
          </Link>
        </div>
        <Link
          href="/login"
          className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-[color:var(--color-warm-500)] hover:bg-[color:var(--color-warm-100)]"
        >
          <LogOut className="size-3.5" />
          Sign out
        </Link>
      </div>
    </aside>
  );
}
