
# CATALYST - Design System

This document describes the design architecture, CSS conventions, and visual patterns for Catalyst projects.

---

## Overview

Catalyst uses a **layered design architecture** that separates concerns:

1. **Tokens** (`app/globals.css`) — Core design tokens, always loaded
2. **Animations** (`design/animate.css`) — Reusable animation keyframes and classes
3. **Helpers** (`design/helpers.css`) — Overflow, scroll, and interaction utilities
4. **Context CSS** (`design/*.css`) — Context-specific styles, loaded per route group

---

## Folder Structure

```
design/                     # SHARED styles only
├── DESIGN.md               # This file — design system documentation
├── shared.css              # Design tokens, shared component styles
├── animate.css             # Animation keyframes and classes
├── helpers.css             # Overflow, scroll, a11y, loading utilities
└── print.css               # Print media styles and page breaks

app/
├── globals.css             # Tailwind imports + base reset (Next.js convention)
├── (web)/web.css           # Marketing surface styles
├── (app)/app.css           # Dashboard surface styles
├── (docs)/docs.css         # Documentation surface styles (prose)
└── (present)/present.css   # Presentation surface styles
```

---

## File Reference

| File | Purpose | Imported By | Safe to Delete? |
|------|---------|-------------|-----------------|
| `app/globals.css` | Tailwind, tokens, base reset | Root layout | ❌ Never |
| `design/shared.css` | Shared component styles | Root layout | ⚠️ Core styles |
| `design/animate.css` | Animation keyframes and classes | Root layout | ❌ Core utility |
| `design/helpers.css` | Overflow, scroll, a11y, loading | Root layout | ❌ Core utility |
| `design/print.css` | Print styles, page breaks | Root layout | ✅ If no print needed |
| `app/(web)/web.css` | Marketing effects | Web layout | ✅ Deletes with surface |
| `app/(app)/app.css` | Dashboard/app styles | App layout | ✅ Deletes with surface |
| `app/(docs)/docs.css` | Prose/content styling | Docs layout | ✅ Deletes with surface |
| `app/(present)/present.css` | Presentation layout | Present layout | ✅ Deletes with surface |

---

## Import Hierarchy

```tsx
// app/layout.tsx (root — always loaded)
import "./globals.css"
import "@/design/animate.css"
import "@/design/helpers.css"
import "@/design/print.css"
import "@/design/shared.css"

// app/(web)/layout.tsx (marketing pages)
import "./web.css"

// app/(app)/layout.tsx (authenticated app)
import "./app.css"

// app/(docs)/layout.tsx (documentation)
import "./docs.css"

// app/(present)/layout.tsx (presentations)
import "./present.css"

// Presentation-specific (colocated with presentation)
// app/(present)/present/YYYYMMDD-deck/page.css
```

---

## Design Principles

### 1. Component Styling: CSS + Tailwind Hybrid

Catalyst uses a **two-layer styling approach** for components:

| Layer | Location | Cascade | Purpose |
|-------|----------|---------|----------|
| **Base CSS** | `design/components/*.css` | `@layer components` | Structural styles, focus/disabled states, transitions |
| **Tailwind** | Component file (CVA) | `@layer utilities` | Colors, spacing, sizing, hover states |

**Why @layer?** CSS layers determine cascade order regardless of source order. Since `@layer utilities` comes after `@layer components`, Tailwind utilities always override base CSS — no specificity hacks needed.

**Why this split?**
- Base CSS handles styles that are **always the same** (display, cursor, transitions)
- Tailwind handles styles that **vary by instance** or need overrides
- `:where()` ensures Tailwind classes **always win** when overriding

### 2. What Goes Where — Decision Guide

**Put in Base CSS (`design/components/*.css`):**

| Category | Examples | Why CSS |
|----------|----------|---------|
| Display/position | `display: inline-flex`, `position: relative` | Structural, rarely overridden |
| Cursor | `cursor: pointer`, `cursor: not-allowed` | Behavioral |
| Transitions | `transition: color 150ms ease-out` | Uses design tokens |
| Focus states | `box-shadow: 0 0 0 3px ...` | Complex selector, consistent |
| Disabled states | `opacity: var(--opacity-disabled)` | Uses design tokens |
| SVG children | `& > svg { pointer-events: none }` | Verbose in Tailwind |
| Typography base | `font-weight: 500` | If consistent across variants |

