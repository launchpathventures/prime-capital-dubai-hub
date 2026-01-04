/**
 * CATALYST - Presentation Header
 *
 * Fixed header for presentation mode with:
 * - Nav trigger (left) — opens presentation list
 * - Title + addendum (left-center)
 * - Theme toggle + home (right)
 *
 * Auto-hides after 3 seconds. Shows when mouse is near top of screen.
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"
import { ThemeToggle, SurfaceSwitcher, HeaderPopoverProvider } from "@/components/shared"
import { PanelLeftIcon } from "lucide-react"

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const HIDE_DELAY = 3000 // ms before header fades out after initial load
const HOVER_ZONE = 100 // px from top that triggers header to show

// -----------------------------------------------------------------------------
// PresentHeader
// -----------------------------------------------------------------------------

interface PresentHeaderProps {
  /** Presentation title */
  title: string
  /** Secondary info (date, audience, etc.) */
  addendum?: string
  /** Called when nav trigger is clicked */
  onNavOpen?: () => void
  /** Disable auto-hide behavior */
  alwaysVisible?: boolean
  className?: string
}

export function PresentHeader({
  title,
  addendum,
  onNavOpen,
  alwaysVisible = false,
  className,
}: PresentHeaderProps) {
  const [visible, setVisible] = React.useState(true)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(null)

  React.useEffect(() => {
    if (alwaysVisible) return

    // Hide after initial delay
    timeoutRef.current = setTimeout(() => {
      setVisible(false)
    }, HIDE_DELAY)

    const handleMouseMove = (e: MouseEvent) => {
      // Show when mouse is near the top of the screen
      if (e.clientY <= HOVER_ZONE) {
        setVisible(true)
        // Clear any pending hide timer while in hover zone
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
      } else if (visible) {
        // Mouse left the zone — hide immediately
        setVisible(false)
      }
    }

    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [alwaysVisible, visible])

  // Escape or Alt+H controls header visibility (discoverability aid)
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
        "bg-background/60 fixed top-0 right-0 left-0 z-50 backdrop-blur-[2px]",
        "flex h-14 items-center gap-4 border-b border-border/50 px-4",
        // Fade transition
        "transition-opacity duration-300",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
        className
      )}
    >
      {/* Nav trigger */}
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              onClick={onNavOpen}
              aria-label="Open presentations"
            >
              <PanelLeftIcon className="h-5 w-5" />
            </Button>
          }
        />
        <TooltipContent>
          Presentation Menu <Kbd className="ml-1.5">Alt+M</Kbd>
        </TooltipContent>
      </Tooltip>

      {/* Title + addendum */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <h1 className="truncate text-sm font-medium">{title}</h1>
        {addendum && (
          <p className="text-muted-foreground truncate text-xs">{addendum}</p>
        )}
      </div>

      {/* Right actions */}
      <HeaderPopoverProvider>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SurfaceSwitcher />
        </div>
      </HeaderPopoverProvider>
    </header>
  )
}
