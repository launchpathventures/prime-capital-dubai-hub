/**
 * CATALYST - Web Shell
 *
 * Shell for public/marketing pages.
 * Features a fixed header with scroll-aware transparency.
 * No sidebar—optimised for landing pages and public content.
 *
 * Used by: (web) route group
 */

"use client"

import * as React from "react"
import { Shell } from "@/components/layout/shell"
import { Header } from "@/components/layout/header"
import { Logo } from "@/components/layout/logo"
import { WebNav } from "./web-nav"
import { WebFooter } from "./web-footer"

// -----------------------------------------------------------------------------
// WebShell Component
// -----------------------------------------------------------------------------

interface WebShellProps {
  children: React.ReactNode
}

export function WebShell({ children }: WebShellProps) {
  const [scrolled, setScrolled] = React.useState(false)

  // Track scroll position for header background transition
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0
      setScrolled(scrollTop > 20)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Check initial position
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <Shell className="web-shell flex-col">
      {/* Fixed header wrapper - full width background, constrained content */}
      <div className="web-header-wrapper" data-scrolled={scrolled}>
        <Header variant="web" data-scrolled={scrolled}>
          <Logo variant={scrolled ? "default" : "light"} />
          <WebNav scrolled={scrolled} />
        </Header>
      </div>

      {/* Main content */}
      <Shell.Content>{children}</Shell.Content>
      
      {/* Footer */}
      <WebFooter />
    </Shell>
  )
}
