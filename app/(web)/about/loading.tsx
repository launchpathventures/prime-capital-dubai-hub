/**
 * CATALYST - About Page Loading State
 */

import { Container, Stack, Grid } from "@/components/core"

export default function AboutLoading() {
  return (
    <div className="web-about animate-pulse">
      {/* Hero Skeleton */}
      <section className="relative min-h-[60vh] bg-gray-200" />

      {/* Content Section Skeleton */}
      <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
        <Container size="lg">
          <Grid cols={1} className="md:grid-cols-2 gap-12">
            <Stack gap="md">
              <div className="h-8 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-3/4 bg-gray-300 rounded" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
              </div>
            </Stack>
            <div className="h-[400px] bg-gray-200 rounded" />
          </Grid>
        </Container>
      </section>

      {/* Values Section Skeleton */}
      <section className="bg-white py-[var(--web-section-gap)]">
        <Container size="lg">
          <Stack gap="xl" align="center">
            <div className="h-10 w-48 bg-gray-300 rounded mx-auto" />
            <Grid cols={1} className="md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded" />
              ))}
            </Grid>
          </Stack>
        </Container>
      </section>
    </div>
  )
}
