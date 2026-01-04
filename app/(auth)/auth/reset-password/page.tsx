/**
 * CATALYST - Reset Password Page
 *
 * Password reset form (accessed via email link).
 * Supabase mode only.
 */

import { ResetPasswordForm } from "./reset-password-form"
import { getAuthConfig, isPasswordRecoveryEnabled } from "@/lib/auth"
import { Text, Title, Stack } from "@/components/core"
import { AuthCard } from "../../_surface/auth-card"
import { AuthDevCard } from "../../_surface/auth-dev-card"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Reset Password | Catalyst",
  description: "Set a new password",
}

export default function ResetPasswordPage() {
  const authConfig = getAuthConfig()
  const recoveryEnabled = isPasswordRecoveryEnabled()

  // Password recovery only available in Supabase mode
  if (!recoveryEnabled) {
    redirect("/auth/login")
  }

  return (
    <>
      <AuthCard>
        <Stack gap="lg">
          {/* Header */}
          <Stack gap="xs" className="text-center">
            <Title size="h4" align="center">
              Set new password
            </Title>
            <Text variant="muted" size="sm">
              Enter your new password below
            </Text>
          </Stack>

          {/* Reset Password Form */}
          <ResetPasswordForm mode={authConfig.mode} redirectTo={authConfig.redirectTo} />
        </Stack>
      </AuthCard>

      {/* Dev Card */}
      <AuthDevCard mode={authConfig.mode} />
    </>
  )
}
