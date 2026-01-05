/**
 * CATALYST - LMS Header Component
 *
 * Auto-hiding header for the learning portal.
 * Hides on scroll down, shows on scroll up.
 * Features minimal branding, dashboard link, and user menu.
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Row, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import { ThemeToggle, UserMenu, HeaderPopoverProvider } from "@/components/shared"
import { 
  GraduationCapIcon, 
  LayoutDashboardIcon,
  ChevronLeftIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface LMSUser {
  name: string
  email: string
  role: string
  avatarUrl?: string
}

interface LMSHeaderProps {
  user: LMSUser
}

// -----------------------------------------------------------------------------
// Hook: useScrollHide
// -----------------------------------------------------------------------------

function useScrollHide() {
  const [isVisible, setIsVisible] = React.useState(true)
  const [lastScrollY, setLastScrollY] = React.useState(0)

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollingDown = currentScrollY > lastScrollY
      const scrollThreshold = 50 // Minimum scroll before hiding

      if (currentScrollY < scrollThreshold) {
        // Always show when near top
        setIsVisible(true)
      } else if (scrollingDown && currentScrollY > scrollThreshold) {
        // Hide when scrolling down past threshold
        setIsVisible(false)
      } else if (!scrollingDown) {
        // Show when scrolling up
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return isVisible
}

// -----------------------------------------------------------------------------
// LMSHeader Component
// -----------------------------------------------------------------------------

export function LMSHeader({ user }: LMSHeaderProps) {
  const isVisible = useScrollHide()
  const pathname = usePathname()
  
  // Determine if we're on a nested page (competency or module)
  const isNestedPage = pathname !== "/learn" && pathname.startsWith("/learn")
  
  // Get back link destination
  const getBackLink = () => {
    if (pathname.includes("/quiz/")) {
      // From quiz, go back to module (or dashboard if we can't determine)
      return "/learn"
    }
    const segments = pathname.split("/").filter(Boolean)
    if (segments.length > 2) {
      // On module page, go back to competency
      return `/learn/${segments[1]}`
    }
    if (segments.length > 1) {
      // On competency page, go back to dashboard
      return "/learn"
    }
    return "/learn"
  }

  return (
    <HeaderPopoverProvider>
      <header
        className={cn(
          "lms-header",
          "fixed top-0 left-0 right-0 z-50",
          "h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "transition-transform duration-300",
          !isVisible && "-translate-y-full"
        )}
      >
        <Row className="h-full max-w-7xl mx-auto px-4" align="center" justify="between">
          {/* Left: Logo/Back Navigation */}
          <Row gap="sm" align="center">
            {isNestedPage ? (
              <Button 
                variant="ghost" 
                size="sm"
                nativeButton={false}
                render={<Link href={getBackLink()} />}
                className="gap-1"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <Link 
                href="/learn" 
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                  <GraduationCapIcon className="h-4 w-4" />
                </div>
                <Text size="sm" weight="semibold" className="hidden sm:block">
                  Learning Portal
                </Text>
              </Link>
            )}
          </Row>

          {/* Center: Current Section (on larger screens) */}
          <div className="hidden md:flex items-center">
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/learn" />}
              className="gap-2"
            >
              <LayoutDashboardIcon className="h-4 w-4" />
              Dashboard
            </Button>
          </div>

          {/* Right: User Menu & Theme */}
          <Row gap="sm" align="center">
            <ThemeToggle />
            <UserMenu user={user} />
          </Row>
        </Row>
      </header>
    </HeaderPopoverProvider>
  )
}
