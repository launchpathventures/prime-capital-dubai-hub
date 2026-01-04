/**
 * CATALYST - Stack Component
 *
 * Vertical flex container with consistent gap spacing.
 * Use for vertically stacked content (forms, card bodies, lists).
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Box, gapVariants, alignVariants, justifyVariants, type BoxProps } from "./_base"

const stackVariants = cva("flex flex-col", {
  variants: {
    gap: gapVariants,
    align: alignVariants,
    justify: justifyVariants,
  },
})

export interface StackProps
  extends Omit<BoxProps, "inline">,
    VariantProps<typeof stackVariants> {}

const Stack = React.forwardRef<HTMLElement, StackProps>(
  ({ className, gap, align, justify, ...props }, ref) => (
    <Box
      ref={ref}
      className={cn("core-stack", stackVariants({ gap, align, justify }), className)}
      {...props}
    />
  )
)
Stack.displayName = "Stack"

export { Stack, stackVariants }
