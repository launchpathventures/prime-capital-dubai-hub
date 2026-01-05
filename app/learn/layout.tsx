/**
 * CATALYST - Learn Route Group Layout
 *
 * Applies LearnShell to all pages in the learn route group.
 * Fetches user data server-side for display in header.
 *
 * AUTH:
 * - /learn routes should be protected (learner or admin role)
 * - This layout fetches user data for display
 * - User will always be authenticated when this layout renders
 */

import "./learn.css"
import { LearnShell } from "./_surface"
import { createClient } from "@/lib/supabase/server"

// -----------------------------------------------------------------------------
// User Data Fetching
// -----------------------------------------------------------------------------

interface LearnUser {
  name: string
  email: string
  role: string
  avatarUrl?: string
}

/**
 * Get authenticated user data for display in header.
 * User is guaranteed to be authenticated (protected by middleware).
 */
async function getUser(): Promise<LearnUser> {
  try {
    const supabase = await createClient()

    // getClaims() reads from the token directly, no network call
    const { data } = await supabase.auth.getClaims()
    const claims = data?.claims

    // For full user metadata, we still need getUser() but wrap in try/catch
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (claims || user) {
      const email = claims?.email || user?.email || ""
      const displayName =
        user?.user_metadata?.display_name ??
        user?.user_metadata?.full_name ??
        user?.user_metadata?.name ??
        email?.split("@")[0] ??
        "Learner"

      return {
        name: displayName,
        email,
        role: user?.user_metadata?.role || "learner",
        avatarUrl: user?.user_metadata?.avatar_url,
      }
    }
  } catch {
    // Fall through to default
  }

  // Fallback (edge case or demo mode)
  return {
    name: "Learner",
    email: "",
    role: "learner",
  }
}

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

export const metadata = {
  title: "Learning Portal | Prime Capital Dubai",
  description: "Prime Capital Dubai agent training and certification platform",
}

// -----------------------------------------------------------------------------
// Layout Component
// -----------------------------------------------------------------------------

export default async function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  return <LearnShell user={user}>{children}</LearnShell>
}
