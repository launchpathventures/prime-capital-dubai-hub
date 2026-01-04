/**
 * CATALYST - Tabs Component
 *
 * Hybrid CSS/Tailwind approach — Tailwind always wins:
 *
 * BASE CSS (design/components/ui.css in @layer components):
 * - Layout (flex), orientation handling
 * - List sizing and padding
 * - Trigger sizing, focus ring, disabled state
 * - Line variant underline indicator
 *
 * TAILWIND (CVA below):
 * - Colors only (bg, text, hover, active states)
 *
 * @source shadcn/ui + @base-ui/react
 *
 * @see useHashState hook (lib/hooks/use-hash-state.ts) for URL hash sync
 * @example
 * // With URL hash navigation
 * const [tab, setTab] = useHashState("_default", "overview")
 * <Tabs value={tab} onValueChange={setTab}>
 */

"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn("ui-tabs", className)}
      {...props}
    />
  )
}

const tabsListVariants = cva("", {
  variants: {
    variant: {
      default: "ui-tabs__list--default bg-muted text-muted-foreground",
      line: "ui-tabs__list--line bg-transparent text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn("ui-tabs__list", tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "ui-tabs__trigger",
        // Default state
        "text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground",
        // Selected state (default variant) - white bg, dark text
        // base-ui uses data-active for selected state
        "data-active:bg-background data-active:text-foreground data-active:shadow-sm",
        "dark:data-active:bg-input/30 dark:data-active:text-foreground dark:data-active:border-input",
        // Line variant selected - no bg, just underline
        "[&[data-variant=line]]:data-active:bg-transparent [&[data-variant=line]]:data-active:shadow-none",
        // Underline indicator color
        "after:bg-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("ui-tabs__content", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
