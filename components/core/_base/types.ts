/**
 * CATALYST - Core Types
 *
 * Shared types for polymorphic components and common props.
 */

import * as React from "react"

/**
 * Props for polymorphic components that can render as different elements.
 */
export interface PolymorphicProps {
  /** Render as a different HTML element or component */
  as?: React.ElementType
  /** Merge props onto child element instead of wrapping */
  asChild?: boolean
}

/**
 * Props for components that support inline/block rendering.
 */
export interface InlineProps {
  /** Render as inline element (span) instead of block (div) */
  inline?: boolean
}

/**
 * Common layout props shared across layout components.
 */
export interface LayoutProps {
  className?: string
  children?: React.ReactNode
}
