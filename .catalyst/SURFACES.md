# Catalyst Surfaces

How to create, configure, and delete surfaces.

---

## What is a Surface?

A **surface** is a distinct experience within your application — different audiences need different layouts, navigation, and interaction patterns.

**In plain terms:** Your platform might have a marketing site for visitors, a dashboard for users, documentation for developers, and presentations for stakeholders. Each is a surface with its own layout but sharing the same design system.

| Surface | Who It's For | What It Looks Like | URL |
|---------|--------------|-------------------|-----|
| `(web)` | Visitors | Header + content | `/` |
| `(app)` | Users | Sidebar + header | `/app` |
| `(docs)` | Developers | Sidebar + accordion | `/docs` |
| `(examples)` | Developers, AI | Reference pages | `/examples` |
| `(present)` | Stakeholders | Full-screen slides | `/present` |
| `(auth)` | Users | Centered forms | `/auth` |

**Key principle:** Each surface is completely self-contained. Delete the folder → delete the entire surface.

---

## Surface Anatomy

Every surface follows the same structure:

```
app/(surface-name)/
├── SURFACE.md          # Documentation for this surface
├── surface.css         # Surface-specific styles
├── layout.tsx          # Imports shell and CSS
├── _surface/           # Private folder (not routed)
│   ├── surface-shell.tsx
│   └── (other components)
└── routes/             # Actual route folders
    └── page.tsx
```

**Why `_surface/`?** Next.js ignores folders starting with `_` for routing. This lets us colocate surface-specific code without creating unwanted routes.

---

## Current Surfaces

### (web) — Marketing

Public-facing pages for visitors. Header + full-width content, no sidebar.

- **Shell:** `WebShell` in `_surface/web-shell.tsx`
- **CSS:** `web.css`
- **Nav:** `webNavItems` in `lib/navigation.ts`
- **Routes:** `/` (landing page)

### (app) — Application

Authenticated dashboard for users. Sidebar + header layout.

- **Shell:** `AppShell` in `_surface/app-shell.tsx`
- **CSS:** `app.css`
- **Nav:** `appNavItems` in `lib/navigation.ts`
- **Routes:** `/app`, `/demo`

### (docs) — Documentation

Reference docs for developers. Sidebar + accordion navigation.

- **Shell:** `DocsShell` in `_surface/docs-shell.tsx`
- **CSS:** `docs.css`
- **Nav:** `docsNavItems` in `lib/navigation.ts`
- **Routes:** `/docs/*`

### (examples) — Reference Implementations

Full-page example pages showcasing what Catalyst can build. Copyable patterns for developers and AI.

- **Shell:** `ExamplesShell` in `_surface/examples-shell.tsx`
- **CSS:** `examples.css`
- **Nav:** `examplesNavItems` in `lib/navigation.ts`
- **Routes:** `/examples`, `/examples/dashboard`, etc.

### (present) — Presentations

Slide decks for stakeholders. Full-screen slides with navigation.

- **Shell:** `SlidesShell` in `_surface/slides-shell.tsx`
- **CSS:** `present.css`
- **Components:** `_surface/` contains slide primitives
- **Routes:** `/present/*`

---

## Creating a New Surface

### Step 1: Create folder structure

```
app/(new-surface)/
├── NEW.md              # Document the surface
├── new.css             # Surface styles (can be empty)
├── layout.tsx          # Shell wrapper
└── _surface/
    └── new-shell.tsx   # Shell component
```

### Step 2: Create the shell

```tsx
// app/(new-surface)/_surface/new-shell.tsx

/**
 * CATALYST - New Surface Shell
 */

import { Shell } from "@/components/layout/shell"

export function NewShell({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <Shell.Content>{children}</Shell.Content>
    </Shell>
  )
}
```

### Step 3: Create the layout

```tsx
// app/(new-surface)/layout.tsx

import "@/design/shared.css"
import "./new.css"
import { NewShell } from "./_surface/new-shell"

export default function NewLayout({ children }: { children: React.ReactNode }) {
  return <NewShell>{children}</NewShell>
}
```

### Step 4: Create surface docs

