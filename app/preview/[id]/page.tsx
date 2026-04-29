import { PatientPreviewView } from "@/components/patient-preview/PatientPreviewView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PatientPreviewPage({ params }: PageProps) {
  return <PatientPreviewView params={params} />;
}
