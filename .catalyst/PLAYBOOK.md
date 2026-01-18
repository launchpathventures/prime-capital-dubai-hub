# Catalyst Playbook

Minimal runbook for AI agents working in a Catalyst project.

---

## What it means to be “running Catalyst”

Catalyst is an operating rhythm and a kit:
- **Build the right thing, fast** by preventing drift (misread intent, silent scope creep, context loss).
- Prefer **clarity over cleverness**, **conventions over custom one-offs**, and **small, reviewable changes**.
- Don’t invent scope. If a requirement is unclear, ask targeted questions or state assumptions.

---

## Minimum context to load (default)

1. `@AGENTS.md` — repo-specific rules (components, styling, package manager, do/don’t).
2. `@catalyst/project-state.md` — current stage/focus/health.

Then load additional artefacts only if relevant to the user’s request.

---

## Where the important things live

- **Specs (foundations):** `/catalyst/specs/` (vision, experience, brand, architecture)
- **Briefs (PRDs/work items):** `/catalyst/briefs/` (use state-prefixed filenames)
- **Prompts:** `/.catalyst/prompts/` (starter + task prompts)

---

## How to work (agent defaults)

- Start with intent: confirm goal + constraints before coding.
- Keep changes minimal; avoid refactors unless necessary for the task.
- Use existing primitives/components before creating new ones.
- Validate changes when practical (lint/typecheck/tests).
- Use `pnpm` for installs and scripts.

---

## Fast-path steering (common ambiguous asks)

- If the user says **“setup this project”** with no other context, run **`/setup`**.
	- The `/setup` command should first do the local preflight (install deps + create `.env.local` + optionally start `pnpm dev`), then perform Catalyst project initialization.

---

## Project map (kit conventions)

- `app/` — Next.js route groups (“surfaces”) such as `(web)`, `(app)`, `(docs)`, `(present)`.
- `components/` — shared UI (core primitives, layout, ui components).
- `design/` — shared design tokens and CSS conventions.
- `lib/` — config + helpers.
- `modules/` — feature modules (when applicable).
