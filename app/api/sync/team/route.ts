/**
 * CATALYST - Sync API: Team Members
 *
 * Returns the full team roster from the CMS.
 * Authenticated via SYNC_API_KEY bearer token.
 */

import { NextResponse } from "next/server"
import { validateSyncAuth, createSyncClient } from "../helpers"

export async function GET(request: Request) {
  const authError = validateSyncAuth(request)
  if (authError) return authError

  const { client, error: clientError } = createSyncClient()
  if (clientError) return clientError

  const { data, error } = await client
    .from("team_members")
    .select(
      "id, slug, name, role, short_bio, email, phone, linkedin, photo, is_founder, published, display_order, created_at, updated_at"
    )
    .order("display_order", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(
    { team: data, count: data.length },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  )
}
