/**
 * CATALYST - Accordion Component
 *
 * @source shadcn/ui + @base-ui/react
 * @customised Yes
 *   - Removed hover:underline from trigger
 *   - Added cursor-pointer to trigger
 *   - Changed overflow from hidden to clip to allow focus rings
 *   - Added px-4 to trigger and content (padding inside clipping boundary)
 *
 * @see useHashState hook (lib/hooks/use-hash-state.ts) for URL hash sync
 * @example
 * // With URL hash navigation
 * const [section, setSection] = useHashState("_default", "intro")
 * <Accordion value={section} onValueChange={setSection}>
 */

"use client"

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("ui-accordion", "flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("ui-accordion__item", "not-last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "ui-accordion__trigger",
          "focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:after:border-ring **:data-[slot=accordion-trigger-icon]:text-muted-foreground cursor-pointer rounded-md px-4 py-4 text-left text-sm font-medium focus-visible:ring-[3px] **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 group/accordion-trigger relative flex flex-1 items-start justify-between border border-transparent transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon data-slot="accordion-trigger-icon" className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden" />
        <ChevronUpIcon data-slot="accordion-trigger-icon" className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="ui-accordion__content data-open:animate-accordion-down data-closed:animate-accordion-up text-sm overflow-clip"
      {...props}
    >
      <div
        className={cn(
          "px-4 pt-0 pb-4 h-(--accordion-panel-height) data-ending-style:h-0 data-starting-style:h-0 [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
