/**
 * CATALYST - DnD Kit Documentation
 *
 * Interactive examples for the drag-and-drop components.
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Container, Stack, Row, Text, Title, Avatar } from "@/components/core"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DndContext,
  SortableContext,
  SortableItem,
  arrayMove,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  type DragEndEvent,
} from "@/components/vendor/dnd-kit"
import { GripVerticalIcon } from "lucide-react"

// =============================================================================
// CLIENT-ONLY WRAPPER (prevents hydration mismatch from dnd-kit IDs)
// =============================================================================

function ClientOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return fallback ?? <Skeleton className="h-32 w-full" />
  return <>{children}</>
}

// =============================================================================
// EXAMPLE 1: SIMPLE SORTABLE LIST
// =============================================================================

const initialTasks = [
  { id: "1", title: "Review pull request", priority: "high" },
  { id: "2", title: "Update documentation", priority: "medium" },
  { id: "3", title: "Fix navigation bug", priority: "high" },
  { id: "4", title: "Write unit tests", priority: "low" },
  { id: "5", title: "Deploy to staging", priority: "medium" },
]

function SortableListExample() {
  const [tasks, setTasks] = useState(initialTasks)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const priorityColors = {
    high: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    low: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sortable Task List</CardTitle>
      </CardHeader>
      <CardContent>
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <Stack gap="sm">
              {tasks.map((task) => (
                <SortableItem
                  key={task.id}
                  id={task.id}
                  className="bg-card border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing"
                >
                  <Row gap="sm" align="center">
                    <GripVerticalIcon className="h-4 w-4 text-muted-foreground" />
                    <Text size="sm" className="flex-1">{task.title}</Text>
                    <Badge
                      variant="secondary"
                      className={priorityColors[task.priority as keyof typeof priorityColors]}
                    >
                      {task.priority}
                    </Badge>
                  </Row>
                </SortableItem>
              ))}
            </Stack>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  )
}

// =============================================================================
// EXAMPLE 2: HORIZONTAL SORTABLE
// =============================================================================

const initialAvatars = [
  { id: "a1", name: "Sarah Chen" },
  { id: "a2", name: "Marcus Johnson" },
  { id: "a3", name: "Emily Rodriguez" },
  { id: "a4", name: "Kevin O'Brien" },
]

function HorizontalSortableExample() {
  const [avatars, setAvatars] = useState(initialAvatars)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setAvatars((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horizontal Reordering</CardTitle>
      </CardHeader>
      <CardContent>
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext
            items={avatars.map((a) => a.id)}
            strategy={horizontalListSortingStrategy}
          >
            <Row gap="sm">
              {avatars.map((avatar) => (
                <SortableItem
                  key={avatar.id}
                  id={avatar.id}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <Avatar name={avatar.name} size="lg" />
                </SortableItem>
              ))}
            </Row>
          </SortableContext>
        </DndContext>
        <Text size="xs" variant="muted" className="mt-3">
          Drag avatars to reorder the team
        </Text>
      </CardContent>
    </Card>
  )
}

// =============================================================================
// PAGE
// =============================================================================

export default function DndKitDocsPage() {
  return (
    <Container size="lg">
      <Stack gap="xl">
        {/* Header */}
        <header>
          <Row gap="sm" align="center" className="mb-2">
            <Title size="h1">DnD Kit</Title>
            <Badge variant="secondary">Vendor</Badge>
          </Row>
          <Text variant="muted" size="lg">
            Drag-and-drop primitives for sortable lists and Kanban boards.
          </Text>
        </header>

        {/* Installation */}
        <section>
          <Title size="h3" className="mb-3">Installation</Title>
          <Card>
            <CardContent className="pt-4">
              <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* Usage */}
        <section>
          <Title size="h3" className="mb-3">Usage</Title>
          <Card>
            <CardContent className="pt-4">
              <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`import {
  DndContext,
  SortableContext,
  SortableItem,
  arrayMove,
  verticalListSortingStrategy,
} from "@/components/vendor/dnd-kit"

function MyList() {
  const [items, setItems] = useState([...])

  function handleDragEnd(event) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)}>
        {items.map((item) => (
          <SortableItem key={item.id} id={item.id}>
            {item.name}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  )
}`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* Examples */}
        <section>
          <Title size="h3" className="mb-3">Examples</Title>
          <ClientOnly fallback={<Stack gap="lg"><Skeleton className="h-64 w-full" /><Skeleton className="h-32 w-full" /></Stack>}>
            <Stack gap="lg">
              <SortableListExample />
              <HorizontalSortableExample />
            </Stack>
          </ClientOnly>
        </section>

        {/* API Reference */}
        <section>
          <Title size="h3" className="mb-3">Components</Title>
          <Stack gap="md">
            <Card>
              <CardHeader>
                <CardTitle className="font-mono text-base">DndContext</CardTitle>
              </CardHeader>
              <CardContent>
                <Text size="sm" variant="muted">
                  Wraps your draggable area. Provides sensors for pointer and keyboard interaction.
                </Text>
                <div className="mt-3 space-y-2 text-sm">
                  <div><code className="text-primary">onDragEnd</code> — Required. Called when item is dropped.</div>
                  <div><code className="text-primary">onDragStart</code> — Optional. Called when dragging starts.</div>
                  <div><code className="text-primary">onDragOver</code> — Optional. Called during drag over drop zones.</div>
                  <div><code className="text-primary">collisionDetection</code> — Algorithm for detecting drops. Default: closestCorners.</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-mono text-base">SortableContext</CardTitle>
              </CardHeader>
              <CardContent>
                <Text size="sm" variant="muted">
                  Defines a sortable list. Wrap your sortable items in this.
                </Text>
                <div className="mt-3 space-y-2 text-sm">
                  <div><code className="text-primary">items</code> — Array of unique identifiers.</div>
                  <div><code className="text-primary">strategy</code> — Sorting strategy (vertical, horizontal, or rect).</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-mono text-base">SortableItem</CardTitle>
              </CardHeader>
              <CardContent>
                <Text size="sm" variant="muted">
                  Individual draggable item with built-in drag styles.
                </Text>
                <div className="mt-3 space-y-2 text-sm">
                  <div><code className="text-primary">id</code> — Unique identifier for this item.</div>
                  <div><code className="text-primary">disabled</code> — Disable dragging for this item.</div>
                  <div><code className="text-primary">as</code> — Render as a different element (default: div).</div>
                </div>
              </CardContent>
            </Card>
          </Stack>
        </section>

        {/* Links */}
        <section>
          <Title size="h3" className="mb-3">Resources</Title>
          <Row gap="sm">
            <a
              href="https://dndkit.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              Official Documentation →
            </a>
            <a
              href="https://github.com/clauderic/dnd-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              GitHub →
            </a>
          </Row>
        </section>
      </Stack>
    </Container>
  )
}
