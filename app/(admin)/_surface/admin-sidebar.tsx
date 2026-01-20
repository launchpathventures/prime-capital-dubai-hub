/**
 * Admin Sidebar
 *
 * Navigation sidebar with sections for website content, learning admin, and settings.
 * Styled similar to the Learn surface sidebar for consistency.
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboardIcon,
  BuildingIcon,
  UsersIcon,
  MessageSquareQuoteIcon,
  TrendingUpIcon,
  GraduationCapIcon,
  BookOpenIcon,
  UserCogIcon,
  BarChart3Icon,
  SettingsIcon,
  UserIcon,
  ExternalLinkIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface AdminSidebarProps {
  /** Callback for mobile drawer close */
  onNavigate?: () => void
}

// -----------------------------------------------------------------------------
// AdminSidebar Component
// -----------------------------------------------------------------------------

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname()
  
  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin" || pathname === "/admin/dashboard"
    }
    return pathname === href || pathname.startsWith(href + "/")
  }
  
  return (
    <aside className="admin-sidebar">
      {/* Overview Section */}
      <div className="admin-sidebar__section">
        <div className="admin-sidebar__heading">Overview</div>
        <nav className="admin-sidebar__nav-list">
          <Link 
            href="/admin/dashboard"
            className="admin-sidebar__nav-item"
            data-active={isActive("/admin/dashboard")}
            onClick={onNavigate}
          >
            <LayoutDashboardIcon className="admin-sidebar__nav-icon" />
            <span>Dashboard</span>
          </Link>
        </nav>
      </div>
      
      {/* Website Content Section */}
      <div className="admin-sidebar__section">
        <div className="admin-sidebar__heading">Website Content</div>
        <nav className="admin-sidebar__nav-list">
          <Link 
            href="/admin/properties"
            className="admin-sidebar__nav-item"
            data-active={isActive("/admin/properties")}
            onClick={onNavigate}
          >
            <BuildingIcon className="admin-sidebar__nav-icon" />
            <span>Properties</span>
          </Link>
          <Link 
            href="/admin/team"
            className="admin-sidebar__nav-item"
            data-active={isActive("/admin/team")}
            onClick={onNavigate}
          >
            <UsersIcon className="admin-sidebar__nav-icon" />
            <span>Team</span>
          </Link>
          <Link 
            href="/admin/testimonials"
            className="admin-sidebar__nav-item"
            data-active={isActive("/admin/testimonials")}
            onClick={onNavigate}
          >
            <MessageSquareQuoteIcon className="admin-sidebar__nav-icon" />
            <span>Testimonials</span>
          </Link>
          <Link 
            href="/admin/stats"
            className="admin-sidebar__nav-item"
            data-active={isActive("/admin/stats")}
            onClick={onNavigate}
          >
            <TrendingUpIcon className="admin-sidebar__nav-icon" />
            <span>Stats</span>
          </Link>
        </nav>
      </div>
      
      {/* Learning Admin Section */}
      <div className="admin-sidebar__section">
        <div className="admin-sidebar__heading">Learning Admin</div>
        <nav className="admin-sidebar__nav-list">
          <Link 
            href="/admin/learning/modules"
            className="admin-sidebar__nav-item"
            data-active={isActive("/admin/learning/modules")}
            onClick={onNavigate}
          >
            <BookOpenIcon className="admin-sidebar__nav-icon" />
            <span>Modules</span>
          </Link>
          <Link 
            href="/admin/learning/users"
            className="admin-sidebar__nav-item"
            data-active={isActive("/admin/learning/users")}
            onClick={onNavigate}
          >
            <UserCogIcon className="admin-sidebar__nav-icon" />
            <span>Users</span>
          </Link>
          <Link 
            href="/admin/learning/progress"
            className="admin-sidebar__nav-item"
            data-active={isActive("/admin/learning/progress")}
            onClick={onNavigate}
          >
            <BarChart3Icon className="admin-sidebar__nav-icon" />
            <span>Progress</span>
          </Link>
        </nav>
      </div>
      
      {/* Learning Surface Link */}
      <div className="admin-sidebar__section admin-sidebar__section--highlight">
        <div className="admin-sidebar__heading">Go to Learning</div>
        <nav className="admin-sidebar__nav-list">
          <Link 
            href="/learn"
            className="admin-sidebar__nav-item admin-sidebar__nav-item--external"
            onClick={onNavigate}
          >
            <GraduationCapIcon className="admin-sidebar__nav-icon" />
            <span>Learning Portal</span>
            <ExternalLinkIcon className="admin-sidebar__external-icon" />
          </Link>
        </nav>
      </div>
      
      {/* Settings Section */}
      <div className="admin-sidebar__section admin-sidebar__section--bottom">
        <div className="admin-sidebar__heading">Settings</div>
        <nav className="admin-sidebar__nav-list">
          <Link 
            href="/admin/site-settings"
            className="admin-sidebar__nav-item"
            data-active={isActive("/admin/site-settings")}
            onClick={onNavigate}
          >
            <SettingsIcon className="admin-sidebar__nav-icon" />
            <span>Site Settings</span>
          </Link>
          <Link 
            href="/admin/profile"
            className="admin-sidebar__nav-item"
            data-active={isActive("/admin/profile")}
            onClick={onNavigate}
          >
            <UserIcon className="admin-sidebar__nav-icon" />
            <span>Profile</span>
          </Link>
        </nav>
      </div>
    </aside>
  )
}
