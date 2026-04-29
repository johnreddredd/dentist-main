"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { BeforeAfterSlider } from "@/components/review/before-after-slider";
import { ImageWithSkeleton } from "@/components/review/image-with-skeleton";
import { OriginalAspectPhotoFrame } from "@/components/review/original-aspect-photo-frame";
import { downloadImageFromUrl } from "@/lib/download-image";
import { cn } from "@/lib/utils";

export type PreviewViewMode = "before" | "after" | "split";

interface CasePreviewHeroProps {
  beforeSrc: string;
  afterSrc: string;
  loading?: boolean;
  mode: PreviewViewMode;
  onModeChange: (m: PreviewViewMode) => void;
  /** When set, shows a download control for the result (after) image. */
  caseId?: string;
}

const MODES: { id: PreviewViewMode; label: string }[] = [
  { id: "before", label: "Before" },
  { id: "after", label: "After" },
  { id: "split", label: "Split" },
];

export function CasePreviewHero({
  beforeSrc,
  afterSrc,
  loading = false,
  mode,
  onModeChange,
  caseId,
}: CasePreviewHeroProps) {
  const [downloading, setDownloading] = React.useState(false);

  async function onDownloadResult() {
    if (!afterSrc || loading || downloading) return;
    setDownloading(true);
    try {
      await downloadImageFromUrl(
        afterSrc,
        caseId ? `smile-preview-${caseId}.jpg` : "smile-preview.jpg",
      );
    } finally {
      setDownloading(false);
    }
  }

  const showDownload = Boolean(caseId && afterSrc && !loading);

  return (
    <div className="mx-auto w-full max-w-[53rem]">
      <div className="mb-3 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
        <div
          className="flex justify-center"
          role="tablist"
          aria-label="Preview mode"
        >
          <div className="inline-flex rounded-full border border-[#E7E5E4] bg-[#F5F5F4] p-1 shadow-sm">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={mode === m.id}
                onClick={() => onModeChange(m.id)}
                className={cn(
                  "relative min-h-10 min-w-[4.5rem] rounded-full px-4 text-xs font-semibold transition-all duration-200 sm:text-sm",
                  mode === m.id
                    ? "bg-white text-[#0F172A] shadow-sm"
                    : "text-[#64748B] hover:text-[#0F172A]",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        {showDownload ? (
          <button
            type="button"
            onClick={() => void onDownloadResult()}
            disabled={downloading}
            className={cn(
              "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-[#E7E5E4] bg-white px-4 text-xs font-semibold text-[#0F172A] shadow-sm transition-colors hover:border-[#0F766E]/40 hover:bg-[#FAFAF9] disabled:opacity-60 sm:text-sm",
            )}
          >
            <Download className="size-4 text-[#0F766E]" strokeWidth={2} />
            {downloading ? "Downloading…" : "Download result"}
          </button>
        ) : null}
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white shadow-sm ring-1 ring-black/[0.03]",
          loading && "pointer-events-none opacity-80",
        )}
      >
        {loading ? (
          <div className="review-skeleton min-h-[360px] w-full sm:min-h-[450px]" />
        ) : mode === "split" ? (
          <div className="p-2 sm:p-3">
            <BeforeAfterSlider
              beforeSrc={beforeSrc}
              afterSrc={afterSrc}
              showHint={false}
              className="w-full"
              frameClassName="rounded-xl bg-[#F5F5F4]"
            />
          </div>
        ) : (
          <div className="review-vignette p-2 sm:p-3">
            <OriginalAspectPhotoFrame
              beforeSrc={beforeSrc}
              className="rounded-xl bg-[#F5F5F4]"
            >
              <ImageWithSkeleton
                src={mode === "before" ? beforeSrc : afterSrc}
                alt=""
                className="absolute inset-0"
                imgClassName="object-contain object-center"
              />
            </OriginalAspectPhotoFrame>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-[#64748B]">
        This is how the patient could look after treatment.
      </p>
    </div>
  );
}
