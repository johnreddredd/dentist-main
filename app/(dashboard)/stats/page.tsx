import { Stats } from "@/components/dashboard/Stats";

export default function StatsPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--color-warm-900)]">
          Stats
        </h1>
        <p className="text-sm text-[color:var(--color-warm-500)]">
          Practice-wide analytics across every preview you&rsquo;ve created.
        </p>
      </div>
      <Stats />
    </div>
  );
}
