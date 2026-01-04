/**
 * CATALYST - Box Component
 *
 * The foundational building block for all Catalyst Core components.
 * Handles polymorphic rendering and provides a clean base for composition.
 *
 * Usage:
 *   <Box>Block content</Box>
 *   <Box inline>Inline content</Box>
 *   <Box as="section">Semantic section</Box>
 *   <Box asChild><a href="#">Link child</a></Box>
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import type { PolymorphicProps, InlineProps, LayoutProps } from "./types"

export interface BoxProps
  extends React.HTMLAttributes<HTMLElement>,
    PolymorphicProps,
    InlineProps,
    LayoutProps {}

const Box = React.forwardRef<HTMLElement, BoxProps>(
  ({ as, asChild = false, inline = false, className, ...props }, ref) => {
    // Determine the element: asChild > as > inline ? span : div
    const defaultTag = inline ? "span" : "div"
    const Comp = asChild ? Slot : (as ?? defaultTag)

    return (
      <Comp
        ref={ref}
        className={cn(className)}
        {...props}
      />
    )
  }
)
Box.displayName = "Box"

export { Box }
