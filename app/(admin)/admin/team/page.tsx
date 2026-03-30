/**
 * CATALYST - Unified Team Page
 *
 * Single admin page for managing all users: system roles, learning progress,
 * and public team profiles. Primary source is user_profiles (system users),
 * cross-referenced with team_members (public website profiles) by email.
 */

import { Container, Stack, Grid, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "@/lib/lms/admin-queries"
import { getTeamMembersFromDb, type TeamMemberRow } from "@/lib/actions/cms"
import { InviteLearnerButton } from "./invite-learner"
import { TeamClient } from "./team-client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Team | Admin",
}

export default async function TeamAdminPage() {
  await requireAdmin()

  const [users, stats, teamResult] = await Promise.all([
    getAllLearnersWithProgress(),
    getProgressStats(),
    getTeamMembersFromDb(),
  ])

  const teamMembers = teamResult.success ? teamResult.data : []

  // Build email -> team profile lookup + find orphan profiles
  const userEmails = new Set(users.map((u) => u.email.toLowerCase()))
  const teamProfileByEmail: Record<string, TeamMemberRow> = {}
  const orphanProfiles: TeamMemberRow[] = []

  for (const member of teamMembers) {
    if (member.email) {
      const email = member.email.toLowerCase()
      teamProfileByEmail[email] = member
      if (!userEmails.has(email)) {
        orphanProfiles.push(member)
      }
    } else {
      orphanProfiles.push(member)
    }
  }

  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Page Header */}
        <Row justify="between" align="center">
          <Stack gap="xs">
            <Title size="h3">Team</Title>
            <Text variant="muted">
              Manage users, roles, and monitor learning progress.
            </Text>
          </Stack>
          <InviteLearnerButton />
        </Row>

        {/* Stats Overview */}
        <Grid cols={4} gap="md">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                <Row gap="xs" align="center">
                  <UsersIcon className="h-4 w-4" />
                  Total Users
                </Row>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row gap="sm" align="baseline">
                <Title size="h2">{stats.totalLearners}</Title>
                <Text size="sm" variant="muted">accounts</Text>
              </Row>
              <Text size="xs" variant="muted" className="mt-1">
                {stats.averageProgress}% avg. progress
              </Text>
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

        {/* Unified Team Table */}
        <Card>
          <CardContent className="p-4">
            <TeamClient users={users} teamProfiles={teamProfileByEmail} orphanProfiles={orphanProfiles} />
          </CardContent>
        </Card>

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
