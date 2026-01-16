/**
 * CATALYST - Hub Dashboard Page
 *
 * Main dashboard for the client engagement portal.
 * Shows active projects summary, recent activity, and quick stats.
 */

import { Container, Stack, Grid, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProjectCard, ActivityFeed } from "@/components/hub"
import { StatCard } from "@/components/shared"
import { hubConfig } from "@/lib/hub/config"
import type { Project, Activity } from "@/lib/hub/types"
import {
  FolderIcon,
  CheckSquareIcon,
  MessageCircleIcon,
  ArrowRightIcon,
  AlertCircleIcon,
} from "lucide-react"
import Link from "next/link"

// -----------------------------------------------------------------------------
// Mock Data (replace with Supabase queries)
// -----------------------------------------------------------------------------

const mockProjects: Project[] = [
  {
    id: "1",
    slug: "platform-development",
    name: "Platform Development",
    description: "Building the unified Prime Capital platform with website, learning portal, and admin.",
    status: "active",
    clientName: "Prime Capital",
    progress: 65,
    displayOrder: 0,
    createdAt: "2025-12-01T00:00:00Z",
    updatedAt: "2026-01-04T00:00:00Z",
  },
  {
    id: "2",
    slug: "brand-guidelines",
    name: "Brand Guidelines",
    description: "Finalizing brand identity, typography, and visual language for all touchpoints.",
    status: "active",
    clientName: "Prime Capital",
    progress: 85,
    displayOrder: 1,
    createdAt: "2025-11-15T00:00:00Z",
    updatedAt: "2026-01-03T00:00:00Z",
  },
  {
    id: "3",
    slug: "content-migration",
    name: "Content Migration",
    description: "Migrating existing content and setting up CMS for ongoing management.",
    status: "on_hold",
    clientName: "Prime Capital",
    progress: 30,
    displayOrder: 2,
    createdAt: "2025-12-15T00:00:00Z",
    updatedAt: "2026-01-02T00:00:00Z",
  },
]

const mockActivities: Activity[] = [
  {
    id: "1",
    projectId: "1",
    userId: "user1",
    userName: "Tim",
    action: "task_completed",
    targetType: "task",
    targetId: "task1",
    metadata: { title: "Implement voice recorder component" },
    createdAt: "2026-01-05T00:30:00Z",
  },
  {
    id: "2",
    projectId: "1",
    userId: "user2",
    userName: "Faisal",
    action: "question_answered",
    targetType: "question",
    targetId: "q1",
    metadata: { title: "Review typography choices" },
    createdAt: "2026-01-04T15:00:00Z",
  },
  {
    id: "3",
    projectId: "2",
    userId: "user1",
    userName: "Tim",
    action: "project_updated",
    targetType: "project",
    targetId: "2",
    metadata: { title: "Brand Guidelines" },
    createdAt: "2026-01-03T10:00:00Z",
  },
]

// Mock stats
const stats = {
  activeProjects: 2,
  pendingTasks: 12,
  openQuestions: 3,
  overdueTasks: 2,
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function HubDashboardPage() {
  return (
    <Container size="lg">
      <Stack gap="xl">
        {/* Page Header */}
        <Stack gap="xs">
          <Title size="h3">{hubConfig.clientName} Hub</Title>
          <Text variant="muted">
            Welcome to the project engagement portal. Track progress, manage tasks, and collaborate.
          </Text>
        </Stack>

        {/* Stats Overview */}
        <Grid cols={4} gap="md">
          <StatCard
            label={`Active ${hubConfig.labels.projects}`}
            value={stats.activeProjects}
            icon={<FolderIcon className="h-4 w-4" />}
          />
          <StatCard
            label={`Pending ${hubConfig.labels.tasks}`}
            value={stats.pendingTasks}
            icon={<CheckSquareIcon className="h-4 w-4" />}
          />
          <StatCard
            label={`Open ${hubConfig.labels.questions}`}
            value={stats.openQuestions}
            icon={<MessageCircleIcon className="h-4 w-4" />}
          />
          <StatCard
            label="Overdue Tasks"
            value={stats.overdueTasks}
            icon={<AlertCircleIcon className="h-4 w-4" />}
            trend={stats.overdueTasks > 0 ? "down" : "neutral"}
            trendText={stats.overdueTasks > 0 ? "Needs attention" : "All on track"}
          />
        </Grid>

        {/* Main Content */}
        <Grid cols={3} gap="md">
          {/* Active Projects - spans 2 columns */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <Row justify="between" align="center">
                  <div>
                    <CardTitle>Active {hubConfig.labels.projects}</CardTitle>
                    <CardDescription>Your current engagements</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1"
                    render={<Link href="/hub/projects" />}
                  >
                    View all
                    <ArrowRightIcon className="h-3 w-3" />
                  </Button>
                </Row>
              </CardHeader>
              <CardContent>
                <Grid cols={2} gap="md">
                  {mockProjects.filter(p => p.status === "active").map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across projects</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={mockActivities} maxItems={5} />
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and navigation</CardDescription>
          </CardHeader>
          <CardContent>
            <Row gap="md" className="flex-wrap">
              <Button 
                variant="outline" 
                className="gap-2"
                render={<Link href="/hub/tasks" />}
              >
                <CheckSquareIcon className="h-4 w-4" />
                View All Tasks
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                render={<Link href="/hub/questions" />}
              >
                <MessageCircleIcon className="h-4 w-4" />
                View Questions
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                render={<Link href="/app/hub" />}
              >
                <FolderIcon className="h-4 w-4" />
                Hub Admin
              </Button>
            </Row>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
