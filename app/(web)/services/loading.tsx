/**
 * CATALYST - Services Page Loading State
 */

import { Container, Stack, Grid } from "@/components/core"

export default function ServicesLoading() {
  return (
    <div className="web-services animate-pulse">
      {/* Hero Skeleton */}
      <section className="relative min-h-[55vh] bg-gray-200" />

      {/* Services Grid Skeleton */}
      <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="md" align="center" className="text-center">
              <div className="h-6 w-24 bg-gray-200 rounded mx-auto" />
              <div className="h-10 w-64 bg-gray-300 rounded mx-auto" />
            </Stack>
            <Grid cols={1} className="md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded" />
              ))}
            </Grid>
          </Stack>
        </Container>
      </section>

      {/* Process Section Skeleton */}
      <section className="bg-white py-[var(--web-section-gap)]">
        <Container size="lg">
          <Stack gap="xl" align="center">
            <div className="h-10 w-48 bg-gray-300 rounded mx-auto" />
            <div className="flex gap-4 justify-center">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 w-48 bg-gray-200 rounded" />
              ))}
            </div>
          </Stack>
        </Container>
      </section>
    </div>
  )
}
