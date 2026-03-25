/**
 * CATALYST - Login Form Component
 *
 * Handles authentication for all modes:
 * - demo: accepts any input, redirects immediately
 * - password: validates password only
 * - supabase: email/password via Supabase
 * - custom: posts to custom endpoint
 */

"use client"

import * as React from "react"
import { Stack } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2Icon, AlertCircleIcon, InfoIcon } from "lucide-react"
import { toast } from "@/components/ui/toast"
import type { AuthMode } from "@/lib/auth/config"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { getURL } from "@/lib/auth/get-url"
import { ALLOWED_EMAIL_DOMAINS, isAllowedEmail } from "@/lib/auth/config"
import Link from "next/link"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface LoginFormProps {
  mode: AuthMode
  redirectTo: string
}

// -----------------------------------------------------------------------------
// Login Form Component
// -----------------------------------------------------------------------------

export function LoginForm({ mode, redirectTo }: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)

  // Form state
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [rememberMe, setRememberMe] = React.useState(false)

  // Determine which fields to show
  const showEmail = mode === "supabase" || mode === "custom" || mode === "demo"

  async function signInWithGoogle() {
    setIsGoogleLoading(true)
    setError(null)
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getURL()}api/auth/callback?next=${redirectTo}`,
        // Domain enforcement happens server-side in the auth callback
      },
    })
    if (error) {
      setError(error.message)
      setIsGoogleLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Track if we should redirect after the delay
    let shouldRedirect = false

    try {
      // Ensure loading state shows for at least 1s (UX: lets user read "Signing in...")
      await withMinDelay(async () => {
        switch (mode) {
          case "demo":
            // Accept anything, just redirect
            shouldRedirect = true
            break

          case "password":
            // Validate against configured password
            const passwordResult = await validatePassword(password)
            if (passwordResult.success) {
              shouldRedirect = true
            } else {
              setError(passwordResult.error || "Invalid password")
            }
            break

          case "supabase": {
            // Validate email domain before attempting sign-in
            if (!isAllowedEmail(email)) {
              setError(`Only ${ALLOWED_EMAIL_DOMAINS.map(d => `@${d}`).join(" and ")} accounts can sign in.`)
              break
            }

            // Real Supabase authentication
            const supabase = createSupabaseBrowserClient()
            
            // Wait for auth state change to confirm session is stored in cookies
            // This prevents race conditions where navigation happens before cookies are set
            const authPromise = new Promise<{ success: boolean; error?: string }>((resolve) => {
              const timeout = setTimeout(() => {
                resolve({ success: false, error: "Authentication timed out" })
              }, 10000) // 10s timeout
              
              const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (event === "SIGNED_IN" && session) {
                  clearTimeout(timeout)
                  subscription.unsubscribe()
                  resolve({ success: true })
                }
              })
              
              // Trigger the sign-in
              supabase.auth.signInWithPassword({ email, password }).then(({ error }) => {
                if (error) {
                  clearTimeout(timeout)
                  subscription.unsubscribe()
                  resolve({ success: false, error: error.message })
                }
                // Success case handled by onAuthStateChange above
              })
            })
            
            const result = await authPromise
            if (result.error) {
              setError(result.error)
            } else {
              shouldRedirect = true
            }
            break
          }

          case "custom":
            // Call custom API endpoint
            const customResult = await validateCustom(email, password)
            if (customResult.success) {
              shouldRedirect = true
            } else {
              setError(customResult.error || "Authentication failed")
            }
            break
        }
      }, 1000)

      // Redirect after the minimum delay has passed
      if (shouldRedirect) {
        toast.success("Successfully signed in")
        // Use hard navigation to avoid RSC cache issues
        // router.push() + router.refresh() causes the current page to re-fetch,
        // which triggers proxy redirects and creates a redirect loop
        window.location.href = redirectTo
        // Don't reset loading state - let the navigation happen while still showing "Signing in..."
        return
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Login error:", err)
    }
    
    // Only reset loading state if we didn't redirect (error case)
    setIsLoading(false)
  }

  return (
    <Stack gap="md">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Google Sign-In (Supabase mode only) */}
      {mode === "supabase" && (
        <>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isLoading || isGoogleLoading}
            onClick={signInWithGoogle}
          >
            {isGoogleLoading ? (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Sign in with Google
          </Button>

          <div className="relative flex items-center gap-4 py-1">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border" />
          </div>
        </>
      )}

    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {/* Email Field (not shown in password-only mode) */}
        {showEmail && (
          <Stack gap="xs">
            <Label htmlFor="email" required={mode !== "demo"}>Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={mode !== "demo"}
              autoComplete="email"
              autoFocus
            />
          </Stack>
        )}

        {/* Password Field */}
        <Stack gap="xs">
          <Label htmlFor="password" required={mode !== "demo"}>Password</Label>
          <Input
            id="password"
            type="password"
            placeholder={mode === "password" ? "Enter password" : "••••••••"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={mode !== "demo"}
            autoComplete={mode === "password" ? "off" : "current-password"}
            autoFocus={!showEmail}
          />
        </Stack>

        {/* Remember me & Forgot password row */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <Checkbox 
              checked={rememberMe} 
              onCheckedChange={(checked) => setRememberMe(checked === true)} 
            />
            Remember me
          </label>
          {mode === "supabase" && (
            <Link
              href="/auth/forgot-password"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot password?
            </Link>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        {/* Demo mode hint */}
        {mode === "demo" && (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-medium">
              <InfoIcon className="h-3.5 w-3.5 shrink-0" />
              Demo mode: any credentials will work
            </div>
          </div>
        )}
      </Stack>
    </form>
    </Stack>
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

/** Validate password against server (password mode) */
async function validatePassword(
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth/validate-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "include", // Ensure cookies are sent and received
    })

    const data = await res.json()
    return { success: data.success, error: data.error }
  } catch {
    return { success: false, error: "Failed to validate password" }
  }
}

/** Validate against custom endpoint (custom mode) */
async function validateCustom(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Route through our API which proxies to custom endpoint and sets session cookie
    const res = await fetch("/api/auth/validate-custom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, action: "login" }),
      credentials: "include", // Ensure cookies are sent and received
    })

    const data = await res.json()
    return { success: data.success, error: data.error }
  } catch {
    return { success: false, error: "Failed to authenticate" }
  }
}
