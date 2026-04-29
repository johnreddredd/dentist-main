"use client";

import * as React from "react";
import { PatientPreviewTopBar } from "@/components/patient-preview/PatientPreviewTopBar";
import { PatientSmileExperience } from "@/components/patient-preview/PatientSmileExperience";
import { PATIENT_PREVIEW_MOCK_CONTACT } from "@/lib/patient-preview-copy";
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

interface PatientPreviewViewProps {
  params: Promise<{ id: string }>;
}

export function PatientPreviewView({ params }: PatientPreviewViewProps) {
  const { id } = React.use(params);
  const storeCase = useCasesStore((s) => s.cases.find((c) => c.id === id));
  const c = storeCase ?? demoCase(id);

  const beforeSrc = c.originalPhotoUrl;
  const afterSrc = c.generatedImageUrl ?? c.originalPhotoUrl;

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      <PatientPreviewTopBar />
      <PatientSmileExperience
        beforeSrc={beforeSrc}
        afterSrc={afterSrc}
        shareContact={PATIENT_PREVIEW_MOCK_CONTACT}
      />
    </div>
  );
}
