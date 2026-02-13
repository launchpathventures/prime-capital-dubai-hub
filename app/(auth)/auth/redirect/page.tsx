/**
 * CATALYST - Post-Login Redirect Page
 *
 * Routes users to the appropriate surface after authentication:
 * - Admin users: Shows a choice between Admin and Learn surfaces
 * - Non-admin users: Immediately redirects to /learn (server-side)
 */

import { redirect } from "next/navigation"
import { getUserWithProfile } from "@/lib/auth/require-auth"
import { Stack, Title, Text } from "@/components/core"
import { Logo } from "@/components/layout/logo"
import Link from "next/link"
import { ShieldIcon, GraduationCapIcon, ArrowRightIcon } from "lucide-react"

export const metadata = {
  title: "Choose Destination | Prime Capital Dubai",
  description: "Select where you'd like to go",
}

export default async function RedirectPage() {
  // getUserWithProfile redirects to /auth/login if not authenticated
  const { profile } = await getUserWithProfile()

  // Non-admin: skip chooser entirely — instant server redirect
  if (profile?.role !== "admin") {
    redirect("/learn")
  }

  const firstName = profile?.full_name?.split(" ")[0] || "there"

  return (
    <div className="auth-redirect-page">
      {/* Logo */}
      <div className="auth-redirect-logo">
        <Logo size="default" />
      </div>

      {/* Greeting */}
      <Stack gap="xs" className="text-center">
        <Title size="h3" align="center" className="font-headline">
          Welcome back, {firstName}
        </Title>
        <Text variant="muted" size="sm">
          Where would you like to go?
        </Text>
      </Stack>

      {/* Destination Cards */}
      <div className="auth-destination-grid">
        <Link href="/admin/dashboard" className="auth-destination-card">
          <div className="auth-destination-icon">
            <ShieldIcon className="h-6 w-6" />
          </div>
          <Stack gap="none" className="flex-1 min-w-0">
            <Text weight="medium" size="base">Admin</Text>
            <Text variant="muted" size="sm">Manage website content & users</Text>
          </Stack>
          <ArrowRightIcon className="h-4 w-4 text-muted-foreground auth-destination-arrow shrink-0" />
        </Link>

        <Link href="/learn" className="auth-destination-card">
          <div className="auth-destination-icon auth-destination-icon--learn">
            <GraduationCapIcon className="h-6 w-6" />
          </div>
          <Stack gap="none" className="flex-1 min-w-0">
            <Text weight="medium" size="base">Learning Portal</Text>
            <Text variant="muted" size="sm">Continue / monitor training</Text>
          </Stack>
          <ArrowRightIcon className="h-4 w-4 text-muted-foreground auth-destination-arrow shrink-0" />
        </Link>
      </div>
    </div>
  )
}
