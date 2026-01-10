/**
 * CATALYST - Module Page Loading Skeleton
 */

import { Stack, Grid } from "@/components/core"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function ModuleSkeleton() {
  return (
    <Stack gap="xl">
      {/* Back link */}
      <Skeleton className="h-5 w-48" />
      
      {/* Header */}
      <Stack gap="sm">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-5 w-full max-w-xl" />
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
      
      {/* Process Steps */}
      <Stack gap="md">
        <Skeleton className="h-7 w-40" />
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                <Stack gap="sm" className="flex-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-20 w-full" />
                </Stack>
              </div>
            </CardContent>
          </Card>
        ))}
      </Stack>
      
      {/* Learning Objectives */}
      <Stack gap="md">
        <Skeleton className="h-7 w-48" />
        <Stack gap="sm">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2">
              <Skeleton className="h-5 w-5 rounded flex-shrink-0" />
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </Stack>
      </Stack>
      
      {/* CTA */}
      <Skeleton className="h-12 w-full max-w-sm mx-auto" />
    </Stack>
  )
}
