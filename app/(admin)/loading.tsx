/**
 * CATALYST - Admin Surface Loading State
 *
 * Loading skeleton shown while admin pages are loading.
 * Displays inside AdminShell, maintaining sidebar/header visibility.
 */

import { Container, Stack } from "@/components/core"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
  return (
    <Container size="lg">
      <Stack gap="lg">
        {/* Page header skeleton */}
        <Stack gap="sm">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </Stack>

        {/* Stats row skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-lg border border-border bg-card"
            >
              <Stack gap="sm">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </Stack>
            </div>
          ))}
        </div>

        {/* Content area skeleton */}
        <div className="rounded-lg border border-border bg-card">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <Stack gap="xs" className="flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </Stack>
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Stack>
    </Container>
  )
}
