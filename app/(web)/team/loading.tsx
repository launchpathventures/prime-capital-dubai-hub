/**
 * CATALYST - Team Page Loading State
 */

import { Container, Stack, Grid } from "@/components/core"

export default function TeamLoading() {
  return (
    <div className="web-team animate-pulse">
      {/* Header Section Skeleton */}
      <section className="bg-[var(--web-off-white)] pt-32 pb-12">
        <Container size="xl">
          <Stack gap="md" align="center" className="text-center">
            <div className="h-10 w-48 bg-gray-300 rounded mx-auto" />
            <div className="h-6 w-80 bg-gray-200 rounded mx-auto" />
          </Stack>
        </Container>
      </section>

      {/* Team Grid Skeleton */}
      <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
        <Container size="xl">
          <Grid cols={1} className="md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded overflow-hidden shadow-sm">
                <div className="h-80 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-6 w-3/4 bg-gray-300 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </Grid>
        </Container>
      </section>
    </div>
  )
}
