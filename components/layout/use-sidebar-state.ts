/**
 * CATALYST - Sidebar State Hook
 *
 * Shared hook for managing sidebar visibility across layouts.
 * Provides consistent sidebar toggle behavior for App and Docs layouts.
 *
 * COMMON LAYOUT PATTERN:
 * This hook ensures consistent sidebar behavior across all layouts that use sidebars.
 * - Desktop: Sidebar can be collapsed/expanded
 * - Mobile: Sidebar opens as overlay (Sheet)
 *
 * @example
 * const { isOpen, isMobile, toggle, open, close } = useSidebarState()
 */

"use client"

import * as React from "react"

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MOBILE_BREAKPOINT = 768 // md breakpoint

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

interface UseSidebarStateOptions {
  /** Default open state for desktop (mobile always starts closed) */
  defaultOpen?: boolean
}

interface SidebarState {
  /** Whether sidebar is currently visible */
  isOpen: boolean
  /** Whether we're on a mobile viewport */
  isMobile: boolean
  /** Toggle sidebar open/closed */
  toggle: () => void
  /** Open sidebar */
  open: () => void
  /** Close sidebar */
  close: () => void
}

export function useSidebarState(
  options: UseSidebarStateOptions = {}
): SidebarState {
  const { defaultOpen = true } = options

  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const [isMobile, setIsMobile] = React.useState(false)
  const [hasMounted, setHasMounted] = React.useState(false)

  // Track viewport size after mount (avoids SSR hydration mismatch)
  React.useEffect(() => {
    setHasMounted(true)
    
    const checkMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)
      // Auto-close on mobile, auto-open on desktop (on initial load)
      if (mobile) {
        setIsOpen(false)
      }
    }

    // Check on mount
    checkMobile()

    // Listen for resize
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), [])
  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])

  // Only report as mobile after client has mounted to avoid hydration issues
  return { isOpen, isMobile: hasMounted && isMobile, toggle, open, close }
}
