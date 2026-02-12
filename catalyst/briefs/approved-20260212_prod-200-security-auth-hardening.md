# Brief: PROD Security & Auth Hardening

**ID:** PROD-200
**Status:** Approved
**Priority:** P0 — Blocks Production
**Surface:** App + Web + API
**Estimate:** 1–2 days
**Tags:** security, auth, production

---

## Objective

Eliminate critical auth and security gaps before PROD launch: enforce admin checks, remove hardcoded credentials, isolate service role key, add rate limiting on auth and AI-cost endpoints, and remove production debug logging.

---

## Background

The hardening audit (12 Feb 2026) found critical security issues: missing admin checks on sensitive routes, a hardcoded default password, potential exposure risk of the Supabase service role key, and no brute-force protection for auth endpoints.

---

## Tasks

### 1) Remove hardcoded default password
- Replace the default password string with a secure flow:
  - Preferred: Supabase invite + password reset
  - Alternate: ENV variable (`AUTH_DEFAULT_PASSWORD`) stored server-only
- Ensure the admin UI no longer displays a hardcoded password

### 2) Isolate Supabase service role key (server-only)
- Move `SUPABASE_SERVICE_ROLE_KEY` out of `lib/config.ts`
- Create a server-only config module (with `import "server-only"`)
- Ensure no client component can import it

### 3) Enforce admin checks on sensitive routes
- Add explicit admin validation to:
  - `app/api/admin/update-user/route.ts`
  - `app/api/admin/certification/download/route.ts`
  - `app/api/admin/generate-essentials/route.ts`
- Use existing admin check helper / RPC used in other routes

### 4) Remove public auth password fallback
- Remove use of `NEXT_PUBLIC_AUTH_PASSWORD` in server auth logic
- Accept only `AUTH_PASSWORD`

### 5) Add rate limiting to auth & AI-cost endpoints
- Add per-IP or per-user rate limits for:
  - `app/api/auth/validate-password/route.ts`
  - `app/api/auth/validate-custom/route.ts`
  - `app/api/coach/roleplay/route.ts`
  - `app/api/coach/chat/route.ts`
  - `app/api/speech-to-text/route.ts`
  - `app/api/feedback/transcribe/route.ts`
  - `app/api/admin/generate-essentials/route.ts`

### 6) Remove production debug logging
- Remove or guard `console.log` in:
  - `app/api/feedback/transcribe/route.ts`
  - `app/api/coach/roleplay/route.ts`
  - `app/api/coach/chat/route.ts`
  - Client roleplay/audio components

---

## Acceptance Criteria

- No hardcoded passwords remain in code or UI
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and unreachable by client bundles
- All admin-sensitive API routes require admin role
- Auth endpoints are rate-limited against brute-force
- AI-cost endpoints are rate-limited
- No production debug logging of user content

---

## Non-Goals

- Full SSO or enterprise auth (out of scope)
- Full WAF or infrastructure security changes
