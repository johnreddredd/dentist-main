/**
 * SmileAI shared types
 *
 * These are the canonical shapes exchanged between the 4-step form,
 * the constraint engine (lib/constraints), the prompt constructor
 * (lib/prompts), the API route, and the Supabase layer.
 *
 * Keep TreatmentConstraints stable — it is the contract between the
 * rules engine (Part 3) and the prompt constructor (Part 4).
 */

// ---------- Modes ----------

export type Mode = "conservative" | "moderate" | "aspirational";

export const MODES: readonly Mode[] = [
  "conservative",
  "moderate",
  "aspirational",
] as const;

// ---------- Treatment categories & materials ----------

export type TreatmentCategory =
  | "cosmetic"
  | "restorative"
  | "replacement"
  | "alignment"
  | "whitening"
  | "makeover";

export const TREATMENT_CATEGORIES: readonly TreatmentCategory[] = [
  "cosmetic",
  "restorative",
  "replacement",
  "alignment",
  "whitening",
  "makeover",
] as const;

// Materials available per category (Screen 3 dropdown)
export const MATERIALS_BY_CATEGORY: Record<TreatmentCategory, readonly string[]> = {
  cosmetic: [
    "Composite bonding",
    "Porcelain veneers",
    "e.max veneers",
    "Zirconia crowns",
  ],
  restorative: ["Composite filling", "Inlay / onlay", "Crown"],
  replacement: [
    "Single implant",
    "Bridge",
    "All-on-4",
    "All-on-6",
    "Full denture",
    "Partial denture",
  ],
  alignment: ["Invisalign", "Traditional braces", "Clear aligners"],
  whitening: ["In-office bleaching", "At-home trays"],
  makeover: ["Combined treatment plan"],
};

// ---------- Shade / shape ----------

export type VitaShade =
  | "A1"
  | "A2"
  | "A3"
  | "A3.5"
  | "A4"
  | "B1"
  | "B2"
  | "BL1"
  | "BL2"
  | "BL3";

export const VITA_SHADES: readonly VitaShade[] = [
  "A1",
  "A2",
  "A3",
  "A3.5",
  "A4",
  "B1",
  "B2",
  "BL1",
  "BL2",
  "BL3",
] as const;

export type ToothShape = "natural" | "square" | "rounded" | "tapered";

export const TOOTH_SHAPES: readonly ToothShape[] = [
  "natural",
  "square",
  "rounded",
  "tapered",
] as const;

// ---------- Tooth state (Universal numbering 1-32) ----------

export type ToothNumber =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
  | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30
  | 31 | 32;

export type ToothState = "healthy" | "treatment" | "missing" | "destroyed";

export type ToothMap = Partial<Record<ToothNumber, ToothState>>;

// ---------- Form input (the shape of the Zustand store) ----------

export interface TreatmentFormData {
  // Screen 1
  photoDataUrl: string | null;
  photoConfirmed: boolean;

  // Screen 2
  category: TreatmentCategory | null;

  // Screen 3
  material: string | null;
  teeth: ToothMap;
  shade: VitaShade;
  shape: ToothShape;
  fullArch: boolean;
  orthoSelected: boolean;
  gumSurgerySelected: boolean;

  // Screen 4
  mode: Mode;
}

export const DEFAULT_FORM_DATA: TreatmentFormData = {
  photoDataUrl: null,
  photoConfirmed: false,
  category: null,
  material: null,
  teeth: {},
  shade: "A2",
  shape: "natural",
  fullArch: false,
  orthoSelected: false,
  gumSurgerySelected: false,
  mode: "moderate",
};

// ---------- Constraint engine contract ----------

export type RequiredAesthetic = "natural" | "prosthetic" | "cosmetic";

/**
 * TreatmentConstraints — stable contract between engine and prompt builder.
 * DO NOT change field names without updating both sides.
 */
export interface TreatmentConstraints {
  treatmentType: string;
  allowedChanges: string[];
  forbiddenChanges: string[];
  requiredAesthetic: RequiredAesthetic;
  shadeRange: string;
  preservationRules: string[];
}

export type IssueSeverity = "error" | "warning";

export interface Issue {
  severity: IssueSeverity;
  code: string;
  message: string;
}

