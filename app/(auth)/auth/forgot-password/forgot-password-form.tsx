/**
 * CATALYST - Forgot Password Form Component
 *
 * Handles password reset request across all auth modes:
 * - demo: Shows success state (UI preview)
 * - supabase: Sends reset email via Supabase Auth
 * - custom: POST to custom endpoint with { action: "forgot-password", ... }
 */

"use client"

import * as React from "react"
import { Stack } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2Icon, AlertCircleIcon, MailIcon, InfoIcon } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { getURL, type AuthMode } from "@/lib/auth"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface ForgotPasswordFormProps {
  mode: AuthMode
}

// -----------------------------------------------------------------------------
// Forgot Password Form Component
// -----------------------------------------------------------------------------

export function ForgotPasswordForm({ mode }: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [email, setEmail] = React.useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Ensure loading state shows for at least 1s (UX)
      await withMinDelay(async () => {
        switch (mode) {
          // -----------------------------------------------------------------
          // Demo mode: Just show success (UI preview)
          // -----------------------------------------------------------------
          case "demo":
            setSuccess(true)
            break

          // -----------------------------------------------------------------
          // Supabase mode: Send reset email via Supabase
          // -----------------------------------------------------------------
          case "supabase": {
            const supabase = createSupabaseBrowserClient()
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${getURL()}api/auth/callback?next=/auth/reset-password`,
            })

            if (resetError) {
              setError(resetError.message)
            } else {
              setSuccess(true)
            }
            break
          }

          // -----------------------------------------------------------------
          // Custom mode: POST to custom endpoint
          // -----------------------------------------------------------------
          case "custom": {
            const result = await postToCustomEndpoint("forgot-password", { email })
            if (result.success) {
              setSuccess(true)
            } else {
              setError(result.error || "Failed to send reset link")
            }
            break
          }
        }
      }, 1000)
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Password reset error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Success state
  if (success) {
    return (
      <Stack gap="md" className="text-center py-4">
        <div className="auth-success-icon">
          <MailIcon className="h-8 w-8" />
        </div>
        <Stack gap="xs">
          <p className="font-medium">Check your email</p>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a password reset link to <strong>{email}</strong>
          </p>
        </Stack>
        <Button 
          variant="outline" 
          onClick={() => {
            setSuccess(false)
            setEmail("")
          }}
          className="mt-2"
        >
          Send another link
        </Button>
      </Stack>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Email Field */}
        <Stack gap="xs">
          <Label htmlFor="email" required>Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
          />
        </Stack>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>

        {/* Demo mode hint */}
        {mode === "demo" && (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-medium">
              <InfoIcon className="h-3.5 w-3.5 shrink-0" />
              Demo mode: form shows success state
            </div>
          </div>
        )}
      </Stack>
    </form>
  )
}

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/** Run an async function with a minimum delay (UX: ensures loading state is visible) */
async function withMinDelay<T>(fn: () => Promise<T>, minMs = 1000): Promise<T> {
  const start = Date.now()
  const result = await fn()
  const elapsed = Date.now() - start
  if (elapsed < minMs) {
    await new Promise((resolve) => setTimeout(resolve, minMs - elapsed))
  }
  return result
}

/** POST to custom auth endpoint */
/** POST to custom auth endpoint (via local API proxy) */
async function postToCustomEndpoint(
  action: string,
  data: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Route through our API which proxies to custom endpoint
    const res = await fetch("/api/auth/validate-custom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...data }),
    })

    const result = await res.json()
    return { success: result.success, error: result.error }
  } catch {
    return { success: false, error: "Failed to connect to auth server" }
  }
}
