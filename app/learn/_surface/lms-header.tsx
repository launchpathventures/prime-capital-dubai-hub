/**
 * CATALYST - LMS Header
 *
 * Fixed header for the learning portal.
 * Dark slate background with logo, subtitle, and HUB link.
 */

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MenuIcon, HomeIcon } from "lucide-react"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface LMSHeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
}

// -----------------------------------------------------------------------------
// LMSHeader Component
// -----------------------------------------------------------------------------

export function LMSHeader({ 
  onMenuClick,
  showMenuButton = false,
}: LMSHeaderProps) {
  return (
    <header className="lms-header">
      <div className="lms-header__left">
        {/* Mobile menu button */}
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className="lms-header__menu"
            aria-label="Open menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        )}
        
        {/* Brand */}
        <Link href="/learn" className="lms-header__brand">
          Prime Capital Learning
        </Link>
      </div>
      
      {/* Actions */}
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        nativeButton={false}
        render={<Link href="/" />}
      >
        <HomeIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
      </Button>
    </header>
  )
}
