# WEB Surface

Public-facing marketing pages for visitors.

---

## Overview

| Property | Value |
|----------|-------|
| Route Group | `(web)` |
| Shell | `WebShell` |
| CSS | `web.css` |
| URL Prefix | `/` (root) |

## Structure

```
app/(web)/
├── WEB.md              # This file
├── web.css             # Surface styles
├── layout.tsx          # Uses WebShell
├── page.tsx            # Landing page (/)
├── terms/              # Legal pages
└── _surface/
    ├── web-shell.tsx   # Shell component
    └── web-nav.tsx     # Navigation with mobile menu
```

## Features

- Header with responsive navigation
- Mobile menu (hamburger → dropdown)
- Full-width content area (no sidebar)
- Marketing-focused layout
- Hero effects, bento grids, CTAs

## Navigation

Edit `webNavItems` and `webMoreItems` in `lib/navigation.ts` to update header links.

---

## Content Layout System

The web surface uses CSS custom properties for centralized layout control.

### CSS Variables

```css
:root {
  --web-content-width: 80rem;     /* Default max-width for content */
  --web-content-padding: 1rem;    /* Responsive (1.5rem on sm+) */
}
```

### Key Differences from Other Surfaces

Unlike app/docs/examples which constrain content width at the shell level, the web surface is **full-width by nature**. Each section controls its own background and uses `Container` + `Section` for content width.

```tsx
// Typical web page structure
<Section padding="xl" className="bg-gradient-to-b from-primary/10">
  <Container size="xl">
    {/* Content constrained to 80rem */}
  </Container>
</Section>
```

### Layout Classes

| Class | Purpose |
|-------|---------|
| `.web-shell` | Full-viewport flex column layout |
| `.web-mobile-backdrop` | Dark overlay behind mobile panel |
| `.web-mobile-panel` | Fixed panel with header + nav |
| `.web-mobile-header` | Header row inside mobile panel |
| `.web-mobile-menu` | Nav links section |
| `.web-mobile-menu-divider` | Separator line between nav groups |
| `.web-mobile-menu-primary` | Primary action button (Docs) |

---

## Mobile Navigation

The `WebNav` component handles both desktop and mobile navigation:

- **Desktop**: Inline links in header with "More" dropdown
- **Mobile**: Full-screen panel with header, theme toggle, and nav links

### Mobile Menu Features

- **Scroll lock**: Body scroll disabled when menu is open
- **Backdrop click**: Closes menu when clicking outside
- **Escape key**: Closes menu on Escape press
- **Resize close**: Auto-closes when viewport becomes desktop-sized
- **Route change**: Auto-closes when navigating to a new page

Navigation items are defined once in `lib/navigation.ts` and rendered appropriately for each viewport via the shared `NavItems` component.

### Customizing Mobile Menu

To add/remove items, edit `webNavItems` and `webMoreItems` in `navigation.ts`. The mobile menu automatically includes both arrays with a divider between them.

To style the mobile menu, edit `.web-mobile-menu` in `web.css`.

---

## Deleting This Surface

To remove the web/marketing surface:

1. **Delete this folder:** `app/(web)/`
2. **Update navigation:** Remove `webNavItems` from `lib/navigation.ts`
3. **Update root redirect:** If `/` should go elsewhere, update `next.config.ts`

**No other files to clean up** — CSS and shell are colocated.

---

## Related Docs

| Doc | Purpose |
|-----|---------|
| `catalyst/SURFACES.md` | Creating and managing surfaces |
| `catalyst/PATTERNS.md` | Layout patterns, CSS fixes |
| `lib/navigation.ts` | Navigation configuration |

