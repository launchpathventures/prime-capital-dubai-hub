"use client"

/**
 * CATALYST - Scenario Detail Client Component
 *
 * Handles the interactive practice and reflection sections.
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  SparklesIcon,
  CopyIcon,
  CheckIcon,
  CheckCircle2Icon,
  PencilIcon,
} from "lucide-react"
import { ScenarioPractice } from "../../_components/scenario-practice"
import { completeScenario } from "@/lib/actions/scenario-actions"

// =============================================================================
// Types
// =============================================================================

interface ParsedScenario {
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

interface ScenarioDetailClientProps {
  scenario: ParsedScenario
  category: string
  isCompleted: boolean
  existingReflection?: {
    learned: string
    improve: string
  }
}

// =============================================================================
// Component
// =============================================================================

export function ScenarioDetailClient({
  scenario,
  category,
  isCompleted: initialCompleted,
  existingReflection,
}: ScenarioDetailClientProps) {
  const [isPracticing, setIsPracticing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(initialCompleted)
  const [copied, setCopied] = useState(false)
  const [showReflection, setShowReflection] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scenario.aiPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleStartPractice = () => {
    setIsPracticing(true)
  }

  const handlePracticeComplete = async (passed: boolean) => {
    if (passed) {
      await completeScenario(category, scenario.id, {
        learned:
          "Completed AI roleplay practice with passing evaluation. Key skills demonstrated in handling client concerns.",
        improve:
          "Continue practicing variations of this scenario to build confidence.",
      })
      setIsCompleted(true)
    }
    setIsPracticing(false)
  }

  const handlePracticeCancel = () => {
    setIsPracticing(false)
  }

  // Practice view
  if (isPracticing) {
    return (
      <section className="scenario-detail__practice scenario-detail__practice--active">
        <ScenarioPractice
          scenario={scenario}
          category={category}
          onComplete={handlePracticeComplete}
          onCancel={handlePracticeCancel}
        />
      </section>
    )
  }

  return (
    <section className="scenario-detail__practice">
      {/* Completion Status */}
      {isCompleted && (
        <div className="scenario-detail__completed">
          <div className="scenario-detail__completed-content">
            <CheckCircle2Icon className="h-5 w-5" />
            <div>
              <strong>Scenario Completed</strong>
              {existingReflection && !showReflection && (
                <button
                  onClick={() => setShowReflection(true)}
                  className="scenario-detail__view-reflection"
                >
                  <PencilIcon className="h-3 w-3" />
                  View Reflection
                </button>
              )}
            </div>
          </div>
          {showReflection && existingReflection && (
            <div className="scenario-detail__reflection-display">
              <div className="scenario-detail__reflection-item">
                <span className="scenario-detail__reflection-label">What I learned:</span>
                <p>{existingReflection.learned}</p>
              </div>
              <div className="scenario-detail__reflection-item">
                <span className="scenario-detail__reflection-label">What I&apos;d do differently:</span>
                <p>{existingReflection.improve}</p>
              </div>
              <button
                onClick={() => setShowReflection(false)}
                className="scenario-detail__hide-reflection"
              >
                Hide
              </button>
            </div>
          )}
        </div>
      )}

      {/* Practice CTA */}
      <div className="scenario-detail__practice-cta">
        <div className="scenario-detail__practice-cta-content">
          <h2 className="scenario-detail__practice-cta-title">
            <SparklesIcon className="h-5 w-5" />
            Ready to Practice?
          </h2>
          <p className="scenario-detail__practice-cta-description">
            Start an AI roleplay session where you&apos;ll respond as the consultant.
            The AI will play the client and evaluate your approach at the end.
          </p>
        </div>
        <Button size="lg" onClick={handleStartPractice} className="scenario-detail__practice-btn">
          <SparklesIcon className="h-4 w-4 mr-2" />
          Start AI Practice
        </Button>
      </div>

      {/* Fallback: Copy prompt */}
      <details className="scenario-detail__prompt-fallback">
        <summary>Or copy prompt for external AI (ChatGPT, Claude, etc.)</summary>
        <div className="scenario-detail__prompt-content">
          <pre className="scenario-detail__prompt-code">
            <code>{scenario.aiPrompt}</code>
          </pre>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <CheckIcon className="h-3.5 w-3.5 mr-1.5" />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon className="h-3.5 w-3.5 mr-1.5" />
                Copy Prompt
              </>
            )}
          </Button>
        </div>
      </details>
    </section>
  )
}
