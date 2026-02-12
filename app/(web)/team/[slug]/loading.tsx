/**
 * CATALYST - Team Member Detail Page Loading State
 */

import { Container, Stack, Grid } from "@/components/core"

export default function TeamMemberLoading() {
  return (
    <div className="web-team-member animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative min-h-[55vh] flex flex-col justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[var(--web-ash)]" />

        <Container size="xl" className="relative z-10 pt-28 pb-16">
          {/* Back Link */}
          <div className="h-4 w-16 bg-white/20 rounded mb-8" />

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Profile Photo */}
            <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-[2px] bg-[var(--web-spruce)]" />

            {/* Name, Role, Short Bio */}
            <Stack gap="md" className="text-center md:text-left">
              {/* Founder badge */}
              <div className="h-3 w-16 bg-white/20 rounded" />

              {/* Name */}
              <div className="h-12 w-64 bg-white/30 rounded" />

              {/* Role */}
              <div className="h-6 w-48 bg-white/20 rounded" />

              {/* Short bio */}
              <div className="h-5 w-full max-w-xl bg-white/15 rounded" />
              <div className="h-5 w-4/5 max-w-lg bg-white/15 rounded" />

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="h-12 w-24 bg-white/10 rounded-[2px]" />
                <div className="h-12 w-28 bg-white/10 rounded-[2px]" />
                <div className="h-12 w-24 bg-white/10 rounded-[2px]" />
              </div>
            </Stack>
          </div>
        </Container>
      </section>

      {/* Content Section Skeleton */}
      <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
        <Container size="xl">
          <Grid cols={1} className="lg:grid-cols-[2fr_1fr] gap-12">
            {/* Left Column: About + Credentials */}
            <Stack gap="xl">
              {/* Background & Experience */}
              <div>
                <div className="h-3 w-16 bg-gray-200 rounded mb-3" />
                <div className="h-8 w-64 bg-gray-300 rounded mb-6" />
                <Stack gap="sm">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded" />
                  <div className="h-4 w-4/5 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded" />
                </Stack>
              </div>

              {/* Credentials */}
              <div className="bg-white rounded-[2px] p-6 shadow-sm">
                <div className="h-6 w-28 bg-gray-300 rounded mb-6" />
                <Stack gap="sm">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-5 w-5 bg-gray-200 rounded-full shrink-0" />
                      <div className="h-4 w-full bg-gray-200 rounded" />
                    </div>
                  ))}
                </Stack>
              </div>
            </Stack>

            {/* Right Column: Expertise + Contact */}
            <Stack gap="lg">
              {/* Areas of Expertise Card */}
              <div className="bg-[var(--web-ash)] rounded-[2px] p-6">
                <div className="h-6 w-40 bg-white/20 rounded mb-6" />
                <Stack gap="sm">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-5 w-5 bg-white/20 rounded-full shrink-0" />
                      <div className="h-4 w-3/4 bg-white/15 rounded" />
                    </div>
                  ))}
                </Stack>
              </div>

              {/* Get in Touch Card */}
              <div className="bg-white rounded-[2px] p-6 shadow-sm">
                <div className="h-6 w-28 bg-gray-300 rounded mb-4" />
                <div className="h-4 w-full bg-gray-200 rounded mb-6" />

                <Stack gap="md">
                  <div className="h-5 w-48 bg-gray-200 rounded" />
                  <div className="h-5 w-40 bg-gray-200 rounded" />
                  <div className="h-5 w-32 bg-gray-200 rounded" />
                  <div className="h-5 w-36 bg-gray-200 rounded" />
                  <div className="pt-4">
                    <div className="h-12 bg-[var(--web-spruce)]/30 rounded-[2px]" />
                  </div>
                </Stack>
              </div>
            </Stack>
          </Grid>
        </Container>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-[var(--web-section-gap)] bg-[var(--web-ash)]">
        <Container size="md">
          <Stack gap="lg" align="center" className="text-center">
            <div className="h-10 w-80 max-w-full bg-white/20 rounded" />
            <div className="h-5 w-96 max-w-full bg-white/15 rounded" />
            <div className="flex gap-4 mt-4">
              <div className="h-12 w-32 bg-white/10 rounded-[2px]" />
              <div className="h-12 w-32 bg-white/10 rounded-[2px]" />
            </div>
          </Stack>
        </Container>
      </section>
    </div>
  )
}
