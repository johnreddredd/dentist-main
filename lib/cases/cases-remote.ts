import type { SupabaseClient } from "@supabase/supabase-js";
import type { Case } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getBrowserSupabase } from "@/lib/supabase/client";

type CaseRow = {
  id: string;
  user_id: string;
  data: Case;
  updated_at: string;
};

function normalizeRow(row: CaseRow): Case {
  const base = row.data;
  return {
    ...base,
    id: row.id,
    userId: row.user_id,
    updatedAt: row.updated_at,
  };
}

export async function fetchCasesFromSupabase(
  supabase: SupabaseClient,
  userId: string,
): Promise<Case[]> {
  const { data, error } = await supabase
    .from("cases")
    .select("id,user_id,data,updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[cases sync] fetch failed", error);
    return [];
  }

  return (data as CaseRow[] | null)?.map(normalizeRow) ?? [];
}

export async function pushCaseToSupabase(
  supabase: SupabaseClient,
  rowCase: Case,
): Promise<void> {
  const updatedAt = rowCase.updatedAt ?? new Date().toISOString();
  const payload: Case = { ...rowCase, updatedAt };

  const { error } = await supabase.from("cases").upsert(
    {
      id: rowCase.id,
      user_id: rowCase.userId,
      data: payload,
      updated_at: updatedAt,
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("[cases sync] upsert failed", error);
  }
}

export async function deleteCaseFromSupabase(
  supabase: SupabaseClient,
  userId: string,
  caseId: string,
): Promise<void> {
  const { error } = await supabase
    .from("cases")
    .delete()
    .eq("id", caseId)
    .eq("user_id", userId);

  if (error) {
    console.error("[cases sync] delete failed", error);
  }
}

const debouncers = new Map<string, ReturnType<typeof setTimeout>>();

function bumpUpdatedAt(c: Case): Case {
  return { ...c, updatedAt: new Date().toISOString() };
}

/**
 * Debounced remote upsert for a case. Skips when Supabase or session user is unavailable.
 * Pass the latest case resolver so the debounced call reads fresh state.
 */
export function scheduleCaseRemoteUpsert(getLatest: () => Case | undefined): void {
  if (!isSupabaseConfigured()) return;

  const snapshot = getLatest();
  if (!snapshot) return;
  if (!snapshot.userId || snapshot.userId === "local-dev") return;

  const id = snapshot.id;
  const prev = debouncers.get(id);
  if (prev) clearTimeout(prev);

  debouncers.set(
    id,
    setTimeout(() => {
      debouncers.delete(id);
      const supabase = getBrowserSupabase();
      if (!supabase) return;
      void (async () => {
        const fresh = getLatest();
        if (!fresh || !fresh.userId || fresh.userId === "local-dev") return;
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user || session.user.id !== fresh.userId) return;
        await pushCaseToSupabase(supabase, bumpUpdatedAt(fresh));
      })();
    }, 500),
  );
}

/** First-time save for a new case (no debounce). */
export function flushCaseRemoteUpsert(getLatest: () => Case | undefined): void {
  const snapshot = getLatest();
  if (!snapshot) return;
  cancelCaseRemoteDebounce(snapshot.id);
  if (!snapshot.userId || snapshot.userId === "local-dev" || !isSupabaseConfigured()) {
    return;
  }
  const supabase = getBrowserSupabase();
  if (!supabase) return;
  void (async () => {
    const fresh = getLatest();
    if (!fresh || !fresh.userId || fresh.userId === "local-dev") return;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user || session.user.id !== fresh.userId) return;
    await pushCaseToSupabase(supabase, bumpUpdatedAt(fresh));
  })();
}

export function cancelCaseRemoteDebounce(caseId: string): void {
  const t = debouncers.get(caseId);
  if (t) {
    clearTimeout(t);
    debouncers.delete(caseId);
  }
}

export function scheduleCaseRemoteDelete(caseId: string, userId: string): void {
  if (!userId || userId === "local-dev" || !isSupabaseConfigured()) return;
  cancelCaseRemoteDebounce(caseId);
  const supabase = getBrowserSupabase();
  if (!supabase) return;
  void deleteCaseFromSupabase(supabase, userId, caseId);
}

/**
 * Merge server cases with local IndexedDB state, assign missing userIds for local-only rows,
 * persist new local-only rows to Supabase.
 */
export async function syncPullIntoStore(
  supabase: SupabaseClient,
  userId: string,
  getCases: () => Case[],
  replaceCasesWithoutRemoteSync: (cases: Case[]) => void,
): Promise<void> {
  const remote = await fetchCasesFromSupabase(supabase, userId);
  const local = getCases();
  const remoteIds = new Set(remote.map((c) => c.id));

  const localOnly = local
    .filter((c) => !remoteIds.has(c.id))
    .map((c) => ({
      ...c,
      userId,
      updatedAt: c.updatedAt ?? new Date().toISOString(),
    }));

  const merged = [...remote, ...localOnly].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  replaceCasesWithoutRemoteSync(merged);

  for (const c of localOnly) {
    await pushCaseToSupabase(supabase, c);
  }
}
