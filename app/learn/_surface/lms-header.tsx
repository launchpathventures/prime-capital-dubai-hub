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
    <header className="learn-header">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden text-white hover:bg-white/10"
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        )}
        
        {/* Brand */}
        <Link href="/learn" className="learn-header__brand hover:opacity-80 transition-opacity">
          <span className="learn-header__title">Prime Capital Learning</span>
          <span className="learn-header__subtitle">Real Estate Consultant Training</span>
        </Link>
      </div>
      
      {/* Actions */}
      <div className="learn-header__actions">
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white gap-2"
          nativeButton={false}
          render={<Link href="/hub" />}
        >
          <HomeIcon className="h-4 w-4" />
          <span className="hidden sm:inline">HUB</span>
        </Button>
      </div>
    </header>
  )
}
