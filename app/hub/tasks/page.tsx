/**
 * CATALYST - Hub Tasks Page
 *
 * All tasks view across projects.
 * Shows filterable list with status, priority, and assignee.
 */

import { Container, Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TaskList } from "@/components/hub"
import { hubConfig } from "@/lib/hub/config"
import type { Task, Project } from "@/lib/hub/types"
import { FilterIcon, CheckSquareIcon, AlertCircleIcon, ClockIcon } from "lucide-react"

// -----------------------------------------------------------------------------
// Mock Data (replace with Supabase queries)
// -----------------------------------------------------------------------------

const mockProjects: Record<string, Project> = {
  "1": {
    id: "1",
    slug: "platform-development",
    name: "Platform Development",
    description: "Building the unified Prime Capital platform",
    status: "active",
    clientName: "Prime Capital",
    progress: 65,
    displayOrder: 0,
    createdAt: "2025-12-01T00:00:00Z",
    updatedAt: "2026-01-04T00:00:00Z",
  },
  "2": {
    id: "2",
    slug: "brand-guidelines",
    name: "Brand Guidelines",
    description: "Finalizing brand identity",
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
    project: mockProjects["1"],
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
    project: mockProjects["1"],
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
    project: mockProjects["1"],
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
    project: mockProjects["1"],
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
    project: mockProjects["1"],
  },
  {
    id: "6",
    projectId: "2",
    title: "Review final typography specs",
    description: "Confirm Palatino/Lato usage across all components",
    status: "pending",
    priority: "high",
    assigneeId: "user2",
    assigneeName: "Faisal",
    dueDate: "2026-01-04",
    completedAt: null,
    displayOrder: 0,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    project: mockProjects["2"],
  },
]

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function HubTasksPage() {
  // Group tasks by status
  const pendingTasks = mockTasks.filter(t => t.status === "pending")
  const inProgressTasks = mockTasks.filter(t => t.status === "in_progress")
  const completedTasks = mockTasks.filter(t => t.status === "completed")
  
  // Find overdue tasks
  const overdueTasks = mockTasks.filter(t => 
    t.dueDate && 
    t.status !== "completed" && 
    new Date(t.dueDate) < new Date()
  )

  return (
    <Container size="lg">
      <Stack gap="xl">
        {/* Page Header */}
        <Row justify="between" align="center">
          <Stack gap="xs">
            <Title size="h3">{hubConfig.labels.tasks}</Title>
            <Text variant="muted">
              {mockTasks.length} {mockTasks.length === 1 ? "task" : "tasks"} total
            </Text>
          </Stack>
          <Row gap="sm">
            <Button variant="outline" size="sm" className="gap-2">
              <FilterIcon className="h-4 w-4" />
              Filter
            </Button>
          </Row>
        </Row>

        {/* Task Stats */}
        <Row gap="md" className="flex-wrap">
          <Card className="flex-1 min-w-[150px]">
            <CardContent className="py-4">
              <Row gap="sm" align="center">
                <ClockIcon className="h-5 w-5 text-warning" />
                <Stack gap="none">
                  <Text size="lg" weight="medium">{pendingTasks.length + inProgressTasks.length}</Text>
                  <Text size="xs" variant="muted">Active</Text>
                </Stack>
              </Row>
            </CardContent>
          </Card>
          <Card className="flex-1 min-w-[150px]">
            <CardContent className="py-4">
              <Row gap="sm" align="center">
                <AlertCircleIcon className="h-5 w-5 text-destructive" />
                <Stack gap="none">
                  <Text size="lg" weight="medium">{overdueTasks.length}</Text>
                  <Text size="xs" variant="muted">Overdue</Text>
                </Stack>
              </Row>
            </CardContent>
          </Card>
          <Card className="flex-1 min-w-[150px]">
            <CardContent className="py-4">
              <Row gap="sm" align="center">
                <CheckSquareIcon className="h-5 w-5 text-success" />
                <Stack gap="none">
                  <Text size="lg" weight="medium">{completedTasks.length}</Text>
                  <Text size="xs" variant="muted">Completed</Text>
                </Stack>
              </Row>
            </CardContent>
          </Card>
        </Row>

        {/* In Progress */}
        {inProgressTasks.length > 0 && (
          <Card>
            <CardHeader>
              <Row gap="sm" align="center">
                <CardTitle>In Progress</CardTitle>
                <Badge variant="secondary">{inProgressTasks.length}</Badge>
              </Row>
            </CardHeader>
            <CardContent>
              <TaskList tasks={inProgressTasks} showProject />
            </CardContent>
          </Card>
        )}

        {/* Pending */}
        {pendingTasks.length > 0 && (
          <Card>
            <CardHeader>
              <Row gap="sm" align="center">
                <CardTitle>Pending</CardTitle>
                <Badge variant="outline">{pendingTasks.length}</Badge>
              </Row>
            </CardHeader>
            <CardContent>
              <TaskList tasks={pendingTasks} showProject />
            </CardContent>
          </Card>
        )}

        {/* Completed */}
        {completedTasks.length > 0 && (
          <Card>
            <CardHeader>
              <Row gap="sm" align="center">
                <CardTitle>Completed</CardTitle>
                <Badge variant="default">{completedTasks.length}</Badge>
              </Row>
            </CardHeader>
            <CardContent>
              <TaskList tasks={completedTasks} showProject />
            </CardContent>
          </Card>
        )}
      </Stack>
    </Container>
  )
}
