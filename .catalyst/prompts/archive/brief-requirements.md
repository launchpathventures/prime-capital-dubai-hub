## Handover Prompt — Brief Requirements (PRD)
_This prompt helps AI write a Brief — a Product Requirements Document for a specific feature or phase of work._

@AI: You are now producing a **Brief** (Project Brief / PRD).

**Stability note:** This prompt is intentionally stable. Only update it when the required structure, voice rules, or recurring AI failure modes indicate the template itself needs correcting.

---

## Understanding Briefs vs Core Docs

**Core Project Documents** (in `/catalyst/specs/`):
- `project-vision.md` — North star, success criteria, decision principles (stable, rarely changes)
- `project-experience.md` — Users, journeys, features (occasionally updated)
- `project-brand.md` — Voice, visuals, communication style (stable)
- `project-architecture.md` — Technical stack, patterns, conventions (ongoing)

**Briefs** (in `/catalyst/briefs/`):
- Individual PRDs for specific features, phases, or bodies of work
- Created as needed throughout the project
- The first brief (building the POC) is effectively the first PRD
- Each brief defines what will be delivered, with boundaries and acceptance criteria

**Key distinction:** Core docs define the project. Briefs define individual work items.

---

## Purpose of a Brief

A Brief (PRD) should:
- Translate the project vision and architecture into an actionable scope for a specific feature or phase
- Clearly define what "done" means for this work
- Prevent scope creep and ambiguity during build
- Enable confident estimation, sequencing, and review

A reader should be able to understand:
> "What are we building in this brief, for whom, within what constraints, and how will we validate it?"

---

## Step 1: Declare the Phase Type (If Applicable)

If this brief represents a major phase (POC, MVP, MMP, Pilot, Production), state it at the top:
- **POC** (proof-of-concept: prove feasibility / direction)
- **MVP** (minimum viable product: smallest valuable usable release)
- **MMP** (minimum marketable product: ready for external release / adoption)
- **Pilot** (controlled rollout to validate value and operations)
- **Production v1** (hardened, supported release)

For feature briefs within a phase, reference which phase you're working in and what this feature contributes.

Then define:
- The primary purpose of this brief
- What this work is intended to prove or deliver
- What would indicate successful completion

---

## Required Structure

### 1. Summary
- One-paragraph summary of what will be delivered in this brief
- Primary users / stakeholders
- The core outcome this work is designed to achieve

---

### 2. Objectives & Success Criteria
List clear objectives for this work.

For each objective, include success criteria that are:
- observable
- testable at prototype level
- appropriate to the phase type

Examples of success criteria:
- "A stakeholder can complete the primary journey end-to-end in under 2 minutes."
- "The POC demonstrates the key workflow without needing explanation."
- "The pilot captures required feedback signals."

---

### 3. Users, Roles & Permissions (Phase-Specific)
List the user roles included in this work.

For each role:
- Key goals for this phase
- Critical tasks they must be able to do
- What is explicitly NOT required for this role yet

If authentication/permissions are not in scope, say so clearly and describe how role-based testing will occur (e.g. demo switcher, mocked profiles).

---

### 4. Scope Definition (Hard Boundaries)

#### In Scope (Must Deliver)
Provide an explicit list of what will be delivered, grouped logically:
- experiences / journeys
- modules / sections
- screens / pages (where relevant)
- key interactions

Use clear language and avoid implementation detail.

#### Out of Scope (Must NOT Deliver)
List what is explicitly excluded from this work, including:
- features
- integrations
- data persistence
- authentication and security hardening
- automations
- reporting/analytics
- edge cases

Also include "Not now" items that are tempting but intentionally deferred.

---

### 5. Requirements (Execution-Ready)

Write requirements as clear statements, grouped by area (not by speculation).

For each area:
- Provide required behaviours
- Provide required states (view/edit/error/empty if relevant)
- Provide any data assumptions (mocked, seeded, static, placeholder)

Keep requirements:
- specific enough to implement
- not so detailed that they prescribe technical solutions

Where appropriate, use a format like:
- **R#** Requirement statement
- **Notes:** clarifying context or boundaries

---

### 6. Non-Functional Requirements (Appropriate to Phase)
List constraints that apply to this work, such as:
- performance expectations (lightweight, demo-ready, etc)
- accessibility expectations (baseline vs production)
- responsiveness (mobile/desktop)
- data/privacy constraints
- hosting/deployment expectations (if discussed)
- brand/tone expectations (if applicable)

Be explicit about what is "prototype acceptable" vs "production required later".

---

### 7. Design & Content Requirements
Include what is required for:
- design direction (principles, tone)
- content approach (real content vs placeholder)
- trust cues (where users need clarity/confidence)
- any sensitive considerations (culture, governance, identity, language)

Do not turn this into a design system — focus on what matters for this work.

---

### 8. Risks, Assumptions & Open Questions
Provide:
- Key risks that could derail this work
- Assumptions the scope depends on
- Open questions that must be resolved

Mark each open question as one of:
- **Blocker** (must be answered before build)
- **During Build** (can be decided while implementing)
- **Post-Phase** (can be deferred safely)

---

### 9. Acceptance Checklist
Provide a checklist that can be used to validate completion.

Must include:
- required journeys demonstrable end-to-end
- required screens/sections exist and are navigable
- scope boundaries respected (no "extra features")
- success scenarios from the Vision are demonstrable
- known exclusions remain excluded
- clear handoff notes for next phase

For POC/MVP, prioritise demonstrability over completeness.

---

### 10. Handoff Notes (For Implementation Agent)
Add a short section that helps an implementation-focused agent:
- what to prioritise first
- what to be careful not to overbuild
- what assumptions to confirm early
- what "good" looks like for a first iteration

Do not include code or repo-specific instructions.

---

## Brief Callout (Required)

Every brief **must** include this callout immediately after the title:

```markdown
> **Catalyst Brief** — Read [AGENTS.md](../../AGENTS.md) and [BRIEFS.md](../BRIEFS.md) before implementing.
```

This ensures AI agents know to check the workflow documentation before starting work.

---

## Brief Naming Convention

Save the resulting brief to `/catalyst/briefs/` using the naming convention:

```
{state}-{date}_{brief-name}.md
```

**States:** `backlog` (not started), `approved` (ready to start), `active` (in progress), `_review` (done, needs review), `_blocked` (stuck)

**Examples:**
- `backlog-20260107_user-authentication.md`
- `approved-20260107_payment-integration.md`
- `active-20260107_dashboard-redesign.md`

See `AGENTS.md` for the full brief workflow.

---

## Style & Tone Requirements
- Clear, structured, and unambiguous
- Write in **UK English suitable for New Zealand** (unless instructed otherwise)
- No fluff, no hype
- Use headings and bullet points
- Prefer explicit boundaries over implied intent

---

## Final Check Before Output
Ensure:
- Phase type is clearly stated (if applicable) and reflected in the level of detail
- In-scope and out-of-scope are explicit and strict
- Requirements are implementable without guessing
- Open questions are clearly labelled by urgency
- Another AI could implement this without re-reading the full chat history

Now produce the **Brief** in markdown format.
