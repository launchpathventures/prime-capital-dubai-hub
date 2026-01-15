/**
 * CATALYST - Input Component
 *
 * Hybrid CSS/Tailwind approach — Tailwind always wins:
 *
 * BASE CSS (design/components/ui.css in @layer components):
 * - Display, sizing, border, focus ring, disabled state
 * - Wrapper layout for adorned/clearable inputs
 *
 * TAILWIND (below):
 * - Colors only (bg, border colors, placeholder)
 * - File input sizing + responsive font size
 *
 * @source shadcn/ui v3.6.2 + @base-ui/react v1.0.0
 */

"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type InputProps = Omit<React.ComponentProps<"input">, "prefix"> & {
  /** Show clear button when input has value */
  clearable?: boolean
  /** Element to show before the input (e.g., icon) */
  startIcon?: React.ReactNode
  /** Element to show after the input (e.g., icon) */
  endIcon?: React.ReactNode
  /** Callback when clear button is clicked */
  onClear?: () => void
}

function Input({
  className,
  type,
  clearable,
  startIcon,
  endIcon,
  value,
  onChange,
  onClear,
  ...props
}: InputProps) {
  const hasWrapper = clearable || startIcon || endIcon
  const hasValue = value !== undefined && value !== ""

  const inputElement = (
    <InputPrimitive
      type={type}
      data-slot="input"
      value={value}
      onChange={onChange}
      className={cn(
        "ui-input",
        "dark:bg-input/30 border-input hover:border-foreground/25 focus:border-primary aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 aria-invalid:ring-[3px] md:text-sm file:h-7 file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground w-full min-w-0 file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        hasWrapper && "ui-input--frameless",
        className
      )}
      {...props}
    />
  )

  if (!hasWrapper) {
    return inputElement
  }

  return (
    <div
      className={cn(
        "ui-input__wrapper",
        "dark:bg-input/30 border-input hover:border-foreground/25 focus-within:border-primary bg-transparent shadow-xs flex items-center gap-2",
        className
      )}
    >
      {startIcon && (
        <span className="text-muted-foreground flex-shrink-0 [&>svg]:size-4">
          {startIcon}
        </span>
      )}
      {inputElement}
      {clearable && hasValue && (
        <button
          type="button"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground flex-shrink-0 cursor-pointer"
          aria-label="Clear"
        >
          <XIcon className="size-4" />
        </button>
      )}
      {endIcon && (
        <span className="text-muted-foreground flex-shrink-0 [&>svg]:size-4">
          {endIcon}
        </span>
      )}
    </div>
  )
}

export { Input }
export type { InputProps }
