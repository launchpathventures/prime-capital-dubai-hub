/**
 * CATALYST - Web Navigation
 *
 * Navigation for web/marketing pages with mobile menu support.
 * Single source of truth for nav items — renders desktop inline, mobile dropdown.
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { webNavItems, webMoreItems } from "@/lib/navigation"
import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle, SurfaceSwitcher } from "@/components/shared"
import { HeaderPopoverProvider } from "@/components/shared/header-popover-context"

// -----------------------------------------------------------------------------
// WebNav Component
// -----------------------------------------------------------------------------

export function WebNav() {
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
        <NavItems />
        <MoreDropdown />
        <DocsButton />
      </Header.Nav>

      {/* Mobile menu trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden ml-auto"
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
              <HeaderPopoverProvider>
                <div className="web-mobile-header-actions">
                  <ThemeToggle />
                  <SurfaceSwitcher />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeMenu}
                    aria-label="Close menu"
                  >
                    <XIcon className="h-5 w-5" />
                  </Button>
                </div>
              </HeaderPopoverProvider>
            </div>

            {/* Navigation links */}
            <nav
              id="mobile-nav"
              className="web-mobile-menu"
              aria-label="Mobile navigation"
            >
              <NavItems />

              {webMoreItems.length > 0 && (
                <>
                  <div className="web-mobile-menu-divider" aria-hidden="true" />
                  {webMoreItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      {item.label}
                    </Link>
                  ))}
                </>
              )}

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

/** Renders the main navigation items — used in both desktop and mobile */
function NavItems() {
  return (
    <>
      {webNavItems.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </>
  )
}

/** More dropdown — desktop only */
function MoreDropdown() {
  if (webMoreItems.length === 0) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mt-px text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 cursor-pointer text-sm leading-normal">
        More
        <ChevronDownIcon className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {webMoreItems.map((item) => (
          <DropdownMenuItem key={item.href} render={<Link href={item.href} />}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Docs button — desktop only (mobile uses inline link) */
function DocsButton() {
  return (
    <Link
      href="/contact"
      className="bg-primary text-primary-foreground hover:bg-primary/80 inline-flex h-7 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-all"
    >
      Get In Touch
    </Link>
  )
}
