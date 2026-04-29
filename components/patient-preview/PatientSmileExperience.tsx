"use client";

import * as React from "react";
import { Check, Mail, Phone } from "lucide-react";
import { BeforeAfterSlider } from "@/components/review/before-after-slider";
import { OriginalAspectPhotoFrame } from "@/components/review/original-aspect-photo-frame";
import { PATIENT_WHAT_LOOKS_GOOD } from "@/lib/patient-preview-copy";
import type { PatientShareContact } from "@/lib/cases/patient-utils";
import { cn } from "@/lib/utils";

type CompareMode = "after" | "before" | "split";

const MODES: { id: CompareMode; label: string }[] = [
  { id: "after", label: "After" },
  { id: "before", label: "Before" },
  { id: "split", label: "Split" },
];

/** Frame follows original photo aspect; matches slider and single modes. */
const COMPARE_FRAME_CLASS =
  "patient-preview-frame bg-[#1c1917] ring-1 ring-black/5";

export type { PatientShareContact };

export interface PatientSmileExperienceProps {
  beforeSrc: string;
  afterSrc: string;
  /** Dentist “regenerate” shimmer on the hero image. */
  loading?: boolean;
  /** Extra classes on the `<main>` (e.g. adjust bottom padding when a sticky bar is below). */
  mainClassName?: string;
  /**
   * When set (e.g. on `/preview/[id]` share links), show Call / Email dentist with this info.
   * Omit on in-clinic review so those actions stay generic.
   */
  shareContact?: PatientShareContact;
  /**
   * Replaces the default patient CTA block below “Why this looks real.”
   * Pass `null` on review (pending) to hide that block; pass e.g. `ReviewSuccessState` when approved.
   */
  footer?: React.ReactNode;
  /** Shown below After/Before/Split (e.g. dentist refine form). */
  belowCompareSlot?: React.ReactNode;
}