**Keep in Tailwind (CVA/className):**

| Category | Examples | Why Tailwind |
|----------|----------|--------------|
| Colors | `bg-primary`, `text-foreground` | Vary by variant, easy override |
| Hover colors | `hover:bg-primary/80` | State + color in one |
| Spacing | `h-9`, `px-2.5`, `gap-1.5` | Vary by size, easy override |
| Borders | `border`, `border-border` | Often need instance override |
| Shadows | `shadow-xs` | Tailwind scale works well |
| Radius | `rounded-md` | Vary by size/variant |
| Responsive | `md:flex`, `lg:p-6` | Tailwind excels here |

### 3. BEM Naming Convention

Components use BEM-style classes for identification and CSS targeting:

| Type | Pattern | Example |
|------|---------|---------|
| Block | `.{namespace}-{component}` | `.ui-button`, `.core-stack` |
| Modifier | `.{block}--{modifier}` | `.ui-button--primary`, `.label-value--vertical` |
| Element | `.{block}__{element}` | `.ui-card__header`, `.dev-card__footer` |

**Namespaces by folder:**

| Folder | Prefix Style | Examples |
|--------|--------------|----------|
| `core/` | `core-` | `core-stack`, `core-text`, `core-avatar` |
| `ui/` | `ui-` | `ui-button`, `ui-card`, `ui-tabs__list` |
| `layout/` | `layout-` | `layout-shell`, `layout-sidebar`, `layout-header` |
| `shared/` | semantic | `dev-card`, `stat-card`, `label-value`, `user-menu` |
| `vendor/` | semantic | `chart`, `chart-area`, `sortable-item`, `drag-handle` |
| `_surface/` | surface name | `web-shell`, `app-shell`, `docs-shell` |

**Key principle:** For shared/vendor/surface components, the prefix identifies the component family or domain, not the folder location.

### 4. CSS Uses `@layer components` + `:where()` for Zero Specificity

All component base CSS uses **both** `@layer components` and `:where()` wrappers. Together they guarantee Tailwind always wins:

| Mechanism | What it does |
|-----------|--------------|
| `@layer components` | Controls **cascade order** — utilities come after |
| `:where()` | Sets **zero specificity** (0,0,0) |
| Together | Tailwind ALWAYS overrides, regardless of selector complexity |

```css
/* design/components/ui.css */
@layer components {
  :where(.ui-button) {
    display: inline-flex;
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: color var(--duration-fast) var(--ease-out);
  }
  
  :where(.ui-button:focus-visible) {
    box-shadow: 0 0 0 var(--ring-width) oklch(from var(--color-ring) l c h / 0.5);
  }
}

/* Instance override works naturally */
<Button className="cursor-wait rounded-full" />  /* Tailwind wins */
```

**Critical rules:**
- `@keyframes` must be declared OUTSIDE `@layer` blocks — CSS parsers don't allow keyframes inside layers
- `.dark` overrides must be OUTSIDE `@layer` — they need specificity to override base styles

```css
@layer components {
  :where(.ui-button) { /* base styles */ }
}

/* Outside @layer for proper specificity */
.dark .ui-button.ui-button--outline {
  border-color: var(--color-input);
}

/* Keyframes outside @layer */
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### 5. Design Tokens for Consistency

Use design tokens from `globals.css` in component CSS:

```css
@layer components {
  .ui-button {
    /* Structural tokens */
    border-width: var(--border-width);
    border-radius: var(--radius-md);
    
    /* Animation tokens */
    transition: 
      color var(--duration-fast) var(--ease-out),
      background-color var(--duration-fast) var(--ease-out);
  }

  .ui-button:disabled {
    opacity: var(--opacity-disabled);
  }

  .ui-button:focus-visible {
    box-shadow: 0 0 0 var(--ring-width) oklch(from var(--color-ring) l c h / 0.5);
  }
}
```

---

## Custom Component Overrides

When creating custom button styles (e.g., pill buttons, fancy CTAs), use Tailwind to override base CSS:

```tsx
// Custom pill button with shadow effects
<Button className="h-14 px-8 text-lg rounded-full border-0 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105">
  Get Started
