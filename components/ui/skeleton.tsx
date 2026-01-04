/**
 * CATALYST - Skeleton Component
 *
 * Hybrid CSS/Tailwind approach — Tailwind always wins:
 *
 * BASE CSS (design/components/ui.css in @layer components):
 * - Animation (skeleton-pulse keyframes)
 *
 * TAILWIND (below):
 * - Colors and sizing (bg, rounded)
 *
 * @source shadcn/ui
 */

import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("ui-skeleton", "bg-foreground/10 rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
