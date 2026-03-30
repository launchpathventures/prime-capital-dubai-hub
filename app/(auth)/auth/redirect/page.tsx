/**
 * CATALYST - Post-Login Redirect Page
 *
 * Routes users to the appropriate surface after authentication:
 * - Admin/marketing users: Redirects to /admin/dashboard
 * - All other users: Redirects to /learn
 */

import { redirect } from "next/navigation"
import { getUserWithProfile } from "@/lib/auth/require-auth"
import { config } from "@/lib/config"

export const metadata = {
  title: `Redirecting | ${config.app.name}`,
}

export default async function RedirectPage() {
  // getUserWithProfile redirects to /auth/login if not authenticated
  const { profile } = await getUserWithProfile()

  // Admin/marketing: straight to admin dashboard
  if (profile?.role === "admin" || profile?.role === "marketing") {
    redirect("/admin/dashboard")
  }

  // Everyone else: learning portal
  redirect("/learn")
}
