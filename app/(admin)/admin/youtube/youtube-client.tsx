/**
 * CATALYST - YouTube Scripts Kanban Board
 *
 * Displays scripts in a kanban layout grouped by status.
 * Script creation and detail views are separate pages.
 */

"use client"

import * as React from "react"
import Link from "next/link"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { Stack, Row, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import {
  PlusIcon,
  Loader2Icon,
  TrashIcon,
  FileTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  RadioIcon,
  TvIcon,
  LightbulbIcon,
  PenLineIcon,
  SparklesIcon,
  ArrowLeftIcon,
} from "lucide-react"
import {
  type YouTubeScript,
  type ScriptStatus,
  updateScriptStatus,
  deleteYouTubeScript,
} from "@/lib/actions/youtube"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { ProfileChip } from "./_components/profile-selector"
import { PROFILES, type ProfileSlug } from "@/lib/youtube/profiles"

// =============================================================================
// CONSTANTS
// =============================================================================

const COLUMNS: {
  status: ScriptStatus
  label: string
  icon: React.ElementType
  color: string
}[] = [
  { status: "idea", label: "Ideas", icon: LightbulbIcon, color: "text-amber-500" },
  { status: "script_drafted", label: "Script Drafted", icon: PenLineIcon, color: "text-orange-500" },
  { status: "script_ready", label: "Script Ready", icon: FileTextIcon, color: "text-blue-500" },
  { status: "script_recorded", label: "Script Recorded", icon: RadioIcon, color: "text-purple-500" },
  { status: "script_live", label: "Script Live", icon: TvIcon, color: "text-green-500" },
]

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function YouTubeClient({
  initialScripts,
  profile,
}: {
  initialScripts: YouTubeScript[]
  profile: ProfileSlug
}) {
  const [scripts, setScripts] = React.useState(initialScripts)
  const [deleteTarget, setDeleteTarget] = React.useState<YouTubeScript | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [activeDragId, setActiveDragId] = React.useState<string | null>(null)
  const profileMeta = PROFILES[profile]

  // 8px activation distance so clicks on the card (navigation) still work.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  )

  const columns = React.useMemo(() => {
    const grouped = new Map<ScriptStatus, YouTubeScript[]>()
    for (const col of COLUMNS) grouped.set(col.status, [])
    for (const script of scripts) {
      const col = grouped.get(script.status)
      if (col) col.push(script)
    }
    return grouped
  }, [scripts])

  const activeScript = React.useMemo(
    () => (activeDragId ? scripts.find((s) => s.id === activeDragId) ?? null : null),
    [activeDragId, scripts]
  )

  async function updateStatus(script: YouTubeScript, newStatus: ScriptStatus) {
    const previousStatus = script.status
    setScripts((prev) =>
      prev.map((s) => (s.id === script.id ? { ...s, status: newStatus } : s))
    )
    const result = await updateScriptStatus(script.id, newStatus)
    if (result.success) {
      toast("Status updated")
    } else {
      setScripts((prev) =>
        prev.map((s) => (s.id === script.id ? { ...s, status: previousStatus } : s))
      )
      toast("Failed to update status", { type: "error" })
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragId(null)
    const { active, over } = event
    if (!over) return
    const script = scripts.find((s) => s.id === active.id)
    if (!script) return
    const newStatus = over.id as ScriptStatus
    if (script.status === newStatus) return
    void updateStatus(script, newStatus)
  }

  function handleDragCancel() {
    setActiveDragId(null)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    const result = await deleteYouTubeScript(deleteTarget.id)
    if (result.success) {
      setScripts((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      toast("Script deleted")
    } else {
      toast("Failed to delete", { type: "error" })
    }
    setIsDeleting(false)
    setDeleteTarget(null)
  }

  return (
    <Stack gap="lg">
      {/* Back to picker */}
      <Row align="center" gap="xs">
        <Button variant="ghost" size="sm" render={<Link href="/admin/youtube" />}>
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Change person
        </Button>
      </Row>

      {/* Header */}
      <Row align="center" className="justify-between">
        <Stack gap="xs">
          <Title size="h3">{profileMeta.displayName}&rsquo;s Scripts</Title>
          <Text variant="muted" size="sm">
            Generate, validate, and track {profileMeta.displayName}&rsquo;s video script pipeline
          </Text>
        </Stack>
        <Button render={<Link href={`/admin/youtube/new?profile=${profile}`} />}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Script
        </Button>
      </Row>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
          {COLUMNS.map((col) => (
            <DroppableColumn
              key={col.status}
              col={col}
              scripts={columns.get(col.status) || []}
              activeDragId={activeDragId}
              onDelete={(s) => setDeleteTarget(s)}
            />
          ))}
        </div>
        <DragOverlay dropAnimation={null}>
          {activeScript ? <ScriptCardContent script={activeScript} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Script</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <TrashIcon className="h-4 w-4 mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Stack>
  )
}

// =============================================================================
// DROPPABLE COLUMN
// =============================================================================

function DroppableColumn({
  col,
  scripts,
  activeDragId,
  onDelete,
}: {
  col: (typeof COLUMNS)[number]
  scripts: YouTubeScript[]
  activeDragId: string | null
  onDelete: (script: YouTubeScript) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.status })
  const Icon = col.icon

  return (
    <Stack gap="sm" className="min-w-0">
      <Row gap="sm" align="center" className="px-1">
        <Icon className={cn("h-4 w-4", col.color)} />
        <Title size="h5">{col.label}</Title>
        <Badge variant="secondary" size="sm">
          {scripts.length}
        </Badge>
      </Row>

      <Stack
        ref={setNodeRef}
        gap="xs"
        className={cn(
          "rounded-lg bg-muted/30 p-2 min-h-32 transition-colors",
          isOver && "bg-muted/70 ring-2 ring-primary/40"
        )}
      >
        {scripts.length === 0 && (
          <Text variant="muted" size="sm" className="text-center py-6">
            No scripts
          </Text>
        )}
        {scripts.map((script) => (
          <ScriptCard
            key={script.id}
            script={script}
            isDragging={activeDragId === script.id}
            onDelete={onDelete}
          />
        ))}
      </Stack>
    </Stack>
  )
}

// =============================================================================
// SCRIPT CARD
// =============================================================================

function ScriptCard({
  script,
  isDragging,
  onDelete,
}: {
  script: YouTubeScript
  isDragging: boolean
  onDelete: (script: YouTubeScript) => void
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: script.id })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn("touch-none", isDragging && "opacity-40")}
    >
      <ScriptCardContent script={script} onDelete={onDelete} />
    </div>
  )
}

function ScriptCardContent({
  script,
  onDelete,
}: {
  script: YouTubeScript
  onDelete?: (script: YouTubeScript) => void
}) {
  const hasScript = !!script.script_body
  const hasValidation = script.validation_score !== null

  // Card-wide Link overlay sits behind a pointer-events-none CardContent so the
  // whole card navigates without nesting interactive elements inside the anchor.
  return (
    <Card className="relative cursor-grab active:cursor-grabbing hover:bg-muted/50 transition-colors group">
      <Link
        href={`/admin/youtube/${script.id}`}
        draggable={false}
        aria-label={`Open ${script.title}`}
        className="absolute inset-0 rounded-lg"
      />
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1 right-1 z-10 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onDelete(script)
          }}
        >
          <TrashIcon className="h-3.5 w-3.5" />
        </Button>
      )}
      <CardContent className="relative pointer-events-none p-2.5">
        <Stack gap="xs">
          <Text size="sm" className="font-medium line-clamp-2">
            {script.title}
          </Text>

          {script.topic && (
            <Text variant="muted" size="sm" className="line-clamp-2">
              {script.topic}
            </Text>
          )}

          <Row gap="xs" wrap align="center">
            <ProfileChip slug={script.profile_slug} />
            {script.target_length && (
              <Badge variant="outline" size="sm">
                {script.target_length.replace(/_/g, " ")}
              </Badge>
            )}
            {hasScript && (
              <Badge variant="secondary" size="sm">
                <FileTextIcon className="h-3 w-3 mr-1" />
                Script
              </Badge>
            )}
            {hasValidation && (
              <Badge
                variant={script.validation_score! >= 70 ? "default" : "destructive"}
                size="sm"
              >
                {script.validation_score! >= 70 ? (
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                ) : (
                  <XCircleIcon className="h-3 w-3 mr-1" />
                )}
                {script.validation_score}%
              </Badge>
            )}
          </Row>

          <Row className="justify-between text-xs text-muted-foreground">
            {script.word_count ? (
              <span>{script.word_count.toLocaleString()} words</span>
            ) : (
              <span />
            )}
            <span>
              {script.created_at
                ? new Date(script.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })
                : ""}
            </span>
          </Row>

          {/* Generate Script CTA for ideas without a script */}
          {script.status === "idea" && !hasScript && (
            <Button
              size="sm"
              className="w-full gap-1.5 pointer-events-auto"
              onPointerDown={(e) => e.stopPropagation()}
              render={<Link href={`/admin/youtube/${script.id}`} />}
            >
              <SparklesIcon className="h-3.5 w-3.5" />
              Generate Script
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
