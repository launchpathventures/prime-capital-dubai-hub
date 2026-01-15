/**
 * CATALYST - Generic LMS Page Loading Skeleton
 * 
 * Used for pages that don't have a specific skeleton.
 */

import { Stack } from "@/components/core"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function PageSkeleton() {
  return (
    <div className="learn-content">
      <Stack gap="xl">
        {/* Back link */}
        <Skeleton className="h-5 w-32" />
        
        {/* Header */}
        <Stack gap="md">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-full max-w-md" />
        </Stack>

        {/* Content cards */}
        <Stack gap="md">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Stack gap="sm">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
    </div>
  )
}
