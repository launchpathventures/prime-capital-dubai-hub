/**
 * CATALYST - Admin Update User API
 *
 * API route for admins to update user profiles.
 * Requires admin role to access.
 */

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Admin role check
  const { data: isAdmin } = await supabase.rpc('is_admin')

  if (!isAdmin) {
    return NextResponse.json({ error: "Access denied: Admin only" }, { status: 403 })
  }

  const formData = await request.formData()
  const userId = formData.get("user_id") as string
  const fullName = formData.get("full_name") as string
  const role = formData.get("role") as string
  const certificationStatus = formData.get("certification_status") as string
  
  const { error } = await supabase.rpc('admin_update_user', {
    user_id: userId,
    new_full_name: fullName || null,
    new_role: role || null,
    new_certification_status: certificationStatus || null,
  })
  
  if (error) {
    console.error("Failed to update user:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json({ success: true })
}
