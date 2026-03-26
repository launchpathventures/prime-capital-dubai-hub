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
import { getAuthConfig } from "@/lib/auth"
import { Text, Title, Stack } from "@/components/core"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"
import { AuthCard } from "../../_surface/auth-card"
import { AuthDevCard } from "../../_surface/auth-dev-card"
import { headers } from "next/headers"

export const metadata = {
  title: "Sign In | Catalyst",
  description: "Sign in to your account",
}

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string }>
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid_domain: "Only authorized company accounts can sign in.",
  auth_callback_error: "Authentication failed. Please try again.",
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const authConfig = getAuthConfig()
  const params = await searchParams
  const headersList = await headers()
  const host = headersList.get("host") || ""
  const isLocalhost = host.startsWith("localhost") || host.startsWith("127.0.0.1")

  // Use ?next param if provided, otherwise fall back to config
  const redirectTo = params.next || authConfig.redirectTo
  const errorMessage = params.error ? ERROR_MESSAGES[params.error] : null

  // Production supabase mode: Google-only
  const isGoogleOnly = authConfig.mode === "supabase" && !isLocalhost

  return (
    <>
      <AuthCard>
        <Stack gap="lg">
          {/* Domain/auth error */}
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Header */}
          <Stack gap="xs" className="text-center">
            <Title size="h4" align="center">
              Welcome back
            </Title>
            <Text variant="muted" size="sm">
              {isGoogleOnly
                ? "Sign in with your company Google account"
                : authConfig.mode === "password"
                  ? "Enter the password to sign in"
                  : "Enter your credentials to sign in"
              }
            </Text>
          </Stack>

          {/* Login Form */}
          <LoginForm
            mode={authConfig.mode}
            redirectTo={redirectTo}
            showPasswordLogin={isLocalhost}
          />

        </Stack>
      </AuthCard>

      {/* Dev Card (localhost only) */}
      {isLocalhost && <AuthDevCard mode={authConfig.mode} />}
    </>
  )
}
