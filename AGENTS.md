# CATALYST - AI Agent Instructions

**Catalyst is the AI-first way to ship production-ready outcomes in weeks instead of months.**

It combines a repeatable delivery method (how you run the project) with a development kit (this repo). The method keeps you aligned as speed increases; the kit makes that method fast to execute.

If you're an AI agent, this file tells you how to work in this codebase. If you need to understand *why* Catalyst works this way, see `catalyst/CATALYST.md`.

---

## Documentation Index

Primary source of truth for repo conventions. Read this first, then consult specific docs as needed.

Always read the relevant docs based on your current task:

| Task | Read | For |
|------|------|-----|
| **Understanding Catalyst** | `catalyst/CATALYST.md` | Framework overview, philosophy, architecture |
| **Understanding terminology** | `catalyst/GLOSSARY.md` | Naming conventions, architecture terms |
| **Managing surfaces** | `catalyst/SURFACES.md` | Creating, configuring, deleting surfaces |
| **Layout & CSS patterns** | `catalyst/PATTERNS.md` | Centering, overflow, responsive rules |
| **Creating components** | `components/COMPONENTS.md` | Available components, folder rules |
| **Styling & animations** | `design/DESIGN.md` | CSS files, color tokens, animation classes |
| **Using utilities/hooks** | `lib/HELPERS.md` | Utility functions, scroll helpers |
| **Working with surfaces** | `app/(surface)/SURFACE.md` | Surface-specific docs (WEB.md, APP.md, etc.) |
| **Authentication** | `app/(auth)/AUTH.md` | Auth modes, routes, Supabase integration |

---

## ⚠️ Important Callouts

Common mistakes to avoid. Read these before writing code:

### Use Core Components First
- **Use `Stack`, `Row`, `Grid`** for layout with multiple children
- **Use `Text`, `Title`** for typography
- **Use `Container`, `Section`** for page structure
- **Read `components/core/CORE.md`** for available components and props

### But Don't Over-Engineer
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
- **Read `catalyst/PATTERNS.md`** for layout patterns and CSS fixes

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

Each route group has a `_surface/` folder containing its shell, styles, and surface-specific components. The underscore prefix marks it as a private folder (ignored by Next.js routing).

## Environment Variables

- `NEXT_PUBLIC_*` = safe for public, bundled in client JS
- No prefix = server-only, safe for secrets
- Always update `.env.example` when adding new vars

## Folder Architecture

```
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

catalyst/                           # Method docs & project artefacts
├── CATALYST.md                     # Framework overview
├── GLOSSARY.md                     # Terminology
├── PATTERNS.md                     # Layout patterns
├── SURFACES.md                     # Surface management
├── prompts/                        # AI prompts (starter, project, coding)
├── specs/                          # Project specs (vision, architecture, etc.)
└── briefs/                         # AI agent briefs for larger tasks

lib/                                # Utilities & config
```

**Key conventions:**
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
config.links.github       // GitHub repo URL
config.features.showDocsInProduction
```
