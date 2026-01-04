# Catalyst Prompts Pages — Cloud Agent Brief
> For a Cloud Agent to fill in the content for the Prompts section of the Catalyst docs (/docs/prompts)

---

## What is Catalyst?

Catalyst is an **AI-assisted development kit** — a method and starter kit for building web apps faster with AI coding agents.

### The Method
A structured delivery workflow that progresses through 4 stages:
- **POC** (Proof of Concept) — Validate the idea works
- **MVP** (Minimum Viable Product) — Real users, real feedback
- **MMP** (Minimum Marketable Product) — Ready for paying customers
- **PROD** (Production) — Enterprise-ready, fully hardened

### The Kit
A Next.js starter with surfaces (web, app, docs, etc.), design system, and AI-friendly documentation.

### Key Principles
1. **Proof-led alignment** — Show working software, not just documents
2. **Durable decisions** — Capture decisions in artefacts that persist
3. **Staged advancement** — Harden deliberately as you advance through stages
4. **Human-led, AI-assisted** — Humans make decisions; AI helps execute

---

## What Are Prompts?

Prompts are **reusable conversation starters** that set up AI agents correctly. They establish:
- The agent's role and behaviour
- What context to load
- How to structure output
- Guardrails and constraints

### Two Agent Types

| Agent | Purpose | Where Used |
|-------|---------|------------|
| **Project Agent** | Strategic thinking partner for alignment, artefacts, and planning | ChatGPT, Claude.ai, any conversational AI |
| **Coding Agent** | Implementation partner that writes code in the repo | VS Code + Copilot, Cursor, Claude Code |

Project Agent conversations happen **outside** the codebase. Coding Agent sessions happen **inside** it.

---

## Research Guidance

Before filling in prompt content, **do web research** to find current best practices for AI-assisted development.

### Research Topics

| Topic | What to Research |
|-------|------------------|
| Prompt engineering | Best practices for AI coding assistants (2024-2025) |
| AI pair programming | How developers structure sessions with AI agents |
| AI workflow patterns | How teams use AI across project phases |
| Handover patterns | How to transfer context between AI sessions |
| Quality assurance with AI | How to use AI for audits and reviews |
| Stage promotion | Industry patterns for POC → MVP → Production |

### AI-Assisted Development Patterns

Research and incorporate:

- **Session hygiene** — How to start/continue sessions cleanly
- **Context loading** — What files to reference, how much context is too much
- **Phased work** — Breaking work into reviewable chunks
- **Review patterns** — What humans should verify vs. trust
- **Artefact flow** — How documents flow from Project Agent to Coding Agent
- **Debugging with AI** — Systematic troubleshooting approaches
- **Audit automation** — What AI can check vs. what needs human review

### Sources to Check

- Anthropic Claude documentation — Claude-specific patterns
- OpenAI best practices — GPT prompt engineering
- Cursor documentation — AI coding editor patterns
- GitHub Copilot guides — In-editor AI assistance
- Industry blogs — AI-assisted development workflows
- Developer community — Practical patterns that work

---

## Why Prompts Matter

AI agents without proper setup:
- Invent scope beyond what's agreed
- Miss project context and constraints
- Produce inconsistent output quality
- Don't follow repo conventions

Well-designed prompts:
- Establish consistent agent behaviour
- Load the right context automatically
- Set clear guardrails and constraints
- Enable handover between sessions

---

## The Prompts Section Structure

The Prompts section has 6 pages:

| # | Page | URL | Purpose |
|---|------|-----|---------|
| 1 | Overview | `/docs/prompts` | What prompts are, how they work, how to use them |
| 2 | Project Sessions | `/docs/prompts/project-sessions` | Prompts for the Project Agent |
| 3 | Project Artefacts | `/docs/prompts/project-artefacts` | Prompts that create handover documents |
| 4 | Coding Sessions | `/docs/prompts/coding-sessions` | Prompts for the Coding Agent |
| 5 | Quality & Audits | `/docs/prompts/quality` | Prompts for running quality checks |
| 6 | Stage Promotion | `/docs/prompts/promotion` | Prompts for stage transitions |

---

## Existing Prompts

These prompts already exist in `/catalyst/prompts/`:

### Project Agent Prompts

