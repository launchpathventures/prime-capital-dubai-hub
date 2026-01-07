/**
 * CATALYST - App Route Group Layout
 *
 * Applies AppShell to all pages in the (app) route group.
 * Fetches user data server-side for display in header/nav.
 * 
 * AUTH:
 * - ALL /app routes are protected by proxy.ts (middleware)
 * - This layout only fetches user data for display, does NOT redirect
 * - User will always be authenticated when this layout renders
 */

import "./app.css"
import { AppShell } from "./_surface/app-shell"
import { createClient } from "@/lib/supabase/server"

// Force dynamic rendering - admin routes use auth and dynamic data
export const dynamic = "force-dynamic"

// -----------------------------------------------------------------------------
// User Data Fetching
// -----------------------------------------------------------------------------

interface AppUser {
  name: string
  email: string
  role: string
  avatarUrl?: string
}

/**
 * Get authenticated user data for display in header.
 * User is guaranteed to be authenticated (protected by middleware).
 * Uses getClaims() instead of getUser() to avoid network call - 
 * middleware already validated the session.
 */
async function getUser(): Promise<AppUser> {
  try {
    const supabase = await createClient()
    
    // getClaims() reads from the token directly, no network call
    const { data } = await supabase.auth.getClaims()
    const claims = data?.claims
    
    // For full user metadata, we still need getUser() but wrap in try/catch
    const { data: { user } } = await supabase.auth.getUser()

    if (claims || user) {
      const email = claims?.email || user?.email || ""
      const displayName = 
        user?.user_metadata?.display_name ?? 
        user?.user_metadata?.full_name ?? 
        user?.user_metadata?.name ?? 
        email?.split("@")[0] ?? 
        "User"

      return {
        name: displayName,
        email,
        role: "User",
        avatarUrl: user?.user_metadata?.avatar_url,
      }
    }
  } catch {
    // Fall through to default (shouldn't happen on protected routes)
  }

  // Fallback (edge case: middleware race condition or demo mode)
  return {
    name: "User",
    email: "",
    role: "Guest",
  }
}

// -----------------------------------------------------------------------------
// Layout Component
// -----------------------------------------------------------------------------

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  
  return (
    <AppShell user={user}>
      {children}
    </AppShell>
  )
}
