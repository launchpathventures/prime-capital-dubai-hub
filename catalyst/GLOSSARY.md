# CATALYST - Glossary

Terminology and naming conventions for the Catalyst codebase. This glossary uses **human-first language** — plain terms that anyone can understand, with Catalyst-specific terminology introduced second.

---

## Delivery Workflow

### Delivery Loop (What You Do Repeatedly)

Every feature, every sprint, every major update follows this rhythm. You cycle through these **delivery phases** many times at each stage. Each phase has a natural checkpoint — a moment to confirm you're ready to move on.

| # | Delivery Phase | Purpose | Checkpoint Question |
|---|----------------|---------|---------------------|
| 1 | **Brief** | Define what you're building and why | Is intent clear enough to build? |
| 2 | **Build** | Ship working software | Is it ready to show people? |
| 3 | **Review** | Get feedback on the real thing | Do we understand what needs to change? |
| 4 | **Refine** | Decide what changes | Loop again, or advance? |

After Refine, you typically loop back to Brief for the next cycle. After several successful cycles, when the work is validated and solid, you **Advance** to the next stage. Advancing is a deliberate decision — not automatic.

### Delivery Stages (Where You Are)

Stages describe product maturity. Each stage has different expectations for what "good" looks like.

| Human Name | Catalyst Term | What "Good" Looks Like |
|------------|---------------|------------------------|
| **Proof** | POC (Proof of Concept) | Validate the idea works. Rough is fine. |
| **Early Product** | MVP (Minimum Viable Product) | Real users, real data. Core flows work. |
| **Market Ready** | MMP (Minimum Marketable Product) | Ready for paying customers. Polished. |
| **Production** | PROD | Enterprise-ready. Fully hardened. |

**Key principle:** POC quality isn't MVP quality. MVP isn't production. Advancement is a deliberate choice, not an accident.

### Stacks

How you configure the kit based on your project's complexity. Choose the stack that fits your needs.

| Stack | Also Called | Best For | What It Includes |
|-------|-------------|----------|------------------|
| **Simple** | Static | Landing pages, marketing sites | No database, no auth |
| **Supabase** | Full-stack light | Apps with auth + database | Supabase auth + Postgres |
| **Laravel** | Full-stack custom | Complex backends, enterprise | Custom API, flexible auth |

**Note:** You can start with Simple and add Supabase later — the kit is designed to grow with your project.

---

## Development Kit

The following terms describe how the Catalyst development kit is structured. If you're a delivery lead focused on methodology, you can skim this section. If you're building, this is essential.

### Foundations

Basic web development terms you'll encounter constantly.

| Term | Meaning |
|------|---------|
| **Route** | A URL path that displays a page. `/docs/core/glossary` shows the glossary page. |
| **Page** | The content shown at a specific URL. Each route has a `page.tsx` file. |
| **Layout** | Shared structure that wraps multiple pages — header, sidebar, footer. Stays consistent as you navigate. |
| **Environment** | Where code runs: Development (your computer), Preview (test URL), Production (live site). |
| **Config** | Central settings file (`lib/config.ts`). App name, feature flags, external links — all in one place. |

### Surface

A distinct area of the application with its own layout, purpose, and URL structure. Each surface provides a different *experience* for its audience.

| Surface | Shell | Audience | Purpose |
|---------|-------|----------|---------|
| `(web)` | WebShell | Visitors | Marketing, public pages |
| `(app)` | AppShell | Users | Authenticated application |
| `(docs)` | DocsShell | Developers | Documentation, reference |
| `(present)` | SlidesShell | Stakeholders | Presentations, pitches |

**For non-developers:** "The platform has four distinct experiences — marketing for visitors, the app for users, documentation for reference, and presentations for pitches. Each has its own layout but shares the same design system."

### Shell

The layout wrapper component for a surface. Composes layout primitives (Shell, Sidebar, Header) into a complete page structure. Shells are colocated with their surface in `_surface/`.

```
app/(web)/_surface/web-shell.tsx       → WebShell
app/(app)/_surface/app-shell.tsx       → AppShell
app/(docs)/_surface/docs-shell.tsx     → DocsShell
app/(present)/_surface/slides-shell.tsx → SlidesShell
```

