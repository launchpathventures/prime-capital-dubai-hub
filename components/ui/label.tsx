/**
 * CATALYST - Label Component
 *
 * @source shadcn/ui v3.6.2
 * @customised Yes
 *   - Added `required` prop to show red asterisk indicator
 */

"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface LabelProps extends React.ComponentProps<"label"> {
  /** Show a red asterisk to indicate required field */
  required?: boolean
}

function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "ui-label",
        "gap-1 text-sm leading-none font-normal group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-destructive" aria-hidden="true">*</span>
      )}
    </label>
  )
}

export { Label }
export type { LabelProps }
