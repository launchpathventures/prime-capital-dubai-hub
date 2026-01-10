# Catalyst-Enabled Setup

**Build the right thing, fast.**

Add Catalyst methodology to any existing codebase in a structured 3-phase process.

> ### About This Prompt
>
> **Use case:** Adding Catalyst to an existing project (Laravel, Vue, Python, WordPress, Django, Rails, etc.)
>
> **Not for:** New projects starting from scratch — use `/setup` instead.
>
> **What happens:** You'll have briefs, specs, and AI-friendly docs without changing your tech stack.

---

## Quick Reference (for AI Agents)

| Phase | Agent | Duration | Purpose |
|-------|-------|----------|---------|
| **Phase 1** | Local | ~10 mins | Init, discovery, create cloud brief |
| **Phase 2** | Cloud | Async | Heavy lifting — specs, prompts, cleanup |
| **Phase 3** | Local + Human | ~10 mins | Review, confirm stage, complete |

### Key Actions by Phase

| Phase 1 (Local) | Phase 2 (Cloud) | Phase 3 (Local) |
|-----------------|-----------------|-----------------|
| Run preflight checks | Verify state & read brief | Find review brief |
| Explain 3-phase process | Deep codebase analysis | Read completion summary |
| Clean up Dev Kit examples | Create all specs | Walk through changes |
| Reset stage to `init` | Update CATALYST.md | Confirm recommended stage |
| Quick codebase scan | Update AGENTS.md | Apply stage to project-state |
| Ask discovery questions | Adapt prompts | Make any quick fixes |
| Confirm summary | Delete irrelevant files | Move brief to complete/ |
| Create cloud brief | Infer stage + reasoning | Show success message |
| Hand off to cloud | Write completion summary | |

### Resuming Mid-Setup

If the user starts a new chat:
- **"Continue setup"** or **"Run Phase 1"** → Start/resume Phase 1
- **"Review cloud agent"** or **"Run Phase 3"** → Skip to Phase 3 (look for `_review-` brief)
- **"Check status"** → Check project-state.md and brief folder to determine current phase

---

## Reference Documents

Read these to understand the project context:

```
@file catalyst/CATALYST.md        — Methodology overview
@file catalyst/BRIEFS.md          — Brief workflow
@file catalyst/project-state.md   — Current project state
@file catalyst/STATE.md           — State field definitions
@file AGENTS.md                   — Existing agent instructions (if present)
```

---

## Preflight

Before starting any phase, check for these indicators:

### 1. Check for Enabled-Project Callout

Open `catalyst/CATALYST.md` and look for this callout near the top:

```
> ## ⚠️ Catalyst-Enabled Project
```

- **Callout EXISTS** → Setup has been run before (Phase 2+ complete)
- **Callout MISSING** → Setup has never completed (fresh copy or interrupted)

This is the **primary indicator** of whether setup has been done.

### 2. Check for Setup Brief

Look in `catalyst/briefs/` for a file named `*_catalyst-enabled-setup.md`:

| Brief State | Meaning |
|-------------|---------|
| `approved-*_catalyst-enabled-setup.md` | Phase 2 pending (hand off to cloud) |
| `active-*_catalyst-enabled-setup.md` | Phase 2 in progress |
| `_review-*_catalyst-enabled-setup.md` | Phase 3 pending (review time) |
| In `complete/` folder | Previous setup finished |
| None found | Fresh copy or never started |

### 3. Check for AGENTS.md

Look for `AGENTS.md` at the **project root** (NOT inside catalyst/):

- **EXISTS** → Will add a small Catalyst header, preserve existing content
- **MISSING** → Will create a full AGENTS.md in Phase 2

### 4. Check for Slash Command Folders

Look for these folders at the **project root**:

- `/.claude/` — Claude slash commands
- `/.github/copilot-instructions.md` — GitHub Copilot instructions

If missing, the user will need to copy them from the Catalyst Dev Kit to enable `/code`, `/brief`, etc.

### 5. Check Example Content

Look for Dev Kit example content that should be deleted:

- Briefs in `catalyst/briefs/complete/` or `catalyst/briefs/archive/`
- Stage set to something other than `init` but no Enabled-Project callout

