/**
 * Stats Admin Page
 *
 * CRUD interface for managing homepage statistics.
 * Reads from Supabase database, supports create/edit/delete.
 */

import { Container } from "@/components/core"
import { StatsClient } from "./stats-client"
import { getStatsFromDb } from "@/lib/actions/cms"

export const metadata = {
  title: "Manage Stats | Admin",
}

export default async function StatsAdminPage() {
  const result = await getStatsFromDb()
  const stats = result.success ? result.data : []

  return (
    <Container size="lg" className="py-6">
      <StatsClient stats={stats} />
    </Container>
  )
}
