/**
 * CATALYST - Sign Out Route
 *
 * Signs out the user and redirects to sign in with a toast.
 * Handles all auth modes: demo, password, custom, supabase.
 *
 * Security: POST-only to prevent prefetch-triggered signouts.
 * Use form submission or fetch() to sign out, not <Link>.
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
