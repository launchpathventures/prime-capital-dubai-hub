/**
 * Admin Sidebar
 *
 * Navigation sidebar with sections for website content, learning admin, and settings.
 * Styled similar to the Learn surface sidebar for consistency.
 */

"use client"

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
  SettingsIcon,
  UserIcon,
  ExternalLinkIcon,
  VideoIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface AdminSidebarProps {
  /** The current user's role (admin, marketing, learner) */
  userRole: string
  /** Callback for mobile drawer close */
  onNavigate?: () => void
}

// -----------------------------------------------------------------------------
// AdminSidebar Component
// -----------------------------------------------------------------------------

export function AdminSidebar({ userRole, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname()
  const isAdmin = userRole === "admin"
  
  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin" || pathname === "/admin/dashboard"
    }
    // Team page also owns the user detail pages at /admin/progress/[id]
    if (href === "/admin/team") {
      return pathname === "/admin/team" || pathname.startsWith("/admin/team/") || pathname.startsWith("/admin/progress/")
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
          {isAdmin && (
            <Link
              href="/admin/team"
              className="admin-sidebar__nav-item"
              data-active={isActive("/admin/team")}
              onClick={onNavigate}
            >
              <UsersIcon className="admin-sidebar__nav-icon" />
              <span>Team</span>
            </Link>
          )}
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

      {/* Content Section */}
      <div className="admin-sidebar__section">
        <div className="admin-sidebar__heading">Content</div>
        <nav className="admin-sidebar__nav-list">
          <Link
            href="/admin/youtube"
            className="admin-sidebar__nav-item"
            data-active={isActive("/admin/youtube")}
            onClick={onNavigate}
          >
            <VideoIcon className="admin-sidebar__nav-icon" />
            <span>YouTube Scripts</span>
          </Link>
        </nav>
      </div>

      {/* Learning Admin Section — admin only */}
      {isAdmin && (
        <div className="admin-sidebar__section">
          <div className="admin-sidebar__heading">Learning Admin</div>
          <nav className="admin-sidebar__nav-list">
            <Link
              href="/admin/learning"
              className="admin-sidebar__nav-item"
              data-active={isActive("/admin/learning")}
              onClick={onNavigate}
            >
              <BookOpenIcon className="admin-sidebar__nav-icon" />
              <span>Modules</span>
            </Link>
          </nav>
        </div>
      )}

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
