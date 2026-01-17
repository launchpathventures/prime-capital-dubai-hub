/**
 * CATALYST - Learn Shell Client
 *
 * Client component for the persistent learn shell.
 * Used by LearnLayoutShell to provide the UI chrome.
 * 
 * This is a simplified version that:
 * - Provides header and sidebar
 * - Wraps content in providers
 * - Derives active section from pathname
 */

"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { track } from "@vercel/analytics"
import { XIcon } from "lucide-react"
import { LMSHeader } from "./lms-header"
import { LearnSidebar } from "./learn-sidebar"
import {
  CoachProvider,
  CoachPanel,
  CoachTrigger,
} from "@/components/lms/coach"
import {
  FeedbackProvider,
  FeedbackButton,
  FeedbackModal,
} from "@/components/lms/feedback"
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

type ActiveSection = "overview" | "progress" | "course" | "scenarios" | "prompts" | "rera" | "certification" | "admin" | "admin-users" | "admin-feedback" | "admin-prompts"

interface LearnShellClientProps {
  children: React.ReactNode
  competencies?: Competency[]
  userRole?: "learner" | "admin"
  user?: UserMenuUser
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Map pathname to active section for sidebar highlighting
 */
function getActiveSection(pathname: string): ActiveSection {
  if (pathname === "/learn") return "overview"
  if (pathname === "/learn/progress") return "progress"
  if (pathname.startsWith("/learn/scenarios")) return "scenarios"
  if (pathname.startsWith("/learn/quiz/rera")) return "rera"
  if (pathname.startsWith("/learn/quiz")) return "rera"
  if (pathname.startsWith("/learn/prompts")) return "prompts"
  if (pathname.startsWith("/learn/certification")) return "certification"
  if (pathname.startsWith("/learn/admin/users")) return "admin-users"
  if (pathname.startsWith("/learn/admin/feedback")) return "admin-feedback"
  if (pathname.startsWith("/learn/admin/prompts")) return "admin-prompts"
  if (pathname.startsWith("/learn/admin")) return "admin"
  return "course"
}

/**
 * Extract competency and module slugs from course page paths
 */
function extractCourseParams(pathname: string): { competency?: string; module?: string } {
  const reserved = ["progress", "scenarios", "quiz", "prompts", "certification", "admin"]
  const match = pathname.match(/^\/learn\/([^/]+)(?:\/([^/]+))?$/)
  
  if (match && !reserved.includes(match[1])) {
    return { competency: match[1], module: match[2] }
  }
  return {}
}

// -----------------------------------------------------------------------------
// LearnShellClient Component
// -----------------------------------------------------------------------------

export function LearnShellClient({ 
  children, 
  competencies = [],
  userRole = "learner",
  user,
}: LearnShellClientProps) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const drawerRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  // Derive active section and course params from pathname
  const activeSection = getActiveSection(pathname)
  const { competency: currentCompetency, module: currentModule } = extractCourseParams(pathname)

  // Track Learn surface navigation for analytics
  React.useEffect(() => {
    track("learn_page_view", {
      section: activeSection,
      competency: currentCompetency || "none",
      module: currentModule || "none",
      path: pathname,
    })
  }, [pathname, activeSection, currentCompetency, currentModule])

  // Focus trap for mobile drawer
  React.useEffect(() => {
    if (!drawerOpen || !drawerRef.current) return

    const drawer = drawerRef.current
    const focusableElements = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    firstElement?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDrawerOpen(false)
        triggerRef.current?.focus()
        return
      }

      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
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

  // Scroll content to top on navigation
  // Some pages use .learn-content-wrapper (module pages with ToC)
  // Other pages scroll via window/document
  React.useEffect(() => {
    const contentWrapper = document.querySelector(".learn-content-wrapper")
    if (contentWrapper) {
      contentWrapper.scrollTo({ top: 0, behavior: "instant" })
    }
    // Always also scroll window - handles pages without the wrapper
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])
  
  return (
    <CoachProvider initialContext={{ level: "course" }}>
      <FeedbackProvider>
        <div className="learn-shell learn-shell--with-sidebar">
          {/* Skip Link */}
          <a href="#learn-main-content" className="skip-link">
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
            
            {/* Mobile drawer */}
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
            
            {/* Content area */}
            <div id="learn-main-content" tabIndex={-1} className="learn-main__content">
              {children}
            </div>
          </main>
          
          {/* AI Coach */}
          <CoachTrigger />
          <CoachPanel />
          
          {/* Feedback System */}
          <FeedbackButton />
          <FeedbackModal />
        </div>
      </FeedbackProvider>
    </CoachProvider>
  )
}
