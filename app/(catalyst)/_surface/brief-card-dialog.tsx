/**
 * CATALYST - Brief Card Dialog Component
 *
 * Clickable brief card that opens a dialog with markdown content.
 * Similar pattern to SpecCardDialog but for briefs.
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
  AlertCircle,
  Clock,
  Rocket,
  CheckCircle2,
  CircleDashed,
  FileText,
  ExternalLink,
  User,
  Tag,
} from "lucide-react"
import { config } from "@/lib/config"
import type { Brief, BriefState, BriefStage } from "@/lib/briefs-types"
import { getStateLabel, getStageLabel, formatBriefDate } from "@/lib/briefs-types"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface BriefCardDialogProps {
  brief: Brief
}

// -----------------------------------------------------------------------------
// Workflow URL mapping
// -----------------------------------------------------------------------------

const stageWorkflowUrls: Record<BriefStage, { url: string; label: string }> = {
  poc: { url: "/docs/workflow/poc", label: "POC workflow" },
  mvp: { url: "/docs/workflow/mvp", label: "MVP workflow" },
  mmp: { url: "/docs/workflow/mmp", label: "MMP workflow" },
  prod: { url: "/docs/workflow/prod", label: "PROD workflow" },
}

// -----------------------------------------------------------------------------
// State styling configuration
// -----------------------------------------------------------------------------

const stateConfig: Record<BriefState, {
  icon: React.ElementType
  badgeClass: string
  cardClass: string
}> = {
  _blocked: {
    icon: AlertCircle,
    badgeClass: "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400",
    cardClass: "border-red-500/20 hover:border-red-500/40",
  },
  _review: {
    icon: Clock,
    badgeClass: "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    cardClass: "border-amber-500/20 hover:border-amber-500/40",
  },
  active: {
    icon: Rocket,
    badgeClass: "border-primary/50 bg-primary/10 text-primary",
    cardClass: "border-primary/20 hover:border-primary/40",
  },
  approved: {
    icon: CheckCircle2,
    badgeClass: "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    cardClass: "border-emerald-500/20 hover:border-emerald-500/40",
  },
  backlog: {
    icon: CircleDashed,
    badgeClass: "border-border bg-muted/50 text-muted-foreground",
    cardClass: "",
  },
  complete: {
    icon: CheckCircle2,
    badgeClass: "border-border bg-muted/50 text-muted-foreground",
    cardClass: "",
  },
  archive: {
    icon: FileText,
    badgeClass: "border-border bg-muted/50 text-muted-foreground",
    cardClass: "",
  },
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BriefCardDialog({ brief }: BriefCardDialogProps) {
  const config_ = stateConfig[brief.state]
  const StateIcon = config_.icon

  const repoUrl = config.links.repo
  const briefUrl = repoUrl
    ? `${repoUrl}/blob/main/catalyst/briefs/${brief.location === "main" ? "" : brief.location + "/"}${brief.filename}`
    : null

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            className={cn(
              "brief-card group relative w-full text-left p-4 rounded-xl border transition-all",
              "focus:outline-none focus:ring-2 focus:ring-primary/20",
              "bg-muted/50 border-transparent hover:bg-muted/70",
              config_.cardClass
            )}
          />
        }
      >
        <Stack gap="sm">
          {/* Header: State Badge + Date */}
          <Row gap="sm" align="center" justify="between" wrap>
            <Badge variant="outline" className={cn("text-xs", config_.badgeClass)}>
              <StateIcon className="h-3 w-3 mr-1" />
              {getStateLabel(brief.state)}
            </Badge>
            {brief.date && (
              <Text size="xs" variant="muted">
                {formatBriefDate(brief.date)}
              </Text>
            )}
          </Row>

          {/* Title */}
          <Text size="base" weight="semibold" className="line-clamp-2 group-hover:text-primary transition-colors">
            {brief.title}
          </Text>

          {/* Metadata row: Assignee, Stage, Tags */}
          <Row gap="sm" align="center" wrap className="text-muted-foreground">
            {brief.assignee && (
              <Row gap="xs" align="center">
                <User className="h-3 w-3" />
                <Text size="xs">{brief.assignee}</Text>
              </Row>
            )}
            {brief.stage && (
              <Badge variant="secondary" size="sm">
                {getStageLabel(brief.stage)}
              </Badge>
            )}
            {brief.tags && brief.tags.length > 0 && (
              <Row gap="xs" align="center">
                <Tag className="h-3 w-3" />
                <Text size="xs">{brief.tags.slice(0, 2).join(", ")}{brief.tags.length > 2 ? "..." : ""}</Text>
              </Row>
            )}
          </Row>
        </Stack>
      </DialogTrigger>

      <DialogContent className="!max-w-[48rem] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <Row gap="sm" align="center" justify="between">
            <Row gap="sm" align="center">
              <div className={cn(
                "p-2.5 rounded-lg",
                brief.state === "_blocked" && "bg-red-500/10 text-red-500",
                brief.state === "_review" && "bg-amber-500/10 text-amber-500",
                brief.state === "active" && "bg-primary/10 text-primary",
                brief.state === "approved" && "bg-emerald-500/10 text-emerald-500",
                (brief.state === "backlog" || brief.state === "complete" || brief.state === "archive") && "bg-muted text-muted-foreground"
              )}>
                <StateIcon className="h-6 w-6" />
              </div>
              <div>
                <Row gap="sm" align="center">
                  <DialogTitle className="text-lg font-semibold">{brief.title}</DialogTitle>
                  {brief.stage && (
                    <Badge variant="outline" className="text-xs font-mono border-primary/50 bg-primary/10 text-primary">
                      {getStageLabel(brief.stage)}
                    </Badge>
                  )}
                </Row>
                <DialogDescription className="font-mono text-xs">
                  catalyst/briefs/{brief.location === "main" ? "" : brief.location + "/"}{brief.filename}
                </DialogDescription>
              </div>
            </Row>
            {briefUrl && (
              <a
                href={briefUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </Row>
        </DialogHeader>

        <Stack gap="md" className="flex-1 overflow-hidden">
          {/* Metadata summary */}
          <div className="p-4 rounded-lg bg-muted/50 border">
            <Row gap="lg" wrap>
              <Row gap="xs" align="center">
                <Text size="xs" variant="muted">State:</Text>
                <Badge variant="outline" className={cn("text-xs", config_.badgeClass)}>
                  {getStateLabel(brief.state)}
                </Badge>
              </Row>
              {brief.date && (
                <Row gap="xs" align="center">
                  <Text size="xs" variant="muted">Date:</Text>
                  <Text size="xs">{formatBriefDate(brief.date)}</Text>
                </Row>
              )}
              {brief.assignee && (
                <Row gap="xs" align="center">
                  <Text size="xs" variant="muted">Assignee:</Text>
                  <Text size="xs">{brief.assignee}</Text>
                </Row>
              )}
              {brief.stage && (
                <Row gap="xs" align="center">
                  <Text size="xs" variant="muted">Stage:</Text>
                  <Badge variant="secondary" size="sm">{getStageLabel(brief.stage)}</Badge>
                </Row>
              )}
              {brief.tags && brief.tags.length > 0 && (
                <Row gap="xs" align="center" wrap>
                  <Text size="xs" variant="muted">Tags:</Text>
                  {brief.tags.map((tag) => (
                    <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
                  ))}
                </Row>
              )}
            </Row>
          </div>
          
          {/* Workflow link */}
          {brief.stage && stageWorkflowUrls[brief.stage] && (
            <Button
              className="w-full"
              nativeButton={false}
              render={
                <a
                  href={stageWorkflowUrls[brief.stage].url}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <Row gap="sm" align="center">
                <span>{stageWorkflowUrls[brief.stage].label}</span>
                <span aria-hidden>→</span>
              </Row>
            </Button>
          )}

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <MarkdownViewer
              title={brief.title}
              filename={brief.filename}
              content={brief.content}
              maxHeight={400}
            />
          </div>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
