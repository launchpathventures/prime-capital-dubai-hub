/**
 * CATALYST - Container Component
 *
 * Max-width wrapper with horizontal padding.
 * Use for constraining content width on wide screens.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Box, type BoxProps } from "./_base"

const containerVariants = cva("mx-auto w-full px-4 sm:px-6 lg:px-8", {
  variants: {
    size: {
      sm: "--sm max-w-screen-sm",
      md: "--md max-w-screen-md",
      lg: "--lg max-w-screen-lg",
      xl: "--xl max-w-screen-xl",
      "2xl": "--2xl max-w-screen-2xl",
      full: "--full max-w-full",
    },
  },
  defaultVariants: {
    size: "xl",
  },
})

export interface ContainerProps
  extends Omit<BoxProps, "inline">,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLElement, ContainerProps>(
  ({ className, size, ...props }, ref) => (
    <Box
      ref={ref}
      className={cn("core-container", containerVariants({ size }), className)}
      {...props}
    />
  )
)
Container.displayName = "Container"

export { Container, containerVariants }
