/**
 * CATALYST - Admin Tasks Management Page
 *
 * CRUD interface for managing hub tasks.
 * Create, edit, assign, and complete tasks.
 */

import { Container, Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { hubConfig } from "@/lib/hub/config"
import type { Task, TaskStatus, TaskPriority, Project } from "@/lib/hub/types"
import {
  PlusIcon,
  ArrowLeftIcon,
  EditIcon,
  TrashIcon,
  CalendarIcon,
  AlertCircleIcon,
} from "lucide-react"
import Link from "next/link"

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
}

const mockTasks: Task[] = [
  {
    id: "1",
    projectId: "1",
    title: "Implement hub layout and navigation",
    description: "Create the hub shell",
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
    description: "Implement audio recording",
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
    description: "Create database tables",
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
    description: "Create admin pages",
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
    description: "Connect to Supabase Storage",
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
]

// -----------------------------------------------------------------------------
// Config
// -----------------------------------------------------------------------------

const statusConfig: Record<TaskStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "Pending", variant: "outline" },
  in_progress: { label: "In Progress", variant: "secondary" },
  completed: { label: "Completed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

const priorityConfig: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: "Low", color: "text-muted-foreground" },
  medium: { label: "Medium", color: "text-foreground" },
  high: { label: "High", color: "text-warning" },
  urgent: { label: "Urgent", color: "text-destructive" },
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function AdminTasksPage() {
  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Back Link */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-fit gap-1"
          nativeButton={false}
          render={<Link href="/app/hub" />}
        >
          <ArrowLeftIcon className="h-3 w-3" />
          Back to Hub
        </Button>

        {/* Page Header */}
        <Row justify="between" align="center">
          <Stack gap="xs">
            <Title size="h3">Manage {hubConfig.labels.tasks}</Title>
            <Text variant="muted">
              Create and assign tasks across projects
            </Text>
          </Stack>
          <Button className="gap-2">
            <PlusIcon className="h-4 w-4" />
            New Task
          </Button>
        </Row>

        {/* Tasks Table */}
        <Card>
          <CardHeader>
            <CardTitle>{hubConfig.labels.tasks}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTasks.map((task) => {
                  const status = statusConfig[task.status]
                  const priority = priorityConfig[task.priority]
                  const isOverdue = task.dueDate && task.status !== "completed" && new Date(task.dueDate) < new Date()
                  
                  return (
                    <TableRow key={task.id}>
                      <TableCell>
                        <Text size="sm" weight="medium" className="max-w-xs truncate">
                          {task.title}
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Text size="sm" variant="muted">
                          {task.project?.name}
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Text size="sm" className={priority.color}>{priority.label}</Text>
                      </TableCell>
                      <TableCell>
                        {task.assigneeName ? (
                          <Row gap="xs" align="center">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[10px]">
                                {task.assigneeName.split(" ").map(n => n[0]).join("").toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <Text size="sm">{task.assigneeName}</Text>
                          </Row>
                        ) : (
                          <Text size="sm" variant="muted">Unassigned</Text>
                        )}
                      </TableCell>
                      <TableCell>
                        {task.dueDate ? (
                          <Row gap="xs" align="center" className={isOverdue ? "text-destructive" : ""}>
                            {isOverdue && <AlertCircleIcon className="h-3 w-3" />}
                            <CalendarIcon className="h-3 w-3" />
                            <Text size="sm">
                              {new Date(task.dueDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </Text>
                          </Row>
                        ) : (
                          <Text size="sm" variant="muted">No due date</Text>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Row gap="xs" justify="end">
                          <Button variant="ghost" size="icon">
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </Row>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
