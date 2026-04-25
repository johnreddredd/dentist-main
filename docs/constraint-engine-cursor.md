# Constraint engine — code tasks + Cursor prompts (Opus 4.7)

Use **Opus 4.7** for every session below. Run phases in order. Do not skip the test matrix.

---

## 0. Outputs (what “done” means)

The engine is a **pure function** (or small pipeline of pure functions):

`evaluateTreatmentConstraints(form: TreatmentFormInput) → EngineResult`

Where `EngineResult` includes at minimum:

- `constraints: TreatmentConstraints` (see spec in repo `types` — same shape everywhere)
- `flags: { requiresProsthetic: boolean; whiteningOnly: boolean; … }` (only if useful for UI; optional)
- `issues: { severity: 'error' | 'warning'; code: string; message: string }[]` for impossible combos

**Ordering:** The constraint object must reflect **all** rules; rule interactions are explicit (see phase 3).

---

## 1. Files to create (single responsibility)


| File                                       | Responsibility                                                           |
| ------------------------------------------ | ------------------------------------------------------------------------ |
| `lib/constraints/types.ts`                 | `TreatmentFormInput`, `TreatmentConstraints`, `EngineResult`, rule codes |
| `lib/constraints/constants.ts`             | Modes, categories, VITA list, tooth indices 1–32 helpers                 |
| `lib/constraints/rules/`                   | One module per **rule family** (see below), pure functions               |
| `lib/constraints/engine.ts`                | Orchestrator: calls rules in order, merges `TreatmentConstraints`        |
| `lib/constraints/index.ts`                 | Public API: `evaluateTreatmentConstraints` only                          |
| `lib/constraints/__tests__/engine.spec.ts` | Table-driven tests (or `.test.ts` to match your runner)                  |


**Do not** put prompt text here — only structured fields the prompt builder consumes.

---

## 2. Rule families (map spec rules → code modules)

Implement in this **merge order** (later steps may **narrow** or **append** to `forbiddenChanges` / `requiredAesthetic` / `allowedChanges`).

1. `toothState.ts` — teeth marked MISSING/DESTROYED drive prosthetic path; healthy vs treatment teeth lists.
2. `treatmentCategory.ts` — category caps what materials/shape changes are even mentionable.
3. `treatmentModality.ts` — whitening / bonding / veneers / implants specifics (spec rules 2–5).
4. `ancillaryProcedures.ts` — ortho (6), gum (7), untreated (8), arch/bite (9) as **forbidden** unless selected.
5. `modeAesthetic.ts` — conservative / moderate / aspirational caps on shade, “imperfection” language hooks, and disclaimer tier **metadata** (not the overlay UI — just flags for UI/prompts).

`engine.ts` merges outputs into one `TreatmentConstraints` plus collects `issues[]`.

---

## 3. Interaction matrix (you must encode explicitly)

Add a short **comment block in `engine.ts`** documenting these, then **tests** for each row:

- **Missing/destroyed anywhere** + user picked purely cosmetic/whitening with “natural only” path → `issues` must contain **error** (prosthetic required) or engine **forces** `requiredAesthetic: 'prosthetic'` and **clears** natural-teeth language from allowed changes (choose one product rule; document it).
- **Whiten only** + shape change in form → `forbiddenChanges` must include arch/shape; `issues` if user contradicts.
- **Veneers** + “full arch” not selected + tooth chart is full mouth → `issues` or cap to selected teeth only.
- **Implants** + “replace only selected”** — non-selected teeth in `preservationRules`.
- **No ortho** + user asked for alignment in form → error or hard forbid in `forbiddenChanges`.
- **No gum surgery** + gumline in allowed → remove; add to `forbiddenChanges`.
- **Mode conservative** + **severe** damage (many missing) → `requiredAesthetic: 'prosthetic'`, not natural smile simulation.

---

## 4. `TreatmentConstraints` field guide (for implementers)


| Field               | Source                                                                                                                                                                                             |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `treatmentType`     | Human-readable summary string from category + material + key teeth                                                                                                                                 |
| `allowedChanges`    | From category/modality + tooth selection + what’s **explicitly** selected                                                                                                                          |
| `forbiddenChanges`  | Default huge list, **pruned** by selection; must include ortho/gum if not selected                                                                                                                 |
| `requiredAesthetic` | `natural` | `prosthetic` | `cosmetic` — from tooth state + treatment                                                                                                                               |
| `shadeRange`        | User slider, **clamped** by mode (A3 conservative, A2 moderate, BL1 aspirational) unless user selection is stricter (define rule: “mode caps shade” vs “form wins” — **pick one**, document, test) |
| `preservationRules` | Untreated teeth, face, etc. + “gum as-is if no gum treatment”                                                                                                                                      |


---

## 5. Phased implementation checklist

### Phase A — Types + empty engine

- All types compile; `evaluateTreatmentConstraints` returns a **valid** object for a **minimal** happy-path fixture (e.g. moderate + veneers + 2 teeth).
- No Supabase, no React.

### Phase B — Tooth state + prosthetic gate

