/**
 * CATALYST - Catalyst Shell
 *
 * Shell for the Catalyst surface pages.
 * Simple header-only layout (no sidebar) for project status and briefs.
 *
 * Used by: (catalyst) route group
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shell } from "@/components/layout/shell"
import { Header } from "@/components/layout/header"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle, SurfaceSwitcher } from "@/components/shared"
import { Row, Center } from "@/components/core"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Navigation
// -----------------------------------------------------------------------------

const catalystNavItems = [
  { href: "/catalyst", label: "Overview" },
  { href: "/catalyst/briefs", label: "Briefs" },
  { href: "/catalyst/roadmap", label: "Roadmap" },
  { href: "/catalyst/about", label: "About" },
]

function CatalystNav() {
  const pathname = usePathname()

  return (
    <Row gap="xs" className="catalyst-nav">
      {catalystNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "catalyst-nav__link px-3 py-1.5 text-sm rounded-md transition-colors",
            pathname === item.href
              ? "bg-muted text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          {item.label}
        </Link>
      ))}
    </Row>
  )
}

// -----------------------------------------------------------------------------
// CatalystShell Component
// -----------------------------------------------------------------------------

interface CatalystShellProps {
  children: React.ReactNode
}

export function CatalystShell({ children }: CatalystShellProps) {
  return (
    <Shell className="catalyst-shell">
      <Shell.Body>
        <Header variant="app">
          <Logo size="sm" />

          {/* Centered navigation */}
          <Center className="flex-1">
            <CatalystNav />
          </Center>

          <Header.Actions>
            <ThemeToggle />
            <SurfaceSwitcher />
          </Header.Actions>
        </Header>

        <Shell.Content className="catalyst-content">{children}</Shell.Content>
      </Shell.Body>
    </Shell>
  )
}
