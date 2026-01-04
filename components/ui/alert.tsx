/**
 * CATALYST - Alert Component
 *
 * Hybrid CSS/Tailwind approach — Tailwind always wins:
 *
 * BASE CSS (design/components/ui.css in @layer components):
 * - Layout (grid), padding, border radius
 * - Icon positioning and sizing
 * - Title/description typography structure
 * - Action positioning
 *
 * TAILWIND (CVA below):
 * - Colors only (bg, border, text per variant)
 *
 * Variants:
 * - default: Neutral card background
 * - muted: Subtle muted background
 * - destructive: Red - errors and critical issues
 * - warning: Amber - warnings and cautions
 * - success: Green - success and confirmations
 * - info: Blue - informational messages
 *
 * @source shadcn/ui
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva("", {
  variants: {
    variant: {
      default:
        "ui-alert--default bg-card text-card-foreground border-border",
      muted:
        "ui-alert--muted bg-muted/50 text-foreground border-border",
      destructive:
        "ui-alert--destructive bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800",
      warning:
        "ui-alert--warning bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800",
      success:
        "ui-alert--success bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800",
      info:
        "ui-alert--info bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn("ui-alert", alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("ui-alert__title", className)}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("ui-alert__description", "text-current/80", className)}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("ui-alert__action", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
