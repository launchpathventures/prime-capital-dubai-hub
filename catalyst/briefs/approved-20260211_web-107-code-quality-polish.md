# Brief: Web Code Quality & Polish

**ID:** WEB-107
**Status:** Approved
**Priority:** P3 — Nice to Have
**Surface:** Web
**Estimate:** 1 day
**Tags:** code-quality, types, lint, polish

---

## Objective

Address remaining code quality issues, generate Supabase types for compile-time safety, fix the lint error, add bot protection to the lead form, and tidy up data consistency issues. These aren't blockers but improve maintainability and resilience.

---

## Background

The audit found several code quality gaps that don't affect production functionality but create maintenance risk: manually typed Supabase models, a lint error in the properties filter, hardcoded stats on multiple pages, inconsistent email addresses, and no bot protection on the lead form.

---

## Tasks

### 1. Fix ESLint Error in Properties Filter

**File:** `app/(web)/properties/_components/properties-filter.tsx` (line 54)

**Problem:** `setState` called synchronously inside a `useEffect`, triggering cascading renders.

**Fix:** Derive filter values directly from `searchParams` instead of syncing to state:

```typescript
// Before:
const [activeFilter, setActiveFilter] = useState("all")
const [areaFilter, setAreaFilter] = useState("")

useEffect(() => {
  const t = searchParams.get("type") || "all"
  const a = searchParams.get("area") || ""
  setActiveFilter(t)
  setAreaFilter(a)
}, [searchParams])

// After:
const activeFilter = searchParams.get("type") || "all"
const areaFilter = searchParams.get("area") || ""
```

Remove the `useState` and `useEffect` — derive directly from the source of truth.

### 2. Fix Unused `onNext` Parameter

**File:** `components/shared/lead-form/steps/questions-step.tsx` (line 24)

Remove or prefix with underscore: `_onNext`

### 3. Generate Supabase TypeScript Types

**Action:**
```bash
pnpm add -D supabase
npx supabase gen types typescript --project-id ebirxyrjwaulyqizcbcs > lib/supabase/database.types.ts
```

Then update `lib/content.ts` to use generated types instead of manual interfaces:

```typescript
import type { Database } from '@/lib/supabase/database.types'

type Property = Database['public']['Tables']['properties']['Row']
type TeamMember = Database['public']['Tables']['team_members']['Row']
// etc.
```

**Benefits:**
- Schema changes caught at compile time
- Auto-complete for column names
- No manual type drift

Add a script to `package.json`:
```json
"db:types": "npx supabase gen types typescript --project-id ebirxyrjwaulyqizcbcs > lib/supabase/database.types.ts"
```

### 4. Add Honeypot Field to Lead Form

**File:** `components/shared/lead-form/lead-form.tsx` and `app/api/leads/route.ts`

**Client side:**
Add a hidden field that bots will fill but humans won't:

```tsx
{/* Honeypot — hidden from humans, visible to bots */}
<div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
  <label htmlFor="website">Website</label>
  <input
    id="website"
    name="website"
    type="text"
    tabIndex={-1}
    autoComplete="off"
    value={honeypot}
    onChange={(e) => setHoneypot(e.target.value)}
  />
</div>
```

**Server side:**
Check the honeypot in the API route:

```typescript
if (body.website) {
  // Bot detected — silently accept to avoid revealing the trap
  return NextResponse.json({ success: true })
}
```

### 5. Consolidate Strategy Kit URL

**Problem:** Strategy kit URL is defined in two places:
- `lib/config.ts`: `config.links.strategyKit = "/downloads/strategy-kit.pdf"`
- `app/(web)/strategy-kit/page.tsx` (~line 30): hardcoded different URL

**Fix:** Use `config.links.strategyKit` as the single source of truth. Update the strategy kit page to import from config.

### 6. Consolidate Hardcoded Stats

