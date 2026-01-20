/**
 * Admin Shell
 *
 * Shell for authenticated admin/dashboard pages.
 * Features a sidebar (left) with learn-style navigation,
 * a header with user actions, and main content area.
 *
 * Used by: (admin) route group
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { MenuIcon, XIcon } from "lucide-react"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle, SurfaceSwitcher, UserMenu, UserNotifications, HeaderPopoverProvider } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { AdminSidebar } from "./admin-sidebar"
import { AdminBreadcrumb } from "./admin-breadcrumb"

// -----------------------------------------------------------------------------
// AdminShell Component
// -----------------------------------------------------------------------------

interface AdminUser {
  name: string
  email: string
  role: string
  avatarUrl?: string
}

interface AdminShellProps {
  children: React.ReactNode
  user: AdminUser
}

export function AdminShell({ children, user }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <div className="admin-shell">
      {/* Desktop Sidebar */}
      <div className="admin-shell__sidebar">
        <div className="admin-shell__sidebar-header">
          <Logo />
        </div>
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="admin-shell__mobile-sidebar p-0 w-[280px]">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="admin-shell__sidebar-header">
            <Logo />
          </div>
          <AdminSidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="admin-shell__main">
        {/* Header */}
        <header className="admin-shell__header">
          <div className="admin-shell__header-inner">
            <div className="admin-shell__header-left">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="admin-shell__menu-btn"
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
              <AdminBreadcrumb />
            </div>
            <div className="admin-shell__header-actions">
              <HeaderPopoverProvider>
                <UserNotifications count={3} />
                <UserMenu user={user} />
                <div className="hidden sm:block w-px bg-border self-stretch my-1" />
                <ThemeToggle />
                <SurfaceSwitcher />
              </HeaderPopoverProvider>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="admin-shell__content">
          {children}
        </main>
      </div>
    </div>
  )
}
