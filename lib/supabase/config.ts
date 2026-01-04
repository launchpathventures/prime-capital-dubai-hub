/**
 * CATALYST - Supabase Configuration
 */

import { config } from "@/lib/config"

export type SupabasePublicConfig = {
  url: string
  publicKey: string
}

export type SupabaseServerConfig = {
  serviceRoleKey: string
}

/**
 * Centralized Supabase config access.
 * 
 * WHY: Keeps env lookups in one place and avoids accidental duplication.
 */
export function getSupabasePublicConfig(): SupabasePublicConfig {
  const publishableKey = config.supabase.publishableKey
  const anonKey = config.supabase.anonKey
  const publicKey = publishableKey || anonKey

  return {
    url: config.supabase.url,
    publicKey,
  }
}

export function getSupabaseServerConfig(): SupabaseServerConfig {
  return {
    serviceRoleKey: config.supabase.serviceRoleKey,
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, publicKey } = getSupabasePublicConfig()
  return Boolean(url && publicKey)
}

export function assertSupabaseConfigured(): SupabasePublicConfig {
  const { url, publicKey } = getSupabasePublicConfig()

  if (!url || !publicKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env.local."
    )
  }

  return { url, publicKey }
}
