/**
 * CATALYST - Brainstorm Ideas Page
 *
 * Multi-step workflow that generates 5 format-tagged script ideas from one
 * input. The user reviews the batch, selects which ones to keep, then either
 * saves them to the pipeline or jumps straight into script generation.
 *
 * Requires ?profile=tahir|ahmed — bounces back to the picker if absent so the
 * presenter is always locked-in before a script is generated.
 */

import { redirect } from "next/navigation"
import { Container } from "@/components/core"
import { BrainstormWorkflow } from "./brainstorm-workflow"
import { isProfileSlug } from "@/lib/youtube/profiles"

export const metadata = {
  title: "Brainstorm Ideas | YouTube | Admin",
}

type SearchParams = Promise<{ profile?: string }>

export default async function BrainstormPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  if (!isProfileSlug(params.profile)) redirect("/admin/youtube")

  return (
    <Container size="lg" className="py-6">
      <BrainstormWorkflow lockedProfile={params.profile} />
    </Container>
  )
}
