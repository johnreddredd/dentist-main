"use client";

import * as React from "react";
import { CheckCircle2, Shield, User } from "lucide-react";

export function ReviewClinicalConfidence() {
  return (
    <div className="rounded-2xl border border-[#E7E5E4] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-sm font-semibold text-[#0F172A]">Clinical Confidence</h3>
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#0F766E]/10 px-3 py-1 text-xs font-semibold text-[#0F766E]">
        <Shield className="size-3.5" />
        High confidence
      </div>
      <ul className="mt-4 space-y-3">
        {[
          { icon: User, text: "Identity preserved" },
          { icon: CheckCircle2, text: "Treatment-specific changes only" },
          { icon: CheckCircle2, text: "Ready for dentist review" },
        ].map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-2.5 text-sm text-[#64748B]">
            <Icon className="mt-0.5 size-4 shrink-0 text-[#0F766E]" strokeWidth={2} />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
