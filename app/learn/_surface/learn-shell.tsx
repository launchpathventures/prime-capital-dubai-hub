/**
 * CATALYST - Learn Shell
 *
 * Shell for the learning portal.
 * Features an auto-hiding header and minimal chrome to maximize
 * content space for learning materials.
 *
 * Used by: /learn route group
 */

"use client"

import * as React from "react"
import { LMSHeader } from "@/components/lms"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface LearnUser {
  name: string
  email: string
  role: string
  avatarUrl?: string
}

interface LearnShellProps {
  children: React.ReactNode
  user: LearnUser
}

// -----------------------------------------------------------------------------
// LearnShell Component
// -----------------------------------------------------------------------------

export function LearnShell({ children, user }: LearnShellProps) {
  return (
    <div className="learn-shell min-h-screen flex flex-col">
      <LMSHeader user={user} />
      
      {/* Main content with top padding for fixed header */}
      <main className="learn-content flex-1 pt-14">
        {children}
      </main>
    </div>
  )
}
