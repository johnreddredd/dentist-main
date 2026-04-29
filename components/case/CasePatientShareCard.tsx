"use client";

import * as React from "react";
import Link from "next/link";
import { Copy, ExternalLink, Mail, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface CasePatientShareCardProps {
  caseId: string;
  className?: string;
}

export function CasePatientShareCard({
  caseId,
  className,
}: CasePatientShareCardProps) {
  const [copied, setCopied] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState("");

  React.useEffect(() => {
    setShareUrl(`${window.location.origin}/preview/${caseId}`);
  }, [caseId]);

  const displayUrl = shareUrl || `/preview/${caseId}`;

  async function handleCopy() {
    const toCopy =
      shareUrl ||
      (typeof window !== "undefined"
        ? `${window.location.origin}/preview/${caseId}`
        : "");
    if (!toCopy) return;
    try {
      await navigator.clipboard.writeText(toCopy);
    } catch {
      /* ignore */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section
      className={cn(
        "rounded-2xl border border-[#E7E5E4] bg-white p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      <h3 className="text-base font-semibold text-[#0F172A]">
        Share patient preview
      </h3>
      <p className="mt-1 text-sm text-[#64748B]">
        Copy the link or open the patient-facing screen. SMS and email sending
        will connect here when you wire your provider.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1 truncate rounded-xl border border-[#E7E5E4] bg-[#FAFAF9] px-4 py-3 font-mono text-xs text-[#0F172A] sm:text-sm">
          {displayUrl}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#E7E5E4] bg-white px-5 text-sm font-semibold text-[#0F172A] shadow-sm transition-all hover:bg-[#FAFAF9] active:scale-[0.98] sm:w-auto"
        >
          <Copy className="size-4" />
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Link
          href={`/preview/${caseId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E7E5E4] bg-white px-3 text-sm font-medium text-[#0F172A] shadow-sm transition-all hover:bg-[#FAFAF9] active:scale-[0.98]"
        >
          <ExternalLink className="size-4 shrink-0" />
          Open preview
        </Link>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E7E5E4] bg-white px-3 text-sm font-medium text-[#0F172A] shadow-sm transition-all hover:bg-[#FAFAF9] active:scale-[0.98]"
        >
          <MessageSquare className="size-4 shrink-0" />
          Send SMS
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E7E5E4] bg-white px-3 text-sm font-medium text-[#0F172A] shadow-sm transition-all hover:bg-[#FAFAF9] active:scale-[0.98]"
        >
          <Mail className="size-4 shrink-0" />
          Send email
        </button>
      </div>
    </section>
  );
}

export default CasePatientShareCard;
