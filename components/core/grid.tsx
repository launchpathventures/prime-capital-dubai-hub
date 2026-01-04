/**
 * CATALYST - Grid Component
 *
 * CSS Grid container with responsive column support.
 * Use for card grids, feature sections, galleries.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Box, gapVariants, alignVariants, type BoxProps } from "./_base"

/**
 * Responsive column presets — mobile-first with sensible breakpoints.
 */
const colsVariants = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
} as const

const gridVariants = cva("grid", {
  variants: {
    gap: gapVariants,
    cols: colsVariants,
    align: alignVariants,
  },
})

export interface GridProps
  extends Omit<BoxProps, "inline">,
    VariantProps<typeof gridVariants> {}

const Grid = React.forwardRef<HTMLElement, GridProps>(
  ({ className, gap, cols, align, ...props }, ref) => (
    <Box
      ref={ref}
      className={cn("core-grid", gridVariants({ gap, cols, align }), className)}
      {...props}
    />
  )
)
Grid.displayName = "Grid"

export { Grid, gridVariants }
