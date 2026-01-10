description: Generate state-of-play summary for handoffs and check-ins
description: Catalyst: Generate state of play
Generate a Project State of Play — a factual snapshot of where we are now.

@catalyst/prompts/repo-status.md

## Process

1. **Generate State of Play**
	- Follow the required sections in the prompt
	- Keep it factual; do not invent scope

2. **Optional Save**
	- Ask: "Want me to save this State of Play to `catalyst/temp/`?"
	- If yes, save to `catalyst/temp/YYYYMMDD_HHMM_state-of-play.md`
	- Reply with the file path

## Repo Context

Review project state:
- Read `@catalyst/BRIEFS.md` to understand state prefixes
- Briefs in `/catalyst/briefs/` (check for `active-`, `_review-`, `_blocked-`)
- Project specs in `/catalyst/specs/`
- Recent changes in the codebase

## Optional Follow-up

After you generate the State of Play, ask the user:
> "Do you want me to update `catalyst/project-state.md` to match this snapshot?"

If yes:
- Propose the smallest safe edits (do not invent scope)
- Show exactly what would change
- Wait for explicit confirmation before applying any updates
