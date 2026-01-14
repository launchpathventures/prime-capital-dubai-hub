/**
 * CATALYST - Scenario Category Page
 * 
 * Displays all scenarios within a category with expandable details.
 * Includes AI prompts that can be copied for practice.
 * Uses LearnShell for consistent sidebar navigation.
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { 
  ChevronLeftIcon,
  StarIcon,
  ClockIcon,
  TargetIcon,
  MessageSquareIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { LearnShell } from "../../_surface/learn-shell"
import { ScenarioAccordion } from "./_components/scenario-accordion"
import { getScenarioProgress } from "@/lib/actions/scenario-actions"

// =============================================================================
// Types
// =============================================================================

interface ScenarioCategory {
  slug: string
  title: string
  description: string | null
  competencies: string[] | null
  scenario_count: number | null
  estimated_duration: string | null
  content: string
  frontmatter: Record<string, unknown> | null
}

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

interface PageProps {
  params: Promise<{ category: string }>
}

// =============================================================================
// Data Fetching
// =============================================================================

async function getScenarioCategory(slug: string): Promise<ScenarioCategory | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("scenarios")
    .select("*")
    .eq("slug", slug)
    .single()
  
  if (error || !data) {
    console.error("Failed to fetch scenario category:", error)
    return null
  }
  
  return data
}

// =============================================================================
// Scenario Parser
// =============================================================================

function parseScenarios(content: string): ParsedScenario[] {
  const scenarios: ParsedScenario[] = []
  
  // Split by scenario headers (## XX-##: Title)
  const scenarioPattern = /^## ([A-Z]{2,3}-\d{2}): (.+?)(⭐+)?\s*$/gm
  const matches = [...content.matchAll(scenarioPattern)]
  
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const nextMatch = matches[i + 1]
    
    const id = match[1]
    const title = match[2].trim()
    const stars = match[3] || "⭐"
    const difficulty = stars.length
    
    // Extract content between this scenario and the next
    const startIndex = match.index! + match[0].length
    const endIndex = nextMatch ? nextMatch.index! : content.length
    const scenarioContent = content.slice(startIndex, endIndex)
    
    // Parse sections
    const situation = extractSection(scenarioContent, "Situation")
    const persona = extractSection(scenarioContent, "Client Persona")
    const objective = extractSection(scenarioContent, "Consultant Objective")
    const challenges = extractSection(scenarioContent, "Key Challenges")
    const mistakes = extractSection(scenarioContent, "Common Mistakes")
    const approach = extractSection(scenarioContent, "Model Approach")
    const aiPrompt = extractCodeBlock(scenarioContent)
    
    if (id && title) {
      scenarios.push({
        id,
        title,
        difficulty,
        situation,
        persona,
        objective,
        challenges,
        mistakes,
        approach,
        aiPrompt,
      })
    }
  }
  
  return scenarios
}

function extractSection(content: string, sectionName: string): string {
  const pattern = new RegExp(`### ${sectionName}\\s*\\n([\\s\\S]*?)(?=###|$)`, "i")
  const match = content.match(pattern)
  return match ? match[1].trim() : ""
}

function extractCodeBlock(content: string): string {
  const pattern = /```[\s\S]*?\n([\s\S]*?)```/
  const match = content.match(pattern)
  return match ? match[1].trim() : ""
}

// =============================================================================
// Competency Labels
// =============================================================================

const competencyLabels: Record<string, string> = {
  "client-discovery": "Client Discovery",
  "market-intelligence": "Market Intelligence",
  "property-matching": "Property Matching",
  "transaction-management": "Transaction Management",
  "objection-navigation": "Objection Navigation",
  "relationship-stewardship": "Relationship Stewardship",
}

// =============================================================================
// Page Component
// =============================================================================

export default async function ScenarioCategoryPage({ params }: PageProps) {
  const { category: slug } = await params
  const category = await getScenarioCategory(slug)
  
  if (!category) {
    notFound()
  }
  
  const scenarios = parseScenarios(category.content)
  const objectives = (category.frontmatter?.objectives as string[]) || []
  
  // Get user's progress for this category
  const progress = await getScenarioProgress(slug)
  const completedIds = new Set(progress.map(p => p.scenarioId))
  const progressMap = Object.fromEntries(
    progress.map(p => [p.scenarioId, { learned: p.reflectionLearned, improve: p.reflectionImprove }])
  )
  
  const completedCount = completedIds.size
  const totalCount = scenarios.length

  return (
    <LearnShell activeSection="scenarios">
      <div className="learn-content">
        {/* Back Link */}
        <Link href="/learn/scenarios" className="scenario-back">
          <ChevronLeftIcon className="h-4 w-4" />
          All Scenarios
        </Link>

        {/* Category Header */}
        <header className="scenario-category-header">
          <h1 className="scenario-category-header__title">{category.title}</h1>
          <p className="scenario-category-header__description">
            {category.description}
          </p>
          <div className="scenario-category-header__meta">
            <span className="scenario-category-header__stat">
              <MessageSquareIcon className="h-4 w-4" />
              {completedCount}/{totalCount} completed
            </span>
            {category.estimated_duration && (
              <span className="scenario-category-header__stat">
                <ClockIcon className="h-4 w-4" />
                {category.estimated_duration}
              </span>
            )}
          </div>
          {category.competencies && category.competencies.length > 0 && (
            <div className="scenario-category-header__competencies">
              {category.competencies.map((comp) => (
                <Link 
                  key={comp} 
                  href={`/learn/${comp}`}
                  className="scenario-category-header__competency"
                >
                  {competencyLabels[comp] || comp}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Learning Objectives */}
        {objectives.length > 0 && (
          <section className="scenario-objectives">
            <h2 className="scenario-objectives__title">
              <TargetIcon className="h-4 w-4" />
              What You'll Practice
            </h2>
            <ul className="scenario-objectives__list">
              {objectives.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Difficulty Legend */}
        <div className="scenario-legend">
          <span className="scenario-legend__item">
            <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            Foundation
          </span>
          <span className="scenario-legend__item">
            <span className="flex">
              <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            </span>
            Intermediate
          </span>
          <span className="scenario-legend__item">
            <span className="flex">
              <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            </span>
            Advanced
          </span>
        </div>

        {/* Scenario List */}
        <section className="scenario-list">
          <ScenarioAccordion 
            scenarios={scenarios} 
            category={slug}
            completedIds={completedIds}
            progressMap={progressMap}
          />
        </section>
      </div>
    </LearnShell>
  )
}
