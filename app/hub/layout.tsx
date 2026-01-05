/**
 * CATALYST - Hub Route Group Layout
 *
 * Layout for the client engagement portal.
 * Provides authentication check and hub header.
 * 
 * AUTH:
 * - All /hub routes are protected by proxy.ts (middleware)
 * - This layout only fetches user data for display, does NOT redirect
 * - User will always be authenticated when this layout renders
 */

import { HubHeader } from "@/components/hub/hub-header"

// -----------------------------------------------------------------------------
// Layout
// -----------------------------------------------------------------------------

export default function HubLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="hub-layout min-h-screen bg-background">
      <HubHeader />
      <main className="container py-8">{children}</main>
    </div>
  )
}
