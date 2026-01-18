# CATALYST - AI Agent Instructions

**Build the right thing, fast.**

This is a Catalyst project — a method and a kit working together. The method keeps you aligned as speed increases; the kit makes that method fast to execute. If you're an AI agent, read `.catalyst/PLAYBOOK.md` to know how to operate as a Catalyst agent.

If you're an AI agent, this file tells you how to work in this codebase.

---

## Documentation Index

Catalyst separates **method** (how to work) from **project** (what you're building):

### Method Documentation (`.catalyst/`)

Upstream Catalyst method — replaceable on upgrade.

| Task | Read | For |
|------|------|-----|
| **Understanding Catalyst** | `.catalyst/CATALYST.md` | Framework overview, philosophy, architecture |
| **Operating as an agent** | `.catalyst/PLAYBOOK.md` | Minimal runbook for AI agents |
| **Understanding terminology** | `.catalyst/GLOSSARY.md` | Naming conventions, architecture terms |
| **Using slash commands** | `.catalyst/commands/COMMANDS.md` | Available commands, creating new commands |
| **Managing surfaces** | `.catalyst/SURFACES.md` | Creating, configuring, deleting surfaces |
| **Layout & CSS patterns** | `.catalyst/PATTERNS.md` | Centering, overflow, responsive rules |
| **Updating project state** | `.catalyst/STATE.md` | When/how to update state, field definitions |
| **Working on briefs** | `.catalyst/BRIEFS.md` | Brief structure, workflow, and how to create briefs |
| **Writing Catalyst docs** | `.catalyst/DOCS.md` | Standards and patterns for Catalyst documentation |
| **Common AI mistakes** | `.catalyst/LEARNINGS.md` | Patterns AI agents get wrong — read before coding |

### Project Documentation (`catalyst/`)

Project-specific artifacts — owned by this project.

| Task | Read | For |
|------|------|-----|
| **Checking project state** | `catalyst/project-state.md` | Current stage, focus, blockers, health |
| **Project specs** | `catalyst/specs/` | Vision, experience, brand, architecture |
| **Project briefs** | `catalyst/briefs/` | PRDs and work items |

### Kit Documentation (codebase)

| Task | Read | For |
|------|------|-----|
| **Creating components** | `components/COMPONENTS.md` | Available components, folder rules |
| **Styling & animations** | `design/DESIGN.md` | CSS files, color tokens, animation classes |
| **Using utilities/hooks** | `lib/HELPERS.md` | Utility functions, scroll helpers |
| **Working with surfaces** | `app/({surface})/{SURFACE}.md` | Surface-specific docs (e.g., WEB.md, APP.md, etc.) |
| **Authentication** | `app/(auth)/AUTH.md` | Auth modes, routes, Supabase integration |
| **Working with modules** | `modules/MODULES.md` | Module architecture, import rules, creating/removing modules |

---

## ⚠️ Important Callouts

Common mistakes to avoid. Read these before writing code.

For the full list of AI learnings, see `.catalyst/LEARNINGS.md`.

### Use Core Components First
- **Use `Stack`, `Row`, `Grid`** for layout with multiple children
- **Use `Text`, `Title`** for typography
- **Use `Container`, `Section`** for page structure
- **Read `components/core/CORE.md`** for available components and props

### Don't Over-Engineer
- **Don't wrap single elements** in `Stack` or `Row` for positioning — use `<div className="...">` or `Center`
- **Don't use `Stack` for positioning containers** — use `<div className="relative">`
- **Don't reinvent existing UI components** — use `Badge` not styled `Text inline`
- **Rule:** If Core makes intent clearer, use it. If it adds indirection, don't.

### Use Existing Components
- **Never use raw `<button>`, `<input>`, `<a>`** — check `components/ui/` first
- **Never create inline components that shadcn has** — install instead
- **Read `components/COMPONENTS.md`** before creating any component

### Layout & CSS
- **Never use `justify-center` on scrollable containers** — content gets clipped on small screens
- **Never use `min-h-screen` for sidebar layouts** — use `h-screen` + `overflow-hidden`
- **Read `.catalyst/PATTERNS.md`** for layout patterns and CSS fixes

### CSS Variables (Critical)
- **Always use `--color-` prefix** — `var(--color-background)` not `var(--background)`
- **Always use oklch for transparency** — `oklch(from var(--color-primary) l c h / 0.1)` not `hsl(...)`
- **No spacing/radius variables** — use direct values like `1.5rem`, `1rem`
- **Read `design/DESIGN.md`** for full CSS variable conventions

### Configuration
- **Never hardcode app name, URLs, or feature flags** — use `lib/config.ts`
- **Never duplicate config values** — single source of truth

### Next.js Link & API Routes (Critical)
- **Next.js `<Link>` prefetches by default** — when visible in viewport, sends GET request
- **Never use `<Link>` for API routes with side effects** — prefetch will trigger the action!
- **API routes with side effects (logout, delete, etc.) should be POST/DELETE only** — no GET handlers
- **Use form POST or fetch() for actions** — not Link
- **Add `prefetch={false}` to Links in dropdowns/modals** — they become visible suddenly
- **Read `app/api/auth/signout/route.ts`** for documented example of this issue

### Package Management
- **Always use `pnpm`** — not npm, yarn, or bun
- **Install packages:** `pnpm add <package>`
- **Install dev dependencies:** `pnpm add -D <package>`
- **Run scripts:** `pnpm dev`, `pnpm build`, `pnpm lint`
- **After installing:** commit `pnpm-lock.yaml` to avoid CI failures

### Supabase Projects (Multiple MCP Servers)
This workspace has multiple Supabase projects configured via MCP:

| MCP Server | Project | Purpose |
|------------|---------|---------|
| `supabase` | `ebirxyrjwaulyqizcbcs` | Catalyst main project |
| `supabase-stev` | `erumyprjlubhvzrzmpdj` | Steven Leckie website |

**At the start of each session:**
- Ask which Supabase project the user is working with
- Use the correct MCP server tools (e.g., `mcp_supabase_*` vs `mcp_supabase-stev_*`)
- Don't assume — the default `supabase` tools point to Catalyst, not Steven Leckie

**Environment variables:**
- Catalyst: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Steven Leckie: `SL_SUPABASE_URL`, `SL_SUPABASE_ANON_KEY`

---

# Working Style

## Guardrails

- Follow repo standards and constraints — this file is the source of truth
- Keep code **simple, structured, and maintainable**
- Avoid: over-abstraction, premature optimisation, unnecessary libraries, "clever" architecture
- Prefer **boring, consistent patterns** that scale
- Don't invent scope beyond provided documents

## How to Think

- Optimise for: **clarity → utility → consistency → speed**
- When uncertain: **pause and ask** a targeted question instead of guessing
- Make changes in **small, reviewable increments**
- If a change touches many files, propose a plan first

## Collaboration

- Confirm understanding of goals before starting
- Break work into small tasks the user can test as they go
- After each phase, summarise: what changed, why, what to review, what's next
- Surface gaps as questions or explicit assumptions (clearly labelled)
- Keep prototypes lightweight unless explicitly production-grade

## Degree of Creativity

Depends on what you're building:

| Context | Creativity | Priority |
|---------|------------|----------|
| **Websites / Landing Pages** | High | Visual appeal, messaging hierarchy, strong CTAs, polish |
| **Presentations** | Medium | Clear narrative arc (problem → insight → approach → outcome), engaging content |
| **Web Apps / Admin Tools** | Low | Usability, clarity, consistency, predictable navigation |

For web apps: follow the design system closely. Creativity should engage users, not get in the way.

---

# Project Structure

## Key Files

| File | Purpose |
|------|---------|
| `lib/config.ts` | Central config — app name, feature flags, external links |
| `lib/navigation.ts` | Navigation items for all layouts |
| `.env.example` | Environment template — copy to `.env.local` |

## Hidden Dev Utilities

| URL | Purpose |
|-----|---------|
| `/docs/test` | Hidden test page for debugging (not in nav, noindex) |

Use `/docs/test` for temporary debugging code, component testing, or auth diagnostics.
Keep it minimal in production builds.

## Route Groups

| Route | Shell | Purpose |
|-------|-------|--------|
| `(web)` | WebShell | Public/marketing pages |
| `(app)` | AppShell | Application pages |
| `(docs)` | DocsShell | Documentation |
| `(examples)` | ExamplesShell | Reference implementations |
| `(present)` | SlidesShell | Slide presentations |
| `(catalyst)` | CatalystShell | Project status and briefs dashboard |

Each route group has a `_surface/` folder containing its shell, styles, and surface-specific components. The underscore prefix marks it as a private folder (ignored by Next.js routing).

## Environment Variables

- `NEXT_PUBLIC_*` = safe for public, bundled in client JS
- No prefix = server-only, safe for secrets
- Always update `.env.example` when adding new vars

## Folder Architecture

```
.catalyst/                          # METHOD (upstream, replaceable)
├── CATALYST.md                     # Framework overview
├── PLAYBOOK.md                     # AI agent runbook
├── GLOSSARY.md                     # Terminology
├── PATTERNS.md                     # Layout patterns
├── SURFACES.md                     # Surface management
├── BRIEFS.md                       # Brief workflow
├── STATE.md                        # State management guidance
├── LEARNINGS.md                    # Common AI mistakes
├── CHANGELOG.md                    # Method version history
├── commands/                       # Slash command definitions
└── prompts/                        # AI prompts

catalyst/                           # PROJECT (yours)
├── project-state.md                # Current stage, focus, health
├── specs/                          # Vision, experience, brand, architecture
├── briefs/                         # PRDs and work items
└── inspiration/                    # Visual references

app/
├── globals.css, layout.tsx         # Root layout, always loaded
├── (web)/                          # Marketing surface
│   ├── WEB.md                      # Surface docs
│   ├── web.css                     # Surface styles
│   ├── layout.tsx                  # Uses WebShell
│   ├── _surface/
│   │   └── web-shell.tsx
│   └── page.tsx                    # Landing page
├── (app)/                          # Dashboard surface
│   ├── APP.md                      # Surface docs
│   ├── app.css                     # Surface styles
│   ├── layout.tsx                  # Uses AppShell
│   ├── _surface/
│   │   └── app-shell.tsx
│   └── app/, demo/                 # Routes
├── (docs)/                         # Documentation surface
│   ├── DOCS.md                     # Surface docs
│   ├── docs.css                    # Surface styles
│   ├── layout.tsx                  # Uses DocsShell
│   ├── _surface/
│   │   └── docs-shell.tsx
│   └── docs/                       # Routes
├── (examples)/                     # Reference implementations
│   ├── EXAMPLES.md                 # Surface docs
│   ├── examples.css                # Surface styles
│   ├── layout.tsx                  # Uses ExamplesShell
│   ├── _surface/
│   │   └── examples-shell.tsx
│   └── examples/                   # Routes (dashboard, crm, etc.)
├── (present)/                      # Presentations surface
│   ├── PRESENT.md                  # Surface docs
│   ├── present.css                 # Surface styles
│   ├── layout.tsx                  # Uses SlidesShell
│   ├── _surface/                   # All slide components
│   │   ├── slides-shell.tsx
│   │   ├── slide.tsx, nav.tsx, etc.
│   │   └── index.ts                # Barrel export
│   └── present/                    # Routes
└── api/                            # API routes

components/                         # SHARED across all surfaces
├── core/                           # Core primitives (Stack, Row, etc.)
├── layout/                         # Shell building blocks
├── shared/                         # App-specific shared components
├── ui/                             # UI library (shadcn)
└── vendor/                         # Third-party wrappers

design/                             # SHARED styles only
├── shared.css                      # Design tokens
├── animate.css                     # Animations
├── helpers.css                     # Utilities
└── print.css                       # Print styles

lib/                                # Utilities & config
```

**Key conventions:**
- `.catalyst/` — Method folder (upstream, don't edit)
- `catalyst/` — Project folder (yours)
- `_surface/` — Private folder for surface-specific code (shell, components, utils)
- `(group)/` — Route groups, no URL segment
- Each surface is self-contained — delete folder to remove entire surface

---

# Coding Conventions

## File Headers
Every new file needs a header comment:
```typescript
/**
 * CATALYST - {purpose}
 */
```

## Comments
- Explain **WHY**, not what
- Keep concise and relevant (also use for structure)
- Use `<Comment text="Layout Header..." />` for DevTools debugging (renders HTML comments whcih are easy to see)

## Navigation
- Navigation items are **data, not JSX** — modify arrays in `lib/navigation.ts`

## Components & Styling
- **Use primitives first** for layout (`Stack`, `Row`, `Grid`) and typography (`Text`, `Title`)
- Use compound component pattern (e.g., `Shell.Sidebar`)
- Use `data-slot` attributes for styling hooks
- Use `render` prop for composition (base-ui pattern, not Radix's `asChild`)
- Use existing components before creating new ones
- Use BEM-style naming with semantic prefixes (see below)
- Use Tailwind utility classes for simple styling
- Combine with custom css (using the global design tokens) for advanced styling/animations, and DRY classes

### BEM Naming Convention
All components need a namespace/prefix for CSS targeting and DevTools identification:

| Folder | Prefix Style | Examples |
|--------|--------------|----------|
| `core/` | `core-` | `core-stack`, `core-text` |
| `ui/` | `ui-` | `ui-button`, `ui-tabs__list` |
| `layout/` | `layout-` | `layout-shell`, `layout-sidebar` |
| `shared/` | semantic | `dev-card`, `stat-card`, `user-menu` |
| `vendor/` | semantic | `chart`, `chart-area`, `sortable-item` |
| `_surface/` | surface name | `web-shell`, `app-shell`, `docs-shell` |

**Key:** Prefix identifies the component family, not the folder. `dev-` could apply to `dev-card`, `dev-tools`, `dev-badge`.

### UI Component Styling (Hybrid CSS/Tailwind)
- **Base CSS** (`design/components/*.css`) in `@layer components` — structural styles, focus ring, disabled
- **Tailwind** (CVA in component) — colors, spacing, hover states
- **Tailwind always wins** — `@layer utilities` comes after `@layer components`
- **Custom overrides work naturally** — `<Button className="h-14 rounded-full border-0">` overrides base
- **@keyframes outside @layer** — CSS parsers don't allow keyframes inside layer blocks
- **Dark mode overrides** — place outside `@layer` using `:root.dark .class` for proper specificity

---

# Core Docs vs Briefs

Catalyst separates **stable project definitions** from **individual work items**:

## Project State (`/catalyst/project-state.md`)
Track where the project is right now. Updated frequently as the project progresses.

| Field | Purpose |
|-------|---------|
| `stage` | Current delivery stage: POC, MVP, MMP, or PROD |
| `project_version` | Version of the thing you're building |
| `catalyst_version` | Catalyst baseline version used by this project |
| `catalyst_ref` | Optional git SHA/tag for reproducibility |
| `focus` | What the team is working on right now (1-2 sentences) |
| `target` | Current target milestone or date |
| `health` | Project health: green, yellow, or red |
| `blockers` | List of current blockers (if any) |
| `goals` | High-level outcomes the project is working toward |

**Dashboard:** View project state at `/catalyst`

**⚠️ Keep state current:** Read `.catalyst/STATE.md` for full guidance. Check state at the start of work, update at the end. Every brief should align with focus and goals.

## Core Project Documents (`/catalyst/specs/`)
Foundational documents that define the project. Created once, updated based on their purpose.

| Document | Purpose | Update Frequency |
|----------|---------|------------------|
| `project-vision.md` | North star, success criteria, decision principles | Rarely |
| `project-experience.md` | Users, journeys, features | Occasionally |
| `project-brand.md` | Voice, visuals, communication style | Rarely |
| `project-architecture.md` | Technical stack, patterns, conventions | Ongoing |

**Visual references:** `/catalyst/inspiration/` folder for any inspiration (described in brand doc).

## Briefs (`/catalyst/briefs/`)
Individual PRDs for specific features or phases. Created as needed.

- The first brief (building the POC) is effectively the first PRD
- Each subsequent brief scopes a specific piece of work
- Use `/brief` command or read `.catalyst/BRIEFS.md` to create new briefs

**Key distinction:** State tracks where you are. Specs define the project. Briefs define individual work items.

---

# Briefs Convention

Briefs live in `/catalyst/briefs/`. They use a **state prefix** for easy sorting:

```
{state}-{date}_{brief-name}.md
```

**Examples:**
- `_blocked-20260107_payment.md` — Stuck, needs human attention
- `_review-20260107_auth-flow.md` — Done, awaiting human review
- `active-20260107_api-work.md` — Currently being worked on
- `approved-20260106_new-feature.md` — Ready to pick up
- `backlog-20260105_future-idea.md` — Not started yet

**States:** `_blocked`, `_review`, `active`, `approved`, `backlog`

| State | Meaning | Alphabetical Position |
|-------|---------|----------------------|
| `_blocked` | Stuck, needs human attention | 1st (top) |
| `_review` | Done, awaiting human review | 2nd |
| `active` | Currently being worked on | 3rd |
| `approved` | Scoped and ready to start | 4th |
| `backlog` | Draft, not yet prioritised | 5th |

**Changing state:** Just rename the file. No tooling required.

**Completed/Archived briefs:** Move to subfolders:
- `complete/` — Finished briefs (use `complete-` prefix)
- `archive/` — Canned briefs (use `archive-` prefix)

**Optional frontmatter:**
```yaml
---
title: "Human Readable Title"
assignee: "@username"
stage: mvp
tags: [auth, api]
---
```

**Dashboard:** View all briefs at `/catalyst/briefs`

---

## Brief Workflow for AI Agents

When working on briefs, AI agents **must** update the brief state:

### Starting Work
1. Check that the brief is `approved-` or `backlog-`
2. **Rename the file:** `approved-` → `active-` or `backlog-` → `active-`
3. Begin implementation

### Completing Work
1. Finish implementation
2. **Rename the file:** `active-` → `_review-`
3. Summarise what was done and what needs human review

### If Blocked
1. **Rename the file:** `active-` → `_blocked-`
2. Document what you're blocked on in the brief or conversation

### Human Review Flow
After a human reviews `_review-` briefs:
- **Approved:** Human moves to `complete/` folder with `complete-` prefix
- **Changes needed:** Human renames back to `active-` with notes

### Reminders for Humans
- Check `/catalyst/briefs` dashboard for `_blocked-` and `_review-` briefs
- These sort at the top of the folder — easy to spot
- Rename briefs promptly to keep the dashboard accurate
- Move completed briefs to `complete/` folder periodically

---

# What NOT to Do

Ensure you keep code simple and well structured:
- Don't use raw `<div>` for layout — use `Stack`, `Row`, `Grid`
- Don't use raw `<p>`/`<span>` with text classes — use `Text`, `Title`
- Don't over-abstract or over-engineer
- Don't add defensive fallbacks without clear need
- Don't invent scope beyond provided documents
- Don't duplicate config values
- Don't hardcode config, URLs, etc - add to `config`
- Don't use raw HTML elements when a component exists

---

# Terminal Commands

If a terminal command fails:
- Don't keep retrying automatically
- After 1-2 failures, **ask the user** to run manually
- This is often a VS Code session issue, not a code problem

---

## Quick Reference

```typescript
import { config } from "@/lib/config"

config.app.name           // "Catalyst"
config.links.repo       // Git repo URL (or null if not set up yet)
config.features.showDocsInProduction
```
