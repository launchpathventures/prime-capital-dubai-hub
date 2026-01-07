import { clsx, type ClassValue } from "clsx"
import * as React from "react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// -----------------------------------------------------------------------------
// Slug Generation
// -----------------------------------------------------------------------------

/**
 * Generate a URL-friendly slug from a title string.
 * 
 * @example generateSlug("Hello World!") → "hello-world"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

// -----------------------------------------------------------------------------
// HTML Comment Component
// -----------------------------------------------------------------------------

/**
 * Renders a real HTML comment visible in DevTools (highlighted green).
 * 
 * WHY: JSX comments {/* ... *\/} are stripped during build.
 * This renders actual HTML comments in the DOM for easier inspection.
 *
 * @example <Comment text="Section: Hero" /> → <!-- Section: Hero -->
 */
export function Comment({ text }: { text: string }) {
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const span = ref.current
    if (!span?.parentNode) return
    span.parentNode.replaceChild(document.createComment(` ${text} `), span)
  }, [text])

  return React.createElement("span", { ref, hidden: true })
}

// -----------------------------------------------------------------------------
// Scroll Utilities
// -----------------------------------------------------------------------------

/**
 * INTERNAL: Find the nearest scrollable ancestor of an element.
 * 
 * WHY: After layout fixes, content may scroll inside a container (e.g., Shell.Content)
 * rather than the window. This finds the correct scroll container.
 */
function getScrollContainer(element: HTMLElement): HTMLElement | Window {
  let current: HTMLElement | null = element.parentElement
  
  while (current) {
    const { overflowY } = getComputedStyle(current)
    const isScrollable = overflowY === "auto" || overflowY === "scroll"
    const hasScroll = current.scrollHeight > current.clientHeight
    
    if (isScrollable && hasScroll) {
      return current
    }
    current = current.parentElement
  }
  
  return window
}

/**
 * INTERNAL: JS-based smooth scroll animation using requestAnimationFrame.
 * 
 * WHY: Native `scroll-behavior: smooth` doesn't work reliably in all contexts
 * (nested scroll containers, some browsers, certain layouts). This provides
 * a consistent, cross-browser smooth scroll experience.
 * 
 * NOT EXPORTED — use `scrollToElement()` instead.
 */
function smoothScrollTo(container: HTMLElement | Window, targetY: number, duration = 500): void {
  const isWindow = container === window
  const startY = isWindow ? window.scrollY : (container as HTMLElement).scrollTop
  const difference = targetY - startY
  const startTime = performance.now()

  function step(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Ease out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3)
    const newY = startY + difference * easeOut
    
    if (isWindow) {
      window.scrollTo(0, newY)
    } else {
      (container as HTMLElement).scrollTop = newY
    }
    
    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

/**
 * Smoothly scroll to an element by ID.
 * 
 * WHY: Provides consistent smooth-scroll behavior across the app.
 * Automatically finds the correct scroll container (window or nested container).
 * Uses JS-based animation (not native scroll-behavior) for reliability.
 *
 * USAGE:
 * - Programmatic: `scrollToElement("features")`
 * - Declarative: use `data-scroll-target="features"` + `useScrollToTarget()` hook
 *
 * @example
 * // Programmatic (e.g., keyboard shortcut)
 * scrollToElement("features")
 * scrollToElement("#features")  // hash prefix also works
 * 
 * // Declarative (e.g., button click)
 * // In layout: useScrollToTarget()
 * // On element: <Button data-scroll-target="features">Go</Button>
 */
export function scrollToElement(idOrHash: string): void {
  const id = idOrHash.replace(/^#/, "")
  const element = document.getElementById(id)
  
  if (element) {
    const container = getScrollContainer(element)
    const isWindow = container === window
    
    if (isWindow) {
      const targetY = window.scrollY + element.getBoundingClientRect().top
      smoothScrollTo(container, targetY)
    } else {
      const containerEl = container as HTMLElement
      const targetY = element.offsetTop - containerEl.offsetTop
      smoothScrollTo(container, targetY)
    }
  }
}

/**
 * Hook to enable declarative smooth-scroll via `data-scroll-target` attribute.
 * 
 * WHY: Allows buttons/links to scroll to targets without onClick handlers.
 * Uses `scrollToElement()` internally for consistent behavior.
 *
 * USAGE:
 * 1. Call `useScrollToTarget()` once in your layout or page
 * 2. Add `data-scroll-target="section-id"` to any clickable element
 *
 * @example
 * // In a layout or page component:
 * useScrollToTarget()
 * 
 * // Then on any element:
 * <Button data-scroll-target="features">Learn More</Button>
 */
export function useScrollToTarget(): void {
  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement
      const scrollTarget = target.closest<HTMLElement>("[data-scroll-target]")
      
      if (!scrollTarget) return
      
      const targetId = scrollTarget.getAttribute("data-scroll-target")
      if (!targetId) return

      event.preventDefault()
      scrollToElement(targetId)
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])
}
