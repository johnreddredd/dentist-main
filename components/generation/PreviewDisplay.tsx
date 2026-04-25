"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  originalUrl: string;
  generatedUrl: string;
  loading?: boolean;
}

export function PreviewDisplay({ originalUrl, generatedUrl, loading }: Props) {
  const [view, setView] = useState<"before" | "after" | "split">("after");

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TabButton active={view === "before"} onClick={() => setView("before")}>
          Before
        </TabButton>
        <TabButton active={view === "after"} onClick={() => setView("after")}>
          After
        </TabButton>
        <TabButton active={view === "split"} onClick={() => setView("split")}>
          Split
        </TabButton>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-warm-200)] bg-black">
        {loading && <GenerationShimmer />}

        {!loading && view !== "split" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={view === "before" ? originalUrl : generatedUrl}
            alt={view === "before" ? "Original patient photo" : "Generated preview"}
            className="mx-auto block max-h-[520px] w-auto"
          />
        )}

        {!loading && view === "split" && (
          <div className="grid grid-cols-2 gap-0">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={originalUrl}
                alt="Original"
                className="block h-full max-h-[520px] w-full object-cover"
              />
              <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-[color:var(--color-warm-800)]">
                Before
              </span>
            </div>
            <div className="relative border-l-2 border-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedUrl}
                alt="Generated"
                className="block h-full max-h-[520px] w-full object-cover"
              />
              <span className="absolute right-2 top-2 rounded-full bg-[color:var(--color-teal-700)] px-2 py-0.5 text-xs font-medium text-white">
                After
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-[color:var(--color-teal-700)] text-white"
          : "bg-white text-[color:var(--color-warm-700)] border border-[color:var(--color-warm-200)] hover:bg-[color:var(--color-warm-100)]",
      )}
    >
      {children}
    </button>
  );
}

function GenerationShimmer() {
  return (
    <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-[color:var(--color-warm-200)] to-[color:var(--color-warm-100)]">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex gap-1.5">
          <span className="block size-2 animate-pulse rounded-full bg-[color:var(--color-teal-600)]" />
          <span
            className="block size-2 animate-pulse rounded-full bg-[color:var(--color-teal-600)]"
            style={{ animationDelay: "0.15s" }}
          />
          <span
            className="block size-2 animate-pulse rounded-full bg-[color:var(--color-teal-600)]"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
        <p className="text-sm text-[color:var(--color-warm-700)]">
          Generating preview — 30–60s
        </p>
      </div>
    </div>
  );
}
