---
description: Catalyst: Build from brief
argument-hint: [brief-name]
---

Implement a brief (PRD) with phased, reviewable output.

@.catalyst/prompts/loop-2-build.md

## Repo Context

Read before implementing:
- `@AGENTS.md` — Repo conventions
- `@catalyst/project-state.md` — Current stage

## Process

1. **Find the brief** — If `$ARGUMENTS` provided, look for that brief in `/catalyst/briefs/`
2. **Confirm understanding** — Show goals, constraints, stage before writing code
3. **Propose phases** — Break work into reviewable chunks
4. **Implement** — One phase at a time, summarise after each
5. **Complete** — Handoff to `/review` when done
