/**
 * CATALYST - LMS Header Component
 *
 * Fixed header for the learning portal.
 * Features minimal branding, subtitle, and HUB link.
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
  HomeIcon,
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
// LMSHeader Component
// -----------------------------------------------------------------------------

export function LMSHeader({ user }: LMSHeaderProps) {
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
          "h-14 border-b",
          "bg-[#525252] text-white"
        )}
      >
        <Row className="h-full max-w-[90rem] mx-auto px-4 sm:px-6" align="center" justify="between">
          {/* Left: Logo/Back Navigation */}
          <Row gap="sm" align="center">
            {isNestedPage ? (
              <Button 
                variant="ghost" 
                size="sm"
                nativeButton={false}
                render={<Link href={getBackLink()} />}
                className="gap-1 text-white hover:bg-white/10"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <Link 
                href="/learn" 
                className="flex flex-col hover:opacity-80 transition-opacity"
              >
                <Text size="sm" weight="semibold" className="text-white leading-tight">
                  Prime Capital Learning
                </Text>
                <Text size="xs" className="text-white/70 leading-tight">
                  Real Estate Consultant Training
                </Text>
              </Link>
            )}
          </Row>

          {/* Right: HUB Button & User Menu */}
          <Row gap="sm" align="center">
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href="/hub" />}
              className="gap-2 border-white/20 text-white hover:bg-white/10"
            >
              <HomeIcon className="h-4 w-4" />
              HUB
            </Button>
            <div className="[&_button]:text-white [&_button]:hover:bg-white/10">
              <UserMenu user={user} />
            </div>
          </Row>
        </Row>
      </header>
    </HeaderPopoverProvider>
  )
}
