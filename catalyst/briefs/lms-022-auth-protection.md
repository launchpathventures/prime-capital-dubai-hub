# LMS-022: Auth Protection

**Status:** 📋 READY  
**Priority:** P0 Critical (blocks PROD)  
**Estimated Time:** 2-3 hours  
**Dependencies:** None  

---

## Objective

Add route-level authentication protection to all `/learn` routes. Unauthenticated users should be redirected to login. Admin routes require additional role-based access control.

---

## Context

The audit revealed that Learn surface pages fetch data without verifying user session first. While Supabase RLS protects the data layer, the pages themselves are accessible to unauthenticated users, potentially exposing UI shells and navigation.

Current state:
- Pages use `createClient()` and fetch data
- Some pages check `supabase.auth.getUser()` for progress tracking
- No middleware or layout-level auth check
- Admin routes (`/learn/admin/*`) have no role verification

---

## Deliverables

### 1. Create Learn Auth Middleware

Add middleware to protect all `/learn` routes:

```typescript
// middleware.ts (update existing or create)

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Only protect /learn routes
  if (!request.nextUrl.pathname.startsWith("/learn")) {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const redirectUrl = new URL("/auth/login", request.url)
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Admin routes require admin role
  if (request.nextUrl.pathname.startsWith("/learn/admin")) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/learn", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/learn/:path*"],
}
```

### 2. Update Auth Login to Handle Redirect

Ensure `/auth/login` respects the `redirectTo` query param:

```typescript
// In login form submission, after successful auth:
const redirectTo = searchParams.get("redirectTo") || "/learn"
router.push(redirectTo)
```

### 3. Add Auth Helper for Pages (Optional)

For pages that need user data, create a helper:

```typescript
// lib/auth/require-auth.ts
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }
  
  return user
}

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }
  
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  
  if (profile?.role !== "admin") {
    redirect("/learn")
  }
  
  return { user, profile }
}
```

---

## Acceptance Criteria

- [ ] Unauthenticated access to `/learn` redirects to `/auth/login?redirectTo=/learn`
- [ ] Unauthenticated access to `/learn/market-intelligence` redirects appropriately
- [ ] Non-admin access to `/learn/admin/*` redirects to `/learn`
- [ ] Admin users can access `/learn/admin/*` routes
- [ ] After login, user is redirected back to original destination
- [ ] Middleware doesn't break existing authenticated flows

---

## Testing

```bash
# Test unauthenticated access
curl -I http://localhost:3000/learn
# Should return 307 redirect to /auth/login

# Test admin protection (as non-admin user)
# Should redirect to /learn
```

---

## Notes

- Middleware runs on Edge, so keep it lightweight
- Consider caching user profile lookup if performance is an issue
- Auth check happens before page render, so no flash of content
