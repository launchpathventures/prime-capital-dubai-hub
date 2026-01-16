/**
 * CATALYST - Web Navigation
 *
 * Navigation for web/marketing pages with mobile menu support.
 * Single source of truth for nav items — renders desktop inline, mobile dropdown.
 * Supports scroll-aware styling (transparent vs solid header).
 *
 * Features:
 * - DRY: Nav items defined once, rendered for both viewports
 * - Accessible: ARIA labels, keyboard navigation, focus management
 * - Robust: Closes on route change, escape, click outside, resize to desktop
 * - Scroll lock: Body locked when mobile menu open
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { webNavItems } from "@/lib/navigation"
import { MenuIcon, XIcon } from "lucide-react"
import { Logo } from "@/components/layout/logo"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// WebNav Component
// -----------------------------------------------------------------------------

interface WebNavProps {
  /** Whether the header is in scrolled (solid) state */
  scrolled?: boolean
}

export function WebNav({ scrolled = false }: WebNavProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Close on escape key
  React.useEffect(() => {
    if (!mobileOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false)
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [mobileOpen])

  // Close on resize to desktop (md breakpoint = 768px)
  React.useEffect(() => {
    if (!mobileOpen) return

    const mediaQuery = window.matchMedia("(min-width: 768px)")
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [mobileOpen])

  // Lock body scroll when menu is open
  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const closeMenu = () => setMobileOpen(false)

  return (
    <>
      {/* Desktop navigation */}
      <Header.Nav aria-label="Main navigation">
        <NavItems scrolled={scrolled} />
        <ContactButton scrolled={scrolled} />
      </Header.Nav>

      {/* Mobile menu trigger */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "md:hidden ml-auto",
          !scrolled && "text-white hover:bg-white/10"
        )}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
        aria-controls="mobile-nav"
        data-mobile-trigger
      >
        {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </Button>

      {/* Mobile menu overlay + panel */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="web-mobile-backdrop"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu panel - includes header */}
          <div className="web-mobile-panel">
            {/* Mobile header */}
            <div className="web-mobile-header">
              <Logo />
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation links */}
            <nav
              id="mobile-nav"
              className="web-mobile-menu"
              aria-label="Mobile navigation"
            >
              <NavItems mobile />

              <Link href="/contact" className="web-mobile-menu-primary">
                Get In Touch
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  )
}

// -----------------------------------------------------------------------------
// Shared Components (used by both desktop and mobile)
// -----------------------------------------------------------------------------

interface NavItemsProps {
  scrolled?: boolean
  /** Whether rendering for mobile (applies explicit mobile styles) */
  mobile?: boolean
}

/** Renders the main navigation items — used in both desktop and mobile */
function NavItems({ scrolled, mobile }: NavItemsProps) {
  return (
    <>
      {webNavItems.map((item) => (
        <Link 
          key={item.href} 
          href={item.href}
          className={mobile ? "web-mobile-nav-link" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </>
  )
}

interface ContactButtonProps {
  scrolled?: boolean
}

/** Contact button — desktop only (mobile uses inline link) */
function ContactButton({ scrolled }: ContactButtonProps) {
  return (
    <Link
      href="/contact"
      className={cn(
        "web-contact-btn inline-flex h-[42px] items-center justify-center rounded-[2px] px-6 text-xs font-normal uppercase tracking-[0.15em] transition-all",
        scrolled
          ? "border border-[var(--web-spruce)] text-[var(--web-spruce)] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)]"
          : "border border-white text-white hover:bg-white hover:text-[var(--web-ash)]"
      )}
    >
      Contact
    </Link>
  )
}
