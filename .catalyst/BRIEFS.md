# Catalyst Briefs

Complete guide to briefs — what they are, how to write them, and how to work on them.

---

## What is a Brief?

A Brief is a PRD (Product Requirements Document) for a specific feature or phase of work. Briefs live in `/catalyst/briefs/`.

**Key distinction:** Core docs (Vision, Experience, Brand, Architecture) define the project. Briefs define individual work items.

A Brief should:
- Translate project vision and architecture into actionable scope
- Clearly define what "done" means for this work
- Prevent scope creep and ambiguity during build
- Enable confident estimation, sequencing, and review

A reader should be able to understand:
> "What are we building, for whom, within what constraints, and how will we validate it?"

---

## Brief States & Workflow

Briefs use a **state prefix** for easy sorting:

```
{state}-{date}_{brief-name}.md
```

| State | Meaning | When to Use |
|-------|---------|-------------|
| `_blocked` | Stuck, needs human attention | You can't continue without human input |
| `_review` | Done, awaiting human review | You finished the work |
| `active` | Currently being worked on | You're implementing this now |
| `approved` | Scoped and ready to start | Human approved, ready to pick up |
| `backlog` | Draft, not yet prioritised | Ideas, not ready for work |

**Underscore prefixes (`_blocked`, `_review`) sort first** — they need human attention.

### Starting Work

1. **Verify state:** Brief should be `approved-` or `backlog-`
2. **Rename the file:** `approved-` → `active-` (or `backlog-` → `active-`)
3. Begin implementation

### Completing Work

1. Finish implementation
2. **Update the acceptance checklist:** Tick items as completed, add notes where relevant
3. **Add a completion note** at the end of the brief (see template below)
4. **Rename the file:** `active-` → `_review-`

#### Completion Note Template

Add this section at the end of the brief before renaming to `_review-`:

```markdown
---

## Completion Notes

**Completed by:** [agent/session identifier]
**Date:** [YYYY-MM-DD]

### What was delivered
- [Summary of what was built]

### What needs human review
- [Specific areas to check]

### Known limitations
- [Any shortcuts or deferred items]
```

### If Blocked

1. **Rename the file:** `active-` → `_blocked-`
2. Document what you're blocked on in the brief or conversation

### Completed/Archived Briefs

After human review:
- **Approved:** Move to `complete/` folder with `complete-` prefix
- **Canned:** Move to `archive/` folder with `archive-` prefix

---

## Brief Structure (Required)

Every brief should follow this structure. Use `/brief` to create a new brief interactively.

### Phase Type (If Applicable)

If this brief represents a major phase, state it at the top:
- **POC** (proof-of-concept: prove feasibility / direction)
- **MVP** (minimum viable product: smallest valuable usable release)
- **MMP** (minimum marketable product: ready for external release / adoption)
- **Pilot** (controlled rollout to validate value and operations)
- **Production v1** (hardened, supported release)

For feature briefs within a phase, reference which phase you're working in.

### 1. Summary
- One-paragraph summary of what will be delivered
- Primary users / stakeholders
- The core outcome this work is designed to achieve

### 2. Objectives & Success Criteria

List clear objectives. For each, include success criteria that are:
- Observable
- Testable at prototype level
- Appropriate to the phase type

Examples:
- "A stakeholder can complete the primary journey end-to-end in under 2 minutes."
- "The POC demonstrates the key workflow without needing explanation."

### 3. Users, Roles & Permissions

List user roles included in this work. For each role:
- Key goals for this phase
- Critical tasks they must be able to do
- What is explicitly NOT required for this role yet

If authentication/permissions are not in scope, say so clearly.

### 4. Scope Definition (Hard Boundaries)

#### In Scope (Must Deliver)
Explicit list of what will be delivered:
- Experiences / journeys
- Modules / sections
- Screens / pages
- Key interactions

#### Out of Scope (Must NOT Deliver)
What is explicitly excluded:
- Features, integrations, data persistence
- Authentication and security hardening
- Automations, reporting/analytics
- Edge cases and "Not now" items

### 5. Requirements (Execution-Ready)

Write requirements as clear statements, grouped by area:
- Required behaviours
- Required states (view/edit/error/empty if relevant)
- Data assumptions (mocked, seeded, static, placeholder)

Keep requirements specific enough to implement, not so detailed they prescribe solutions.

Format: **R#** Requirement statement

### 6. Non-Functional Requirements

Constraints appropriate to the phase:
- Performance expectations
- Accessibility expectations
- Responsiveness (mobile/desktop)
- Data/privacy constraints
- Brand/tone expectations

Be explicit about "prototype acceptable" vs "production required later".

### 7. Design & Content Requirements

What's required for:
- Design direction (principles, tone)
- Content approach (real content vs placeholder)
- Trust cues (where users need clarity/confidence)

### 8. Risks, Assumptions & Open Questions

- Key risks that could derail this work
- Assumptions the scope depends on
- Open questions (mark as: **Blocker**, **During Build**, or **Post-Phase**)

### 9. Acceptance Checklist

Checklist to validate completion:
- [ ] Required journeys demonstrable end-to-end
- [ ] Required screens/sections exist and are navigable
- [ ] Scope boundaries respected (no "extra features")
- [ ] Success scenarios are demonstrable
- [ ] Known exclusions remain excluded

### 10. Handoff Notes (For Implementation Agent)

Help the implementation agent understand:
- What to prioritise first
- What to be careful not to overbuild
- What assumptions to confirm early
- What "good" looks like for a first iteration

---

## Brief Callout (Required)

Every brief **must** include this callout immediately after the title:

```markdown
> **Catalyst Brief** — Read [AGENTS.md](../AGENTS.md) and [BRIEFS.md](BRIEFS.md) before implementing.
```

---

## Style & Tone

- Clear, structured, and unambiguous
- Write in **UK English suitable for New Zealand** (unless instructed otherwise)
- No fluff, no hype
- Use headings and bullet points
- Prefer explicit boundaries over implied intent

---

## Creating New Briefs

Use `/brief` to create a new brief interactively. The command will:
1. Ask clarifying questions about scope, users, and success criteria
2. Draft the brief following this structure
3. Save to `/catalyst/briefs/backlog-YYYYMMDD_{brief-name}.md`

---

## Dashboard

View all briefs at `/catalyst/briefs` in the app.
