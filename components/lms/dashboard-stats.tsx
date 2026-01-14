/**
 * CATALYST - Dashboard Stats Component
 *
 * Displays progress overview with clean, minimal stat boxes.
 * Uses Prime Capital design system tokens.
 */

import { Card, CardContent } from "@/components/ui/card"
import { Row, Stack, Text } from "@/components/core"
import { getProgressStats } from "@/lib/actions/learning"

export async function DashboardStats() {
  const stats = await getProgressStats()

  return (
    <Row gap="md" className="flex-col sm:flex-row">
      {/* Overall Progress */}
      <ProgressStatCard
        value={`${stats.overallProgressPercent}%`}
        label="Overall Complete"
      />

      {/* Quizzes Passed */}
      <ProgressStatCard
        value={`${stats.passedQuizzes}/${stats.totalQuizzes}`}
        label="Quizzes Passed"
      />

      {/* Behaviours / Modules */}
      <ProgressStatCard
        value={`${stats.completedModules}/${stats.totalModules}`}
        label="Behaviours"
      />
    </Row>
  )
}

interface ProgressStatCardProps {
  value: string
  label: string
}

function ProgressStatCard({ value, label }: ProgressStatCardProps) {
  return (
    <Card className="flex-1 border-border bg-card shadow-none">
      <CardContent className="py-6 px-8">
        <Stack gap="xs" className="items-center text-center">
          <Text className="text-3xl font-light tracking-tight text-tertiary">
            {value}
          </Text>
          <Text size="sm" className="text-muted-foreground">
            {label}
          </Text>
        </Stack>
      </CardContent>
    </Card>
  )
}
