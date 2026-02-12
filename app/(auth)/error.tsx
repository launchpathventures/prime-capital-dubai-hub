/**
 * CATALYST - Auth Surface Error Boundary
 *
 * Client component that renders inside AuthShell when an error occurs.
 * Keeps the design simple and centered, matching auth page aesthetics.
 */

"use client"

import { useEffect } from "react"
import Link from "next/link"
import { trackComponentError } from "@/lib/error-tracking"
import { Stack, Title, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AuthError({ error, reset }: ErrorProps) {
  useEffect(() => {
    trackComponentError(error, "auth-surface", error.digest)
  }, [error])

  return (
    <div className="auth-card">
      <div className="auth-card-content">
        <Stack gap="lg" align="center" className="text-center">
          {/* Icon */}
          <div className="flex items-center justify-center w-14 h-14 bg-destructive/10 rounded-full">
            <AlertTriangleIcon className="h-7 w-7 text-destructive" />
          </div>

          {/* Heading */}
          <Stack gap="sm" align="center">
            <Title as="h1" size="h3">
              Something went wrong
            </Title>
            <Text variant="muted" size="sm" className="max-w-xs">
              We encountered an error while processing your request.
              Please try again.
            </Text>
          </Stack>

          {/* Actions */}
          <Stack gap="sm" className="w-full mt-2">
            <Button onClick={reset} className="w-full">
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </Stack>
        </Stack>
      </div>

      <div className="auth-card-footer">
        <Text variant="muted" size="sm">
          <Link href="/" className="underline hover:text-foreground transition-colors">
            Return to homepage
          </Link>
        </Text>
      </div>
    </div>
  )
}
