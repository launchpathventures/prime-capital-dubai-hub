/**
 * CATALYST - Roadmap Page
 *
 * Displays FEEDBACK.md and CHANGELOG.md with tabs for switching views.
 * Route: /catalyst/roadmap
 */

import fs from "fs"
import path from "path"
import { Stack, Row, Text, Title } from "@/components/core"
import { Map } from "lucide-react"
import { RoadmapTabs } from "./roadmap-tabs"

// -----------------------------------------------------------------------------
// Data Loading
// -----------------------------------------------------------------------------

function getMarkdownContent(filename: string): string {
  const filePath = path.join(process.cwd(), "catalyst", filename)
  try {
    return fs.readFileSync(filePath, "utf-8")
  } catch {
    return `# ${filename} not found\n\nCreate this file at \`catalyst/${filename}\` to add content.`
  }
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function RoadmapPage() {
  const feedbackContent = getMarkdownContent("FEEDBACK.md")
  const changelogContent = getMarkdownContent("CHANGELOG.md")

  return (
    <article className="catalyst-roadmap">
      <Stack gap="lg">
        {/* ============================================================
            HERO SECTION: Matches Overview/About page gradient card
            ============================================================ */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-white dark:to-background p-5 md:p-6">
          <Stack gap="md">
            <Row gap="sm" align="center">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Map className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <Title size="h3" className="font-bold">
                Roadmap
              </Title>
            </Row>
            <Text size="sm" variant="muted">
              Track project feedback and changes over time. Add ideas to{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">FEEDBACK.md</code>, 
              and project releases to{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">CHANGELOG.md</code>.
            </Text>
          </Stack>
        </div>

        {/* ============================================================
            TABS SECTION: Feedback + Changelog
            ============================================================ */}
        <RoadmapTabs
          feedbackContent={feedbackContent}
          changelogContent={changelogContent}
        />
      </Stack>
    </article>
  )
}
