/**
 * Profile Page
 *
 * User profile management page.
 *
 * DISPLAYS:
 * - ProfileForm: Real authenticated user (Supabase mode with valid session)
 * - ProfileGuest: Demo/showcase profile (demo/password modes, or no session)
 *
 * The guest version is intentionally separate to keep the authenticated
 * experience cleanly isolated from the demo version.
 */

import { config } from "@/lib/config"
import { getAuthConfig } from "@/lib/auth/config"
import { createClient } from "@/lib/supabase/server"
import { Container, Stack } from "@/components/core"
import { ProfileForm, type ProfileUser } from "./profile-form"
import { ProfileGuest } from "./profile-guest"
import { ProfileDevCard } from "./profile-dev-card"

export const metadata = {
  title: `Profile | ${config.app.name}`,
  description: "Manage your profile and account settings",
}

// -----------------------------------------------------------------------------
// Server-side User Fetching
// -----------------------------------------------------------------------------

async function getUser(): Promise<ProfileUser | null> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      email: user.email ?? "",
      emailVerified: !!user.email_confirmed_at,
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at ?? undefined,
      displayName: user.user_metadata?.display_name ?? user.user_metadata?.full_name ?? user.user_metadata?.name ?? undefined,
      avatarUrl: user.user_metadata?.avatar_url ?? undefined,
      // Supabase stores pending email change in new_email field
      pendingEmail: user.new_email ?? undefined,
    }
  } catch {
    return null
  }
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default async function ProfilePage() {
  const authConfig = getAuthConfig()
  const user = await getUser()
  
  // Check if account deletion is enabled (service role key configured)
  const canDeleteAccount = !!process.env.SUPABASE_SERVICE_ROLE_KEY
  
  // Determine which profile to show:
  // - Real profile: Supabase mode with authenticated user
  // - Guest profile: Demo/password modes, or Supabase without user
  const showRealProfile = authConfig.mode === "supabase" && user !== null

  return (
    <Container size="md" className="py-8">
      <Stack gap="lg">
        {/* ============================================================= */}
        {/* REAL PROFILE: Authenticated Supabase user                     */}
        {/* ============================================================= */}
        {showRealProfile && (
          <>
            {/* Dev Card - compact at top */}
            <ProfileDevCard mode={authConfig.mode} />

            {/* Profile Form - handles its own header now */}
            <ProfileForm mode={authConfig.mode} user={user} canDeleteAccount={canDeleteAccount} />
          </>
        )}

        {/* ============================================================= */}
        {/* GUEST PROFILE: Demo/password mode or no authenticated user    */}
        {/* ============================================================= */}
        {!showRealProfile && (
          <ProfileGuest mode={authConfig.mode} />
        )}
      </Stack>
    </Container>
  )
}
