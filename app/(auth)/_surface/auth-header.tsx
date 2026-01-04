/**
 * CATALYST - Auth Header
 *
 * Floating header for authentication pages with:
 * - Logo (left)
 * - Theme toggle + Home (right)
 *
 * Hidden by default. Shows when:
 * - Mouse is near top of screen
 * - Escape key is pressed
 * - Alt+H toggles visibility
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle, SurfaceSwitcher, HeaderPopoverProvider } from "@/components/shared"

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const HOVER_ZONE = 100 // px from top that triggers header to show

// -----------------------------------------------------------------------------
// AuthHeader Component
// -----------------------------------------------------------------------------

interface AuthHeaderProps {
  /** Disable auto-hide behavior */
  alwaysVisible?: boolean
  className?: string
}

export function AuthHeader({
  alwaysVisible = false,
  className,
}: AuthHeaderProps) {
  // Start hidden (unlike presentations which start visible)
  const [visible, setVisible] = React.useState(alwaysVisible)

  // Mouse hover logic
  React.useEffect(() => {
    if (alwaysVisible) return

    const handleMouseMove = (e: MouseEvent) => {
      // Show when mouse is near the top of the screen
      if (e.clientY <= HOVER_ZONE) {
        setVisible(true)
      } else if (visible) {
        // Mouse left the zone — hide immediately
        setVisible(false)
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [alwaysVisible, visible])

  // Keyboard controls: Escape shows header, Alt+H toggles
  React.useEffect(() => {
    if (alwaysVisible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape shows header when hidden
      if (e.key === "Escape" && !visible) {
        setVisible(true)
      }
      // Alt+H toggles header
      if (e.altKey && e.key.toLowerCase() === "h") {
        e.preventDefault()
        setVisible((v) => !v)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [alwaysVisible, visible])

  return (
    <header
      className={cn(
        "auth-header",
        // Fade transition
        "transition-opacity duration-300",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
        className
      )}
    >
      {/* Left: Logo */}
      <div className="auth-header-left">
        <Logo />
      </div>

      {/* Right: Theme toggle, Surface switcher */}
      <HeaderPopoverProvider>
        <div className="auth-header-right">
          <ThemeToggle />
          <SurfaceSwitcher />
        </div>
      </HeaderPopoverProvider>
    </header>
  )
}