export function PatientSmileExperience({
  beforeSrc,
  afterSrc,
  loading = false,
  mainClassName,
  shareContact,
  footer,
  belowCompareSlot,
}: PatientSmileExperienceProps) {
  const [introDone, setIntroDone] = React.useState(false);
  const [mode, setMode] = React.useState<CompareMode>("after");

  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIntroDone(true);
      return;
    }
    const t = window.setTimeout(() => setIntroDone(true), 1520);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <main
      className={cn(
        "mx-auto flex max-w-5xl flex-col px-4 pb-12 pt-7 sm:px-6 sm:pb-16 sm:pt-10",
        mainClassName,
      )}
    >
      <div className="text-center">
        <h1 className="mx-auto max-w-[18ch] text-4xl font-semibold leading-[1.05] tracking-tight text-[#0F172A] sm:max-w-none sm:text-5xl">
          Your smile after treatment.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-[#64748B] sm:text-base">
          Designed using your real teeth and your dentist&apos;s plan
        </p>
      </div>

      <div className="relative mx-auto mt-8 w-full sm:mt-10">
        <div className="relative w-full">
          {!introDone ? (
            <OriginalAspectPhotoFrame
              beforeSrc={beforeSrc}
              sizingClassName="max-h-[min(72vh,680px)]"
              className={COMPARE_FRAME_CLASS}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={beforeSrc}
                alt=""
                className="patient-intro-layer-before absolute inset-0 size-full object-contain object-center"
                draggable={false}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={afterSrc}
                alt=""
                className="patient-intro-layer-after absolute inset-0 size-full object-contain object-center"
                draggable={false}
              />
            </OriginalAspectPhotoFrame>
          ) : (
            <>
              {mode === "split" ? (
                <BeforeAfterSlider
                  beforeSrc={beforeSrc}
                  afterSrc={afterSrc}
                  beforeLabel="Before"
                  afterLabel="After"
                  className="w-full"
                  frameClassName={cn(COMPARE_FRAME_CLASS, "md:max-w-[90vw] lg:max-w-[880px]")}
                  hintText="Drag the handle to compare before and after"
                />
              ) : (
                <OriginalAspectPhotoFrame
                  beforeSrc={beforeSrc}
                  sizingClassName="max-h-[min(72vh,680px)]"
                  className={cn(
                    COMPARE_FRAME_CLASS,
                    "md:max-w-[90vw] lg:max-w-[880px]",
                    mode === "after" && "patient-smile-focus",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={beforeSrc}
                    alt=""
                    className={cn(
                      "absolute inset-0 size-full object-contain object-center transition-opacity duration-500 ease-out",
                      mode === "before" ? "opacity-100" : "opacity-0",
                    )}
                    draggable={false}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={afterSrc}
                    alt=""
                    className={cn(
                      "absolute inset-0 size-full object-contain object-center transition-opacity duration-500 ease-out",
                      mode === "after"
                        ? "opacity-100 patient-after-pop"
                        : "opacity-0",
                    )}
                    draggable={false}
                  />
                  <div className="pointer-events-none absolute inset-0 review-vignette" />
                </OriginalAspectPhotoFrame>
              )}

              <div
                className="mt-5 flex justify-center px-1"
                role="tablist"
                aria-label="Before, after, and split comparison"
              >
                <div className="inline-flex max-w-full flex-wrap justify-center gap-1 rounded-full border border-[#E7E5E4] bg-white p-1 shadow-sm">
                  {MODES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      role="tab"
                      aria-selected={mode === m.id}
                      onClick={() => setMode(m.id)}
                      className={cn(
                        "min-h-11 min-w-[3.75rem] rounded-full px-3 text-xs font-semibold transition-all duration-200 active:scale-[0.98] sm:min-w-[4.5rem] sm:px-4 sm:text-sm",
                        mode === m.id
                          ? "bg-[#0F766E] text-white shadow-sm"
                          : "text-[#64748B] hover:bg-[#FAFAFA] hover:text-[#0F172A]",
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              {belowCompareSlot ? (
                <div className="mx-auto mt-6 w-full max-w-2xl px-0">
                  {belowCompareSlot}
                </div>
              ) : null}
            </>
          )}

          {loading && introDone ? (
            <div
              className="pointer-events-none absolute inset-0 z-30 rounded-2xl review-skeleton opacity-[0.85]"
              aria-busy
              aria-label="Refreshing preview"
            />
          ) : null}
        </div>
      </div>

      <section className="mx-auto mt-10 w-full max-w-xl sm:mt-12">
        <div className="rounded-2xl border border-[#E7E5E4] bg-[#FAFAFA] p-5 shadow-sm sm:p-7">
          <h2 className="text-center text-lg font-semibold text-[#0F172A] sm:text-xl">
            Why this looks real
          </h2>
          <ul className="mt-5 space-y-3.5">
            {PATIENT_WHAT_LOOKS_GOOD.map((line) => (
              <li
                key={line}
                className="flex gap-3 text-left text-sm leading-relaxed text-[#334155] sm:text-base"
              >
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-[#0F766E] ring-1 ring-[#A7F3D0]/60">
                  <Check className="size-3.5" strokeWidth={2.5} />
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {footer !== undefined ? (
        footer ? (
          <div className="mx-auto mt-10 w-full max-w-2xl sm:mt-12">{footer}</div>
        ) : null
      ) : (
        <div className="mx-auto mt-10 w-full max-w-xl sm:mt-12">
          {shareContact &&
          (shareContact.phoneTel ||
            shareContact.email ||
            shareContact.phoneDisplay) ? (
            <div className="flex flex-col gap-4 rounded-2xl border border-[#E7E5E4] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-center text-base font-semibold text-[#0F172A] sm:text-lg">
                Contact your dental team
              </h2>
              <p className="text-center text-sm text-[#64748B]">
                Call or email the office about this preview and your next
                visit.
              </p>
              {shareContact.phoneDisplay ? (
                <p className="text-center font-mono text-base font-medium text-[#0F172A]">
                  {shareContact.phoneDisplay}
                </p>
              ) : null}
              <div
                className={cn(
                  "grid gap-3",
                  shareContact.phoneTel && shareContact.email
                    ? "sm:grid-cols-2"
                    : "grid-cols-1",
                )}
              >
                {shareContact.phoneTel ? (
                  <a
                    href={`tel:${shareContact.phoneTel}`}
                    className="inline-flex h-12 min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#E7E5E4] bg-white px-4 text-sm font-semibold text-[#334155] shadow-sm transition-all hover:border-[#CBD5E1] hover:bg-[#FAFAFA] active:scale-[0.98]"
                  >
                    <Phone
                      className="size-4 shrink-0 text-[#0F766E]"
                      aria-hidden
                    />
                    Call the office
                  </a>
                ) : null}
                {shareContact.email ? (
                  <a
                    href={`mailto:${shareContact.email}?subject=My%20smile%20preview`}
                    className="inline-flex h-12 min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#E7E5E4] bg-white px-4 text-sm font-semibold text-[#334155] shadow-sm transition-all hover:border-[#CBD5E1] hover:bg-[#FAFAFA] active:scale-[0.98]"
                  >
                    <Mail
                      className="size-4 shrink-0 text-[#0F766E]"
                      aria-hidden
                    />
                    Email the office
                  </a>
                ) : null}
              </div>
              {shareContact.email ? (
                <p className="text-center text-[11px] text-[#94A3B8] sm:text-xs">
                  {shareContact.email}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="rounded-2xl border border-[#E7E5E4] bg-[#FAFAFA] px-5 py-6 text-center text-sm leading-relaxed text-[#64748B]">
              Your dentist can add a phone number and email to this preview so
              you can reach the practice here.
            </p>
          )}
          <p className="mx-auto mt-6 max-w-md text-center text-xs leading-relaxed text-[#64748B] sm:text-sm">
            Next step: your dentist will walk you through your treatment plan.
          </p>
          <p className="mx-auto mt-6 max-w-md text-center text-[11px] leading-relaxed text-[#94A3B8] sm:text-xs">
            Visual preview only. Your dentist will guide your final treatment.
          </p>
        </div>
      )}
    </main>
  );
}
