# SmileAI

Treatment-constrained AI smile preview tool for cosmetic and restorative dentists. Dentist uploads a patient photo, picks a treatment, tags the teeth, chooses a realism mode. The app runs the form through a **constraint engine**, builds a **master prompt** with a TREATMENT IDENTITY LOCK section, and returns a dentist-approvable preview.

This is the **scaffold** — UI, types, engine, prompt constructor, and a mock `/api/generate` are wired end-to-end. Supabase, Stripe, and Gemini are behind env flags and ready to be filled in.

---

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (Tailwind tokens in `app/globals.css`)
- Zustand (form + cases state)
- React Hook Form / Zod (available for future server-action-backed forms)
- Mock Gemini / Vertex AI (`lib/api/gemini.ts`) — swap for real Vertex call when creds are available

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build (Turbopack by default on Next 16)
npm run start    # run production server
npm run lint     # lint
```

## Environment

Copy `.env.example` to `.env.local`. With no values set, the pipeline runs in **mock mode**: `/api/generate` echoes the uploaded photo back so you can exercise the full UI flow.

## Project layout

```
app/
  (auth)/login                # sign-in (stub)
  (auth)/signup               # trial signup (stub)
  (dashboard)/generate        # 4-step form (Part 1)
  (dashboard)/cases           # case library
  (dashboard)/cases/[id]      # case detail + approval gate
  (dashboard)/stats           # acceptance analytics
  (dashboard)/settings        # plan + practice
  api/generate                # engine -> prompt -> (mock) Gemini
  api/cases                   # stub (Supabase in Part 8)
  api/webhook/stripe          # stub (Stripe in Part 9)
  page.tsx                    # marketing landing

components/
  form/                       # PhotoUpload, TreatmentCategory, TreatmentSpecifics, ToothChart, ModeSelector, SummaryPanel, FormStepper
  generation/                 # PreviewDisplay, AssumptionBox, ApprovalGate
  dashboard/                  # Sidebar, TopBar, CaseLibrary, Stats
  ui/                         # button, card, input, label, select, badge, progress, toggle

lib/
  constraints/                # PART 3 — rules engine (Opus 4.7 target per docs)
    rules/toothState.ts
    rules/treatmentModality.ts
    rules/ancillaryProcedures.ts
    rules/modeAesthetic.ts
    engine.ts                 # merge order documented inline
    constants.ts
    index.ts                  # public API: evaluateTreatmentConstraints
  prompts/                    # PART 4 — prompt constructor
    templates.ts              # TREATMENT IDENTITY LOCK section lives here
    constructor.ts            # pure builder (no HTTP)
    assumption-box.ts         # deterministic bullet list
  api/gemini.ts               # PART 5 — Vertex/Gemini plumbing (mock until creds)
  api/claude.ts               # optional polish layer
  stores/generate-form.ts     # Zustand form state
  stores/cases.ts             # Zustand + persist for local case library

types/index.ts                # canonical TreatmentFormData / TreatmentConstraints / etc.

docs/                         # build order, model map, constraint engine runbook
```

## What's wired

- Constraint engine runs on every `/api/generate` call **before** prompt construction.
- Prompt constructor emits a master prompt containing `TREATMENT IDENTITY LOCK` with allowed + forbidden changes from the engine.
- Assumption box is built deterministically and shown next to every preview.
- Dentist approval gate (Approve / Regenerate / Adjust) in `app/(dashboard)/cases/[id]`.
- Case library persists to localStorage until Supabase is wired.

## What's stubbed

- **Supabase auth + DB + storage** — env + routes are ready; wire in Part 8 (`docs/`).
- **Stripe billing** — webhook stub at `app/api/webhook/stripe/route.ts`.
- **Real Gemini calls** — `lib/api/gemini.ts` runs in mock mode unless `GEMINI_API_KEY` or `GOOGLE_APPLICATION_CREDENTIALS` is set. Swap the throw for the real SDK call.

## Build order

See `docs/build-10-parts-cursor-models.md` and `docs/cursor-pipeline-models.md` for the recommended part-by-part model + task mapping. The constraint engine runbook is in `docs/constraint-engine-cursor.md`.
