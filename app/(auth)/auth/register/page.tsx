/**
 * CATALYST - Register Page
 *
 * User registration (Supabase mode only).
 * In other modes, redirects to sign in.
 */

import { RegisterForm } from "./register-form"
import { getAuthConfig, isRegistrationEnabled } from "@/lib/auth"
import { Text, Title, Stack } from "@/components/core"
import { AuthCard } from "../../_surface/auth-card"
import { AuthDevCard } from "../../_surface/auth-dev-card"
import { redirect } from "next/navigation"
import Link from "next/link"

export const metadata = {
  title: "Create Account | Catalyst",
  description: "Create a new account",
}

export default function RegisterPage() {
  const authConfig = getAuthConfig()
  const registrationEnabled = isRegistrationEnabled()

  // Registration only available in Supabase mode
  if (!registrationEnabled) {
    redirect("/auth/login")
  }

  return (
    <>
      <AuthCard>
        <Stack gap="lg">
          {/* Header */}
          <Stack gap="xs" className="text-center">
            <Title size="h4" align="center">
              Create an account
            </Title>
            <Text variant="muted" size="sm">
              Enter your details to get started
            </Text>
          </Stack>

          {/* Register Form */}
          <RegisterForm mode={authConfig.mode} redirectTo={authConfig.redirectTo} />

          {/* Login link */}
          <Text size="sm" variant="muted" className="text-center">
            Already have an account?{" "}
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
