/**
 * CATALYST - Admin Update User API
 * 
 * API route for admins to update user profiles.
 */

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  
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
