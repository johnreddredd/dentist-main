import { PatientLibrary } from "@/components/dashboard/PatientLibrary";
import { CasesBackupCard } from "@/components/settings/CasesBackupCard";

export default function CasesPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--color-warm-900)]">
          Patient library
        </h1>
        <p className="text-sm text-[color:var(--color-warm-500)]">
          Every preview in your office — search by patient name, chart #, or
          contact info. Data stays on this device until you connect a practice
          database.
        </p>
      </div>
      <CasesBackupCard />
      <PatientLibrary />
    </div>
  );
}
