# CATALYST

**Catalyst is the AI-first way to ship production-ready outcomes in weeks instead of months — without losing alignment as speed increases.**

---

## The Problem Catalyst Solves

Most delivery doesn't fail because teams can't build. It fails because teams build fast in the wrong direction: misread intent, shifting priorities, prototypes that quietly become production, and handovers that lose context.

AI makes building faster — but speed alone doesn't keep you aligned. In fact, when you can build quickly, it becomes easier to build the wrong thing quickly.

---

## What is Catalyst?

**Catalyst is two things working together:**

1. **A repeatable delivery method** — how you run the project week-to-week with AI in the loop
2. **A development kit** (this repo) — what makes that method fast to execute

The kit provides:
- **Multiple surfaces** — Distinct experiences (marketing, app, docs, presentations) in one codebase
- **Component architecture** — Primitives, UI components, and composition patterns that scale
- **Design system** — Tokens, animations, and styling conventions ready to use
- **AI-ready documentation** — Every folder has context for AI agents to understand and extend

**Catalyst is the operating system for AI-enabled delivery** — it tells you what to do next, what decisions to capture, and how to move from proof to production safely.

### What Catalyst is NOT

- **Not "more process"** — it's less debate, less rework
- **Not "vibe coding"** — it's fast building with decisions captured and steerable
- **Not "a template you outgrow"** — it's a path from early proof to production

---

## Two Ways to Use Catalyst

- **DIY:** Use this kit + methodology to run your own project
- **Managed:** Work with RIVER Group to run Catalyst with you

These docs are written for the **DIY Catalyst dev** — but they're built to be enterprise-grade and trustworthy.

---

## Core Philosophy

### 1. Clarity Over Cleverness

Code should be obvious. Avoid:
- Over-abstraction ("I might need this flexibility someday")
- Implicit behaviour (magic that only works if you know the trick)
- Clever one-liners that require comments to explain

**Instead:** Write boring, readable code. If a pattern needs documentation to understand, simplify the pattern.

### 2. Convention Over Configuration

Decisions are made for you. Not because there's one right answer, but because:
- Decision fatigue slows you down
- Consistency across the codebase matters more than local preferences
- AI agents work better with predictable patterns

**The conventions are documented.** If you understand why a convention exists, you can break it intentionally. If you don't understand it, follow it.

### 3. Colocation Over Separation

Things that change together should live together:
- Surface CSS lives with the surface, not in a global `styles/` folder
- Surface shells live with the surface, not in a global `components/` folder
- Surface-specific components live in `_surface/`, not scattered across shared folders

**Why:** When you delete a surface, you delete one folder. No hunting for orphaned CSS, no removing imports from shared files.

### 4. Composition Over Inheritance

Build complex things from simple things:
- Shells compose layout primitives (Shell, Sidebar, Header)
- Shared components compose primitives and UI components
- Pages compose shells, shared components, and inline elements

**Why:** Composition is explicit. You can see exactly what a component does by reading its render function.

### 5. Primitives First

Before writing raw HTML with Tailwind classes:
1. Check if a primitive exists (`Stack`, `Row`, `Grid`, `Text`, `Title`)
2. Check if a UI component exists (`Button`, `Input`, `Dialog`)
3. Check if a shared component exists (`LabelValue`, `StatCard`)
4. Only then write raw elements

**Why:** Primitives encode layout patterns. Using `Stack` instead of `flex flex-col` means:
- Consistent gap tokens across the codebase
- One place to change if the pattern evolves
- AI agents understand the intent, not just the implementation

---

## The Delivery Journey

Catalyst provides a clear path from idea to production. You don't build everything at once — you prove value through repeated cycles, then advance when ready.

### The Delivery Loop

Every feature follows this rhythm:

| # | Phase | What Happens |
|---|-------|--------------|
| 1 | **Brief** | Define what you're building and why |
| 2 | **Build** | Ship working software |
| 3 | **Review** | Get feedback on the real thing |
| 4 | **Refine** | Decide what changes, update the brief |

