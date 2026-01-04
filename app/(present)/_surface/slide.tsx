/**
 * CATALYST - Slide Component
 *
 * Full-viewport slide wrapper with snap scroll behavior.
 * Use inside a SlideContainer for dot navigation, or standalone.
 *
 * PROPS:
 * - slug: URL hash for deep linking (e.g., "intro" → /present#intro)
 * - label: Display text for dot navigation
 *
 * CLASSES:
 * - .present-slide — outer section (snap target)
 * - .present-slide__inner — scrollable content wrapper
 * - .present-slide__content — main content (add to your content wrapper)
 * - .present-slide__background — decorative backgrounds (add to bg elements)
 *
 * @example
 * <Slide slug="intro" label="Introduction">
 *   <div className="present-slide__content my-auto">
 *     <h1>Welcome</h1>
 *   </div>
 * </Slide>
 *
 * @example
 * // With tinted background
 * <Slide slug="hero" label="Hero" className="present-slide--tinted">
 *   <div className="present-blob top-1/4 left-1/4 w-64 h-64" />
 *   <div className="present-slide__content my-auto">...</div>
 * </Slide>
 */

import * as React from "react"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Slide
// -----------------------------------------------------------------------------

interface SlideProps extends React.HTMLAttributes<HTMLElement> {
  /** URL slug for hash navigation (e.g., "intro" → #intro) */
  slug: string
  /** Display label for dot navigation */
  label: string
  children: React.ReactNode
  /** Additional classes for inner scroll wrapper */
  innerClassName?: string
}

export function Slide({ slug, label, children, className, innerClassName, ...props }: SlideProps) {
  return (
    <section
      data-slide={slug}
      data-label={label}
      aria-label={`Slide: ${label}`}
      className={cn(
        "present-slide",
        // Additional Tailwind utilities
        "relative h-dvh w-full flex-shrink-0 snap-start",
        className
      )}
      {...props}
    >
      {/* Inner scroll wrapper */}
      <div
        className={cn(
          "present-slide__inner",
          // Additional Tailwind utilities
          "h-full w-full overflow-y-auto flex flex-col",
          innerClassName
        )}
      >
        {children}
      </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// SlideContainer
// -----------------------------------------------------------------------------

/**
 * Container with snap scroll that syncs with inline nav (dots).
 * Wraps multiple Slide components and tracks which is visible.
 *
 * Uses snap-mandatory to always snap to slide boundaries.
 * Each slide handles its own internal scrolling via inner wrapper.
 */

interface SlideContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const SlideContainer = React.forwardRef<HTMLDivElement, SlideContainerProps>(
  function SlideContainer({ children, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "layout-present__slides",
          // Additional Tailwind utilities (some duplicated for Tailwind tooling)
          // Note: scroll-smooth removed — we use JS-based animation for reliability
          "h-dvh w-full overflow-y-auto snap-y snap-mandatory",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
