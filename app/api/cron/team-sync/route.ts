/**
 * CATALYST - Cron: Team Sync
 *
 * Links team_members (CMS) to auth.users / user_profiles (LMS) by matching
 * email addresses. Runs on a daily Vercel cron schedule.
 *
 * What it does:
 * 1. Fetches all team_members with an email address
 * 2. Looks up matching auth.users by email
 * 3. For matched users, ensures a user_profiles row exists
 * 4. Returns a summary of linked/unlinked members
 *
 * Authentication: CRON_SECRET (Vercel cron) or SYNC_API_KEY (manual trigger)
 */

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function validateAuth(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET
  const syncApiKey = process.env.SYNC_API_KEY

  const authHeader = request.headers.get("authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

  // Vercel cron sends CRON_SECRET as Authorization: Bearer <secret>
  if (cronSecret && token === cronSecret) return true
  // Manual trigger via SYNC_API_KEY
  if (syncApiKey && token === syncApiKey) return true

  return false
}

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) return null

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

async function runSync() {
  const client = createAdminClient()
  if (!client) {
    return { error: "Server configuration error", status: 500 }
  }

  // Fetch all team members with emails
  const { data: teamMembers, error: teamError } = await client
    .from("team_members")
    .select("id, name, email, role, is_founder")
    .not("email", "is", null)

  if (teamError) {
    return { error: `Failed to fetch team members: ${teamError.message}`, status: 500 }
  }

  if (!teamMembers?.length) {
    return { data: { linked: 0, unlinked: 0, total: 0, details: [] }, status: 200 }
  }

  // Fetch all auth users to match by email
  const allAuthUsers: { id: string; email?: string }[] = []
  let page = 1
  const perPage = 1000

  while (true) {
    const { data: authData, error: authError } =
      await client.auth.admin.listUsers({ page, perPage })

    if (authError) {
      return { error: `Failed to fetch auth users: ${authError.message}`, status: 500 }
    }

    allAuthUsers.push(...authData.users)
    if (authData.users.length < perPage) break
    page++
  }

  // Build email → auth user map
  const authByEmail = new Map(
    allAuthUsers
      .filter((u) => u.email)
      .map((u) => [u.email!.toLowerCase(), u.id])
  )

  const results: { name: string; email: string; linked: boolean; userId?: string }[] = []

  for (const member of teamMembers) {
    if (!member.email) continue

    const userId = authByEmail.get(member.email.toLowerCase())

    if (!userId) {
      results.push({ name: member.name, email: member.email, linked: false })
      continue
    }

    // Ensure user_profiles row exists for this auth user
    const { error: upsertError } = await client
      .from("user_profiles")
      .upsert(
        {
          id: userId,
          full_name: member.name,
          role: member.is_founder ? "admin" : undefined,
        },
        { onConflict: "id", ignoreDuplicates: false }
      )

    if (upsertError) {
      console.error(`Failed to upsert profile for ${member.email}:`, upsertError.message)
    }

    results.push({ name: member.name, email: member.email, linked: true, userId })
  }

  const linked = results.filter((r) => r.linked).length
  const unlinked = results.filter((r) => !r.linked).length

  return {
    data: {
      linked,
      unlinked,
      total: results.length,
      details: results,
    },
    status: 200,
  }
}

// POST — manual trigger or Vercel cron
export async function POST(request: Request) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await runSync()

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json(result.data, { status: 200 })
}

// GET — Vercel cron sends GET requests
export async function GET(request: Request) {
  if (!validateAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await runSync()

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json(result.data, { status: 200 })
}
