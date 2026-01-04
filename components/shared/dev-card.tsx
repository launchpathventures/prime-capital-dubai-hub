/**
 * CATALYST - Dev Card
 *
 * Generic development helper card for showing dev tools.
 * Respects global devTools config from lib/config.ts.
 *
 * Usage:
 * <DevCard title="Auth" badge={<Badge>Demo</Badge>}>
 *   <p>Content here</p>
 * </DevCard>
 */

"use client"

import * as React from "react"
import { WrenchIcon } from "lucide-react"
import { Text } from "@/components/core"
import { isDevToolsEnabled } from "@/lib/config"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface DevCardProps {
  /** Title shown after "Dev Tools:" */
  title?: string
  /** Badge or element shown in top-right corner */
  badge?: React.ReactNode
  /** Main content */
  children: React.ReactNode
  /** Footer content (optional) */
  footer?: React.ReactNode
  /** Additional class names */
  className?: string
}

// -----------------------------------------------------------------------------
// DevCard Component
// -----------------------------------------------------------------------------

export function DevCard({ title, badge, children, footer, className }: DevCardProps) {
  // Check global dev tools setting
  if (!isDevToolsEnabled()) return null

  return (
    <div className={`dev-card ${className ?? ""}`}>
      {/* Header */}
      <div className="dev-card__header">
        <div className="flex items-center gap-1.5">
          <WrenchIcon className="h-3.5 w-3.5" />
          <Text size="xs" weight="medium">
            Dev Tools{title ? `: ${title}` : ""}
          </Text>
        </div>
        {badge && <div className="dev-card__badge">{badge}</div>}
      </div>

      {/* Content */}
      <div className="dev-card__content">{children}</div>

      {/* Footer (optional) */}
      {footer && <div className="dev-card__footer">{footer}</div>}
    </div>
  )
}

// -----------------------------------------------------------------------------
// DevCard Badge (pre-styled pill badge)
// -----------------------------------------------------------------------------

interface DevCardBadgeProps {
  children: React.ReactNode
}

export function DevCardBadge({ children }: DevCardBadgeProps) {
  return <span className="dev-card__pill">{children}</span>
}
