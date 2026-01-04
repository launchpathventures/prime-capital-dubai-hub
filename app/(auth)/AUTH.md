# CATALYST - Auth Surface

Authentication pages for sign in, registration, and password recovery.

---

## Quick Reference

**Key Files:**
| File | Purpose |
|------|---------|
| `lib/auth/config.ts` | Auth mode detection, `getAuthMode()`, `getAuthConfig()` |
| `proxy.ts` | Route protection for password/custom modes, docs access |
| `app/(app)/layout.tsx` | Route protection for Supabase mode |
| `app/(auth)/layout.tsx` | Redirect authenticated users away from auth pages |
| `app/api/auth/*` | API endpoints (callback, signout, delete-account) |
| `app/(auth)/auth/*/` | Auth page components |

**Environment Variables:**
```bash
AUTH_MODE=supabase              # demo | password | supabase | custom
AUTH_PASSWORD=secret            # For password mode
AUTH_CUSTOM_ENDPOINT=https://   # For custom mode
NEXT_PUBLIC_AUTH_REDIRECT_TO=/app/dashboard
SUPABASE_SERVICE_ROLE_KEY=...   # Required for account deletion
```

**Common Tasks:**
- Change redirect after sign in → Update `NEXT_PUBLIC_AUTH_REDIRECT_TO`
- Add new protected routes → Add them under `app/(app)/` route group
- Modify form validation → Edit `*-form.tsx` in each auth route
- Update auth UI → Edit `auth.css` or `_surface/` components

---

## Overview

The `(auth)` surface provides pre-authentication screens with a minimal centered layout.
These pages do not use the AppShell sidebar/header — they're designed for focused authentication flows.

---

## Terminology

We use **"Sign in" / "Sign out"** (not "Login" / "Logout") throughout Catalyst. This aligns with:
- Supabase API naming (`signInWithPassword()`, `signOut()`)
- Industry standard (Google, Microsoft, Apple, GitHub all use "Sign in")

---

## Auth Modes

Catalyst supports multiple authentication modes configured via environment variables:

| Mode | Use Case | Config |
|------|----------|--------|
| `demo` | Development/demos — accepts any credentials | Default when nothing configured |
| `password` | Simple password protection for sites | Set `AUTH_PASSWORD` env var |
| `supabase` | Full auth with Supabase | Configure Supabase env vars |
| `custom` | Custom API endpoint | Set `AUTH_CUSTOM_ENDPOINT` env var |

### Mode Priority

The system auto-detects mode based on configuration:
1. If `AUTH_CUSTOM_ENDPOINT` is set → `custom` mode
2. If Supabase is configured → `supabase` mode
3. If `AUTH_PASSWORD` is set → `password` mode
4. Otherwise → `demo` mode

### Environment Variables

```bash
# Explicit mode override (optional)
AUTH_MODE=demo|password|supabase|custom

# Password mode
AUTH_PASSWORD=your-secret-password

# Custom mode  
AUTH_CUSTOM_ENDPOINT=https://api.example.com/auth

# Redirect after login (default: /app)
NEXT_PUBLIC_AUTH_REDIRECT_TO=/dashboard
```

---

## Routes

| Route | Purpose | Availability |
|-------|---------|--------------|
| `/auth/login` | Sign in page | All modes |
| `/auth/register` | Create account | demo, supabase, custom |
| `/auth/forgot-password` | Request password reset | demo, supabase, custom |
| `/auth/reset-password` | Set new password (from email link) | demo, supabase, custom |
| `/auth/verify-email` | Email verification status | Supabase only |
| `/auth/success` | Generic success page | All modes |

### Form Behavior by Mode