After Refine, loop back to Brief. After several successful cycles, **Advance** to the next stage.

### Stages (Where You Are)

| Stage | Human Name | What "Good" Looks Like |
|-------|------------|------------------------|
| **POC** | Proof | Validate the idea works. Rough is fine. |
| **MVP** | Early Product | Real users, real data. Core flows work. |
| **MMP** | Market Ready | Ready for paying customers. Polished. |
| **PROD** | Production | Enterprise-ready. Fully hardened. |

### What Happens When You Advance?

**POC → MVP (Proof to Early Product)**
- Add real authentication
- Replace mock data with real database
- Add basic error handling and loading states
- Make core flows work end-to-end

**MVP → MMP (Early Product to Market Ready)**
- Polish the UI/UX
- Add monitoring and error tracking
- Harden security
- Prepare for paying customers

**MMP → PROD (Market Ready to Production)**
- Full production infrastructure
- Compliance and governance
- Support and operations readiness
- Enterprise hardening

**Key principle:** Advancing is a deliberate choice, not an accident. Each stage has different expectations — don't overbuild early, and don't underbuild late.

### Two Ways to Start

- **Proof-first:** Clone the kit, build the proof quickly, discover as you go (when scope is tight)
- **Intent-first:** Start with Vision/Architecture/PRD, get aligned, then build (when clarity is needed)

Both are valid. The guardrails and promotion path stay the same.

---

## Architecture Overview

### Surfaces

The app is organised into **surfaces** — distinct experiences with their own layout, styling, and purpose.

| Surface | Audience | Layout | Purpose |
|---------|----------|--------|---------|
| `(web)` | Visitors | Header + content | Marketing, landing pages |
| `(app)` | Users | Sidebar + header | Authenticated application |
| `(docs)` | Developers | Sidebar + accordion | Documentation |
| `(present)` | Stakeholders | Full-screen slides | Presentations |

Each surface is self-contained:
```
app/(surface)/
├── SURFACE.md      # Documentation
├── surface.css     # Styles
├── layout.tsx      # Shell wrapper
└── _surface/       # Shell + components
```

**Delete the folder → delete the surface.** No cleanup elsewhere.

### Shells

Shells are the layout wrappers for surfaces. They compose layout primitives (`Shell`, `Sidebar`, `Header`) into a complete page structure.

```tsx
// Shells use compound component pattern
<Shell>
  <Shell.Sidebar>...</Shell.Sidebar>
  <Shell.Header>...</Shell.Header>
  <Shell.Content>...</Shell.Content>
</Shell>
```

Layout primitives live in `components/layout/`. Composed shells live with their surfaces in `_surface/`.

### Components

Components are organised by **how they're used**, not what they're made of:

| Folder | Purpose | Examples |
|--------|---------|----------|
| `primitives/` | Layout & typography building blocks | `Stack`, `Row`, `Text`, `Title` |
| `ui/` | Interactive elements (shadcn) | `Button`, `Dialog`, `Input` |
| `shared/` | Composed, project-specific | `LabelValue`, `StatCard` |
| `vendor/` | Third-party wrappers | Calendar, DataTable |
| `layout/` | Shell building blocks | `Shell`, `Sidebar`, `Header` |

**Decision flow:**
1. Need layout? → Use primitive
2. Need UI element? → Check `ui/`, install from shadcn if missing
3. Need composed component? → Check `shared/`, create if missing
4. One-off for a page? → Inline it

### Styling

Styling uses a layered approach:

1. **Design tokens** (`design/shared.css`) — CSS variables for colors, spacing, radii
2. **Tailwind utilities** — For one-off styling, responsive breakpoints
3. **Custom CSS** — For complex animations, surface-specific styles

**Tokens over values.** Use `bg-primary` not `bg-blue-500`. Use `gap-md` not `gap-4`.

