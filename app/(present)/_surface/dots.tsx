/**
 * CATALYST - Inline Slide Navigation (Dots)
 *
 * Fixed right-side navigation showing slide positions.
 * Click to navigate, hover for slide label tooltip.
 *
 * CLASSES:
 * - .present-nav-inline — positioned nav container
 *
 * WHY: Provides visual progress and quick navigation
 * without cluttering the slide content.
 *
 * NOTE: This renders dots, but the class is semantic (.present-nav-inline)
 * so the visual treatment can change without breaking the layout system.
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"

// -----------------------------------------------------------------------------
// SlideDots (Inline Navigation)
// -----------------------------------------------------------------------------

interface SlideDotsProps {
  /** Total number of slides */
  total: number
  /** Currently active slide (0-based) */
  active: number
  /** Optional slide labels for tooltips (defaults to "Slide N") */
  labels?: string[]
  /** Called when a dot is clicked */
  onDotClick?: (index: number) => void
  className?: string
}

export function SlideDots({
  total,
  active,
  labels,
  onDotClick,
  className,
}: SlideDotsProps) {
  return (
    <TooltipProvider delay={300}>
      <nav
        aria-label="Slide navigation"
        className={cn(
          "present-nav-inline",
          className
        )}
      >
        {Array.from({ length: total }, (_, i) => {
          const isActive = i === active
          return (
            <Tooltip key={i}>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() => onDotClick?.(i)}
                    aria-label={labels?.[i] ?? `Go to slide ${i + 1}`}
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      // Square clickable area with dot centered
                      "group flex h-6 w-6 cursor-pointer items-center justify-center rounded-full",
                      "transition-colors duration-200",
                      "hover:bg-primary/20",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                  >
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full transition-all duration-200",
                        isActive
                          ? "bg-foreground scale-125"
                          : "bg-foreground/25 group-hover:bg-primary/60"
                      )}
                    />
                  </button>
                }
              />
              <TooltipContent side="left" sideOffset={6} className="text-xs">
                {labels?.[i] ?? `Slide ${i + 1}`}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </nav>
    </TooltipProvider>
  )
}
