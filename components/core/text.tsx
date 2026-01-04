/**
 * CATALYST - Text Component
 *
 * Typography primitive for body text with consistent sizing and styling.
 * Use for paragraphs, descriptions, labels, and inline text.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Box, textAlignVariants, colorVariants, type BoxProps } from "./_base"

const textVariants = cva("", {
  variants: {
    size: {
      xs: "--xs text-xs",
      sm: "--sm text-sm",
      base: "--base text-base",
      lg: "--lg text-lg",
      xl: "--xl text-xl",
      "2xl": "--2xl text-2xl",
    },
    weight: {
      normal: "--normal font-normal",
      medium: "--medium font-medium",
      semibold: "--semibold font-semibold",
      bold: "--bold font-bold",
    },
    variant: colorVariants,
    leading: {
      none: "leading-none",
      tight: "leading-tight",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
    },
    align: textAlignVariants,
    mono: {
      true: "font-mono",
    },
    truncate: {
      true: "truncate",
    },
  },
})

export interface TextProps
  extends Omit<BoxProps, "as">,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div" | "label"
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      className,
      size,
      weight,
      variant,
      leading,
      align,
      mono,
      truncate,
      inline = false,
      as,
      ...props
    },
    ref
  ) => {
    // Default: inline ? span : p
    const defaultAs = inline ? "span" : "p"

    return (
      <Box
        ref={ref}
        as={as ?? defaultAs}
        inline={inline}
        className={cn(
          "core-text",
          textVariants({ size, weight, variant, leading, align, mono, truncate }),
          className
        )}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"

export { Text, textVariants }
