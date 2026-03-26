/**
 * CATALYST - Generate Magic Link API
 *
 * Generates a magic login link for an existing user.
 * Admin-only. Uses Supabase Admin API.
 *
 * Supabase returns links with the project's site URL (production).
 * We rewrite them to use this app's origin so they work in any environment.
 */

import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  // Auth check
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: isAdmin } = await serverClient.rpc('is_admin')
  if (!isAdmin) {
    return NextResponse.json({ error: "Access denied: Admin only" }, { status: 403 })
  }

  const { email } = await request.json()
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data, error } = await adminClient.auth.admin.generateLink({
    type: "magiclink",
    email,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Build a direct link to our own callback using the hashed token
  // This bypasses Supabase's /auth/v1/verify which redirects to the Site URL
  const { origin } = new URL(request.url)
  const tokenHash = data?.properties?.hashed_token
  const callbackUrl = new URL("/api/auth/callback", origin)
  callbackUrl.searchParams.set("token_hash", tokenHash)
  callbackUrl.searchParams.set("type", "magiclink")
  callbackUrl.searchParams.set("next", "/learn")
  const magicLink = callbackUrl.toString()

  return NextResponse.json({ success: true, magicLink })
}
