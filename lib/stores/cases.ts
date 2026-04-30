"use client";

import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import {
  flushCaseRemoteUpsert,
  scheduleCaseRemoteDelete,
  scheduleCaseRemoteUpsert,
} from "@/lib/cases/cases-remote";
import localforage from "localforage";
import type { Case } from "@/types";

interface CasesState {
  cases: Case[];
  addCase: (c: Case) => void;
  updateCase: (id: string, patch: Partial<Case>) => void;
  removeCase: (id: string) => void;
  getCase: (id: string) => Case | undefined;
  /** Replace entire library (e.g. restore backup). */
  setCases: (cases: Case[]) => void;
  /** Upsert by case id; imported cases listed first. */
  mergeCases: (incoming: Case[]) => void;
  /** Replace cases after a server pull without triggering remote upserts. */
  replaceCasesFromServerPull: (cases: Case[]) => void;
}

type CasesPersisted = Pick<CasesState, "cases">;

const PERSIST_NAME = "smileai-cases";
const PERSIST_VERSION = 5;

/** IndexedDB via localforage — large base64 images exceed localStorage quota. */
const casesIdb = localforage.createInstance({
  name: "smileai",
  storeName: "cases_store",
});

/** Serialize writes so rapid updates + refresh don't read stale IDB before prior flush. */
let persistWriteQueue = Promise.resolve();

const idbStorage: StateStorage = {
  getItem: async (name) => (await casesIdb.getItem<string>(name)) ?? null,
  setItem: (name, value) => {
    const done = persistWriteQueue
      .then(() => casesIdb.setItem(name, value))
      .catch((err) => {
        console.error("[cases persist] write failed", err);
      });
    persistWriteQueue = done.then(() => undefined);
    return done;
  },
  removeItem: async (name) => {
    await casesIdb.removeItem(name);
  },
};

/** Best-effort: await pending persist writes (e.g. tab hidden / before quick navigation). */
export function waitForCasesPersistWrites(): Promise<void> {
  return persistWriteQueue;
}

function migrateCasesPersist(persisted: unknown, _fromVersion: number): CasesPersisted {
  if (
    persisted &&
    typeof persisted === "object" &&
    "cases" in persisted &&
    Array.isArray((persisted as CasesPersisted).cases)
  ) {
    return { cases: (persisted as CasesPersisted).cases };
  }
  return { cases: [] };
}

if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("smileai.cases");
    localStorage.removeItem("smileai.cases.v2");
  } catch {
    /* ignore */
  }
}

export const useCasesStore = create<CasesState>()(
  persist(
    (set, get) => ({
      cases: [],
      addCase: (c) => {
        const withTime = {
          ...c,
          updatedAt: c.updatedAt ?? new Date().toISOString(),
        };
        set((s) => ({ cases: [withTime, ...s.cases] }));
        flushCaseRemoteUpsert(() => get().getCase(c.id));
      },
      updateCase: (id, patch) => {
        const touchedAt = new Date().toISOString();
        set((s) => ({
          cases: s.cases.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: touchedAt } : c,
          ),
        }));
        scheduleCaseRemoteUpsert(() => get().getCase(id));
      },
      removeCase: (id) => {
        const row = get().getCase(id);
        const uid = row?.userId;
        set((s) => ({ cases: s.cases.filter((c) => c.id !== id) }));
        if (uid) scheduleCaseRemoteDelete(id, uid);
      },
      getCase: (id) => get().cases.find((c) => c.id === id),
      setCases: (cases) => {
        set({ cases: [...cases] });
        for (const c of cases) {
          if (c.userId && c.userId !== "local-dev") {
            flushCaseRemoteUpsert(() => get().getCase(c.id));
          }
        }
      },
      mergeCases: (incoming) => {
        set((s) => {
          const touched = new Set(incoming.map((c) => c.id));
          const rest = s.cases.filter((c) => !touched.has(c.id));
          return { cases: [...incoming, ...rest] };
        });
        for (const c of incoming) {
          if (c.userId && c.userId !== "local-dev") {
            flushCaseRemoteUpsert(() => get().getCase(c.id));
          }
        }
      },
      replaceCasesFromServerPull: (cases) => set({ cases: [...cases] }),
    }),
    {
      name: PERSIST_NAME,
      version: PERSIST_VERSION,
      storage: createJSONStorage(() => idbStorage),
      partialize: (state): CasesPersisted => ({ cases: state.cases }),
      migrate: migrateCasesPersist,
    },
  ),
);
