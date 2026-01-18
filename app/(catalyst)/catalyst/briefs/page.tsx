/**
 * CATALYST - Briefs Dashboard Page
 *
 * Shows all briefs with card-based layout, search, and state filters.
 * Route: /catalyst/briefs
 */

import { Suspense } from "react"
import { Stack, Row, Text, Title } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { getBriefs, getBriefStats } from "@/lib/briefs"
import { BriefsFilters } from "./briefs-filters"
import { BriefsHelpDialog } from "./briefs-help-dialog"
import {
  FileText,
} from "lucide-react"

export default function BriefsPage() {
  const briefsInPlay = getBriefs()
  const briefsAll = getBriefs({ includeComplete: true, includeArchive: true })
  const stats = getBriefStats()

  // Count by state for stat pills
  const counts = {
    _blocked: briefsInPlay.filter((b) => b.state === "_blocked").length,
    _review: briefsInPlay.filter((b) => b.state === "_review").length,
    active: briefsInPlay.filter((b) => b.state === "active").length,
    approved: briefsInPlay.filter((b) => b.state === "approved").length,
    backlog: briefsInPlay.filter((b) => b.state === "backlog").length,
  }

  return (
    <article className="catalyst-briefs">
      <Stack gap="lg">
        {/* ============================================================
            HEADER: Matches Overview page style
            ============================================================ */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-white dark:to-background p-5 md:p-6">
          <Stack gap="md">
            <Row gap="sm" align="center">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <Title size="h3" className="font-bold">
                Briefs
              </Title>

              <Badge variant="outline" className="text-xs border-border bg-muted/50 text-muted-foreground">
                {stats.inPlay}/{stats.total} in play
              </Badge>

              {counts._review > 0 && (
                <Badge variant="outline" className="text-xs border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {counts._review} in review
                </Badge>
              )}

              {counts._blocked > 0 && (
                <Badge variant="outline" className="text-xs border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400">
                  {counts._blocked} blocked
                </Badge>
              )}
            </Row>

            <Stack gap="sm" align="start">
              <Text size="sm" variant="muted">
                Review and manage your briefs here. Run <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">/brief</code> to start a new brief with AI.
              </Text>
              <BriefsHelpDialog />
            </Stack>
          </Stack>
        </div>

        {/* ============================================================
            FILTERS + GRID: Interactive client component
            ============================================================ */}
        <Suspense
          fallback={
            <div className="rounded-2xl border bg-white/50 p-5 shadow-sm backdrop-blur dark:bg-white/5">
              <Text size="sm" variant="muted">
                Loading briefs...
              </Text>
            </div>
          }
        >
          <BriefsFilters briefs={briefsAll} />
        </Suspense>
      </Stack>
    </article>
  )
}
