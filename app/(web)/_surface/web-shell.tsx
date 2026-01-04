/**
 * CATALYST - Web Shell
 *
 * Shell for public/marketing pages.
 * Features a top header with navigation and full-width content.
 * No sidebar—optimised for landing pages and public content.
 *
 * Used by: (web) route group
 */

import * as React from "react"
import { Shell } from "@/components/layout/shell"
import { Header } from "@/components/layout/header"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle, SurfaceSwitcher } from "@/components/shared"
import { WebNav } from "./web-nav"

// -----------------------------------------------------------------------------
// WebShell Component
// -----------------------------------------------------------------------------

interface WebShellProps {
  children: React.ReactNode
}

export function WebShell({ children }: WebShellProps) {
  return (
    <Shell className="web-shell flex-col">
      {/* Header with navigation */}
      <Header variant="web">
        <Logo />
        <WebNav />
        <Header.Actions className="hidden md:flex">
          <ThemeToggle />
          <SurfaceSwitcher />
        </Header.Actions>
      </Header>

      {/* Main content */}
      <Shell.Content>{children}</Shell.Content>
    </Shell>
  )
}
