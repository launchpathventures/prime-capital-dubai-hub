/**
 * CATALYST - Docs Shell
 *
 * Shell for documentation pages.
 * Similar structure to AppShell but with docs-specific navigation.
 * Visibility controlled by config.features.showDocsInProduction.
 *
 * COMMON LAYOUT PATTERN:
 * - Desktop: Sidebar toggle in header collapses/expands sidebar
 * - Mobile: Hamburger menu opens sidebar as overlay (Sheet)
 *
 * To move sidebar to right:
 * - Change `position="left"` to `position="right"` on the Sidebar component
 *
 * Used by: (docs) route group
 */

"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Shell } from "@/components/layout/shell"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { CollapsibleSidebarNav } from "@/components/layout/collapsible-sidebar-nav"
import { Header } from "@/components/layout/header"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle, SurfaceSwitcher } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { docsNavItems } from "@/lib/navigation"
import { useSidebarState } from "@/components/layout/use-sidebar-state"
import { DocsBreadcrumb } from "./docs-breadcrumb"

// -----------------------------------------------------------------------------
// Sidebar Content (shared between desktop and mobile)
// -----------------------------------------------------------------------------

function DocsSidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <>
      <Sidebar.Header>
        <Logo />
      </Sidebar.Header>

      <Sidebar.Body className="flex flex-col overflow-hidden p-0">
        <CollapsibleSidebarNav 
          items={docsNavItems} 
          showSearch 
          searchPlaceholder="Search docs..." 
          accordion
          onItemClick={onItemClick}
        />
      </Sidebar.Body>

      <Sidebar.Footer>
        <span />
      </Sidebar.Footer>
    </>
  )
}

// -----------------------------------------------------------------------------
// DocsShell Component
// -----------------------------------------------------------------------------

interface DocsShellProps {
  children: React.ReactNode
  showLogout?: boolean
}

export function DocsShell({ children, showLogout }: DocsShellProps) {
  const { isOpen, isMobile, toggle, close } = useSidebarState()
  const pathname = usePathname()
  const isLoginPage = pathname === "/docs/login"

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
    <Shell className="docs-shell">
      {!isLoginPage && (
        <>
          {/* 
            Desktop Sidebar - positioned left by default
            To move to right: change position="left" to position="right"
          */}
          <Sidebar position="left" isOpen={isOpen} className="w-80">
            <DocsSidebarContent />
          </Sidebar>

          {/* Mobile Sidebar - overlay sheet */}
          <MobileSidebar open={isMobile && isOpen} onOpenChange={(open) => !open && close()}>
            <DocsSidebarContent onItemClick={close} />
          </MobileSidebar>
        </>
      )}

      {/* Main content area (header + content) */}
      <Shell.Body>
        <Header variant="app">
          {!isLoginPage && (
            <>
              {/* Mobile: hamburger menu */}
              <Header.MobileMenuTrigger onMenuClick={toggle} />
              {/* Desktop: sidebar collapse toggle */}
              <Header.SidebarToggle isOpen={isOpen} onToggle={toggle} />
            </>
          )}

          {/* Breadcrumb navigation */}
          {!isLoginPage ? (
            <DocsBreadcrumb />
          ) : (
            <Header.Title>Documentation</Header.Title>
          )}

          <Header.Actions className="ml-auto">
            {showLogout && !isLoginPage && (
              <form action="/api/docs-logout" method="post">
                <Button type="submit" variant="outline" size="sm">
                  Logout
                </Button>
              </form>
            )}
            <ThemeToggle />
            <SurfaceSwitcher />
          </Header.Actions>
        </Header>

        <Shell.Content className="docs-content">{children}</Shell.Content>
      </Shell.Body>
    </Shell>
  )
}
