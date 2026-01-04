/**
 * CATALYST - LabelValue Component
 *
 * Displays label-value pairs with consistent formatting.
 * Used for profile pages, detail views, settings, data display.
 *
 * @customised N/A — custom component
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Row, Stack, Text } from "@/components/core"

const labelValueVariants = cva("", {
  variants: {
    variant: {
      inline: "--inline flex flex-row items-baseline gap-1.5",
      fixed: "--fixed flex flex-row items-baseline",
      vertical: "--vertical flex flex-col gap-0.5",
    },
  },
  defaultVariants: {
    variant: "inline",
  },
})

export interface LabelValueProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof labelValueVariants> {
  /** The label text */
  label: string
  /** The value to display (renders placeholder if null/undefined) */
  value?: React.ReactNode
  /** Placeholder when value is null/undefined */
  placeholder?: string
  /** Optional small text after the value */
  adjunct?: React.ReactNode
  /** Fixed label width for alignment (only applies to "fixed" variant) */
  labelWidth?: string
}

const LabelValue = React.forwardRef<HTMLDivElement, LabelValueProps>(
  (
    {
      className,
      variant,
      label,
      value,
      placeholder = "—",
      adjunct,
      labelWidth = "180px",
      ...props
    },
    ref
  ) => {
    const displayValue = value ?? placeholder
    const isEmpty = value === null || value === undefined

    // Vertical variant uses Stack layout
    if (variant === "vertical") {
      return (
        <Stack ref={ref} gap="xs" className={cn("label-value label-value--vertical", className)} {...props}>
          <Text as="span" size="sm" variant="muted">
            {label}
          </Text>
          <Row gap="xs" align="baseline">
            <Text as="span" size="sm" variant={isEmpty ? "muted" : "default"}>
              {displayValue}
            </Text>
            {adjunct && (
              <Text as="span" size="xs" variant="muted">{adjunct}</Text>
            )}
          </Row>
        </Stack>
      )
    }

    // Inline and fixed variants use Row layout
    return (
      <Row
        ref={ref}
        gap={variant === "fixed" ? "none" : "xs"}
        align="baseline"
        className={cn("label-value", variant === "fixed" && "label-value--fixed", variant === "inline" && "label-value--inline", className)}
        {...props}
      >
        <Text
          as="span"
          size="sm"
          variant="muted"
          className={cn(
            "shrink-0",
            (variant === "inline" || variant === "fixed") && "after:content-[':']"
          )}
          style={variant === "fixed" ? { width: labelWidth } : undefined}
        >
          {label}
        </Text>
        <Text as="span" size="sm" variant={isEmpty ? "muted" : "default"}>
          {displayValue}
        </Text>
        {adjunct && (
          <Text as="span" size="xs" variant="muted">{adjunct}</Text>
        )}
      </Row>
    )
  }
)
LabelValue.displayName = "LabelValue"

export { LabelValue, labelValueVariants }
