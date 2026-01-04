/**
 * CATALYST - Textarea Component
 *
 * Hybrid CSS/Tailwind approach — Tailwind always wins:
 *
 * BASE CSS (design/components/ui.css in @layer components):
 * - Display, sizing, border, focus ring, disabled state
 *
 * TAILWIND (below):
 * - Colors only (bg, border colors, placeholder)
 *
 * @source shadcn/ui v3.6.2
 */

import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "ui-textarea",
        "border-input dark:bg-input/30 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 md:text-sm placeholder:text-muted-foreground flex field-sizing-content w-full disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
