/**
 * CATALYST - Presentation Surface Error Boundary
 *
 * Client component that renders when an error occurs in presentations.
 * Full-screen centered layout matching presentation aesthetics.
 */

"use client"

import { useEffect } from "react"
import Link from "next/link"
import { trackComponentError } from "@/lib/error-tracking"
import { Stack, Title, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import { AlertTriangleIcon, RefreshCwIcon, HomeIcon } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function PresentError({ error, reset }: ErrorProps) {
  useEffect(() => {
    trackComponentError(error, "present-surface", error.digest)
  }, [error])

  return (
    <div className="min-h-dvh flex items-center justify-center p-6 bg-background">
      <div className="present-section">
        <Stack gap="lg" align="center" className="text-center max-w-md mx-auto">
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full">
            <AlertTriangleIcon className="h-8 w-8 text-destructive" />
          </div>

          {/* Heading */}
          <Stack gap="sm" align="center">
            <Title as="h1" size="h2">
              Unable to load presentation
            </Title>
            <Text variant="muted">
              An error occurred while loading this presentation.
              Please try again or return to the homepage.
            </Text>
          </Stack>

          {/* Actions */}
          <Stack gap="sm" className="w-full max-w-xs mt-2">
            <Button onClick={reset} className="w-full">
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            <Button variant="outline" className="w-full" render={<Link href="/" />}>
              <HomeIcon className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </Stack>
        </Stack>
      </div>
    </div>
  )
}
