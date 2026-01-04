/**
 * CATALYST - Scroll Hint Component
 *
 * Animated hint suggesting user can scroll or use arrow keys.
 * Typically shown on the first slide of a presentation.
 *
 * @example
 * <ScrollHint />
 * <ScrollHint text="swipe to continue" />
 */

import * as React from "react"
import { cn } from "@/lib/utils"

interface ScrollHintProps {
  /** Custom text (default: "or scroll to continue") */
  text?: string
  /** Additional className for positioning */
  className?: string
}

export function ScrollHint({
  text = "or scroll to continue",
  className,
}: ScrollHintProps) {
  return (
    <div
      className={cn(
        "absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse",
        className
      )}
    >
      <p className="text-muted-foreground/60 flex items-center gap-2 text-xs">
        <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
          ↓
        </kbd>
        <span>{text}</span>
      </p>
    </div>
  )
}
