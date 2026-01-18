# Catalyst-Enabled Setup

**Build the right thing, fast.**

Add Catalyst methodology to any existing codebase.

---

## About This Prompt

**Use case:** Adding Catalyst to an existing project (Laravel, Vue, Python, WordPress, Django, Rails, etc.)

**Prerequisites:**
- `.catalyst/` folder copied to project root (methodology)
- `.claude/` and `.github/` folders copied if you want slash commands (optional)

**What happens:** You'll have project state, briefs, specs, and AI-friendly docs without changing your tech stack.

**Not for:** New projects starting from scratch — use `/setup` instead.

---

## Quick Reference (for AI Agents)

| Phase | Agent | Duration | Purpose |
|-------|-------|----------|---------|
| **Phase 1** | Local | ~10 mins | Create structure, discovery, create setup brief |
| **Phase 2** | Any | Async | Deep analysis, create all specs, flesh out AGENTS.md |

### Key Actions by Phase

| Phase 1 (Local) | Phase 2 (Any Agent) |
|-----------------|---------------------|
| Check if already configured | Read the setup brief |
| Quick codebase scan | Deep codebase analysis |
| Ask discovery questions | Create project-vision.md |
| Create `/catalyst` folder structure | Create project-experience.md |
| Create/update AGENTS.md (minimal) | Create project-brand.md |
| Create project-state.md | Create project-architecture.md |
| Create setup brief | Flesh out AGENTS.md |
| Hand off to Phase 2 | Set recommended stage |
| | Move brief to `_review-` |

### Resuming Mid-Setup

If the user starts a new chat:
- **"Continue setup"** or **"Run Phase 1"** → Start/resume Phase 1
- **"Run Phase 2"** → Look for `active-*_catalyst-enabled-setup.md` brief
- **"Check status"** → Check if `catalyst/project-state.md` exists

---

## Detection Logic

Simple check:

```
Does catalyst/project-state.md exist?
  NO  → Fresh install, run Phase 1
  YES → Already configured
```

### If Already Configured

Ask the user:
> "This project already has Catalyst configured. Would you like to:
> 1. Review the current setup
> 2. Reset and start fresh
> 3. Something else?"

If resetting: delete `catalyst/` folder contents and `AGENTS.md`, then run Phase 1.

---

# PHASE 1: Local Agent Setup

**Purpose:** Create folder structure, gather context, create setup brief for deep-dive.
**Duration:** ~10 minutes with user interaction.

---

## Step 1.1: Check Detection

Run the detection logic above.

- If `catalyst/project-state.md` exists → Ask user what they want to do
- If it doesn't exist → Continue with Step 1.2

---

## Step 1.2: Explain the Process

Explain the 2-phase process to the user:

```
## Catalyst-Enabled Setup

I'll help you add Catalyst methodology to this project. This is a 2-phase process:

### Phase 1: Setup (now, ~10 mins)
I'll scan the codebase, ask a few questions, create the folder structure, and prepare a brief for the deep-dive.

### Phase 2: Deep-Dive (async or continue)
An agent will do the heavy lifting — analyzing the full codebase and creating all the spec documents (vision, experience, brand, architecture).

Ready to start?
```

**Wait for user confirmation before proceeding.**

---

## Step 1.3: Quick Codebase Scan

Scan the project to understand the basics. Look for:

| What | Where to Look |
|------|---------------|
| **Stack** | `composer.json`, `package.json`, `requirements.txt`, `Gemfile`, `go.mod`, etc. |
| **Framework** | Folder structure, config files, entry points |
| **Database** | Config files, migrations folder, `.env` |
| **Structure** | Top-level folders, README, existing docs |
| **Existing AGENTS.md** | Project root |

