/**
 * CATALYST - Spacer Component
 *
 * Adds fixed or flexible space between elements.
 * Use sparingly — prefer gap props on Stack/Row when possible.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spacerVariants = cva("block shrink-0", {
  variants: {
    size: {
      xs: "h-1 w-1",
      sm: "h-2 w-2",
      md: "h-4 w-4",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
      "2xl": "h-12 w-12",
    },
    flex: {
      true: "flex-1",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    flex: false,
  },
})

export interface SpacerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spacerVariants> {}

const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ className, size, flex, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("core-spacer", spacerVariants({ size, flex }), className)}
      {...props}
    />
  )
)
Spacer.displayName = "Spacer"

export { Spacer, spacerVariants }
