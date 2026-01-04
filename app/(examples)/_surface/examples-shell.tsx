/**
 * CATALYST - Examples Shell
 *
 * Shell for the examples showcase surface.
 * Features a collapsible sidebar (left) with example navigation,
 * a header with title, and main content area.
 *
 * Similar to AppShell for consistency, but dedicated to examples.
 *
 * Used by: (examples) route group
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { Shell } from "@/components/layout/shell"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { CollapsibleSidebarNav } from "@/components/layout/collapsible-sidebar-nav"
import { Header } from "@/components/layout/header"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle, SurfaceSwitcher } from "@/components/shared"
import { examplesNavItems } from "@/lib/navigation"
import { useSidebarState } from "@/components/layout/use-sidebar-state"
import { ExamplesBreadcrumb } from "./examples-breadcrumb"

// -----------------------------------------------------------------------------
// Sidebar Content (shared between desktop and mobile)
// -----------------------------------------------------------------------------

function ExamplesSidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <>
      <Sidebar.Header>
        <Logo />
      </Sidebar.Header>

      <Sidebar.Body>
        <CollapsibleSidebarNav items={examplesNavItems} onItemClick={onItemClick} />
      </Sidebar.Body>

      <Sidebar.Footer>
        <div className="text-muted-foreground text-xs">Reference Implementations</div>
      </Sidebar.Footer>
    </>
  )
}

// -----------------------------------------------------------------------------
// ExamplesShell Component
// -----------------------------------------------------------------------------

interface ExamplesShellProps {
  children: React.ReactNode
}

export function ExamplesShell({ children }: ExamplesShellProps) {
  const { isOpen, isMobile, toggle, close } = useSidebarState()

  // Alt+M keyboard shortcut to toggle menu
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "m") {
        e.preventDefault()
        toggle()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggle])

  return (
    <Shell className="examples-shell">
      {/* Desktop Sidebar */}
      <Sidebar position="left" isOpen={isOpen} className="examples-sidebar">
        <ExamplesSidebarContent />
      </Sidebar>

      {/* Mobile Sidebar - overlay sheet */}
      <MobileSidebar open={isMobile && isOpen} onOpenChange={(open) => !open && close()}>
        <ExamplesSidebarContent onItemClick={close} />
      </MobileSidebar>

      {/* Main content area (header + content) */}
      <Shell.Body className="examples-body">
        <Header variant="app" className="examples-header">
          {/* Mobile: hamburger menu */}
          <Header.MobileMenuTrigger onMenuClick={toggle} />
          {/* Desktop: sidebar collapse toggle */}
          <Header.SidebarToggle isOpen={isOpen} onToggle={toggle} />
          
          <ExamplesBreadcrumb />
          <Header.Actions className="ml-auto">
            <ThemeToggle />
            <SurfaceSwitcher />
          </Header.Actions>
        </Header>

        <Shell.Content className="examples-content">{children}</Shell.Content>
      </Shell.Body>
    </Shell>
  )
}
