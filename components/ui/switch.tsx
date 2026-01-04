/**
 * CATALYST - Switch Component
 *
 * Hybrid CSS/Tailwind approach — Tailwind always wins:
 *
 * BASE CSS (design/components/ui.css in @layer components):
 * - Layout, sizing, border, focus ring, disabled state, hit target
 * - Thumb sizing + translations
 *
 * TAILWIND (below):
 * - Colors only (track + thumb)
 *
 * @source shadcn/ui + @base-ui/react
 */

"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "ui-switch",
        "data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 dark:data-checked:bg-primary border-transparent shadow-xs aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="ui-switch__thumb bg-background dark:data-unchecked:bg-foreground dark:data-checked:bg-primary-foreground"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
