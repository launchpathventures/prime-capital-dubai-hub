/**
 * CATALYST - YouTube Scripts Admin Page
 *
 * Kanban board for managing YouTube script pipeline:
 * Ideas → Script Ready → Script Recorded → Script Live
 */

import { Container } from "@/components/core"
import { YouTubeClient } from "./youtube-client"
import { getYouTubeScripts } from "@/lib/actions/youtube"

export const metadata = {
  title: "YouTube Scripts | Admin",
}

export const dynamic = "force-dynamic"

export default async function YouTubeAdminPage() {
  const result = await getYouTubeScripts()
  const scripts = result.success ? result.data : []

  return (
    <Container size="xl" className="py-6">
      {!result.success && (
        <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          Failed to load scripts: {result.error}
        </div>
      )}
      <YouTubeClient initialScripts={scripts} />
    </Container>
  )
}
