"use client"

/**
 * CATALYST - Scenario Card List
 *
 * Displays scenarios as clickable cards that navigate to detail pages.
 * Replaces the accordion-based list.
 */

import Link from "next/link"
import {
  StarIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
} from "lucide-react"

// =============================================================================
// Types
// =============================================================================

export interface ParsedScenario {
  id: string
  title: string
  difficulty: number
  situation: string
  persona: string
  objective: string
  challenges: string
  mistakes: string
  approach: string
  aiPrompt: string
}

interface ScenarioCardListProps {
  scenarios: ParsedScenario[]
  category: string
  completedIds?: Set<string>
}

// =============================================================================
// Component
// =============================================================================

export function ScenarioCardList({
  scenarios,
  category,
  completedIds = new Set(),
}: ScenarioCardListProps) {
  return (
    <div className="scenario-card-list">
      {scenarios.map((scenario) => (
        <ScenarioCard
          key={scenario.id}
          scenario={scenario}
          category={category}
          isCompleted={completedIds.has(scenario.id)}
        />
      ))}
    </div>
  )
}

// =============================================================================
// Scenario Card
// =============================================================================

interface ScenarioCardProps {
  scenario: ParsedScenario
  category: string
  isCompleted: boolean
}

function ScenarioCard({ scenario, category, isCompleted }: ScenarioCardProps) {
  // Get first sentence of situation for preview
  const situationPreview = scenario.situation.split(".")[0] + "."

  return (
    <Link
      href={`/learn/scenarios/${category}/${scenario.id}`}
      className={`scenario-card-item ${isCompleted ? "scenario-card-item--completed" : ""}`}
    >
      <div className="scenario-card-item__header">
        <div className="scenario-card-item__left">
          {isCompleted ? (
            <span className="scenario-card-item__completed-badge">
              <CheckCircle2Icon className="h-4 w-4" />
            </span>
          ) : (
            <span className="scenario-card-item__id">{scenario.id}</span>
          )}
          <span className="scenario-card-item__difficulty">
            {Array.from({ length: scenario.difficulty }).map((_, i) => (
              <StarIcon key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
            ))}
          </span>
        </div>
        <ChevronRightIcon className="scenario-card-item__arrow h-4 w-4" />
      </div>

      <h3 className="scenario-card-item__title">{scenario.title}</h3>
      <p className="scenario-card-item__preview">{situationPreview}</p>
    </Link>
  )
}
