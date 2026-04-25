"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}

export function Toggle({
  checked,
  onCheckedChange,
  label,
  description,
  disabled,
  id,
}: ToggleProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-start gap-3 cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked
            ? "bg-[color:var(--color-teal-600)]"
            : "bg-[color:var(--color-warm-300)]",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-block size-5 transform rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
      {(label || description) && (
        <span className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-[color:var(--color-warm-900)]">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-[color:var(--color-warm-500)]">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
}
