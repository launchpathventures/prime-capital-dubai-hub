/**
 * CATALYST - Learn Layout Shell
 *
 * Server component that provides the persistent shell for the learn surface.
 * Fetches user and competency data once, keeping the header and sidebar
 * static while content changes.
 */

import { getUserRole, getUserForMenu } from "@/lib/auth/require-auth"
import { getCompetenciesForSidebar } from "@/lib/learning"
import { getMyCertificate } from "@/lib/lms/certificate-queries"
import { LearnShellClient } from "./learn-shell-client"

interface LearnLayoutShellProps {
  children: React.ReactNode
}

export async function LearnLayoutShell({ children }: LearnLayoutShellProps) {
  // Fetch shell data in parallel
  const [competencies, userRole, userMenu, certificate] = await Promise.all([
    getCompetenciesForSidebar(),
    getUserRole(),
    getUserForMenu(),
    getMyCertificate(),
  ])

  return (
    <LearnShellClient
      competencies={competencies}
      userRole={userRole}
      user={userMenu ?? undefined}
      certificateAvailable={Boolean(certificate && !certificate.revokedAt)}
    >
      {children}
    </LearnShellClient>
  )
}
