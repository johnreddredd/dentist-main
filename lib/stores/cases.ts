"use client";

import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import localforage from "localforage";
import type { Case } from "@/types";

interface CasesState {
  cases: Case[];
  addCase: (c: Case) => void;
  updateCase: (id: string, patch: Partial<Case>) => void;
  removeCase: (id: string) => void;
  getCase: (id: string) => Case | undefined;
}

const PERSIST_NAME = "smileai-cases";

/** IndexedDB via localforage — large base64 images exceed localStorage quota. */
const casesIdb = localforage.createInstance({
  name: "smileai",
  storeName: "cases_store",
});

const idbStorage: StateStorage = {
  getItem: async (name) => (await casesIdb.getItem<string>(name)) ?? null,
  setItem: async (name, value) => {
    await casesIdb.setItem(name, value);
  },
  removeItem: async (name) => {
    await casesIdb.removeItem(name);
  },
};

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
      addCase: (c) => set((s) => ({ cases: [c, ...s.cases] })),
      updateCase: (id, patch) =>
        set((s) => ({
          cases: s.cases.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      removeCase: (id) =>
        set((s) => ({ cases: s.cases.filter((c) => c.id !== id) })),
      getCase: (id) => get().cases.find((c) => c.id === id),
    }),
    {
      name: PERSIST_NAME,
      version: 3,
      storage: createJSONStorage(() => idbStorage),
    },
  ),
);
