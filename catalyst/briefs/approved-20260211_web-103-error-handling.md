# Brief: Web Error Handling & Resilience

**ID:** WEB-103
**Status:** Approved
**Priority:** P1 — Pre-Launch
**Surface:** Web + Root
**Estimate:** 0.5 days
**Tags:** error-handling, ux, resilience

---

## Objective

Add branded error pages, loading states, and graceful data-failure UX across the web surface. When Supabase is down or a URL is wrong, visitors should see a professional, on-brand experience — not the default Next.js error page.

---

## Background

The audit found:
- **No `error.tsx`** anywhere in the `(web)` surface or root
- **No `not-found.tsx`** in the `(web)` surface or root
- **No `global-error.tsx`** at the root (catches root layout crashes)
- **No loading states** for `strategy-kit/`, `terms/`, or dynamic detail pages
- **Silent data failures** — when Supabase is down, pages render empty with no user indication

---

## Tasks

### 1. Create Root `global-error.tsx`

**File:** `app/global-error.tsx`

This catches errors in the root layout itself. Must be a client component with its own `<html>` and `<body>`:

```tsx
"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        {/* Minimal styled error page — no layout dependencies */}
        {/* Include: Prime Capital Dubai branding, "Something went wrong", reset button, contact link */}
      </body>
    </html>
  )
}
```

- Keep styling inline or minimal — can't rely on any layout/CSS loading
- Include company name and contact email
- Log the error with `trackError` from `lib/error-tracking.ts`

### 2. Create Web Surface `error.tsx`

**File:** `app/(web)/error.tsx`

Catches any unhandled errors within the web surface. This renders inside the WebShell (header/footer remain):

- "use client" component
- Show a branded error message matching the site design
- Include a "Try Again" button (calls `reset()`)
- Include a "Go Home" link
- Log error with `trackError`
- Use the core components (`Container`, `Stack`, `Title`, `Text`, `Button`)

### 3. Create Web Surface `not-found.tsx`

**File:** `app/(web)/not-found.tsx`

Branded 404 page for bad web URLs:

- Show "Page not found" with on-brand styling
- Include popular links: Properties, Services, Contact
- Include a "Go Home" button
- Use web surface design language (Container, Stack, etc.)
- This is a server component (no `"use client"` needed)

### 4. Create Root `not-found.tsx`

**File:** `app/not-found.tsx`

Catches 404s that don't match any route group:

- Similar to web surface 404 but more minimal
- Link back to homepage
- Use core components

### 5. Add Missing Loading States

Create `loading.tsx` files for routes that lack them:

| File | Content |
|------|---------|
| `app/(web)/strategy-kit/loading.tsx` | Skeleton matching strategy-kit page layout |
| `app/(web)/terms/loading.tsx` | Simple text skeleton |
| `app/(web)/properties/[slug]/loading.tsx` | Property detail skeleton |
| `app/(web)/team/[slug]/loading.tsx` | Team member detail skeleton |

Each loading state should:
- Use skeleton elements (animated `bg-muted` divs with `animate-pulse`)
- Roughly match the page's layout structure
- Be wrapped in the same `Container` and spacing as the actual page

### 6. Add Empty State for Data-Driven Sections

**Problem:** When Supabase returns empty data (outage or no records), pages render empty sections with no indication to the user.

**Action:** Add empty state handling to:

| Component/Page | Current Behavior | Fix |
|----------------|-----------------|-----|
| Homepage properties section | Empty grid | Show "Properties coming soon" message |
| Homepage testimonials section | Empty area | Hide section entirely |
| Homepage stats section | Empty stats | Show static fallback values |
| Properties listing | Empty grid | Show "No properties available" message |
| Team listing | Empty grid | Show "Team information unavailable" message |

For each, wrap the data-dependent section:
```tsx
{items.length > 0 ? (
  // Render normally
) : (
  // Render empty state or hide section
)}
```

---

## Acceptance Criteria

- [ ] Navigating to `/nonexistent-page` shows a branded 404 page
- [ ] Navigating to `/properties/nonexistent-slug` shows a branded 404 (via `notFound()`)
- [ ] Throwing an error in any web page shows a branded error page with "Try Again"
- [ ] Root layout crash shows a minimal branded error page
- [ ] All web pages have a `loading.tsx` skeleton
- [ ] Empty Supabase responses show meaningful empty states, not blank sections
- [ ] `trackError` is called in both error boundaries
- [ ] `pnpm build` succeeds

---

## Files to Create

| File | Type |
|------|------|
| `app/global-error.tsx` | Client component — root crash handler |
| `app/not-found.tsx` | Server component — root 404 |
| `app/(web)/error.tsx` | Client component — web error boundary |
| `app/(web)/not-found.tsx` | Server component — web 404 |
| `app/(web)/strategy-kit/loading.tsx` | Server component — skeleton |
| `app/(web)/terms/loading.tsx` | Server component — skeleton |
| `app/(web)/properties/[slug]/loading.tsx` | Server component — skeleton |
| `app/(web)/team/[slug]/loading.tsx` | Server component — skeleton |

## Files to Modify

| File | Change |
|------|--------|
| `app/(web)/page.tsx` | Add empty state checks for properties, testimonials, stats |
| `app/(web)/properties/page.tsx` | Add empty state for no properties |
| `app/(web)/team/page.tsx` | Add empty state for no team members |

---

## Design Notes

- Error and 404 pages should feel like part of the site — same typography, colors, spacing
- Use the Dubai skyline or a subtle property image as a background element
- Keep messaging professional and reassuring — this is a luxury real estate brand
- Avoid technical jargon ("500 Internal Server Error") — use "Something went wrong" style messaging
