/**
 * CATALYST - Catalyst Overview Page
 *
 * Condensed dashboard showing project state at a glance.
 * Layout: Vision → Focus → Journey → Team/Goals → Specs → Briefs → Shortcuts
 * Route: /catalyst
 */

import Link from "next/link"
import { Stack, Row, Text, Title, Grid } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getSpecsStatus, formatSpecDate } from "@/lib/specs"
import { getBriefCounts, getBriefStats } from "@/lib/briefs"
import {
  getProjectState,
  STAGE_INFO,
  HEALTH_INFO,
  formatStateDate,
} from "@/lib/project-state"
import { config } from "@/lib/config"
import { StageJourney, SpecCardDialog } from "../_surface"
import {
  Sparkles,
  AlertCircle,
  Users,
  Rocket,
  ArrowRight,
  FileText,
  BookOpen,
  Github,
  ExternalLink,
} from "lucide-react"

export default function CatalystOverviewPage() {
  const specs = getSpecsStatus(true)
  const briefCounts = getBriefCounts()
  const briefStats = getBriefStats()
  const projectState = getProjectState()
  const needsAttention = briefCounts._blocked + briefCounts._review

  const stageInfo = STAGE_INFO[projectState.stage]
  const healthInfo = HEALTH_INFO[projectState.health]

  return (
    <article className="catalyst-overview">
      <Stack gap="lg">
        {/* ============================================================
            SECTION 1: Hero Card (Vision + Focus + Journey)
            Styled like homepage feature cards with gradient
            ============================================================ */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-white dark:to-background p-5 md:p-6">
          <Stack gap="md">
            {/* Header: Icon + Title + Badges (all in one row) */}
            <Row gap="sm" align="center">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <Title size="h3" className="font-bold">
                {config.app.name}
              </Title>
              <Badge
                variant="outline"
                className={`text-xs
                  ${stageInfo.color === "amber" ? "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400" : ""}
                  ${stageInfo.color === "sky" ? "border-sky-500/50 bg-sky-500/10 text-sky-600 dark:text-sky-400" : ""}
                  ${stageInfo.color === "violet" ? "border-violet-500/50 bg-violet-500/10 text-violet-600 dark:text-violet-400" : ""}
                  ${stageInfo.color === "emerald" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : ""}
                `}
              >
                {stageInfo.label}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs
                  ${healthInfo.color}
                  ${projectState.health === "green" ? "border-emerald-500/50 bg-emerald-500/10" : ""}
                  ${projectState.health === "yellow" ? "border-amber-500/50 bg-amber-500/10" : ""}
                  ${projectState.health === "red" ? "border-red-500/50 bg-red-500/10" : ""}
                `}
              >
                {healthInfo.label}
              </Badge>
              {projectState.updated && (
                <Badge variant="outline" className="text-xs border-border bg-muted/50 text-muted-foreground">
                  Updated {formatStateDate(projectState.updated)}
                </Badge>
              )}
              {projectState.project_version && (
                <Badge variant="outline" className="text-xs border-border bg-muted/50 text-muted-foreground">
                  Project v{projectState.project_version}
                </Badge>
              )}
              {/* {projectState.catalyst_version && (
                <Badge variant="outline" className="text-xs border-border bg-muted/50 text-muted-foreground">
                  Catalyst v{projectState.catalyst_version}
                  {projectState.catalyst_ref ? ` (${projectState.catalyst_ref})` : ""}
                </Badge>
              )} */}
            </Row>

            {/* Grounding text */}
            <Text size="sm" variant="muted">
              Your Catalyst project at a glance – current stage, focus, and what needs attention.
            </Text>

            {/* Vision + Focus - Clean two-line format */}
            <Stack gap="xs">
              {projectState.vision && (
                <Text size="sm" variant="muted">
                  <span className="font-medium text-foreground">Vision:</span> {projectState.vision}
                </Text>
              )}
              <Text size="sm" variant="muted">
                <span className="font-medium text-foreground">Focus:</span> {projectState.focus}
              </Text>
            </Stack>

            {/* Blockers - only shown if any */}
            {projectState.blockers.length > 0 && (
              <Row gap="sm" align="center" className="p-2 rounded-md bg-red-500/10 border border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <Text size="sm" className="text-red-600 dark:text-red-400">
                  {projectState.blockers.join(" • ")}
                </Text>
              </Row>
            )}

            {/* Stage Journey - Inside the card */}
            <StageJourney currentStage={projectState.stage} />
          </Stack>
        </div>

        {/* ============================================================
            SECTION 2: Team + Goals (side by side on desktop)
            ============================================================ */}
        <Row gap="md" wrap className="items-stretch">
          {/* Team - Compact */}
          {(projectState.lead || (projectState.support && projectState.support.length > 0)) && (
            <Card className="flex-1 min-w-[280px]">
              <CardContent className="pt-4 pb-4">
                <Row gap="sm" align="center" className="mb-3">
                  <Users className="h-4 w-4 text-primary" />
                  <Text size="base" weight="semibold">People</Text>
                </Row>
                <Stack gap="xs">
                  {projectState.lead && (
                    <Row gap="sm">
                      <Text size="xs" variant="muted" className="w-12 shrink-0">Lead</Text>
                      <Text size="sm" weight="medium">{projectState.lead}</Text>
                    </Row>
                  )}
                  {projectState.support && projectState.support.length > 0 && (
                    <Row gap="sm" align="start">
                      <Text size="xs" variant="muted" className="w-12 shrink-0">Team</Text>
                      <Text size="sm" variant="muted" className="leading-relaxed">
                        {projectState.support.join(", ")}
                      </Text>
                    </Row>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Goals - Compact */}
          {projectState.goals.length > 0 && (
            <Card className="flex-[2] min-w-[320px]">
              <CardContent className="pt-4 pb-4">
                <Row gap="sm" align="center" className="mb-3">
                  <Rocket className="h-4 w-4 text-primary" />
                  <Text size="base" weight="semibold">Goals</Text>
                </Row>
                <ul className="list-disc list-outside ml-5 space-y-1">
                  {projectState.goals.map((goal, i) => (
                    <li key={i}>
                      <Text size="sm">{goal}</Text>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </Row>

        {/* ============================================================
            SECTION 3: Specs Overview (wrapped in card for consistency)
            ============================================================ */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <Row gap="sm" align="center" className="mb-3">
              <FileText className="h-4 w-4 text-primary" />
              <Text size="base" weight="semibold">Specifications</Text>
              <Text size="sm" variant="muted">
                {specs.filter((s) => s.exists).length}/{specs.length} defined
              </Text>
              {specs.filter((s) => s.exists).length === specs.length ? (
                <span className="h-2 w-2 rounded-full bg-emerald-500" title="All defined" />
              ) : specs.filter((s) => s.exists).length >= 3 ? (
                <span className="h-2 w-2 rounded-full bg-amber-500" title="Almost complete" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-red-500" title="Needs attention" />
              )}
            </Row>
            <Grid cols={2} gap="sm" className="spec-cards-grid">
              {specs.map((spec) => (
                <SpecCardDialog
                  key={spec.filename}
                  name={spec.name}
                  filename={spec.filename}
                  description={spec.description}
                  exists={spec.exists}
                  lastModified={spec.lastModified ? formatSpecDate(spec.lastModified) : undefined}
                  content={spec.content}
                />
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* ============================================================
            SECTION 4: Briefs + Quick Links (consolidated)
            ============================================================ */}
        <Row gap="sm" wrap className="items-stretch">
          {/* Briefs - takes 2 columns worth of space */}
          <Link
            href="/catalyst/briefs"
            className="flex-[2] min-w-[280px] px-4 py-3 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
          >
            <Row gap="sm" align="center" justify="between">
              <Row gap="sm" align="center">
                <FileText className="h-4 w-4 text-primary" />
                <Text size="sm" weight="semibold">Briefs</Text>
                <Text size="sm" variant="muted">
                  {briefStats.inPlay}/{briefStats.total} in play
                </Text>
                {needsAttention > 0 ? (
                  <span className="h-2 w-2 rounded-full bg-amber-500" title="Needs attention" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-emerald-500" title="On track" />
                )}
              </Row>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Row>
          </Link>

          <Link
            href="/docs"
            className="flex-1 min-w-[120px] px-4 py-3 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/30 hover:shadow-md transition-all duration-200"
          >
            <Row gap="sm" align="center">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <Text size="sm" weight="medium">Docs</Text>
            </Row>
          </Link>

          {config.links.repo && (
            <a
              href={config.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px] px-4 py-3 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/30 hover:shadow-md transition-all duration-200"
            >
              <Row gap="sm" align="center">
                <Github className="h-4 w-4 text-muted-foreground" />
                <Text size="sm" weight="medium">GitHub</Text>
                <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
              </Row>
            </a>
          )}
        </Row>
      </Stack>
    </article>
  )
}
