/**
 * CATALYST - Team Page Loading State
 */

import { Container, Stack, Row } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />
}

export default function TeamLoading() {
  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Header */}
        <Row justify="between" align="center">
          <Stack gap="xs">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-64" />
          </Stack>
          <Skeleton className="h-10 w-32" />
        </Row>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-4">
            <Stack gap="md">
              <Row gap="sm">
                <Skeleton className="h-10 w-72" />
                <Skeleton className="h-8 w-48" />
              </Row>
              {Array.from({ length: 6 }).map((_, i) => (
                <Row key={i} gap="md" align="center" className="py-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <Stack gap="xs" className="flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </Stack>
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20" />
                </Row>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
