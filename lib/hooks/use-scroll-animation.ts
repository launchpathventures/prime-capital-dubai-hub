/**
 * CATALYST - Scroll Animation Hooks
 * 
 * Lightweight scroll-triggered animation hooks using Intersection Observer.
 * Used for fade-in animations and counter animations on marketing pages.
 */

"use client"

import { useEffect, useRef, useState } from "react"

// =============================================================================
// useInView Hook
// =============================================================================

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

/**
 * Detects when an element enters the viewport.
 * 
 * @example
 * const { ref, isInView } = useInView()
 * <div ref={ref} className={isInView ? 'animate-in' : 'opacity-0'}>
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -50px 0px",
    triggerOnce = true,
  } = options

  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Skip if already animated and triggerOnce is true
    if (triggerOnce && hasAnimated) return

    // Check if element is already in viewport on mount
    const rect = element.getBoundingClientRect()
    const isInViewportOnMount = rect.top < window.innerHeight && rect.bottom > 0

    if (isInViewportOnMount) {
      // Small delay to allow CSS to be ready
      const timer = setTimeout(() => {
        setIsInView(true)
        setHasAnimated(true)
      }, 100)
      return () => clearTimeout(timer)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          setHasAnimated(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce, hasAnimated])

  return { ref, isInView }
}

// =============================================================================
// useCountUp Hook
// =============================================================================

interface UseCountUpOptions {
  duration?: number
  decimals?: number
}

/**
 * Animates a number counting up from 0 to target value.
 * 
 * @example
 * const count = useCountUp(1500, isInView, { duration: 2000 })
 */
export function useCountUp(
  target: number,
  isActive: boolean,
  options: UseCountUpOptions = {}
): number {
  const { duration = 2000, decimals = 0 } = options
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!isActive || hasStarted || isNaN(target)) return

    // eslint-disable-next-line react-hooks/set-state-in-effect -- Animation trigger, intentional
    setHasStarted(true)
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic for natural deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = target * easeOut

      setCount(decimals > 0 ? parseFloat(currentValue.toFixed(decimals)) : Math.round(currentValue))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isActive, target, duration, hasStarted, decimals])

  return count
}

// =============================================================================
// Utility: Scroll to element
// =============================================================================

/**
 * Smoothly scrolls to an element by ID.
 * 
 * @param elementId - The ID of the element to scroll to
 * @param offset - Offset from top (for fixed headers)
 */
export function scrollToElement(elementId: string, offset: number = 80) {
  const element = document.getElementById(elementId)
  if (!element) return

  const elementPosition = element.getBoundingClientRect().top + window.scrollY
  const offsetPosition = elementPosition - offset

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  })
}
