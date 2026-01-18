/**
 * CATALYST - Roadmap Tabs Component
 *
 * Client component for tabs with markdown rendering.
 * Uses react-markdown for rendering markdown content.
 */

"use client"

import ReactMarkdown from "react-markdown"
import { Stack, Row, Text, Prose } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Lightbulb, ScrollText } from "lucide-react"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface RoadmapTabsProps {
  feedbackContent: string
  changelogContent: string
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function RoadmapTabs({ feedbackContent, changelogContent }: RoadmapTabsProps) {
  return (
    <Tabs defaultValue="feedback">
      <TabsList className="mb-4">
        <TabsTrigger value="feedback">
          <Row gap="xs" align="center">
            <Lightbulb className="h-4 w-4" />
            <span>Feedback</span>
          </Row>
        </TabsTrigger>
        <TabsTrigger value="changelog">
          <Row gap="xs" align="center">
            <ScrollText className="h-4 w-4" />
            <span>Changelog</span>
          </Row>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="feedback">
        <Stack gap="md">
          {/* Info callout */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <Text size="sm" variant="muted">
              Add entries to{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">catalyst/FEEDBACK.md</code>{" "}
              using the format:{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">## Title (YYYY-MM-DD, @author)</code>.
              When ready to act on feedback, create a brief.
            </Text>
          </div>

          {/* Markdown content in card */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <Prose size="sm" className="max-h-[500px] overflow-y-auto">
                <ReactMarkdown>{feedbackContent}</ReactMarkdown>
              </Prose>
            </CardContent>
          </Card>
        </Stack>
      </TabsContent>

      <TabsContent value="changelog">
        <Stack gap="md">
          {/* Info callout */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <ScrollText className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <Text size="sm" variant="muted">
              Document releases in{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">catalyst/CHANGELOG.md</code>{" "}
              following "Keep a Changelog". Use{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">[Unreleased]</code>{" "}
              for in-progress work, and version on release.
            </Text>
          </div>

          {/* Markdown content in card */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <Prose size="sm" className="max-h-[500px] overflow-y-auto">
                <ReactMarkdown>{changelogContent}</ReactMarkdown>
              </Prose>
            </CardContent>
          </Card>
        </Stack>
      </TabsContent>
    </Tabs>
  )
}
