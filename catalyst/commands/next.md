description: Suggest the next best action and command to run
argument-hint: [goal-or-stuck-point]
description: Catalyst: Recommend next step
Suggest the next best action based on repo reality and the user’s goal.

@catalyst/prompts/support-next.md

## Repo Context

If repo access is available, use it to ground your recommendations:
- If needed, first generate a quick State of Play using: `@catalyst/prompts/repo-status.md`
- Review `catalyst/project-state.md` (stage, focus, health, blockers)
- Review briefs in `catalyst/briefs/` (especially `active-`, `_blocked-`, `_review-`)
- Skim relevant specs in `catalyst/specs/` if alignment is unclear

## Constraints

- Do not invent scope or tasks not implied by repo context.
- Prefer the smallest actionable next step.
- Recommend follow-up Catalyst commands explicitly (e.g. `/brief`, `/build`, `/review`, `/refine`, `/decide`, `/align`, `/debug`, `/status`).
