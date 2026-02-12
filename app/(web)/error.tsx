/**
 * CATALYST - Web Surface Error Boundary
 *
 * Client component that renders inside WebShell when an error occurs.
 * The header and footer remain visible, only the page content shows error state.
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

export default function WebError({ error, reset }: ErrorProps) {
  useEffect(() => {
    trackComponentError(error, "web-surface", error.digest)
  }, [error])

  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)] min-h-[60vh] flex items-center">
      <Container size="md">
        <Stack gap="lg" align="center" className="text-center">
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 bg-[var(--web-spruce)]/10 rounded-full">
            <AlertTriangleIcon className="h-8 w-8 text-[var(--web-spruce)]" />
          </div>

          {/* Heading */}
          <Stack gap="sm" align="center">
            <Title
              as="h1"
              className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.25]"
            >
              Something went wrong
            </Title>
            <Text className="text-[var(--web-spruce)] text-[15px] font-light leading-relaxed max-w-md">
              We apologize for the inconvenience. An unexpected error has
              occurred. Our team has been notified and is working to resolve
              this issue.
            </Text>
          </Stack>

          {/* Actions */}
          <Stack gap="sm" className="w-full max-w-xs mt-4">
            <Button
              onClick={reset}
              className="w-full h-12 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
            >
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 border-[var(--web-spruce)] text-[var(--web-spruce)] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
              render={<Link href="/" />}
            >
              <HomeIcon className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
          </Stack>

          {/* Trust Message */}
          <Text className="text-[var(--web-serenity)] text-[13px] font-light mt-8">
            If this problem persists, please contact us at{" "}
            <a
              href={`mailto:${config.contact.email}`}
              className="underline hover:text-[var(--web-spruce)] transition-colors"
            >
              {config.contact.email}
            </a>
          </Text>
        </Stack>
      </Container>
    </section>
  )
}
