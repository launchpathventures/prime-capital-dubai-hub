/**
 * CATALYST - Learn Shell
 *
 * Shell for the learning portal.
 * Features a fixed header with Prime Capital branding.
 *
 * Used by: /learn route group
 */

"use client"

import * as React from "react"
import { LMSHeader } from "@/components/lms"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface LearnShellProps {
  children: React.ReactNode
}

// -----------------------------------------------------------------------------
// LearnShell Component
// -----------------------------------------------------------------------------

export function LearnShell({ children }: LearnShellProps) {
  return (
    <div className="learn-shell min-h-screen flex flex-col">
      <LMSHeader />
      
      {/* Main content with top padding for fixed header */}
      <main className="learn-content flex-1 pt-14">
        {children}
      </main>
    </div>
  )
}