- ANY missing/destroyed → `requiredAesthetic` cannot be `natural` if that implies natural teeth in those positions (see spec).
- `allowedChanges` / `forbiddenChanges` list prosthetic-appropriate language vs forbidden “regrow teeth”.

### Phase C — Modality rules (2–5)

- Whitelist/blacklist per treatment type as per original spec.
- Veneer scope = selected teeth; bonding = local only; implants = only selected edentulous sites.

### Phase D — Ancillary (6–9)

- Ortho/gum/untreated/bite: express as `forbiddenChanges` + `preservationRules` lines.

### Phase E — Mode (10) + shade clamping

- Mode changes caps and adds metadata for “imperfection” (conservative) vs “polished” (aspirational).

### Phase F — Tests

- **Minimum 12** table tests covering matrix in section 3 + one golden path per mode.

---

## 6. Copy-paste Cursor prompts (Opus 4.7)

### Prompt A — Types + skeleton

```
You are implementing the SmileAI constraint engine (TypeScript, no React).

1. Add lib/constraints/types.ts with TreatmentFormInput (mirror our multi-step form: category, material, per-tooth state 1-32, shape, shade, flags for ortho/gum, mode). Export TreatmentConstraints exactly as: treatmentType, allowedChanges, forbiddenChanges, requiredAesthetic: 'natural'|'prosthetic'|'cosmetic', shadeRange, preservationRules.

2. Add EngineResult { constraints, issues[] } with Issue = { severity, code, message }.

3. Add lib/constraints/engine.ts exporting evaluateTreatmentConstraints() that for now returns a stub matching types for a single hardcoded input.

4. Add lib/constraints/index.ts re-exporting only evaluateTreatmentConstraints and types.

No IO, no frameworks. Add comments where merge order will be filled in.
```

### Prompt B — Tooth state + prosthetic rules

```
Implement lib/constraints/rules/toothState.ts and wire it in engine.ts.

Rules:
- If any tooth is MISSING or DESTROYED, the outcome must not show natural teeth in those positions; requiredAesthetic must allow prosthetic documentation language; add explicit forbiddenChanges forbidding "natural teeth in edentulous sites" or equivalent.

- Healthy teeth (green) go to preservationRules as unchanged.

- "Needs treatment" (yellow) may be altered per selected procedure only.

Export pure functions. Update evaluateTreatmentConstraints to call toothState first and merge into TreatmentConstraints.

Add 4 unit tests in __tests__/engine.spec.ts for tooth-only scenarios.
```

### Prompt C — Whitening, bonding, veneers, implants

```
Implement lib/constraints/rules/treatmentModality.ts and integrate after toothState in engine.ts.

Enforce:
1) WHITENING / whitening-only: only color changes; no shape/alignment; extend forbiddenChanges accordingly.
2) BONDING: only small repairs on selected teeth; no full arch redesign; forbiddenChanges for "full smile design" language.
3) VENEERS: shape+color on selected teeth only unless full arch explicitly selected; if not full arch, cap allowedChanges to selected teeth; preservation for others.
4) IMPLANTS: only selected missing/destroyed sites; surrounding teeth preserved.

For conflicts, push to issues[] with error severity. Add tests for each rule.
```

### Prompt D — Ortho, gum, untreated, arch

```
Implement lib/constraints/rules/ancillaryProcedures.ts.

- If ortho not selected: alignment improvement must be in forbiddenChanges; add preservation for current alignment.
- If gum surgery not selected: gumline in preservationRules; gum alteration in forbiddenChanges.
- Untreated teeth explicitly unchanged in preservationRules.
- Original bite/arch preserved unless treatment implies otherwise (define boolean on form for "arch change expected" or infer from category — document choice in code comment).

Merge into engine. Add 4+ tests.
```

### Prompt E — Modes + shade

```
Implement lib/constraints/rules/modeAesthetic.ts.

Conservative: VITA A3 cap, "age-appropriate imperfections", asymmetry preserved — express as short bullet strings in allowedChanges or preservationRules as we agreed in types; set shadeRange to cap at A3 if user higher (document clamp rule).

Moderate: default, A2 cap similarly.

Aspirational: BL1, polished prosthetic language allowed; set a flag in EngineResult (e.g. disclaimers: 'aspirational') for later UI.

Wire merge last. Tests: same input with three modes produces three different shadeRange/required nuance.
```

### Prompt F — Test sweep

```
Review lib/constraints: ensure evaluateTreatmentConstraints is pure, deterministic, and all merge order is documented. Expand __tests__/engine.spec.ts to cover the interaction matrix in docs/constraint-engine-cursor.md section 3. Add edge case: empty tooth selection, conflicting whitening+veneers if form allows — return issues error.

Do not add prompts or Gemini code.
```

---

## 7. After the engine (next PR, still not prompt text)

- Wire `TreatmentFormData` (Zustand/RHF) to `TreatmentFormInput` in one mapper module (`lib/mappers/formToEngine.ts`) — **use Sonnet/4.6** for that glue.

---

*Generated for SmileAI; tweak types if your form field names differ — keep `TreatmentConstraints` stable for the prompt constructor.*