| File | Purpose | Key Sections |
|------|---------|--------------|
| `projectai-1-starter.md` | Start a new project conversation | Role definition, responsibilities, how to work, what to produce |
| `projectai-2-continue.md` | Continue an existing project | Context loading, state of play, where we left off |
| `projectai-3-stresstest.md` | Pre-handover validation | Check for gaps, assumptions, risks before coding |
| `projectai-4-stateofplay.md` | Generate status snapshot | Current phase, completed work, open questions, next steps |

### Artefact Generation Prompts

| File | Purpose | Output |
|------|---------|--------|
| `projectai-handover-1-vision.md` | Create Vision document | Purpose, north star, personas, decision principles, success scenarios |
| `projectai-handover-2-architecture.md` | Create Architecture document | Design decisions, trade-offs, structure rationale |
| `projectai-handover-3-voice.md` | Create Voice document | Tone, style, messaging guidelines |
| `projectai-feature-prd.md` | Create Requirements document | Phase type, scope, success criteria, in/out boundaries |

### Coding Agent Prompts

| File | Purpose | Key Sections |
|------|---------|--------------|
| `codingai-1-starter.md` | Start a coding session | Role, guardrails, how to think, output expectations |
| `codingai-2-feature.md` | Build a feature with phased plan | Confirm understanding, propose phases, implement incrementally |

### Prompts to Create (NEW)

These prompts are **planned but don't exist yet**. You should create them:

| File | Purpose | When Used |
|------|---------|-----------|
| `codingai-debug.md` | Systematic debugging | When something is broken |
| `codingai-audit.md` | Run an audit checklist | "Run the Security audit at MVP level" |
| `codingai-hardening.md` | Pre-promotion hardening | Before stage promotion |
| `codingai-promotion-poc-mvp.md` | POC → MVP transition | Adding auth, real data, polish |
| `codingai-promotion-mvp-mmp.md` | MVP → MMP transition | Production readiness |
| `codingai-promotion-mmp-prod.md` | MMP → PROD transition | Enterprise hardening |

---

## Your Task

For each Prompts page, you will **replace the placeholder content** with comprehensive, actionable documentation that helps developers use prompts effectively.

### Page Structure Pattern

Each page should have:

1. **Header** — Already exists (title, icon, intro paragraph)
2. **Remove placeholder notice** — Delete the yellow "Placeholder content" callout
3. **Tabbed prompt display** — Show prompts with copy functionality
4. **Usage guidance** — When to use, how it fits the workflow
5. **Examples** — Real usage scenarios
6. **Tips & common mistakes** — Help developers use prompts well
7. **Related docs** — Links to relevant pages

---

## Detailed Requirements Per Page

### 1. Overview Page (`/docs/prompts/page.tsx`)

**Current state:** Complete — review and adjust as needed, but major changes not required.

**What it covers:**
- What prompts are and why they matter
- Two agent types (Project vs Coding)
- How prompts fit the workflow phases
- Category overview with links
- How to use prompts effectively

---

### 2. Project Sessions (`/docs/prompts/project-sessions/page.tsx`)

**Purpose:** Prompts for running project conversations with the Project Agent.

**Prompts to display (4 tabs):**
1. **Starter** (`projectai-1-starter.md`) — Start a new project conversation
2. **Continue** (`projectai-2-continue.md`) — Resume an existing project
3. **Stress Test** (`projectai-3-stresstest.md`) — Validate before handover
4. **State of Play** (`projectai-4-stateofplay.md`) — Generate status snapshot

**Content to add:**

**When to use each prompt:**
- Starter: Beginning of any new project or major pivot
- Continue: When starting a new chat about an existing project
- Stress Test: Before handing over to Coding Agent, to catch gaps
- State of Play: Before breaks, handovers, or when context is complex

**Session workflow:**
1. Paste Starter prompt (first conversation) or Continue prompt (ongoing work)
2. Share project context (goals, users, constraints)
3. Work through alignment, decisions, and artefacts
4. Use Stress Test before handover
5. Generate State of Play before ending session

**Tips:**
- The Project Agent is a thinking partner, not a passive assistant
- It should challenge you and ask clarifying questions
- Keep sessions focused on one goal or decision
- Generate State of Play frequently for handover hygiene

**Common mistakes:**
- Using Project Agent when you should be coding (use Coding Agent instead)
- Not providing enough context at session start
- Skipping Stress Test before handover (leads to gaps)
- Not generating State of Play (context loss between sessions)

---

### 3. Project Artefacts (`/docs/prompts/project-artefacts/page.tsx`)

**Purpose:** Prompts that generate handover documents the Coding Agent reads.

