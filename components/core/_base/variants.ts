/**
 * CATALYST - Shared Variants
 *
 * Reusable variant definitions for CVA.
 * Single source of truth for spacing, alignment, and common layout tokens.
 */

/**
 * Gap scale — consistent spacing across all layout components.
 */
export const gapVariants = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
} as const

/**
 * Align items — cross-axis alignment for flex/grid.
 */
export const alignVariants = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const

/**
 * Justify content — main-axis alignment for flex.
 */
export const justifyVariants = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
} as const

/**
 * Wrap — flex wrap behavior.
 */
export const wrapVariants = {
  true: "flex-wrap",
  false: "flex-nowrap",
} as const

/**
 * Text align — for typography components.
 */
export const textAlignVariants = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const

/**
 * Semantic color variants — shared across text/visual components.
 * Omit variant prop entirely to inherit color from parent (CSS default).
 */
export const colorVariants = {
  default: "--default text-foreground",
  muted: "--muted text-muted-foreground",
  primary: "--primary text-primary",
  secondary: "--secondary text-secondary-foreground",
  success: "--success text-emerald-600 dark:text-emerald-400",
  warning: "--warning text-amber-600 dark:text-amber-400",
  danger: "--danger text-red-600 dark:text-red-400",
  info: "--info text-blue-600 dark:text-blue-400",
} as const
