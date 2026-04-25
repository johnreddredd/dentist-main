import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "xl";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[color:var(--color-teal-700)] text-white hover:bg-[color:var(--color-teal-800)] shadow-sm",
  secondary:
    "bg-white text-[color:var(--color-warm-900)] border border-[color:var(--color-warm-200)] hover:bg-[color:var(--color-warm-100)]",
  ghost:
    "bg-transparent text-[color:var(--color-warm-900)] hover:bg-[color:var(--color-warm-100)]",
  outline:
    "bg-transparent border border-[color:var(--color-teal-700)] text-[color:var(--color-teal-700)] hover:bg-[color:var(--color-teal-50)]",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  xl: "h-14 px-8 text-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors tap-target",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-teal-600)] focus-visible:ring-offset-2",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}