**Prompts to display (4 tabs):**
1. **Vision** (`projectai-handover-1-vision.md`) — Create project vision document
2. **Architecture** (`projectai-handover-2-architecture.md`) — Create architecture document
3. **Voice** (`projectai-handover-3-voice.md`) — Create voice and tone guide
4. **Requirements** (`projectai-feature-prd.md`) — Create requirements/PRD

**Content to add:**

**What artefacts are for:**
- Transfer context from Project Agent conversations to Coding Agent sessions
- Create durable decisions that persist beyond chat windows
- Enable multiple Coding Agent sessions to work from the same source of truth
- Prevent "context loss" when AI chat history gets too long or resets

**Artefact flow:**
```
Project conversation → Vision prompt → Vision document (specs/)
                    → Architecture prompt → Architecture document (specs/)
                    → Voice prompt → Voice document (specs/)
                    → Requirements prompt → Requirements document (specs/)
                                                    ↓
                                          Coding Agent reads specs/
```

**Where artefacts live:**
- Output location: `/catalyst/specs/`
- Files: `project-vision.md`, `project-architecture.md`, `project-voice.md`, `project-requirements.md`
- The Coding Agent automatically looks for these files

**When to create each:**
- Vision: At project start, after initial alignment
- Architecture: After key technical decisions are made
- Voice: When tone/messaging consistency matters (marketing, user-facing content)
- Requirements: Before each phase of work (POC, MVP, MMP, etc.)

