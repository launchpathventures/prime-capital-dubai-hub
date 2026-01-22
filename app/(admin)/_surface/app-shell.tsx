/**
 * CATALYST - App Shell
 *
 * Shell for authenticated/dashboard pages.
 * Features a collapsible sidebar (left by default) with navigation,
 * a header with sidebar toggle, and main content area.
 *
 * COMMON LAYOUT PATTERN:
 * - Desktop: Sidebar toggle in header collapses/expands sidebar
 * - Mobile: Hamburger menu opens sidebar as overlay (Sheet)
 *
 * To move sidebar to right:
 * - Change `position="left"` to `position="right"` on the Sidebar component
 *
 * Used by: (app) route group
 */

"use client"

import * as React from "react"
import { Shell } from "@/components/layout/shell"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { CollapsibleSidebarNav } from "@/components/layout/collapsible-sidebar-nav"
import { Header } from "@/components/layout/header"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle, SurfaceSwitcher, UserMenu, UserNotifications } from "@/components/shared"
import { appNavItems } from "@/lib/navigation"
import { useSidebarState } from "@/components/layout/use-sidebar-state"
import { AppBreadcrumb } from "./app-breadcrumb"

// -----------------------------------------------------------------------------
// Sidebar Content (shared between desktop and mobile)
// -----------------------------------------------------------------------------

function AppSidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <>
      <Sidebar.Header>
        <Logo />
      </Sidebar.Header>

      <Sidebar.Body>
        <CollapsibleSidebarNav items={appNavItems} onItemClick={onItemClick} />
      </Sidebar.Body>

      <Sidebar.Footer>
        {/* Placeholder for user badge - will be added in later phase */}
        <div className="text-muted-foreground text-xs">v0.1.0</div>
      </Sidebar.Footer>
    </>
  )
}

// -----------------------------------------------------------------------------
// AppShell Component
// -----------------------------------------------------------------------------

interface AppUser {
  name: string
  email: string
  role: string
  avatarUrl?: string
}

interface AppShellProps {
  children: React.ReactNode
  user: AppUser
}

export function AppShell({ children, user }: AppShellProps) {
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
    <Shell className="app-shell">
      {/* 
        Desktop Sidebar - positioned left by default
        To move to right: change position="left" to position="right"
      */}
      <Sidebar position="left" isOpen={isOpen}>
        <AppSidebarContent />
      </Sidebar>

      {/* Mobile Sidebar - overlay sheet */}
      <MobileSidebar open={isMobile && isOpen} onOpenChange={(open) => !open && close()}>
        <AppSidebarContent onItemClick={close} />
      </MobileSidebar>

      {/* Main content area (header + content) */}
      <Shell.Body>
        <Header variant="app">
          {/* Mobile: hamburger menu */}
          <Header.MobileMenuTrigger onMenuClick={toggle} />
          {/* Desktop: sidebar collapse toggle */}
          <Header.SidebarToggle isOpen={isOpen} onToggle={toggle} />
          
          <AppBreadcrumb />
          <Header.Actions className="ml-auto">
            {/* User section */}
            <UserNotifications count={3} />
            <UserMenu user={user} />
            {/* Separator */}
            <div className="hidden sm:block w-px bg-border self-stretch my-1" />
            {/* Utilities */}
            <ThemeToggle />
            <SurfaceSwitcher />
          </Header.Actions>
        </Header>

        <Shell.Content className="app-content">{children}</Shell.Content>
      </Shell.Body>
    </Shell>
  )
}
