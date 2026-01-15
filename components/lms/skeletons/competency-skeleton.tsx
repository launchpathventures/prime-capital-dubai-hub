/**
 * CATALYST - Competency Page Loading Skeleton
 */

import { Stack, Grid } from "@/components/core"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function CompetencySkeleton() {
  return (
    <div className="learn-content">
      <Stack gap="xl">
        {/* Back link */}
        <Skeleton className="h-5 w-48" />
      
      {/* Header */}
      <Stack gap="sm">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </Stack>
      
      {/* Context Section */}
      <Stack gap="md">
        <Skeleton className="h-7 w-32" />
        <Stack gap="md">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </Stack>
      </Stack>
      
      {/* Risk/Reward */}
      <Grid cols={2} gap="md" className="grid-cols-1 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <Stack gap="sm">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Stack gap="sm">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Modules List */}
      <Stack gap="md">
        <Skeleton className="h-7 w-48" />
        <Stack gap="sm">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded flex-shrink-0" />
                  <Stack gap="xs" className="flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </Stack>
                  <Skeleton className="h-5 w-5 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
      
      {/* Toolkit */}
      <Stack gap="md">
        <Skeleton className="h-7 w-24" />
        <Stack gap="xs">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-5 w-full" />
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
      </Stack>
    </div>
  )
}
