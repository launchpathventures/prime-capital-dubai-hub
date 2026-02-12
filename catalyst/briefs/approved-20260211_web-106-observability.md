# Brief: Observability & Error Tracking

**ID:** WEB-106
**Status:** Approved
**Priority:** P2 — Post-Launch Sprint
**Surface:** Root + Web
**Estimate:** 0.5 days
**Tags:** observability, monitoring, sentry, logging

---

## Objective

Connect the existing error tracking utility to a real monitoring service, add a health check endpoint for uptime monitors, and ensure all Supabase query failures are tracked — not just logged to ephemeral console output.

---

## Background

The codebase has a well-structured `lib/error-tracking.ts` utility with `trackError`, `trackWarning`, `trackInfo`, `setUser`, and `clearUser` functions. However, it currently only writes to `console.error` with structured JSON. There's a TODO comment for Sentry integration. Meanwhile, `lib/content.ts` uses raw `console.error` instead of the tracking utility.

Vercel Analytics is installed (good for performance) but provides no error alerting. If Supabase goes down at 2 AM, no one will know until users complain.

---

## Tasks

### 1. Install and Configure Sentry

**Action:**
```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

This will create:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- Update `next.config.ts` with Sentry webpack plugin

**Configuration:**
- DSN from Sentry project (environment variable: `SENTRY_DSN`)
- Environment: `process.env.NODE_ENV`
- Release: auto-detect from Vercel
- Sample rate: 1.0 for errors, 0.1 for performance (adjust as traffic grows)
- Add `SENTRY_DSN` to `.env.example`

### 2. Wire `trackError` to Sentry

**File:** `lib/error-tracking.ts`

Update the `trackError` function to forward errors to Sentry:

```typescript
import * as Sentry from '@sentry/nextjs'

export function trackError(
  error: Error | unknown,
  context: ErrorContext,
  severity: ErrorSeverity = "error"
): void {
  // ... existing structured logging ...
  
  // Forward to Sentry
  if (process.env.SENTRY_DSN) {
    Sentry.withScope((scope) => {
      scope.setTags({ context: context.context })
      scope.setExtras(context)
      scope.setLevel(severity === 'error' ? 'error' : severity === 'warning' ? 'warning' : 'info')
      if (context.userId) scope.setUser({ id: context.userId })
      Sentry.captureException(error instanceof Error ? error : new Error(String(error)))
    })
  }
}
```

### 3. Replace `console.error` with `trackError` in Content Layer

**File:** `lib/content.ts`

Every data fetching function uses `console.error` directly. Replace with `trackError`:

```typescript
// Before:
console.error("Error fetching properties:", error)

// After:
trackError(error, { context: 'content', action: 'getProperties' })
```

Do this for all functions:
- `getProperties`
- `getPropertyBySlug`
- `getServices`
- `getTeamMembers`
- `getTeamMemberBySlug`
- `getTestimonials`
- `getStats`

### 4. Add Health Check Endpoint

**File:** `app/api/health/route.ts` (new)

```typescript
import { NextResponse } from 'next/server'
import { createStaticClient } from '@/lib/supabase/static'

export async function GET() {
  const checks: Record<string, 'ok' | 'error'> = {}
  
  // Check Supabase connectivity
  try {
    const supabase = createStaticClient()
    const { error } = await supabase.from('properties').select('id').limit(1)
    checks.supabase = error ? 'error' : 'ok'
  } catch {
    checks.supabase = 'error'
  }
  
  const allOk = Object.values(checks).every(v => v === 'ok')
  
  return NextResponse.json(
    { status: allOk ? 'healthy' : 'degraded', checks, timestamp: new Date().toISOString() },
    { status: allOk ? 200 : 503 }
  )
}
```

- Returns 200 for healthy, 503 for degraded
- Can be polled by UptimeRobot, Vercel Crons, or similar
- Add `/api/health` to `robots.ts` Disallow list

### 5. Add Error Tracking to Error Boundaries

**Files:** `app/(web)/error.tsx`, `app/global-error.tsx` (created in WEB-103)

Ensure both error boundaries call `trackError`:

```typescript
useEffect(() => {
  trackError(error, { context: 'error-boundary', component: 'web' })
}, [error])
```

### 6. Update `.env.example`

Add the new environment variable:

```
# Error Tracking (Sentry)
SENTRY_DSN=
```

---

## Acceptance Criteria

- [ ] Sentry installed and configured for Next.js
- [ ] `trackError` forwards to Sentry when `SENTRY_DSN` is set
- [ ] All `console.error` calls in `lib/content.ts` replaced with `trackError`
- [ ] Error boundaries report to Sentry
- [ ] `/api/health` returns 200 when Supabase is reachable
- [ ] `/api/health` returns 503 when Supabase is unreachable
- [ ] `SENTRY_DSN` added to `.env.example`
- [ ] `/api/health` blocked in `robots.ts`

---

## Files to Create

| File | Purpose |
|------|---------|
| `app/api/health/route.ts` | Health check endpoint |
| `sentry.client.config.ts` | Sentry client config (auto-generated) |
| `sentry.server.config.ts` | Sentry server config (auto-generated) |

## Files to Modify

| File | Change |
|------|--------|
| `lib/error-tracking.ts` | Wire to Sentry |
| `lib/content.ts` | Replace console.error with trackError |
| `app/(web)/error.tsx` | Add trackError call |
| `app/global-error.tsx` | Add trackError call |
| `next.config.ts` | Sentry webpack plugin (auto-added by wizard) |
| `.env.example` | Add SENTRY_DSN |
| `app/robots.ts` | Disallow /api/health |

---

## Alternative to Sentry

If Sentry is not preferred, alternatives include:
- **Vercel Log Drain** → Datadog/Logtail (structured logs already output by `trackError`)
- **BetterStack (formerly LogTail)** — free tier, good for small sites
- **Axiom** — free tier with Vercel integration

The key requirement is: errors should trigger alerts, not sit in ephemeral Vercel function logs.