</Button>
```

**Key patterns:**
- `border-0` — Remove base border for clean shadow effects
- `rounded-full` — Override base radius for pill shape
- `h-14 px-8` — Override base sizing for larger buttons
- `hover:scale-105` — Add transform effects (base CSS includes transform in transition)
```

---

## Component CSS Files

```
design/
├── components/
│   ├── _index.css      # Imports all component CSS
│   ├── ui.css          # Button, Card, Badge, Input, Dialog, etc.
│   ├── core.css        # Stack, Row, Grid, Text, Title, etc.
│   ├── layout.css      # Shell, Sidebar, Header
│   └── shared.css      # ThemeToggle, UserMenu, StatCard, etc.
```

Imported via `design/shared.css` → `globals.css` → always loaded.

---

## Tailwind First, CSS When Needed

**Use Tailwind for:**
- Spacing, sizing, typography
- Responsive breakpoints (`md:`, `lg:`)
- State variants (`hover:`, `focus:`, `dark:`)
- Layout utilities (`flex`, `grid`, `gap`)
- Colors and color variants

**Use Custom CSS for:**
- Complex `@keyframes` animations
- Pseudo-element tricks (`::before`, `::after`)
- Focus/disabled states with design tokens
- Transitions using design tokens
- Child element selectors (e.g., `& > svg`)

---

## Utility Quick Reference

### Accessibility (helpers.css)

| Class | Purpose |
|-------|---------|
| `.sr-only` | Visually hidden, screen reader accessible |
| `.sr-only-focusable` | sr-only that becomes visible on focus (skip links) |
| `.not-sr-only` | Reset sr-only (responsive patterns) |
| `.focus-ring` | Enhanced focus-visible ring |

### Print (print.css)

| Class | Purpose |
|-------|---------|
| `.print-only` | Only visible when printing |
| `.print-hidden` / `.no-print` | Hidden when printing |
| `.print-break-before` | Force page break before |
| `.print-break-after` | Force page break after |
| `.print-avoid-break` | Keep element together (no break inside) |
| `.print-bg` | Preserve background colors in print |

### Loading States (helpers.css)

| Class | Purpose |
|-------|---------|
| `.skeleton` | Shimmer loading placeholder |

### Text & Overflow (helpers.css)

| Class | Purpose |
|-------|---------|
| `.overflow-ellipsis` | Text ellipsis |
| `.truncate-2` / `.truncate-3` / `.truncate-4` | Multi-line clamp |
| `.no-select` | Prevent text selection |
| `.select-text` | Allow text selection |

### Scroll (helpers.css)

| Class | Purpose |
|-------|---------|
| `.hide-scrollbar` | Hide scrollbar, keep scroll |
| `.scroll-snap-x` | Horizontal scroll snap |
| `.scroll-snap-start` / `.scroll-snap-center` | Snap alignment |

### Aspect Ratios (helpers.css)

| Class | Purpose |
|-------|---------|
| `.aspect-4\/3` | 4:3 ratio |
| `.aspect-3\/2` | 3:2 ratio |
| `.aspect-21\/9` | Ultrawide 21:9 |
| `.aspect-9\/16` | Portrait video |

---

## Animation Classes

See [animate.css](animate.css) for full list. Key classes:

| Category | Classes |
|----------|---------|
| Entrance | `.animate-fade-in`, `.animate-slide-in-up`, `.animate-scale-in` |
| Exit | `.animate-fade-out`, `.animate-slide-out-down` |
| Continuous | `.animate-gradient-x`, `.animate-pulse-subtle`, `.animate-float` |
| Delay | `.animation-delay-100` through `.animation-delay-500` |

---

## Prose Styling

Use `.prose` on containers with rich text / CMS content:

```tsx
<article className="prose">
  <h1>Title</h1>
  <p>Content with <a href="#">links</a>.</p>
</article>
```

Variants: `.prose-sm`, `.prose-lg`, `.prose-invert` (dark bg)

---

### 2. Define in CSS, Apply like Tailwind

```css
/* design/helpers.css */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}
```

