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

  // Form state
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [rememberMe, setRememberMe] = React.useState(false)

  // Determine which fields to show
  const showEmail = mode === "supabase" || mode === "custom" || mode === "demo"

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
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
