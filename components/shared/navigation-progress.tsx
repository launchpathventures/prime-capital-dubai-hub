/**
 * CATALYST - Navigation Progress Indicator
 *
 * A lightweight progress bar that appears at the top of the page
 * during client-side navigation, giving users confidence that
 * their click registered.
 *
 * Uses Next.js navigation events to detect route changes.
 */

"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  const [progress, setProgress] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Complete the progress bar
  const completeProgress = useCallback(() => {
    clearTimers()
    setProgress(100)
    timeoutRef.current = setTimeout(() => {
      setIsNavigating(false)
      setProgress(0)
    }, 200)
  }, [clearTimers])

  // When pathname or searchParams change, navigation is complete
  useEffect(() => {
    if (isNavigating) {
      completeProgress()
    }
  }, [pathname, searchParams, isNavigating, completeProgress])

  // Listen for click events on links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")

      if (!link) return

      const href = link.getAttribute("href")
      if (!href) return

      // Skip external links, anchors, and special protocols
      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        link.target === "_blank"
      ) {
        return
      }

      // Skip if modifier keys are pressed (new tab, etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return
      }

      // Start navigation progress
      clearTimers()
      setIsNavigating(true)
      setProgress(10)

      // Simulate progress
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
            }
            return 90
          }
          // Slow down as we get closer to 90
          const increment = Math.max(1, (90 - prev) / 10)
          return Math.min(90, prev + increment)
        })
      }, 100)

      // Timeout fallback - complete after 10s if navigation didn't trigger
      timeoutRef.current = setTimeout(() => {
        completeProgress()
      }, 10000)
    }

    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
      clearTimers()
    }
  }, [clearTimers, completeProgress])

  if (!isNavigating) return null

  return (
    <div className="navigation-progress" aria-hidden="true">
      <div
        className="navigation-progress__bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
