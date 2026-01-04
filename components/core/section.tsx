/**
 * CATALYST - Section Component
 *
 * Page section with consistent vertical padding.
 * Use for major page divisions (hero, features, CTA areas).
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Box, type BoxProps } from "./_base"

const sectionVariants = cva("w-full", {
  variants: {
    padding: {
      none: "py-0",
      sm: "py-8 lg:py-12",
      md: "py-12 lg:py-16",
      lg: "py-16 lg:py-24",
      xl: "py-24 lg:py-32",
    },
  },
  defaultVariants: {
    padding: "lg",
  },
})

export interface SectionProps
  extends Omit<BoxProps, "inline">,
    VariantProps<typeof sectionVariants> {}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, padding, as = "section", ...props }, ref) => (
    <Box
      ref={ref}
      as={as}
      className={cn("core-section", sectionVariants({ padding }), className)}
      {...props}
    />
  )
)
Section.displayName = "Section"

export { Section, sectionVariants }
