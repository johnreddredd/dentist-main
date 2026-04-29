import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        // text-base (16px): prevents iOS Safari from auto-zooming the page on focus
        "h-11 w-full rounded-xl border border-[color:var(--color-warm-200)] bg-white px-3.5 text-base",
        "placeholder:text-[color:var(--color-warm-400)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-teal-600)]",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
