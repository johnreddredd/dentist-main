import { CaseLibrary } from "@/components/dashboard/CaseLibrary";

export default function CasesPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--color-warm-900)]">
          Case library
        </h1>
        <p className="text-sm text-[color:var(--color-warm-500)]">
          Every preview you&rsquo;ve generated — filter, review, share with
          patients after approval.
        </p>
      </div>
      <CaseLibrary />
    </div>
  );
}
