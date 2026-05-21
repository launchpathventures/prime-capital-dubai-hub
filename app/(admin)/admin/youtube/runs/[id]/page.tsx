/**
 * CATALYST - Single-Script Run Workspace
 *
 * The hub for one "Write One Script" run: editable context (text + voice
 * transcript), the 3 distilled angles, and per-angle Generate / View buttons
 * so the user can try any of the angles without losing the others.
 */

import { notFound } from "next/navigation"
import { Container } from "@/components/core"
import {
  getYouTubeScriptRun,
  getYouTubeScriptsForRun,
} from "@/lib/actions/youtube"
import { RunWorkspace } from "./run-workspace"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const run = await getYouTubeScriptRun(id)
  return {
    title: run.success ? "Run · Write One Script | YouTube | Admin" : "Run | Admin",
  }
}

export default async function YouTubeScriptRunPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [runResult, scriptsResult] = await Promise.all([
    getYouTubeScriptRun(id),
    getYouTubeScriptsForRun(id),
  ])

  if (!runResult.success) notFound()

  return (
    <Container size="lg" className="py-6">
      <RunWorkspace
        run={runResult.data}
        initialScripts={scriptsResult.success ? scriptsResult.data : []}
      />
    </Container>
  )
}
