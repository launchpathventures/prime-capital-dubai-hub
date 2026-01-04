/**
 * CATALYST - Supabase Browser Client
 * 
 * Official Supabase SSR pattern for Next.js Client Components.
 * 
 * @see https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs
 */

import { createBrowserClient } from "@supabase/ssr"
import { getSupabasePublicConfig } from "@/lib/supabase/config"

/**
 * Create a Supabase client for browser/client-side use.
 * 
 * This is the simplest pattern - just URL and key.
 * Cookie handling is automatic in the browser.
 */
export function createClient() {
  const { url, publicKey } = getSupabasePublicConfig()
  return createBrowserClient(url, publicKey)
}

/**
 * @deprecated Use createClient() instead. Kept for backward compatibility.
 */
export function createSupabaseBrowserClient() {
  return createClient()
}
