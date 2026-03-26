/**
 * CATALYST - Login As Button
 *
 * Admin-only button that generates a magic link to sign in as another user.
 * For testing purposes only.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogInIcon, Loader2Icon } from "lucide-react"

interface LoginAsButtonProps {
  userId: string
  userName: string
}

export function LoginAsButton({ userId, userName }: LoginAsButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleLoginAs() {
    if (!confirm(`Sign in as ${userName}? You will be logged out of your current session.`)) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/admin/login-as", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const data = await res.json()

      if (data.loginUrl) {
        window.location.href = data.loginUrl
      } else {
        alert(data.error || "Failed to generate login link")
      }
    } catch {
      alert("Failed to generate login link")
    }

    setLoading(false)
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleLoginAs}
      disabled={loading}
      title={`Sign in as ${userName}`}
    >
      {loading ? (
        <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <LogInIcon className="h-3.5 w-3.5" />
      )}
    </Button>
  )
}
