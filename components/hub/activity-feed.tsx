/**
 * CATALYST - Activity Feed Component
 *
 * Displays recent activity for projects and hub dashboard.
 * Shows a timeline of actions with icons and timestamps.
 */

import { Row, Stack, Text } from "@/components/core"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  FolderPlusIcon,
  FolderIcon,
  CheckCircle2Icon,
  CheckSquareIcon,
  EditIcon,
  MessageCircleIcon,
  MessageSquarePlusIcon,
  CheckIcon,
} from "lucide-react"
import type { Activity, ActivityAction } from "@/lib/hub/types"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Action Config
// -----------------------------------------------------------------------------

const actionConfig: Record<ActivityAction, { 
  label: string
  icon: React.ElementType
  color: string
}> = {
  project_created: { 
    label: "created a project", 
    icon: FolderPlusIcon, 
    color: "text-success" 
  },
  project_updated: { 
    label: "updated project", 
    icon: FolderIcon, 
    color: "text-muted-foreground" 
  },
  task_created: { 
    label: "created a task", 
    icon: CheckSquareIcon, 
    color: "text-primary" 
  },
  task_completed: { 
    label: "completed a task", 
    icon: CheckCircle2Icon, 
    color: "text-success" 
  },
  task_updated: { 
    label: "updated a task", 
    icon: EditIcon, 
    color: "text-muted-foreground" 
  },
  question_created: { 
    label: "asked a question", 
    icon: MessageSquarePlusIcon, 
    color: "text-primary" 
  },
  question_answered: { 
    label: "answered a question", 
    icon: MessageCircleIcon, 
    color: "text-success" 
  },
  question_resolved: { 
    label: "resolved a question", 
    icon: CheckIcon, 
    color: "text-success" 
  },
}

// -----------------------------------------------------------------------------
// Helper
// -----------------------------------------------------------------------------

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function getInitials(name: string | null | undefined): string {
  if (!name) return "?"
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

// -----------------------------------------------------------------------------
// Activity Item Component
// -----------------------------------------------------------------------------

interface ActivityItemProps {
  activity: Activity
  className?: string
}

function ActivityItem({ activity, className }: ActivityItemProps) {
  const config = actionConfig[activity.action]
  const Icon = config?.icon || FolderIcon

  return (
    <Row gap="sm" className={cn("hub-activity-item py-2", className)}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="text-xs">
          {getInitials(activity.userName)}
        </AvatarFallback>
      </Avatar>

      <Stack gap="none" className="flex-1 min-w-0">
        <Row gap="xs" align="center" className="flex-wrap">
          <Text size="sm" weight="medium">
            {activity.userName || "Someone"}
          </Text>
          <Text size="sm" variant="muted">
            {config?.label || activity.action}
          </Text>
        </Row>
        {activity.metadata?.title && (
          <Text size="sm" variant="muted" className="truncate">
            &ldquo;{activity.metadata.title as string}&rdquo;
          </Text>
        )}
      </Stack>

      <Row gap="xs" align="center" className="shrink-0">
        <Icon className={cn("h-4 w-4", config?.color || "text-muted-foreground")} />
        <Text size="xs" variant="muted">
          {formatRelativeTime(activity.createdAt)}
        </Text>
      </Row>
    </Row>
  )
}

// -----------------------------------------------------------------------------
// Activity Feed Component
// -----------------------------------------------------------------------------

interface ActivityFeedProps {
  activities: Activity[]
  emptyMessage?: string
  maxItems?: number
  className?: string
}

export function ActivityFeed({ 
  activities, 
  emptyMessage = "No recent activity",
  maxItems,
  className 
}: ActivityFeedProps) {
  const displayActivities = maxItems ? activities.slice(0, maxItems) : activities

  if (displayActivities.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <Text variant="muted">{emptyMessage}</Text>
      </div>
    )
  }

  return (
    <Stack gap="none" className={cn("hub-activity-feed divide-y", className)}>
      {displayActivities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </Stack>
  )
}
