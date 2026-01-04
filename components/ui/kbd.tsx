/**
 * CATALYST - Keyboard Shortcut Component
 *
 * Displays keyboard shortcuts in a consistent style.
 * Works in both light backgrounds (content) and dark backgrounds (tooltips).
 *
 * @source Custom component
 * @customised No
 *
 * @example
 * <Kbd>Alt+P</Kbd>
 * <Kbd keys={["Ctrl", "K"]} />
 */

import * as React from "react"
import { cn } from "@/lib/utils"

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** Keyboard keys as array (joined with +) */
  keys?: string[]
  /** Children override (alternative to keys prop) */
  children?: React.ReactNode
}

export function Kbd({ keys, children, className, ...props }: KbdProps) {
  const content = children ?? keys?.join("+")

  return (
    <kbd
      className={cn(
        "ui-kbd",
        "inline-flex items-center justify-center",
        "rounded border border-current/20 bg-current/10",
        "px-1.5 py-0.5 font-mono text-[11px] font-medium",
        "opacity-70",
        className
      )}
      {...props}
    >
      {content}
    </kbd>
  )
}
