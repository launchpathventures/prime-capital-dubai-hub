/**
 * CATALYST - Docs Login Page
 *
 * Password entry page for protected documentation.
 * Only shown in production when DOCS_PASSWORD is set.
 */

"use client"

import { useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function LoginForm() {
  const [password, setPassword] = useState("")
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/docs"
  const hasError = searchParams.get("error") === "invalid"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!password.trim()) {
      return
    }

    // Navigate with password param — middleware will validate and set cookie
    // Use window.location for full page navigation (needed for middleware to run)
    const url = new URL(redirect, window.location.origin)
    url.searchParams.set("password", password)
    window.location.href = url.toString()
  }

  return (
    <div className="flex items-start justify-center pt-24">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Documentation Access
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter the password to view documentation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              autoFocus
            />
            {hasError && (
              <p className="text-destructive text-sm">
                Invalid password. Please try again.
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Access Docs
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function DocsLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-start justify-center pt-24">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
