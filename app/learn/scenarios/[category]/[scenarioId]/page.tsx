/**
 * CATALYST - Scenario Detail Page
 *
 * Dedicated page for viewing and practicing a single scenario.
 * Provides breathing room for the full scenario content and AI practice.
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ChevronLeftIcon,
  StarIcon,
  UserIcon,
  TargetIcon,
  AlertCircleIcon,
  XCircleIcon,
  LightbulbIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getUserRole, getUserForMenu } from "@/lib/auth/require-auth"
import { LearnShell } from "../../../_surface/learn-shell"
import { ScenarioDetailClient } from "./_components/scenario-detail-client"
import { getScenarioProgress } from "@/lib/actions/scenario-actions"

// =============================================================================
// Types
// =============================================================================

interface ScenarioCategory {
  slug: string
  title: string
  description: string | null
  content: string
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
  params: Promise<{ category: string; scenarioId: string }>
}

// =============================================================================
// Data Fetching
// =============================================================================

async function getScenarioCategory(slug: string): Promise<ScenarioCategory | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("scenarios")
    .select("slug, title, description, content")
    .eq("slug", slug)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

// =============================================================================
// Scenario Parser
// =============================================================================

function parseScenario(content: string, scenarioId: string): ParsedScenario | null {
  // Find all scenarios and locate the one we want
  const scenarioPattern = /^## ([A-Z]{2,3}-\d{2}): (.+?)(⭐+)?\s*$/gm
  const matches = [...content.matchAll(scenarioPattern)]
  
  // Find the matching scenario
  const matchIndex = matches.findIndex(m => m[1] === scenarioId)
  if (matchIndex === -1) return null
  
  const match = matches[matchIndex]
  const nextMatch = matches[matchIndex + 1]
  
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

  return {
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
  }
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
// Helpers
// =============================================================================

function formatPersona(text: string): Array<{ label: string; value: string }> {
  const lines = text.split("\n").filter((line) => line.trim())
  const items: Array<{ label: string; value: string }> = []

  for (const line of lines) {
    const match = line.match(/^\*\*(.+?):\*\*\s*(.+)$/)
    if (match) {
      items.push({ label: match[1], value: match[2] })
    }
  }

  return items
}

function formatList(text: string): string[] {
  const lines = text.split("\n").filter((line) => line.trim())
  return lines.map((line) =>
    line.replace(/^[-•]\s*/, "").replace(/^\d+\.\s*/, "").trim()
  ).filter(Boolean)
}

// =============================================================================
// Page Component
// =============================================================================

export default async function ScenarioDetailPage({ params }: PageProps) {
  const { category: categorySlug, scenarioId } = await params
  const [category, userRole, userMenu] = await Promise.all([
    getScenarioCategory(categorySlug),
    getUserRole(),
    getUserForMenu(),
  ])

  if (!category) {
    notFound()
  }

  const scenario = parseScenario(category.content, scenarioId)

  if (!scenario) {
    notFound()
  }

  // Get user's progress for this scenario
  const progress = await getScenarioProgress(categorySlug)
  const scenarioProgress = progress.find((p) => p.scenarioId === scenarioId)
  const isCompleted = !!scenarioProgress

  const personaItems = formatPersona(scenario.persona)
  const challengesList = formatList(scenario.challenges)
  const mistakesList = formatList(scenario.mistakes)
  const approachList = formatList(scenario.approach)

  // Get persona name for display
  const personaName = personaItems.find(p => p.label === "Name")?.value || "The Client"

  return (
    <LearnShell activeSection="scenarios" userRole={userRole} user={userMenu ?? undefined}>
      <div className="learn-content scenario-detail">
        {/* Back Link */}
        <Link href={`/learn/scenarios/${categorySlug}`} className="scenario-back">
          <ChevronLeftIcon className="h-4 w-4" />
          {category.title}
        </Link>

        {/* ================================================================
            HEADER - Title & Meta
            ================================================================ */}
        <header className="scenario-detail__header">
          <div className="scenario-detail__meta">
            <span className="scenario-detail__id">{scenario.id}</span>
            <span className="scenario-detail__difficulty">
              {Array.from({ length: scenario.difficulty }).map((_, i) => (
                <StarIcon key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </span>
            {isCompleted && (
              <span className="scenario-detail__completed-badge">Completed</span>
            )}
          </div>
          <h1 className="scenario-detail__title">{scenario.title}</h1>
        </header>

        {/* ================================================================
            SECTION 1: THE SCENARIO
            Primary narrative - what situation are you walking into?
            ================================================================ */}
        <section className="scenario-detail__scenario">
          <div className="scenario-detail__scenario-label">The Scenario</div>
          <p className="scenario-detail__scenario-text">{scenario.situation}</p>
        </section>

        {/* ================================================================
            SECTION 2: YOUR CLIENT + YOUR OBJECTIVE
            Side by side - who you're talking to & what you need to achieve
            ================================================================ */}
        <div className="scenario-detail__briefing">
          {/* Client Persona */}
          {personaItems.length > 0 && (
            <section className="scenario-detail__client">
              <div className="scenario-detail__client-header">
                <UserIcon className="h-5 w-5" />
                <div>
                  <span className="scenario-detail__client-label">Your Client</span>
                  <span className="scenario-detail__client-name">{personaName}</span>
                </div>
              </div>
              <dl className="scenario-detail__client-details">
                {personaItems.filter(p => p.label !== "Name").map((item, idx) => (
                  <div key={idx} className="scenario-detail__client-item">
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* Objective */}
          <section className="scenario-detail__objective">
            <div className="scenario-detail__objective-header">
              <TargetIcon className="h-5 w-5" />
              <span>Your Objective</span>
            </div>
            <p className="scenario-detail__objective-text">{scenario.objective}</p>
          </section>
        </div>

        {/* ================================================================
            SECTION 3: PREPARATION GUIDE
            Reference material - collapsible for advanced users
            ================================================================ */}
        <details className="scenario-detail__prep" open>
          <summary className="scenario-detail__prep-trigger">
            <LightbulbIcon className="h-4 w-4" />
            <span>Preparation Guide</span>
            <span className="scenario-detail__prep-hint">Tips for success</span>
          </summary>
          
          <div className="scenario-detail__prep-content">
            {/* Key Challenges */}
            {challengesList.length > 0 && (
              <div className="scenario-detail__prep-section scenario-detail__prep-section--challenges">
                <h3>
                  <AlertCircleIcon className="h-4 w-4" />
                  Key Challenges
                </h3>
                <ul>
                  {challengesList.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Common Mistakes */}
            {mistakesList.length > 0 && (
              <div className="scenario-detail__prep-section scenario-detail__prep-section--mistakes">
                <h3>
                  <XCircleIcon className="h-4 w-4" />
                  Common Mistakes
                </h3>
                <ul>
                  {mistakesList.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Model Approach */}
            {approachList.length > 0 && (
              <div className="scenario-detail__prep-section scenario-detail__prep-section--approach">
                <h3>
                  <LightbulbIcon className="h-4 w-4" />
                  Model Approach
                </h3>
                <ul>
                  {approachList.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </details>

        {/* ================================================================
            SECTION 4: PRACTICE
            Primary action - start practicing
            ================================================================ */}
        <ScenarioDetailClient
          scenario={scenario}
          category={categorySlug}
          isCompleted={isCompleted}
          existingReflection={
            scenarioProgress
              ? {
                  learned: scenarioProgress.reflectionLearned,
                  improve: scenarioProgress.reflectionImprove,
                }
              : undefined
          }
        />
      </div>
    </LearnShell>
  )
}