| Mode | Sign in | Register | Forgot/Reset |
|------|---------|----------|--------------|
| `demo` | Accepts any input, redirects | Shows success (UI preview) | Shows success (UI preview) |
| `password` | Validates against `AUTH_PASSWORD` | Disabled (redirects to sign in) | Disabled (redirects to sign in) |
| `supabase` | Authenticates via Supabase | Creates user, sends confirmation | Sends/processes reset email |
| `custom` | POST `{ action: "login", ... }` | POST `{ action: "register", ... }` | POST `{ action: "forgot-password/reset-password", ... }` |

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/callback` | GET | Handles Supabase email link callbacks (confirmation, password reset, email change) |
| `/api/auth/signout` | GET/POST | Signs out user and clears session cookies |
| `/api/auth/validate-password` | POST | Validates password for password mode, sets session cookie |
| `/api/auth/validate-custom` | POST | Proxies requests to custom endpoint, sets session cookie on login |
| `/api/auth/delete-account` | DELETE | Deletes user account (requires `SUPABASE_SERVICE_ROLE_KEY`) |

### Custom Mode API Contract

When using custom mode, all auth forms POST to `/api/auth/validate-custom`, which proxies to your `AUTH_CUSTOM_ENDPOINT`.

**Request format:**
```json
{
  "action": "login" | "register" | "forgot-password" | "reset-password",
  "email": "user@example.com",
  "password": "...",
  "name": "..." // Only for register
}
```

**Expected response:**
```json
{
  "success": true | false,
  "error": "Optional error message"
}
```

On successful login, the proxy sets a `catalyst_auth_session` cookie for route protection.

---

## Supabase Auth Flow

When Supabase is configured, the auth flow works as follows:

1. **Registration** → User submits form → Supabase creates unconfirmed user → Confirmation email sent
2. **Email Confirmation** → User clicks link → `/api/auth/callback` exchanges code for session → Redirect to app
3. **Sign In** → User submits credentials → Supabase validates → Session cookie set → Redirect to app
4. **Password Reset** → User requests reset → Email sent → User clicks link → `/auth/reset-password` with token
5. **Email Change** → User requests change → Verification emails sent to both old and new addresses → Both must be clicked → Callback updates email
6. **Sign Out** → `/auth/signout` → Clears session → Redirect to sign in

### Secure Email Change

By default, Supabase requires verification from **both** the old and new email addresses when changing email. The callback route handles this by checking `user.new_email`:
- If `new_email` exists → Partial verification (show "email-verified" toast, waiting for second click)
- If `new_email` is null → Full verification complete (show "email-updated" success toast)

### Route Protection Architecture

**Route protection for /app/* subpages** (all modes):
- `proxy.ts` — Checks auth, redirects to `/auth/login` if no user
- `/app` itself is a public landing page, NOT protected

**Redirect authenticated users away from /auth** (Supabase mode only):
- `(auth)/layout.tsx` — Checks auth, redirects to `/app` if user IS authenticated
- This is done in layout to avoid cookie propagation race after login

**Password/Custom modes**:
- Both protections handled in `proxy.ts` (simple cookie check, no race conditions)

### Session Management

The auth system handles:
- Session validation via `supabase.auth.getUser()` in proxy
- Route protection for `/app/*` subpages
- Redirect authenticated users away from `/auth/*` (except signout/reset-password)

### Email Confirmation Detection

The register form automatically detects if email confirmation is required:
- If `data.session` exists after signup → Auto-confirmed, redirect immediately
- If `data.session` is null → Confirmation required, show "Check your email" screen

### Account Deletion

Account deletion requires the Supabase Admin API (service role key):
- If `SUPABASE_SERVICE_ROLE_KEY` is set → Delete button shown on profile page
- If not set → "Contact an administrator" message shown instead

The delete endpoint is `/api/auth/delete-account` (DELETE request).

---

## Security

### Bot Protection (CAPTCHA)

Supabase has built-in CAPTCHA support. Enable it via the dashboard (no code changes needed):

1. Go to **Supabase Dashboard** → **Authentication** → **Bot and Abuse Protection**
2. Enable **CAPTCHA protection**
3. Choose provider:
   - **Cloudflare Turnstile** (recommended) — Free, privacy-focused, often invisible
   - **hCaptcha** — Privacy-focused alternative
4. Add your site key and secret key from the provider
5. Save

Once enabled, Supabase automatically protects:
- Sign up
- Sign in  
- Password recovery

### Rate Limiting

Supabase includes built-in rate limiting:
- **Sign in**: 30 requests per hour per IP
- **Sign up**: 6 requests per hour per IP
- **Password recovery**: 6 requests per hour per IP

These limits are configurable in Supabase Dashboard → Authentication → Rate Limits.

### Password Requirements

- Minimum 5 characters (configurable in forms)
- Consider enabling "Leaked password protection" in Supabase Dashboard

---

## Structure

```
app/(auth)/
├── AUTH.md                          # This file
├── auth.css                         # Polished centered styles
├── layout.tsx                       # Uses AuthShell
├── _surface/
│   ├── auth-shell.tsx               # Centered shell with branding
│   ├── auth-card.tsx                # Main auth card with logo + footer
│   ├── auth-dev-card.tsx            # Auth-specific dev tools
│   └── auth-modes.ts                # Mode labels and descriptions
└── auth/
    ├── login/
    │   ├── page.tsx
    │   └── login-form.tsx
    ├── register/
    │   ├── page.tsx
    │   └── register-form.tsx
    ├── forgot-password/
    │   ├── page.tsx
    │   └── forgot-password-form.tsx
    ├── reset-password/
    │   ├── page.tsx
    │   └── reset-password-form.tsx
    ├── verify-email/
    │   └── page.tsx
    └── success/
        └── page.tsx

app/api/auth/
├── callback/
│   └── route.ts                     # Supabase email link handler
└── signout/
    └── route.ts                     # Sign out handler
```

---

## Content Layout System

The auth surface uses CSS custom properties to centralize layout control. The auth layout is uniquely simple — a centered card with a floating header.

### CSS Variables

```css
:root {
  --auth-content-width: 420px;     /* Form card max-width */
  --auth-content-padding: 1.5rem;  /* Shell padding around card */
}
```

### Layout Classes

| Class | Purpose |
|-------|---------|
| `.auth-content` | Applied to shell, provides padding variable |
| `.auth-shell` | Full-viewport centered container with background |
| `.auth-container` | Centers the auth card (uses flex centering) |
| `.auth-card` | The form card itself (uses `--auth-content-width`) |

### Structure

```
.auth-shell.auth-content          ← Padding from CSS variable
  .auth-header                    ← Floating positioned header
  .auth-container                 ← Flex center container
    .auth-card                    ← Form card (max-width from variable)
      [form content]
