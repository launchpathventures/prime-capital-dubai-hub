/**
 * CATALYST - Write One Script Page (Mode B)
 *
 * Entry point for the context → single script flow. Hosts the
 * SingleScriptWorkflow component which handles distillation and confirmation.
 *
 * Requires ?profile=tahir|ahmed — bounces back to the picker if absent so the
 * presenter is always locked-in before a script is generated.
 */

import { redirect } from "next/navigation"
import { Container } from "@/components/core"
import { SingleScriptWorkflow } from "./single-script-workflow"
import { isProfileSlug } from "@/lib/youtube/profiles"

export const metadata = {
  title: "Write One Script | YouTube | Admin",
}

type SearchParams = Promise<{ profile?: string }>

export default async function WriteOneScriptPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  if (!isProfileSlug(params.profile)) redirect("/admin/youtube")

  return (
    <Container size="lg" className="py-6">
      <SingleScriptWorkflow lockedProfile={params.profile} />
    </Container>
  )
}
