/**
 * CATALYST - Dot Component
 *
 * Visual indicator for status, activity, or timeline markers.
 * Use in activity feeds, status indicators, lists.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const dotVariants = cva("rounded-full flex-shrink-0", {
  variants: {
    size: {
      xs: "w-1.5 h-1.5",
      sm: "w-2 h-2",
      md: "w-2.5 h-2.5",
      lg: "w-3 h-3",
    },
    colorVariant: {
      default: "bg-foreground",
      muted: "bg-muted-foreground",
      primary: "bg-primary",
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      danger: "bg-red-500",
      info: "bg-blue-500",
      violet: "bg-violet-500",
    },
    pulse: {
      true: "animate-pulse",
      false: "",
    },
  },
  defaultVariants: {
    size: "sm",
    colorVariant: "primary",
    pulse: false,
  },
})

export interface DotProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof dotVariants> {
  /** Dot color variant */
  color?: "default" | "muted" | "primary" | "success" | "warning" | "danger" | "info" | "violet"
}

const Dot = React.forwardRef<HTMLDivElement, DotProps>(
  ({ className, size, color, pulse, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("core-dot", dotVariants({ size, colorVariant: color, pulse }), className)}
        {...props}
      />
    )
  }
)
Dot.displayName = "Dot"

export { Dot, dotVariants }
