/**
 * CATALYST - Property Detail Page Loading State
 */

import { Container, Stack, Grid } from "@/components/core"

export default function PropertyDetailLoading() {
  return (
    <div className="web-property-detail animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative min-h-[60vh] flex flex-col justify-end">
        {/* Background */}
        <div className="absolute inset-0 bg-[var(--web-ash)]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
        </div>

        {/* Hero Content */}
        <Container size="xl" className="relative z-10 pt-28 pb-12">
          {/* Back Link */}
          <div className="h-4 w-20 bg-white/20 rounded mb-6" />

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <Stack gap="sm">
              {/* Badges */}
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-white/20 rounded-[2px]" />
                <div className="h-6 w-16 bg-white/20 rounded-[2px]" />
              </div>

              {/* Title */}
              <div className="h-12 w-96 max-w-full bg-white/30 rounded" />

              {/* Location */}
              <div className="h-5 w-64 bg-white/20 rounded" />
            </Stack>

            {/* Price + CTA */}
            <Stack gap="sm" align="end">
              <div className="h-4 w-24 bg-white/20 rounded" />
              <div className="h-10 w-48 bg-white/30 rounded" />
              <div className="h-12 w-36 bg-[var(--web-spruce)] rounded-[2px]" />
            </Stack>
          </div>
        </Container>
      </section>

      {/* Key Metrics Bar Skeleton */}
      <section className="bg-[var(--web-ash)]">
        <Container size="xl">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 py-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="h-6 w-6 bg-white/20 rounded mx-auto mb-2" />
                <div className="h-6 w-16 bg-white/30 rounded mx-auto mb-1" />
                <div className="h-3 w-20 bg-white/20 rounded mx-auto" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Content Section Skeleton */}
      <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
        <Container size="xl">
          <Grid cols={1} className="lg:grid-cols-[2fr_1fr] gap-12">
            {/* Main Content */}
            <Stack gap="xl">
              {/* Why Invest Card */}
              <div className="bg-[var(--web-ash)] rounded-[2px] p-8">
                <div className="h-6 w-64 bg-white/20 rounded mb-6" />
                <Stack gap="sm">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-5 w-5 bg-white/20 rounded-full shrink-0" />
                      <div className="h-4 w-full bg-white/15 rounded" />
                    </div>
                  ))}
                </Stack>
              </div>

              {/* Description */}
              <div>
                <div className="h-3 w-32 bg-gray-200 rounded mb-3" />
                <Stack gap="sm">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded" />
                  <div className="h-4 w-4/5 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                </Stack>
              </div>

              {/* Features */}
              <div>
                <div className="h-3 w-24 bg-gray-200 rounded mb-4" />
                <Grid cols={2} className="gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-200 rounded-full" />
                      <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    </div>
                  ))}
                </Grid>
              </div>

              {/* Gallery */}
              <div>
                <div className="h-3 w-16 bg-gray-200 rounded mb-4" />
                <Grid cols={2} className="gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] rounded-[2px] bg-gray-200"
                    />
                  ))}
                </Grid>
              </div>
            </Stack>

            {/* Sidebar */}
            <Stack gap="lg">
              {/* Property Details Card */}
              <div className="bg-white rounded-[2px] p-6 shadow-sm">
                <div className="h-6 w-32 bg-gray-300 rounded mb-6" />
                <Stack gap="md">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                      <div className="h-4 w-24 bg-gray-300 rounded" />
                    </div>
                  ))}
                  {/* Map placeholder */}
                  <div className="mt-4 h-40 bg-gray-200 rounded-[2px]" />
                </Stack>
              </div>

              {/* CTA Card */}
              <div className="bg-[var(--web-spruce)] rounded-[2px] p-6">
                <div className="h-6 w-48 bg-white/20 rounded mx-auto mb-2" />
                <div className="h-4 w-64 bg-white/15 rounded mx-auto mb-6" />
                <div className="h-12 bg-white/10 rounded-[2px]" />
              </div>
            </Stack>
          </Grid>
        </Container>
      </section>
    </div>
  )
}