Summarize findings internally (don't show all details to user yet).

---

## Step 1.4: Discovery Questions

Present these questions to the user. Show what you've inferred and ask for confirmation/correction:

```
## Quick Discovery

Based on my scan, here's what I found:

**Stack:** [Your inference — e.g., "Laravel 11, Vue 3, MySQL"]
**Structure:** [Brief description — e.g., "Standard Laravel with Inertia.js"]

Please confirm or correct, then answer these questions:

1. **Project name and purpose?**
   What should I call this project? What does it do in one sentence?

2. **Primary users?**
   Who uses this? (e.g., "Internal team", "B2B customers", "Consumers")

3. **Current state?**
   - [ ] Early development (building core features)
   - [ ] Active product (users, iterating on features)
   - [ ] Mature/stable (maintenance mode)
   - [ ] Legacy (needs modernization)

4. **What's the current focus?**
   What are you working on right now? What matters most?

5. **Any major constraints or pain points?**
   Technical debt, scaling issues, team challenges? (Skip if none)
```

**Wait for user response before proceeding.**

---

## Step 1.5: Confirm Discovery Summary

After user responds, summarize and confirm:

```
## Discovery Summary

**Project:** [Name] — [One-line purpose]
**Stack:** [Framework/Language], [Database], [Key deps]
**Users:** [Primary personas]
**State:** [Early/Active/Mature/Legacy]
**Focus:** [Current priorities]
**Constraints:** [Pain points, or "None noted"]

Does this look accurate? Any corrections before I create the folder structure?
```

**Wait for user confirmation before proceeding.**

---

## Step 1.6: Create Folder Structure

Create the `/catalyst` folder and all subfolders:

```
catalyst/
├── project-state.md
├── CHANGELOG.md
├── FEEDBACK.md
├── briefs/
│   ├── archive/
│   └── complete/
├── specs/
├── inspiration/
└── temp/
```

### project-state.md

Create with discovery info (use today's date in `YYYY-MM-DD` format):

```markdown
---
stage: init
project_version: 0.0.0
catalyst_version: 0.9.0

focus: [Focus from discovery]
updated: [TODAY as YYYY-MM-DD, e.g., 2026-01-15]
health: green
blockers: []

goals:
  - [Infer 2-3 goals from discovery context]
  - [Or leave as placeholder if unclear]

lead: [Ask user or leave blank]
support: []
---

# [PROJECT_NAME] – Project State

Track where the project is right now. Update this as the project progresses.

---

## Current Focus

**Stage:** Init (Catalyst setup in progress)

**Focus:** [Focus from discovery]

---

## Recent Progress

- Initialized Catalyst methodology
- Created project structure

---

## Next Steps

1. Complete Catalyst setup (Phase 2 — create specs)
2. [First real work item from discovery]

---

## Open Questions

- [Any questions raised during discovery]

---

## Team

**Lead:** [From discovery or TBD]
```

### CHANGELOG.md

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

---

## [Unreleased]

### Added
- Catalyst methodology setup
```

### FEEDBACK.md

```markdown
# Feedback

Capture feedback, learnings, and observations during development.

---

## Format

### [DATE] — [Source]
- Feedback item
- Another observation

---

## Feedback Log

_No feedback captured yet._
```

Create empty folders with `.gitkeep` files (so they're tracked in git):
- `catalyst/briefs/archive/.gitkeep`
- `catalyst/briefs/complete/.gitkeep`
- `catalyst/specs/.gitkeep`
- `catalyst/inspiration/.gitkeep`
- `catalyst/temp/.gitkeep`

---

## Step 1.7: Create or Update AGENTS.md

Check if `AGENTS.md` exists at project root.

### If AGENTS.md Exists

Add this section near the top of the file. Look for a natural break after any title/intro paragraph, before the first major section heading:

```markdown
---

## Catalyst Methodology

This project uses **Catalyst** for AI-assisted development.

**Read first:** `.catalyst/PLAYBOOK.md` → then check `catalyst/project-state.md` for current focus.

**Working on features:** Check `catalyst/briefs/` for work items and follow `.catalyst/BRIEFS.md`.

---
```

Keep all existing content intact.

### If AGENTS.md Does NOT Exist

Create a minimal version:

```markdown
# AI Agent Instructions

This project uses **Catalyst** for AI-assisted development.

---

## Getting Started

Read `.catalyst/PLAYBOOK.md` for how to work in this codebase.

Check `catalyst/project-state.md` for current focus and stage.

---

## Working on Features

Check `catalyst/briefs/` for work items. Follow `.catalyst/BRIEFS.md` for workflow.

---

## Project Conventions

_Phase 2 will expand this section with project-specific patterns and conventions._

---

## Important Callouts

_Phase 2 will add warnings and guidance specific to this codebase._
```

Tell the user:
> "I've created a minimal AGENTS.md. Phase 2 will flesh this out with your project's conventions and patterns."

---

## Step 1.8: Create Setup Brief

Create the brief file: `catalyst/briefs/active-{DATE}_catalyst-enabled-setup.md`

Use today's date in YYYYMMDD format (e.g., `active-20260115_catalyst-enabled-setup.md`).

```markdown
---
title: "Catalyst-Enabled Setup"
assignee: cloud-agent
phase: 2
tags: [catalyst, setup]
---

# Brief: Catalyst-Enabled Setup (Phase 2)

> **Catalyst Brief** — Read [AGENTS.md](../../AGENTS.md) and [BRIEFS.md](../../.catalyst/BRIEFS.md) before implementing.

## Summary

Complete the Catalyst-Enabled setup for **[PROJECT_NAME]**. This is Phase 2 — create all spec documents and flesh out AGENTS.md.

**Outcome:** A fully configured Catalyst project with vision, experience, brand, and architecture specs.

---

## Discovery Context

[Copy the full Discovery Summary from Step 1.5 here]

**Stack:** [Stack details]
**Structure:** [Folder structure notes]
**Users:** [Primary users]
**Focus:** [Current focus]
**Constraints:** [Any noted constraints]

---

## Objectives & Success Criteria

### Objective 1: Create Spec Documents
Create all four spec documents in `catalyst/specs/`:

| Document | Prompt Reference | Purpose |
|----------|------------------|---------|
| `project-vision.md` | `.catalyst/prompts/create-1-vision.md` | North star, outcomes, decision principles |
| `project-experience.md` | `.catalyst/prompts/create-2-experience.md` | Users, journeys, features |
| `project-brand.md` | `.catalyst/prompts/create-3-brand.md` | Voice, tone, visual identity |
| `project-architecture.md` | `.catalyst/prompts/create-4-architecture.md` | Stack, patterns, conventions |

**Success:** All four documents exist, follow the prompt patterns, and accurately reflect this codebase.

### Objective 2: Flesh Out AGENTS.md
Expand `AGENTS.md` with:
- Project-specific conventions discovered during codebase analysis
- Important callouts and warnings for AI agents
- Key patterns that agents should follow
- Things to avoid

**Success:** An AI agent reading AGENTS.md can understand how to work in this codebase.

### Objective 3: Set Project Stage
Based on codebase analysis, determine and set the appropriate stage in `project-state.md`:

| Stage | Indicators |
|-------|------------|
| `poc` | Early development, exploring feasibility, no real users |
| `mvp` | Core features work, early users, finding product-market fit |
| `mmp` | Stable product, real users, focus on growth/polish |
| `prod` | Mature, maintenance mode, hardened |

**Success:** Stage is set with clear reasoning documented.

---

## Scope Definition

### In Scope (Must Deliver)
- [ ] Deep codebase analysis (patterns, conventions, architecture)
- [ ] `catalyst/specs/project-vision.md`
- [ ] `catalyst/specs/project-experience.md`
- [ ] `catalyst/specs/project-brand.md`
- [ ] `catalyst/specs/project-architecture.md`
- [ ] Expanded `AGENTS.md` with project conventions
- [ ] Updated `catalyst/project-state.md` with recommended stage
- [ ] This brief moved to `_review-` state

### Out of Scope (Must NOT Deliver)
- Code changes to application files
- New features or functionality
- Changes to `.catalyst/` folder (methodology is immutable)
- Package or dependency changes

---

## Requirements

### R1: Codebase Analysis
Perform deep analysis of the codebase:
- Entry points, routing, controllers
- Data layer (models, repositories, database patterns)
- Business logic (services, use cases)
- UI layer (views, components, templates)
- API layer (endpoints, authentication, middleware)
- Testing approach (structure, patterns)
- Configuration patterns

### R2: Vision Document
Follow `.catalyst/prompts/create-1-vision.md` structure:
- Project Purpose & Context (from discovery)
- North Star & Desired Outcomes
- Primary Personas & Core Needs
- Decision Principles
- Phase Success Scenarios
- Vision vs Current Phase Scope
- Non-Goals & Boundaries

### R3: Experience Document
Follow `.catalyst/prompts/create-2-experience.md` structure:
- Primary Users (from discovery + analysis)
- Key Journeys
- Feature Areas

### R4: Brand Document
Follow `.catalyst/prompts/create-3-brand.md` structure:
- Voice & Tone
- Visual Identity (if applicable)
- Key Messages
- UI Patterns

**Note:** For backend-only projects, create a minimal version focusing on Voice & Tone for error messages, logs, and API responses.

### R5: Architecture Document
Follow `.catalyst/prompts/create-4-architecture.md` structure:
- Technology Stack (with versions)
- Folder Structure (actual, not aspirational)
- Architectural Patterns
- Component/Module Patterns
- Styling Patterns (if applicable)
- Data Patterns
- AI Integration Patterns
- Key Technical Decisions
- Technical Constraints

### R6: AGENTS.md Expansion
Expand the Project Conventions and Important Callouts sections:
- Naming conventions (file, variable, class)
- Code organization patterns
- Testing conventions
- Common gotchas or warnings
- Areas that need special care
- Best practices specific to this stack

### R7: Stage Recommendation
Document reasoning for stage recommendation:
- Specific evidence from codebase
- Confidence level (High/Medium/Low)
- Any caveats

---

## Acceptance Checklist

- [ ] All four spec documents created in `catalyst/specs/`
- [ ] Specs follow the referenced prompt patterns
- [ ] Specs reflect actual codebase (not generic templates)
- [ ] AGENTS.md expanded with project-specific guidance
- [ ] project-state.md updated with recommended stage
- [ ] Stage reasoning documented
- [ ] Brief renamed to `_review-` state

---

## Handoff Notes

**For the implementing agent:**

If you have access to `.catalyst/prompts/catalyst-enabled-setup.md`, read the Phase 2 section for detailed guidance. If not, this brief is self-contained — follow the requirements and referenced prompts.

**Prioritise:**
1. Architecture document — this is most useful for ongoing AI work
2. Vision document — grounds all other decisions
3. AGENTS.md expansion — immediate value for AI agents
4. Experience and Brand — can be lighter for internal/backend projects

**Be careful not to:**
- Modify any files in `.catalyst/` — this is upstream methodology
- Make changes to application code
- Over-engineer the specs — match the project's current maturity

**What "good" looks like:**
- An AI agent can read the specs and AGENTS.md and understand the project
- The documents reflect reality, not aspirations
- A new team member could onboard using these docs

---

## Completion Notes

_To be filled by implementing agent._

---
```

---

## Step 1.9: Phase 1 Complete

Show the user:

```
## Phase 1 Complete ✓

I've set up the Catalyst folder structure:

✓ Created `catalyst/` folder with all subfolders
✓ Created `project-state.md` with discovery info
✓ Created `CHANGELOG.md` and `FEEDBACK.md`
✓ [Created/Updated] `AGENTS.md` with Catalyst callout
✓ Created setup brief: `catalyst/briefs/active-[DATE]_catalyst-enabled-setup.md`

## Next: Phase 2 (Deep-Dive)

You can run Phase 2 now or hand off to another agent.

**Option A: Continue here**
> "Continue with Phase 2" or "Run the setup brief"

**Option B: Hand off to cloud agent**
> "Pick up the brief at `catalyst/briefs/active-[DATE]_catalyst-enabled-setup.md`"

Phase 2 will:
- Analyze the full codebase
- Create all spec documents (vision, experience, brand, architecture)
- Flesh out AGENTS.md with project conventions
- Set the recommended project stage
```

**Phase 1 ends here.**

---

# PHASE 2: Deep-Dive Setup

**Purpose:** Deep codebase analysis, create all specs, expand AGENTS.md, set stage.
**Agent:** Any agent (cloud or local).
**Scope:** Files within `/catalyst/` folder + `AGENTS.md` at project root.

> **For agents picking up this work:** The setup brief at `catalyst/briefs/active-*_catalyst-enabled-setup.md` contains the Discovery Context from Phase 1. Read it first, then follow the steps below.

> ### Scope Boundaries
>
> **You MAY edit:**
> - Everything in `catalyst/` folder
> - `AGENTS.md` at project root
>
> **You MAY NOT edit:**
> - Application code files
> - `.catalyst/` folder (methodology is immutable)
> - Config files outside catalyst/
> - Package files

---

## Step 2.1: Read the Brief

Find and read the setup brief:
- Look for `active-*_catalyst-enabled-setup.md` in `catalyst/briefs/`
- Read the Discovery Context section
- Understand the project from Phase 1 findings

If the brief is `_review-` or in `complete/`, Phase 2 is already done.

---

## Step 2.2: Deep Codebase Analysis

Go beyond the quick scan. Analyze:

### Architecture & Patterns

| Analyze | What to Look For |
|---------|------------------|
| **Entry points** | Main files, routing, controllers |
| **Data layer** | Models, repositories, database patterns |
| **Business logic** | Services, use cases, domain objects |
| **UI layer** | Views, components, templates |
| **API layer** | Endpoints, authentication, middleware |
| **Testing** | Test structure, coverage patterns |
| **Config** | Environment handling, feature flags |

### Conventions

| Analyze | Examples |
|---------|----------|
| **Naming** | camelCase vs snake_case, file naming |
| **Structure** | How features are organized |
| **Patterns** | Repository pattern, service classes, etc. |
| **Style** | Linting config, formatting |

Document findings for specs.

---

## Step 2.3: Create Spec Documents

Create all four specs in `catalyst/specs/`. Follow the referenced prompts.

### project-vision.md

Follow `.catalyst/prompts/create-1-vision.md`:

```markdown
# [PROJECT_NAME] — Project Vision

> **Catalyst Project** — This spec was generated during setup. Review and refine as needed.

## 1. Project Purpose & Context

[2-3 paragraphs from discovery: what the project is, why it exists, the problem it solves]

## 2. North Star & Desired Outcomes

**North Star:** [One sentence capturing the ultimate goal]

**Desired Outcomes:**
- [Outcome 1]
- [Outcome 2]
- [Outcome 3]

## 3. Primary Personas & Core Needs

### [Persona 1]

**Who:** [Description]
**Core needs:** [What they need from this project]
**Key tension:** [Primary challenge they face]

### [Persona 2 — if applicable]

[Same structure]

## 4. Decision Principles

When trade-offs arise:
- [Principle 1 — e.g., "Simplicity over flexibility"]
- [Principle 2 — e.g., "User clarity over feature completeness"]
- [Principle 3]

## 5. Phase Success Scenarios

### Scenario 1: [Name]

**Persona:** [Who]
**Trigger:** [What starts this]
**Steps:** [High-level flow]
**Success:** [What it looks like when done]

## 6. Vision vs Current Phase Scope

**Broader vision:** [Where this could go]

**Current phase scope:** [What this work is proving/delivering]

**Intentionally deferred:** [What we're not doing yet and why]

## 7. Non-Goals & Boundaries

This project is NOT trying to:
- [Non-goal 1]
- [Non-goal 2]

Constraints:
- [Constraint 1]
- [Constraint 2]
```

### project-experience.md

Follow `.catalyst/prompts/create-2-experience.md`:

```markdown
# [PROJECT_NAME] — Project Experience

> **Catalyst Project** — This spec was generated during setup. Review and refine as needed.

## 1. Primary Users

### [User Type A]

**Who:** [Description]
**Goals:** [What they want to achieve]
**Key tasks:** [What they do in the system]

### [User Type B — if applicable]

[Same structure]

## 2. Key Journeys

### Journey 1: [Name]

**User:** [Persona]
**Goal:** [What they want]
**Entry point:** [How they start]
**Steps:**
1. [Step]
2. [Step]
3. [Step]
**Success state:** [What success looks like]

### Journey 2: [Name]

[Same structure]

## 3. Feature Areas

| Area | Purpose | Key Features |
|------|---------|--------------|
| [Area 1] | [What it's for] | [Features] |
| [Area 2] | [What it's for] | [Features] |
```

### project-brand.md

Follow `.catalyst/prompts/create-3-brand.md`:

```markdown
# [PROJECT_NAME] — Project Brand

> **Catalyst Project** — This spec was generated during setup. Review and refine as needed.

## 1. Voice & Tone

**Primary voice:** [e.g., Professional but approachable, Technical and precise]

**Tone varies by context:**
- Errors/warnings: [e.g., Clear and helpful, never blame the user]
- Success states: [e.g., Brief and confirmatory]
- Documentation: [e.g., Instructional, step-by-step]

## 2. Visual Identity

**Colors:**
- Primary: [Color + hex if known]
- Secondary: [Color + hex if known]

**Typography:**
- Headings: [Font family if known]
- Body: [Font family if known]

**Logo/assets:** [Location or "N/A"]

## 3. Key Messages

**Value proposition:** [One sentence]

**Core benefits:**
- [Benefit 1]
- [Benefit 2]

## 4. UI Patterns

**Component approach:** [e.g., Custom, Tailwind, Bootstrap, Material]

**Key patterns:**
- [Pattern 1]
- [Pattern 2]
```

**For backend-only projects:** Create minimal version with Voice & Tone only.

### project-architecture.md

Follow `.catalyst/prompts/create-4-architecture.md`:

```markdown
# [PROJECT_NAME] — Project Architecture

> **Catalyst Project** — This spec was generated during setup. Review and refine as needed.

## 1. Overview

This document defines the technical architecture for [PROJECT_NAME].

**Related docs:**
- Vision: `catalyst/specs/project-vision.md`
- Experience: `catalyst/specs/project-experience.md`

## 2. Technology Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| **Language** | [e.g., PHP 8.2] | |
| **Framework** | [e.g., Laravel 11] | |
| **Database** | [e.g., MySQL 8] | |
| **Frontend** | [e.g., Vue 3, Blade] | |
| **Styling** | [e.g., Tailwind CSS] | |
| **Testing** | [e.g., PHPUnit, Pest] | |

## 3. Folder Structure

Document the actual folder structure. Use a text tree format:

    [PROJECT_ROOT]/
    ├── [folder]/ — [purpose]
    ├── [folder]/ — [purpose]
    └── [key-file] — [purpose]

**Key conventions:**
- [Convention 1]
- [Convention 2]

## 4. Architectural Patterns

### [Pattern 1 — e.g., MVC, Repository, Service Layer]

[How it's used in this project]

### [Pattern 2]

[Description]

## 5. Data Patterns

**Database:** [How data is structured]
**API:** [REST/GraphQL patterns]
**Caching:** [If applicable]

## 6. Key Conventions

- **Naming:** [File and variable conventions]
- **Code style:** [Linting/formatting approach]
- **Testing:** [Test structure and patterns]

## 7. Important Callouts for AI Agents

### [Area 1 — e.g., Legacy Code]

[Warning or guidance]

### [Area 2 — e.g., Performance-Sensitive Areas]

[Warning or guidance]

## 8. Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| [Decision 1] | [What] | [Why] |
| [Decision 2] | [What] | [Why] |
```

---

## Step 2.4: Expand AGENTS.md

Update the `AGENTS.md` at project root. Expand the placeholder sections:

### Project Conventions Section

Add actual conventions discovered during analysis:

```markdown
## Project Conventions

### File Naming
- [Convention — e.g., "Controllers use PascalCase: UserController.php"]
- [Convention]

### Code Organization
- [Pattern — e.g., "Business logic lives in app/Services/"]
- [Pattern]

### Database
- [Convention — e.g., "Migrations use descriptive names"]
- [Convention]

### Testing
- [Pattern — e.g., "Feature tests in tests/Feature/, unit in tests/Unit/"]
- [Pattern]
```

### Important Callouts Section

Add warnings and guidance:

```markdown
## Important Callouts

### [Area 1 — e.g., Authentication]

[Warning or critical guidance]

### [Area 2 — e.g., API Versioning]

[Warning or critical guidance]

### Common Gotchas

- [Gotcha 1]
- [Gotcha 2]
```

---

## Step 2.5: Set Project Stage

Based on analysis, determine the appropriate stage.

### Stage Indicators

| Stage | Indicators |
|-------|------------|
| `poc` | Early development, exploring feasibility, no real users |
| `mvp` | Core features work, early users, still finding fit |
| `mmp` | Stable product, real users, focus on growth/polish |
| `prod` | Mature, maintenance mode, hardened |

### Update project-state.md

Update the frontmatter. Bump `project_version` from `0.0.0` to `0.1.0` (per STATE.md: "0.1.0 = bootstrapped baseline"):

```yaml
stage: [RECOMMENDED_STAGE]
project_version: 0.1.0
```

Update the body:

```markdown
## Current Focus

**Stage:** [Stage name] — [Brief description]

**Focus:** [From discovery]
```

---

## Step 2.6: Complete the Brief

Add completion notes to the brief:

```markdown
---

## Completion Notes

**Completed by:** [Agent identifier]
**Date:** [YYYY-MM-DD]

### What was delivered

- Created `project-vision.md` — [1-line summary]
- Created `project-experience.md` — [1-line summary]
- Created `project-brand.md` — [1-line summary]
- Created `project-architecture.md` — [1-line summary]
- Expanded `AGENTS.md` with project conventions
- Set stage to `[STAGE]`

### Stage Reasoning

**Recommended:** `[STAGE]`

**Evidence:**
- [Specific observation 1]
- [Specific observation 2]
- [Specific observation 3]

**Confidence:** [High/Medium/Low]

### What needs human review

- [ ] Vision accurately captures project intent
- [ ] Architecture reflects actual patterns
- [ ] Stage recommendation is appropriate
- [ ] AGENTS.md guidance is accurate

### Known limitations

- [Any shortcuts or areas that need refinement]
```

### Rename the Brief

Rename from `active-*` to `_review-*`:

```
catalyst/briefs/active-{DATE}_catalyst-enabled-setup.md
→ catalyst/briefs/_review-{DATE}_catalyst-enabled-setup.md
```

---

## Step 2.7: Phase 2 Complete

Phase 2 is done. The brief is now in `_review-` state for human review.

**Human review should verify:**
1. Specs accurately reflect the project
2. AGENTS.md guidance is correct
3. Stage recommendation makes sense

**After human review:**
- Move brief to `catalyst/briefs/complete/` with `complete-` prefix
- Project is fully Catalyst-enabled

---

# Edge Cases

## User Wants to Start Over

If user asks to reset:
1. Delete all files in `catalyst/`
2. Delete `AGENTS.md` if it only contains Catalyst content
3. Run Phase 1 fresh

## Phase 2 Interrupted

If Phase 2 didn't complete:
1. Check what specs exist
2. Resume from where it left off
3. Or delete partial specs and restart Phase 2

## Minimal Codebase

If the project is nearly empty:
- Create specs with `[TBD]` sections
- Note that specs will evolve as project develops
- Recommend `poc` stage

## Backend-Only Project

If no UI:
- Skip Visual Identity in brand doc
- Focus architecture on API patterns
- AGENTS.md focuses on service conventions

---

# What NOT to Do

- **Don't modify `.catalyst/` files** — Methodology is immutable
- **Don't modify application code** — This is methodology setup only
- **Don't over-document** — Match the project's maturity level
- **Don't invent patterns** — Document what actually exists
- **Don't set stage without evidence** — Document your reasoning
