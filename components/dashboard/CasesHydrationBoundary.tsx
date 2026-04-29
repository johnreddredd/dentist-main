"use client";

import * as React from "react";
import {
  useCasesStore,
  waitForCasesPersistWrites,
} from "@/lib/stores/cases";

/**
 * Wait for IndexedDB rehydration before rendering dashboard pages.
 * Avoids a first paint with an empty `cases` array (then “losing” edits on quick refresh).
 */
export function CasesHydrationBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (useCasesStore.persist.hasHydrated()) {
      setReady(true);
      return;
    }
    return useCasesStore.persist.onFinishHydration(() => setReady(true));
  }, []);

  React.useEffect(() => {
    function onHidden() {
      if (document.visibilityState === "hidden") {
        void waitForCasesPersistWrites();
      }
    }
    document.addEventListener("visibilitychange", onHidden);
    return () => document.removeEventListener("visibilitychange", onHidden);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 text-sm text-[#64748B]">
        Loading your workspace…
      </div>
    );
  }

  return <>{children}</>;
}
