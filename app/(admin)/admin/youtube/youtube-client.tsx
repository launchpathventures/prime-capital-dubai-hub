/**
 * CATALYST - YouTube Scripts Kanban Board
 *
 * Displays scripts in a kanban layout grouped by status.
 * Script creation and detail views are separate pages.
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { Stack, Row, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
} from "lucide-react"
import {
  type YouTubeScript,
  type ScriptStatus,
  updateScriptStatus,
  deleteYouTubeScript,
} from "@/lib/actions/youtube"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

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

const STATUS_OPTIONS: { value: ScriptStatus; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "script_drafted", label: "Script Drafted" },
  { value: "script_ready", label: "Script Ready" },
  { value: "script_recorded", label: "Script Recorded" },
  { value: "script_live", label: "Script Live" },
]

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function YouTubeClient({ initialScripts }: { initialScripts: YouTubeScript[] }) {
  const [scripts, setScripts] = React.useState(initialScripts)
  const [deleteTarget, setDeleteTarget] = React.useState<YouTubeScript | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const columns = React.useMemo(() => {
    const grouped = new Map<ScriptStatus, YouTubeScript[]>()
    for (const col of COLUMNS) grouped.set(col.status, [])
    for (const script of scripts) {
      const col = grouped.get(script.status)
      if (col) col.push(script)
    }
    return grouped
  }, [scripts])

  async function handleStatusChange(script: YouTubeScript, newStatus: ScriptStatus) {
    const result = await updateScriptStatus(script.id, newStatus)
    if (result.success) {
      setScripts((prev) =>
        prev.map((s) => (s.id === script.id ? { ...s, status: newStatus } : s))
      )
      toast("Status updated")
    } else {
      toast("Failed to update status", { type: "error" })
    }
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
      {/* Header */}
      <Row align="center" className="justify-between">
        <Stack gap="xs">
          <Title size="h3">YouTube Scripts</Title>
          <Text variant="muted" size="sm">
            Generate, validate, and track your video script pipeline
          </Text>
        </Stack>
        <Button render={<Link href="/admin/youtube/new" />}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Script
        </Button>
      </Row>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colScripts = columns.get(col.status) || []
          const Icon = col.icon
          return (
            <Stack key={col.status} gap="sm" className="min-w-0">
              <Row gap="sm" align="center" className="px-1">
                <Icon className={cn("h-4 w-4", col.color)} />
                <Title size="h5">{col.label}</Title>
                <Badge variant="secondary" size="sm">
                  {colScripts.length}
                </Badge>
              </Row>

              <Stack gap="xs" className="rounded-lg bg-muted/30 p-2 min-h-32">
                {colScripts.length === 0 && (
                  <Text variant="muted" size="sm" className="text-center py-6">
                    No scripts
                  </Text>
                )}
                {colScripts.map((script) => (
                  <ScriptCard
                    key={script.id}
                    script={script}
                    onStatusChange={handleStatusChange}
                    onDelete={(s) => setDeleteTarget(s)}
                  />
                ))}
              </Stack>
            </Stack>
          )
        })}
      </div>

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
// SCRIPT CARD
// =============================================================================

function ScriptCard({
  script,
  onStatusChange,
  onDelete,
}: {
  script: YouTubeScript
  onStatusChange: (script: YouTubeScript, status: ScriptStatus) => void
  onDelete: (script: YouTubeScript) => void
}) {
  const hasScript = !!script.script_body
  const hasValidation = script.validation_score !== null

  return (
    <Link href={`/admin/youtube/${script.id}`} className="block">
      <Card className="cursor-pointer hover:bg-muted/50 transition-colors group">
        <CardContent className="p-3">
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
                className="w-full gap-1.5"
                onClick={(e) => {
                  e.preventDefault()
                  window.location.href = `/admin/youtube/${script.id}`
                }}
              >
                <SparklesIcon className="h-3.5 w-3.5" />
                Generate Script
              </Button>
            )}

            <Row gap="xs" align="center" className="pt-1">
              <div className="flex-1" onClick={(e) => e.preventDefault()}>
                <Select
                  value={script.status}
                  onValueChange={(value) =>
                    onStatusChange(script, value as ScriptStatus)
                  }
                  items={STATUS_OPTIONS}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.preventDefault()
                  onDelete(script)
                }}
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </Button>
            </Row>
          </Stack>
        </CardContent>
      </Card>
    </Link>
  )
}
