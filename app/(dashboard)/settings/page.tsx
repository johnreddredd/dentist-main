import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/types";
import { Check } from "lucide-react";

import { CasesBackupCard } from "@/components/settings/CasesBackupCard";

export default function SettingsPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--color-warm-900)]">
          Settings
        </h1>
        <p className="text-sm text-[color:var(--color-warm-500)]">
          Practice details, team seats, and billing.
        </p>
      </div>

      <CasesBackupCard />

      <Card>
        <CardHeader>
          <CardTitle>Practice</CardTitle>
          <CardDescription>
            Dentist-level account settings will live here once Supabase auth is wired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Row label="Practice name" value="Preview Practice" />
            <Row label="Primary dentist" value="Dr. Demo" />
            <Row label="Email" value="demo@example.com" />
            <Row label="Current plan" value="Trial" />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription tiers</CardTitle>
          <CardDescription>
            14-day free trial. No credit card required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.tier}
                className="flex flex-col gap-3 rounded-2xl border border-[color:var(--color-warm-200)] bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-[color:var(--color-warm-900)]">
                    {p.name}
                  </p>
                  {p.tier === "practice" && (
                    <Badge variant="teal">Most popular</Badge>
                  )}
                </div>
                <p className="text-3xl font-semibold text-[color:var(--color-warm-900)]">
                  ${p.price}
                  <span className="text-base font-normal text-[color:var(--color-warm-500)]">
                    /mo
                  </span>
                </p>
                <p className="text-sm text-[color:var(--color-warm-600)]">
                  {p.description}
                </p>
                <ul className="mt-1 space-y-1.5 text-sm">
                  <Bullet>
                    {p.previewsPerMonth === "unlimited"
                      ? "Unlimited previews"
                      : `${p.previewsPerMonth} previews / month`}
                  </Bullet>
                  <Bullet>
                    {p.seats} dentist seat{p.seats === 1 ? "" : "s"}
                  </Bullet>
                  {p.tier === "multi_location" && (
                    <Bullet>Priority support</Bullet>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col rounded-xl bg-[color:var(--color-warm-50)] px-3 py-2">
      <dt className="text-xs text-[color:var(--color-warm-500)]">{label}</dt>
      <dd className="text-sm font-medium text-[color:var(--color-warm-900)]">
        {value}
      </dd>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="inline-flex items-start gap-2 text-[color:var(--color-warm-700)]">
      <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--color-teal-700)]" />
      <span>{children}</span>
    </li>
  );
}