```markdown
# NEW Surface

Brief description of this surface.

---

## Overview

| Property | Value |
|----------|-------|
| Route Group | `(new-surface)` |
| Shell | `NewShell` |
| CSS | `new.css` |
| URL Prefix | `/new` |

## Deleting This Surface

1. Delete this folder: `app/(new-surface)/`
2. Update navigation: Remove nav items from `lib/navigation.ts`
3. Update links: Remove references from other surfaces
```

### Step 5: Add navigation (if needed)

```tsx
// lib/navigation.ts

export const newNavItems: NavItem[] = [
  { title: "Home", href: "/new" },
  // ...
]
```

### Step 6: Add routes

```
app/(new-surface)/
├── layout.tsx
└── new/              # /new route
    └── page.tsx
```

---

## Deleting a Surface

Because surfaces are self-contained, deletion is straightforward:

### 1. Delete the folder

```bash
rm -rf app/(surface-name)
```

### 2. Clean up navigation

Remove the surface's nav items from `lib/navigation.ts`.

### 3. Update references

Search for links to the surface's routes and update/remove them.

### 4. That's it

No CSS files in `design/`, no scattered components to hunt down. The surface is gone.

---

## Surface Isolation Checklist

When creating or modifying a surface, ensure:

- [ ] **CSS is colocated** — `surface.css` lives in the surface folder, not `design/`
- [ ] **Shell is colocated** — `surface-shell.tsx` lives in `_surface/`, not `components/layout/`
- [ ] **Components are colocated** — Surface-specific components go in `_surface/`
- [ ] **Nav is documented** — Surface docs mention which nav array to edit
- [ ] **Deletion is documented** — Surface docs include deletion checklist

---

## Related Docs

| Doc | Purpose |
|-----|---------|
| `.catalyst/CATALYST.md` | Framework overview and philosophy |
| `.catalyst/GLOSSARY.md` | Terminology definitions |
| `components/COMPONENTS.md` | Component patterns |

---

## Surface Documentation Guide (For AI)

This section defines how to create and maintain documentation pages for surfaces. The goal is docs that serve **stakeholders and catalyst devs first**, with technical details available but not prominent.

### Audience Hierarchy

Every surface doc page should be written for this priority order:

1. **Stakeholders** — Non-technical decision makers. Need to understand *what* and *why*.
2. **Catalyst devs** — AI-first developers. Describe what to ask AI, not how to code it.
3. **Technical devs** — Need implementation details. Put these in collapsible sections.

### Documentation Location

Surface documentation lives in two places:

| Location | Purpose | Audience |
|----------|---------|----------|
| `app/(surface)/SURFACE.md` | Quick reference for AI | AI agents |
| `app/(docs)/docs/surfaces/[surface]/` | Full documentation pages | Humans |

The `.md` file is for AI context. The `/docs/surfaces/` pages are for humans browsing documentation.

### Tab Structure

Each surface documentation page uses 5 tabs:

| Tab | Purpose | Focus |
|-----|---------|-------|
| **Overview** | What is this surface, why does it exist | Stakeholder-first |
| **Design** | Visual patterns, component examples | Live showcase |
| **Develop** | How to build/add to this surface | AI prompts first |
| **Layout** | How the shell/navigation works | AI prompts first |
| **Removal** | How to delete this surface | AI prompts first |

### File Structure

```
app/(docs)/docs/surfaces/[surface]/
├── page.tsx              # Main page with tabs
└── _tabs/
    ├── overview-tab.tsx
    ├── design-tab.tsx
    ├── extending-tab.tsx   # "Develop" tab
    ├── shell-tab.tsx       # "Layout" tab
    └── removing-tab.tsx    # "Removal" tab
```

### Writing Principles

#### Summary Cards (Blue Left-Border)

Every tab opens with a summary card using this pattern:

```tsx
<div className="border-primary bg-primary/5 rounded-lg border-l-4 p-5 space-y-3">
  <p className="text-lg font-medium leading-snug">
    [One-line summary of what this tab covers]
  </p>
  <p className="text-muted-foreground leading-relaxed">
    [2-3 sentences expanding on the summary. Written for stakeholders.]
  </p>
</div>
```

#### Task Cards (For Develop/Layout/Removal tabs)

Use TaskCard components for actionable guidance:

