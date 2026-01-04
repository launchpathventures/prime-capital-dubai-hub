/**
 * CATALYST - Kanban Example
 *
 * Demonstrates a drag-and-drop Kanban board with:
 * - Four columns: Backlog, In Progress, Review, Done
 * - Task cards with assignee, priority, and due date
 * - Drag between columns and reorder within columns
 *
 * Uses @dnd-kit for drag-and-drop functionality.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Container, Row, Stack, Text, Avatar, Count, Dot, Title } from "@/components/core"
import { ExamplePrompt, getExample } from "../../_surface"

const example = getExample("kanban")!
import {
  DndContext,
  SortableContext,
  SortableItem,
  arrayMove,
  verticalListSortingStrategy,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  type UniqueIdentifier,
} from "@/components/vendor/dnd-kit"
import { DragOverlay } from "@dnd-kit/core"
import { PlusIcon, CalendarIcon, MoreHorizontalIcon, PencilIcon, TrashIcon, PackageIcon, LayoutGridIcon, FilterIcon } from "lucide-react"

// =============================================================================
// TYPES
// =============================================================================

type ColumnId = "backlog" | "in-progress" | "review" | "done"
type Priority = "high" | "medium" | "low"

interface Task {
  id: string
  title: string
  assignee: string
  priority: Priority
  dueDate: string
}

interface Column {
  id: ColumnId
  title: string
  color: "default" | "info" | "warning" | "success"
}

// =============================================================================
// MOCK DATA
// =============================================================================

const columns: Column[] = [
  { id: "backlog", title: "Backlog", color: "default" },
  { id: "in-progress", title: "In Progress", color: "info" },
  { id: "review", title: "Review", color: "warning" },
  { id: "done", title: "Done", color: "success" },
]

const initialTasks: Record<ColumnId, Task[]> = {
  backlog: [
    { id: "task-1", title: "Define onboarding success metrics", assignee: "Emily Davis", priority: "medium", dueDate: "Jan 08" },
    { id: "task-2", title: "Draft enterprise security FAQ", assignee: "Marcus Johnson", priority: "high", dueDate: "Jan 05" },
    { id: "task-3", title: "Create email templates for win-back", assignee: "Sarah Chen", priority: "low", dueDate: "Jan 12" },
    { id: "task-13", title: "Research competitor pricing pages", assignee: "Rachel Foster", priority: "low", dueDate: "Jan 14" },
  ],
  "in-progress": [
    { id: "task-4", title: "Implement usage dashboard endpoint", assignee: "Alex Thompson", priority: "high", dueDate: "Jan 03" },
    { id: "task-5", title: "Refactor billing webhook retries", assignee: "Marcus Johnson", priority: "medium", dueDate: "Jan 06" },
    { id: "task-6", title: "Design \"Upgrade plan\" CTA states", assignee: "Emily Davis", priority: "low", dueDate: "Jan 09" },
  ],
  review: [
    { id: "task-7", title: "QA: CRM filters + pagination", assignee: "Sarah Chen", priority: "medium", dueDate: "Jan 04" },
    { id: "task-8", title: "Copy review: onboarding checklist", assignee: "Rachel Foster", priority: "low", dueDate: "Jan 07" },
    { id: "task-9", title: "Ship analytics date presets", assignee: "Alex Thompson", priority: "high", dueDate: "Jan 02" },
  ],
  done: [
    { id: "task-10", title: "Publish release notes for v2.3", assignee: "Emily Rodriguez", priority: "low", dueDate: "Dec 20" },
    { id: "task-11", title: "Finalize enterprise contract template", assignee: "David Kim", priority: "high", dueDate: "Dec 18" },
    { id: "task-12", title: "Update status page messaging", assignee: "Kevin O'Brien", priority: "medium", dueDate: "Dec 22" },
  ],
}

// =============================================================================
// PRIORITY BADGE
// =============================================================================

const priorityStyles: Record<Priority, string> = {
  high: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  medium: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  low: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
}

function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge variant="outline" size="sm" className={`capitalize ${priorityStyles[priority]}`}>
      {priority}
    </Badge>
  )
}

// =============================================================================
// TASK CARD COMPONENT
// =============================================================================

interface TaskCardProps {
  task: Task
  isDragging?: boolean
  onDelete?: () => void
}

function TaskCard({ task, isDragging = false, onDelete }: TaskCardProps) {
  return (
    <Card
      className={`kanban-card p-3 cursor-grab active:cursor-grabbing transition-shadow ${
        isDragging ? "shadow-lg ring-2 ring-primary/20" : "hover:shadow-md"
      }`}
    >
      <Stack gap="sm">
        <Row gap="sm" align="start" justify="between">
          <Text size="sm" weight="medium" leading="tight" className="overflow-ellipsis flex-1">
            {task.title}
          </Text>
          {onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 -mr-1 -mt-1" />}
              >
                <MoreHorizontalIcon className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </Row>
        <Row gap="sm" align="center" justify="between">
          <Row gap="sm" align="center">
            <Avatar name={task.assignee} size="sm" />
            <PriorityBadge priority={task.priority} />
          </Row>
          <Row gap="xs" align="center" className="text-muted-foreground">
            <CalendarIcon className="h-3 w-3" />
            <Text size="xs" variant="muted">{task.dueDate}</Text>
          </Row>
        </Row>
      </Stack>
    </Card>
  )
}

// =============================================================================
// KANBAN COLUMN COMPONENT
// =============================================================================

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
  onAddTask: () => void
  onDeleteTask: (taskId: string) => void
}

function KanbanColumn({ column, tasks, onAddTask, onDeleteTask }: KanbanColumnProps) {
  return (
    <Card className="kanban-column w-[280px] shrink-0 flex flex-col">
      {/* Column Header */}
      <div className="kanban-column__header px-4 py-3 border-b border-border">
        <Row gap="sm" align="center" justify="between">
          <Row gap="sm" align="center">
            <Dot color={column.color} />
            <Text size="sm" weight="semibold">{column.title}</Text>
            <Count value={tasks.length} />
          </Row>
          <Button variant="link" size="sm" onClick={onAddTask}>
            <PlusIcon className="h-4 w-4" />
            Add
          </Button>
        </Row>
      </div>

      {/* Column Body */}
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="kanban-column__body flex-1 p-3 space-y-3 min-h-[300px]">
          {tasks.map((task) => (
            <SortableItem key={task.id} id={task.id}>
              <TaskCard task={task} onDelete={() => onDeleteTask(task.id)} />
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </Card>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function KanbanPage() {
  const [tasksByColumn, setTasksByColumn] = useState(initialTasks)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  // Find which column a task belongs to
  const findColumn = (taskId: UniqueIdentifier): ColumnId | null => {
    for (const [columnId, tasks] of Object.entries(tasksByColumn)) {
      if (tasks.find((t) => t.id === taskId)) {
        return columnId as ColumnId
      }
    }
    return null
  }

  // Get the active task for drag overlay
  const activeTask = activeId
    ? Object.values(tasksByColumn).flat().find((t) => t.id === activeId)
    : null

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeColumn = findColumn(active.id)
    const overColumn = findColumn(over.id) ?? (over.id as ColumnId)

    if (!activeColumn || activeColumn === overColumn) return

    // Move task to new column
    setTasksByColumn((prev) => {
      const activeTask = prev[activeColumn].find((t) => t.id === active.id)
      if (!activeTask) return prev

      return {
        ...prev,
        [activeColumn]: prev[activeColumn].filter((t) => t.id !== active.id),
        [overColumn]: [...prev[overColumn], activeTask],
      }
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return

    const activeColumn = findColumn(active.id)
    const overColumn = findColumn(over.id)

    if (!activeColumn || !overColumn) return

    if (activeColumn === overColumn) {
      // Reorder within same column
      setTasksByColumn((prev) => {
        const oldIndex = prev[activeColumn].findIndex((t) => t.id === active.id)
        const newIndex = prev[activeColumn].findIndex((t) => t.id === over.id)
        return {
          ...prev,
          [activeColumn]: arrayMove(prev[activeColumn], oldIndex, newIndex),
        }
      })
    }
  }

  function handleAddTask(columnId: ColumnId) {
    const taskTitles = [
      "Website update",
      "Fix login bug",
      "Update user docs",
      "Review PR #247",
      "Design new icons",
      "API refactor",
      "Add dark mode",
      "Performance audit",
      "Mobile layout fix",
      "Email templates",
    ]
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: `${taskTitles[Math.floor(Math.random() * taskTitles.length)]} (generated)`,
      assignee: ["Sarah Chen", "Marcus Johnson", "Emily Davis"][Math.floor(Math.random() * 3)],
      priority: "medium",
      dueDate: "Jan 15",
    }
    setTasksByColumn((prev) => ({
      ...prev,
      [columnId]: [newTask, ...prev[columnId]],
    }))
  }

  function handleDeleteTask(columnId: ColumnId, taskId: string) {
    setTasksByColumn((prev) => ({
      ...prev,
      [columnId]: prev[columnId].filter((t) => t.id !== taskId),
    }))
  }

  return (
    <Container size="2xl" className="kanban-layout">
      <Stack gap="lg">
        {/* Prompt */}
        <ExamplePrompt summary={example.summary}>
          {example.prompt}
          <Card className="mt-4 p-3 bg-muted/50 border-dashed">
            <Row gap="sm" align="center">
              <PackageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              <Text size="sm" variant="muted">
                Uses{" "}
                <a href="/docs/components/vendor/dnd-kit" className="text-primary hover:underline">@dnd-kit</a>{" "}
                for drag-and-drop — see <code className="bg-background px-1 rounded text-xs">components/vendor/dnd-kit.tsx</code>
              </Text>
            </Row>
          </Card>
        </ExamplePrompt>

        {/* Header */}
        <Card className="kanban-header bg-gradient-to-r from-rose-500/[0.06] via-rose-500/[0.02] to-transparent animate-in fade-in slide-in-from-top-2 duration-500">
          <CardContent className="py-4">
            <Row gap="lg" align="center" justify="between" className="flex-wrap gap-y-4">
              <Row gap="md" align="center">
                <div className="flex size-11 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
                  <LayoutGridIcon className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <Stack gap="none">
                  <Title size="h3">Kanban</Title>
                  <Text size="sm" variant="muted">
                    Organize tasks across your workflow
                  </Text>
                </Stack>
              </Row>
              <Row gap="sm" align="center">
                <Button variant="outline" size="sm">
                  <FilterIcon className="h-4 w-4 mr-1.5" />
                  Filter
                </Button>
                <Button size="sm">
                  <PlusIcon className="h-4 w-4 mr-1.5" />
                  New Task
                </Button>
              </Row>
            </Row>
          </CardContent>
        </Card>

        {/* Kanban Board */}
        <div className="kanban-board -mx-4 px-4 overflow-x-auto pb-4">
          <DndContext
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <Row gap="md" align="start" className="kanban-columns min-w-max">
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={tasksByColumn[column.id]}
                  onAddTask={() => handleAddTask(column.id)}
                  onDeleteTask={(taskId) => handleDeleteTask(column.id, taskId)}
                />
              ))}
            </Row>

            {/* Drag Overlay */}
            <DragOverlay>
              {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </Stack>
    </Container>
  )
}
