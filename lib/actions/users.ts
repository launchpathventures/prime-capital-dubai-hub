/**
 * CATALYST - User Management Server Actions
 *
 * Server actions for updating user profiles (roles, etc.).
 * Uses service role client for updates since RLS policies on user_profiles
 * can silently fail when updating the same table used for the admin check.
 */

"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase service role configuration")
  }

  return createSupabaseClient(url, serviceRoleKey)
}

export type UserRole = "admin" | "marketing" | "learner"

export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<{ success: boolean; error?: string }> {
  // Verify caller is admin using the regular (RLS) client
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: callerProfile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (callerProfile?.role !== "admin") {
    return { success: false, error: "Not authorized" }
  }

  // Prevent removing own admin role
  if (userId === user.id && newRole !== "admin") {
    return { success: false, error: "Cannot remove your own admin role" }
  }

  // Use service role client for the update to bypass RLS recursion issue
  const adminClient = createServiceClient()
  const { error } = await adminClient
    .from("user_profiles")
    .update({ role: newRole })
    .eq("id", userId)

  if (error) {
    console.error("Failed to update user role:", error)
    return { success: false, error: "Failed to update role" }
  }

  revalidatePath("/admin/team")
  return { success: true }
}
