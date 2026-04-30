"use client";

import * as React from "react";
import type { User } from "@supabase/supabase-js";
import { syncPullIntoStore } from "@/lib/cases/cases-remote";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useCasesStore } from "@/lib/stores/cases";

export type AuthContextValue = {
  user: User | null;
  loading: boolean;
};

const AuthContext = React.createContext<AuthContextValue>({
  user: null,
  loading: false,
});

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const supabase = getBrowserSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const client = supabase;

    let cancelled = false;
    let authSubscription: { unsubscribe: () => void } | undefined;
    let removePersistListener: (() => void) | undefined;

    async function pullForUser(userId: string) {
      if (cancelled) return;
      await syncPullIntoStore(
        client,
        userId,
        () => useCasesStore.getState().cases,
        (cases) => useCasesStore.getState().replaceCasesFromServerPull(cases),
      );
    }

    function startAuthListener() {
      if (cancelled) return;
      const { data } = client.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "INITIAL_SESSION") {
            setUser(session?.user ?? null);
            setLoading(false);
            if (session?.user) await pullForUser(session.user.id);
            return;
          }
          setUser(session?.user ?? null);
          if (event === "SIGNED_IN" && session?.user) {
            await pullForUser(session.user.id);
          }
        },
      );
      authSubscription = data.subscription;
    }

    if (useCasesStore.persist.hasHydrated()) {
      startAuthListener();
    } else {
      removePersistListener = useCasesStore.persist.onFinishHydration(() => {
        startAuthListener();
      });
    }

    return () => {
      cancelled = true;
      removePersistListener?.();
      authSubscription?.unsubscribe();
    };
  }, [mounted]);

  const contextValue = React.useMemo(
    () =>
      mounted
        ? { user, loading }
        : { user: null as User | null, loading: true },
    [mounted, user, loading],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthUser(): AuthContextValue {
  return React.useContext(AuthContext);
}
