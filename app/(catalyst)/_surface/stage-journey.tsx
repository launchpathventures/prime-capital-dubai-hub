/**
 * CATALYST - Stage Journey Component
 *
 * Visual timeline showing INT → POC → MVP → MMP → PROD with current position.
 * Each stage card opens a dialog with summary, steps, and docs link.
 */

"use client"

import { cn } from "@/lib/utils"
import { Text, Stack, Row } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Check, Loader2, Circle, ArrowRight, Settings, Lightbulb, Users, Rocket, Shield } from "lucide-react"
import Link from "next/link"
import type { ProjectStage } from "@/lib/project-state"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface StageInfo {
  id: ProjectStage
  label: string
  title: string
  description: string
  icon: React.ElementType
  summary: string
  steps: string[]
  docsPath: string
  linkText: string
}

interface StageJourneyProps {
  currentStage: ProjectStage
  className?: string
}

// -----------------------------------------------------------------------------
// Stage Data
// -----------------------------------------------------------------------------

const stages: StageInfo[] = [
  {
    id: "init",
    label: "INIT",
    title: "Initialisation",
    description: "Setup the project",
    icon: Settings,
    summary: "Get your project foundation in place. This stage ensures you have the right structure, tooling, and documentation before building features.",
    steps: [
      "Clone the Catalyst repo or run the init command",
      "Configure environment variables (.env.local)",
      "Define your project specs (vision, experience, brand, architecture)",
      "Set up your first brief to scope initial work",
      "Update project-state.md with your project details",
    ],
    docsPath: "/docs/workflow/init",
    linkText: "INIT setup guide",
  },
  {
    id: "poc",
    label: "POC",
    title: "Proof of Concept",
    description: "Validate the idea",
    icon: Lightbulb,
    summary: "Validate your core hypothesis with minimal effort. Build just enough to prove the idea works before investing more time.",
    steps: [
      "Identify the riskiest assumption to test",
      "Build the smallest thing that tests it",
      "Get feedback from real users or stakeholders",
      "Document learnings in your briefs",
      "Decide: pivot, proceed, or pause",
    ],
    docsPath: "/docs/workflow/poc",
    linkText: "POC workflow",
  },
  {
    id: "mvp",
    label: "MVP",
    title: "Minimum Viable Product",
    description: "Test with users",
    icon: Users,
    summary: "Build a complete product that real users can use. Focus on the core journey and essential features only.",
    steps: [
      "Define the core user journey end-to-end",
      "Build authentication and essential infrastructure",
      "Implement must-have features only",
      "Set up error handling and basic monitoring",
      "Deploy and onboard first real users",
    ],
    docsPath: "/docs/workflow/mvp",
    linkText: "MVP workflow",
  },
  {
    id: "mmp",
    label: "MMP",
    title: "Minimum Marketable Product",
    description: "Public launch",
    icon: Rocket,
    summary: "Polish and harden for public launch. Add the features needed for marketing, billing, and scale.",
    steps: [
      "Add billing and subscription management",
      "Implement onboarding and documentation",
      "Set up proper analytics and monitoring",
      "Performance optimization and load testing",
      "Prepare marketing and launch materials",
    ],
    docsPath: "/docs/workflow/mmp",
    linkText: "MMP workflow",
  },
  {
    id: "prod",
    label: "PROD",
    title: "Production",
    description: "Stability & scale",
    icon: Shield,
    summary: "Operate a stable, reliable product. Focus on uptime, security, and continuous improvement.",
    steps: [
      "Establish SLAs and uptime monitoring",
      "Implement security audits and compliance",
      "Set up incident response procedures",
      "Regular backups and disaster recovery",
      "Continuous improvement based on feedback",
    ],
    docsPath: "/docs/workflow/prod",
    linkText: "PROD workflow",
  },
]

