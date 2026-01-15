/**
 * CATALYST - Center Component
 *
 * Centers content both horizontally and vertically.
 * Use for single-child centering like icons, loaders, empty states.
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { Box, type BoxProps } from "./_base"

export type CenterProps = Omit<BoxProps, "inline">

const Center = React.forwardRef<HTMLElement, CenterProps>(
  ({ className, ...props }, ref) => (
    <Box
      ref={ref}
      className={cn("core-center", "flex items-center justify-center", className)}
      {...props}
    />
  )
)
Center.displayName = "Center"

export { Center }
