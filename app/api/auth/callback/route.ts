/**
 * CATALYST - Supabase Auth Callback
 *
 * Handles auth callbacks from Supabase:
 * - OAuth sign-in (PKCE code exchange)
 * - Email verification (signup, magic link)
 * - Email change verification
 * - Password recovery
 * 
 * Uses the official Supabase SSR pattern.
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthConfig, isAllowedEmail } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const { redirectTo } = getAuthConfig()

  const code = searchParams.get("code")
  // Validate redirect is a relative path to prevent open redirect attacks
  const nextParam = searchParams.get("next")
  const next = nextParam?.startsWith("/") ? nextParam : redirectTo
  const type = searchParams.get("type")
  const tokenHash = searchParams.get("token_hash")
  const errorParam = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  const supabase = await createClient()

  // Handle error passed from Supabase (e.g., expired link)
  if (errorParam) {
    console.error("[Auth Callback] Supabase error:", errorParam, errorDescription)
    // For email change, redirect to profile with helpful message
    if (type === "email_change") {
      return redirectWithToast(origin, "/admin/profile", "email-link-expired")
    }
    return NextResponse.redirect(`${origin}/auth/login?error=${errorParam}`)
  }

  // 1. Handle PKCE code exchange (OAuth, magic link, email change)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error("[Auth Callback] Code exchange error:", error.message)
      // For email change, the change might have already completed
      // Check if user is authenticated before giving up
      if (type === "email_change") {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // User is authenticated - email change likely completed
          // The error might be "code already used" from clicking same link twice
          return redirectWithToast(origin, "/admin/profile", "email-updated")
        }
      }
      return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`)
    }
  }

  // 2. Handle token hash verification (some email flows)
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as "email_change" | "signup" | "recovery" | "email" | "magiclink",
      token_hash: tokenHash,
    })
    if (error) {
      console.error("[Auth Callback] OTP verification error:", error.message)
      return redirectWithToast(origin, "/admin/profile", "auth-error")
    }
  }

  // 3. Get user to determine appropriate toast
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`)
  }

  // 4. Verify email domain — only allowed company domains
  if (user.email && !isAllowedEmail(user.email)) {
    await supabase.auth.signOut()
    return NextResponse.redirect(`${origin}/auth/login?error=invalid_domain`)
  }

  // 5. Ensure user_profiles exists (defensive fallback for DB trigger)
  const { data: existingProfile } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("id", user.id)
    .single()

  if (!existingProfile) {
    const fullName = user.user_metadata?.full_name
      || user.user_metadata?.name
      || user.email?.split("@")[0]
      || "User"

    const role = user.email?.endsWith("@launchpathventures.com") ? "admin" : "learner"
    await supabase.from("user_profiles").insert({
      id: user.id,
      full_name: fullName,
      role,
      certification_status: "in_progress",
    })
  }

  // Determine toast based on context
  const toast = getToastType(type, next, user.new_email)
  
  // For recovery flow, redirect to profile page (authenticated) instead of auth page
  // This avoids the auth layout redirect issue
  if (type === "recovery") {
    return redirectWithToast(origin, "/admin/profile", "password-ready")
  }
  
  return redirectWithToast(origin, next, toast)
}

/**
 * Determine the appropriate toast message based on callback context.
 */
function getToastType(type: string | null, next: string, pendingEmail: string | null | undefined): string {
  // Email change flow - type will be "email_change" for both verification links
  // After clicking the SECOND link, the change is complete (no pending email)
  if (type === "email_change") {
    // pendingEmail = user.new_email from Supabase
    // If still set, user clicked the first link (old email), need to verify new email
    // If null/undefined, user clicked second link (new email), change is complete
    return pendingEmail ? "email-verified" : "email-updated"
  }

  // Password recovery
  if (type === "recovery") {
    return "password-updated"
  }

  // Default: sign in
  return "signed-in"
}

/**
 * Redirect with a toast query param.
 */
function redirectWithToast(origin: string, path: string, toast: string): NextResponse {
  const url = new URL(path, origin)
  url.searchParams.set("toast", toast)
  return NextResponse.redirect(url.toString())
}
