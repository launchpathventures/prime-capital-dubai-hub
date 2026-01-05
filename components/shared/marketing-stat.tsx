/**
 * CATALYST - Marketing Stat Component
 *
 * Displays a key statistic in simple format for marketing pages.
 * Different from the dashboard StatCard - this is for the homepage stats bar.
 */

import { cn } from "@/lib/utils"
import { type Stat } from "@/lib/content"

interface MarketingStatProps {
  stat: Stat
  className?: string
}

export function MarketingStat({ stat, className }: MarketingStatProps) {
  return (
    <div className={cn("marketing-stat text-center", className)}>
      <div className="text-3xl md:text-4xl font-bold text-primary font-headline">
        {stat.value}
      </div>
      <div className="text-sm text-muted-foreground font-medium mt-1">
        {stat.label}
      </div>
    </div>
  )
}

interface StatsBarProps {
  stats: Stat[]
  className?: string
}

/**
 * Horizontal stats bar for the homepage.
 */
export function StatsBar({ stats, className }: StatsBarProps) {
  return (
    <div
      className={cn(
        "stats-bar grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 py-10 px-6 md:px-12 border-y bg-muted/30",
        className
      )}
    >
      {stats.map((stat) => (
        <MarketingStat key={stat.id} stat={stat} />
      ))}
    </div>
  )
}