```tsx
// Usage — feels like a Tailwind utility
<div className="animate-fade-in-up delay-200">
```

### 3. Semantic Tokens Over Raw Values

```tsx
// ✅ Good — uses semantic token
<div className="bg-primary text-primary-foreground">

// ❌ Avoid — hardcoded color
<div className="bg-blue-500 text-white">
```

---

## Color System

### Two-Layer Architecture

1. **`:root`** in `globals.css` — Raw color scales (AI can regenerate)
2. **`@theme`** in `globals.css` — Semantic token mappings (stable)

### Brand Colors

| Scale | Hue | Usage |
|-------|-----|-------|
| `primary` | Blue (220) | CTAs, links, focus rings |
| `secondary` | Teal (180) | Accents, badges, secondary actions |
| `tertiary` | Purple (285) | Highlights, special features |

### Status Colors

| Token | Usage |
|-------|-------|
| `destructive` | Errors, destructive actions |
| `success` | Confirmations, positive states |
| `warning` | Cautions, pending states |
| `info` | Informational messages |

### Surface Colors

| Token | Usage |
|-------|-------|
| `background` | Page background |
| `foreground` | Primary text |
| `muted` | Subtle backgrounds |
| `muted-foreground` | Secondary text |
| `card` | Card backgrounds |
| `border` | Borders and dividers |

---

## CSS Variable Conventions

When writing custom CSS (surface styles, component overrides), use these patterns:

### Variable Naming

All semantic color tokens use the `--color-` prefix:

```css
/* ✅ Correct — use --color- prefix */
background: var(--color-background);
border-color: var(--color-border);
color: var(--color-primary);

/* ❌ Wrong — missing prefix */
background: var(--background);
border-color: var(--border);
```

### Color Functions (oklch)

Catalyst uses **oklch** color space, not hsl. For transparency or color manipulation:

```css
/* ✅ Correct — oklch relative color syntax */
background: oklch(from var(--color-primary) l c h / 0.1);
box-shadow: 0 4px 12px oklch(from var(--color-foreground) l c h / 0.05);

/* ❌ Wrong — hsl doesn't work with oklch values */
background: hsl(var(--color-primary) / 0.1);
```

### Spacing & Sizing

Use direct values or Tailwind classes — there are no `--spacing-*` variables:

```css
/* ✅ Correct — direct values */
padding: 1.5rem;
gap: 0.75rem;
border-radius: 1rem;

/* ❌ Wrong — these variables don't exist */
padding: var(--spacing-6);
border-radius: var(--radius-xl);
```

### Quick Reference

| Use This | Not This |
|----------|----------|
| `var(--color-background)` | `var(--background)` |
| `var(--color-primary)` | `var(--primary)` |
| `var(--color-muted-foreground)` | `var(--muted-foreground)` |
| `oklch(from var(--color-primary) l c h / 0.1)` | `hsl(var(--primary) / 0.1)` |
| `1.5rem`, `2rem` | `var(--spacing-6)`, `var(--spacing-8)` |
| `1rem`, `0.75rem` | `var(--radius-xl)`, `var(--radius-lg)` |

---

## Animation Utilities (animate.css)

### Entrance Animations

| Class | Effect |
|-------|--------|
| `.animate-fade-in` | Simple fade in |
| `.animate-fade-out` | Simple fade out |
| `.animate-fade-in-up` | Fade + slide up |
| `.animate-fade-in-down` | Fade + slide down |
| `.animate-fade-out-up` | Fade + slide up (exit) |
| `.animate-fade-out-down` | Fade + slide down (exit) |
| `.animate-slide-in-left` | Fade + slide from left |
| `.animate-slide-in-right` | Fade + slide from right |
| `.animate-slide-out-left` | Fade + slide to left (exit) |
| `.animate-slide-out-right` | Fade + slide to right (exit) |
| `.animate-scale-in` | Fade + scale up |
| `.animate-scale-out` | Fade + scale down (exit) |

Combine with Tailwind's delay utilities: `delay-100`, `delay-200`, etc.

### Continuous Animations

