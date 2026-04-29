"use client";

import * as React from "react";
import Link from "next/link";
import {
  Copy,
  ExternalLink,
  Mail,
  MessageSquare,
} from "lucide-react";

interface ReviewSuccessStateProps {
  previewUrl: string;
  caseId: string;
}

export function ReviewSuccessState({
  previewUrl,
  caseId,
}: ReviewSuccessStateProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${previewUrl}`);
    } catch {
      /* ignore */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="review-success-animate rounded-2xl border border-[#E7E5E4] bg-white p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#0F766E] text-white shadow-sm">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-[#0F172A]">Ready to Share</h3>
        <p className="mt-1 text-sm text-[#64748B]">Your patient preview link is live</p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1 rounded-xl border border-[#E7E5E4] bg-[#FAFAF9] px-4 py-3 font-mono text-sm text-[#0F172A]">
          {previewUrl}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#E7E5E4] bg-white px-5 text-sm font-semibold text-[#0F172A] shadow-sm transition-all hover:bg-[#FAFAF9] active:scale-[0.98] sm:w-auto"
        >
          <Copy className="size-4" />
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <Link
          href={`/preview/${caseId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E7E5E4] bg-white px-3 text-sm font-medium text-[#0F172A] shadow-sm transition-all hover:bg-[#FAFAF9] active:scale-[0.98]"
        >
          <ExternalLink className="size-4" />
          Open Patient View
        </Link>
        <OutlineIconButton icon={<MessageSquare className="size-4" />}>Send SMS</OutlineIconButton>
        <OutlineIconButton icon={<Mail className="size-4" />}>Send Email</OutlineIconButton>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-[#64748B]">
        Patient view matches this preview, plus options to call or email your office when enabled.
      </p>
    </div>
  );
}

function OutlineIconButton({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E7E5E4] bg-white px-3 text-sm font-medium text-[#0F172A] shadow-sm transition-all hover:bg-[#FAFAF9] active:scale-[0.98]"
    >
      {icon}
      {children}
    </button>
  );
}
