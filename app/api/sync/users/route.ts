/**
 * CATALYST - Sync API: Users
 *
 * Returns all users who have logged in (have a user_profiles entry).
 * Joins with auth.users to include email and last sign-in.
 * Authenticated via SYNC_API_KEY bearer token.
 */

import { NextResponse } from "next/server"
import { validateSyncAuth, createSyncClient } from "../helpers"

export async function GET(request: Request) {
  const authError = validateSyncAuth(request)
  if (authError) return authError

  const { client, error: clientError } = createSyncClient()
  if (clientError) return clientError

  // Fetch user profiles
  const { data: profiles, error: profilesError } = await client
    .from("user_profiles")
    .select("id, full_name, role, certification_status, created_at, updated_at")
    .order("created_at", { ascending: true })

  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 500 })
  }

  // Fetch all auth users for email + last sign-in (service role required)
  // listUsers() is paginated — loop through all pages to avoid missing users
  const allAuthUsers: { id: string; email?: string; last_sign_in_at?: string | null }[] = []
  let page = 1
  const perPage = 1000

  while (true) {
    const { data: authData, error: authError2 } =
      await client.auth.admin.listUsers({ page, perPage })

    if (authError2) {
      return NextResponse.json({ error: authError2.message }, { status: 500 })
    }

    allAuthUsers.push(...authData.users)

    if (authData.users.length < perPage) break
    page++
  }

  // Merge profiles with auth data
  const authMap = new Map(
    allAuthUsers.map((u) => [
      u.id,
      { email: u.email, last_sign_in_at: u.last_sign_in_at },
    ])
  )

  const users = profiles.map((profile) => {
    const auth = authMap.get(profile.id)
    return {
      ...profile,
      email: auth?.email ?? null,
      last_sign_in_at: auth?.last_sign_in_at ?? null,
    }
  })

  return NextResponse.json(
    { users, count: users.length },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  )
}
