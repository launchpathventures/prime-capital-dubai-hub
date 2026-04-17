/**
 * CATALYST - Sign Out Route
 *
 * Signs out the user and redirects to sign in with a toast.
 * Handles all auth modes: demo, password, custom, supabase.
 *
 * Accepts GET and POST. Links to this route MUST set `prefetch={false}` to
 * avoid prefetch-triggered signouts. The signout components in
 * `components/shared/signout.tsx` already do this.
 */

import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getAuthMode } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

async function handleSignout(request: NextRequest) {
  const { origin } = new URL(request.url)
  const cookieStore = await cookies()
  const mode = getAuthMode()

  if (mode === "supabase") {
    try {
      const supabase = await createClient()
      await supabase.auth.signOut({ scope: "global" })

      // Supabase stores cookies named like: sb-<project-ref>-auth-token
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
  cookieStore.set("catalyst_auth_session", "", { maxAge: 0, path: "/" })

  return NextResponse.redirect(`${origin}/auth/login?toast=signed-out`, { status: 303 })
}

export const GET = handleSignout
export const POST = handleSignout