| Class | Effect |
|-------|--------|
| `.animate-gradient-x` | Shimmer for gradient text |
| `.animate-pulse-subtle` | Gentle pulse (less aggressive than Tailwind) |
| `.animate-float` | Gentle floating motion |
| `.animate-spin-slow` | Slow rotation (3s) |
| `.animate-bounce-subtle` | Gentle bounce |

### Animation Utilities

| Class | Effect |
|-------|--------|
| `.animate-pause-on-hover` | Pause animation on hover |

**Note:** All animations respect `prefers-reduced-motion` and will be disabled for users who prefer reduced motion.

---

## Helper Utilities (helpers.css)

### Overflow & Truncation

| Class | Effect |
|-------|--------|
| `.overflow-parent` | Container for ellipsis children |
| `.overflow-ellipsis` | Single-line truncation (robust) |
| `.truncate-2` | 2-line truncation |
| `.truncate-3` | 3-line truncation |
| `.truncate-4` | 4-line truncation |
| `.text-balance` | Balanced line breaks (headings) |
| `.text-pretty` | Pretty line breaks (body) |

### Media Embeds

| Class | Effect |
|-------|--------|
| `.video-embed` | 16:9 responsive video container |
| `.video-embed-4x3` | 4:3 responsive video container |

### Scroll

| Class | Effect |
|-------|--------|
| `.hide-scrollbar` | Hide scrollbar, keep scroll |
| `.scroll-x` | Horizontal scroll container |
| `.scroll-snap-x` | Horizontal scroll snap |
| `.scroll-snap-start` | Snap to start |
| `.scroll-snap-center` | Snap to center |

### Interaction

| Class | Effect |
|-------|--------|
| `.no-tap-highlight` | Remove mobile tap highlight |
| `.no-select` | Prevent text selection |
| `.select-text` | Allow text selection (override) |

---

## Context-Specific Styles

### web.css — Marketing Pages

Classes for landing pages and marketing content:

| Class | Purpose |
|-------|---------|
| `.hero-gradient` | Radial gradient background |
| `.hero-glow` | Blurred glow effect |
| `.bento-card` | Feature grid card |
| `.toggle-track`, `.toggle-thumb` | Comparison toggle |
| `.pipeline-line`, `.pipeline-step` | Timeline/steps |
| `.terminal-window` | Fake terminal preview |
| `.logo-ticker` | Social proof logos |
| `.card-hover-lift` | Card lift on hover |
| `.card-glow` | Gradient border glow |

### app.css — Dashboard Pages

*Placeholder — add app-specific patterns as needed.*

### present.css — Presentations

*Placeholder — add slide layouts and typography scales.*

---

## Adding New CSS

### When to Create a New File

- New route group with distinct visual needs
- Third-party component that needs overrides
- Feature that doesn't fit existing contexts

### Naming Convention

```
design/
├── {context}.css     # Route-group specific (web, app, present)
├── {feature}.css     # Feature-specific if complex
└── {vendor}.css      # Third-party overrides
```

### Import Pattern

```tsx
// In the relevant layout file
import "@/design/my-new-styles.css"
```

---

## Removing Unused Styles

### For App-Only Projects (No Marketing Site)

1. Delete `app/(web)/` folder (includes `web.css`)
2. Update root redirect in `next.config.ts` if needed

### For Apps Without Presentations

1. Delete `app/(present)/` folder (includes `present.css`)
2. Remove presentation links from navigation

---

## Quick Reference

```tsx
// Entrance animation with delay
<div className="animate-fade-in-up delay-200">Content</div>

// Multi-line truncation
<p className="truncate-3">Long text that will be clamped...</p>

// Responsive video embed
<div className="video-embed">
  <iframe src="https://youtube.com/embed/..." />
</div>

// Hide scrollbar
<div className="scroll-x hide-scrollbar">Carousel items</div>

// Marketing card (requires web.css)
<div className="bento-card card-hover-lift">Feature content</div>
```

---

## Related Docs

| Doc | When to read |
|-----|--------------|
| `AGENTS.md` | Repo conventions, important callouts |
| `catalyst/CATALYST.md` | Framework overview and philosophy |
| `catalyst/PATTERNS.md` | Layout patterns, CSS fixes |
| `components/COMPONENTS.md` | Before creating components |