If example content exists but no callout exists → **Fresh Dev Kit copy, not a previous setup.**

---

## Detection Logic

Use this decision tree:

### Does CATALYST.md have the "⚠️ Catalyst-Enabled Project" callout?

**NO (callout missing):**
- This is a **fresh Dev Kit copy** that needs setup
- Ignore the current stage (it's the Dev Kit's stage, not this project's)
- Ignore briefs in complete/archive (they're Dev Kit examples)
- **Action:** Start Phase 1

**YES (callout exists):**
- Setup has been run before
- Check the setup brief state to determine where we are:

| Setup Brief State | Action |
|-------------------|--------|
| `approved-*` exists | Hand off to cloud (Phase 2) |
| `active-*` exists | Phase 2 in progress |
| `_review-*` exists | Run Phase 3 |
| In `complete/` or none | Setup already done — ask user what they want |

### Quick Reference Table

| Callout | Setup Brief | Interpretation | Action |
|---------|-------------|----------------|--------|
| ❌ Missing | Any/None | Fresh Dev Kit copy | Start Phase 1 |
| ✅ Exists | `approved-*` | Phase 1 done | Hand off to Phase 2 |
| ✅ Exists | `active-*` | Phase 2 in progress | Resume or wait |
| ✅ Exists | `_review-*` | Phase 2 done | Run Phase 3 |
| ✅ Exists | `complete-*` or none | Fully configured | Ask user preference |

### If Already Complete

If the callout exists and setup is done, ask:
> "This project already has Catalyst configured. Would you like to:
> 1. Review the current setup
> 2. Reset and start fresh
> 3. Something else?"

---

# PHASE 1: Local Agent Init

**Purpose:** Quick discovery, create cloud brief, prepare for heavy lifting.
**Duration:** ~10 minutes with user interaction.

---

## Step 1.1: Run Preflight

Before doing anything, run the **Preflight** and **Detection Logic** checks above.

- If already complete → Ask user what they want to do
- If Phase 2 pending → Tell user to hand off to cloud agent
- If Phase 3 pending → Skip to Phase 3
- Otherwise → Continue with Step 1.2

---

## Step 1.2: Explain the Process

Explain the 3-phase process to the user:

```
## Catalyst-Enabled Setup

I'll help you add Catalyst methodology to this project. This is a 3-phase process:

### Phase 1: Init (now, ~10 mins)
I'll scan the codebase, ask a few questions, and create a brief for the cloud agent.

### Phase 2: Cloud Agent (async)
A cloud agent will do the heavy lifting — analyzing the full project, creating specs, and adapting all Catalyst docs to fit this codebase.

### Phase 3: Review (~10 mins)
You'll review the changes with me, confirm the project stage, and complete the setup.

Ready to start Phase 1?
```

**Wait for user confirmation before proceeding.**

---

## Step 1.3: Clean Up Dev Kit Examples

The `/catalyst/` folder was copied from the Dev Kit and contains example content. Delete it all:

### Delete These (Dev Kit Examples)

| Path | What It Is |
|------|------------|
| `catalyst/briefs/*.md` | Example briefs (if any in root) |
| `catalyst/briefs/archive/*` | Archived example briefs |
| `catalyst/briefs/complete/*` | Completed example briefs |
| `catalyst/specs/*` | Dev Kit specs (will recreate for this project) |

### Keep These (Empty Folders)

```
catalyst/briefs/           (folder)
catalyst/briefs/archive/   (empty folder)
catalyst/briefs/complete/  (empty folder)
catalyst/specs/            (empty folder)
```

### Also Reset

Update `catalyst/project-state.md` to clear Dev Kit values:
- Set `stage: init`
- Clear `focus`, `goals`, `blockers` (will populate with this project's info)

Tell the user:
> "I've cleared the Dev Kit examples (briefs, specs) and reset the project state to `init`. Your project will start with a clean slate."

---

## Step 1.4: Quick Codebase Analysis

Scan the project to understand the basics. Look for:

| What | Where to Look |
|------|---------------|
| **Stack** | `composer.json`, `package.json`, `requirements.txt`, `Gemfile`, etc. |
| **Framework** | Folder structure, config files, entry points |
| **Database** | Config files, migrations folder, `.env` |
| **Structure** | Top-level folders, README, existing docs |
| **Existing AGENTS.md** | Project root |

Summarize findings internally (don't show all details to user yet).

---

## Step 1.5: Discovery Questions

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

## Step 1.6: Confirm Discovery Summary

After user responds, summarize and confirm:

```
## Discovery Summary

**Project:** [Name] — [One-line purpose]
**Stack:** [Framework/Language], [Database], [Key deps]
**Users:** [Primary personas]
**State:** [Early/Active/Mature/Legacy]
**Focus:** [Current priorities]
**Constraints:** [Pain points, or "None noted"]

**Codebase Notes:**
- Structure: [Brief folder description]
- Patterns: [MVC/Services/etc. if identified]
- Existing docs: [What exists — README, AGENTS.md, etc.]

Does this look accurate? Any corrections before I create the cloud brief?
```

**Wait for user confirmation before proceeding.**

---

## Step 1.7: Create Cloud Brief

Create the brief file: `catalyst/briefs/approved-{DATE}_catalyst-enabled-setup.md`

Use today's date in YYYYMMDD format (e.g., `approved-20260109_catalyst-enabled-setup.md`).

### Brief Template

```markdown
---
title: "Catalyst-Enabled Setup"
assignee: cloud-agent
phase: 2
tags: [catalyst, setup, enabled]
---

# Brief: Catalyst-Enabled Setup (Phase 2)

> **Catalyst Brief** — Read [BRIEFS.md](../BRIEFS.md) before implementing.

## Summary

Complete the Catalyst-Enabled setup for **[PROJECT_NAME]**. This is Phase 2 of a 3-phase process.

**What to do:** Follow the Phase 2 instructions in `catalyst/prompts/catalyst-enabled-setup.md`.

---

## Discovery Context

[PASTE_FULL_DISCOVERY_SUMMARY_HERE]

---

## Phase 2 Checklist

Follow the detailed instructions in the setup prompt. Key tasks:

- [ ] Deep codebase analysis (patterns, conventions, architecture)
- [ ] Create `project-vision.md` from discovery context
- [ ] Create `project-experience.md` (users, journeys)
- [ ] Create `project-architecture.md` (actual patterns found)
- [ ] Update `CATALYST.md` with Enabled-Project callout
- [ ] Update `AGENTS.md` (add Catalyst section only)
- [ ] Adapt prompts in `catalyst/prompts/` for this stack
- [ ] Delete irrelevant Catalyst files (surfaces, React patterns, etc.)
- [ ] Infer recommended stage with reasoning
- [ ] Write completion summary for Phase 3 review

---

## Completion Requirements

When done:
1. Add Completion Summary section to this brief (template in setup prompt)
2. Rename this brief from `approved-` or `active-` to `_review-`
3. Do NOT change `stage` in project-state.md (Phase 3 will do that)
```

---

## Step 1.8: Phase 1 Complete

Check if slash command folders exist (`.claude/`, `.github/`). If missing, note this for the user.

Show the user:

```
## Phase 1 Complete ✅

I've completed the local setup:

✓ Project set to `init` stage
✓ Example content cleared
✓ Discovery captured
✓ Cloud brief created: `catalyst/briefs/approved-[DATE]_catalyst-enabled-setup.md`

## Next: Phase 2 (Cloud Agent)

Hand this off to a cloud agent (GitHub Copilot Workspace, Cursor Background Agent, etc.):

> "Pick up the brief at `catalyst/briefs/approved-[DATE]_catalyst-enabled-setup.md` and follow the Phase 2 instructions in `catalyst/prompts/catalyst-enabled-setup.md`"

## After Phase 2

Once the cloud agent finishes, make sure you're on the branch with its changes (checkout/pull if needed).

Then come back here and say:
> "Review the Catalyst-Enabled setup" or "Run Phase 3"

I'll walk you through the changes and help you complete the setup.
```

If slash command folders are missing, also show:

```
## ⚠️ Slash Commands Not Found

To enable `/code`, `/brief`, and other commands, copy these folders from the Catalyst Dev Kit:

- `/.claude/` → Slash commands for Claude
- `/.github/` → Copilot instructions

You can do this now or after Phase 2.
```

**Phase 1 ends here.**

---

# PHASE 2: Cloud Agent Heavy Lifting

**Purpose:** Deep analysis, create all specs, adapt all docs, prepare for review.
**Agent:** Cloud agent (async, can take longer).
**Scope:** Files within `/catalyst/` folder + `AGENTS.md` at project root.

> ### ⚠️ Scope Boundaries (Cloud Agent)
>
> **You MAY edit:**
> - Everything in `catalyst/` folder
> - `AGENTS.md` at project root (add section, don't rewrite)
>
> **You MAY NOT edit:**
> - Application code files
> - Config files outside catalyst/
> - Package files (composer.json, package.json, etc.)
> - Any other project files
>
> This is a **methodology setup**, not a code migration.

---

## Step 2.1: Read Context & Verify State

Before starting, verify you're in the right state:

1. Check `catalyst/project-state.md` — should be `stage: init`
2. Find the brief at `catalyst/briefs/approved-*_catalyst-enabled-setup.md` or `active-*`
3. Read the discovery summary in the brief
4. Read any existing `AGENTS.md` at project root
5. Read any existing `README.md`

Rename the brief to `active-*` if it's still `approved-*`.

If the brief is already `_review-*`, Phase 2 is complete — do not proceed.

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
| **Style** | PSR-12, ESLint config, formatting |

Document findings for specs.

---

## Step 2.3: Create Project Specs

Create these files in `catalyst/specs/`:

### project-vision.md

```markdown
# [PROJECT_NAME] — Project Vision

> **Catalyst-Enabled Project** — This spec was generated during setup. Review and refine as needed.

## 1. Purpose & Context

[2-3 paragraphs from discovery: what the project is, why it exists, the problem it solves]

## 2. North Star

[One sentence capturing the ultimate goal]

## 3. Desired Outcomes

- [Outcome 1 from priorities]
- [Outcome 2]
- [Outcome 3]

## 4. Decision Principles

Based on constraints and context:

- [Principle 1]
- [Principle 2]
- [Principle 3]

## 5. Current Focus

**State:** [From discovery]
**Focus:** [Current priorities]
**Near-term goal:** [What success looks like]
```

### project-experience.md

```markdown
# [PROJECT_NAME] — Project Experience

> **Catalyst-Enabled Project** — This spec was generated during setup. Review and refine as needed.

## 1. Primary Users

### [User Type A]

**Who:** [Description]
**Needs:** [Core needs]
**Tension:** [Primary challenge]

### [User Type B — if applicable]

[Same structure]

## 2. Key Journeys

### [Journey 1]

**User:** [Persona]
**Goal:** [What they want]
**Steps:** [High-level flow]

### [Journey 2]

[Same structure]

## 3. Feature Areas

[List main feature areas of the product]
```

### project-brand.md

```markdown
# [PROJECT_NAME] — Project Brand

> **Catalyst-Enabled Project** — This spec was generated during setup. Review and refine as needed.

## 1. Voice & Tone

**Primary voice:** [e.g., Professional but approachable, Technical and precise, Friendly and casual]

**Tone varies by context:**
- Errors/warnings: [e.g., Clear and helpful, never blame the user]
- Success states: [e.g., Brief and celebratory]
- Documentation: [e.g., Instructional, step-by-step]

## 2. Visual Identity

**Colors:**
- Primary: [Color + hex if known]
- Secondary: [Color + hex if known]
- Accent: [Color + hex if known]

**Typography:**
- Headings: [Font family if known]
- Body: [Font family if known]

**Logo/Brand assets:** [Location of assets or "See /public/assets"]

## 3. Key Messages

**Value proposition:** [One sentence — what makes this product valuable]

**Tagline:** [If exists]

**Core benefits:**
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

## 4. UI Patterns

**Component library:** [e.g., Custom, Tailwind, Bootstrap, Material, etc.]

**Key patterns:**
- [Pattern 1 — e.g., "Cards for content grouping"]
- [Pattern 2 — e.g., "Modals for confirmations"]
- [Pattern 3 — e.g., "Toast notifications for feedback"]
```

**For backend-only projects or internal tools:** Create a minimal version with just Voice & Tone (for error messages, logs, API responses) and skip the visual sections.

### project-architecture.md

```markdown
# [PROJECT_NAME] — Project Architecture

> **Catalyst-Enabled Project** — This spec was generated during setup. Review and refine as needed.

## 1. Stack Overview

| Layer | Technology |
|-------|------------|
| **Language** | [From analysis] |
| **Framework** | [From analysis] |
| **Database** | [From analysis] |
| **Key Dependencies** | [Notable ones] |

## 2. Folder Structure

[Document ACTUAL structure from analysis]

```
[PROJECT_ROOT]/
├── [folder]/ — [purpose]
├── [folder]/ — [purpose]
└── [key-file] — [purpose]
```

## 3. Architectural Patterns

### [Pattern 1 — e.g., MVC, Repository, Service Layer]

[How it's used in this project]

### [Pattern 2]

[Description]

## 4. Key Conventions

- [Convention 1 — e.g., file naming]
- [Convention 2 — e.g., code style]
- [Convention 3 — e.g., testing approach]

## 5. Important Callouts for AI Agents

### [Area 1 — e.g., Legacy Code Sections]

[Warning or guidance]

### [Area 2 — e.g., Performance-Sensitive Areas]

[Warning or guidance]
```

---

## Step 2.4: Update CATALYST.md

Add this callout block at the **very top** of `catalyst/CATALYST.md`, before any existing content:

```markdown
---

> ## ⚠️ Catalyst-Enabled Project
>
> **This is NOT the Catalyst Dev Kit.** This project uses Catalyst methodology on an existing codebase.
>
> **Stack:** [STACK_SUMMARY]
> **Configured:** [DATE]
>
> ### For AI Agents
>
> When reading Catalyst documentation:
> - **Use:** Briefs, specs, workflow, prompts, project-state
> - **Ignore:** Next.js, React, surfaces, components, design tokens, CSS patterns
> - **Adapt:** Make methodology work with this codebase's patterns
>
> ### Quick Context
>
> [2-3 sentence summary from discovery]

---

```

---

## Step 2.5: Create or Update AGENTS.md

The project needs an `AGENTS.md` at the root to guide AI agents. Handle these two scenarios:

---

### If AGENTS.md Already Exists

**Don't rewrite it.** Just add a small Catalyst header near the top, after any existing intro:

```markdown
---

## Catalyst Methodology

This project uses **Catalyst** for AI-assisted delivery.

**Read first:** `catalyst/CATALYST.md` → then check `catalyst/project-state.md` for current focus.

**Working on features:** Check `catalyst/briefs/` for work items and follow `catalyst/BRIEFS.md`.

---
```

That's it. Keep the existing content intact — it contains project-specific guidance that matters.

---

### If No AGENTS.md Exists

Create one from scratch. This is your chance to give AI agents proper context.

**Base template:**

```markdown
# AI Agent Instructions

This project uses **Catalyst methodology** for AI-assisted delivery.

---

## Getting Started

Before making changes, read these docs:

| Priority | Document | Purpose |
|----------|----------|---------|
| 1 | `catalyst/CATALYST.md` | Methodology + project context |
| 2 | `catalyst/project-state.md` | Current stage, focus, blockers |
| 3 | `catalyst/specs/project-vision.md` | What this project is about |
| 4 | `catalyst/specs/project-architecture.md` | Technical patterns |
| 5 | `catalyst/BRIEFS.md` | How to work on features |

---

## Working on Features

1. Check `catalyst/briefs/` for current work items
2. Look for `approved-` (ready) or `active-` (in progress) briefs
3. Follow the workflow in `catalyst/BRIEFS.md`
4. Update brief state when starting/completing work

---

## Key Conventions

[FILL IN: Add 3-5 key conventions from your codebase analysis]

---

## Important Callouts

[FILL IN: Add warnings, gotchas, or critical areas AI should know about]
```

**Important:** Don't just copy this template verbatim. Blend it with:

- **Best practices for this stack** (Laravel conventions, Python patterns, etc.)
- **Actual patterns you discovered** during codebase analysis
- **Warnings from `project-architecture.md`** that AI agents need to see upfront
- **Any existing README guidance** that should be reinforced

The goal is a useful, project-specific `AGENTS.md` — not a generic placeholder.

---

## Step 2.6: Adapt Prompts

Review every file in `catalyst/prompts/`. For each prompt:

### Check for Stack-Specific References

Look for:
- Next.js, React, surfaces, components
- CSS patterns, design tokens, Tailwind specifics
- shadcn/ui, specific file paths
- pnpm commands (may need npm/yarn/composer equivalent)

### Adaptation Strategy

| Reference Type | Action |
|----------------|--------|
| **Methodology** (briefs, stages, workflow) | Keep as-is |
| **Equivalent exists** in this stack | Replace with this project's pattern |
| **No equivalent** | Make generic or add note |
| **Doesn't apply** | Add note at top of prompt |

### Example Adaptations

**Before (Dev Kit):**
```markdown
Use `Stack`, `Row`, `Grid` for layout
Check `components/ui/` before creating
```

**After (Adapted for Laravel/Vue):**
```markdown
Follow existing component patterns in `resources/js/components/`
Check existing components before creating new ones
```

**After (Made generic):**
```markdown
Follow existing component patterns in the codebase
Check for existing components before creating new ones
```

### If a Prompt Doesn't Apply

Add a note at the top:

```markdown
> **Catalyst-Enabled Note:** This prompt was designed for the Dev Kit. For this project:
> - [Specific adaptation guidance]
> - Or skip if not applicable to this stack
```

---

## Step 2.7: Delete Irrelevant Catalyst Files

Remove files that only apply to the Catalyst Dev Kit (Next.js/React):

### Definitely Delete

| File/Folder | Reason |
|-------------|--------|
| `catalyst/SURFACES.md` | Next.js route groups concept |
| `catalyst/PATTERNS.md` | CSS/layout patterns for React |

### Review and Possibly Delete

| File | Keep If | Delete If |
|------|---------|-----------|
| Commands referencing React | N/A | Always delete |
| Design-related prompts | Project has frontend | Backend-only project |

### Never Delete

| File | Reason |
|------|--------|
| `catalyst/CATALYST.md` | Core methodology |
| `catalyst/BRIEFS.md` | Brief workflow |
| `catalyst/GLOSSARY.md` | Terminology |
| `catalyst/STATE.md` | State management |
| `catalyst/project-state.md` | Project tracking |
| `catalyst/specs/*` | Just created these |
| `catalyst/prompts/catalyst-enabled-setup.md` | This file |

---

## Step 2.8: Infer Recommended Stage

Based on your analysis, determine what stage this project is likely at:

### Stage Indicators

| Stage | Indicators |
|-------|------------|
| **poc** | Early development, exploring feasibility, no real users |
| **mvp** | Core features work, early users, still finding product-market fit |
| **mmp** | Stable product, real users, focus on growth/polish |
| **prod** | Mature, maintenance mode, hardened |

### Document Your Reasoning

Note specific evidence:
- "Has 50+ database migrations → established project"
- "CI/CD pipeline exists → at least MVP maturity"
- "No tests → likely still in POC phase"
- "Production environment configs → deployed product"

---

## Step 2.9: Write Completion Summary

Add this section to the brief (before renaming):

```markdown
---

## Completion Summary (for Phase 3 Review)

**Completed by:** cloud-agent
**Date:** [DATE]

### Files Created

| File | Status | Notes |
|------|--------|-------|
| `catalyst/specs/project-vision.md` | ✅ Created | [1-line note] |
| `catalyst/specs/project-experience.md` | ✅ Created | [1-line note] |
| `catalyst/specs/project-brand.md` | ✅ Created | [1-line note] |
| `catalyst/specs/project-architecture.md` | ✅ Created | [1-line note] |
| `catalyst/CATALYST.md` | ✅ Updated | Added Enabled-Project callout |
| `AGENTS.md` | ✅ Created | [Full AGENTS.md with project conventions] |

Or if AGENTS.md already existed:

| `AGENTS.md` | ✅ Updated | Added Catalyst header (preserved existing content) |

### Files Adapted

| File | Changes |
|------|---------|
| `catalyst/prompts/[file].md` | [What was changed] |
| [More files...] | |

### Files Deleted

| File | Reason |
|------|--------|
| `catalyst/SURFACES.md` | Not applicable (Next.js concept) |
| `catalyst/PATTERNS.md` | Not applicable (React/CSS patterns) |
| [More if any...] | |

### Recommended Stage

**Recommended:** `[poc/mvp/mmp/prod]`

**Evidence:**
- [Specific observation 1]
- [Specific observation 2]
- [Specific observation 3]

**Confidence:** [High/Medium/Low] — [Brief explanation if not High]

### Items for Human Review

Please verify during Phase 3:

- [ ] `project-vision.md` accurately captures project intent
- [ ] `project-architecture.md` reflects actual patterns
- [ ] AGENTS.md changes don't conflict with existing guidance
- [ ] Recommended stage is appropriate
- [ ] No important context was missed

### Open Questions

[Any ambiguities or areas needing human clarification — or "None" if clear]
```

---

## Step 2.10: Complete Phase 2

1. Rename the brief: `active-*` → `_review-*`
2. **Do NOT** change `stage` in project-state.md (Phase 3 will do that)

**Phase 2 ends here.**

---

# PHASE 3: Local Agent + Human Review

**Purpose:** Review changes, confirm stage, finalize setup.
**Duration:** ~10 minutes with user interaction.

---

## Step 3.1: Find the Review Brief

Look for `_review-*_catalyst-enabled-setup.md` in `catalyst/briefs/`.

If not found:
- Check for `active-*` (Phase 2 still in progress)
- Check for `approved-*` (Phase 2 hasn't started)
- Tell user current status and what to do next

---

## Step 3.2: Read Completion Summary

Open the `_review-` brief and read the Completion Summary section.

Present to user:

```
## Phase 3: Review Cloud Agent Changes

The cloud agent has completed Phase 2. Here's what was done:

### Files Created/Updated

[List from completion summary]

### Files Deleted

[List from completion summary]

### Recommended Stage: `[STAGE]`

**Evidence:**
[List from completion summary]

Let's walk through the key changes together.
```

---

## Step 3.3: Walk Through Key Changes

Review these files with the user (show key excerpts):

### 1. Project Vision

Open `catalyst/specs/project-vision.md`:
> "Here's the project vision the cloud agent created. Does this capture your project accurately?"

**Wait for user feedback.** Make corrections if needed.

### 2. Project Architecture

Open `catalyst/specs/project-architecture.md`:
> "Here's the technical architecture doc. Are the patterns and conventions accurate?"

**Wait for user feedback.** Make corrections if needed.

### 3. AGENTS.md

Open `AGENTS.md`:
> "The cloud agent added a Catalyst section. Does this work alongside your existing guidance?"

**Wait for user feedback.** Make corrections if needed.

---

## Step 3.4: Confirm Stage

Present the recommendation:

```
## Confirm Project Stage

The cloud agent recommends: `[STAGE]`

**Reasoning:**
[Evidence from completion summary]

The stages are:
- `poc` — Early development, exploring feasibility
- `mvp` — Core features work, early users
- `mmp` — Stable product, real users, growth focus
- `prod` — Mature, maintenance mode

**Do you agree with `[STAGE]`, or would you set it differently?**
```

**Wait for user confirmation.**

---

## Step 3.5: Apply Final Configuration

Once user confirms stage:

### Update project-state.md

```yaml
stage: [CONFIRMED_STAGE]
focus: "[From discovery or user update]"
health: green
blockers: []
```

### Any Quick Fixes

If user requested corrections during review:
- Make the edits now
- Keep changes minimal — major rewrites should be a separate brief

---

## Step 3.6: Complete Setup

Move the brief to complete folder:
```
catalyst/briefs/_review-*_catalyst-enabled-setup.md 
→ catalyst/briefs/complete/complete-[DATE]_catalyst-enabled-setup.md
```

---

## Step 3.7: Success Message

Show the user:

```
## Catalyst-Enabled Setup Complete ✅

Your project is now configured with Catalyst methodology.

### What's Ready

✓ Project stage: `[STAGE]`
✓ Specs created (vision, experience, architecture)
✓ AGENTS.md updated with Catalyst guidance
✓ Prompts adapted for your stack

### Next Steps

**Start every AI chat with:**
```
/code
```
Or attach `catalyst/prompts/codingai-1-starter.md` to prime the AI on your project.

**View project status:**
Check `catalyst/project-state.md`

**Create your first feature brief:**
Use `/brief` or follow `catalyst/BRIEFS.md`

### ⚠️ Slash Commands

If `/code`, `/brief`, etc. don't work, copy these folders from the Catalyst Dev Kit:

```
/.claude/          → Slash commands for Claude
/.github/          → Copilot instructions
```

These enable the AI slash commands in your editor.

### Recommended First Actions

1. **Review the specs** — Refine project-vision.md and project-architecture.md as you learn more
2. **Create your first brief** — Use `/brief` to scope your first piece of work
3. **Start building** — Use `/code` to start an AI-assisted coding session

Welcome to Catalyst! Build the right thing, fast.
```

**Phase 3 ends here. Setup complete.**

---

# Edge Cases

## User Wants to Start Over

If user asks to reset:
1. Delete all files in `catalyst/specs/`
2. Delete setup briefs in `catalyst/briefs/`
3. Remove the Enabled-Project callout from `catalyst/CATALYST.md`
4. Remove the Catalyst section from `AGENTS.md`
5. Set `stage: init` (or remove project-state.md)
6. Start Phase 1 fresh

## Cloud Agent Crashes Mid-Phase-2

If Phase 2 is incomplete:
1. Check what was created (specs, AGENTS.md updates)
2. Resume from where it left off
3. Or start Phase 2 fresh if too messy

## User Skips to Phase 3 Without Phase 2

If user says "review" but no `_review-` brief exists:
> "I don't see a completed Phase 2 brief. The cloud agent may not have finished yet.
> 
> Check for:
> - `approved-*` brief (Phase 2 hasn't started)
> - `active-*` brief (Phase 2 in progress)
> 
> What would you like to do?"

## Minimal Codebase

If the project is nearly empty or just scaffolding:
- Create specs with placeholder sections marked `[TODO]`
- Note in vision.md that specs will evolve as project develops
- Recommend `poc` stage

## User Disagrees with Recommended Stage

Accept their choice without argument. They know their project better.
Just update project-state.md with their chosen stage.

## User Wants to Skip Cloud Agent (All Local)

If user wants to do everything in one session without a cloud agent:
1. Complete Phase 1 as normal
2. Instead of creating a brief, continue directly to Phase 2 steps
3. Work through Phase 2 steps manually (this will take longer)
4. Continue to Phase 3 review when done
5. Skip the brief state transitions (no brief needed)

Note: This is slower but valid for smaller projects or when cloud agents aren't available.

## Project Has Catalyst Files But Stage is Init

This means a previous setup was interrupted. Check:
1. What specs exist? Are they complete?
2. Is there a setup brief? What state is it in?
3. Was CATALYST.md updated with the callout?

Based on what exists:
- If mostly complete → Resume Phase 2 or skip to Phase 3
- If minimal progress → Start fresh (delete partial work)
- Ask user which approach they prefer

---

# What NOT to Do

- **Don't modify code files** — This is methodology setup, not code changes
- **Don't suggest changing the tech stack** — Document what exists
- **Don't rewrite existing AGENTS.md content** — Only add the Catalyst section
- **Don't set stage in Phase 2** — That's Phase 3's job
- **Don't invent patterns** — Document actual patterns found in codebase
- **Don't over-document** — Keep specs concise and actionable
- **Don't delete catalyst/prompts/catalyst-enabled-setup.md** — That's this file!
