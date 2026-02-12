/**
 * CATALYST - Strategy Kit Page Loading State
 */

import { Container, Stack, Grid } from "@/components/core"

export default function StrategyKitLoading() {
  return (
    <div className="web-strategy-kit animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="bg-[var(--web-spruce)] min-h-[90vh] flex items-center">
        <Container size="xl" className="w-full">
          <div className="py-32 lg:py-40">
            <Grid cols={1} className="lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 xl:gap-24 items-start">
              {/* Left Column */}
              <div>
                <div className="h-4 w-32 bg-white/10 rounded mb-5" />
                <div className="h-14 w-3/4 bg-white/15 rounded mb-3" />
                <div className="h-14 w-1/2 bg-white/12 rounded mb-8" />
                <div className="h-5 w-full bg-white/8 rounded mb-2" />
                <div className="h-5 w-4/5 bg-white/8 rounded mb-10" />

                <div className="space-y-3 mb-10">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-white/10 rounded-full shrink-0" />
                      <div className="h-4 w-3/4 bg-white/8 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column — Form Card */}
              <div className="bg-white rounded-[2px] shadow-2xl overflow-hidden">
                <div className="px-8 pt-8 pb-0">
                  <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-56 bg-gray-100 rounded mb-6" />
                  <div className="h-px bg-gray-100" />
                </div>
                <div className="px-8 py-6">
                  <Stack gap="md">
                    <div className="h-12 bg-gray-100 rounded" />
                    <div className="h-12 bg-gray-100 rounded" />
                    <div className="h-12 bg-gray-100 rounded" />
                    <div className="h-12 bg-[var(--web-spruce)]/20 rounded" />
                  </Stack>
                </div>
              </div>
            </Grid>
          </div>
        </Container>
      </section>

      {/* Strategies Section Skeleton */}
      <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
        <Container size="lg">
          <div className="text-center mb-16">
            <div className="h-3 w-36 bg-gray-200 rounded mx-auto mb-5" />
            <div className="h-10 w-80 bg-gray-300 rounded mx-auto mb-4 max-w-full" />
            <div className="h-5 w-96 bg-gray-200 rounded mx-auto max-w-full" />
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 bg-white border border-[var(--web-serenity)]/12 rounded-[2px]">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-[140px] shrink-0">
                    <div className="h-12 w-16 bg-gray-200 rounded mb-3" />
                    <div className="w-10 h-10 bg-gray-100 rounded-full" />
                  </div>
                  <div className="flex-1">
                    <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
                    <div className="h-7 w-48 bg-gray-300 rounded mb-3" />
                    <div className="h-4 w-full bg-gray-100 rounded mb-1" />
                    <div className="h-4 w-3/4 bg-gray-100 rounded" />
                  </div>
                  <div className="md:w-[180px] shrink-0 flex md:flex-col gap-6 md:gap-4">
                    <div>
                      <div className="h-8 w-16 bg-gray-300 rounded mb-1" />
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                    </div>
                    <div>
                      <div className="h-8 w-20 bg-gray-300 rounded mb-1" />
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}