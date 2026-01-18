# Catalyst State

How to keep project state current so humans and AI stay aligned.

The state file lives at `/catalyst/project-state.md`. The dashboard displays it at `/catalyst`.

---

## When to Check State

**At the start of work:**
- Read `project-state.md` to understand current focus and goals
- Check for blockers that might affect your work
- Verify your work aligns with the focus and goals

**At the end of work:**
- Update Recent Progress with what you completed
- Update Next Steps if priorities changed
- Update blockers if you encountered or resolved any
- Update the `updated` date in frontmatter

**When completing a brief:**
- Update Recent Progress
- Check if focus needs to shift
- Check if any goals were achieved or progressed

---

## Frontmatter Fields

The YAML frontmatter is parsed for the dashboard. Keep it accurate.

| Field | When to Update | Example |
|-------|----------------|---------|
| `stage` | When moving between POC → MVP → MMP → PROD | `mvp` |
| `project_version` | When you ship meaningful progress (milestones/releases) | `0.5.0`, `0.9.0`, `1.0.0` |
| `catalyst_version` | When you update the Catalyst baseline used by this project | `0.9.0` |
| `catalyst_ref` | When you want reproducibility (pin to a commit/tag) | `573187f` |
| `focus` | When primary work focus shifts | `Launch Catalyst Pro — Billable MMP release (Feb 2026)` |
| `target` | When milestone or date changes | `Catalyst Pro MMP — Feb 2026` |
| `updated` | Every time you edit the frontmatter | `2026-01-07` |
| `health` | When project health changes | `green`, `yellow`, `red` |
| `blockers` | Add when blocked, remove when resolved | `["Waiting on API access"]` |
| `goals` | Rarely — when goals achieved or strategy shifts | Array of goal strings |
| `lead` | When project lead changes | `Isaac Rolfe (RIVER Group)` |
| `support` | When team changes | Array of names |

### Versioning (Project vs Catalyst)

- `project_version` is the version of **the thing you’re building**.
- `catalyst_version` is the version of **Catalyst** this project is based on.
- When working on Catalyst itself, these may be the same — but for downstream projects they will diverge.

**Suggested milestone targets (guidance, not a rule):**
- POC: `0.5.0`
- MVP: `0.9.0`
- MMP: `1.0.0`

**Setup/init convention:**
- At the start of setup: set `project_version: 0.0.0` (scaffold in progress)
- At the end of setup (success): set `project_version: 0.1.0` (bootstrapped baseline)

---

## Changelog + Versioning Discipline

Catalyst includes a changelog file at `catalyst/CHANGELOG.md` (rendered in `/catalyst/roadmap`).

### When to update the changelog

Update `catalyst/CHANGELOG.md` whenever you make **notable** changes that affect:
- user-visible behaviour or UI
- core conventions, workflows, or agent guidance
- surfaces/modules/routes
- configuration, setup flow, or defaults

Small refactors, formatting-only changes, and purely internal churn usually don’t need a changelog entry.

### How AI should handle version bumps

Use SemVer as a decision aid:
- **Patch** (e.g. `0.9.0` → `0.9.1`): fixes, tiny improvements, docs tweaks
- **Minor** (e.g. `0.9.0` → `0.10.0`): additive changes, new non-breaking capability
- **Major** (e.g. `0.9.0` → `1.0.0`): breaking changes, resets, removals, or workflow changes that require teams to adjust

**Agent rule:**
- If the change is clearly patch/minor, the AI may proceed and (when appropriate) suggest or apply the bump.
- If the change might be **major**, the AI must pause and ask you to confirm the target version number before bumping.

### Keeping `project_version` and `CHANGELOG.md` aligned

- `project_version` is the “current release train” number.
- `catalyst/CHANGELOG.md` should contain a matching release entry (or `[Unreleased]` while in progress).

Practical workflow:
1. Add notes under `[Unreleased]` as you work.
2. When you decide to bump `project_version`, move relevant bullets from `[Unreleased]` into a new `[x.y.z] - YYYY-MM-DD` section.

---

## Health Status

| Status | Meaning | Action |
|--------|---------|--------|
| `green` | On track, no blockers | Continue as planned |
| `yellow` | Minor blockers or risks | Flag in blockers, may need attention |
| `red` | Critical blockers, off track | Escalate immediately, update blockers |

---

## Goals vs Focus vs Briefs

| Level | Scope | Changes |
|-------|-------|---------|
| **Goals** | High-level outcomes (what success looks like) | Rarely — quarterly or on major pivots |
| **Focus** | Current primary objective | When major milestones complete |
| **Briefs** | Individual work items | Frequently — as work progresses |

**Alignment rule:** Every brief should support the focus. The focus should drive toward the goals. Goals should align with project vision.

---

## Markdown Body Sections

Keep the markdown body in sync with frontmatter. These sections are for humans.

| Section | Purpose |
|---------|---------|
| **Current Focus** | Expanded version of frontmatter focus |
| **Recent Progress** | What's been completed (bullet list) |
| **Next Steps** | What's coming next (numbered list) |
| **Open Questions** | Decisions needed, unknowns |
| **Milestones** | Timeline table with status |
| **Team** | Expanded team info |

---

## Stage Definitions

| Stage | Meaning | Focus |
|-------|---------|-------|
| `poc` | Proof of Concept | Validate the idea |
| `mvp` | Minimum Viable Product | Test with users |
| `mmp` | Minimum Marketable Product | Public launch |
| `prod` | Production | Stability & scale |

---

## Example Update Flow

**Starting a session:**
```
1. Read project-state.md
2. Note current focus: "Launch Catalyst Pro"
3. Check goals: Are you working toward one of these?
4. Check blockers: Anything affecting your work?
5. Proceed with aligned work
```

**Ending a session:**
```
1. Add completed work to Recent Progress
2. Update Next Steps if changed
3. Add/remove blockers as needed
4. Update `updated` date in frontmatter
5. If health changed, update `health` field
```

**Completing a goal:**
```
1. Update the goal text (e.g., add "✓" or move to completed section)
2. Consider if focus should shift
3. Update Recent Progress
4. Celebrate 🎉
```

---

## Tips

- **Be concise** — State is a snapshot, not a journal
- **Update often** — Small updates are better than big catch-ups
- **Keep frontmatter and body in sync** — Dashboard reads frontmatter, humans read body
- **Don't overload goals** — 3-5 goals maximum keeps focus tight
- **Blockers are temporary** — Remove them when resolved
