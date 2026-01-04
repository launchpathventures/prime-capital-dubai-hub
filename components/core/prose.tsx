/**
 * CATALYST - Prose Component
 *
 * Applies typography styles for long-form content (markdown, articles, docs).
 * Based on Tailwind Typography conventions.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Box, type BoxProps } from "./_base"

const proseVariants = cva(
  [
    // Base prose styles
    "prose dark:prose-invert max-w-none",
    // Headings
    "prose-headings:font-semibold prose-headings:tracking-tight",
    // Links
    "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
    // Code
    "prose-code:before:content-none prose-code:after:content-none",
    "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal",
    // Pre
    "prose-pre:bg-muted prose-pre:border",
  ],
  {
    variants: {
      size: {
        sm: "--sm prose-sm",
        base: "--base prose-base",
        lg: "--lg prose-lg",
      },
    },
    defaultVariants: {
      size: "base",
    },
  }
)

export interface ProseProps
  extends Omit<BoxProps, "inline">,
    VariantProps<typeof proseVariants> {}

const Prose = React.forwardRef<HTMLElement, ProseProps>(
  ({ className, size, ...props }, ref) => (
    <Box
      ref={ref}
      className={cn("core-prose", proseVariants({ size }), className)}
      {...props}
    />
  )
)
Prose.displayName = "Prose"

export { Prose, proseVariants }
