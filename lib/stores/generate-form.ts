"use client";

import { create } from "zustand";
import {
  DEFAULT_FORM_DATA,
  type TreatmentFormData,
  type ToothNumber,
  type ToothState,
  type TreatmentCategory,
  type VitaShade,
  type ToothShape,
  type Mode,
} from "@/types";

export type Step = 1 | 2 | 3 | 4;

interface GenerateState {
  step: Step;
  form: TreatmentFormData;

  // step nav
  setStep: (s: Step) => void;
  next: () => void;
  back: () => void;
  reset: () => void;

  // screen 1
  setPhoto: (dataUrl: string | null) => void;
  confirmPhoto: (confirmed: boolean) => void;

  // screen 2
  setCategory: (c: TreatmentCategory) => void;

  // screen 3
  setMaterial: (m: string) => void;
  setToothState: (n: ToothNumber, state: ToothState | null) => void;
  /** Set many teeth in one update (e.g. select all in an arch). */
  setManyToothStates: (
    numbers: readonly ToothNumber[],
    state: ToothState | null,
  ) => void;
  setShade: (s: VitaShade) => void;
  setShape: (s: ToothShape) => void;
  setFullArch: (v: boolean) => void;
  setOrtho: (v: boolean) => void;
  setGumSurgery: (v: boolean) => void;

  // screen 4
  setMode: (m: Mode) => void;

  // readiness
  canAdvanceFrom: (s: Step) => boolean;
}

export const useGenerateForm = create<GenerateState>((set, get) => ({
  step: 1,
  form: { ...DEFAULT_FORM_DATA },

  setStep: (s) => set({ step: s }),
  next: () => {
    const { step, canAdvanceFrom } = get();
    if (step < 4 && canAdvanceFrom(step)) {
      set({ step: (step + 1) as Step });
    }
  },
  back: () => {
    const { step } = get();
    if (step > 1) set({ step: (step - 1) as Step });
  },
  reset: () => set({ step: 1, form: { ...DEFAULT_FORM_DATA } }),

  setPhoto: (dataUrl) =>
    set((s) => ({
      form: { ...s.form, photoDataUrl: dataUrl, photoConfirmed: false },
    })),
  confirmPhoto: (confirmed) =>
    set((s) => ({ form: { ...s.form, photoConfirmed: confirmed } })),

  setCategory: (c) =>
    set((s) => ({
      form: {
        ...s.form,
        category: c,
        // clear material when category changes; old material may not exist in new list.
        material: null,
      },
    })),

  setMaterial: (m) => set((s) => ({ form: { ...s.form, material: m } })),
  setToothState: (n, state) =>
    set((s) => {
      const teeth = { ...s.form.teeth };
      if (state === null) {
        delete teeth[n];
      } else {
        teeth[n] = state;
      }
      return { form: { ...s.form, teeth } };
    }),
  setManyToothStates: (numbers, state) =>
    set((s) => {
      const teeth = { ...s.form.teeth };
      for (const n of numbers) {
        if (state === null) {
          delete teeth[n];
        } else {
          teeth[n] = state;
        }
      }
      return { form: { ...s.form, teeth } };
    }),
  setShade: (shade) => set((s) => ({ form: { ...s.form, shade } })),
  setShape: (shape) => set((s) => ({ form: { ...s.form, shape } })),
  setFullArch: (fullArch) =>
    set((s) => ({ form: { ...s.form, fullArch } })),
  setOrtho: (orthoSelected) =>
    set((s) => ({ form: { ...s.form, orthoSelected } })),
  setGumSurgery: (gumSurgerySelected) =>
    set((s) => ({ form: { ...s.form, gumSurgerySelected } })),

  setMode: (mode) => set((s) => ({ form: { ...s.form, mode } })),

  canAdvanceFrom: (s) => {
    const form = get().form;
    switch (s) {
      case 1:
        return !!form.photoDataUrl && form.photoConfirmed;
      case 2:
        return !!form.category;
      case 3: {
        // Material required. For non-whitening, at least one tooth marked (or full arch).
        const hasTeeth =
          Object.keys(form.teeth).length > 0 || form.fullArch;
        if (form.category === "whitening") return !!form.material;
        return !!form.material && hasTeeth;
      }
      case 4:
        return !!form.mode;
    }
  },
}));
