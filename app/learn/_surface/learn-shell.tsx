/**
 * CATALYST - Learn Shell
 *
 * Shell for the learning portal with header, sidebar, and content area.
 * Sidebar is always visible with navigation sections.
 * Includes AI Coach integration for contextual assistance.
 *
 * Used by: /learn route group
 */

"use client"

import * as React from "react"
import { LMSHeader } from "./lms-header"
import { LearnSidebar } from "./learn-sidebar"
import {
  CoachProvider,
  CoachPanel,
  CoachTrigger,
  type CoachContext,
} from "@/components/lms/coach"

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
  activeSection?: "overview" | "progress" | "course" | "scenarios" | "rera" | "certification" | "admin"
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
}: LearnShellProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  
  return (
    <CoachProvider initialContext={coachContext}>
      <div className="learn-shell learn-shell--with-sidebar">
        <LMSHeader 
          onMenuClick={() => setDrawerOpen(true)}
          showMenuButton={true}
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
            className="learn-drawer"
            data-open={drawerOpen}
          >
            <div 
              className="learn-drawer__backdrop"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="learn-drawer__panel">
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
          
          {/* Content area - pages provide their own wrapper */}
          {children}
        </main>
        
        {/* AI Coach - always available */}
        <CoachTrigger />
        <CoachPanel />
      </div>
    </CoachProvider>
  )
}
