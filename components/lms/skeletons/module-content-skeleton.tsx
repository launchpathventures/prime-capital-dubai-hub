/**
 * CATALYST - Module Content Loading Skeleton
 * 
 * Skeleton specifically for module content area while switching
 * between essentials and deep dive modes.
 */

import { Stack } from "@/components/core"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function ModuleContentSkeleton() {
  return (
    <div className="learn-content">
      <Stack gap="xl">
        {/* Module header */}
        <Stack gap="sm">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full max-w-lg" />
        </Stack>
        
        {/* Coach prompt skeleton */}
        <Skeleton className="h-14 w-full rounded-lg" />
        
        {/* Controls bar skeleton */}
        <Skeleton className="h-12 w-full rounded-lg" />
        
        {/* Content sections */}
        <Stack gap="lg">
          {/* Key Facts card */}
          <Card>
            <CardContent className="p-6">
              <Stack gap="md">
                <Skeleton className="h-6 w-32" />
                <Stack gap="sm">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-5 w-5 rounded flex-shrink-0" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          
          {/* Process Steps card */}
          <Card>
            <CardContent className="p-6">
              <Stack gap="md">
                <Skeleton className="h-6 w-40" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                    <Stack gap="xs" className="flex-1">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-full" />
                    </Stack>
                  </div>
                ))}
              </Stack>
            </CardContent>
          </Card>
          
          {/* Script card */}
          <Card>
            <CardContent className="p-6">
              <Stack gap="md">
                <Skeleton className="h-6 w-36" />
                <Stack gap="sm">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
        
        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-32" />
        </div>
      </Stack>
    </div>
  )
}