```

### Changing Form Width

To adjust the auth form width globally, update the CSS variable:

```css
/* In auth.css */
:root {
  --auth-content-width: 480px;  /* Wider forms */
}
```

---

## Dev Card

The auth dev card appears below the auth card and shows:
- Current auth mode badge (Demo, Password, Supabase, Custom)
- Mode description and configuration hint
- Links to all auth screens for testing

### Visibility

Dev cards use the global `devTools` config from `lib/config.ts`:

```bash
# Hide all dev tools
NEXT_PUBLIC_DEV_TOOLS=false

# Show only in development (hide in production)
NEXT_PUBLIC_DEV_TOOLS_DEV_ONLY=true
```

### Extending DevCard

The auth surface uses `AuthDevCard` which wraps the generic `DevCard`:

```tsx
import { DevCard, DevCardBadge } from "@/components/shared"

<DevCard 
  title="Auth"                                    // Shows "Dev Tools: Auth"
  badge={<DevCardBadge>Demo</DevCardBadge>}       // Top-right badge
  footer={<Text size="xs">Hint text</Text>}       // Optional footer
>
  {/* Content */}
</DevCard>
```

---

## Styling

The auth surface uses a polished, centered design:
- Gradient orb background with subtle grid overlay
- Card-style form with elegant shadows
- Smooth fade-in animation
- Mode badge in top-right corner
- Mobile-responsive layout

Customise in `auth.css` or override in individual pages.