---

## Key Decisions Explained

### Why Next.js App Router?

- **Server components by default** — Less JavaScript shipped to client
- **Route groups** — Organise surfaces without affecting URLs
- **Layouts** — Surfaces get their own persistent layout
- **Modern React patterns** — Suspense, streaming, server actions

### Why shadcn/ui?

- **Own your components** — Code lives in your repo, not `node_modules`
- **Copy, don't abstract** — Each component is a starting point, not a dependency
- **Upgrade deliberately** — Check diff, apply changes you want
- **base-ui foundation** — Modern, accessible primitives

### Why separate surfaces?

- **Different audiences have different needs** — A marketing page shouldn't feel like a dashboard
- **Isolation simplifies maintenance** — Change docs styling without touching app styling
- **Easy to add/remove** — New surface = new folder. Remove surface = delete folder.

### Why primitives?

- **Encode patterns, not just styles** — `Stack` means "vertical container with consistent gaps"
- **AI-readable intent** — Agents understand layout intent, can generate correct code
- **Single source of truth** — Change `gap-md` token, all Stacks update

### Why colocate CSS?

- **No orphaned styles** — Delete surface, delete its CSS
- **Clear ownership** — `app.css` only affects the app surface
- **Import order control** — Layout imports surface CSS after shared CSS

### Why `_surface/` folders?

- **Private by default** — Next.js ignores `_` prefixed folders for routing
- **Colocation without conflicts** — Shell lives with surface, doesn't become a route
- **Clear boundary** — Everything in `_surface/` is surface-specific

---

## AI-Native Design

Catalyst is designed for AI-assisted development:

### Documentation at every level
- `AGENTS.md` — Entry point for AI agents
- `catalyst/*.md` — Framework concepts and patterns
- Folder `README.md` files — Local context for specific areas

### Predictable patterns
- Same structure for every surface
- Same component organisation across the codebase
- Consistent naming conventions

### Explicit composition
- No magic, no hidden behaviour
- Read the code to understand what happens
- AI can trace the flow without special knowledge

### Clear boundaries
- Surfaces are isolated
- Components are categorised
- CSS scope is explicit

---

## Quick Reference

### File Structure

```
app/                    # Routes and surfaces
├── (web)/              # Marketing surface
├── (app)/              # Application surface
├── (docs)/             # Documentation surface
├── (present)/          # Presentations surface
└── api/                # API routes

catalyst/               # Framework documentation
├── CATALYST.md         # This file (overview)
├── GLOSSARY.md         # Terminology
├── PATTERNS.md         # CSS/layout patterns
└── SURFACES.md         # Surface management

components/             # Shared components
├── primitives/         # Layout & typography
├── ui/                 # Interactive elements
├── shared/             # Composed components
├── vendor/             # Third-party wrappers
└── layout/             # Shell building blocks

design/                 # Shared styles only
lib/                    # Utilities & config
```

### Key Files

| File | Purpose |
|------|---------|
| `AGENTS.md` | AI agent entry point |
| `lib/config.ts` | App configuration |
| `lib/navigation.ts` | Navigation items |
| `design/shared.css` | Design tokens |

### Adding Things

| Want to add... | Do this |
|----------------|---------|
| New surface | See `catalyst/SURFACES.md` |
| New UI component | `npx shadcn@latest add <name>` |
| New shared component | Create in `components/shared/` |
| New navigation item | Edit `lib/navigation.ts` |
| New design token | Edit `design/shared.css` |

---

## Related Docs

| Doc | Purpose |
|-----|---------|
| `AGENTS.md` | AI agent conventions, important callouts |
| `catalyst/GLOSSARY.md` | Terminology and naming |
| `catalyst/SURFACES.md` | Creating and managing surfaces |
| `catalyst/PATTERNS.md` | CSS and layout patterns |
| `components/COMPONENTS.md` | Component decision flow |
| `design/DESIGN.md` | Styling and tokens |

