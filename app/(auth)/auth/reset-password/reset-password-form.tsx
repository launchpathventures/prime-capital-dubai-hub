/**
 * CATALYST - Reset Password Form Component
 *
 * Handles password reset across all auth modes:
 * - demo: Shows success state (UI preview)
 * - supabase: Updates password via Supabase Auth
 * - custom: POST to custom endpoint with { action: "reset-password", ... }
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Stack } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2Icon, AlertCircleIcon, CheckCircleIcon, InfoIcon } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { type AuthMode } from "@/lib/auth"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface ResetPasswordFormProps {
  mode: AuthMode
  redirectTo: string
}

// -----------------------------------------------------------------------------
// Reset Password Form Component
// -----------------------------------------------------------------------------

export function ResetPasswordForm({ mode, redirectTo }: ResetPasswordFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  // Form state
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 5) {
      setError("Password must be at least 5 characters")
      setIsLoading(false)
      return
    }

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
          // Supabase mode: Update password via Supabase Auth
          // -----------------------------------------------------------------
          case "supabase": {
            const supabase = createSupabaseBrowserClient()
            const { error: updateError } = await supabase.auth.updateUser({
              password,
            })

            if (updateError) {
              setError(updateError.message)
            } else {
              setSuccess(true)
              // Redirect after short delay
              setTimeout(() => {
                router.push(redirectTo)
              }, 2000)
            }
            break
          }

          // -----------------------------------------------------------------
          // Custom mode: POST to custom endpoint
          // -----------------------------------------------------------------
          case "custom": {
            const result = await postToCustomEndpoint("reset-password", { password })
            if (result.success) {
              setSuccess(true)
              setTimeout(() => {
                router.push(redirectTo)
              }, 2000)
            } else {
              setError(result.error || "Failed to update password")
            }
            break
          }
        }
      }, 1000)
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Password update error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Success state
  if (success) {
    return (
      <Stack gap="md" className="text-center py-4">
        <div className="auth-success-icon">
          <CheckCircleIcon className="h-8 w-8" />
        </div>
        <Stack gap="xs">
          <p className="font-medium">Password updated!</p>
          <p className="text-sm text-muted-foreground">
            Redirecting you to the app...
          </p>
        </Stack>
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

        {/* New Password Field */}
        <Stack gap="xs">
          <Label htmlFor="password" required>New password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 5 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            autoFocus
            minLength={5}
          />
        </Stack>

        {/* Confirm Password Field */}
        <Stack gap="xs">
          <Label htmlFor="confirmPassword" required>Confirm new password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </Stack>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update password"
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