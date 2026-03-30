/**
 * CATALYST - Admin Login-As API
 *
 * Generates a magic link to sign in as any user.
 * Admin-only, for testing purposes.
 */

import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

export async function POST(request: NextRequest) {
  // Verify current user is admin
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: isAdmin } = await serverClient.rpc("is_admin")
  if (!isAdmin) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 })
  }

  const { userId } = await request.json()
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  // Create admin client with service role
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Get the target user's email
  const { data: targetUser, error: userError } = await adminClient.auth.admin.getUserById(userId)

  if (userError || !targetUser?.user?.email) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Generate a magic link for the target user
  const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
    type: "magiclink",
    email: targetUser.user.email,
  })

  if (linkError || !linkData?.properties?.hashed_token) {
    console.error("Failed to generate magic link:", linkError)
    return NextResponse.json({ error: "Failed to generate login link" }, { status: 500 })
  }

  // Build the auth callback URL with the token
  const appUrl = config.app.url
  const loginUrl = `${appUrl}/api/auth/callback?token_hash=${linkData.properties.hashed_token}&type=magiclink&next=/auth/redirect`

  return NextResponse.json({
    success: true,
    loginUrl,
    email: targetUser.user.email,
  })
}
