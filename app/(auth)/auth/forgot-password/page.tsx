/**
 * CATALYST - Forgot Password Page
 *
 * Password reset request (Supabase mode only).
 * In other modes, redirects to sign in.
 */

import { ForgotPasswordForm } from "./forgot-password-form"
import { getAuthConfig, isPasswordRecoveryEnabled } from "@/lib/auth"
import { Text, Title, Stack } from "@/components/core"
import { AuthCard } from "../../_surface/auth-card"
import { AuthDevCard } from "../../_surface/auth-dev-card"
import { redirect } from "next/navigation"
import Link from "next/link"

export const metadata = {
  title: "Forgot Password | Catalyst",
  description: "Reset your password",
}

export default function ForgotPasswordPage() {
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
              Forgot password?
            </Title>
            <Text variant="muted" size="sm">
              Enter your email and we&apos;ll send you a reset link
            </Text>
          </Stack>

          {/* Forgot Password Form */}
          <ForgotPasswordForm mode={authConfig.mode} />

          {/* Back to login link */}
          <Text size="sm" variant="muted" className="text-center">
            Remember your password?{" "}
            <Link 
              href="/auth/login" 
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </Text>
        </Stack>
      </AuthCard>

      {/* Dev Card */}
      <AuthDevCard mode={authConfig.mode} />
    </>
  )
}
