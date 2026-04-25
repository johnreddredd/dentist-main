# SmileAI — 10 build parts + which Cursor model

Use this alongside `cursor-pipeline-models.md` (full row-by-row map) and `constraint-engine-cursor.md` (Opus runbook for Part 3).

---

## PART 1 — UI / FRONTEND (forms, pages, components)

**What:** 4-step generate flow, dashboard layout, case library UI, shared components (incl. tooth chart).

**Use:** **Sonnet / 4.6** (or **Fast** for pure scaffold)

**Why:** High volume, low “wrong = wrong clinical math” risk.

**Tasks:**

- Next.js 14 App Router pages + `layout.tsx`, landing, `(dashboard/*)`
- React Hook Form + Zustand for step state and persistence
- Tailwind + shadcn: cards, steps, file upload, mode cards
- `PhotoUpload`, `TreatmentCategory`, `TreatmentSpecifics` + `ToothChart`, `ModeSelector`
- iPad-friendly tap targets (≥44px), loading skeletons

**Do not** use **Opus 4.7** for routine UI (credit waste).

---

## PART 2 — TYPES & DATA MODELS

**What:** TypeScript for form, engine I/O, API, and DB.

**Use:** **Sonnet / 4.6**  
(If `TreatmentConstraints` must encode **hard invariants**, have **Opus 4.7** **review the type once** after Part 3 exists.)

**Why:** Shape work is fast to iterate; engine owns truth.

**Tasks:**

- `TreatmentFormData`, step discriminated unions if useful
- `TreatmentConstraints`, `EngineResult`, `Case`, `Generation`, subscription/user types
- Zod (optional) for runtime validation on API boundary
- Supabase `Database` type generation hookup when DB exists

---

## PART 3 — CONSTRAINT ENGINE (CORE LOGIC)

**What:** Rules that map form → allowed/forbidden changes, aesthetic class, shade caps, preservation.

**Use:** **Opus 4.7 ONLY**

**Why:** This is the product’s correctness layer; mistakes = wrong or unsafe generations.

**Tasks:**

- `lib/constraints/`*: prosthetic vs natural, whitening-only, ortho/gum gates, mode × severity
- Merge order + `issues[]` for impossible combos
- Table tests for interaction matrix (see `constraint-engine-cursor.md`)

**This is the most important code layer.**

---

## PART 4 — PROMPT CONSTRUCTOR (SECOND CORE)

**What:** Builds the **full** text prompt for Gemini from `TreatmentConstraints` + form summary.

**Use:** **Opus 4.7**

**Why:** TREATMENT IDENTITY LOCK and anti-drift copy live here; errors leak straight into the image model.

**Tasks:**

- `lib/prompts/templates.ts` + `constructor.ts` — no HTTP in this module
- Master template sections: treatment represented, lock, upper/lower, gums, color, PRESERVE EXACTLY, AVOID
- Conservative “imperfection” language; aspirational / prosthetic phrasing
- Regenerate: same engine output → same template path (no silent drift)

**Constraints (Part 3) + this (Part 4) = moat.**

---

## PART 5 — GEMINI / IMAGE API (PLUMBING)

**What:** Server route that accepts image + final prompt, calls Vertex/Gemini image model, returns image bytes.

**Use:** **Sonnet / 4.6**

**Why:** Mostly SDK + error handling; intelligence is upstream in Parts 3–4.

**Tasks:**

- `lib/api/gemini.ts` + `app/api/generate/route.ts`
- Multipart or base64 in/out, timeouts, model ID env
- No prompt invention here — only pass string from Part 4

---

## PART 6 — ASSUMPTION BOX (TRANSPARENCY)

**What:** Bullet list of what the system assumed; deterministic from constraints + form.

**Use:** **Sonnet / 4.6** (default)  
**Opus 4.7** only if you add **LLM-written** narrative beyond bullets.

**Why:** Templated honesty beats clever prose; easier to review for compliance.

**Tasks:**

- `AssumptionBox.tsx` + `buildAssumptionBox(constraints, form) → { bullets, disclaimerFooter }`
- Exclusions: e.g. no ortho, no gum surgery, untouched teeth
- Static footer: *Visual representation only — not a treatment plan…*

---

## PART 7 — APPROVAL GATE + PREVIEW UX

**What:** After generation: before/after layout, **Approve / Regenerate / Adjust**; “Adjust” pre-fills form.

**Use:** **Sonnet / 4.6**

**Why:** UI and state wiring; business rules already in Parts 3–4.

**Tasks:**

- `PreviewDisplay`, `ApprovalGate`, regeneration counter for analytics
- Approve: trigger disclaimer tier + save path (or stub until Part 8)
- Loading state for 30–60s generation, cancel/retry if API supports

---

## PART 8 — SUPABASE (AUTH + STORAGE + DB)

**What:** Auth (email + Google), tables, RLS, signed URLs, case + generation logging.

**Use:** **Sonnet / 4.6**  
**Opus 4.7** only if **RLS** is wrong or leaky after 4.6 (security pass).

**Why:** Well-documented patterns; 4.7 for subtle policy bugs.

**Tasks:**

- `users`, `cases`, `generations`, `subscriptions` + indexes
- Auth helpers, server vs client client, protect `/api/generate` + dashboard
- Storage buckets for original + generated images; case library queries

---

## PART 9 — STRIPE (BILLING + USAGE)

**What:** Tiers, trial, Checkout, webhooks, sync subscription + **usage limits** before generate.

**Use:** **Sonnet / 4.6**  
**Opus 4.7** if **webhook signature + idempotency** stay broken or scary.

**Why:** Most of it is plumbing; money path deserves escalation if stuck.

**Tasks:**

- Products/prices: Starter / Practice / Multi-location, 14-day trial
- `app/api/webhook/stripe/route.ts` + Supabase `subscriptions` update
- Enforce monthly preview limits on **Starter**; unlimited vs seat limits per tier
- `NEXT_PUBLIC_STRIPE_`* + server secret

---

## PART 10 — SHIP LAYER (POLISH) + FUTURE CRITIQUE

**What:** *Now:* disclaimers as UI overlay + optional export watermark, error boundaries, Vercel env, case stats/survey, deploy. *Later:* image critique / correction loop.

**Use (now):** **Sonnet / 4.6** + **You** (disclaimer *wording*). **Use (critique):** **Opus 4.7**.

**Why:** Polish is high churn; critique loop is reasoning-heavy — **do not** build critique until core loop ships.

**Tasks (now):**

- Per-mode disclaimer strings + `Stats` + “patient accepted?” survey
- Production logging, `NEXT_`* and secrets checklist, Vercel deploy

**Tasks (later — separate project phase):**

- Post-gen evaluation + inject corrective instructions + full prompt repeat → **4.7**

---

# SIMPLE MODEL RULE


| Task type                  | Model                  |
| -------------------------- | ---------------------- |
| UI / boilerplate           | 4.6 / Sonnet (or Fast) |
| Logic / constraints        | **Opus 4.7**           |
| Prompt construction        | **Opus 4.7**           |
| API / DB / Stripe plumbing | 4.6 / Sonnet           |
| Critique loop (future)     | **Opus 4.7**           |


# GOLDEN RULE

Use **4.7** only where mistakes cost **product quality** (Parts **3**, **4**, and later **critique**). Everything else: **4.6 / Sonnet**.

# TL;DR

- **4.7 = brain** (constraints, prompts, future critique)  
- **4.6 / Sonnet = hands** (UI, types, APIs, Supabase, Stripe)  
- **Fast = factory** (scaffold, renames)