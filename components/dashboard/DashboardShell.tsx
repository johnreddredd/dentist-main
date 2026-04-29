"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { CasesHydrationBoundary } from "@/components/dashboard/CasesHydrationBoundary";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { CaseDetailTopBar } from "@/components/case/CaseDetailTopBar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isCaseReview = /^\/cases\/[^/]+\/review\/?$/.test(pathname);
  const isCaseDecision = /^\/cases\/[^/]+$/.test(pathname);

  if (isCaseReview) {
    return (
      <CasesHydrationBoundary>
        <div className="min-h-screen bg-[#FAFAF9] font-sans text-[#0F172A] antialiased">
          {children}
        </div>
      </CasesHydrationBoundary>
    );
  }

  return (
    <CasesHydrationBoundary>
      <div className="flex min-h-screen bg-[#FAFAF9]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          {isCaseDecision ? <CaseDetailTopBar /> : <TopBar />}
          <main className="flex-1 p-3 sm:p-5 lg:px-8 lg:py-6">
            {children}
          </main>
        </div>
      </div>
    </CasesHydrationBoundary>
  );
}
