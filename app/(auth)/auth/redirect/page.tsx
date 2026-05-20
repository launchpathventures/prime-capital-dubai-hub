/**
 * CATALYST - Post-Login Redirect Page
 *
 * Routes users to the right place after authentication:
 * - Multi-surface roles (admin, marketing) → /launch picker
 * - Single-surface roles (youtube_editor → YouTube Generator, learner → LMS)
 *   land directly on their surface
 *
 * Surface eligibility lives in lib/auth/surfaces.ts.
 */

import { redirect } from "next/navigation"
import { getUserWithProfile } from "@/lib/auth/require-auth"
import { getAccessibleSurfaces, type AppRole } from "@/lib/auth/surfaces"
import { config } from "@/lib/config"

export const metadata = {
  title: `Redirecting | ${config.app.name}`,
}

export default async function RedirectPage() {
  // getUserWithProfile redirects to /auth/login if not authenticated
  const { profile } = await getUserWithProfile()

  const role = (profile?.role as AppRole | undefined) ?? "learner"
  const surfaces = getAccessibleSurfaces(role)

  if (surfaces.length > 1) {
    redirect("/launch")
  }

  redirect(surfaces[0]?.href ?? "/learn")
}
