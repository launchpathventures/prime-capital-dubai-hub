# LMS-024: Code Quality Fixes

**Status:** 📋 READY  
**Priority:** P0 Critical (blocks PROD)  
**Estimated Time:** 1 hour  
**Dependencies:** None  

---

## Objective

Fix all ESLint errors in the Learn surface. Address the reserved variable assignment, unescaped entities, and replace console.log with proper error handling.

---

## Context

ESLint reports 12 errors in the Learn surface:

1. **Reserved variable assignment (1 error)**
   - `app/learn/[competency]/[module]/page.tsx:150` — assigns to `module` variable

2. **Unescaped entities (11 errors)**
   - Quotes (`"` and `'`) in JSX text need escaping
   - Files: certification/page.tsx, admin/certification/page.tsx, scenarios/page.tsx, scenarios/[category]/page.tsx

3. **Console.log in production code (bonus)**
   - `app/learn/admin/certification/page.tsx:77` — uses console.log instead of console.error

---

## Deliverables

### 1. Fix Reserved Variable Assignment

In `app/learn/[competency]/[module]/page.tsx`, rename `module` to `currentModule`:

```typescript
// Line ~150: Change this
const module = currentCompetency.modules[currentModuleIndex]

// To this
const currentModule = currentCompetency.modules[currentModuleIndex]
```

Update all references to `module` in the same file to use `currentModule`:
- `module.essentials`
- `module.content`
- `module.duration_minutes`
- `module.display_order`
- `module.title`
- etc.

### 2. Fix Unescaped Entities

Replace straight quotes with HTML entities or curly quotes:

**app/learn/admin/certification/page.tsx:**
```tsx
// Line 203: Change
"learner"
// To
&quot;learner&quot;
// Or use template literal / curly quotes

// Line 367, 376: Similar fixes
```

**app/learn/certification/page.tsx:**
```tsx
// Line 350: Change apostrophe
what's
// To
what&apos;s
// Or: what's (curly apostrophe)
```

**app/learn/scenarios/page.tsx:**
```tsx
// Lines 113, 134, 203, 204: Fix apostrophes
you'll → you&apos;ll
// Or use curly: you'll
```

**app/learn/scenarios/[category]/page.tsx:**
```tsx
// Line 223: Fix apostrophe
```

### 3. Replace console.log

In `app/learn/admin/certification/page.tsx`:

```typescript
// Line 77: Change
console.log("Certification attempts not available:", error.message)

// To
console.error("Certification attempts not available:", error.message)
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `app/learn/[competency]/[module]/page.tsx` | Rename `module` → `currentModule` (~20 replacements) |
| `app/learn/admin/certification/page.tsx` | Fix 4 unescaped entities, 1 console.log |
| `app/learn/certification/page.tsx` | Fix 1 unescaped entity |
| `app/learn/scenarios/page.tsx` | Fix 4 unescaped entities |
| `app/learn/scenarios/[category]/page.tsx` | Fix 1 unescaped entity |

---

## Acceptance Criteria

- [ ] `pnpm eslint app/learn --quiet` returns 0 errors
- [ ] `pnpm tsc --noEmit` still passes
- [ ] Module page renders correctly after variable rename
- [ ] No visual changes to any pages

---

## Testing

```bash
# Run ESLint
pnpm eslint app/learn --quiet

# Run TypeScript check
pnpm tsc --noEmit

# Verify pages still work
pnpm dev
# Visit /learn/market-intelligence/market-dynamics
```

---

## Implementation Notes

For unescaped entities, prefer curly quotes/apostrophes for better typography:
- `'` → `'` (curly apostrophe, U+2019)
- `"` → `"` or `"` (curly quotes)

Or use HTML entities:
- `'` → `&apos;`
- `"` → `&quot;`

The curly approach looks better but requires ensuring the file encoding supports it (UTF-8).
