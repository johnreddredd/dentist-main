"use client";

import { useParams } from "next/navigation";
import {
  PatientSmileExperience,
} from "@/components/patient-preview/PatientSmileExperience";
import { ensurePreviewGenerations } from "@/lib/cases/preview-history";
import { buildPatientShareContactFromCase } from "@/lib/cases/patient-utils";
import { useCasesStore } from "@/lib/stores/cases";
import type { Case } from "@/types";

const MOCK_BEFORE =
  "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1200&h=900&fit=crop&crop=faces";
const MOCK_AFTER =
  "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&h=900&fit=crop&crop=faces";

function demoCase(id: string): Case {
  return {
    id,
    userId: "demo",
    originalPhotoUrl: MOCK_BEFORE,
    generatedImageUrl: MOCK_AFTER,
    treatmentData: {
      photoDataUrl: null,
      photoConfirmed: false,
      category: "alignment",
      material: "Traditional braces",
      teeth: {},
      shade: "A2",
      shape: "natural",
      fullArch: true,
      orthoSelected: false,
      gumSurgerySelected: false,
      mode: "moderate",
    },
    constraints: {
      treatmentType: "Orthodontic alignment",
      allowedChanges: [],
      forbiddenChanges: [],
      requiredAesthetic: "natural",
      shadeRange: "A2",
      preservationRules: [],
    },
    assumption: {
      bullets: [],
      disclaimerFooter: "",
      mode: "moderate",
    },
    mode: "moderate",
    approved: true,
    createdAt: new Date().toISOString(),
  };
}

function routeId(raw: string | string[] | undefined): string {
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw) && raw[0]) return raw[0];
  return "";
}

/**
 * Patient-facing `/preview/[id]` share: full compare experience + reassurance +
 * optional practice contact (same full experience as in-clinic review, without checklist / refine tools).
 */
export function PatientPreviewView() {
  const params = useParams();
  const id = routeId(params?.id);
  const storeCase = useCasesStore((s) => s.cases.find((c) => c.id === id));
  const c = storeCase ?? demoCase(id);

  const { generations, selectedId } = ensurePreviewGenerations(c);
  const selectedGen = generations.find((g) => g.id === selectedId);
  const afterSrc =
    selectedGen?.imageUrl ??
    c.generatedImageUrl ??
    c.originalPhotoUrl;
  const beforeSrc = c.originalPhotoUrl;
  const shareContact = buildPatientShareContactFromCase(c);

  return (
    <div className="min-h-dvh bg-[color:var(--color-warm-50)]">
      <PatientSmileExperience
        beforeSrc={beforeSrc}
        afterSrc={afterSrc}
        shareContact={shareContact}
        mainClassName="max-w-5xl pb-16 pt-6 sm:pt-10"
      />
    </div>
  );
}
