/**
 * CATALYST - Row Component
 *
 * Horizontal flex container with consistent gap spacing.
 * Use for inline content (button groups, icon + text, form rows).
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Box, gapVariants, alignVariants, justifyVariants, wrapVariants, type BoxProps } from "./_base"

const rowVariants = cva("flex flex-row", {
  variants: {
    gap: gapVariants,
    align: alignVariants,
    justify: justifyVariants,
    wrap: wrapVariants,
  },
})

export interface RowProps
  extends BoxProps,
    VariantProps<typeof rowVariants> {}

const Row = React.forwardRef<HTMLElement, RowProps>(
  ({ className, gap, align, justify, wrap, ...props }, ref) => (
    <Box
      ref={ref}
      className={cn("core-row", rowVariants({ gap, align, justify, wrap }), className)}
      {...props}
    />
  )
)
Row.displayName = "Row"

export { Row, rowVariants }
