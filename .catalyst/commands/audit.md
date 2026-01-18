---
description: Catalyst: Run codebase audit
argument-hint: [audit-type] [stage-level] [scope]
---

Run a structured quality audit on the codebase.

@.catalyst/prompts/repo-audit.md

## Repo Context

- Read `@AGENTS.md` for repo conventions
- Check current stage from project artefacts

## Required Inputs

1. **Audit Type** — Security, Accessibility, Performance, Code Quality, or All
2. **Stage Level** — POC, MVP, MMP, or PROD (determines quality bar)
3. **Scope** — All, specific surface, folder, or feature

If `$ARGUMENTS` provided, parse for these values. Otherwise, ask.
