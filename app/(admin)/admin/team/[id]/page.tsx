/**
 * Team Member Edit Page
 *
 * Dedicated page for creating/editing team members with image uploads.
 */

import { notFound } from "next/navigation"
import { getTeamMemberById } from "@/lib/actions/cms"
import { TeamMemberEditForm } from "./team-member-edit-form"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function TeamMemberEditPage({ params }: PageProps) {
  const { id } = await params
  const isNew = id === "new"

  let member = null
  if (!isNew) {
    const result = await getTeamMemberById(id)
    if (!result.success || !result.data) {
      notFound()
    }
    member = result.data
  }

  return <TeamMemberEditForm member={member} />
}
