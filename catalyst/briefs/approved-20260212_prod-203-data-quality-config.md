# Brief: PROD Data Quality & Config Cleanup

**ID:** PROD-203
**Status:** Approved
**Priority:** P1 — High Value
**Surface:** Web + Data
**Estimate:** 0.5–1 day
**Tags:** data, config, production

---

## Objective

Eliminate placeholder or inconsistent data that could surface in production fallbacks. Align JSON data with real business info and ensure all referenced assets exist.

---

## Background

Audit found placeholder values in `data/config.json`, fictional team entries in `data/team.json`, and references to missing property images under `/images/properties/`.

---

## Tasks

### 1) Update data/config.json
- Replace placeholder phone, emails, form IDs with real values
- Align contact email with `lib/config.ts`

### 2) Update data/team.json
- Replace placeholder names and LinkedIn URLs with real team members
- Ensure entries match actual team photos in `public/images/team`

### 3) Fix properties image references
- Either add missing `public/images/properties/` assets
- Or update `data/properties.json` to use Supabase/remote URLs

### 4) Align fallback stats
- Ensure fallback stats in `app/(web)/page.tsx` match `data/stats.json`

---

## Acceptance Criteria

- No placeholder values remain in data JSON files
- Team JSON matches real team and assets
- No missing image references
- Fallback stats are consistent

---

## Non-Goals

- Full CMS migration (already handled by Supabase)
