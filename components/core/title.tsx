/**
 * CATALYST - Title Component
 *
 * Typography primitive for headings with semantic HTML and consistent styling.
 * Use for page titles, section headings, card titles, etc.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Box, textAlignVariants, colorVariants, type BoxProps } from "./_base"

const titleVariants = cva("font-bold tracking-tight", {
  variants: {
    size: {
      h1: "--h1 text-3xl sm:text-4xl",
      h2: "--h2 text-2xl sm:text-3xl",
      h3: "--h3 text-xl sm:text-2xl",
      h4: "--h4 text-lg sm:text-xl",
      h5: "--h5 text-base sm:text-lg",
      h6: "--h6 text-sm sm:text-base",
    },
    variant: colorVariants,
    align: textAlignVariants,
  },
  defaultVariants: {
    size: "h2",
    variant: "default",
    align: "left",
  },
})

export interface TitleProps
  extends Omit<BoxProps, "as" | "inline">,
    VariantProps<typeof titleVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span"
}

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, size, variant, align, as, ...props }, ref) => {
    // Default to matching semantic heading tag based on size
    const defaultAs = size?.startsWith("h")
      ? (size as "h1" | "h2" | "h3" | "h4" | "h5" | "h6")
      : "h2"

    return (
      <Box
        ref={ref}
        as={as ?? defaultAs}
        className={cn("core-title", titleVariants({ size, variant, align }), className)}
        {...props}
      />
    )
  }
)
Title.displayName = "Title"

export { Title, titleVariants }
