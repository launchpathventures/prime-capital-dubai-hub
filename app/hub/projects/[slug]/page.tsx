/**
 * CATALYST - Hub Project Detail Page
 *
 * Detailed view of a single project.
 * Shows project header, tasks, milestones, and activity.
 */

import { notFound } from "next/navigation"
import { Container, Stack, Grid, Row, Text } from "@/components/core"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TaskList, ActivityFeed } from "@/components/hub"
import { hubConfig } from "@/lib/hub/config"
import type { Project, Task, Activity, ProjectStatus } from "@/lib/hub/types"
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckSquareIcon,
  MessageCircleIcon,
} from "lucide-react"
import Link from "next/link"

// -----------------------------------------------------------------------------
// Mock Data (replace with Supabase queries)
// -----------------------------------------------------------------------------

const mockProjects: Record<string, Project> = {
  "platform-development": {
    id: "1",
    slug: "platform-development",
    name: "Platform Development",
    description: "Building the unified Prime Capital platform with website, learning portal, and admin. This includes migrating existing components, creating new features, and ensuring brand consistency across all touchpoints.",
    status: "active",
    clientName: "Prime Capital",
    progress: 65,
    displayOrder: 0,
    createdAt: "2025-12-01T00:00:00Z",
    updatedAt: "2026-01-04T00:00:00Z",
  },
  "brand-guidelines": {
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
}

const mockTasks: Task[] = [
  {
    id: "1",
    projectId: "1",
    title: "Implement hub layout and navigation",
    description: "Create the hub shell with header and sidebar navigation",
    status: "completed",
    priority: "high",
    assigneeId: "user1",
    assigneeName: "Tim",
    dueDate: "2026-01-03",
    completedAt: "2026-01-03T15:00:00Z",
    displayOrder: 0,
    createdAt: "2025-12-20T00:00:00Z",
    updatedAt: "2026-01-03T15:00:00Z",
  },
  {
    id: "2",
    projectId: "1",
    title: "Create voice recorder component",
    description: "Implement audio recording for question responses",
    status: "completed",
    priority: "high",
    assigneeId: "user1",
    assigneeName: "Tim",
    dueDate: "2026-01-05",
    completedAt: "2026-01-05T00:30:00Z",
    displayOrder: 1,
    createdAt: "2025-12-22T00:00:00Z",
    updatedAt: "2026-01-05T00:30:00Z",
  },
  {
    id: "3",
    projectId: "1",
    title: "Add Supabase schema for hub tables",
    description: "Create database tables for projects, tasks, questions, and activity",
    status: "in_progress",
    priority: "high",
    assigneeId: "user1",
    assigneeName: "Tim",
    dueDate: "2026-01-06",
    completedAt: null,
    displayOrder: 2,
    createdAt: "2025-12-25T00:00:00Z",
    updatedAt: "2026-01-04T00:00:00Z",
  },
  {
    id: "4",
    projectId: "1",
    title: "Implement admin hub management",
    description: "Create admin pages for managing projects, tasks, and questions",
    status: "pending",
    priority: "medium",
    assigneeId: "user1",
    assigneeName: "Tim",
    dueDate: "2026-01-08",
    completedAt: null,
    displayOrder: 3,
    createdAt: "2025-12-28T00:00:00Z",
    updatedAt: "2025-12-28T00:00:00Z",
  },
  {
    id: "5",
    projectId: "1",
    title: "Add file upload to voice recordings",
    description: "Connect voice recorder to Supabase Storage for persistence",
    status: "pending",
    priority: "medium",
    assigneeId: null,
    assigneeName: null,
    dueDate: "2026-01-10",
    completedAt: null,
    displayOrder: 4,
    createdAt: "2025-12-30T00:00:00Z",
    updatedAt: "2025-12-30T00:00:00Z",
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
    targetId: "2",
    metadata: { title: "Create voice recorder component" },
    createdAt: "2026-01-05T00:30:00Z",
  },
  {
    id: "2",
    projectId: "1",
    userId: "user1",
    userName: "Tim",
    action: "task_completed",
    targetType: "task",
    targetId: "1",
    metadata: { title: "Implement hub layout and navigation" },
    createdAt: "2026-01-03T15:00:00Z",
  },
  {
    id: "3",
    projectId: "1",
    userId: "user1",
    userName: "Tim",
    action: "task_created",
    targetType: "task",
    targetId: "5",
    metadata: { title: "Add file upload to voice recordings" },
    createdAt: "2025-12-30T00:00:00Z",
  },
]

// -----------------------------------------------------------------------------
// Status Config
// -----------------------------------------------------------------------------

const statusConfig: Record<ProjectStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  active: { label: "Active", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  on_hold: { label: "On Hold", variant: "outline" },
  archived: { label: "Archived", variant: "outline" },
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params
  const project = mockProjects[slug]

  if (!project) {
    notFound()
  }

  const projectTasks = mockTasks.filter(t => t.projectId === project.id)
  const projectActivities = mockActivities.filter(a => a.projectId === project.id)

  const completedTasks = projectTasks.filter(t => t.status === "completed").length
  const totalTasks = projectTasks.length
  const status = statusConfig[project.status]

  return (
    <Container size="lg">
      <Stack gap="xl">
        {/* Back Link */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-fit gap-1"
          render={<Link href="/hub/projects" />}
        >
          <ArrowLeftIcon className="h-3 w-3" />
          Back to {hubConfig.labels.projects}
        </Button>

        {/* Project Header */}
        <Card>
          <CardHeader>
            <Row justify="between" align="start" gap="md">
              <Stack gap="sm">
                <Row gap="sm" align="center">
                  <CardTitle className="text-2xl">{project.name}</CardTitle>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </Row>
                {project.description && (
                  <CardDescription className="text-base max-w-2xl">
                    {project.description}
                  </CardDescription>
                )}
              </Stack>
              <Row gap="sm">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  render={<Link href={`/hub/questions?project=${project.slug}`} />}
                >
                  <MessageCircleIcon className="h-4 w-4" />
                  {hubConfig.labels.questions}
                </Button>
              </Row>
            </Row>
          </CardHeader>
          <CardContent>
            <Grid cols={3} gap="md">
              <Stack gap="xs">
                <Text size="sm" variant="muted">Progress</Text>
                <Row gap="sm" align="center">
                  <Progress value={project.progress} className="flex-1 h-2" />
                  <Text size="sm" weight="medium">{project.progress}%</Text>
                </Row>
              </Stack>
              <Stack gap="xs">
                <Text size="sm" variant="muted">Tasks</Text>
                <Text size="lg" weight="medium">{completedTasks} / {totalTasks} completed</Text>
              </Stack>
              <Stack gap="xs">
                <Text size="sm" variant="muted">Last Updated</Text>
                <Row gap="xs" align="center">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <Text size="sm">
                    {new Date(project.updatedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </Row>
              </Stack>
            </Grid>
          </CardContent>
        </Card>

        {/* Tasks and Activity */}
        <Grid cols={3} gap="md">
          {/* Tasks - spans 2 columns */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <Row justify="between" align="center">
                  <Row gap="sm" align="center">
                    <CheckSquareIcon className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>{hubConfig.labels.tasks}</CardTitle>
                    <Badge variant="secondary">{projectTasks.length}</Badge>
                  </Row>
                </Row>
              </CardHeader>
              <CardContent>
                <TaskList 
                  tasks={projectTasks} 
                  emptyMessage="No tasks yet"
                />
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Recent updates</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed 
                activities={projectActivities} 
                maxItems={10}
                emptyMessage="No activity yet"
              />
            </CardContent>
          </Card>
        </Grid>
      </Stack>
    </Container>
  )
}
