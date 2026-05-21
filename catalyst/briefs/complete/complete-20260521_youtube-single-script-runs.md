# Brief: Single-Script Runs — Preserve Context & Try All 3 Angles

**ID:** YT-SINGLE-RUNS
**Status:** Approved
**Priority:** P1 — Workflow improvement
**Surface:** Admin / YouTube generator (Mode B — "Write One Script")
**Estimate:** 0.5–1 day
**Tags:** youtube, ai-agent, workflow

---

## Objective

Make the "Write One Script" flow non-destructive: when a user pastes context (text + optional voice note transcript) and gets 3 distilled angles back, that whole bundle becomes a persistent **run**. The user can pick any of the 3 angles, generate the script, view it, and then come back to the run and try a different angle — without losing the original context, the voice note transcript, or the other two angles.

---

## Background

Today the single-script flow is destructive:

1. User pastes context (and optionally records a voice note that's transcribed inline).
2. `distill-idea` returns 3 angles.
3. User picks **one**, the row is created in `youtube_scripts`, the user is routed to the detail page and Opus streams.
4. If the chosen angle is wrong, the user starts over: re-paste context, re-record the voice note, re-run distil — the other 2 angles and the transcript are gone.

The 3-angle distillation is the expensive thinking step. We should bank it.

---

## Scope

### In scope

- Persist a "run" = `{context_text, format, profile_slug, angles[3]}` in a new `youtube_script_runs` table.
- After distil, redirect to a new run workspace page `/admin/youtube/runs/[runId]` (replaces the inline confirm step).
- On the run page, the user can:
  - View the editable context (text + transcript) and append more via the voice note button.
  - Re-distil if the context changes (overwrites the run's angles — only affects angles not yet generated).
  - For each of the 3 angles: **Generate this angle** (creates a script row linked to the run via `run_id` + `angle_index`, routes to the existing detail page) or **View script** (if already generated).
  - Edit the angle's title/topic inline before generating.
- Script detail page: a `← Back to angles` link appears in the header when the row has a `run_id`, so the user can flip between angles in the same run.

### Out of scope

- Side-by-side comparison view across angles.
- Storing the raw audio recording (only the transcript persists, as today).
- Regenerating an angle that has already been generated (the existing detail-page regen pipeline still works per-script).
- Changes to the brainstorm or review-and-rewrite flows.

---

## Data model

### New table

`public.youtube_script_runs`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid pk default gen_random_uuid()` | |
| `user_id` | `uuid` | FK `auth.users(id) on delete set null` |
| `context_text` | `text not null` | The full editable context (includes voice transcript) |
| `format` | `text not null` | CHECK ∈ the 6 format slugs |
| `profile_slug` | `text not null default 'tahir'` | CHECK ∈ `('tahir', 'ahmed')` |
| `angles` | `jsonb not null` | Array of `{title, topic, why_this_angle, news_peg, needs_news_peg, target_length}` |
| `created_at` | `timestamptz default now()` | |
| `updated_at` | `timestamptz default now()` | Trigger-maintained |

RLS: single `FOR ALL` policy whose `using`/`with check` inline the same role-membership test used by `youtube_scripts` (`admin | marketing | youtube_editor`). Mirrors the existing pattern; do not introduce a new gate.

### Columns added to `youtube_scripts`

| Column | Type | Notes |
|---|---|---|
| `run_id` | `uuid null` | FK `youtube_script_runs(id) on delete set null` |
| `angle_index` | `int null` | 0..2 — which angle in the run produced this row |

Index: `idx_youtube_scripts_run on (run_id)` for the run → scripts lookup.

---

## API & server actions

No new HTTP routes. The existing `distill-idea` route stays pure-LLM; persistence happens in server actions called by the client after the LLM returns.

New server actions in `lib/actions/youtube.ts`:

- `createYouTubeScriptRun({context_text, format, profile_slug, angles})` → row.
- `getYouTubeScriptRun(id)` → row.
- `updateYouTubeScriptRun(id, {context_text?, angles?})` → row. Used when the user edits context, re-distils, or edits an angle inline.
- `getYouTubeScriptsForRun(runId)` → `YouTubeScript[]` — to know which angle indices have a generated script.

New shared type: `YouTubeScriptRun`.

---

## UI changes

### `app/(admin)/admin/youtube/new/single/single-script-workflow.tsx`

Step 1 (input) stays. On successful distil:

1. Call `createYouTubeScriptRun` with the context + 3 angles.
2. Redirect to `/admin/youtube/runs/{runId}` (replaces the old `step === "confirm"` branch).

The inline confirm UI is removed from this file — its job is handled by the run page.

### New: `app/(admin)/admin/youtube/runs/[id]/page.tsx`

Server component that loads the run + any scripts already generated for it. Renders a client component that:

- Shows the locked profile chip + format pill at the top.
- Shows the editable context textarea + `VoiceNoteButton` (appends transcript, same hook as today).
- Shows a **Re-distil** button (disabled while no edits, calls `distill-idea`, then `updateYouTubeScriptRun({angles})`). Re-distil only replaces angles not yet generated.
- Shows 3 angle cards. Per card:
  - If `getYouTubeScriptsForRun` does not include this `angle_index` → **Generate this angle** button. Click: `createYouTubeScript({...angle, format, profile_slug, run_id, angle_index, status: 'idea'})`, route to `/admin/youtube/{newId}?autoGenerate=1`.
  - Otherwise → **View script** button + status badge. Click: route to `/admin/youtube/{id}`.
  - Title/topic are inline-editable (same affordance as the old confirm step), but only when the angle has not yet been generated. The edit persists via `updateYouTubeScriptRun({angles})`.
  - `needs_news_peg` blocks generation as it does today.

### `app/(admin)/admin/youtube/[id]/script-detail-page.tsx`

In the header `← back` button, if `script.run_id` is present, route to `/admin/youtube/runs/{script.run_id}` instead of the script list. Otherwise unchanged.

---

## Invariants & edge cases

- **Re-distil never overwrites a generated angle.** Server action merges: keep entries whose `angle_index` already has a script row; replace the rest.
- **Coerce on load.** Unknown `format`/`profile_slug` on a run row never errors — coerce to default, same rule as the rest of the YouTube system.
- **Run deletion cascade.** Deleting a run nulls `run_id` on dependent scripts (keep the scripts; they're real work). FK is `on delete set null`.
- **Voice note** appends to `context_text` exactly as it does in the old workflow. No new schema for audio.
- **Auth/RLS** identical to the other YouTube tables — no new gate.

---

## Test plan

- Walk a run end-to-end:
  - Paste context + record a voice note → distil → land on the run page → context + 3 angles present.
  - Generate angle 1 → view streamed script → click `← Back to angles` → angle 1 shows "View script", angles 2 + 3 still say "Generate".
  - Generate angle 2 → confirm both angle 1 and 2 are now visible from the run page, navigable independently.
  - Edit context, click re-distil → confirm angles 1 + 2 are preserved (they have scripts) and only the remaining angle slot is refreshed.
- Confirm RLS: a `youtube_editor` user can read/write their own runs.
- Confirm an old, runless script's detail page back link still goes to the list (no regression).

---

## Recommended sequence

1. Migration (table, columns, indexes, RLS policy, updated_at trigger).
2. Server actions + `YouTubeScriptRun` type.
3. Reshape `single-script-workflow.tsx` to redirect to the run page after distil.
4. Build the run page (`/admin/youtube/runs/[id]`).
5. Wire the `← Back to angles` link in the script detail page.
6. Smoke-test in dev.