**Artefact quality tips:**
- Keep artefacts focused and concise (AI context windows are limited)
- Update artefacts when decisions change (don't let them drift)
- Requirements should be phase-specific, not a wishlist
- Vision is long-lived; Requirements are phase-lived

**Common mistakes:**
- Creating artefacts that are too long (bloats AI context)
- Not updating artefacts when scope changes
- Writing requirements before vision is clear
- Skipping architecture (leads to inconsistent Coding Agent decisions)

---

### 4. Coding Sessions (`/docs/prompts/coding-sessions/page.tsx`)

**Purpose:** Prompts for setting up coding sessions with the Coding Agent.

**Prompts to display (3 tabs):**
1. **Starter** (`codingai-1-starter.md`) — Start a new coding session
2. **Feature** (`codingai-2-feature.md`) — Build a feature with phased plan
3. **Debug** (`codingai-debug.md`) — Systematic debugging *(NEW — create this)*

**Content to add:**

**How the Coding Agent works:**
- Reads project artefacts from `/catalyst/specs/`
- Follows repo conventions from `AGENTS.md`
- Proposes phased build plans before implementing
- Summarises after each phase (what changed, what to review, what's next)

**Session workflow:**
1. Paste Starter prompt (sets up guardrails and loads context)
2. Describe what you want to build (reference Requirements if exists)
3. Agent proposes phased plan — review and approve
4. Agent implements one phase at a time
5. Review each phase, then continue or adjust
6. Validate (typecheck, lint, test) after implementation

**When to use each:**
- Starter: Every new coding session (establishes behaviour)
- Feature: Starting a new feature or major piece of work
- Debug: When something is broken (systematic troubleshooting)

**What the agent reads automatically:**
- `AGENTS.md` — Repo conventions and non-negotiables
- `/catalyst/specs/project-vision.md` — North star and success criteria
- `/catalyst/specs/project-architecture.md` — Design decisions
- `/catalyst/specs/project-requirements.md` — Current phase scope

**Tips:**
- Always paste Starter prompt first — it sets guardrails
- Break large work into phases (easier to review, less rework)
- The agent will ask clarifying questions — answer them
- Run validation after implementation (the agent might suggest this)

**Common mistakes:**
- Skipping Starter prompt (agent invents scope, ignores conventions)
- Not having artefacts in `/catalyst/specs/` (agent has no context)
- Approving phases without review (hard to course-correct later)
- Not running validation (type errors, lint issues accumulate)

**Debug prompt (NEW — create this):**

Create a new prompt `codingai-debug.md` with this structure:
- Role: Debugging assistant with systematic approach
- Process: Gather context → Form hypothesis → Test → Fix → Verify
- Key behaviours:
  - Read error messages and stack traces carefully
  - Identify the smallest reproducible case
  - Form 2-3 hypotheses before making changes
  - Make minimal changes to fix the issue
  - Verify the fix doesn't break other things
  - Explain what was wrong and why the fix works

---

### 5. Quality & Audits (`/docs/prompts/quality/page.tsx`)

**Purpose:** Prompts for running structured quality checks.

**Prompts to display (2 tabs):**
1. **Audit Runner** (`codingai-audit.md`) — Run a specific audit *(NEW — create this)*
2. **Hardening** (`codingai-hardening.md`) — Pre-promotion hardening *(NEW — create this)*

**Content to add:**

**How audits work with prompts:**
- The Audits section (`/docs/audits`) defines **what to check** — checklists by category
- These prompts tell the Coding Agent **how to run** the audits
- The agent works through the checklist, reports pass/fail, suggests fixes

**Usage examples:**
- "Run the Security audit at MVP level for the App surface"
- "Run the Accessibility audit on all forms in the project"
- "Harden this codebase for MMP release"

**Audit Runner prompt (NEW — create this):**

Create `codingai-audit.md` with:
- Role: Quality auditor for Catalyst projects
- Inputs required: Audit category, stage level, scope (optional)
- Process:
  1. Load the relevant audit checklist from documentation
  2. Examine the codebase against each item
  3. Report pass/fail for each checklist item
  4. Provide specific file locations for failures
  5. Suggest fixes for each failure
  6. Summarise results (X passed, Y failed, Z skipped)
- Key behaviours:
  - Be thorough but efficient (don't over-report)
  - Stage-appropriate expectations (POC ≠ Production)
  - Group related issues together
  - Prioritise critical issues over nice-to-haves

**Hardening prompt (NEW — create this):**

Create `codingai-hardening.md` with:
- Role: Pre-promotion quality reviewer
- Inputs required: Target stage (MVP, MMP, PROD)
- Process:
  1. Identify which audits apply at target stage
  2. Run relevant audits at target stage level
  3. Compile gap analysis
  4. Prioritise fixes (critical → nice-to-have)
  5. Estimate effort per fix
  6. Provide recommendation: ready or not ready
- Key behaviours:
  - Focus on blockers first
  - Don't over-scope (only target stage requirements)
  - Provide clear fix instructions
  - Be honest about readiness

**Available audits:**
Link to each of the 8 audit categories:
- Data & Security, Accessibility & Inclusion, Design & Experience
- Speed & Performance, Code & Testing, Deploy & Observe
- Content & SEO, Integrations & Services

---

### 6. Stage Promotion (`/docs/prompts/promotion/page.tsx`)

**Purpose:** Prompts for transitioning between stages.

**Prompts to display (3 tabs):**
1. **POC → MVP** (`codingai-promotion-poc-mvp.md`) *(NEW — create this)*
2. **MVP → MMP** (`codingai-promotion-mvp-mmp.md`) *(NEW — create this)*
3. **MMP → PROD** (`codingai-promotion-mmp-prod.md`) *(NEW — create this)*

**Content to add:**

**Why staged promotion matters:**
- Production is a choice, not an accident
- Each stage has different quality expectations
- Skipping stages causes "accidental production" — prototypes become live systems
- These prompts ensure systematic hardening before promotion

**POC → MVP prompt (NEW — create this):**

Create `codingai-promotion-poc-mvp.md` with:
- Focus: Adding real users and data
- Key changes to make:
  - Replace mock data with real database
  - Add authentication (Supabase Auth integration)
  - Implement error handling for happy paths
  - Add basic form validation
  - Ensure responsive design works
  - Connect environment variables properly
- Audits to run: Data & Security (light), Design & Experience (light)
- What NOT to do yet:
  - Comprehensive edge case handling
  - Performance optimisation
  - Advanced security hardening
  - Full test coverage

**MVP → MMP prompt (NEW — create this):**

Create `codingai-promotion-mvp-mmp.md` with:
- Focus: Ready for paying customers
- Key changes to make:
  - Polish UI/UX (loading states, error states, empty states)
  - Comprehensive error handling
  - Performance optimisation (Core Web Vitals)
  - Security review (OWASP basics)
  - User-facing documentation
  - Monitoring and alerting basics
- Audits to run: All audits at full level
- What NOT to do yet:
  - Enterprise integrations
  - Multi-tenancy
  - Comprehensive SLA
  - Disaster recovery

**MMP → PROD prompt (NEW — create this):**

Create `codingai-promotion-mmp-prod.md` with:
- Focus: Enterprise-ready operations
- Key changes to make:
  - Monitoring and alerting (errors, performance, uptime)
  - Backup and recovery procedures
  - Incident response process
  - Support runbooks
  - SLA definition and tracking
  - Security audit (penetration testing, if applicable)
- Audits to run: All audits at complete level, Deploy & Observe critical
- What this stage requires:
  - Operational procedures documented
  - On-call or support process
  - Rollback capability tested
  - Data retention policies

**Stage skipping warning:**
Explain the risks:
- POC → PROD skip: Security vulnerabilities, data loss, operational fragility
- MVP → PROD skip: Poor UX, missing features, support chaos
- MMP → PROD skip: Operational failures, no runbooks, incident chaos

---

## Content Guidelines

### Tone & Style
- **Practical, not academic** — Write for developers who want to ship
- **Concise** — Short sentences, bullet points, tables
- **Actionable** — Every section should help developers do something
- **Stage-aware** — Always clarify what's appropriate at each stage
- **AI-friendly** — Write so prompts are easy to copy and use

### When Writing New Prompts
Follow the pattern of existing prompts:
- Clear role definition at the top
- Step-by-step process
- Explicit guardrails and constraints
- Expected output format
- Stability note at bottom

### Tabbed Display
Each category page should display prompts in tabs:
- Tab shows prompt name
- Tab content shows the full prompt with syntax highlighting
- Copy button on each prompt
- "Source file" reference below each prompt

---

## Files to Modify

| File | What to Do |
|------|------------|
| `app/(docs)/docs/prompts/page.tsx` | Review, minor adjustments if needed |
| `app/(docs)/docs/prompts/project-sessions/page.tsx` | Replace placeholder content |
| `app/(docs)/docs/prompts/project-artefacts/page.tsx` | Replace placeholder content |
| `app/(docs)/docs/prompts/coding-sessions/page.tsx` | Replace placeholder content |
| `app/(docs)/docs/prompts/quality/page.tsx` | Replace placeholder content |
| `app/(docs)/docs/prompts/promotion/page.tsx` | Replace placeholder content |

## Prompt Files to Create

| File | Purpose |
|------|---------|
| `catalyst/prompts/codingai-debug.md` | Systematic debugging prompt |
| `catalyst/prompts/codingai-audit.md` | Audit runner prompt |
| `catalyst/prompts/codingai-hardening.md` | Pre-promotion hardening prompt |
| `catalyst/prompts/codingai-promotion-poc-mvp.md` | POC → MVP transition |
| `catalyst/prompts/codingai-promotion-mvp-mmp.md` | MVP → MMP transition |
| `catalyst/prompts/codingai-promotion-mmp-prod.md` | MMP → PROD transition |

---

## Implementation Notes

### Adding Tabs with Prompts
Use the existing tab pattern from the codebase (check `components/ui/tabs.tsx`).

Each tab should:
1. Display the prompt content in a code block or monospace format
2. Have a "Copy" button that copies the prompt to clipboard
3. Show the source file path below the prompt

### Reading Prompt Files
The prompts live in `/catalyst/prompts/`. You can either:
- Import them as raw text at build time
- Display them inline in the page component

For simplicity, displaying inline is fine — the prompts are stable and rarely change.

### Style Consistency
- Use the same header/icon pattern as existing pages
- Use the same card components for prompt displays
- Match the emerald (coding), violet (project), amber (quality), sky (promotion) colour scheme
- Keep the "Related docs" section at the bottom

---

## Success Criteria

When complete, a developer should be able to:

1. **Understand what prompts are** — Read Overview, know the two agent types
2. **Find the right prompt** — Navigate to category, find specific prompt
3. **Copy and use a prompt** — One-click copy, paste into AI chat
4. **Know when to use each** — Clear guidance on timing and context
5. **Avoid common mistakes** — Tips and anti-patterns documented
6. **Create new prompts** — Use existing prompts as templates

---

## Reference: Existing Prompt Structure

Example from `codingai-1-starter.md`:

```markdown
## Role: Expert AI Coding Agent — Catalyst Starter Prompt
_Use this prompt to start a new Catalyst development chat._

@AI: You are an expert AI Coding Agent working inside an existing codebase...

---

## Non-Negotiable Guardrails
...

---

## How to Think While Coding
...

---

## Output & Collaboration Expectations
...

---

**Stability note:** This prompt is intentionally stable...
```

Follow this pattern for new prompts:
- Role definition and context
- Clear sections with `---` separators
- Specific, actionable guidance
- Stability note at the end
