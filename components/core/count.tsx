/**
 * CATALYST - Count Component
 *
 * Numeric badge/counter with tabular numbers for consistent alignment.
 * Use for item counts, notifications, task counts, etc.
 *
 * Wraps Badge with tabular-nums baked in and common count patterns.
 */

import * as React from "react"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"

export interface CountProps extends VariantProps<typeof badgeVariants> {
  /** The count value */
  value: number | string
  /** Optional suffix (e.g., "tasks", "items") */
  suffix?: string
  /** Show as fraction (e.g., "3/5") */
  total?: number
  /** Maximum value before showing "+" (e.g., 99+ for value=100, max=99) */
  max?: number
  /** Additional class names */
  className?: string
}

const Count = React.forwardRef<HTMLSpanElement, CountProps>(
  ({ className, value, suffix, total, max, variant = "secondary" }, ref) => {
    let displayValue: string
    
    if (max !== undefined && typeof value === "number" && value > max) {
      displayValue = `${max}+`
    } else if (total !== undefined) {
      displayValue = `${value}/${total}`
    } else {
      displayValue = String(value)
    }
    
    const content = suffix ? `${displayValue} ${suffix}` : displayValue
    
    return (
      <span
        ref={ref}
        className={cn("core-count ui-badge", badgeVariants({ variant }), "tabular-nums", className)}
      >
        {content}
      </span>
    )
  }
)
Count.displayName = "Count"

export { Count }
