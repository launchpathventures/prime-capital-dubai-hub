/**
 * CATALYST - Badge Component
 *
 * Hybrid CSS/Tailwind approach — Tailwind always wins:
 *
 * BASE CSS (design/components/ui.css in @layer components):
 * - Display, sizing, border, focus ring, disabled state
 * - SVG sizing and gap defaults
 *
 * TAILWIND (CVA below):
 * - Colors and hover states only
 * - Size variants just apply BEM class
 *
 * @source shadcn/ui v3.6.2 + @base-ui/react v1.0.0
 */

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Colors only; structural base class applied via cn("ui-badge", ...)
const badgeVariants = cva("", {
  variants: {
    variant: {
      default:
        "ui-badge--default bg-primary text-primary-foreground [a&]:hover:bg-primary/80",
      secondary:
        "ui-badge--secondary bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80",
      destructive:
        "ui-badge--destructive bg-destructive/10 text-destructive dark:bg-destructive/20 [a&]:hover:bg-destructive/20",
      outline:
        "ui-badge--outline border-border text-foreground [a&]:hover:bg-muted [a&]:hover:text-muted-foreground",
      ghost:
        "ui-badge--ghost [a&]:hover:bg-muted [a&]:hover:text-muted-foreground dark:[a&]:hover:bg-muted/50",
      link: "ui-badge--link text-primary underline-offset-4 [a&]:hover:underline",
    },
    size: {
      sm: "ui-badge--sm",
      default: "ui-badge--md",
      lg: "ui-badge--lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

function Badge({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn("ui-badge", badgeVariants({ variant, size }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
      size,
    },
  })
}

export { Badge, badgeVariants }
