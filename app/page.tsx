import Link from "next/link";
import {
  ArrowRight,
  Check,
  Eye,
  Lock,
  Sparkles,
  Stethoscope,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-[color:var(--color-warm-200)] bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[color:var(--color-teal-700)] text-white">
              <Sparkles className="size-5" />
            </div>
            <span className="text-base font-semibold">SmileAI</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            <a
              href="#how-it-works"
              className="text-[color:var(--color-warm-700)] hover:text-[color:var(--color-warm-900)]"
            >
              How it works
            </a>
            <a
              href="#modes"
              className="text-[color:var(--color-warm-700)] hover:text-[color:var(--color-warm-900)]"
            >
              Three modes
            </a>
            <a
              href="#pricing"
              className="text-[color:var(--color-warm-700)] hover:text-[color:var(--color-warm-900)]"
            >
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-full px-3 py-1.5 text-sm text-[color:var(--color-warm-700)] hover:bg-[color:var(--color-warm-100)] sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[color:var(--color-teal-700)] px-4 text-sm font-medium text-white hover:bg-[color:var(--color-teal-800)]"
            >
              Start free trial <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 text-center lg:px-8 lg:pt-24">
          <Badge variant="teal" className="mx-auto mb-6">
            <Stethoscope className="size-3" />
            Built for cosmetic &amp; restorative dentists
          </Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-[color:var(--color-warm-900)] sm:text-5xl lg:text-6xl">
            Show patients a{" "}
            <span className="text-[color:var(--color-teal-700)]">
              realistic smile preview
            </span>{" "}
            before they commit.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-[color:var(--color-warm-600)] sm:text-lg">
            SmileAI is the only smile previewer that is{" "}
            <strong>treatment-constrained</strong>. Pick the procedure, tag the
            teeth, choose a realism mode — the AI renders only what you can
            actually deliver.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[color:var(--color-teal-700)] px-6 text-base font-medium text-white hover:bg-[color:var(--color-teal-800)]"
            >
              Start 14-day free trial <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/generate"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[color:var(--color-warm-200)] bg-white px-6 text-base font-medium text-[color:var(--color-warm-900)] hover:bg-[color:var(--color-warm-100)]"
            >
              Try a demo preview
            </Link>
          </div>
          <p className="mt-3 text-xs text-[color:var(--color-warm-500)]">
            No credit card required.
          </p>
        </div>

        {/* Dashboard mock */}
        <div className="mx-auto max-w-5xl px-4 pb-16 lg:px-8">
          <div className="relative rounded-3xl border border-[color:var(--color-warm-200)] bg-gradient-to-br from-[color:var(--color-teal-50)] to-white p-3 shadow-xl">
            <div className="rounded-2xl border border-[color:var(--color-warm-200)] bg-white">
              <div className="flex items-center gap-1.5 border-b border-[color:var(--color-warm-200)] px-4 py-2">
                <div className="size-2.5 rounded-full bg-red-300" />
                <div className="size-2.5 rounded-full bg-amber-300" />
                <div className="size-2.5 rounded-full bg-emerald-300" />
              </div>
              <div className="grid grid-cols-1 gap-0 md:grid-cols-[1fr_260px]">
                <div className="flex aspect-[5/3] items-center justify-center bg-[color:var(--color-warm-100)]">
                  <p className="text-sm text-[color:var(--color-warm-500)]">
                    [ live preview canvas ]
                  </p>
                </div>
                <div className="space-y-3 border-t border-[color:var(--color-warm-200)] p-5 md:border-l md:border-t-0">
                  <p className="text-sm font-semibold">This preview assumes</p>
                  {[
                    "Porcelain veneers — #7, #8, #9, #10",
                    "Shade: VITA A2 (moderate cap)",
                    "No gum surgery",
                    "No whitening on untreated teeth",
                  ].map((b) => (
                    <div
                      key={b}
                      className="flex gap-2 text-xs text-[color:var(--color-warm-700)]"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[color:var(--color-teal-600)]" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 lg:px-8"
      >
        <h2 className="mx-auto max-w-2xl text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          Four screens. Three guardrails. One honest preview.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[color:var(--color-warm-600)]">
          Before any pixel is generated, your inputs run through a constraint
          engine that prevents clinically impossible outputs.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Feature
            icon={Workflow}
            title="Treatment-constrained"
            body="Whitening stays color-only. Veneers stay on the selected teeth. Implants replace only what's missing."
          />
          <Feature
            icon={Eye}
            title="Transparency layer"
            body="Every preview ships with an Assumption Box — every input, exclusion, and rule the engine applied."
          />
          <Feature
            icon={Lock}
            title="Dentist-approved gate"
            body="Patients never see a preview until you approve it. Adjust, regenerate, or sign off."
          />
        </div>
      </section>

      {/* Modes */}
      <section
        id="modes"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 lg:px-8"
      >
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Three modes for three conversations
        </h2>
        <p className="mt-3 max-w-xl text-[color:var(--color-warm-600)]">
          Same patient, same treatment, three levels of realism — so the
          preview matches the budget you&rsquo;re discussing.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <ModeCard
            title="Conservative"
            tier="$12–15K budget restorative"
            shade="VITA A3"
            bullets={[
              "Preserves imperfections, age-appropriate",
              "Natural variation, slight asymmetry",
            ]}
          />
          <ModeCard
            title="Moderate"
            tier="$18–25K mid-tier"
            shade="VITA A2"
            highlight
            bullets={[
              "Clean natural white with subtle variation",
              "Quality dentistry aesthetic",
            ]}
          />
          <ModeCard
            title="Aspirational"
            tier="$40–60K All-on-4 / full zirconia"
            shade="VITA BL1"
            bullets={[
              "Uniform polished prosthetic",
              "Auto-disclaimer overlay",
            ]}
          />
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 lg:px-8"
      >
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Simple, practice-scale pricing
        </h2>
        <p className="mt-3 max-w-xl text-[color:var(--color-warm-600)]">
          14-day trial. No credit card. Upgrade any time from Settings.
        </p>

        <div className="mt-10">
          <Link
            href="/settings"
            className="text-sm font-medium text-[color:var(--color-teal-800)] hover:underline"
          >
            View plan details in the dashboard →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-[color:var(--color-teal-700)] px-6 py-12 text-center text-white sm:px-12">
          <h3 className="text-2xl font-semibold sm:text-3xl">
            Ready to show patients a preview they&rsquo;ll trust?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/80">
            Start generating dentist-approved smile previews in minutes.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-base font-medium text-[color:var(--color-teal-900)] hover:bg-[color:var(--color-warm-100)]"
            >
              Start free trial <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/generate"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-base font-medium text-white hover:bg-white/10"
            >
              Try a demo preview
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[color:var(--color-warm-200)] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-[color:var(--color-warm-500)] sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} SmileAI. Clinical preview tool.</p>
          <p>Visual representation only. Not a treatment plan.</p>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-warm-200)] bg-white p-6">
      <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-[color:var(--color-teal-50)] text-[color:var(--color-teal-700)]">
        <Icon className="size-5" />
      </div>
      <p className="text-base font-semibold text-[color:var(--color-warm-900)]">
        {title}
      </p>
      <p className="mt-1 text-sm text-[color:var(--color-warm-600)]">{body}</p>
    </div>
  );
}

function ModeCard({
  title,
  tier,
  shade,
  bullets,
  highlight,
}: {
  title: string;
  tier: string;
  shade: string;
  bullets: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "rounded-2xl border p-6 " +
        (highlight
          ? "border-[color:var(--color-teal-600)] bg-[color:var(--color-teal-50)]"
          : "border-[color:var(--color-warm-200)] bg-white")
      }
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-[color:var(--color-warm-900)]">
          {title}
        </p>
        {highlight && <Badge variant="teal">Default</Badge>}
      </div>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[color:var(--color-teal-800)]">
        {tier}
      </p>
      <p className="mt-3 text-sm font-medium text-[color:var(--color-warm-700)]">
        {shade}
      </p>
      <ul className="mt-3 space-y-1.5 text-sm text-[color:var(--color-warm-600)]">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--color-teal-700)]" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
