/**
 * CATALYST - LMS Header
 *
 * Fixed header for the learning portal.
 * Minimal design with blur backdrop.
 */

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MenuIcon, HomeIcon, GraduationCapIcon } from "lucide-react"

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
    <header className="learn-header">
      <div className="learn-header__inner">
        <div className="learn-header__left">
          {/* Mobile menu button */}
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="learn-header__menu"
              aria-label="Open menu"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          )}
          
          {/* Brand */}
          <Link href="/learn" className="learn-header__logo">
            <span className="learn-header__logo-icon">
              <GraduationCapIcon className="h-3.5 w-3.5" />
            </span>
            Prime Capital Learning
          </Link>
        </div>
        
        {/* Actions */}
        <nav className="learn-header__nav">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <HomeIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>
        </nav>
      </div>
    </header>
  )
}