const stageIndex: Record<ProjectStage, number> = {
  init: 0,
  poc: 1,
  mvp: 2,
  mmp: 3,
  prod: 4,
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function StageJourney({ currentStage, className }: StageJourneyProps) {
  const currentIndex = stageIndex[currentStage]

  // Pre-compute stage states
  const stageStates = stages.map((stage, i) => ({
    stage,
    isComplete: i < currentIndex,
    isCurrent: i === currentIndex,
    isFuture: i > currentIndex,
    isLast: i === stages.length - 1,
    isLineComplete: i < currentIndex,
    isLineInProgress: i === currentIndex,
  }))

  return (
    <div className={cn("stage-journey", className)}>
      {/* Desktop: Grid-based timeline */}
      <div className="hidden sm:block">
        <div 
          className="stage-journey__grid"
          style={{ "--stage-count": stages.length } as React.CSSProperties}
        >
          {/* Dots row */}
          {stageStates.map(({ stage, isComplete, isCurrent, isFuture, isLast, isLineComplete, isLineInProgress }) => (
            <div key={`dot-${stage.id}`} className="stage-journey__cell">
              <div
                className={cn(
                  "stage-journey__dot",
                  isComplete && "stage-journey__dot--complete",
                  isCurrent && "stage-journey__dot--current",
                  isFuture && "stage-journey__dot--future"
                )}
              >
                {isComplete && <Check className="h-3 w-3" />}
                {isCurrent && <Loader2 className="h-3 w-3" />}
                {isFuture && <Circle className="h-2.5 w-2.5" />}
              </div>
              {/* Line goes to the right of the dot (except last) */}
              {!isLast && (
                <div
                  className={cn(
                    "stage-journey__line",
                    isLineComplete && "stage-journey__line--complete",
                    isLineInProgress && "stage-journey__line--progress"
                  )}
                />
              )}
            </div>
          ))}

          {/* Labels row - clickable cards with dialogs */}
          {stageStates.map(({ stage, isComplete, isCurrent, isFuture }) => (
            <div key={`label-${stage.id}`} className="stage-journey__cell stage-journey__cell--label">
              <Dialog>
                <DialogTrigger
                  render={
                    <button
                      className={cn(
                        "stage-journey__label-card",
                        isCurrent && "stage-journey__label-card--current"
                      )}
                    />
                  }
                >
                  <Text
                    size="xs"
                    weight={isCurrent ? "semibold" : "medium"}
                    className={cn(
                      isComplete && "text-emerald-600 dark:text-emerald-400",
                      isCurrent && "text-primary",
                      isFuture && "text-muted-foreground"
                    )}
                  >
                    {stage.label}
                  </Text>
                  <Text
                    size="xs"
                    variant="muted"
                    className={cn(
                      "whitespace-nowrap",
                      isCurrent && "text-foreground/70"
                    )}
                  >
                    {stage.description}
                  </Text>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <Row gap="sm" align="center">
                      <div className={cn(
                        "p-2.5 rounded-lg",
                        isComplete && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                        isCurrent && "bg-primary/10 text-primary",
                        isFuture && "bg-muted text-muted-foreground"
                      )}>
                        <stage.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <Row gap="sm" align="center">
                          <DialogTitle className="text-lg">{stage.title}</DialogTitle>
                          <Badge variant="outline" className="text-xs border-border bg-muted/50 text-muted-foreground">
                            {stage.label}
                          </Badge>
                        </Row>
                        <DialogDescription className="text-xs">{stage.description}</DialogDescription>
                      </div>
                    </Row>
                  </DialogHeader>

                  <Stack gap="md" className="pt-2">
                    {/* Summary */}
                    <Text size="sm" variant="muted">
                      {stage.summary}
                    </Text>

                    {/* Steps */}
                    <div className="space-y-2">
                      <Text size="sm" weight="medium">Key steps:</Text>
                      <ul className="space-y-1.5">
                        {stage.steps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary mt-0.5">•</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Docs link */}
                    <Button 
                      className="w-full"
                      nativeButton={false}
                      render={<Link href={stage.docsPath} target="_blank" rel="noopener noreferrer" />}
                    >
                      <Row gap="sm" align="center">
                        <span>{stage.linkText}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Row>
                    </Button>
                  </Stack>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: Compact version */}
      <div className="sm:hidden">
        <div className="stage-journey__timeline stage-journey__timeline--mobile">
          {stages.map((stage, i) => {
            const isComplete = i < currentIndex
            const isCurrent = i === currentIndex
            const isFuture = i > currentIndex
            const isLast = i === stages.length - 1
            const isLineComplete = i < currentIndex
            const isLineInProgress = i === currentIndex

            return (
              <div key={stage.id} className="stage-journey__item">
                <div className="stage-journey__node-wrapper">
                  <div
                    className={cn(
                      "stage-journey__dot stage-journey__dot--sm",
                      isComplete && "stage-journey__dot--complete",
                      isCurrent && "stage-journey__dot--current",
                      isFuture && "stage-journey__dot--future"
                    )}
                  >
                    {isComplete && <Check className="h-2 w-2" />}
                    {isCurrent && <Loader2 className="h-2 w-2" />}
                    {isFuture && <Circle className="h-1.5 w-1.5" />}
                  </div>
                  <Text
                    size="xs"
                    weight={isCurrent ? "semibold" : "medium"}
                    title={stage.title}
                    className={cn(
                      "mt-1 cursor-help",
                      isComplete && "text-emerald-600 dark:text-emerald-400",
                      isCurrent && "text-primary",
                      isFuture && "text-muted-foreground"
                    )}
                  >
                    {stage.label}
                  </Text>
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "stage-journey__line",
                      isLineComplete && "stage-journey__line--complete",
                      isLineInProgress && "stage-journey__line--progress"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
