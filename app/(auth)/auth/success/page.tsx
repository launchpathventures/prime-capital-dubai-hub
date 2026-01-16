/**
 * CATALYST - Auth Success Page
 *
 * Generic success page for auth flows.
 * Can be customized via query params.
 * Only available in demo, supabase, and custom modes.
 */

import { getAuthConfig } from "@/lib/auth"
import { Text, Title, Stack } from "@/components/core"
import { Button } from "@/components/ui/button"
import { AuthCard } from "../../_surface/auth-card"
import { AuthDevCard } from "../../_surface/auth-dev-card"
import { CheckCircleIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Success | Catalyst",
  description: "Action completed successfully",
}

// Success message configurations
const successMessages: Record<string, { title: string; message: string }> = {
  "password-reset": {
    title: "Password reset!",
    message: "Your password has been successfully updated.",
  },
  "email-verified": {
    title: "Email verified!",
    message: "Your email address has been verified.",
  },
  "account-created": {
    title: "Account created!",
    message: "Your account has been created successfully.",
  },
  "logged-out": {
    title: "Logged out",
    message: "You have been successfully logged out.",
  },
  default: {
    title: "Success!",
    message: "Your action was completed successfully.",
  },
}

export default function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const authConfig = getAuthConfig()

  // Success page not available in password mode
  if (authConfig.mode === "password") {
    redirect("/auth/login")
  }

  return (
    <>
      <AuthCard>
        <SuccessContent searchParams={searchParams} redirectTo={authConfig.redirectTo} />
      </AuthCard>

      {/* Dev Card */}
      <AuthDevCard mode={authConfig.mode} />
    </>
  )
}

async function SuccessContent({ 
  searchParams,
  redirectTo,
}: { 
  searchParams: Promise<{ type?: string }>
  redirectTo: string
}) {
  const params = await searchParams
  const type = params?.type || "default"
  const { title, message } = successMessages[type] || successMessages.default
  const showContinue = type !== "logged-out"

  return (
    <Stack gap="lg" className="text-center py-4">
      <div className="auth-success-icon">
        <CheckCircleIcon className="h-8 w-8" />
      </div>
      <Stack gap="xs">
        <Title size="h4" align="center">
          {title}
        </Title>
        <Text variant="muted" size="sm">
          {message}
        </Text>
      </Stack>
      <Stack gap="sm">
        {showContinue ? (
          <Button className="w-full" render={<Link href={redirectTo} />}>
            Continue to app
          </Button>
        ) : (
          <Button className="w-full" render={<Link href="/auth/login" />}>
            Sign in again
          </Button>
        )}
        <Button variant="ghost" className="w-full" render={<Link href="/" />}>
          Back to home
        </Button>
      </Stack>
    </Stack>
  )
}
