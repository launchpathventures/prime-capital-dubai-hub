/**
 * CATALYST - Sign Out Route
 *
 * Signs out the user and redirects to sign in with a toast.
 * Handles all auth modes: demo, password, custom, supabase.
 *
 * ⚠️ PREFETCH WARNING
 * -------------------
 * This route has both GET and POST handlers. The GET handler exists to support
 * <Link> navigation, but this creates a dangerous prefetch scenario:
 *
 * Next.js <Link> components prefetch linked routes by default when they enter
 * the viewport. If a Link to this route is visible, Next.js will prefetch it,
 * triggering the GET handler and signing the user out unexpectedly!
 *
 * SOLUTION: Always use prefetch={false} when linking to this route:
 *   ✅ <Link href="/api/auth/signout" prefetch={false}>Sign out</Link>
 *   ❌ <Link href="/api/auth/signout">Sign out</Link>  ← WILL CAUSE LOGOUT!
 *
 * @see https://nextjs.org/docs/app/api-reference/components/link#prefetch
 */

import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getAuthMode } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

// -----------------------------------------------------------------------------
// POST Handler
// -----------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const { origin } = new URL(request.url)
  const cookieStore = await cookies()
  const mode = getAuthMode()

  // Sign out from Supabase (only in supabase mode)
  if (mode === "supabase") {
    try {
      const supabase = await createClient()
      await supabase.auth.signOut({ scope: "global" })

      // Explicitly clear all Supabase auth cookies
      // Supabase stores cookies with names like: sb-<project-ref>-auth-token
      const allCookies = cookieStore.getAll()
      for (const cookie of allCookies) {
        if (cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token")) {
          cookieStore.set(cookie.name, "", { maxAge: 0, path: "/" })
        }
      }
    } catch {
      // Continue with redirect even if Supabase signout fails
    }
  }

  // Clear simple session cookie (used by password/custom modes)
  // Always clear this for backward compatibility
  cookieStore.set("catalyst_auth_session", "", { maxAge: 0, path: "/" })

  // Redirect to sign in with toast
  return NextResponse.redirect(`${origin}/auth/login?toast=signed-out`, { status: 303 })
}

// -----------------------------------------------------------------------------
// GET Handler - For <Link> navigation
// -----------------------------------------------------------------------------
// ⚠️ IMPORTANT: Any <Link> pointing here MUST have prefetch={false}
// Otherwise Next.js will prefetch this route and sign the user out!
//
// Safe usage:   <Link href="/api/auth/signout" prefetch={false}>
// UNSAFE usage: <Link href="/api/auth/signout">  ← Will prefetch and logout!
// -----------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  return POST(request)
}
