"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface OriginalAspectPhotoFrameProps {
  /** Original patient photo — intrinsic aspect ratio defines the compare frame (after is letterboxed to match). */
  beforeSrc: string;
  className?: string;
  /** Extra classes on the invisible sizing `<img>` (e.g. different max-height). */
  sizingClassName?: string;
  children: React.ReactNode;
}

/**
 * Frame size follows the before image (clamped by max width/height). Children are absolutely
 * stacked with `inset-0` and should use `object-contain object-center` for honest before/after.
 */
export function OriginalAspectPhotoFrame({
  beforeSrc,
  className,
  sizingClassName,
  children,
}: OriginalAspectPhotoFrameProps) {
  return (
    <div className="flex w-full justify-center">
      <div
        className={cn("relative mx-auto max-w-full overflow-hidden", className)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeSrc}
          alt=""
          aria-hidden
          draggable={false}
          className={cn(
            "pointer-events-none block h-auto max-h-[min(85vh,920px)] w-auto max-w-full min-h-[200px] min-w-[160px] select-none opacity-0",
            sizingClassName,
          )}
        />
        <div className="absolute inset-0 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
