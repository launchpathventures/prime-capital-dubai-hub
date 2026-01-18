/**
 * CATALYST - Spec Card Dialog Component
 *
 * Clickable spec card that opens a dialog with summary + markdown viewer.
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Stack, Row, Text } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MarkdownViewer } from "@/components/shared"
import {
  CheckCircle2,
  XCircle,
  FileText,
  Compass,
  Users,
  Palette,
  Layers,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SpecCardDialogProps {
  name: string
  filename: string
  description: string
  exists: boolean
  lastModified?: string
  content?: string
}

// -----------------------------------------------------------------------------
// Icon mapping
// -----------------------------------------------------------------------------

const specIcons: Record<string, React.ElementType> = {
  Vision: Compass,
  Experience: Users,
  Brand: Palette,
  Architecture: Layers,
}

const specSummaries: Record<string, string> = {
  Vision: "The north star document. Defines why this project exists, what success looks like, and the principles that guide decisions. Read this first to understand the project's purpose.",
  Experience: "Defines who the users are, what journeys they take, and what features serve them. The bridge between vision and implementation.",
  Brand: "Voice, tone, visuals, and communication style. How the project looks, feels, and speaks to its audience.",
  Architecture: "Technical decisions, stack choices, patterns, and conventions. The blueprint for how the codebase is structured.",
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function SpecCardDialog({
  name,
  filename,
  description,
  exists,
  lastModified,
  content,
}: SpecCardDialogProps) {
  const Icon = specIcons[name] || FileText
  const summary = specSummaries[name] || description

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            className={cn(
              "spec-card group relative w-full text-left p-4 rounded-xl border transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/20",
              exists
                ? "bg-muted/50 border-transparent hover:bg-muted/80 hover:border-primary/30 hover:shadow-md"
                : "bg-muted/30 border-dashed border-border hover:border-primary/30 hover:shadow-md"
            )}
          />
        }
      >
        <Stack gap="xs">
          {/* Header */}
          <Row gap="sm" align="center" justify="between">
            <Row gap="sm" align="center">
              <div
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  exists
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <Text size="base" weight="semibold" className="transition-colors">
                {name}
              </Text>
              {exists && lastModified && (
                <Badge variant="outline" className="text-xs border-border bg-muted/50 text-muted-foreground">
                  {lastModified}
                </Badge>
              )}
            </Row>
            {exists ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-muted-foreground" />
            )}
          </Row>

          {/* Description */}
          <Text size="sm" variant="muted" className="line-clamp-2">
            {description}
          </Text>

          {/* Missing spec indicator */}
          {!exists && (
            <Text size="xs" className="text-amber-600 dark:text-amber-400">
              Not created yet
            </Text>
          )}
        </Stack>
      </DialogTrigger>

      <DialogContent className="!max-w-[48rem] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <Row gap="sm" align="center">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <Row gap="sm" align="center">
                <DialogTitle className="text-lg font-semibold">{name}</DialogTitle>
                <Badge
                  variant="outline"
                  className="text-xs font-mono border-primary/50 bg-primary/10 text-primary"
                >
                  INIT
                </Badge>
                {exists && lastModified && (
                  <Badge
                    variant="outline"
                    className="text-xs border-border bg-muted/50 text-muted-foreground"
                  >
                    {lastModified}
                  </Badge>
                )}
              </Row>
              <DialogDescription className="font-mono text-xs">
                catalyst/specs/{filename}
              </DialogDescription>
            </div>
          </Row>
        </DialogHeader>

        <Stack gap="md" className="flex-1 overflow-hidden">
          {/* Summary */}
          <div className="p-4 rounded-lg bg-muted/50 border">
            <Text size="sm" variant="muted">
              {summary}
            </Text>
          </div>

          {/* Content */}
          {exists && content ? (
            <div className="flex-1 overflow-hidden">
              <MarkdownViewer
                title={name}
                filename={filename}
                content={content}
                maxHeight={400}
              />
            </div>
          ) : (
            <Stack gap="md" align="center" justify="center" className="flex-1 py-12">
              <div className="p-4 rounded-full bg-muted">
                <XCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <Stack gap="xs" align="center">
                <Text weight="medium">Spec not created yet</Text>
                <Text size="sm" variant="muted" className="text-center max-w-sm">
                  Create this spec in <code className="text-xs bg-muted px-1 py-0.5 rounded">catalyst/specs/{filename}</code> to define your project&apos;s {name.toLowerCase()}.
                </Text>
              </Stack>
            </Stack>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
