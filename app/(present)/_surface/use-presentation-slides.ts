/**
 * CATALYST - Presentation Slides Hook
 *
 * Encapsulates all slide navigation logic:
 * - URL hash sync (deep linking)
 * - Keyboard navigation (arrow keys)
 * - Active slide tracking
 * - Scroll-to-slide utility
 *
 * WHY: Extracted from page-level logic so every presentation
 * gets the same navigation behavior without code duplication.
 *
 * USAGE:
 * const { containerRef, activeSlide, totalSlides, slideLabels, scrollToSlide } = usePresentationSlides()
 */

"use client"

import * as React from "react"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SlideMetadata {
  slug: string
  label: string
}

interface UsePresentationSlidesReturn {
  /** Ref to attach to SlideContainer */
  containerRef: React.RefObject<HTMLDivElement | null>
  /** Currently active slide index (0-based) */
  activeSlide: number
  /** Total number of slides */
  totalSlides: number
  /** Array of slide slugs (for URL hash) */
  slideSlugs: string[]
  /** Array of slide labels (for dot navigation) */
  slideLabels: string[]
  /** Scroll to a slide by index or slug */
  scrollToSlide: (indexOrSlug: number | string) => void
  /** Whether initial hash navigation has completed */
  isInitialized: boolean
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function usePresentationSlides(): UsePresentationSlidesReturn {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [activeSlide, setActiveSlide] = React.useState(0)
  const [isInitialized, setIsInitialized] = React.useState(false)
  const [slideMetadata, setSlideMetadata] = React.useState<SlideMetadata[]>([])

  // Derived values
  const totalSlides = slideMetadata.length
  const slideSlugs = React.useMemo(() => slideMetadata.map((s) => s.slug), [slideMetadata])
  const slideLabels = React.useMemo(() => slideMetadata.map((s) => s.label), [slideMetadata])

  // ---------------------------------------------------------------------------
  // Extract slide metadata from DOM on mount
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const slides = container.querySelectorAll<HTMLElement>("[data-slide]")
    const metadata = Array.from(slides).map((slide) => ({
      slug: slide.dataset.slide || "",
      label: slide.dataset.label || "",
    }))
    setSlideMetadata(metadata)
  }, [])

  // ---------------------------------------------------------------------------
  // Scroll to slide by index or slug
  // Uses JS-based animation for consistent smooth scrolling across browsers
  // ---------------------------------------------------------------------------
  const scrollToSlide = React.useCallback(
    (indexOrSlug: number | string) => {
      const container = containerRef.current
      if (!container) return

      // Convert slug to index if needed
      const index =
        typeof indexOrSlug === "string"
          ? slideSlugs.indexOf(indexOrSlug)
          : indexOrSlug

      if (index === -1 || index >= totalSlides) return

      // Calculate target position (slide height × index)
      const slideHeight = container.clientHeight
      const startY = container.scrollTop
      const targetY = slideHeight * index
      const difference = targetY - startY

      // Skip animation if already at target
      if (Math.abs(difference) < 1) return

      // Temporarily disable snap during animation (prevents fighting)
      const originalSnapType = container.style.scrollSnapType
      container.style.scrollSnapType = "none"

      const duration = 500
      const startTime = performance.now()

      const scrollContainer = container
      function step(currentTime: number) {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3)

        scrollContainer.scrollTop = startY + difference * easeOut

        if (progress < 1) {
          requestAnimationFrame(step)
        } else {
          // Re-enable snap for manual scrolling
          scrollContainer.style.scrollSnapType = originalSnapType
        }
      }

      requestAnimationFrame(step)
    },
    [slideSlugs, totalSlides]
  )

  // ---------------------------------------------------------------------------
  // Update URL hash when slide changes (replaceState to avoid scroll jumps)
  // ---------------------------------------------------------------------------
  const updateHash = React.useCallback(
    (index: number) => {
      if (typeof window === "undefined") return
      const slug = slideSlugs[index]
      if (slug && index > 0) {
        window.history.replaceState(null, "", `#${slug}`)
      } else {
        // Remove hash for title slide
        window.history.replaceState(null, "", window.location.pathname)
      }
    },
    [slideSlugs]
  )

  // ---------------------------------------------------------------------------
  // Initialize from URL hash on mount
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    if (typeof window === "undefined" || slideMetadata.length === 0) return

    const hash = window.location.hash.slice(1)
    if (hash) {
      const index = slideSlugs.indexOf(hash)
      if (index !== -1) {
        // Small delay to ensure container is rendered
        setTimeout(() => scrollToSlide(index), 100)
      }
    }
    setIsInitialized(true)
  }, [slideMetadata, slideSlugs, scrollToSlide])

  // ---------------------------------------------------------------------------
  // Handle browser back/forward navigation
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    if (typeof window === "undefined" || slideMetadata.length === 0) return

    const handlePopState = () => {
      const hash = window.location.hash.slice(1)
      if (hash) {
        const index = slideSlugs.indexOf(hash)
        if (index !== -1) {
          scrollToSlide(index)
        }
      } else {
        scrollToSlide(0)
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [slideMetadata, slideSlugs, scrollToSlide])

  // ---------------------------------------------------------------------------
  // Track active slide (updates on scroll end)
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    const container = containerRef.current
    if (!container || totalSlides === 0) return

    const calculateActiveSlide = () => {
      const scrollTop = container.scrollTop
      const slideHeight = container.clientHeight
      // Round to nearest slide based on scroll position
      const index = Math.round(scrollTop / slideHeight)
      return Math.max(0, Math.min(index, totalSlides - 1))
    }

    const updateActiveSlide = () => {
      const index = calculateActiveSlide()
      setActiveSlide(index)
      if (isInitialized) {
        updateHash(index)
      }
    }

    // Update on scroll end (modern browsers)
    container.addEventListener("scrollend", updateActiveSlide)

    // Initial update
    updateActiveSlide()

    return () => {
      container.removeEventListener("scrollend", updateActiveSlide)
    }
  }, [isInitialized, updateHash, totalSlides])

  // ---------------------------------------------------------------------------
  // Keyboard navigation (arrow keys)
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    if (totalSlides === 0) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault()
        scrollToSlide(Math.min(activeSlide + 1, totalSlides - 1))
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault()
        scrollToSlide(Math.max(activeSlide - 1, 0))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeSlide, totalSlides, scrollToSlide])

  return {
    containerRef,
    activeSlide,
    totalSlides,
    slideSlugs,
    slideLabels,
    scrollToSlide,
    isInitialized,
  }
}
