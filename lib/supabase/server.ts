/**
 * CATALYST - Supabase Server Client
 * 
 * Official Supabase SSR pattern for Next.js Server Components, 
 * Server Actions, and Route Handlers.
 * 
 * IMPORTANT: This file imports "next/headers" which only works in Server Components.
 * Do NOT import this file from client components or the barrel export.
 * 
 * @see https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { getSupabasePublicConfig } from "@/lib/supabase/config"

type CookieToSet = { name: string; value: string; options: CookieOptions }

/**
 * Create a Supabase client for server-side use.
 * 
 * Uses the official getAll/setAll pattern for proper cookie handling.
 * The setAll has a try/catch because Server Components can't write cookies
 * (that's handled by the middleware/proxy).
 */
export async function createClient() {
  const cookieStore = await cookies()
  const { url, publicKey } = getSupabasePublicConfig()

  return createServerClient(
    url,
    publicKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )
}

/**
 * Create a Supabase client for build-time use (no cookies required).
 * 
 * Use this in generateStaticParams and other build-time functions
 * that don't have access to request cookies.
 * 
 * NOTE: This client can only read public data (respects RLS with anon role).
 */
export function createStaticClient() {
  const { url, publicKey } = getSupabasePublicConfig()
  return createSupabaseClient(url, publicKey)
}
