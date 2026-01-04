/**
 * CATALYST - StatCard Component
 *
 * Dashboard metric card with title, value, optional trend and icon.
 * Used for KPIs, analytics dashboards, overview pages.
 *
 * @customised N/A — custom component
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Row, Stack, Text, Title } from "@/components/core"
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from "lucide-react"

const statCardVariants = cva("", {
  variants: {
    size: {
      sm: "--sm p-4",
      md: "--md p-5",
      lg: "--lg p-6",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  /** Label/title for the metric */
  label: string
  /** The main value to display */
  value: React.ReactNode
  /** Optional description or subtitle */
  description?: string
  /** Trend direction for automatic icon */
  trend?: "up" | "down" | "neutral"
  /** Trend text (e.g., "+12%", "-5 from last week") */
  trendText?: string
  /** Optional icon (top right) */
  icon?: React.ReactNode
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      size,
      label,
      value,
      description,
      trend,
      trendText,
      icon,
      ...props
    },
    ref
  ) => {
    const TrendIcon =
      trend === "up"
        ? TrendingUpIcon
        : trend === "down"
          ? TrendingDownIcon
          : trend === "neutral"
            ? MinusIcon
            : null

    const trendColor =
      trend === "up"
        ? "text-success-600"
        : trend === "down"
          ? "text-destructive-600"
          : "text-muted-foreground"

    return (
      <Card ref={ref} className={cn("stat-card", className)} {...props}>
        <CardContent className={cn(statCardVariants({ size }))}>
          <Stack gap="sm">
            {/* Header: Label + Icon */}
            <Row justify="between" align="start" gap="sm">
              <Text size="sm" weight="medium" variant="muted">
                {label}
              </Text>
              {icon && (
                <Text as="span" variant="muted" className="shrink-0">{icon}</Text>
              )}
            </Row>

            {/* Value */}
            <Title size="h3" className="tracking-tight">{value}</Title>

            {/* Trend / Description */}
            {(trendText || description) && (
              <Row gap="xs" align="center">
                {TrendIcon && trendText && (
                  <TrendIcon className={cn("size-4", trendColor)} />
                )}
                {trendText && (
                  <Text as="span" size="xs" weight="medium" className={trendColor}>
                    {trendText}
                  </Text>
                )}
                {description && (
                  <Text as="span" size="xs" variant="muted">
                    {description}
                  </Text>
                )}
              </Row>
            )}
          </Stack>
        </CardContent>
      </Card>
    )
  }
)
StatCard.displayName = "StatCard"

export { StatCard, statCardVariants }
