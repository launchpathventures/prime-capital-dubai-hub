/**
 * Learner Detail Page
 *
 * Shows detailed progress for a single learner including:
 * - Overall progress summary
 * - Learning progress by competency with module details
 * - Scenario completion status
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Container, Stack, Row, Text, Title, Avatar } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  BookOpenIcon,
  MessageSquareIcon,
  ChevronDownIcon,
  MinusIcon,
} from "lucide-react"
import { requireAdmin } from "@/lib/auth/require-auth"
import {
  getLearnerDetail,
  formatRelativeTime,
  type CompetencyProgress,
  type ScenarioCategoryProgress,
  type ScenarioCompletion,
  type ModuleProgress,
} from "@/lib/lms/admin-queries"

// Force dynamic rendering
export const dynamic = "force-dynamic"

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ userId: string }>
}

export default async function LearnerDetailPage({ params }: PageProps) {
  await requireAdmin()

  const { userId } = await params
  const learner = await getLearnerDetail(userId)

  if (!learner) {
    notFound()
  }

  const certificationConfig = {
    in_progress: { label: "In Progress", variant: "secondary" as const },
    ready: { label: "Ready", variant: "outline" as const },
    certified: { label: "Certified", variant: "default" as const },
  }

  const { label: statusLabel, variant: statusVariant } =
    certificationConfig[learner.certificationStatus]

  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Back Button */}
        <div>
          <Link href="/learn/admin/progress">
            <Button variant="ghost" size="sm">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Team Progress
            </Button>
          </Link>
        </div>

        {/* Learner Header */}
        <Card>
          <CardContent className="py-6">
            <Row gap="lg" align="center">
              <Avatar name={learner.fullName} size="lg" />
              <Stack gap="xs" className="flex-1">
                <Row gap="sm" align="center">
                  <Title size="h3">{learner.fullName}</Title>
                  <Badge variant={statusVariant}>{statusLabel}</Badge>
                  {learner.isAtRisk && (
                    <Badge variant="outline" className="border-warning text-warning">
                      <AlertTriangleIcon className="h-3 w-3 mr-1" />
                      At Risk
                    </Badge>
                  )}
                </Row>
                <Text variant="muted">{learner.email}</Text>
              </Stack>
              <Stack gap="xs" align="end">
                <Row gap="sm" align="baseline">
                  <Title size="h2">{learner.overallProgress}%</Title>
                  <Text variant="muted">complete</Text>
                </Row>
                <Text size="sm" variant="muted">
                  {learner.completedModules} of {learner.totalModules} modules
                </Text>
                <Text size="xs" variant="muted">
                  Last active: {formatRelativeTime(learner.lastActivity)}
                </Text>
              </Stack>
            </Row>
          </CardContent>
        </Card>

        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Row gap="sm" align="center">
                <BookOpenIcon className="h-5 w-5" />
                Learning Progress
              </Row>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {learner.competencyProgress.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={<BookOpenIcon className="h-8 w-8" />}
                  message="No competencies found"
                />
              </div>
            ) : (
              <div className="divide-y">
                {learner.competencyProgress.map((comp) => (
                  <CompetencySection key={comp.slug} competency={comp} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scenario Progress */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Row gap="sm" align="center">
                <MessageSquareIcon className="h-5 w-5" />
                Scenario Progress
              </Row>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {learner.scenarioProgress.length === 0 ? (
              <EmptyState
                icon={<MessageSquareIcon className="h-8 w-8" />}
                message="No scenarios available"
              />
            ) : (
              <ScenarioTable scenarios={learner.scenarioProgress} />
            )}
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}

// -----------------------------------------------------------------------------
// Competency Section Component (Expandable)
// -----------------------------------------------------------------------------

function CompetencySection({ competency }: { competency: CompetencyProgress }) {
  const isComplete = competency.progressPercent === 100

  return (
    <Collapsible>
      <CollapsibleTrigger
        render={<div role="button" tabIndex={0} />}
        className="w-full cursor-pointer group"
      >
        <div className="px-4 py-4 hover:bg-muted/30 transition-colors">
          <Row gap="md" align="center">
            <div className="flex-1 min-w-0">
              <Row gap="sm" align="center" className="mb-2">
                <Text weight="medium" className="truncate">{competency.name}</Text>
                {isComplete && (
                  <CheckCircleIcon className="h-4 w-4 text-success flex-shrink-0" />
                )}
              </Row>
              <Progress value={competency.progressPercent} className="h-2" />
            </div>
            <Stack gap="none" align="end" className="flex-shrink-0 w-24">
              <Text size="sm" weight="medium">
                {competency.progressPercent}%
              </Text>
              <Text size="xs" variant="muted">
                {competency.completedModules}/{competency.totalModules} modules
              </Text>
            </Stack>
            <ChevronDownIcon className="h-5 w-5 text-muted-foreground transition-transform group-data-[open]:rotate-180" />
          </Row>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4">
          <div className="bg-muted/30 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-3 py-2">
                    <Text size="xs" weight="medium" variant="muted">Module</Text>
                  </th>
                  <th className="text-left px-3 py-2 w-24">
                    <Text size="xs" weight="medium" variant="muted">Status</Text>
                  </th>
                  <th className="text-left px-3 py-2 w-24">
                    <Text size="xs" weight="medium" variant="muted">Quiz</Text>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {competency.modules.map((mod) => (
                  <ModuleRow key={mod.id} module={mod} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// -----------------------------------------------------------------------------
// Module Row Component
// -----------------------------------------------------------------------------

function ModuleRow({ module }: { module: ModuleProgress }) {
  return (
    <tr className="hover:bg-muted/20 transition-colors">
      <td className="px-3 py-2">
        <Row gap="sm" align="center">
          {module.status === "completed" ? (
            <CheckCircleIcon className="h-4 w-4 text-success flex-shrink-0" />
          ) : module.status === "in_progress" ? (
            <div className="h-4 w-4 rounded-full border-2 border-primary flex-shrink-0" />
          ) : (
            <MinusIcon className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
          )}
          <Text size="sm" className={module.status === "not_started" ? "text-muted-foreground" : ""}>
            {module.title}
          </Text>
        </Row>
      </td>
      <td className="px-3 py-2">
        {module.status === "completed" ? (
          <Badge variant="default" className="bg-success text-xs">Complete</Badge>
        ) : module.status === "in_progress" ? (
          <Badge variant="secondary" className="text-xs">In Progress</Badge>
        ) : (
          <Text size="xs" variant="muted">—</Text>
        )}
      </td>
      <td className="px-3 py-2">
        {module.quizAttempts > 0 ? (
          <Row gap="xs" align="center">
            <Text size="sm" weight="medium" className={module.quizPassed ? "text-success" : "text-muted-foreground"}>
              {module.quizScore}/{module.quizMaxScore}
            </Text>
            {module.quizPassed ? (
              <CheckCircleIcon className="h-3 w-3 text-success" />
            ) : (
              <XCircleIcon className="h-3 w-3 text-muted-foreground" />
            )}
          </Row>
        ) : (
          <Text size="xs" variant="muted">—</Text>
        )}
      </td>
    </tr>
  )
}

// -----------------------------------------------------------------------------
// Scenario Progress Component - Collapsible with individual completions
// -----------------------------------------------------------------------------

function ScenarioTable({ scenarios }: { scenarios: ScenarioCategoryProgress[] }) {
  // Separate categories with activity from those without
  const withActivity = scenarios.filter((s) => s.completedScenarios > 0)
  const withoutActivity = scenarios.filter((s) => s.completedScenarios === 0)
  
  // Calculate totals
  const totalCompleted = scenarios.reduce((sum, s) => sum + s.completedScenarios, 0)
  const totalAvailable = scenarios.reduce((sum, s) => sum + s.totalScenarios, 0)
  const totalReflections = scenarios.reduce((sum, s) => sum + s.reflectionsSubmitted, 0)
  
  if (scenarios.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquareIcon className="h-8 w-8" />}
        message="No scenarios available"
      />
    )
  }
  
  // If nothing practiced yet - show a clear "not started" state
  if (withActivity.length === 0) {
    return (
      <Stack gap="md" className="py-2">
        <div className="bg-muted/30 rounded-lg p-4 border border-dashed border-muted-foreground/20">
          <Stack gap="sm" align="center" className="text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <MessageSquareIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <Stack gap="xs" align="center">
              <Text weight="medium">No Scenario Practice Yet</Text>
              <Text size="sm" variant="muted" className="max-w-md">
                This learner hasn&apos;t practiced any roleplay scenarios. Scenarios help develop real-world skills through simulated client interactions.
              </Text>
            </Stack>
          </Stack>
        </div>
        
        <Stack gap="sm">
          <Text size="sm" weight="medium" variant="muted">
            Available Categories ({scenarios.length})
          </Text>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {scenarios.map((category) => (
              <div 
                key={category.categorySlug}
                className="flex items-center justify-between px-3 py-2 bg-muted/20 rounded-md"
              >
                <Text size="sm">{category.categoryTitle}</Text>
                <Text size="xs" variant="muted">{category.totalScenarios} scenarios</Text>
              </div>
            ))}
          </div>
        </Stack>
      </Stack>
    )
  }
  
  return (
    <Stack gap="md">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-muted/20 rounded-lg">
        <Stack gap="none" align="center">
          <Text size="xl" weight="bold">{totalCompleted}</Text>
          <Text size="xs" variant="muted">Completed</Text>
        </Stack>
        <Stack gap="none" align="center">
          <Text size="xl" weight="bold">{totalAvailable - totalCompleted}</Text>
          <Text size="xs" variant="muted">Remaining</Text>
        </Stack>
        <Stack gap="none" align="center">
          <Text size="xl" weight="bold">{totalReflections}</Text>
          <Text size="xs" variant="muted">Reflections</Text>
        </Stack>
      </div>
      
      {/* Categories with activity */}
      <div className="divide-y border rounded-lg overflow-hidden">
        {withActivity.map((category) => (
          <ScenarioCategorySection key={category.categorySlug} category={category} />
        ))}
      </div>
      
      {/* Categories without activity */}
      {withoutActivity.length > 0 && (
        <Stack gap="sm">
          <Text size="sm" weight="medium" variant="muted">
            Not Yet Practiced ({withoutActivity.length})
          </Text>
          <div className="flex flex-wrap gap-2">
            {withoutActivity.map((category) => (
              <div 
                key={category.categorySlug}
                className="flex items-center gap-2 px-2 py-1 bg-muted/30 rounded text-sm"
              >
                <span className="text-muted-foreground">{category.categoryTitle}</span>
                <span className="text-xs text-muted-foreground/60">{category.totalScenarios}</span>
              </div>
            ))}
          </div>
        </Stack>
      )}
    </Stack>
  )
}

// -----------------------------------------------------------------------------
// Scenario Category Section (Expandable with completions)
// -----------------------------------------------------------------------------

function ScenarioCategorySection({ category }: { category: ScenarioCategoryProgress }) {
  const progressPercent = category.totalScenarios > 0
    ? Math.round((category.completedScenarios / category.totalScenarios) * 100)
    : 0
  const isComplete = progressPercent === 100

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger
        render={<div role="button" tabIndex={0} />}
        className="w-full cursor-pointer group"
      >
        <div className="px-4 py-3 hover:bg-muted/30 transition-colors">
          <Row gap="md" align="center">
            <div className="flex-1 min-w-0">
              <Row gap="sm" align="center" className="mb-1.5">
                {isComplete ? (
                  <CheckCircleIcon className="h-4 w-4 text-success flex-shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-primary flex-shrink-0" />
                )}
                <Text weight="medium" className="truncate">{category.categoryTitle}</Text>
              </Row>
              <Row gap="sm" align="center" className="ml-6">
                <Progress value={progressPercent} className="h-1.5 flex-1 max-w-24" />
                <Text size="xs" variant="muted">
                  {category.completedScenarios}/{category.totalScenarios}
                </Text>
                {category.reflectionsSubmitted > 0 && (
                  <Badge variant="outline" className="text-xs ml-2">
                    {category.reflectionsSubmitted} reflection{category.reflectionsSubmitted !== 1 ? "s" : ""}
                  </Badge>
                )}
              </Row>
            </div>
            <ChevronDownIcon className="h-5 w-5 text-muted-foreground transition-transform group-data-[open]:rotate-180" />
          </Row>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4 pt-1">
          <div className="ml-6 space-y-2">
            {category.completions.map((completion, index) => (
              <ScenarioCompletionCard key={index} completion={completion} />
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// -----------------------------------------------------------------------------
// Individual Scenario Completion Card
// -----------------------------------------------------------------------------

function ScenarioCompletionCard({ completion }: { completion: ScenarioCompletion }) {
  const hasReflection = completion.reflectionLearned || completion.reflectionImprove
  
  return (
    <div className="bg-muted/30 rounded-lg p-3">
      <Row gap="md" align="start" className="justify-between">
        <Stack gap="xs" className="flex-1 min-w-0">
          <Row gap="sm" align="center">
            <Badge variant="outline" className="text-xs font-mono">
              {completion.scenarioId}
            </Badge>
            <Text size="xs" variant="muted">
              {completion.completedAt ? formatRelativeTime(completion.completedAt) : "Date unknown"}
            </Text>
          </Row>
          
          {hasReflection ? (
            <Stack gap="xs" className="mt-2">
              {completion.reflectionLearned && (
                <div className="border-l-2 border-success/50 pl-3">
                  <Text size="xs" variant="muted" className="mb-0.5">What I learned:</Text>
                  <Text size="sm" className="text-foreground/90">
                    {completion.reflectionLearned}
                  </Text>
                </div>
              )}
              {completion.reflectionImprove && (
                <div className="border-l-2 border-primary/50 pl-3">
                  <Text size="xs" variant="muted" className="mb-0.5">To improve:</Text>
                  <Text size="sm" className="text-foreground/90">
                    {completion.reflectionImprove}
                  </Text>
                </div>
              )}
            </Stack>
          ) : (
            <Text size="xs" variant="muted" className="italic">
              No reflection submitted
            </Text>
          )}
        </Stack>
      </Row>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Empty State Component
// -----------------------------------------------------------------------------

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <Stack gap="sm" align="center" className="py-8">
      <div className="text-muted-foreground/50">{icon}</div>
      <Text variant="muted">{message}</Text>
    </Stack>
  )
}
