# DOCS Surface

Documentation pages for developers and reference.

---

## Overview

| Property | Value |
|----------|-------|
| Route Group | `(docs)` |
| Shell | `DocsShell` |
| CSS | `docs.css` |
| URL Prefix | `/docs` |

## Structure

```
app/(docs)/
├── DOCS.md             # This file
├── docs.css            # Surface styles (prose, content)
├── layout.tsx          # Uses DocsShell (with auth check)
├── _surface/
│   ├── docs-shell.tsx  # Shell component
│   └── docs-accordion-page.tsx  # Shared accordion layout
└── docs/               # /docs routes
    ├── page.tsx
    ├── components/
    ├── core/
    ├── design/
    ├── login/
    └── test/           # Hidden dev test page (see below)
```

## Features

- Sidebar with grouped navigation
- Prose-styled content area
- Optional password protection (see config)
- Sign out functionality

## Content Layout System

Two patterns, both explicit at the page's root. See `docs.css` for implementation.

### Standard Pages (default)

Container provides padding. Direct children get max-width automatically.

```tsx
export default function MyPage() {
  return (
    <article>
      {/* Gets padding from container, max-width from :where() */}
      <h1>Title</h1>
      <p>Content is constrained to 56rem</p>
    </article>
  )
}
```

### Bleed Pages (full-width sections)

Wrap page in `.docs-bleed` → container padding removed.
Use `.docs-section` per section for standard width + padding.

```tsx
export default function MyPage() {
  return (
    <div className="docs-bleed">
      {/* Full-width hero */}
      <section className="bg-primary/5 py-12">
        <div className="docs-section">
          <h1>Hero Title</h1>
        </div>
      </section>

      {/* Standard content */}
      <article className="docs-section">
        <p>Rest of content with padding + width</p>
      </article>
    </div>
  )
}
```

### Classes

| Class | Purpose |
|-------|---------|
| `.docs-bleed` | Page root wrapper → removes container padding |
| `.docs-section` | Standard width + horizontal padding |

### CSS Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `--docs-content-width` | `56rem` | Max content width |
| `--docs-content-padding` | `1rem` | Horizontal padding |
| `--docs-content-padding-md` | `1.5rem` | Padding at md+ breakpoint |

## Hidden Dev Test Page

A general-purpose debugging page exists at `/docs/test`:

- **NOT listed in navigation** — access manually via URL
- **Excluded from search indexing** — `robots: noindex`
- **Use for**: Testing components, debugging auth, checking env vars

This provides a consistent location for temporary dev utilities without
cluttering the main docs structure. Add your debugging code there as needed.

## Navigation

Edit `docsNavItems` in `lib/navigation.ts` to update sidebar links.

## Access Control

Docs visibility is controlled by `lib/config.ts`:
- `showDocsInProduction` — show/hide in production

See `proxy.ts` for the edge check that enforces production visibility.

---

## Deleting This Surface

To remove the docs surface:

1. **Delete this folder:** `app/(docs)/`
2. **Update navigation:** Remove `docsNavItems` from `lib/navigation.ts`
3. **Update proxy:** Remove docs-related logic from `proxy.ts`
4. **Update links:** Remove `/docs` references from other surfaces

**No other files to clean up** — CSS and shell are colocated.

---

## Related Docs

| Doc | Purpose |
|-----|---------|
| `catalyst/SURFACES.md` | Creating and managing surfaces |
| `catalyst/PATTERNS.md` | Layout patterns, CSS fixes |
| `lib/navigation.ts` | Navigation configuration |

