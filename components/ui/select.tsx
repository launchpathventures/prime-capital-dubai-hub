/**
 * CATALYST - Select Component
 *
 * @source shadcn/ui v3.6.2 + @base-ui/react v1.0.0
 * @customised Yes — renders label by default (not raw value)
 *
 * BASE UI BEHAVIOR NOTE:
 * By default, Base UI's SelectValue renders the raw `value` (e.g., "7d").
 * This component is customised to render the **label** instead (e.g., "Last 7 days").
 *
 * HOW IT WORKS:
 * Pass an `items` array to <Select> with { value, label } objects.
 * SelectValue will automatically look up and display the matching label.
 *
 * @example
 *   const items = [
 *     { value: "7d", label: "Last 7 days" },
 *     { value: "30d", label: "Last 30 days" },
 *   ]
 *
 *   <Select items={items} value={value} onValueChange={setValue}>
 *     <SelectTrigger>
 *       <SelectValue placeholder="Select..." />
 *     </SelectTrigger>
 *     <SelectContent>
 *       {items.map((item) => (
 *         <SelectItem key={item.value} value={item.value}>
 *           {item.label}
 *         </SelectItem>
 *       ))}
 *     </SelectContent>
 *   </Select>
 */

"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

// =============================================================================
// TYPES
// =============================================================================

/** Item shape for automatic label lookup in SelectValue */
export interface SelectItemType {
  value: string | number | null
  label: string
}

// =============================================================================
// CONTEXT - Pass items from Select to SelectValue for label lookup
// =============================================================================

const SelectItemsContext = React.createContext<SelectItemType[] | undefined>(undefined)

// =============================================================================
// SELECT ROOT - Wraps Base UI with items context
// =============================================================================

interface SelectProps<Value = string, Multiple extends boolean | undefined = false> 
  extends SelectPrimitive.Root.Props<Value, Multiple> {
  /**
   * Array of { value, label } items for automatic label lookup.
   * When provided, SelectValue will display the label instead of the raw value.
   */
  items?: SelectItemType[]
}

function Select<Value = string, Multiple extends boolean | undefined = false>({ 
  items, 
  children, 
  ...props 
}: SelectProps<Value, Multiple>) {
  return (
    <SelectItemsContext.Provider value={items}>
      <SelectPrimitive.Root {...props}>
        {children}
      </SelectPrimitive.Root>
    </SelectItemsContext.Provider>
  )
}

// =============================================================================
// SELECT VALUE - Displays label (not raw value) when items are provided
// =============================================================================

interface SelectValueProps extends Omit<SelectPrimitive.Value.Props, "children"> {
  /** Placeholder text when no value is selected */
  placeholder?: string
  /**
   * Custom render function. Receives the current value.
   * If not provided and items exist, label is looked up automatically.
   */
  children?: React.ReactNode | ((value: unknown) => React.ReactNode)
}

function SelectValue({ className, placeholder, children, ...props }: SelectValueProps) {
  const items = React.useContext(SelectItemsContext)

  // If children is a render function, use it directly
  if (typeof children === "function") {
    return (
      <SelectPrimitive.Value
        data-slot="select-value"
        className={cn("flex flex-1 text-left", className)}
        {...props}
      >
        {children}
      </SelectPrimitive.Value>
    )
  }

  // If items are provided, look up label automatically
  if (items) {
    return (
      <SelectPrimitive.Value
        data-slot="select-value"
        className={cn("flex flex-1 text-left", className)}
        {...props}
      >
        {(value) => {
          if (value === null || value === undefined) {
            return <span className="text-muted-foreground">{placeholder}</span>
          }
          const item = items.find((i) => i.value === value)
          return item?.label ?? String(value)
        }}
      </SelectPrimitive.Value>
    )
  }

  // Default: render placeholder or let Base UI handle it
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    >
      {children ?? (placeholder ? <span className="text-muted-foreground">{placeholder}</span> : null)}
    </SelectPrimitive.Value>
  )
}

// =============================================================================
// SELECT TRIGGER
// =============================================================================

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "ui-select__trigger",
        "cursor-pointer border-input data-[placeholder]:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 gap-1.5 rounded-md border bg-transparent py-2 pr-2 pl-2.5 text-sm shadow-xs transition-[color,box-shadow] focus-visible:ring-[3px] aria-invalid:ring-[3px] data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:flex *:data-[slot=select-value]:gap-1.5 [&_svg:not([class*='size-'])]:size-4 flex w-fit items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon className="text-muted-foreground size-4 pointer-events-none" />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

// =============================================================================
// SELECT CONTENT (Popup)
// =============================================================================

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  alignItemWithTrigger = false,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn("ui-select__content", "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-36 rounded-md shadow-md ring-1 duration-100 relative isolate z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto", className )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

// =============================================================================
// SELECT GROUP & LABEL
// =============================================================================

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
}

// =============================================================================
// SELECT ITEM
// =============================================================================

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "ui-select__item",
        "cursor-pointer focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full items-center outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 gap-2 shrink-0 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={<span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />}
      >
        <CheckIcon className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

// =============================================================================
// SELECT SEPARATOR
// =============================================================================

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border -mx-1 my-1 h-px pointer-events-none", className)}
      {...props}
    />
  )
}

// =============================================================================
// SCROLL BUTTONS
// =============================================================================

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 top-0 w-full", className)}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 bottom-0 w-full", className)}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
