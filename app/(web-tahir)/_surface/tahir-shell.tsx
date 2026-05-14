/**
 * CATALYST - Tahir Shell
 *
 * Layout shell for the tahirmajithia.com brand surface. Owns the sticky nav,
 * scroll-state tracking, and the dark footer. Scoped via the `tahir-surface`
 * class so design tokens defined in tahir.css don't bleed into other brands.
 */

"use client"

import * as React from "react"
import { TahirNav } from "./tahir-nav"
import { TahirFooter } from "./tahir-footer"

interface TahirShellProps {
  children: React.ReactNode
}

export function TahirShell({ children }: TahirShellProps) {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => {
      const top = window.pageYOffset || document.documentElement.scrollTop || 0
      setScrolled(top > 20)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="tahir-surface" data-brand="tahir">
      <a
        href="#tahir-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--tahir-bg)] focus:text-[var(--tahir-ink)] focus:outline-none"
      >
        Skip to main content
      </a>

      <TahirNav scrolled={scrolled} />

      <main id="tahir-main" tabIndex={-1} className="outline-none">
        {children}
      </main>

      <TahirFooter />
    </div>
  )
}
