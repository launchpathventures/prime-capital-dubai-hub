/**
 * CATALYST - Slides Shell
 *
 * Shell for presentation pages.
 * Provides header with nav trigger, and renders presentation content.
 *
 * CLASSES:
 * - .layout-present — root container
 * - [data-has-inline-nav] — attribute when inline nav (dots) is rendered
 *
 * USAGE:
 * Each presentation page should export metadata with title/addendum,
 * which this layout reads to display in the header.
 *
 * Used by: (present) route group
 */

"use client"

import * as React from "react"
import { PresentHeader } from "./header"
import { PresentNav } from "./nav"

// -----------------------------------------------------------------------------
// SlidesShell
// -----------------------------------------------------------------------------

interface SlidesShellProps {
  /** Presentation title shown in header */
  title: string
  /** Secondary info (date, audience, etc.) */
  addendum?: string
  /** Whether inline navigation (dots) is shown — adds content safe zone */
  hasInlineNav?: boolean
  children: React.ReactNode
}

export function SlidesShell({
  title,
  addendum,
  hasInlineNav = true,
  children,
}: SlidesShellProps) {
  const [navOpen, setNavOpen] = React.useState(false)

  // Alt+M keyboard shortcut to toggle presentations nav (consistent with App/Docs layouts)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "m") {
        e.preventDefault()
        setNavOpen((open) => !open)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div 
      className="layout-present"
      data-has-inline-nav={hasInlineNav ? "" : undefined}
    >
      <PresentHeader
        title={title}
        addendum={addendum}
        onNavOpen={() => setNavOpen(true)}
      />

      <PresentNav open={navOpen} onOpenChange={setNavOpen} />

      <main className="present-content">{children}</main>
    </div>
  )
}
