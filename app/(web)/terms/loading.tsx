/**
 * CATALYST - Terms Page Loading State
 */

import { Container, Stack } from "@/components/core"

export default function TermsLoading() {
  return (
    <Container size="md" className="py-16 animate-pulse">
      <Stack gap="lg">
        {/* Title */}
        <Stack gap="sm">
          <div className="h-10 w-64 bg-gray-300 rounded" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
        </Stack>

        {/* Content blocks */}
        <Stack gap="xl">
          {/* Section 1 */}
          <Stack gap="md">
            <div className="h-7 w-48 bg-gray-300 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-4/5 bg-gray-200 rounded" />
          </Stack>

          {/* Section 2 */}
          <Stack gap="md">
            <div className="h-7 w-40 bg-gray-300 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-11/12 bg-gray-200 rounded" />
            <Stack gap="xs" className="pl-6">
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </Stack>
          </Stack>

          {/* Section 3 */}
          <Stack gap="md">
            <div className="h-7 w-56 bg-gray-300 rounded" />
            <div className="h-5 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-4/5 bg-gray-200 rounded" />
          </Stack>

          {/* Section 4 */}
          <Stack gap="md">
            <div className="h-7 w-52 bg-gray-300 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-11/12 bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
          </Stack>

          {/* Section 5 */}
          <Stack gap="md">
            <div className="h-7 w-36 bg-gray-300 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
          </Stack>
        </Stack>
      </Stack>
    </Container>
  )
}
