# EXAMPLES Surface

Reference implementations showcasing what Catalyst can build. Full-page examples that serve as inspiration and copyable patterns.

---

## Overview

| Property | Value |
|----------|-------|
| Route Group | `(examples)` |
| Shell | `ExamplesShell` |
| CSS | `examples.css` |
| URL Prefix | `/examples` |
| Audience | Developers, AI agents |

---

## Purpose

Examples are **not** part of your app — they're learning resources:
- Showcase Catalyst's capabilities
- Provide copyable patterns
- Inspire design decisions
- Help AI understand component usage

---

## Current Examples

| Example | Description | Route |
|---------|-------------|-------|
| Overview | Gallery of all examples | `/examples` |
| Dashboard | Analytics dashboard with stats, charts, tables | `/examples/dashboard` |
| CRM | Customer relationship management | `/examples/crm` |
| Inbox | Email/message interface | `/examples/inbox` |
| Kanban | Drag-and-drop board | `/examples/kanban` |
| Analytics | Data visualization | `/examples/analytics` |
| Billing | Subscription, usage, invoices, account settings | `/examples/billing` |
| Landing | Marketing/web page (planned) | `/examples/landing` |
| Calendar | Month/week/day views + events (planned) | `/examples/calendar` |
| Map | MapLibre GL integration (planned) | `/examples/map` |

---

## Adding an Example

1. Create folder: `app/(examples)/examples/[name]/page.tsx`
2. Add to navigation: Update `examplesNavItems` in `lib/navigation.ts`
3. Add to overview: Update the gallery page at `/examples`

---

## Content Layout System

Layout is centralized in `examples.css`. Pages just return content — width, padding, and centering are handled automatically.

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

For pages needing full-width backgrounds, wrap in `.examples-bleed`:

```tsx
export default function AnalyticsPage() {
  return (
    <div className="examples-bleed">
      <section className="bg-muted/50 py-12">
        {/* Full-width background */}
        <div className="examples-section">Constrained content</div>
      </section>
      <article className="examples-section">
        {/* Standard width content */}
      </article>
    </div>
  )
}
```

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.examples-content` | Shell container (sets variables) — don't use directly |
| `.examples-bleed` | Page root wrapper to enable bleed mode |
| `.examples-section` | Standard width + padding for content inside bleed pages |

---

## Shell

Uses a sidebar layout similar to App shell for consistency:
- Collapsible sidebar with example navigation
- Header with dynamic breadcrumb (icon + current example name)
- Main content area with centralized layout

---

## Deleting This Surface

When shipping to production, you likely want to remove examples:

1. Delete this folder: `app/(examples)/`
2. Remove navigation: Delete `examplesNavItems` from `lib/navigation.ts`
3. Update links: Remove references from other surfaces (e.g., web landing page)
