/**
 * CATALYST - Verify Email Page
 *
 * Email verification confirmation page.
 * Shown after user clicks verification link in email.
 * Only available in demo, supabase, and custom modes.
 */

import { getAuthConfig } from "@/lib/auth"
import { Text, Title, Stack } from "@/components/core"
import { Button } from "@/components/ui/button"
import { AuthCard } from "../../_surface/auth-card"
import { AuthDevCard } from "../../_surface/auth-dev-card"
import { CheckCircleIcon, MailIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Verify Email | Catalyst",
  description: "Verify your email address",
}

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string }>
}) {
  const authConfig = getAuthConfig()

  // Email verification not available in password mode
  if (authConfig.mode === "password") {
    redirect("/auth/login")
  }

  return (
    <>
      <AuthCard>
        <VerifyEmailContent searchParams={searchParams} redirectTo={authConfig.redirectTo} />
      </AuthCard>

      {/* Dev Card */}
      <AuthDevCard mode={authConfig.mode} />
    </>
  )
}

async function VerifyEmailContent({ 
  searchParams, 
  redirectTo 
}: { 
  searchParams: Promise<{ verified?: string }>
  redirectTo: string 
}) {
  const params = await searchParams
  const isVerified = params?.verified === "true"

  if (isVerified) {
    return (
      <Stack gap="lg" className="text-center py-4">
        <div className="auth-success-icon">
          <CheckCircleIcon className="h-8 w-8" />
        </div>
        <Stack gap="xs">
          <Title size="h4" align="center">
            Email verified!
          </Title>
          <Text variant="muted" size="sm">
            Your email has been verified successfully.
          </Text>
        </Stack>
        <Button className="w-full" nativeButton={false} render={<Link href={redirectTo} />}>
          Continue to app
        </Button>
      </Stack>
    )
  }

  // Pending verification state
  return (
    <Stack gap="lg" className="text-center py-4">
      <div className="auth-success-icon">
        <MailIcon className="h-8 w-8" />
      </div>
      <Stack gap="xs">
        <Title size="h4" align="center">
          Check your email
        </Title>
        <Text variant="muted" size="sm">
          We&apos;ve sent you a verification link. Click the link in your email to verify your account.
        </Text>
      </Stack>
      <Stack gap="sm">
        <Button variant="outline" className="w-full" nativeButton={false} render={<Link href="/auth/login" />}>
          Back to sign in
        </Button>
      </Stack>
    </Stack>
  )
}
