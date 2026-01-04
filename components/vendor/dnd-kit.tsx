/**
 * CATALYST - Drag and Drop Components
 *
 * @source @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
 * @customised Yes
 *   - Re-exports core primitives with simpler names
 *   - Adds SortableItem component with built-in styles
 *   - Provides sensible defaults for common use cases
 *
 * @usage
 *   import {
 *     DndContext,
 *     SortableContext,
 *     SortableItem,
 *     DragOverlay,
 *   } from "@/components/vendor/dnd-kit"
 *
 * @docs https://dndkit.com/
 */

"use client"

import * as React from "react"
import {
  DndContext as DndContextPrimitive,
  DragOverlay as DragOverlayPrimitive,
  closestCenter,
  closestCorners,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import {
  SortableContext as SortableContextPrimitive,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"

// =============================================================================
// RE-EXPORTS
// =============================================================================

// Collision detection algorithms
export { closestCenter, closestCorners, rectIntersection }

// Sorting strategies
export {
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  rectSortingStrategy,
}

// Array helper
export { arrayMove }

// Types
export type { DragStartEvent, DragEndEvent, DragOverEvent, UniqueIdentifier }

// =============================================================================
// DND CONTEXT
// =============================================================================

interface DndContextProps {
  children: React.ReactNode
  /** Called when dragging starts */
  onDragStart?: (event: DragStartEvent) => void
  /** Called when item is dropped */
  onDragEnd: (event: DragEndEvent) => void
  /** Called when dragging over a droppable area */
  onDragOver?: (event: DragOverEvent) => void
  /** Collision detection algorithm. Default: closestCorners */
  collisionDetection?: typeof closestCenter | typeof closestCorners | typeof rectIntersection
}

function DndContext({
  children,
  onDragStart,
  onDragEnd,
  onDragOver,
  collisionDetection = closestCorners,
}: DndContextProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <DndContextPrimitive
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      {children}
    </DndContextPrimitive>
  )
}

// =============================================================================
// SORTABLE CONTEXT
// =============================================================================

interface SortableContextProps {
  children: React.ReactNode
  /** Array of unique identifiers for sortable items */
  items: UniqueIdentifier[]
  /** Sorting strategy. Default: verticalListSortingStrategy */
  strategy?: typeof verticalListSortingStrategy | typeof horizontalListSortingStrategy | typeof rectSortingStrategy
}

function SortableContext({
  children,
  items,
  strategy = verticalListSortingStrategy,
}: SortableContextProps) {
  return (
    <SortableContextPrimitive items={items} strategy={strategy}>
      {children}
    </SortableContextPrimitive>
  )
}

// =============================================================================
// SORTABLE ITEM
// =============================================================================

interface SortableItemProps {
  /** Unique identifier for this item */
  id: UniqueIdentifier
  children: React.ReactNode
  className?: string
  /** Whether this item is disabled */
  disabled?: boolean
  /** Render as a different element */
  as?: React.ElementType
}

function SortableItem({
  id,
  children,
  className,
  disabled = false,
  as: Component = "div",
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Component
      ref={setNodeRef}
      style={style}
      className={cn(
        "sortable-item",
        "touch-none",
        isDragging && "opacity-50 z-50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...attributes}
      {...listeners}
    >
      {children}
    </Component>
  )
}

// =============================================================================
// DRAG HANDLE
// =============================================================================

interface DragHandleProps {
  children: React.ReactNode
  className?: string
}

/**
 * Use inside SortableItem when you want only a specific area to be draggable.
 * Requires using useSortable directly in the parent component.
 */
function DragHandle({ children, className }: DragHandleProps) {
  return (
    <div className={cn("drag-handle", "cursor-grab active:cursor-grabbing", className)}>
      {children}
    </div>
  )
}

// =============================================================================
// DRAG OVERLAY
// =============================================================================

interface DragOverlayProps {
  children: React.ReactNode
  className?: string
}

function DragOverlay({ children, className }: DragOverlayProps) {
  return (
    <DragOverlayPrimitive>
      <div
        className={cn(
          "drag-overlay",
          "shadow-lg ring-2 ring-primary/20 rounded-lg",
          className
        )}
      >
        {children}
      </div>
    </DragOverlayPrimitive>
  )
}

// =============================================================================
// DROPPABLE AREA (for Kanban-style columns)
// =============================================================================

interface DroppableProps {
  /** Unique identifier for this droppable area */
  id: UniqueIdentifier
  children: React.ReactNode
  className?: string
}

/**
 * A droppable container for Kanban-style boards.
 * Wrap sortable items in this to create drop zones.
 */
function Droppable({ id, children, className }: DroppableProps) {
  const { setNodeRef, isOver } = useSortable({
    id,
    data: { type: "container" },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "droppable",
        "transition-colors",
        isOver && "bg-primary/5 ring-2 ring-primary/20 ring-inset",
        className
      )}
    >
      {children}
    </div>
  )
}

// =============================================================================
// HOOKS RE-EXPORT
// =============================================================================

export { useSortable, useSensor, useSensors }

// =============================================================================
// EXPORTS
// =============================================================================

export {
  DndContext,
  SortableContext,
  SortableItem,
  DragHandle,
  DragOverlay,
  Droppable,
}
