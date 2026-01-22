/**
 * CATALYST - Proxy (Middleware)
 *
 * Handles request-level logic at the network edge:
 * - Auth mode detection (demo, password, custom, supabase)
 * - Route protection for /app/* routes
 * - Redirect authenticated users away from /auth pages
 * - Docs access control (enabled check, password protection)
 *
 * Note: Next.js 16 renamed "middleware" to "proxy" to clarify its purpose.
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { CookieOptions } from "@supabase/ssr"

// -----------------------------------------------------------------------------
// Environment Configuration
// -----------------------------------------------------------------------------

// Docs access control
const DOCS_ENABLED = process.env.NEXT_PUBLIC_DOCS_ENABLED !== "false"
const DOCS_PASSWORD = (process.env.DOCS_PASSWORD || "").trim()
const DOCS_AUTH_COOKIE = "catalyst_docs_auth"

// Auth configuration - mirrors lib/auth/config.ts logic for edge runtime
// (We can't import from lib/ in middleware, so we duplicate the detection logic)
const AUTH_MODE = process.env.AUTH_MODE as
  | "demo"
  | "password"
  | "supabase"
  | "custom"
  | undefined
const AUTH_PASSWORD = process.env.AUTH_PASSWORD
const AUTH_CUSTOM_ENDPOINT = process.env.AUTH_CUSTOM_ENDPOINT
const AUTH_REDIRECT_TO = process.env.NEXT_PUBLIC_AUTH_REDIRECT_TO || "/learn"
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// -----------------------------------------------------------------------------
// Auth Mode Detection
// -----------------------------------------------------------------------------

type AuthMode = "demo" | "password" | "supabase" | "custom"

/**
 * Detect auth mode from environment.
 * Priority: explicit AUTH_MODE > custom > supabase > password > demo
 */
function getAuthMode(): AuthMode {
  if (AUTH_MODE) return AUTH_MODE
  if (AUTH_CUSTOM_ENDPOINT) return "custom"
  if (SUPABASE_URL && SUPABASE_KEY) return "supabase"
  if (AUTH_PASSWORD) return "password"
  return "demo"
}

