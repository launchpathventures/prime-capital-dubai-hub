# Brief: PROD Error Handling & Observability

**ID:** PROD-201
**Status:** Approved
**Priority:** P0 — Blocks Production
**Surface:** App + Web + Admin
**Estimate:** 1 day
**Tags:** observability, error-handling, production

---

## Objective

Ensure production-grade error handling and monitoring across all surfaces. Add missing error boundaries and loading states to admin/auth surfaces, and integrate a real error tracking service.

---

## Background

Audit findings show admin and auth surfaces lack `error.tsx` / `loading.tsx`, and error tracking is a console-only stub. For PROD, we need consistent UX and real error alerting.

---

## Tasks

### 1) Add admin surface error/loading states
- Create `app/(admin)/error.tsx` and `app/(admin)/loading.tsx`
- Match existing design system (`Title`, `Text`, `Button`)

### 2) Add auth surface error boundary
- Create `app/(auth)/error.tsx`

### 3) Add presentation surface error boundary (optional)
- Create `app/(present)/error.tsx` to avoid global-error fallback

### 4) Integrate error tracking service
- Add Sentry (or equivalent) and wire into `lib/error-tracking.ts`
- Ensure server + client capture
- Add environment vars to `.env.example`

### 5) Standardize server action error handling
- Wrap server actions in try/catch
- Return `{ success: false, error: "..." }` instead of raw throws

---

## Acceptance Criteria

- Admin + auth surfaces have branded error and loading states
- Global error boundary is used only as fallback
- Errors are sent to an external tracking service in production
- Server actions never throw raw errors to the client

---

## Non-Goals

- Full observability stack (APM, tracing) beyond error tracking
