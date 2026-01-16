/**
 * CATALYST - Hub Admin Overview Page
 *
 * Admin dashboard for managing hub content.
 * Shows stats and quick access to projects, tasks, and questions.
 */

import { Container, Stack, Grid, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/shared"
import { hubConfig } from "@/lib/hub/config"
import {
  FolderIcon,
  CheckSquareIcon,
  MessageCircleIcon,
  PlusIcon,
  ArrowRightIcon,
  ActivityIcon,
} from "lucide-react"
import Link from "next/link"

// -----------------------------------------------------------------------------
// Mock Stats (replace with Supabase queries)
// -----------------------------------------------------------------------------

const stats = {
  totalProjects: 4,
  activeProjects: 2,
  totalTasks: 15,
  completedTasks: 8,
  pendingTasks: 7,
  totalQuestions: 6,
  pendingQuestions: 2,
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function AdminHubPage() {
  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Page Header */}
        <Row justify="between" align="center">
          <Stack gap="xs">
            <Title size="h3">Hub Management</Title>
            <Text variant="muted">
              Manage projects, tasks, and questions for {hubConfig.clientName}
            </Text>
          </Stack>
          <Button 
            className="gap-2"
            render={<Link href="/hub" />}
          >
            View Hub
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </Row>

        {/* Stats Overview */}
        <Grid cols={4} gap="md">
          <StatCard
            label={hubConfig.labels.projects}
            value={stats.totalProjects}
            icon={<FolderIcon className="h-4 w-4" />}
            description={`${stats.activeProjects} active`}
          />
          <StatCard
            label={hubConfig.labels.tasks}
            value={stats.totalTasks}
            icon={<CheckSquareIcon className="h-4 w-4" />}
            description={`${stats.completedTasks} completed`}
          />
          <StatCard
            label={hubConfig.labels.questions}
            value={stats.totalQuestions}
            icon={<MessageCircleIcon className="h-4 w-4" />}
            description={`${stats.pendingQuestions} pending`}
          />
          <StatCard
            label="Completion Rate"
            value={`${Math.round((stats.completedTasks / stats.totalTasks) * 100)}%`}
            icon={<ActivityIcon className="h-4 w-4" />}
            trend="up"
            trendText="+5% this week"
          />
        </Grid>

        {/* Quick Actions */}
        <Grid cols={3} gap="md">
          {/* Projects Card */}
          <Card>
            <CardHeader>
              <Row justify="between" align="center">
                <Row gap="sm" align="center">
                  <FolderIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>{hubConfig.labels.projects}</CardTitle>
                </Row>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  render={<Link href="/app/hub/projects" />}
                >
                  <PlusIcon className="h-3 w-3" />
                  New
                </Button>
              </Row>
              <CardDescription>
                Manage client engagement projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="sm">
                <Row justify="between">
                  <Text size="sm" variant="muted">Active</Text>
                  <Text size="sm" weight="medium">{stats.activeProjects}</Text>
                </Row>
                <Row justify="between">
                  <Text size="sm" variant="muted">Total</Text>
                  <Text size="sm" weight="medium">{stats.totalProjects}</Text>
                </Row>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2 gap-1"
                  render={<Link href="/app/hub/projects" />}
                >
                  Manage {hubConfig.labels.projects}
                  <ArrowRightIcon className="h-3 w-3" />
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Tasks Card */}
          <Card>
            <CardHeader>
              <Row justify="between" align="center">
                <Row gap="sm" align="center">
                  <CheckSquareIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>{hubConfig.labels.tasks}</CardTitle>
                </Row>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  render={<Link href="/app/hub/tasks" />}
                >
                  <PlusIcon className="h-3 w-3" />
                  New
                </Button>
              </Row>
              <CardDescription>
                Track and assign project tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="sm">
                <Row justify="between">
                  <Text size="sm" variant="muted">Pending</Text>
                  <Text size="sm" weight="medium">{stats.pendingTasks}</Text>
                </Row>
                <Row justify="between">
                  <Text size="sm" variant="muted">Completed</Text>
                  <Text size="sm" weight="medium">{stats.completedTasks}</Text>
                </Row>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2 gap-1"
                  render={<Link href="/app/hub/tasks" />}
                >
                  Manage {hubConfig.labels.tasks}
                  <ArrowRightIcon className="h-3 w-3" />
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Questions Card */}
          <Card>
            <CardHeader>
              <Row justify="between" align="center">
                <Row gap="sm" align="center">
                  <MessageCircleIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>{hubConfig.labels.questions}</CardTitle>
                </Row>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  render={<Link href="/app/hub/questions" />}
                >
                  <PlusIcon className="h-3 w-3" />
                  New
                </Button>
              </Row>
              <CardDescription>
                Collect feedback and responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="sm">
                <Row justify="between">
                  <Text size="sm" variant="muted">Pending</Text>
                  <Text size="sm" weight="medium">{stats.pendingQuestions}</Text>
                </Row>
                <Row justify="between">
                  <Text size="sm" variant="muted">Total</Text>
                  <Text size="sm" weight="medium">{stats.totalQuestions}</Text>
                </Row>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2 gap-1"
                  render={<Link href="/app/hub/questions" />}
                >
                  Manage {hubConfig.labels.questions}
                  <ArrowRightIcon className="h-3 w-3" />
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Hub Config Info */}
        <Card>
          <CardHeader>
            <CardTitle>Hub Configuration</CardTitle>
            <CardDescription>
              Current settings for this hub deployment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Grid cols={3} gap="md">
              <Stack gap="xs">
                <Text size="sm" variant="muted">Client Name</Text>
                <Text size="sm" weight="medium">{hubConfig.clientName}</Text>
              </Stack>
              <Stack gap="xs">
                <Text size="sm" variant="muted">Voice Recording</Text>
                <Text size="sm" weight="medium">
                  {hubConfig.features.voiceRecording ? "Enabled" : "Disabled"}
                </Text>
              </Stack>
              <Stack gap="xs">
                <Text size="sm" variant="muted">Activity Feed</Text>
                <Text size="sm" weight="medium">
                  {hubConfig.features.activityFeed ? "Enabled" : "Disabled"}
                </Text>
              </Stack>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
