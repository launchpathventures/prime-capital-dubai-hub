/**
 * CATALYST - Learn Sidebar
 *
 * Navigation sidebar showing competencies and modules.
 * Collapsible competency sections with progress indicators.
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { 
  ChevronDownIcon, 
  ChevronLeftIcon,
  CheckCircleIcon, 
  CircleIcon,
  LockIcon,
} from "lucide-react"

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
  competencies: Competency[]
  currentCompetency?: string
  currentModule?: string
  onNavigate?: () => void
}

// -----------------------------------------------------------------------------
// LearnSidebar Component
// -----------------------------------------------------------------------------

export function LearnSidebar({ 
  competencies,
  currentCompetency,
  currentModule,
  onNavigate,
}: LearnSidebarProps) {
  const [expanded, setExpanded] = React.useState<Set<string>>(
    new Set(currentCompetency ? [currentCompetency] : [competencies[0]?.slug])
  )
  
  const toggleExpanded = (slug: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  // Calculate total modules for progress
  const totalModules = competencies.reduce((sum, c) => sum + c.modules.length, 0)
  const completedModules = competencies.reduce(
    (sum, c) => sum + c.modules.filter(m => m.status === "complete").length, 
    0
  )
  
  return (
    <aside className="learn-sidebar">
      {/* Header */}
      <div className="learn-sidebar__header">
        <div className="learn-sidebar__label">Consultant Training</div>
        <Link 
          href="/learn/course"
          className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
          onClick={onNavigate}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Exit to Course Overview
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="learn-sidebar__nav">
        {competencies.map((comp) => {
          const isExpanded = expanded.has(comp.slug)
          const isActive = currentCompetency === comp.slug
          const moduleCount = comp.modules.length
          const completedCount = comp.modules.filter(m => m.status === "complete").length
          
          return (
            <div 
              key={comp.slug} 
              className="learn-competency"
              data-expanded={isExpanded}
            >
              <button
                className="learn-competency__trigger"
                data-active={isActive}
                onClick={() => !comp.locked && toggleExpanded(comp.slug)}
                disabled={comp.locked}
              >
                <span 
                  className="learn-competency__number"
                  data-locked={comp.locked}
                >
                  {comp.number}
                </span>
                <div className="learn-competency__info">
                  <div className="learn-competency__name">{comp.name}</div>
                  {comp.locked ? (
                    <span className="learn-badge learn-badge--locked">
                      <LockIcon className="h-2.5 w-2.5 mr-1" />
                      Coming Soon
                    </span>
                  ) : (
                    <div className="learn-competency__meta">
                      {completedCount}/{moduleCount} behaviours
                    </div>
                  )}
                </div>
                {!comp.locked && (
                  <ChevronDownIcon className="learn-competency__chevron" />
                )}
              </button>
              
              {/* Module list */}
              {isExpanded && !comp.locked && (
                <div className="learn-modules">
                  {comp.modules.map((mod) => (
                    <Link
                      key={mod.slug}
                      href={mod.status === "locked" ? "#" : `/learn/${comp.slug}/${mod.slug}`}
                      className="learn-module"
                      data-active={currentModule === mod.slug && currentCompetency === comp.slug}
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
      
      {/* Footer */}
      <div className="learn-sidebar__footer">
        <div className="learn-sidebar__progress">
          Overall Progress: {completedModules} / {totalModules}
        </div>
      </div>
    </aside>
  )
}

// -----------------------------------------------------------------------------
// Module Icon Component
// -----------------------------------------------------------------------------

function ModuleIcon({ status }: { status: string }) {
  switch (status) {
    case "complete":
      return <CheckCircleIcon className="learn-module__icon" data-status="complete" />
    case "current":
      return <CircleIcon className="learn-module__icon" data-status="current" />
    case "locked":
      return <LockIcon className="learn-module__icon" data-status="locked" />
    default:
      return <CircleIcon className="learn-module__icon" />
  }
}
