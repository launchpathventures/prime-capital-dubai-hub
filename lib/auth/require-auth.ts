/**
 * CATALYST - Auth Helpers
 *
 * Server-side helpers for requiring authentication in pages.
 * Use these in Server Components when you need user data.
 *
 * Note: The middleware already protects /learn routes.
 * These helpers are for pages that need user data, not for protection.
 */

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

/**
 * Require authenticated user.
 * Returns user data or redirects to login.
 *
 * Use in Server Components:
 * ```ts
 * export default async function Page() {
 *   const user = await requireAuth()
 *   // user is guaranteed to exist
 * }
 * ```
 */
export async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return user
}

/**
 * Require admin user.
 * Returns user and profile or redirects appropriately.
 *
 * Use in Server Components for admin pages:
 * ```ts
 * export default async function AdminPage() {
 *   const { user, profile } = await requireAdmin()
 *   // user has admin role
 * }
 * ```
 */
export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/learn")
  }

  return { user, profile }
}

/**
 * Get current user (optional).
 * Returns user or null, doesn't redirect.
 *
 * Use when you want to show different UI for auth/unauth:
 * ```ts
 * const user = await getOptionalUser()
 * if (user) { // show personalized content }
 * ```
 */
export async function getOptionalUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

/**
 * Get user with profile.
 * Returns user and profile or redirects.
 */
export async function getUserWithProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return { user, profile }
}

/**
 * Get user role for sidebar visibility.
 * Returns "admin" or "learner" (defaults to "learner" if not authenticated or no profile).
 * 
 * Use in Server Components to determine sidebar admin visibility:
 * ```ts
 * const userRole = await getUserRole()
 * <LearnShell userRole={userRole} />
 * ```
 */
export async function getUserRole(): Promise<"admin" | "learner"> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return "learner"
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  return profile?.role === "admin" ? "admin" : "learner"
}

/**
 * Get user data for header menu display.
 * Returns user info or null if not authenticated.
 */
export async function getUserForMenu(): Promise<{
  name: string
  email: string
  role: string
} | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single()

  return {
    name: profile?.full_name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    role: profile?.role === "admin" ? "Admin" : "Learner",
  }
}
