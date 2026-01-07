/**
 * CATALYST - Page Transition Wrapper
 *
 * Provides smooth fade-in animation for page content on mount.
 * Uses CSS transforms for hardware acceleration.
 */

"use client"

import * as React from "react"

interface PageTransitionProps {
  /** Children to animate */
  children: React.ReactNode
  /** Additional class names */
  className?: string
  /** Animation delay in ms */
  delay?: number
}

export function PageTransition({
  children,
  className = "",
  delay = 0,
}: PageTransitionProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`page-transition ${mounted ? "is-visible" : ""} ${className}`}
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
      }}
    >
      {children}
    </div>
  )
}

/**
 * Staggered animation wrapper for lists of items
 */
interface StaggeredItemsProps {
  /** Children to animate */
  children: React.ReactNode
  /** Base delay for first item in ms */
  baseDelay?: number
  /** Delay between items in ms */
  stagger?: number
  /** Additional class names */
  className?: string
}

export function StaggeredItems({
  children,
  baseDelay = 100,
  stagger = 50,
  className = "",
}: StaggeredItemsProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: `opacity 0.4s ease-out ${baseDelay + index * stagger}ms, transform 0.4s ease-out ${baseDelay + index * stagger}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