export interface EngineResult {
  constraints: TreatmentConstraints;
  flags: {
    requiresProsthetic: boolean;
    whiteningOnly: boolean;
    aspirational: boolean;
  };
  issues: Issue[];
}

// ---------- Prompt / assumption output ----------

export interface PromptOutput {
  prompt: string; // master prompt string (with TREATMENT IDENTITY LOCK)
  identityLock: string; // the lock section alone, for logging/debugging
}

export interface AssumptionBox {
  bullets: string[];
  disclaimerFooter: string;
  mode: Mode;
}

// ---------- Case / generation persistence ----------

/** One saved AI preview image for a case (initial generate or a dentist tweak). */
export interface PreviewGeneration {
  id: string;
  imageUrl: string;
  createdAt: string;
  label: string;
  /** Dentist note that produced this version (refine flow). */
  dentistNote?: string;
}

/** Office / chart fields for the patient library (optional until captured at save or on case page). */
export interface CasePatientRecord {
  firstName: string;
  lastName: string;
  /** Chart #, MRN, or internal office ID */
  patientId?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface Case {
  id: string;
  userId: string;
  originalPhotoUrl: string;
  generatedImageUrl: string | null;
  /** History of previews; `generatedImageUrl` should match the selected generation. */
  previewGenerations?: PreviewGeneration[];
  /** Which generation is shown in the app and sent to patients. */
  selectedGenerationId?: string;
  /** Top 3 fixes Claude proposed after comparing original vs first-pass draft (applied in final image). */
  aiReviewerBullets?: string[];
  /** Patient demographics for search and office records. */
  patient?: CasePatientRecord;
  treatmentData: TreatmentFormData;
  constraints: TreatmentConstraints;
  assumption: AssumptionBox;
  mode: Mode;
  approved: boolean;
  patientAccepted?: "yes" | "no" | "pending";
  createdAt: string;
  /** Last write time for Supabase sync / conflict hints (ISO string). */
  updatedAt?: string;
}

export interface Generation {
  id: string;
  caseId: string;
  prompt: string;
  generationTimeMs: number;
  modelVersion: string;
  regenerationCount: number;
  createdAt: string;
}

// ---------- Billing ----------

export type SubscriptionTier = "starter" | "practice" | "multi_location";

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  previewsPerMonth: number | "unlimited";
  seats: number;
  description: string;
}

export const PLANS: readonly SubscriptionPlan[] = [
  {
    tier: "starter",
    name: "Starter",
    price: 497,
    previewsPerMonth: 50,
    seats: 1,
    description: "50 previews/month, 1 dentist seat",
  },
  {
    tier: "practice",
    name: "Practice",
    price: 797,
    previewsPerMonth: "unlimited",
    seats: 3,
    description: "Unlimited previews, 3 dentist seats",
  },
  {
    tier: "multi_location",
    name: "Multi-location",
    price: 1497,
    previewsPerMonth: "unlimited",
    seats: 10,
    description: "Unlimited previews, 10 seats, priority support",
  },
] as const;

// ---------- Generate API contract ----------

export interface GenerateRequest {
  form: TreatmentFormData;
}

export interface GenerateResponse {
  caseId: string;
  /** Final image after optional Claude review + second Gemini pass. */
  generatedImageUrl: string;
  /** First-pass Gemini output (before reviewer pass); omitted in older clients. */
  draftImageUrl?: string;
  /** Top 3 fixes the reviewer asked for (fed into the final Gemini edit). */
  reviewerBullets: string[];
  prompt: string;
  constraints: TreatmentConstraints;
  assumption: AssumptionBox;
  issues: Issue[];
  generationTimeMs: number;
  /** Final image model id; may include pipeline hint when multiple steps ran. */
  modelVersion: string;
}

/** Dentist refinement: Claude → short Gemini edit prompt → image */
export interface RefinePreviewRequest {
  dentistNotes: string;
  currentPreviewUrl: string;
  originalPhotoUrl: string;
}

export interface RefinePreviewResponse {
  generatedImageUrl: string;
  editPrompt: string;
  generationTimeMs: number;
  modelVersion: string;
  mock?: boolean;
}
