/**
 * CATALYST - Collapsible Component
 *
 * @source shadcn/ui + @base-ui/react
 * @customised Yes — added slide animation using Base-UI CSS variables
 *
 * @usage When using a custom render element (to avoid nested buttons):
 *   <CollapsibleTrigger
 *     render={<div role="button" tabIndex={0} />}
 *     nativeButton={false}  // Required to suppress Base-UI warning
 *   >
 *
 * @animation Uses CSS height transition with Base-UI's --collapsible-panel-height
 *   variable. Animation happens automatically on open/close.
 */

"use client"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { cn } from "@/lib/utils"

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ ...props }: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  )
}

function CollapsibleContent({
  className,
  keepMounted = true,
  ...props
}: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      keepMounted={keepMounted}
      className={cn(
        "ui-collapsible__content",
        "h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-200 ease-out",
        "data-[closed]:h-0",
        className
      )}
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
