/**
 * CATALYST - User Notifications Component
 *
 * Bell icon with notification count badge.
 * Placeholder for future notification system.
 */

"use client"

import * as React from "react"
import { BellIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface UserNotificationsProps {
  /** Number of unread notifications */
  count?: number
  /** Maximum count to display (shows "9+" if exceeded) */
  maxCount?: number
  /** Click handler */
  onClick?: () => void
  /** Additional class names */
  className?: string
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function UserNotifications({
  count = 0,
  maxCount = 9,
  onClick,
  className,
}: UserNotificationsProps) {
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString()
  const hasNotifications = count > 0

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("shared-user-notifications", "relative rounded-full text-muted-foreground mt-1 mr-1", className)}
      onClick={onClick}
      aria-label={`Notifications${hasNotifications ? ` (${count} unread)` : ""}`}
    >
      <BellIcon className="h-4 w-4" />
      {hasNotifications && (
        <span
          className={cn(
            "absolute top-0 -right-0.5 flex items-center justify-center",
            "min-w-[18px] h-[18px] px-1 rounded-full",
            "bg-primary text-primary-foreground",
            "text-[10px] font-medium leading-none"
          )}
        >
          {displayCount}
        </span>
      )}
    </Button>
  )
}
