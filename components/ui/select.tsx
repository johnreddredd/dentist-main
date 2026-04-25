import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-11 w-full appearance-none rounded-xl border border-[color:var(--color-warm-200)] bg-white pl-3.5 pr-10 text-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-teal-600)]",
          "disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[color:var(--color-warm-500)]"
      />
    </div>
  ),
);
Select.displayName = "Select";
