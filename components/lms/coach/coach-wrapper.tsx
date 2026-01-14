/**
 * CATALYST - Coach Wrapper
 * 
 * Client-side wrapper that provides CoachProvider and coach UI
 * for use in server components.
 * 
 * Used by: /learn pages that need AI coach integration
 */

"use client"

import * as React from "react"
import { CoachProvider, type CoachContext } from "./coach-provider"
import { CoachTrigger } from "./coach-trigger"
import { CoachPanel } from "./coach-panel"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface CoachWrapperProps {
  children: React.ReactNode
  context: CoachContext
}

// -----------------------------------------------------------------------------
// CoachWrapper Component
// -----------------------------------------------------------------------------

export function CoachWrapper({ 
  children, 
  context,
}: CoachWrapperProps) {
  return (
    <CoachProvider initialContext={context}>
      {children}
      <CoachTrigger />
      <CoachPanel />
    </CoachProvider>
  )
}
