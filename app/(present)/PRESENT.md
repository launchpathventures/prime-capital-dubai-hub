# PRESENT Surface

Slide presentations for stakeholders and pitches.

---

## Overview

| Property | Value |
|----------|-------|
| Route Group | `(present)` |
| Shell | `SlidesShell` |
| CSS | `present.css` |
| URL Prefix | `/present` |

## Structure

```
app/(present)/
├── PRESENT.md              # This file
├── present.css             # Surface styles
├── layout.tsx              # Imports present.css
├── _surface/
│   ├── slides-shell.tsx    # Shell component
│   ├── slide.tsx           # Slide primitives
│   ├── nav.tsx             # Navigation components
│   ├── header.tsx          # Minimal header
│   ├── dots.tsx            # Navigation dots
│   ├── scroll-hint.tsx     # Scroll indicator
│   ├── use-presentation-slides.ts  # Navigation hook
│   └── index.ts            # Barrel export
└── present/
    ├── page.tsx            # /present index
    └── YYYYMMDD-deck/      # Individual presentations
        ├── page.tsx
        └── page.css        # Optional presentation-specific styles
```

## Features

- Full-screen snap-scroll slides
- Keyboard navigation (arrow keys)
- URL hash sync for deep linking
- Navigation dots (right side)
- Auto-hide floating header (shows on hover)

---

## Content Layout System

Present is unique: pages are **full-width by default** with zero container padding. Each page controls its own layout — the landing page uses a sidebar, presentations use snap-scroll slides.

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.present-content` | Container (sets variables, zero padding) — applied by shell |
| `.present-section` | Standard width + padding for centered content blocks |

### Standard Content Width

Use `.present-section` when you want centered, width-constrained content:

```tsx
// Inside a slide
<Slide slug="intro">
  <div className="present-section">
    <h1>Centered slide content</h1>
    <p>Max-width: 64rem with responsive padding</p>
  </div>
</Slide>
```

### CSS Variables

Defined on `.present-content`:
- `--present-content-width: 64rem` — max content width
- `--present-content-padding: 1.5rem` — mobile padding
- `--present-content-padding-md: 2rem` — desktop padding

Override these to adjust all centered content at once.

---

## Two Layout Modes

### Landing Page (`/present`)

- Fixed header with sidebar toggle
- Collapsible left sidebar with presentation list
- Hero content area with gradient background

### Presentation Pages (`/present/[deck]`)

- Full-viewport snap-scroll slides
- Auto-hide floating header (shows on mouse hover)
- Sheet-based navigation (overlay)
- Navigation dots (right side)

---

## Creating Presentations

See detailed guide in this folder's original docs, or use the template:

1. Create folder: `present/YYYYMMDD-your-deck/`
2. Add `page.tsx` with slide components
3. Register in `lib/navigation.ts` → `presentations` array

## Navigation

Edit `presentations` in `lib/navigation.ts` to add/remove presentations.

---

## Deleting This Surface

To remove the presentation surface:

1. **Delete this folder:** `app/(present)/`
2. **Update navigation:** Remove `presentations` array from `lib/navigation.ts`
3. **Update links:** Remove `/present` references from other surfaces

**No other files to clean up** — CSS and shell are colocated.

---

## Related Docs

| Doc | Purpose |
|-----|---------|
| `catalyst/SURFACES.md` | Creating and managing surfaces |
| `catalyst/PATTERNS.md` | Layout patterns, CSS fixes |
| `lib/navigation.ts` | Navigation configuration |

