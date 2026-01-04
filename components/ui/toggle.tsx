/**
 * CATALYST - Toggle Component
 *
 * @source shadcn/ui + @base-ui/react
 * @customised Yes
 *   - Changed aria-pressed to data-[pressed] (base-ui attribute)
 *   - Added cursor-pointer, disabled:cursor-not-allowed
 */

"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "hover:text-foreground hover:bg-accent data-[pressed]:bg-muted data-[pressed]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive gap-1 cursor-pointer rounded-md text-sm font-medium transition-all [&_svg:not([class*='size-'])]:size-4 group/toggle inline-flex items-center justify-center whitespace-nowrap outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "--default bg-transparent",
        outline: "--outline border-input border bg-transparent shadow-xs",
      },
      size: {
        default: "--default h-9 min-w-9 px-2",
        sm: "--sm h-8 min-w-8 px-1.5",
        lg: "--lg h-10 min-w-10 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn("ui-toggle", toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