```
┌─────────────────────────────────────────┐
│ [Icon] Task title                        │ ← Header with muted bg
├─────────────────────────────────────────┤
│ ✨ ASK AI                                │
│ "Plain language description of task"     │ ← What to ask AI
├─────────────────────────────────────────┤
│ Brief description of what happens.       │ ← Context
│                                          │
│ ✓ Key point one                          │
│ ✓ Key point two                          │ ← What to know
│ ✓ Key point three                        │
├─────────────────────────────────────────┤
│ FILES INVOLVED                           │
│ path/to/file.tsx — Description           │ ← Reference
├─────────────────────────────────────────┤
│ ▶ Technical details                      │ ← Collapsible
│   [Code examples when expanded]          │
└─────────────────────────────────────────┘
```

#### AI Prompt Boxes

Highlight what to ask AI with this pattern:

```tsx
<div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
  <Row gap="sm" className="items-start">
    <SparklesIcon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
    <div>
      <Text size="xs" variant="muted" className="uppercase tracking-wide">Ask AI</Text>
      <Text size="sm" className="mt-0.5">"[Natural language prompt]"</Text>
    </div>
  </Row>
</div>
```

#### Technical Details (Collapsible)

Always put code examples in collapsible sections:

```tsx
<details className="border-t pt-4 group">
  <summary className="text-sm font-medium cursor-pointer hover:text-primary transition-colors">
    Technical details
  </summary>
  <div className="bg-muted/50 overflow-x-auto rounded-md p-4 mt-3">
    <pre className="text-xs leading-relaxed">{code}</pre>
  </div>
</details>
```

### Tab-Specific Guidelines

#### Overview Tab

- Opens with blue summary card explaining what the surface is
- "What You Get" section with feature cards (icon, title, description)
- "When to Use It" with clear use cases
- Keep technical jargon minimal
- Focus on value proposition

#### Design Tab

- Opens with blue summary card containing design principles
- Include Do/Don't guidelines inside the summary card
- Below: Live showcase of actual components as they'd appear in the surface
- No "Component Name" labels — show real section titles like "Analytics", "Settings"
- Include variety: cards, tables, forms, lists, tabs, prose content

#### Develop Tab

- Opens with blue summary card about building in this surface
- "Working with AI" section with example prompts
- Task cards for: Add a page, Add to navigation, Page layouts, Loading states, Using components
- Each task shows the AI prompt first, technical details collapsed

#### Layout Tab

- Opens with blue summary card about understanding the layout
- Visual diagram showing sidebar/header/content areas
- Task cards for: Customize sidebar, Customize header, Add custom styles
- Authentication section (if relevant)
- Quick reference with key files

#### Removal Tab

- Opens with blue summary card explaining surfaces are self-contained
- Warning box about things to check before deletion
- Task cards for: Delete the surface, Clean up navigation, Update auth redirects
- Verification checklist
- AI prompt for checking remaining references

### Component Patterns

Use these components consistently:

| Component | When to Use |
|-----------|-------------|
| `Stack`, `Row` | All layout |
| `Text`, `Title` | All typography |
| `Card` | Grouping content sections |
| `CheckCircle2Icon` (emerald) | Checkmarks / benefits |
| `SparklesIcon` (primary) | AI prompt boxes |
| `AlertTriangleIcon` (amber) | Warnings |

### Terminology

Use accessible language:

| Instead of | Say |
|------------|-----|
| Route | Page |
| Component | Element, section, or specific name |
| Props | Settings, options |
| Shell | Layout |
| Middleware | (avoid, or say "automatic protection") |
| API | (be specific about what it does) |

### Example Prompts for AI

When documenting a surface, AI should generate prompts like:

- "Add a new [Page Name] page to the [surface] surface"
- "Add a link to [Page Name] in the sidebar navigation"
- "Create a [feature] section with [components]"
- "Show a loading state while data is fetching"
- "Remove the [surface] surface from my project"

### Quality Checklist

When creating or reviewing surface documentation:

- [ ] Summary card in blue left-border style on every tab
- [ ] AI prompts shown before technical details
- [ ] Code examples in collapsible sections
- [ ] Uses Stack/Row/Text/Title core components
- [ ] Terminology is accessible (page not route, etc.)
- [ ] Live examples in Design tab (not labeled wireframes)
- [ ] Task cards follow the standard structure
- [ ] Quick reference section with key files and common asks

