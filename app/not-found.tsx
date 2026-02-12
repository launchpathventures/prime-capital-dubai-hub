/**
 * CATALYST - Root 404 Page
 *
 * Server component for 404 errors outside route groups.
 * Minimal branded page with link back to homepage.
 */

import Link from "next/link"
import { Container, Stack, Title, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import { HomeIcon } from "lucide-react"

export default function RootNotFound() {
  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)] min-h-[70vh] flex items-center">
      <Container size="md">
        <Stack gap="lg" align="center" className="text-center">
          {/* Company Name */}
          <div className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Prime Capital Dubai
          </div>

          {/* 404 Indicator */}
          <div className="text-[var(--web-serenity)] text-[120px] font-headline font-normal leading-none">
            404
          </div>

          {/* Heading */}
          <Stack gap="sm" align="center">
            <Title
              as="h1"
              className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.25]"
            >
              Page not found
            </Title>
            <Text className="text-[var(--web-spruce)] text-[15px] font-light leading-relaxed max-w-md">
              The page you are looking for does not exist or has been moved.
            </Text>
          </Stack>

          {/* CTA */}
          <Button
            size="lg"
            className="h-14 px-10 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] mt-4"
            render={<Link href="/" />}
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            Go to Homepage
          </Button>
        </Stack>
      </Container>
    </section>
  )
}
