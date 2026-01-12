/**
 * CATALYST - Dashboard Loading Skeleton
 */

import { Stack, Grid } from "@/components/core"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4">
        <Stack gap="xl">
          {/* Welcome Section */}
          <Stack gap="md" className="text-center max-w-2xl mx-auto">
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-6 w-full max-w-md mx-auto" />
          </Stack>

          {/* Stats Grid */}
          <Stack gap="md">
            <Skeleton className="h-7 w-40" />
            <Grid cols={4} gap="md" className="sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Stack gap="sm">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-3 w-24" />
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </Stack>

          {/* Course Card */}
          <Stack gap="md">
            <Skeleton className="h-7 w-32" />
            <Card className="overflow-hidden">
              <Skeleton className="h-48 sm:h-64 w-full" />
              <CardContent className="pt-6">
                <Stack gap="md">
                  <Skeleton className="h-6 w-40" />
                  <Stack gap="sm">
                    <Skeleton className="h-7 w-full max-w-md" />
                    <Skeleton className="h-5 w-full max-w-lg" />
                  </Stack>
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Stack gap="xs">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full" />
                  </Stack>
                  <Skeleton className="h-12 w-40" />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </div>
    </div>
  )
}
