/**
 * CATALYST - Team Admin Page
 *
 * CRUD interface for managing team members.
 * Reads from Supabase database, supports create/edit/delete.
 */

import { Container } from "@/components/core"
import { TeamClient } from "./team-client"
import { getTeamMembersFromDb } from "@/lib/actions/cms"

export const metadata = {
  title: "Manage Team | Admin",
}

export default async function TeamAdminPage() {
  const result = await getTeamMembersFromDb()
  const members = result.success ? result.data : []

  return (
    <Container size="lg" className="py-6">
      <TeamClient members={members} />
    </Container>
  )
}
