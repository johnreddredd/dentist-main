# SmileAI build pipeline — which Cursor model for what

Use this as the **single map** for the whole project. Model names are how you described them: **Opus 4.7** = max reasoning, **4.6 / Sonnet** = default fast/cheap, **Composer 2 (Fast)** = boilerplate and churn (if your Cursor has it).

---

## Golden rules


| Use **Opus 4.7**                                                                    | Use **4.6 / Sonnet**                                                   | Use **Fast** (optional)                                            |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Anything where a wrong answer = wrong **clinical behavior** in prompts or **rules** | UI, types glue, API wiring, DB, most integrations                      | Scaffolding, repetitive edits, shadcn adds, renames, trivial fixes |
| Constraint engine (full)                                                            | Prompt *plumbing* that only concatenates known strings from the engine | —                                                                  |
| Prompt **constructor** (templates, TREATMENT IDENTITY LOCK, anti-drift)             | `fetch` to Gemini, route handler shape, return JSON/base64             | —                                                                  |
| Image critique / correction loop (later)                                            | Supabase RLS *policy drafts* (then you verify in dashboard)            | —                                                                  |
| Stripe: only if **webhook + idempotency** gets weird after 4.6 fails                | Stripe: happy path, Checkout, customer portal                          | —                                                                  |


**TL;DR:** 4.7 = brain (rules + prompt logic). 4.6 = hands. Fast = copy-paste factory.

---

## Master table (in rough build order)


| #   | Work                                                                                            | Cursor model                                                                                        |
| --- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | Next.js 14 + TS + Tailwind + shadcn init, folder structure from spec                            | **Fast** or **4.6**                                                                                 |
| 2   | Landing page `app/page.tsx` (static/marketing)                                                  | **4.6**                                                                                             |
| 3   | Global layout, fonts (Inter, Cal Sans), design tokens (teal, spacing)                           | **4.6**                                                                                             |
| 4   | Zustand store + RHF form shell for generate flow (no real API)                                  | **4.6**                                                                                             |
| 5   | Screen 1: Photo — upload, dropzone, **webcam** branch if included                               | **4.6**                                                                                             |
| 6   | Screen 2: Treatment category (6 cards)                                                          | **4.6**                                                                                             |
| 7   | Screen 3: Material dropdowns, tooth chart, shade, shape                                         | **4.6**                                                                                             |
| 8   | Screen 4: Mode cards + summary + CTA (dummy generate)                                           | **4.6**                                                                                             |
| 9   | Shared types file `types/index.ts` (form, API payloads)                                         | **4.6**                                                                                             |
| 10  | `TreatmentConstraints` + engine input types — **shape** only (if no logic yet)                  | **4.6**; if types must encode **invariants** with the engine, have **4.7** **review** the type once |
| 11  | **Constraint engine** (`lib/constraints/`*, rules, tests)                                       | **Opus 4.7** only (see `docs/constraint-engine-cursor.md`)                                          |
| 12  | Mapper: form → `TreatmentFormInput` for engine                                                  | **4.6**                                                                                             |
| 13  | **Prompt constructor** (`lib/prompts/`*: templates, TREATMENT IDENTITY LOCK, merge constraints) | **Opus 4.7**                                                                                        |
| 14  | Optional: Claude API “polish/expand” layer — if you add it, treat like prompt brain             | **Opus 4.7**                                                                                        |
| 15  | `lib/api/gemini.ts` + `/api/generate` — call image model, pass image + **final** string         | **4.6**                                                                                             |
| 16  | **Assumption box** — mostly deterministic template from `constraints` + form                    | **4.6**; if you want **LLM-generated** copy                                                         |
| 17  | `PreviewDisplay`, `AssumptionBox`, loading 30–60s UX                                            | **4.6**                                                                                             |
| 18  | `ApprovalGate` (approve / regenerate / adjust) + prefill on adjust                              | **4.6**                                                                                             |
| 19  | Disclaimer text strings + which mode shows which (UI)                                           | **You** (legal tone) + **4.6** to wire                                                              |
| 20  | Watermark / overlay on export (Canvas or server) if spec requires                               | **4.6**                                                                                             |
| 21  | Supabase: auth (email + Google), client/server helpers                                          | **4.6**                                                                                             |
| 22  | SQL migrations: `users`, `cases`, `generations`, `subscriptions` + indexes                      | **4.6**                                                                                             |
| 23  | RLS policies — *correctness matters*                                                            | **4.6** first; if leaks or complex rules, **4.7** review                                            |
| 24  | `cases` API + save after approval; storage URLs for images                                      | **4.6**                                                                                             |
| 25  | Case library + filters + case detail (dashboard routes)                                         | **4.6**                                                                                             |
| 26  | Stats dashboard (acceptance, counts)                                                            | **4.6**                                                                                             |
| 27  | Post-consult survey (Yes/No/Pending)                                                            | **4.6**                                                                                             |
| 28  | Stripe: products, prices, trial, Checkout, customer portal                                      | **4.6**                                                                                             |
| 29  | Webhook: signature verification, idempotency, sync subscription to DB                           | **4.6**; stuck or security-sensitive                                                                |
| 30  | Usage limits + tier enforcement (middleware or server check before generate)                    | **4.6**                                                                                             |
| 31  | Face/mouth “quality” validation (Screen 1) — if ML/API                                          | **4.6** to integrate; model choice in product, not Cursor                                           |
| 32  | Error boundaries, toasts, logging                                                               | **4.6**                                                                                             |
| 33  | Vercel: env, deploy, production smoke                                                           | **You** + **4.6** for `vercel.json` / build fixes                                                   |
| 34  | **Critique loop** (image eval + correction prompts) — *later*                                   | **Opus 4.7**                                                                                        |


---

## One-screen cheat

```
┌─────────────────────────────────────┬──────────────┐
│ Constraint engine + prompt brain   │ Opus 4.7     │
│ (rules, templates, lock, anti-drift)│              │
├─────────────────────────────────────┼──────────────┤
│ UI, Zustand, RHF, Tailwind, charts   │ 4.6 / Sonnet  │
├─────────────────────────────────────┼──────────────┤
│ Types (bulk), mappers, APIs, Stripe,│ 4.6 / Sonnet  │
│ Supabase, case library, webhooks*   │              │
├─────────────────────────────────────┼──────────────┤
│ Scaffolding, shadcn, renames, polish │ Fast         │
├─────────────────────────────────────┼──────────────┤
│ Disclaimers / medico-legal phrasing  │ You          │
└─────────────────────────────────────┴──────────────┘
* Webhook: 4.6 first, 4.7 if you’re not confident
```

---

## How this relates to `constraint-engine-cursor.md`

- That file is **only** the **detailed** Opus 4.7 task list for **row #11** in the table above.
- For **row #13** (prompt constructor), add a sister doc when you’re ready, or one-shot Opus with: *“Build `lib/prompts` from `TreatmentConstraints` + template; TREATMENT IDENTITY LOCK in every output; no Gemini calls in this module.”*

---

## Suggested session flow (so you don’t context-switch models mid-file)

1. **4.6 / Fast** — get app running + 4 screens + fake generate.
2. **4.7** — constraint engine + tests (finish).
3. **4.6** — mapper + wire form → engine in dev only.
4. **4.7** — prompt constructor + templates.
5. **4.6** — `/api/generate` + Gemini + UI result + approval + assumption template.
6. **4.6** — Supabase + cases + library.
7. **4.6** — Stripe + webhooks; **4.7** only on webhook if needed.
8. **4.6** — polish, watermarks, deploy.

---

*Last updated: full-pipeline model map; constraint doc unchanged.*