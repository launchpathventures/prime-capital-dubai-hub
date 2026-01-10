/**
 * CATALYST - Dashboard Stats Component
 *
 * Displays progress analytics with streak tracking and quiz stats.
 * Server component that fetches real progress data.
 */

import { Card, CardContent } from "@/components/ui/card"
import { Grid, Stack, Text, Title } from "@/components/core"
import { getProgressStats } from "@/lib/actions/learning"
import {
  TrophyIcon,
  TargetIcon,
  FlameIcon,
  CheckCircle2Icon,
} from "lucide-react"

export async function DashboardStats() {
  const stats = await getProgressStats()

  // If user not authenticated, stats will have all zeros
  const isAuthenticated = stats.totalModules > 0 || stats.completedModules > 0

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Text variant="muted" className="text-center">
            Sign in to track your progress
          </Text>
        </CardContent>
      </Card>
    )
  }

  return (
    <Grid cols={4} gap="md" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Overall Progress */}
      <StatCard
        icon={<TargetIcon className="h-5 w-5" />}
        label="Overall Progress"
        value={`${stats.overallProgressPercent}%`}
        subtext={`${stats.completedModules}/${stats.totalModules} modules`}
        color="blue"
      />

      {/* Quizzes Passed */}
      <StatCard
        icon={<CheckCircle2Icon className="h-5 w-5" />}
        label="Quizzes Passed"
        value={`${stats.passedQuizzes}/${stats.totalQuizzes}`}
        subtext={
          stats.totalQuizzes > 0
            ? `${Math.round((stats.passedQuizzes / stats.totalQuizzes) * 100)}% pass rate`
            : "No quizzes yet"
        }
        color="green"
      />

      {/* Current Streak */}
      <StatCard
        icon={<FlameIcon className="h-5 w-5" />}
        label="Current Streak"
        value={stats.currentStreak.toString()}
        subtext={stats.currentStreak === 1 ? "day" : "days"}
        color="orange"
      />

      {/* Modules In Progress */}
      <StatCard
        icon={<TrophyIcon className="h-5 w-5" />}
        label="In Progress"
        value={stats.inProgressModules.toString()}
        subtext={stats.inProgressModules === 1 ? "module" : "modules"}
        color="purple"
      />
    </Grid>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  subtext: string
  color?: "blue" | "green" | "orange" | "purple"
}

function StatCard({ icon, label, value, subtext, color = "blue" }: StatCardProps) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
    green: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950",
    orange: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950",
    purple: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950",
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Stack gap="md">
          <div className={`inline-flex p-2 rounded-lg w-fit ${colorClasses[color]}`}>
            {icon}
          </div>
          <Stack gap="xs">
            <Title size="h2" className="text-3xl">
              {value}
            </Title>
            <Text size="sm" variant="muted">
              {label}
            </Text>
            <Text size="xs" variant="muted">
              {subtext}
            </Text>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
