/**
 * CATALYST - Sync API Helpers
 *
 * Shared utilities for the sync API endpoints.
 * Authenticates external services via a bearer token (SYNC_API_KEY).
 */

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { timingSafeEqual } from "crypto"

/**
 * Validate the SYNC_API_KEY bearer token from the request.
 * Returns an error response if invalid, or null if valid.
 */
export function validateSyncAuth(request: Request): NextResponse | null {
  const apiKey = process.env.SYNC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "Sync API is not configured" },
      { status: 503 }
    )
  }

  const authHeader = request.headers.get("authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

  if (!token || !safeCompare(token, apiKey)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return null
}

/** Constant-time string comparison to prevent timing attacks */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

/**
 * Create a Supabase admin client (service role) for sync queries.
 * Returns the client or an error response if not configured.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createSyncClient():
  | { client: ReturnType<typeof createClient<any>>; error?: never }
  | { client?: never; error: NextResponse } {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      error: NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      ),
    }
  }

  const client = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return { client }
}
