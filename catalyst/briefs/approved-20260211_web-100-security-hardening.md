# Brief: Web Security Hardening

**ID:** WEB-100
**Status:** Approved
**Priority:** P0 — Blocks Production
**Surface:** Web + Root
**Estimate:** 1 day
**Tags:** security, production

---

## Objective

Harden the web surface against common security threats by adding HTTP security headers, rate limiting the leads API, and fixing authentication vulnerabilities. These are non-negotiable for a production real estate site handling HNW client data.

---

## Background

The production audit (11 Feb 2026) found **zero security headers** configured, **no rate limiting** on the public leads API, and several auth route vulnerabilities. For a site targeting high-net-worth individuals with their personal and financial data, this is a critical gap.

---

## Tasks

### 1. Add Security Headers (`next.config.ts`)

Add an `async headers()` function to `next.config.ts` with production-grade security headers applied to all routes:

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME-sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer leaking |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Restrict browser APIs |
| `Content-Security-Policy` | See below | Prevent XSS |

**CSP Policy (start permissive, tighten later):**
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https://images.unsplash.com https://*.supabase.co https://api.mapbox.com;
font-src 'self';
connect-src 'self' https://*.supabase.co https://api.mapbox.com https://va.vercel-scripts.com;
frame-src 'none';
```

> Note: `unsafe-inline` and `unsafe-eval` for scripts are needed initially for Next.js. Can be tightened with nonces later.

### 2. Add Rate Limiting to `/api/leads`

**File:** `app/api/leads/route.ts`

Implement IP-based rate limiting using an in-memory map (suitable for single-instance Vercel deployments):

- **Limit:** 5 submissions per IP per 15-minute window
- **Response:** 429 Too Many Requests with `Retry-After` header
- **Storage:** In-memory `Map<string, { count: number, resetAt: number }>` with periodic cleanup
- Clean up expired entries every 100 requests

### 3. Sanitize API Error Responses

**File:** `app/api/leads/route.ts`

- Replace Zod `.format()` error details with generic field-level messages
- Don't expose schema structure to the client
- Change from: `{ error: "Validation failed", details: zodError.format() }`
- Change to: `{ error: "Please check your form and try again." }`
- Keep detailed Zod errors in server-side logging only

### 4. Add Input Length Limits

**File:** `app/api/leads/route.ts` (Zod schema)

- Add `.max(500)` to `questionsText` and any free-text fields
- Add `.max(100)` to `firstName`, `lastName`, `email`
- Add `.max(20)` to `whatsapp`

### 5. Stop Logging PII

**File:** `app/api/leads/route.ts`

When the webhook fails or is missing, log a reference ID + form mode, not the full lead data:

```typescript
// Before:
console.log("Lead data (no webhook configured):", leadData)

// After:
console.log(`Lead received (no webhook): mode=${leadData.formMode}, ref=${Date.now()}`)
```

### 6. Remove Auth Sign-Out GET Handler

**File:** `app/api/auth/signout/route.ts`

- Remove the `GET` export entirely
- Keep only the `POST` handler
- Ensure all sign-out buttons use form POST or `fetch()`, not `<Link>`

### 7. Validate Auth Redirect Parameter

**File:** Auth callback route

- Validate the `redirect` query parameter is a relative path (starts with `/`)
- Reject absolute URLs to prevent open redirect attacks:
  ```typescript
  const redirect = searchParams.get("redirect")
  const safeRedirect = redirect?.startsWith("/") ? redirect : "/"
  ```

### 8. Scope Supabase Image Domain

**File:** `next.config.ts`

- Change `hostname: "*.supabase.co"` to your specific project: `hostname: "ebirxyrjwaulyqizcbcs.supabase.co"`
- This prevents loading images from any arbitrary Supabase project

---

## Acceptance Criteria

- [ ] All 8 security headers return on every response (verify with `curl -I`)
- [ ] Leads API returns 429 after 5 rapid submissions from same IP
- [ ] Zod validation errors don't expose schema internals
- [ ] Free-text fields have max length limits
- [ ] No PII appears in server logs
- [ ] GET requests to `/api/auth/signout` return 405
- [ ] Auth redirect only accepts relative paths
- [ ] `next.config.ts` image domains scoped to project

---

## Files to Modify

| File | Change |
|------|--------|
| `next.config.ts` | Add `headers()` function, scope image domain |
| `app/api/leads/route.ts` | Rate limiting, error sanitization, input limits, PII logging |
| `app/api/auth/signout/route.ts` | Remove GET handler |
| Auth callback route | Validate redirect param |

---

## Risks

- CSP may need tuning if third-party scripts are added later (analytics, chat widgets)
- In-memory rate limiting resets on deploy — acceptable for Vercel's serverless model (each cold start resets). For heavier protection, consider Vercel Edge middleware or Upstash Redis
