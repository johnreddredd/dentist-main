"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PreviewGeneration, RefinePreviewResponse } from "@/types";

const MAX_NOTES = 1000;

const DEFAULT_TITLE = "Adjustment note";
/** Kept empty by default — use a short `heading` + `placeholder` at call sites instead of a wall of text. */
const DEFAULT_DESCRIPTION = "";
const DEFAULT_PLACEHOLDER =
  "Example: Slightly warmer shade, or a small tweak to front tooth length.";
const DEFAULT_SUBMIT_LABEL = "Apply & generate";

interface ReviewRefinePanelProps {
  originalPhotoUrl: string;
  generations: PreviewGeneration[];
  refineBaseId: string;
  onRefineBaseIdChange: (id: string) => void;
  onRefined: (newUrl: string, note: string) => void;
  onBusyChange?: (busy: boolean) => void;
  /** Accessible id for the textarea (unique if multiple panels mount). */
  notesFieldId?: string;
  heading?: string;
  description?: string;
  placeholder?: string;
  submitLabel?: string;
}

export function ReviewRefinePanel({
  originalPhotoUrl,
  generations,
  refineBaseId,
  onRefineBaseIdChange,
  onRefined,
  onBusyChange,
  notesFieldId = "refine-notes",
  heading = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  placeholder = DEFAULT_PLACEHOLDER,
  submitLabel = DEFAULT_SUBMIT_LABEL,
}: ReviewRefinePanelProps) {
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const len = notes.length;
  const trimmed = notes.trim();
  const canSend = trimmed.length > 0 && !pending;

  const baseGen = generations.find((g) => g.id === refineBaseId);
  const currentPreviewUrl = baseGen?.imageUrl ?? "";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend || !currentPreviewUrl) return;
    setError(null);
    setPending(true);
    onBusyChange?.(true);
    try {
      const res = await fetch("/api/refine-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dentistNotes: notes.slice(0, MAX_NOTES),
          currentPreviewUrl,
          originalPhotoUrl,
        }),
      });
      const data = (await res.json()) as RefinePreviewResponse & {
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      onRefined(data.generatedImageUrl, trimmed);
      setNotes("");
    } catch {
      setError("Network error — try again");
    } finally {
      setPending(false);
      onBusyChange?.(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[#E7E5E4] bg-white p-4 shadow-sm sm:p-5"
    >
      {generations.length > 1 ? (
        <div className="mb-4 rounded-xl border border-[#E7E5E4] bg-[#FAFAF9] p-3 sm:p-4">
          <p className="text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
            Refine starting from
          </p>
          <p className="mt-1 text-left text-xs text-[#64748B]">
            Pick which preview image to edit. This can differ from the one
            shown above if you want to branch from an older version.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {generations.map((g) => {
              const on = g.id === refineBaseId;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onRefineBaseIdChange(g.id)}
                  className={cn(
                    "flex max-w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs font-medium transition-all sm:text-sm",
                    on
                      ? "border-[#0F766E] bg-[#ECFDF5] text-[#0F172A]"
                      : "border-[#E7E5E4] bg-white text-[#64748B] hover:border-[#CBD5E1]",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 rounded-full border-2",
                      on
                        ? "border-[#0F766E] bg-[#0F766E]"
                        : "border-[#CBD5E1] bg-white",
                    )}
                  />
                  <span className="min-w-0 truncate">{g.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <label
        htmlFor={notesFieldId}
        className="block text-left text-sm font-medium text-[#0F172A]"
      >
        {heading}
      </label>
      {description.trim() ? (
        <p className="mt-1.5 text-left text-xs leading-relaxed text-[#64748B]">
          {description}
        </p>
      ) : null}
      <textarea
        id={notesFieldId}
        value={notes}
        onChange={(e) => setNotes(e.target.value.slice(0, MAX_NOTES))}
        rows={4}
        disabled={pending}
        placeholder={placeholder}
        className="mt-3 w-full resize-y rounded-xl border border-[#E7E5E4] bg-[#FAFAF9] px-3 py-2.5 text-base text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 disabled:opacity-60"
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`text-xs tabular-nums ${
            len > MAX_NOTES * 0.95 ? "text-amber-700" : "text-[#94A3B8]"
          }`}
        >
          {len} / {MAX_NOTES}
        </span>
        <button
          type="submit"
          disabled={!canSend || !currentPreviewUrl}
          className="inline-flex h-10 min-w-[10rem] items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0D6861] disabled:cursor-not-allowed disabled:bg-[#94A3B8] disabled:opacity-80"
        >
          <Send className="size-4" aria-hidden />
          {pending ? "Generating…" : submitLabel}
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-left text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
