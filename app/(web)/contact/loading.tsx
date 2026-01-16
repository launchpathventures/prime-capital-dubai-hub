/**
 * CATALYST - Contact Page Loading State
 */

import { Container, Stack } from "@/components/core"

export default function ContactLoading() {
  return (
    <div className="web-contact animate-pulse">
      {/* Hero Skeleton */}
      <section className="relative min-h-[55vh] bg-gray-200" />

      {/* Form Section Skeleton */}
      <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
        <Container size="lg">
          <Stack gap="xl" className="max-w-2xl mx-auto">
            {/* Form skeleton */}
            <div className="space-y-6">
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-32 bg-gray-200 rounded" />
              <div className="h-12 w-40 bg-gray-300 rounded" />
            </div>
          </Stack>
        </Container>
      </section>
    </div>
  )
}
