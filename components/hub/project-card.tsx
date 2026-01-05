/**
 * CATALYST - Project Card Component
 *
 * Card displaying project summary for the hub.
 * Shows name, status, progress, and last activity.
 */

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Row, Stack, Text } from "@/components/core"
import { FolderIcon, CalendarIcon } from "lucide-react"
import type { Project, ProjectStatus } from "@/lib/hub/types"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Status Config
// -----------------------------------------------------------------------------

const statusConfig: Record<ProjectStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  active: { label: "Active", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  on_hold: { label: "On Hold", variant: "outline" },
  archived: { label: "Archived", variant: "outline" },
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const status = statusConfig[project.status]
  const lastUpdated = new Date(project.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  return (
    <Link href={`/hub/projects/${project.slug}`}>
      <Card className={cn("hub-project-card hover:border-primary/50 transition-colors cursor-pointer", className)}>
        <CardHeader className="pb-2">
          <Row justify="between" align="start" gap="sm">
            <Row gap="sm" align="center">
              <FolderIcon className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">{project.name}</CardTitle>
            </Row>
            <Badge variant={status.variant}>{status.label}</Badge>
          </Row>
        </CardHeader>
        <CardContent>
          <Stack gap="md">
            {project.description && (
              <Text size="sm" variant="muted" className="line-clamp-2">
                {project.description}
              </Text>
            )}

            <Stack gap="xs">
              <Row justify="between" align="center">
                <Text size="xs" variant="muted">Progress</Text>
                <Text size="xs" weight="medium">{project.progress}%</Text>
              </Row>
              <Progress value={project.progress} className="h-1.5" />
            </Stack>

            <Row gap="xs" align="center" className="text-muted-foreground">
              <CalendarIcon className="h-3 w-3" />
              <Text size="xs" variant="muted">Updated {lastUpdated}</Text>
            </Row>
          </Stack>
        </CardContent>
      </Card>
    </Link>
  )
}
