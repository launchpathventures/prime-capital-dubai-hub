/**
 * CATALYST - Learn Shell
 *
 * Shell for the learning portal with header, sidebar, and content area.
 * Matches the mockup designs exactly.
 *
 * Used by: /learn route group
 */

"use client"

import * as React from "react"
import { LMSHeader } from "./lms-header"
import { LearnSidebar } from "./learn-sidebar"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface LearnUser {
  name: string
  email: string
  role: string
  avatarUrl?: string
}

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
  user: LearnUser
  /** Show sidebar navigation (false for dashboard/course overview) */
  showSidebar?: boolean
  /** Current competency slug for sidebar highlighting */
  currentCompetency?: string
  /** Current module slug for sidebar highlighting */
  currentModule?: string
  /** Competency data for sidebar */
  competencies?: Competency[]
}

// -----------------------------------------------------------------------------
// LearnShell Component
// -----------------------------------------------------------------------------

export function LearnShell({ 
  children, 
  user,
  showSidebar = false,
  currentCompetency,
  currentModule,
  competencies = [],
}: LearnShellProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  
  return (
    <div 
      className="learn-shell"
      data-has-sidebar={showSidebar}
    >
      <LMSHeader 
        onMenuClick={() => setDrawerOpen(true)}
        showMenuButton={showSidebar}
      />
      
      {showSidebar && competencies.length > 0 && (
        <>
          {/* Desktop sidebar */}
          <LearnSidebar 
            competencies={competencies}
            currentCompetency={currentCompetency}
            currentModule={currentModule}
          />
          
          {/* Mobile drawer */}
          <div 
            className="learn-drawer lg:hidden"
            data-open={drawerOpen}
          >
            <div 
              className="learn-drawer__backdrop"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="learn-drawer__panel">
              <LearnSidebar 
                competencies={competencies}
                currentCompetency={currentCompetency}
                currentModule={currentModule}
                onNavigate={() => setDrawerOpen(false)}
              />
            </div>
          </div>
        </>
      )}
      
      <main className="learn-content">
        <div className="learn-content__inner">
          {children}
        </div>
      </main>
    </div>
  )
}
