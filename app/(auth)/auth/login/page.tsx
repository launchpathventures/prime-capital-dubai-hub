/**
 * CATALYST - Login Page
 *
 * Multi-mode login supporting:
 * - demo: accepts any credentials
 * - password: validates against configured password
 * - supabase: real Supabase authentication
 * - custom: calls custom API endpoint
 */

import { LoginForm } from "./login-form"
import { getAuthConfig, isRegistrationEnabled } from "@/lib/auth"
import { Text, Title, Stack } from "@/components/core"
import { AuthCard } from "../../_surface/auth-card"
import { AuthDevCard } from "../../_surface/auth-dev-card"
import Link from "next/link"

export const metadata = {
  title: "Sign In | Catalyst",
  description: "Sign in to your account",
}

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const authConfig = getAuthConfig()
  const showRegister = isRegistrationEnabled()
  const params = await searchParams
  
  // Use ?next param if provided, otherwise fall back to config
  const redirectTo = params.next || authConfig.redirectTo

  return (
    <>
      <AuthCard>
        <Stack gap="lg">
          {/* Header */}
          <Stack gap="xs" className="text-center">
            <Title size="h4" align="center">
              Welcome back
            </Title>
            <Text variant="muted" size="sm">
              {authConfig.mode === "password" 
                ? "Enter the password to sign in"
                : "Enter your credentials to sign in"
              }
            </Text>
          </Stack>

          {/* Login Form */}
          <LoginForm 
            mode={authConfig.mode} 
            redirectTo={redirectTo} 
          />

          {/* Registration link (Supabase mode only) */}
          {showRegister && (
            <Text size="sm" variant="muted" className="text-center">
              Don&apos;t have an account?{" "}
              <Link 
                href="/auth/register" 
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </Text>
          )}
        </Stack>
      </AuthCard>

      {/* Dev Card */}
      <AuthDevCard mode={authConfig.mode} />
    </>
  )
}
