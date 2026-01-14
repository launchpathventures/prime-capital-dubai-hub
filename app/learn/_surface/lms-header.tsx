/**
 * CATALYST - LMS Header
 *
 * Fixed header for the learning portal.
 * Minimal design with blur backdrop.
 */

"use client"

import Link from "next/link"
import Image from "next/image"
import { MenuIcon } from "lucide-react"
import { UserMenu, type UserMenuUser } from "@/components/shared/user-menu"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface LMSHeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
  /** User data for the user menu */
  user?: UserMenuUser
}

// -----------------------------------------------------------------------------
// LMSHeader Component
// -----------------------------------------------------------------------------

export function LMSHeader({ 
  onMenuClick,
  showMenuButton = false,
  user,
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
            <Image
              src="/logo.svg"
              alt="Prime Capital"
              width={120}
              height={40}
              className="h-9 w-auto"
              priority
            />
            <span className="learn-header__title">Academy</span>
          </Link>
        </div>
        
        {/* User Menu */}
        <nav className="learn-header__nav">
          <UserMenu user={user} />
        </nav>
      </div>
    </header>
  )
}
