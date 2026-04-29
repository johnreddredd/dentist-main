"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Menu,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGenerateForm } from "@/lib/stores/generate-form";

const MOBILE_LINKS = [
  { href: "/generate", label: "New Preview", icon: Sparkles },
  { href: "/cases", label: "Patient Library", icon: Users },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function TopBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  React.useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-[color:var(--color-warm-200)] bg-white/80 px-4 backdrop-blur lg:h-16 lg:px-6">
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-[color:var(--color-warm-100)] lg:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
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
            href="/settings"
            aria-label="Settings"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[color:var(--color-warm-200)] bg-white px-3 text-xs font-medium text-[color:var(--color-warm-800)] hover:bg-[color:var(--color-warm-50)] sm:h-10 sm:px-3.5 sm:text-sm"
          >
            <Settings className="size-3.5 sm:size-4" aria-hidden />
            <span className="hidden sm:inline">Settings</span>
          </Link>
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

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="absolute inset-y-0 left-0 flex w-[min(18rem,calc(100vw-2.5rem))] flex-col border-r border-[color:var(--color-warm-200)] bg-[#F5F5F4] shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
          >
            <div className="flex items-center justify-between border-b border-[#E7E5E4] px-4 py-3">
              <span className="text-sm font-semibold text-[color:var(--color-warm-900)]">
                Menu
              </span>
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-white"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <X className="size-5 text-[color:var(--color-warm-700)]" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-3">
              {MOBILE_LINKS.map((l) => {
                const Icon = l.icon;
                const active =
                  pathname === l.href || pathname.startsWith(`${l.href}/`);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => {
                      if (l.href === "/generate") {
                        useGenerateForm.getState().reset();
                      }
                      setMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors min-h-[48px]",
                      active
                        ? "bg-white text-[#0F766E] shadow-sm ring-1 ring-[#E7E5E4]"
                        : l.href === "/generate"
                          ? "bg-[color:var(--color-teal-700)] text-white hover:bg-[color:var(--color-teal-800)]"
                          : "text-[#57534E] hover:bg-white/70",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
