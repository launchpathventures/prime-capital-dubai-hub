/**
 * CATALYST - YouTube Script Detail Page
 *
 * Full-page view for a single script — generate, validate, download PDF.
 */

import { notFound } from "next/navigation"
import { Container } from "@/components/core"
import {
  getYouTubeScript,
  getYouTubeScriptMessages,
  getYouTubeScriptVersions,
} from "@/lib/actions/youtube"
import { ScriptDetailPage } from "./script-detail-page"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getYouTubeScript(id)
  return { title: result.success ? `${result.data.title} | YouTube | Admin` : "Script | Admin" }
}

export default async function YouTubeScriptPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [scriptResult, messagesResult, versionsResult] = await Promise.all([
    getYouTubeScript(id),
    getYouTubeScriptMessages(id),
    getYouTubeScriptVersions(id),
  ])

  if (!scriptResult.success) notFound()

  return (
    <Container size="lg" className="py-6">
      <ScriptDetailPage
        script={scriptResult.data}
        initialMessages={messagesResult.success ? messagesResult.data : []}
        initialVersions={versionsResult.success ? versionsResult.data : []}
      />
    </Container>
  )
}
