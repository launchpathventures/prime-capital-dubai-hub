/**
 * Team Admin Page
 *
 * CRUD interface for managing team members.
 * Reads from Supabase database, supports create/edit/delete.
 * Cross-references LMS progress data by email.
 */

import { Container } from "@/components/core"
import { TeamClient } from "./team-client"
import { getTeamMembersFromDb } from "@/lib/actions/cms"
import { getAllLearnersWithProgress } from "@/lib/lms/admin-queries"

export const metadata = {
  title: "Manage Team | Admin",
}

export default async function TeamAdminPage() {
  const [result, learners] = await Promise.all([
    getTeamMembersFromDb(),
    getAllLearnersWithProgress(),
  ])
  const members = result.success ? result.data : []

  // Build email -> LMS progress lookup
  const lmsProgressByEmail: Record<string, {
    overallProgress: number
    certificationStatus: "in_progress" | "ready" | "certified"
    completedModules: number
    totalModules: number
  }> = {}
  for (const learner of learners) {
    lmsProgressByEmail[learner.email.toLowerCase()] = {
      overallProgress: learner.overallProgress,
      certificationStatus: learner.certificationStatus,
      completedModules: learner.completedModules,
      totalModules: learner.totalModules,
    }
  }

  return (
    <Container size="lg" className="py-6">
      <TeamClient members={members} lmsProgress={lmsProgressByEmail} />
    </Container>
  )
}
