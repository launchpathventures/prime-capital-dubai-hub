/**
 * CATALYST - Register Form Component
 *
 * Handles user registration across all auth modes:
 * - demo: Shows success state (UI preview)
 * - supabase: Creates user via Supabase Auth
 * - custom: POST to custom endpoint with { action: "register", ... }
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { Stack } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2Icon, AlertCircleIcon, InfoIcon } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { getURL } from "@/lib/auth/get-url"
import type { AuthMode } from "@/lib/auth/config"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface RegisterFormProps {
  mode: AuthMode
  redirectTo: string
}

// -----------------------------------------------------------------------------
// Register Form Component
// -----------------------------------------------------------------------------

export function RegisterForm({ mode, redirectTo }: RegisterFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  // Form state
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [agreedToTerms, setAgreedToTerms] = React.useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate terms agreement
    if (!agreedToTerms) {
      setError("You must agree to the Terms & Conditions")
      setIsLoading(false)
      return
    }

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

    // Track if we should redirect (vs show success state or error)
    let shouldRedirect = false

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
          // Supabase mode: Create user via Supabase Auth
          // -----------------------------------------------------------------
          case "supabase": {
            const supabase = createSupabaseBrowserClient()
            const displayName = name.trim() || email.split("@")[0]
            
            // Wait for auth state change to confirm session is stored in cookies
            // This prevents race conditions where navigation happens before cookies are set
            const authPromise = new Promise<{ success: boolean; needsConfirmation?: boolean; error?: string }>((resolve) => {
              const timeout = setTimeout(() => {
                resolve({ success: false, error: "Registration timed out" })
              }, 15000) // 15s timeout for registration (email sending can be slow)
              
              const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (event === "SIGNED_IN" && session) {
                  // Email confirmation disabled - user is signed in
                  clearTimeout(timeout)
                  subscription.unsubscribe()
                  resolve({ success: true })
                }
              })
              
              // Trigger the sign-up
              supabase.auth.signUp({
                email,
                password,
                options: {
                  emailRedirectTo: `${getURL()}api/auth/callback?next=${redirectTo}`,
                  data: {
                    full_name: displayName,
                    display_name: displayName,
                  },
                },
              }).then(({ data, error }) => {
                if (error) {
                  clearTimeout(timeout)
                  subscription.unsubscribe()
                  resolve({ success: false, error: error.message })
                } else if (!data.session) {
                  // Email confirmation required - no session returned
                  clearTimeout(timeout)
                  subscription.unsubscribe()
                  resolve({ success: true, needsConfirmation: true })
                }
                // Session case handled by onAuthStateChange above
              })
            })
            
            const result = await authPromise
            if (result.error) {
              setError(result.error)
            } else if (result.needsConfirmation) {
              setSuccess(true)
            } else {
              shouldRedirect = true
            }
            break
          }

          // -----------------------------------------------------------------
          // Custom mode: POST to custom endpoint
          // -----------------------------------------------------------------
          case "custom": {
            const result = await postToCustomEndpoint("register", { name, email, password })
            if (result.success) {
              setSuccess(true)
            } else {
              setError(result.error || "Registration failed")
            }
            break
          }
        }
      }, 1000)

      // Redirect after the minimum delay has passed
      if (shouldRedirect) {
        toast.success("Account created successfully!")
        // Use hard navigation to avoid RSC cache issues
        window.location.href = redirectTo
        // Don't reset loading state - let the navigation happen while still showing "Creating account..."
        return
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Registration error:", err)
    }

    // Only reset loading state if we didn't redirect
    setIsLoading(false)
  }

  // Success state - show confirmation message
  if (success) {
    return (
      <Stack gap="md" className="text-center py-4">
        <div className="auth-success-icon">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <Stack gap="xs">
          <p className="font-medium">Check your email</p>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a confirmation link to <strong>{email}</strong>
          </p>
        </Stack>
        <Button 
          variant="outline" 
          className="mt-2"
          nativeButton={false}
          render={<Link href="/auth/login" />}
        >
          Back to sign in
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

        {/* Name Field */}
        <Stack gap="xs">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            autoFocus
          />
        </Stack>

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
          />
        </Stack>

        {/* Password Field */}
        <Stack gap="xs">
          <Label htmlFor="password" required>Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 5 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={5}
          />
        </Stack>

        {/* Confirm Password Field */}
        <Stack gap="xs">
          <Label htmlFor="confirmPassword" required>Confirm password</Label>
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

        {/* Terms checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
          />
          <Label htmlFor="terms" className="cursor-pointer">
            I agree to the{" "}
            <a href="/terms" className="underline hover:text-foreground" target="_blank">Terms & Conditions</a>
          </Label>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
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