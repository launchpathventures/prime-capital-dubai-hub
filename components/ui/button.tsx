/**
 * CATALYST - Button Component
 *
 * Hybrid CSS/Tailwind approach — Tailwind always wins:
 * 
 * BASE CSS (design/components/ui.css in @layer components):
 * - Display, cursor, transitions, focus ring, disabled state
 * - Default sizing (h-9, px-2.5, gap-1.5)
 * - Border radius, border width (via theme tokens)
 * - SVG child styling
 *
 * TAILWIND (CVA below):
 * - Colors only (bg, text, hover states)
 * - Size variants just apply BEM class for CSS defaults
 *
 * CUSTOM OVERRIDES:
 * - Any Tailwind class overrides base CSS
 * - Example: className="h-14 px-8 rounded-full border-0"
 *
 * Theme tokens used (globals.css):
 * - --radius-md, --border-width, --ring-width
 * - --duration-fast, --ease-out, --opacity-disabled
 *
 * @source shadcn/ui + base-ui
 */

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button variants — COLORS ONLY.
 * All structural styles are in design/components/ui.css
 */
const buttonVariants = cva("", {
  variants: {
    variant: {
      default:
        "ui-button--default bg-primary text-primary-foreground hover:bg-primary/80",
      outline:
        "ui-button--outline bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:hover:bg-input/50",
      secondary:
        "ui-button--secondary bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost:
        "ui-button--ghost border-transparent hover:border-muted hover:bg-muted hover:text-foreground dark:hover:border-muted/50 dark:hover:bg-muted/50",
      destructive:
        "ui-button--destructive bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30",
      link: "ui-button--link text-primary hover:bg-primary/10",
      underline: "ui-button--underline text-primary hover:underline",
    },
    size: {
      default: "ui-button--md",
      xs: "ui-button--xs",
      sm: "ui-button--sm",
      lg: "ui-button--lg",
      icon: "ui-button--icon",
      "icon-xs": "ui-button--icon-xs",
      "icon-sm": "ui-button--icon-sm",
      "icon-lg": "ui-button--icon-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn("ui-button", buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