**Problem:** Stats are hardcoded differently on multiple pages:
- Homepage fetches stats from Supabase (dynamic)
- About page hardcodes: "AED 6.5B+", "750+", "94%"
- Services page hardcodes: "4 Core Services", "100+ Golden Visas", etc.

**Fix options (choose one):**
1. **Recommended:** Create a `data/stats-static.ts` file with fallback stats used across pages. When Supabase stats are available, prefer those.
2. **Alternative:** Make about/services pages also fetch from Supabase stats table.

At minimum, ensure the hardcoded values match across pages.

### 7. Fix Inconsistent Email Addresses

**Problem:** Services page CTA uses `hello@primecapital.ae` while `config.contact` has `admin@primecapitaldubai.com`. These are different domains.

**Fix:** All email references should use `config.contact.email`:

```typescript
import { config } from "@/lib/config"

// Use: config.contact.email
// Never hardcode: "hello@primecapital.ae"
```

Search for any hardcoded email addresses across the web surface and replace with config references.

### 8. Fix Footer Time Formatting

**File:** `app/(web)/_surface/web-footer.tsx`

**Problem:** Shows `Monday – Friday 9:00\nAM – 6:00 PM` with an awkward line break mid-time.

**Fix:** Format as `Monday – Friday, 9:00 AM – 6:00 PM` on one line, or break cleanly:
```
Monday – Friday
9:00 AM – 6:00 PM
```

### 9. Clean Up `web.css` After `/web` Page Removal

**File:** `app/(web)/web.css`

After the `/web` demo page is removed (WEB-101), audit `web.css` for orphaned styles:
- Bento grid styles (if only used by `/web`)
- Terminal preview styles
- Pipeline animation styles
- Toggle switch styles

Use grep to check if each CSS class is referenced by any remaining TSX file. Remove orphaned styles to reduce the CSS bundle.

### 10. Add Cookie Consent Banner

**Scope:** Root layout or web surface

If targeting EU visitors (even secondarily), a cookie consent banner is legally recommended:

- Vercel Analytics sets cookies
- Simple banner: "We use cookies to improve your experience. [Accept] [Learn More]"
- Link "Learn More" to the terms page
- Use a lightweight approach — no heavy CMP library needed
- Store consent in a cookie to not show again

> **Note:** This may not be required if the site exclusively targets UAE/GCC visitors. Check with the client.

---

## Acceptance Criteria

- [ ] `pnpm lint` passes with 0 errors, 0 warnings
- [ ] Supabase types generated and imported in content layer
- [ ] `pnpm db:types` script works
- [ ] Honeypot field present in lead form, checked server-side
- [ ] Strategy kit URL comes from config (single source)
- [ ] No hardcoded email addresses outside of config
- [ ] Footer time formatted cleanly
- [ ] `web.css` reduced after `/web` page removal
- [ ] Cookie consent banner (if client confirms needed)

---

## Files to Create

| File | Purpose |
|------|---------|
| `lib/supabase/database.types.ts` | Auto-generated Supabase types |
| `data/stats-static.ts` | Fallback stats used across pages (optional) |

## Files to Modify

| File | Change |
|------|--------|
| `app/(web)/properties/_components/properties-filter.tsx` | Fix lint error |
| `components/shared/lead-form/steps/questions-step.tsx` | Fix unused param |
| `components/shared/lead-form/lead-form.tsx` | Add honeypot field |
| `app/api/leads/route.ts` | Check honeypot server-side |
| `lib/content.ts` | Use generated Supabase types |
| `app/(web)/strategy-kit/page.tsx` | Use config for download URL |
| `app/(web)/services/page.tsx` | Use config.contact.email |
| `app/(web)/_surface/web-footer.tsx` | Fix time formatting |
| `app/(web)/web.css` | Remove orphaned styles |
| `package.json` | Add `db:types` script |

---

## Dependencies

- WEB-101 (Content Cleanup) should be done first — the `/web` page removal affects CSS cleanup
- Supabase type generation requires the Supabase CLI and project access
