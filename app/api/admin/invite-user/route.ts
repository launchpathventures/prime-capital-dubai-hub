/**
 * CATALYST - Admin Create User API
 * 
 * API route for admins to create new users.
 * Uses Supabase Admin API to create users with a default password.
 */

import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Default password for new users created through admin panel
const DEFAULT_PASSWORD = "Prime$1234!"

export async function POST(request: Request) {
  // First check if current user is admin
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // Check admin role using our function
  const { data: isAdmin } = await serverClient.rpc('is_admin')
  
  if (!isAdmin) {
    return NextResponse.json({ error: "Access denied: Admin only" }, { status: 403 })
  }
  
  const formData = await request.formData()
  const email = formData.get("email") as string
  const fullName = formData.get("full_name") as string
  const role = formData.get("role") as string || "learner"
  
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }
  
  // Create admin client with service role
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
  }
  
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  })
  
  // Create user with default password
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password: DEFAULT_PASSWORD,
    email_confirm: true, // Auto-confirm email so they can login immediately
    user_metadata: {
      full_name: fullName,
      role: role,
    },
  })
  
  if (error) {
    console.error("Failed to invite user:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  // Create user profile
  if (data.user) {
    const { error: profileError } = await adminClient
      .from('user_profiles')
      .insert({
        id: data.user.id,
        full_name: fullName || null,
        role: role,
        certification_status: 'in_progress',
      })
    
    if (profileError) {
      console.error("Failed to create profile:", profileError)
      // User was created, but profile failed - still return success
    }
  }
  
  return NextResponse.json({ success: true, userId: data.user?.id })
}
