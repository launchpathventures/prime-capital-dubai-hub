/**
 * CATALYST - List Component
 *
 * Typography primitive for lists (ul/ol) with consistent sizing and styling.
 * Use native <li> elements as children.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const listVariants = cva("list-inside", {
  variants: {
    size: {
      xs: "--xs text-xs",
      sm: "--sm text-sm",
      base: "--base text-base",
      lg: "--lg text-lg",
    },
    gap: {
      none: "space-y-0",
      xs: "space-y-0.5",
      sm: "space-y-1",
      md: "space-y-2",
      lg: "space-y-3",
    },
    variant: {
      muted: "--muted text-muted-foreground",
      default: "--default text-foreground",
    },
  },
})

export interface ListProps
  extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement>,
    VariantProps<typeof listVariants> {
  /** Render as ordered list (ol) instead of unordered (ul) */
  ol?: boolean
}

const List = React.forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
  ({ className, size, gap, variant, ol = false, ...props }, ref) => {
    const Component = ol ? "ol" : "ul"
    const listStyle = ol ? "list-decimal" : "list-disc"

    return (
      <Component
        ref={ref as React.Ref<HTMLUListElement> & React.Ref<HTMLOListElement>}
        className={cn("core-list", listStyle, listVariants({ size, gap, variant }), className)}
        {...props}
      />
    )
  }
)
List.displayName = "List"

export { List, listVariants }
