import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-warm-200)]",
        className,
      )}
    >
      <div
        className="h-full bg-[color:var(--color-teal-600)] transition-[width] duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
