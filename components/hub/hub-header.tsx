/**
 * CATALYST - Hub Header Component
 *
 * Header navigation for the client engagement hub.
 * Shows hub title, navigation links, and user menu.
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Row } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/layout/logo"
import { cn } from "@/lib/utils"
import { hubConfig } from "@/lib/hub/config"
import {
  LayoutDashboardIcon,
  FolderIcon,
  CheckSquareIcon,
  MessageCircleIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

// -----------------------------------------------------------------------------
// Navigation
// -----------------------------------------------------------------------------

const hubNavItems: NavItem[] = [
  { label: "Dashboard", href: "/hub", icon: LayoutDashboardIcon },
  { label: hubConfig.labels.projects, href: "/hub/projects", icon: FolderIcon },
  { label: hubConfig.labels.tasks, href: "/hub/tasks", icon: CheckSquareIcon },
  { label: hubConfig.labels.questions, href: "/hub/questions", icon: MessageCircleIcon },
]

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function HubHeader() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/hub") {
      return pathname === "/hub"
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="hub-header sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-4">
        <Link href="/hub" className="flex items-center gap-2">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {hubNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Button
                key={item.href}
                variant={active ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "gap-2",
                  active && "bg-secondary"
                )}
                render={<Link href={item.href} />}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        <Row className="ml-auto items-center gap-2">
          <Button variant="ghost" size="sm" render={<Link href="/app/dashboard" />}>
            Admin
          </Button>
        </Row>
      </div>
    </header>
  )
}