// -----------------------------------------------------------------------------
// Proxy Handler
// -----------------------------------------------------------------------------

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isHttps = request.nextUrl.protocol === "https:"
  const authMode = getAuthMode()

  // Skip middleware for static files and API routes
  const isFileRequest = /\.[a-zA-Z0-9]+$/i.test(pathname)
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || isFileRequest) {
    return NextResponse.next()
  }

  // Default response (may be replaced by Supabase cookie handling)
  const response = NextResponse.next({ request: { headers: request.headers } })

  // ---------------------------------------------------------------------------
  // Auth: Route Protection
  // ---------------------------------------------------------------------------

  // Demo mode: No route protection - everything is accessible
  if (authMode === "demo") {
    // Skip auth checks entirely - proceed to docs access control
  }

  // Password/Custom mode: Check catalyst_auth_session cookie
  else if (authMode === "password" || authMode === "custom") {
    const sessionCookie = request.cookies.get("catalyst_auth_session")
    const isAuthenticated = sessionCookie?.value === "authenticated"

    // Protect /admin/* routes
    if (pathname.startsWith("/admin") && !isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Protect /learn/* routes
    if (pathname.startsWith("/learn") && !isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Redirect authenticated users away from auth pages (except signout)
    if (pathname.startsWith("/auth") && !isSignoutPath(pathname) && isAuthenticated) {
      // Respect ?next parameter if provided, otherwise use default redirect
      const nextParam = request.nextUrl.searchParams.get("next")
      const redirectTarget = nextParam || AUTH_REDIRECT_TO
      return NextResponse.redirect(new URL(redirectTarget, request.url))
    }
  }

  // Supabase mode: Check Supabase session with token refresh
  else if (authMode === "supabase" && SUPABASE_URL && SUPABASE_KEY) {
    // Create Supabase client with cookie handling
    // Uses getAll/setAll pattern required by @supabase/ssr 0.8.0+
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          // Update response with new cookies (token refresh)
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              ...options,
              secure: options.secure ?? isHttps,
            })
          })
        },
      },
    })

    // Get user (also refreshes token if needed)
    const { data } = await supabase.auth.getUser()
    const user = data.user

    // Protect /admin/* routes - require authentication AND admin role
    if (pathname.startsWith("/admin")) {
      if (!user) {
        const loginUrl = new URL("/auth/login", request.url)
        loginUrl.searchParams.set("next", pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Admin routes require admin role
      const { data: adminProfile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (adminProfile?.role !== "admin") {
        // Non-admin users redirected to learn home
        return NextResponse.redirect(new URL("/learn", request.url))
      }
    }

    // Protect /learn/* routes (LMS requires authentication)
    if (pathname.startsWith("/learn") && !user) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Admin routes within /learn require admin role
    if (pathname.startsWith("/learn/admin") && user) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profile?.role !== "admin") {
        // Non-admin users redirected to learn home
        return NextResponse.redirect(new URL("/learn", request.url))
      }
    }

    // Redirect authenticated users away from auth pages (except signout)
    if (pathname.startsWith("/auth") && !isSignoutPath(pathname) && user) {
      // Respect ?next parameter if provided, otherwise use default redirect
      const nextParam = request.nextUrl.searchParams.get("next")
      const redirectTarget = nextParam || AUTH_REDIRECT_TO
      return NextResponse.redirect(new URL(redirectTarget, request.url))
    }
  }

  // Redirect /auth/signout page to API route (for all modes)
  if (pathname === "/auth/signout") {
    return NextResponse.redirect(new URL("/api/auth/signout", request.url))
  }

  // ---------------------------------------------------------------------------
  // Docs: Access Control
  // ---------------------------------------------------------------------------

  if (pathname.startsWith("/docs")) {
    // Check if docs are enabled in production
    if (process.env.NODE_ENV === "production" && !DOCS_ENABLED) {
      return new NextResponse("Not Found", { status: 404 })
    }

    // Optional docs password protection (activates whenever DOCS_PASSWORD is set)
    if (DOCS_PASSWORD) {
      const expectedToken = await sha256Base64Url(DOCS_PASSWORD)
      const cookieToken = request.cookies.get(DOCS_AUTH_COOKIE)?.value
      const isAuthed = cookieToken === expectedToken

      // Allow the login page itself (but redirect away if already authed)
      if (pathname === "/docs/login") {
        if (isAuthed) {
          const redirect = request.nextUrl.searchParams.get("redirect") || "/docs"
          const safeRedirect = redirect.startsWith("/") ? redirect : "/docs"
          return NextResponse.redirect(new URL(safeRedirect, request.url))
        }
        return response
      }

      // If a password is provided as a query param, validate it and set cookie
      const providedPassword = request.nextUrl.searchParams.get("password")
      if (!isAuthed && providedPassword) {
        if (providedPassword === DOCS_PASSWORD) {
          const cleanUrl = request.nextUrl.clone()
          cleanUrl.searchParams.delete("password")
          cleanUrl.searchParams.delete("error")

          const redirectResponse = NextResponse.redirect(cleanUrl)
          redirectResponse.cookies.set(DOCS_AUTH_COOKIE, expectedToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: isHttps,
            path: "/docs",
            maxAge: 60 * 60 * 24 * 30,
          })
          return redirectResponse
        }

        const loginUrl = new URL("/docs/login", request.url)
        const redirectTo = request.nextUrl.clone()
        redirectTo.searchParams.delete("password")
        redirectTo.searchParams.delete("error")
        loginUrl.searchParams.set("redirect", redirectTo.pathname + redirectTo.search)
        loginUrl.searchParams.set("error", "invalid")
        return NextResponse.redirect(loginUrl)
      }

      // Otherwise require login
      if (!isAuthed) {
        const loginUrl = new URL("/docs/login", request.url)
        loginUrl.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search)
        return NextResponse.redirect(loginUrl)
      }
    }
  }

  return response
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/** Check if path is a signout route (don't redirect away from these) */
function isSignoutPath(pathname: string): boolean {
  return pathname === "/auth/signout" || pathname === "/api/auth/signout"
}

// -----------------------------------------------------------------------------
// Config
// -----------------------------------------------------------------------------

export const config = {
  matcher: [
    // Match all routes except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

async function sha256Base64Url(value: string): Promise<string> {
  const data = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest("SHA-256", data)
  const bytes = new Uint8Array(digest)

  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  const base64 = btoa(binary)
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}
