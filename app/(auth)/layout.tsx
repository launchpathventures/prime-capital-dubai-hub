/**
 * CATALYST - Auth Route Group Layout
 *
 * Simple layout for auth pages - no auth checks here.
 * 
 * AUTH:
 * - Route protection and redirects happen in proxy.ts (middleware)
 * - This layout just renders the AuthShell
 */

import "./auth.css"
import { AuthShell } from "./_surface/auth-shell"

// -----------------------------------------------------------------------------
// TEMPORARILY DISABLED: Auth redirect logic
// This is now handled in proxy.ts for consistency.
// Uncomment if needed for multi-auth mode support later.
// -----------------------------------------------------------------------------
// import { cookies } from "next/headers"
// import { redirect } from "next/navigation"
// import { getAuthMode, getAuthConfig } from "@/lib/auth/config"
// import { isSupabaseConfigured } from "@/lib/supabase/config"
// import { createClient } from "@/lib/supabase/server"
//
// async function isAuthenticated(): Promise<boolean> {
//   const mode = getAuthMode()
//   if (mode !== "supabase" || !isSupabaseConfigured()) return false
//   try {
//     const supabase = await createClient()
//     const { data: { user }, error } = await supabase.auth.getUser()
//     return !error && !!user
//   } catch {
//     return false
//   }
// }
// -----------------------------------------------------------------------------

export default async function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth redirect is handled in proxy.ts - no checks needed here
  return (
    <AuthShell>
      {children}
    </AuthShell>
  )
}
