# Brief: Web Content Cleanup & Legal

**ID:** WEB-101
**Status:** Approved
**Priority:** P0 — Blocks Production
**Surface:** Web
**Estimate:** 0.5 days
**Tags:** content, legal, cleanup

---

## Objective

Remove off-brand content, replace placeholder legal pages, and delete duplicate files cluttering the codebase. These issues directly harm credibility with HNW clients and create legal risk.

---

## Background

The audit found a Catalyst framework demo page publicly accessible at `/web`, a placeholder terms page with no company-specific content, and 6 macOS Finder duplicate files (`* 2.*`) polluting the codebase.

---

## Tasks

### 1. Remove the `/web` Demo Page

**Problem:** `app/(web)/web/page.tsx` is a Catalyst developer showcase page ("Build websites at warp speed", "AI-First Workflow") publicly accessible on the production domain. It links to `/docs` and `/examples` — internal developer routes. It has no metadata, is a `"use client"` component, and uses completely different styling.

**Action:**
- Delete the `app/(web)/web/` folder entirely
- Remove any references to `/web` in navigation or sitemap (none currently exist, but verify)
- Remove any CSS in `web.css` that is exclusively used by this page (bento grid, terminal, pipeline styles — approximately lines 600-1200). Be conservative — check each class is unused by other pages before removing.

### 2. Replace Terms & Conditions Page

**Problem:** `app/(web)/terms/page.tsx` is generic boilerplate with:
- No mention of "Prime Capital Dubai" anywhere
- No Dubai jurisdiction or RERA references
- No privacy policy content
- "Last updated: December 2024" is stale
- Generic sections that don't cover real estate advisory specifics

**Action:**
- Replace with a proper terms page covering:
  - Company identification: Prime Capital Real Estate Brokers LLC, RERA BRN: [needs input from client]
  - Dubai jurisdiction: DIFC/UAE law
  - Real estate advisory terms: property valuation disclaimers, no guaranteed returns, market risk
  - Data collection: what data is collected (lead form fields), how it's used (CRM routing via Zapier), who it's shared with
  - Cookie usage: Vercel Analytics cookies
  - Contact details: use `config.contact` values
  - Last updated: February 2026

> **Note:** This needs client input for specific legal details (RERA BRN, registered address, etc.). Create the structure and mark sections that need client review with `[CLIENT REVIEW]` placeholders.

### 3. Delete Duplicate Files

**Problem:** 6 macOS Finder copy artifacts exist in the codebase:

| File | Action |
|------|--------|
| `AGENTS 2.md` | Delete |
| `lib/content 2.ts` | Delete |
| `components/shared/property-card 2.tsx` | Delete |
| `components/shared/team-card 2.tsx` | Delete |
| `components/shared/testimonial-card 2.tsx` | Delete |
| `components/shared/marketing-stat 2.tsx` | Delete |

**Action:**
```bash
rm "AGENTS 2.md"
rm "lib/content 2.ts"
rm "components/shared/property-card 2.tsx"
rm "components/shared/team-card 2.tsx"
rm "components/shared/testimonial-card 2.tsx"
rm "components/shared/marketing-stat 2.tsx"
```

Verify no imports reference these files (unlikely — they have spaces in names).

### 4. Remove Unused `page-transition.tsx`

**Problem:** `app/(web)/_surface/page-transition.tsx` defines `PageTransition` and `StaggerChildren` components that are never imported by any page.

**Action:**
- Delete `app/(web)/_surface/page-transition.tsx`
- Remove its export from any barrel files if applicable

---

## Acceptance Criteria

- [ ] `/web` returns 404
- [ ] No Catalyst-branded content exists on the public site
- [ ] Terms page mentions Prime Capital Dubai, Dubai jurisdiction, and real estate-specific terms
- [ ] Terms page uses `config.contact` for contact details
- [ ] All 6 duplicate files deleted
- [ ] `page-transition.tsx` deleted
- [ ] `pnpm tsc --noEmit` still passes
- [ ] `pnpm lint` has no new errors

---

## Files to Modify

| File | Change |
|------|--------|
| `app/(web)/web/` | Delete entire folder |
| `app/(web)/terms/page.tsx` | Replace with proper legal content |
| `app/(web)/web.css` | Remove orphaned styles (after `/web` deletion) |
| 6 duplicate files | Delete |
| `app/(web)/_surface/page-transition.tsx` | Delete |

---

## Needs Client Input

- RERA Broker Registration Number (BRN)
- Registered company name and address
- Specific disclaimers their legal team requires
- Privacy policy preferences (separate page or inline section)
