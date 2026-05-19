/**
 * CATALYST - Review & Rewrite Page (Mode A)
 *
 * Entry point for the existing-script → validate → rewrite flow.
 *
 * Requires ?profile=tahir|ahmed — bounces back to the picker if absent so the
 * presenter is always locked-in before a script is reviewed.
 */

import { redirect } from "next/navigation"
import { Container } from "@/components/core"
import { ReviewScriptWorkflow } from "./review-script-workflow"
import { isProfileSlug } from "@/lib/youtube/profiles"

export const metadata = {
  title: "Review & Rewrite | YouTube | Admin",
}

type SearchParams = Promise<{ profile?: string }>

export default async function ReviewScriptPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  if (!isProfileSlug(params.profile)) redirect("/admin/youtube")

  return (
    <Container size="lg" className="py-6">
      <ReviewScriptWorkflow lockedProfile={params.profile} />
    </Container>
  )
}
