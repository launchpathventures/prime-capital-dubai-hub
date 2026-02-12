# Brief: Web Performance & Caching

**ID:** WEB-102
**Status:** Approved
**Priority:** P1 — Pre-Launch
**Surface:** Web
**Estimate:** 1 day
**Tags:** performance, caching, optimization

---

## Objective

Remove `force-dynamic` from the web layout and implement proper caching strategy with ISR. Eliminate unnecessary client components, self-host critical images, and optimize the CSS bundle. Target: static generation for most pages, ISR for data-driven pages, CDN caching for everything.

---

## Background

The audit found that `export const dynamic = "force-dynamic"` in `app/(web)/layout.tsx` forces every web page to server-render on every request. For a marketing site where content changes infrequently, this means:
- No CDN caching — every visitor hits the origin server
- Higher TTFB — Supabase queries run on every page load
- Unnecessary Supabase load — 3 queries per homepage visit × every visitor

The comment says this is to "avoid SSG issues with base-ui components" — but the shell is already a client component, so base-ui rendering is client-side regardless.

---

## Tasks

### 1. Remove `force-dynamic` from Web Layout

**File:** `app/(web)/layout.tsx`

- Remove `export const dynamic = "force-dynamic"` (line 15)
- This lets Next.js use its default rendering strategy (static where possible)

### 2. Add ISR Revalidation to Data-Driven Pages

Pages that fetch from Supabase should use ISR instead of being fully dynamic:

| Page | Strategy | Revalidation |
|------|----------|-------------|
| Homepage (`page.tsx`) | ISR | `export const revalidate = 3600` (1 hour) |
| Properties listing (`properties/page.tsx`) | ISR | `export const revalidate = 1800` (30 min) |
| Property detail (`properties/[slug]/page.tsx`) | ISR | `export const revalidate = 3600` (1 hour) |
| Team listing (`team/page.tsx`) | ISR | `export const revalidate = 86400` (24 hours) |
| Team detail (`team/[slug]/page.tsx`) | ISR | `export const revalidate = 86400` (24 hours) |
| About, Services, Contact | Static | No revalidate needed (hardcoded content) |
| Terms | Static | No revalidate needed |
| Strategy Kit | Static | No revalidate needed |

**For each ISR page, add:**
```typescript
export const revalidate = 3600 // Revalidate every hour
```

### 3. Test Build After Removing `force-dynamic`

After removing `force-dynamic`:
- Run `pnpm build` to verify all pages can be statically analyzed
- If any pages fail due to dynamic APIs (cookies, headers, searchParams):
  - Add `export const dynamic = "force-dynamic"` only to those specific pages
  - The properties filter page uses `searchParams` and may need to stay dynamic
- Document which pages ended up static vs dynamic in a comment in the layout

### 4. Make `web-footer.tsx` a Server Component

**File:** `app/(web)/_surface/web-footer.tsx`

- Remove `"use client"` directive
- The footer has no hooks, state, effects, or event handlers — it renders static JSX
- Uses `Link` and `config` which are both server-compatible
- Verify it still renders correctly in the shell (WebShell is a client component, but server components can be passed as `children`)

### 5. Deduplicate Property Image Fallback Map

**Problem:** The same `propertyTypeImages` map is defined in both:
- `app/(web)/page.tsx` (~line 47)
- `app/(web)/properties/_components/properties-filter.tsx` (~line 16)

**Action:**
- Create `app/(web)/_surface/property-images.ts` with the shared map
- Import from both locations
- Export as a constant:
  ```typescript
  export const PROPERTY_TYPE_IMAGES: Record<string, string> = { ... }
  ```

### 6. Migrate Unsplash Images to Supabase Storage

**Problem:** 20+ hardcoded Unsplash URLs across the web surface create a third-party dependency. If Unsplash changes URL structure, rate-limits, or goes down, images break.

**Action:**
- Download all Unsplash images used in the web surface
- Upload to Supabase Storage in a `website` bucket
- Replace URLs in code with Supabase Storage URLs
- After migration, remove `images.unsplash.com` from `next.config.ts` remote patterns

**Files with Unsplash URLs:**

| File | Count |
|------|-------|
| `app/(web)/page.tsx` | ~11 |
| `app/(web)/services/page.tsx` | ~7 |
| `app/(web)/properties/_components/properties-filter.tsx` | ~5 |
| `app/(web)/properties/page.tsx` | ~1 |
| `app/(web)/team/page.tsx` | ~1 |
| `app/(web)/team/[slug]/page.tsx` | ~2 |

> **Note:** This is a tedious but important task. Can be done incrementally — start with homepage and properties, then services and team.

### 7. Replace CSS Background Images with `next/image`

**Problem:** Several sections use `style={{ backgroundImage: url(...) }}` which bypasses `next/image` optimization (no WebP, no lazy loading, no responsive sizing).

**Files:**
- `app/(web)/page.tsx` (~line 426) — Strategy Kit CTA section
- `app/(web)/properties/page.tsx` (~line 124) — Hero background
- `app/(web)/properties/page.tsx` (~line 199) — CTA background

**Action:**
- Where possible, replace with `<Image>` using `fill` + `object-cover` + `className="absolute inset-0 -z-10"`
- Keep the gradient overlay as a separate `<div>`

### 8. Install `@vercel/speed-insights`

**Action:**
```bash
pnpm add @vercel/speed-insights
```

Add to root layout alongside Analytics:
```tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

// In the layout JSX:
<SpeedInsights />
```

---

## Acceptance Criteria

- [ ] `force-dynamic` removed from `app/(web)/layout.tsx`
- [ ] `pnpm build` succeeds — verify build output shows static pages
- [ ] Homepage, about, services, contact, terms, strategy-kit are statically generated
- [ ] Properties and team pages use ISR with revalidation
- [ ] Footer renders correctly without `"use client"`
- [ ] Property image map defined in one place only
- [ ] Unsplash images migrated to Supabase Storage (or plan documented)
- [ ] At least homepage CSS background images converted to `<Image>`
- [ ] `@vercel/speed-insights` installed and rendering

---

## Files to Modify

| File | Change |
|------|--------|
| `app/(web)/layout.tsx` | Remove `force-dynamic` |
| `app/(web)/page.tsx` | Add `revalidate`, fix background images |
| `app/(web)/properties/page.tsx` | Add `revalidate`, fix background images |
| `app/(web)/properties/[slug]/page.tsx` | Add `revalidate` |
| `app/(web)/team/page.tsx` | Add `revalidate` |
| `app/(web)/team/[slug]/page.tsx` | Add `revalidate` |
| `app/(web)/_surface/web-footer.tsx` | Remove `"use client"` |
| `app/(web)/_surface/property-images.ts` | New — shared image map |
| `app/layout.tsx` | Add `<SpeedInsights />` |
| `next.config.ts` | Update image remote patterns |
| Multiple pages | Replace Unsplash URLs |

---

## Risks

- Removing `force-dynamic` may surface SSG issues with certain pages — test build thoroughly
- The `properties/page.tsx` uses `searchParams` for filtering — this page likely needs to stay dynamic or use client-side filtering only
- Supabase Storage URLs will differ from Unsplash URLs — ensure all images are high enough quality
