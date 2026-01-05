/**
 * CATALYST - Task Item Component
 *
 * Single task item for lists and task views.
 * Shows title, status, priority, assignee, and due date.
 */

"use client"

import { Row, Stack, Text } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CalendarIcon, AlertCircleIcon } from "lucide-react"
import type { Task, TaskStatus, TaskPriority } from "@/lib/hub/types"
import { cn } from "@/lib/utils"

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
// Component
// -----------------------------------------------------------------------------

interface TaskItemProps {
  task: Task
  onStatusChange?: (taskId: string, completed: boolean) => void
  showProject?: boolean
  className?: string
}

export function TaskItem({ task, onStatusChange, showProject = false, className }: TaskItemProps) {
  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]
  const isCompleted = task.status === "completed"
  const isOverdue = task.dueDate && !isCompleted && new Date(task.dueDate) < new Date()

  const handleCheckedChange = (checked: boolean) => {
    onStatusChange?.(task.id, checked)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Row 
      gap="md" 
      align="center" 
      className={cn(
        "hub-task-item py-3 px-4 border rounded-lg hover:bg-muted/50 transition-colors",
        isCompleted && "opacity-60",
        className
      )}
    >
      <Checkbox 
        checked={isCompleted}
        onCheckedChange={handleCheckedChange}
        className="shrink-0"
      />

      <Stack gap="xs" className="flex-1 min-w-0">
        <Text 
          size="sm" 
          weight="medium"
          className={cn(isCompleted && "line-through")}
        >
          {task.title}
        </Text>
        
        <Row gap="sm" align="center" className="flex-wrap">
          {showProject && task.project && (
            <Text size="xs" variant="muted">{task.project.name}</Text>
          )}
          
          <Badge variant={status.variant} className="text-xs">
            {status.label}
          </Badge>
          
          {task.priority !== "medium" && (
            <Text size="xs" className={priority.color}>
              {priority.label}
            </Text>
          )}
        </Row>
      </Stack>

      <Row gap="md" align="center" className="shrink-0">
        {task.dueDate && (
          <Row gap="xs" align="center" className={isOverdue ? "text-destructive" : "text-muted-foreground"}>
            {isOverdue && <AlertCircleIcon className="h-3 w-3" />}
            <CalendarIcon className="h-3 w-3" />
            <Text size="xs">{formatDate(task.dueDate)}</Text>
          </Row>
        )}

        {task.assigneeName && (
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-[10px]">
              {task.assigneeName.split(" ").map(n => n[0]).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </Row>
    </Row>
  )
}

// -----------------------------------------------------------------------------
// Task List Component
// -----------------------------------------------------------------------------

interface TaskListProps {
  tasks: Task[]
  onStatusChange?: (taskId: string, completed: boolean) => void
  showProject?: boolean
  emptyMessage?: string
  className?: string
}

export function TaskList({ tasks, onStatusChange, showProject = false, emptyMessage = "No tasks", className }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <Text variant="muted">{emptyMessage}</Text>
      </div>
    )
  }

  return (
    <Stack gap="sm" className={className}>
      {tasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onStatusChange={onStatusChange}
          showProject={showProject}
        />
      ))}
    </Stack>
  )
}
