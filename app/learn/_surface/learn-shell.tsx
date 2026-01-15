/**
 * CATALYST - Learn Shell
 *
 * Shell for the learning portal with header, sidebar, and content area.
 * Sidebar is always visible with navigation sections.
 * Includes AI Coach integration for contextual assistance.
 *
 * Accessibility:
 * - Skip link for keyboard users to bypass navigation
 * - Focus trap in mobile drawer
 * - ARIA attributes for screen readers
 *
 * Used by: /learn route group
 */

"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { LMSHeader } from "./lms-header"
import { LearnSidebar } from "./learn-sidebar"
import {
  CoachProvider,
  CoachPanel,
  CoachTrigger,
  type CoachContext,
} from "@/components/lms/coach"
import type { UserMenuUser } from "@/components/shared/user-menu"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface Module {
  slug: string
  title: string
  status: "complete" | "current" | "locked"
}

interface Competency {
  slug: string
  name: string
  number: number
  locked: boolean
  modules: Module[]
}

interface LearnShellProps {
  children: React.ReactNode
  /** Active section for sidebar highlighting */
  activeSection?: "overview" | "progress" | "course" | "scenarios" | "prompts" | "rera" | "certification" | "admin" | "admin-users"
  /** Current competency slug for course section */
  currentCompetency?: string
  /** Current module slug for course section */
  currentModule?: string
  /** Competency data for sidebar */
  competencies?: Competency[]
  /** User role for admin visibility */
  userRole?: "learner" | "admin"
  /** Coach context for AI Coach */
  coachContext?: CoachContext
  /** User data for header menu */
  user?: UserMenuUser
}

// -----------------------------------------------------------------------------
// LearnShell Component
// -----------------------------------------------------------------------------

export function LearnShell({ 
  children, 
  activeSection = "overview",
  currentCompetency,
  currentModule,
  competencies = [],
  userRole = "learner",
  coachContext = { level: "course" },
  user,
}: LearnShellProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const drawerRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  // Focus trap for mobile drawer
  React.useEffect(() => {
    if (!drawerOpen || !drawerRef.current) return

    const drawer = drawerRef.current
    const focusableElements = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus first element when drawer opens
    firstElement?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDrawerOpen(false)
        triggerRef.current?.focus()
        return
      }

      if (e.key !== "Tab") return

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    drawer.addEventListener("keydown", handleKeyDown)
    return () => drawer.removeEventListener("keydown", handleKeyDown)
  }, [drawerOpen])

  // Prevent body scroll when drawer is open
  React.useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [drawerOpen])
  
  return (
    <CoachProvider initialContext={coachContext}>
      <div className="learn-shell learn-shell--with-sidebar">
        {/* Skip Link - first focusable element */}
        <a 
          href="#learn-main-content" 
          className="skip-link"
        >
          Skip to main content
        </a>

        <LMSHeader 
          onMenuClick={() => setDrawerOpen(true)}
          showMenuButton={true}
          menuButtonRef={triggerRef}
          user={user}
        />
        
        {/* Main area with sidebar and content */}
        <main className="learn-main">
          {/* Desktop sidebar */}
          <LearnSidebar 
            activeSection={activeSection}
            competencies={competencies}
            currentCompetency={currentCompetency}
            currentModule={currentModule}
            userRole={userRole}
          />
          
          {/* Mobile drawer with focus trap */}
          <div 
            ref={drawerRef}
            className="learn-drawer"
            data-open={drawerOpen}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div 
              className="learn-drawer__backdrop"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <div className="learn-drawer__panel">
              {/* Close button as first focusable element */}
              <button
                className="learn-drawer__close"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation menu"
              >
                <XIcon className="h-5 w-5" />
              </button>
              <LearnSidebar 
                activeSection={activeSection}
                competencies={competencies}
                currentCompetency={currentCompetency}
                currentModule={currentModule}
                userRole={userRole}
                onNavigate={() => setDrawerOpen(false)}
              />
            </div>
          </div>
          
          {/* Content area with landmark for skip link */}
          <div id="learn-main-content" tabIndex={-1} className="learn-main__content">
            {children}
          </div>
        </main>
        
        {/* AI Coach - always available */}
        <CoachTrigger />
        <CoachPanel />
      </div>
    </CoachProvider>
  )
}
