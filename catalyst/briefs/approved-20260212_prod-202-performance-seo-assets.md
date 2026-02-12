# Brief: PROD Performance, SEO, and Asset Optimization

**ID:** PROD-202
**Status:** Approved
**Priority:** P1 — High Value
**Surface:** Web
**Estimate:** 2–3 days
**Tags:** performance, seo, images

---

## Objective

Improve page performance and SEO for production by optimizing background images, adding page-level metadata (OG tags, canonical URLs), and ensuring social sharing quality.

---

## Background

The audit found ~20 large Unsplash images loaded as CSS `background-image` (no optimization or lazy loading), missing metadata on key pages, and a missing canonical URL for the strategy-kit page.

---

## Tasks

### 1) Replace CSS background images with optimized `next/image`
- Convert hero/CTA background images to `Image` with `fill` and `object-cover`
- Keep layout and design identical
- Remove inline `backgroundImage` for key sections

### 2) Add homepage metadata export
- Add `export const metadata` to `app/(web)/page.tsx`
- Ensure page-specific title, description, canonical URL, and OG tags

### 3) Add OG metadata to static pages
- Add Open Graph metadata to:
  - about, services, properties, team, contact, terms
- Use page-specific titles and descriptions

### 4) Fix strategy-kit canonical
- Add `alternates: { canonical: "/strategy-kit" }`

### 5) Validate Open Graph image strategy
- Ensure each page has a suitable OG image
- Use existing `web-og.jpg` or add per-page assets

---

## Acceptance Criteria

- No CSS-based hero background images that bypass `next/image`
- Homepage has full metadata export
- All static pages have OG tags and canonical URLs
- Social previews look correct on Facebook / LinkedIn

---

## Non-Goals

- Full PWA support (separate brief)
