/**
 * CATALYST - Learn Sidebar
 *
 * Navigation sidebar with sections for course content, practice, and certification.
 * Collapsible competency sections with progress indicators.
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  CheckCircleIcon, 
  CircleIcon,
  LockIcon,
  BookOpenIcon,
  BarChart3Icon,
  MessageSquareIcon,
  ClipboardCheckIcon,
  AwardIcon,
  SettingsIcon,
  UsersIcon,
  SparklesIcon,
  GraduationCapIcon,
  MessageSquarePlusIcon,
} from "lucide-react"
import { TourSidebarLink } from "./academy-tour"

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

interface LearnSidebarProps {
  /** Active section for highlighting */
  activeSection?: "overview" | "progress" | "course" | "scenarios" | "prompts" | "rera" | "certification" | "admin" | "admin-users" | "admin-feedback"
  /** Competency data for course section */
  competencies?: Competency[]
  /** Current competency slug */
  currentCompetency?: string
  /** Current module slug */
  currentModule?: string
  /** User role for admin visibility */
  userRole?: "learner" | "admin"
  /** Callback for mobile drawer close */
  onNavigate?: () => void
}

// -----------------------------------------------------------------------------
// LearnSidebar Component
// -----------------------------------------------------------------------------

export function LearnSidebar({ 
  activeSection,
  competencies = [],
  currentCompetency,
  currentModule,
  userRole = "learner",
  onNavigate,
}: LearnSidebarProps) {
  const [courseExpanded, setCourseExpanded] = React.useState(activeSection === "course")
  const [expandedCompetencies, setExpandedCompetencies] = React.useState<Set<string>>(
    new Set(currentCompetency ? [currentCompetency] : [])
  )
  
  const toggleCompetency = (slug: string) => {
    setExpandedCompetencies(prev => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  // Calculate progress
  const totalModules = competencies.reduce((sum, c) => sum + c.modules.length, 0)
  const completedModules = competencies.reduce(
    (sum, c) => sum + c.modules.filter(m => m.status === "complete").length, 
    0
  )
  
  return (
    <aside className="learn-sidebar">
      {/* Learn Section */}
      <div className="learn-sidebar__section">
        <div className="learn-sidebar__heading">Learn</div>
        <nav className="learn-sidebar__nav-list">
          <Link 
            href="/learn"
            className="learn-sidebar__nav-item"
            data-active={activeSection === "overview"}
            onClick={onNavigate}
          >
            <BookOpenIcon className="learn-sidebar__nav-icon" />
            <span>Course Overview</span>
          </Link>
          <Link 
            href="/learn/progress"
            className="learn-sidebar__nav-item"
            data-active={activeSection === "progress"}
            onClick={onNavigate}
          >
            <BarChart3Icon className="learn-sidebar__nav-icon" />
            <span>My Progress</span>
          </Link>
          <TourSidebarLink onNavigate={onNavigate} />
        </nav>
      </div>
      
      {/* Course Content Section */}
      {competencies.length > 0 && (
        <div className="learn-sidebar__section">
          <button 
            className="learn-sidebar__heading learn-sidebar__heading--collapsible"
            onClick={() => setCourseExpanded(!courseExpanded)}
          >
            <span className="flex items-center gap-1.5">
              <GraduationCapIcon className="h-3.5 w-3.5" />
              Course Content
            </span>
            {courseExpanded ? (
              <ChevronDownIcon className="h-3.5 w-3.5" />
            ) : (
              <ChevronRightIcon className="h-3.5 w-3.5" />
            )}
          </button>
          
          {courseExpanded && (
            <nav className="learn-sidebar__competencies">
              {competencies.map((comp) => {
                const isExpanded = expandedCompetencies.has(comp.slug)
                const isActive = currentCompetency === comp.slug
                const completedCount = comp.modules.filter(m => m.status === "complete").length
                const isFullyComplete = completedCount === comp.modules.length && comp.modules.length > 0
                
                return (
                  <div 
                    key={comp.slug} 
                    className="learn-sidebar__competency"
                    data-expanded={isExpanded}
                  >
                    <div className="learn-sidebar__competency-row">
                      <Link
                        href={comp.locked ? "#" : `/learn/${comp.slug}`}
                        className="learn-sidebar__competency-link"
                        data-active={isActive && !currentModule}
                        data-locked={comp.locked}
                        onClick={(e) => {
                          if (comp.locked) {
                            e.preventDefault()
                          } else {
                            onNavigate?.()
                          }
                        }}
                      >
                        {isFullyComplete ? (
                          <span className="learn-sidebar__competency-complete">
                            <CheckCircleIcon className="h-4 w-4" />
                          </span>
                        ) : (
                          <span 
                            className="learn-sidebar__competency-number"
                            data-locked={comp.locked}
                          >
                            {comp.number}
                          </span>
                        )}
                        <span className="learn-sidebar__competency-name">{comp.name}</span>
                      </Link>
                      {!comp.locked && comp.modules.length > 0 && (
                        <button
                          className="learn-sidebar__competency-toggle"
                          onClick={() => toggleCompetency(comp.slug)}
                          aria-label={isExpanded ? "Collapse modules" : "Expand modules"}
                        >
                          <ChevronDownIcon className="learn-sidebar__competency-chevron" />
                        </button>
                      )}
                    </div>
                    
                    {isExpanded && !comp.locked && (
                      <div className="learn-sidebar__modules">
                        {comp.modules.map((mod) => (
                          <Link
                            key={mod.slug}
                            href={mod.status === "locked" ? "#" : `/learn/${comp.slug}/${mod.slug}`}
                            className="learn-sidebar__module"
                            data-active={currentModule === mod.slug && currentCompetency === comp.slug}
                            data-status={mod.status}
                            onClick={(e) => {
                              if (mod.status === "locked") {
                                e.preventDefault()
                              } else {
                                onNavigate?.()
                              }
                            }}
                          >
                            <ModuleIcon status={mod.status} />
                            <span>{mod.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          )}
        </div>
      )}
      
      {/* Practice Section */}
      <div className="learn-sidebar__section">
        <div className="learn-sidebar__heading">Practice</div>
        <nav className="learn-sidebar__nav-list">
          <Link 
            href="/learn/scenarios"
            className="learn-sidebar__nav-item"
            data-active={activeSection === "scenarios"}
            onClick={onNavigate}
          >
            <MessageSquareIcon className="learn-sidebar__nav-icon" />
            <span>AI Scenarios</span>
          </Link>
          <Link 
            href="/learn/quiz/rera"
            className="learn-sidebar__nav-item"
            data-active={activeSection === "rera"}
            onClick={onNavigate}
          >
            <ClipboardCheckIcon className="learn-sidebar__nav-icon" />
            <span>RERA Practice Quizzes</span>
          </Link>
        </nav>
      </div>
      
      {/* Apply Section */}
      <div className="learn-sidebar__section">
        <div className="learn-sidebar__heading">Apply</div>
        <nav className="learn-sidebar__nav-list">
          <Link 
            href="/learn/prompts"
            className="learn-sidebar__nav-item"
            data-active={activeSection === "prompts"}
            onClick={onNavigate}
          >
            <SparklesIcon className="learn-sidebar__nav-icon" />
            <span>AI Prompts Library</span>
          </Link>
        </nav>
      </div>
      
      {/* Certification Section */}
      <div className="learn-sidebar__section">
        <div className="learn-sidebar__heading">Certification</div>
        <nav className="learn-sidebar__nav-list">
          <Link 
            href="/learn/certification"
            className="learn-sidebar__nav-item"
            data-active={activeSection === "certification"}
            onClick={onNavigate}
          >
            <AwardIcon className="learn-sidebar__nav-icon" />
            <span>Certification Prep</span>
          </Link>
        </nav>
      </div>
      
      {/* Admin Section - only for admins */}
      {userRole === "admin" && (
        <div className="learn-sidebar__section learn-sidebar__section--admin">
          <div className="learn-sidebar__heading">Admin</div>
          <nav className="learn-sidebar__nav-list">
            <Link 
              href="/learn/admin/users"
              className="learn-sidebar__nav-item"
              data-active={activeSection === "admin-users"}
              onClick={onNavigate}
            >
              <UsersIcon className="learn-sidebar__nav-icon" />
              <span>User Management</span>
            </Link>
            <Link 
              href="/learn/admin/feedback"
              className="learn-sidebar__nav-item"
              data-active={activeSection === "admin-feedback"}
              onClick={onNavigate}
            >
              <MessageSquarePlusIcon className="learn-sidebar__nav-icon" />
              <span>Content Feedback</span>
            </Link>
            <Link 
              href="/learn/admin/certification"
              className="learn-sidebar__nav-item"
              data-active={activeSection === "admin"}
              onClick={onNavigate}
            >
              <SettingsIcon className="learn-sidebar__nav-icon" />
              <span>Certification Admin</span>
            </Link>
            <Link 
              href="/learn/admin/prompts"
              className="learn-sidebar__nav-item"
              data-active={activeSection === "admin-prompts"}
              onClick={onNavigate}
            >
              <SparklesIcon className="learn-sidebar__nav-icon" />
              <span>AI Prompts</span>
            </Link>
          </nav>
        </div>
      )}
      
      {/* Footer with progress */}
      {totalModules > 0 && (
        <div className="learn-sidebar__footer">
          <div className="learn-sidebar__progress-bar">
            <div 
              className="learn-sidebar__progress-fill"
              style={{ width: `${(completedModules / totalModules) * 100}%` }}
            />
          </div>
          <div className="learn-sidebar__progress-text">
            {completedModules} / {totalModules} modules complete
          </div>
        </div>
      )}
    </aside>
  )
}

// -----------------------------------------------------------------------------
// Module Icon Component
// -----------------------------------------------------------------------------

function ModuleIcon({ status }: { status: string }) {
  switch (status) {
    case "complete":
      return <CheckCircleIcon className="learn-sidebar__module-icon" data-status="complete" />
    case "current":
      return <CircleIcon className="learn-sidebar__module-icon" data-status="current" />
    case "locked":
      return <LockIcon className="learn-sidebar__module-icon" data-status="locked" />
    default:
      return <CircleIcon className="learn-sidebar__module-icon" />
  }
}
