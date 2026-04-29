"use client";

import * as React from "react";
import { ImageWithSkeleton } from "@/components/review/image-with-skeleton";
import { OriginalAspectPhotoFrame } from "@/components/review/original-aspect-photo-frame";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  /** Extra classes on the aspect frame (rounding, shadow, vignette). */
  frameClassName?: string;
  showHint?: boolean;
  hintText?: string;
}

/**
 * Before/after: drag updates clip-path on the "before" layer.
 * Frame size and aspect follow the original (before) photo so both images use the same scale (object-contain).
 */
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
  frameClassName,
  showHint = true,
  hintText = "Drag to compare reference and preview",
}: BeforeAfterSliderProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [split, setSplit] = React.useState(50);
  const [dragging, setDragging] = React.useState(false);

  const setFromClientX = React.useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    const pct = Math.min(99, Math.max(1, ((clientX - left) / width) * 100));
    setSplit(pct);
  }, []);

  React.useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => setFromClientX(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, setFromClientX]);

  const clipRight = 100 - split;

  return (
    <div className={cn("relative select-none", className)}>
      <OriginalAspectPhotoFrame
        beforeSrc={beforeSrc}
        className={cn("bg-[#1c1917] review-vignette", frameClassName)}
      >
        <div
          ref={containerRef}
          className="relative h-full w-full cursor-ew-resize touch-pan-y"
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
            setDragging(true);
            setFromClientX(e.clientX);
          }}
          onPointerMove={(e) => dragging && setFromClientX(e.clientX)}
          onPointerUp={(e) => {
            try {
              (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
            } catch {
              /* not captured */
            }
            setDragging(false);
          }}
          onPointerCancel={() => setDragging(false)}
          onLostPointerCapture={() => setDragging(false)}
        >
          <ImageWithSkeleton
            src={afterSrc}
            alt=""
            className="pointer-events-none absolute inset-0"
            imgClassName="object-contain object-center"
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{ clipPath: `inset(0 ${clipRight}% 0 0)` }}
          >
            <ImageWithSkeleton
              src={beforeSrc}
              alt=""
              className="absolute inset-0"
              imgClassName="object-contain object-center"
            />
          </div>

          <div
            className="absolute bottom-0 top-0 w-px bg-white/90 shadow-[0_0_16px_rgba(15,23,42,0.12)]"
            style={{ left: `${split}%`, transform: "translateX(-50%)" }}
          >
            <div
              className={cn(
                "absolute left-1/2 top-1/2 flex size-11 min-h-[44px] min-w-[44px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#0F766E] text-white shadow-md transition-transform duration-150 ease-out active:scale-95",
                dragging ? "scale-[0.97]" : "scale-100",
              )}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden
              >
                <path d="M9 5v14M15 5v14" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="pointer-events-none absolute left-3 top-14 rounded-lg bg-[#0F172A]/75 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm sm:top-16">
            {beforeLabel}
          </div>
          <div className="pointer-events-none absolute right-3 top-14 rounded-lg bg-[#0F766E]/92 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm sm:top-16">
            {afterLabel}
          </div>
        </div>
      </OriginalAspectPhotoFrame>
      {showHint ? (
        <p className="mt-2.5 text-center text-xs text-[#64748B]">{hintText}</p>
      ) : null}
    </div>
  );
}