### Slot

A named area within a component where content is placed. Uses the compound component pattern for explicit composition.

```tsx
<Shell>
  <Shell.Sidebar>...</Shell.Sidebar>   {/* Slot: sidebar */}
  <Shell.Header>...</Shell.Header>     {/* Slot: header */}
  <Shell.Content>...</Shell.Content>   {/* Slot: content */}
</Shell>
```

---

## Components

### Core Component

Catalyst's foundational building blocks for layout, typography, and visual elements. Found in `components/core/`.

| Category | Components |
|----------|------------|
| Layout | `Stack`, `Row`, `Grid`, `Container`, `Section` |
| Typography | `Text`, `Title` |
| Visual | `Dot`, `Avatar`, `Count` |

### UI Component

Reusable interaction component from shadcn/base-ui. Found in `components/ui/`. Install more with `npx shadcn@latest add <name>`.

Examples: `Button`, `Dialog`, `Input`, `Tabs`, `Tooltip`

### Shared Component

Project-specific component composed from Core and UI components. Found in `components/shared/`.

Examples: `LabelValue`, `StatCard`, `ThemeToggle`

### Vendor Component

Third-party package wrapped and styled for the project. Found in `components/vendor/`.

Examples: Calendar, DataTable, Rich Text Editor

---

## Styling

### Token

Design system value defined as a CSS variable. Tokens ensure consistency and enable theming.

| Type | Examples |
|------|----------|
| Color | `--primary`, `--muted`, `--destructive` |
| Spacing | `--spacing-sm`, `--spacing-md`, `--spacing-lg` |
| Radius | `--radius`, `--radius-sm`, `--radius-lg` |

### Variant

Predefined style option for a component. Keeps styling consistent and reduces custom classes.

```tsx
<Button variant="ghost" size="icon">     {/* Variant: ghost, Size: icon */}
<Text variant="muted">                   {/* Variant: muted */}
<Badge variant="secondary">              {/* Variant: secondary */}
```

---

## Folder Conventions

| Pattern | Meaning | Example |
|---------|---------|---------|
| `(name)/` | Route group — no URL segment | `(app)/`, `(web)/` |
| `_name/` | Private folder — ignored by routing | `_surface/` |
| `YYYYMMDD-slug/` | Date-prefixed — natural sort order | `20251231-catalyst-example/` |

### Why `_surface/`?

Next.js treats folders starting with `_` as private — they won't become routes. This lets us colocate all surface-specific code (shell, components, utils) without routing conflicts.

```
app/(app)/
├── APP.md               # Surface documentation
├── app.css              # Surface styles
├── layout.tsx           # Route: uses AppShell
├── _surface/            # Private: not a route
│   └── app-shell.tsx    # Colocated shell
└── app/                 # Route: /app
    └── page.tsx
```

---

## Composition Patterns

### Compound Components

Components with sub-components attached as properties. Provides explicit, readable composition.

```tsx
// Compound pattern
<Shell>
  <Shell.Sidebar>...</Shell.Sidebar>
  <Shell.Content>...</Shell.Content>
</Shell>

// vs. implicit (harder to read)
<Shell sidebar={<div>...</div>} content={<div>...</div>} />
```

### Render Prop (base-ui pattern)

For composition with UI primitives, use the `render` prop instead of Radix's `asChild`.

```tsx
// ✅ base-ui pattern
<TooltipTrigger render={<Button>Hover me</Button>} />

// ❌ Radix pattern (not used in this codebase)
<TooltipTrigger asChild>
  <Button>Hover me</Button>
</TooltipTrigger>
```

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| `AGENTS.md` | Entry point, conventions, structure |
| `catalyst/CATALYST.md` | Framework overview and philosophy |
| `catalyst/SURFACES.md` | Creating and managing surfaces |
| `catalyst/PATTERNS.md` | Layout patterns, CSS fixes |
| `components/COMPONENTS.md` | Component decision flow, folder rules |
| `design/DESIGN.md` | Styling, tokens, animations |
| `lib/HELPERS.md` | Utilities, hooks, scroll helpers |
