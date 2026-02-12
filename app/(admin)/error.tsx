/**
 * CATALYST - Admin Surface Error Boundary
 *
 * Client component that renders inside AdminShell when an error occurs.
 * The sidebar and header remain visible, only the page content shows error state.
 */

"use client"

import { useEffect } from "react"
import Link from "next/link"
import { trackComponentError } from "@/lib/error-tracking"
import { config } from "@/lib/config"
import { Container, Stack, Title, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import { AlertTriangleIcon, HomeIcon, RefreshCwIcon } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    trackComponentError(error, "admin-surface", error.digest)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Container size="sm">
        <Stack gap="lg" align="center" className="text-center">
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full">
            <AlertTriangleIcon className="h-8 w-8 text-destructive" />
          </div>

          {/* Heading */}
          <Stack gap="sm" align="center">
            <Title as="h1" size="h2">
              Something went wrong
            </Title>
            <Text variant="muted" className="max-w-md">
              An unexpected error occurred while loading this page.
              Our team has been notified and is working to resolve this issue.
            </Text>
          </Stack>

          {/* Error digest for debugging */}
          {error.digest && (
            <Text variant="muted" size="xs" className="font-mono">
              Error ID: {error.digest}
            </Text>
          )}

          {/* Actions */}
          <Stack gap="sm" className="w-full max-w-xs mt-2">
            <Button onClick={reset} className="w-full">
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            <Button variant="outline" className="w-full" render={<Link href="/admin" />}>
              <HomeIcon className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Stack>

          {/* Support contact */}
          <Text variant="muted" size="sm" className="mt-4">
            If this problem persists, please contact{" "}
            <a
              href={`mailto:${config.contact.email}`}
              className="underline hover:text-foreground transition-colors"
            >
              {config.contact.email}
            </a>
          </Text>
        </Stack>
      </Container>
    </div>
  )
}
