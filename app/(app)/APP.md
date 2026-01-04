# APP Surface

Authenticated application pages for users.

---

## Overview

| Property | Value |
|----------|-------|
| Route Group | `(app)` |
| Shell | `AppShell` |
| CSS | `app.css` |
| URL Prefix | `/app` |
| Auth | **All routes protected** by middleware |

## Auth Architecture

All `/app` routes (including `/app` itself) require authentication:

- **Protection:** Handled in `proxy.ts` middleware (single source of truth)
- **Layout:** Fetches user data for display only, no redirects
- **Cookies:** Supabase session cookies managed via `updateSession()`

```
Request → proxy.ts → checks auth → allows/redirects → layout.tsx → page.tsx
```

### Demo Mode (Future)

When `AUTH_MODE=demo`, auth check is skipped so visitors can explore without login.
See commented code in `proxy.ts` for implementation.

## Structure

```
app/(app)/
├── APP.md              # This file
├── app.css             # Surface styles
├── layout.tsx          # Uses AppShell
├── _surface/
│   ├── app-shell.tsx   # Shell component
│   ├── app-breadcrumb.tsx # Header breadcrumb
│   └── index.ts        # Barrel exports
├── app/                # /app routes
│   ├── page.tsx
│   ├── dashboard/
│   ├── settings/
│   └── profile/
```

---

## Content Layout System

Layout is centralized in `app.css`. Pages just return content — width, padding, and centering are handled automatically.

### Standard Page (default)

Pages get `max-width: 80rem`, centered with responsive padding:

```tsx
export default function DashboardPage() {
  return (
    <article>
      {/* Content is automatically centered with padding */}
    </article>
  )
}
```

### Bleed Page (full-width sections)

For pages needing full-width backgrounds, wrap in `.app-bleed`:

```tsx
export default function AnalyticsPage() {
  return (
    <div className="app-bleed">
      <section className="bg-muted/50 py-12">
        {/* Full-width background */}
        <div className="app-section">Constrained content</div>
      </section>
      <article className="app-section">
        {/* Standard width content */}
      </article>
    </div>
  )
}
```

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.app-content` | Shell container (sets variables) — don't use directly |
| `.app-bleed` | Page root wrapper to enable bleed mode |
| `.app-section` | Standard width + padding for content inside bleed pages |

---

## Features

- Collapsible sidebar with navigation
- Header with dynamic breadcrumbs (Section > Page)
- Responsive mobile sidebar (sheet)
- Centralized content layout with bleed support

## Navigation

Edit `appNavItems` in `lib/navigation.ts` to update sidebar links.

---

## Deleting This Surface

To remove the app surface:

1. **Delete this folder:** `app/(app)/`
2. **Update navigation:** Remove `appNavItems` from `lib/navigation.ts`
3. **Update links:** Remove `/app` references from other surfaces

**No other files to clean up** — CSS and shell are colocated.

---

## Related Docs

| Doc | Purpose |
|-----|---------|
| `catalyst/SURFACES.md` | Creating and managing surfaces |
| `catalyst/PATTERNS.md` | Layout patterns, CSS fixes |
| `lib/navigation.ts` | Navigation configuration |

