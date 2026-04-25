import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "teal" | "warning" | "success" | "muted";

const variants: Record<Variant, string> = {
  default:
    "bg-[color:var(--color-warm-100)] text-[color:var(--color-warm-800)]",
  teal: "bg-[color:var(--color-teal-50)] text-[color:var(--color-teal-800)] border border-[color:var(--color-teal-200)]",
  warning: "bg-amber-50 text-amber-900 border border-amber-200",
  success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  muted: "bg-transparent text-[color:var(--color-warm-500)]",
};

export function Badge({
  variant = "default",
  className,
  ...props
}: {
  variant?: Variant;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
