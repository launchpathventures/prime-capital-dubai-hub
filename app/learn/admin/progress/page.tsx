/**
 * Admin Progress Page
 *
 * Team progress dashboard showing learner completion and certification status.
 * Uses real data from database instead of mock data.
 */

import Link from "next/link"
import { Container, Stack, Grid, Row, Text, Title, Avatar } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangleIcon,
  UsersIcon,
  AwardIcon,
  ClockIcon,
} from "lucide-react"
import { requireAdmin } from "@/lib/auth/require-auth"
import {
  getAllLearnersWithProgress,
  getProgressStats,
  formatRelativeTime,
  type LearnerSummary,
} from "@/lib/lms/admin-queries"

// Force dynamic rendering
export const dynamic = "force-dynamic"

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default async function AdminProgressPage() {
  await requireAdmin()

  const [learners, stats] = await Promise.all([
    getAllLearnersWithProgress(),
    getProgressStats(),
  ])

  // Sort by progress descending by default
  const sortedLearners = [...learners].sort((a, b) => b.overallProgress - a.overallProgress)

  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Page Header */}
        <Stack gap="xs">
          <Title size="h3">Team Progress</Title>
          <Text variant="muted">
            Monitor learner progress and certification readiness across the team.
          </Text>
        </Stack>

        {/* Stats Overview */}
        <Grid cols={4} gap="md">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row gap="sm" align="baseline">
                <Title size="h2">{stats.averageProgress}%</Title>
              </Row>
              <Progress value={stats.averageProgress} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                <Row gap="xs" align="center">
                  <ClockIcon className="h-4 w-4" />
                  Ready for Certification
                </Row>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row gap="sm" align="baseline">
                <Title size="h2">{stats.readyCount}</Title>
                <Text size="sm" variant="muted">learners</Text>
              </Row>
              <Text size="xs" variant="muted" className="mt-1">
                Awaiting founder session
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                <Row gap="xs" align="center">
                  <AwardIcon className="h-4 w-4" />
                  Certified Consultants
                </Row>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row gap="sm" align="baseline">
                <Title size="h2">{stats.certifiedCount}</Title>
                <Text size="sm" variant="muted">/ {stats.totalLearners}</Text>
              </Row>
              <Text size="xs" variant="muted" className="mt-1">
                Ready for client contact
              </Text>
            </CardContent>
          </Card>

          <Card className={stats.atRiskCount > 0 ? "border-warning/50" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                <Row gap="xs" align="center">
                  <AlertTriangleIcon className="h-4 w-4" />
                  At Risk
                </Row>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row gap="sm" align="baseline">
                <Title size="h2" className={stats.atRiskCount > 0 ? "text-warning" : ""}>
                  {stats.atRiskCount}
                </Title>
                <Text size="sm" variant="muted">learners</Text>
              </Row>
              <Text size="xs" variant="muted" className="mt-1">
                Inactive &gt;7 days
              </Text>
            </CardContent>
          </Card>
        </Grid>

        {/* Learners List */}
        {sortedLearners.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <Stack gap="sm" align="center">
                <UsersIcon className="h-12 w-12 text-muted-foreground/50" />
                <Text variant="muted">No learners found</Text>
                <Text size="sm" variant="muted">
                  Learners will appear here once they sign up.
                </Text>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3">
                        <Text size="sm" weight="medium" variant="muted">Learner</Text>
                      </th>
                      <th className="text-left px-4 py-3 w-40">
                        <Text size="sm" weight="medium" variant="muted">Progress</Text>
                      </th>
                      <th className="text-left px-4 py-3 w-32">
                        <Text size="sm" weight="medium" variant="muted">Status</Text>
                      </th>
                      <th className="text-left px-4 py-3 w-32">
                        <Text size="sm" weight="medium" variant="muted">Last Activity</Text>
                      </th>
                      <th className="text-left px-4 py-3 w-24">
                        <Text size="sm" weight="medium" variant="muted"></Text>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sortedLearners.map((learner) => (
                      <LearnerRow key={learner.id} learner={learner} />
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legend */}
        <Card>
          <CardContent className="py-3">
            <Row gap="lg" align="center" justify="center">
              <Row gap="xs" align="center">
                <Badge variant="default">Certified</Badge>
                <Text size="xs" variant="muted">Completed training</Text>
              </Row>
              <Row gap="xs" align="center">
                <Badge variant="outline">Ready</Badge>
                <Text size="xs" variant="muted">Awaiting certification</Text>
              </Row>
              <Row gap="xs" align="center">
                <Badge variant="secondary">In Progress</Badge>
                <Text size="xs" variant="muted">Still learning</Text>
              </Row>
              <Row gap="xs" align="center">
                <AlertTriangleIcon className="h-4 w-4 text-warning" />
                <Text size="xs" variant="muted">At risk (inactive)</Text>
              </Row>
            </Row>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}

// -----------------------------------------------------------------------------
// Learner Row Component
// -----------------------------------------------------------------------------

interface LearnerRowProps {
  learner: LearnerSummary
}

function LearnerRow({ learner }: LearnerRowProps) {
  const certificationConfig = {
    in_progress: { label: "In Progress", variant: "secondary" as const },
    ready: { label: "Ready", variant: "outline" as const },
    certified: { label: "Certified", variant: "default" as const },
  }

  const { label, variant } = certificationConfig[learner.certificationStatus]

  return (
    <tr className="hover:bg-muted/30 transition-colors">
      {/* Learner Info */}
      <td className="px-4 py-3">
        <Link
          href={`/learn/admin/progress/${learner.id}`}
          className="block hover:opacity-80 transition-opacity"
        >
          <Row gap="sm" align="center">
            <Avatar name={learner.fullName} size="sm" />
            <Stack gap="none" className="min-w-0">
              <Row gap="xs" align="center">
                <Text weight="medium" className="truncate">{learner.fullName}</Text>
                {learner.isAtRisk && (
                  <AlertTriangleIcon className="h-4 w-4 text-warning flex-shrink-0" />
                )}
              </Row>
              <Text size="xs" variant="muted" className="truncate">{learner.email}</Text>
            </Stack>
          </Row>
        </Link>
      </td>

      {/* Progress */}
      <td className="px-4 py-3">
        <Stack gap="xs">
          <Row gap="sm" align="center">
            <Text size="sm" weight="medium">{learner.overallProgress}%</Text>
            <Text size="xs" variant="muted">
              ({learner.completedModules}/{learner.totalModules} modules)
            </Text>
          </Row>
          <Progress value={learner.overallProgress} className="h-1.5" />
        </Stack>
      </td>

      {/* Certification Status */}
      <td className="px-4 py-3">
        <Badge variant={variant}>{label}</Badge>
      </td>

      {/* Last Activity */}
      <td className="px-4 py-3">
        <Text size="xs" variant="muted">
          {formatRelativeTime(learner.lastActivity)}
        </Text>
      </td>

      {/* View Details */}
      <td className="px-4 py-3">
        <Link
          href={`/learn/admin/progress/${learner.id}`}
          className="text-sm text-primary hover:underline"
        >
          View
        </Link>
      </td>
    </tr>
  )
}
