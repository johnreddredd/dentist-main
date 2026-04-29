import { CasesHydrationBoundary } from "@/components/dashboard/CasesHydrationBoundary";
import { PatientPreviewView } from "@/components/patient-preview/PatientPreviewView";

export default function PatientPreviewPage() {
  return (
    <CasesHydrationBoundary>
      <PatientPreviewView />
    </CasesHydrationBoundary>
  );
}
