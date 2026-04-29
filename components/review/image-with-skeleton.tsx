"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

export function ImageWithSkeleton({
  src,
  alt,
  className,
  imgClassName,
}: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!loaded && (
        <div
          className="review-skeleton absolute inset-0 rounded-xl"
          aria-hidden
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "size-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName
        )}
        onLoad={() => setLoaded(true)}
        draggable={false}
      />
    </div>
  );
}
