"use client"

/**
 * CATALYST - Scenario Accordion
 * 
 * Interactive accordion for displaying scenarios with copy-able AI prompts
 * and reflection-based completion tracking.
 */

import { useState } from "react"
import { 
  ChevronDownIcon,
  StarIcon,
  CopyIcon,
  CheckIcon,
  UserIcon,
  TargetIcon,
  AlertCircleIcon,
  XCircleIcon,
  LightbulbIcon,
  SparklesIcon,
  CheckCircle2Icon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScenarioReflection } from "./scenario-reflection"

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

interface ProgressData {
  learned: string
  improve: string
}

interface ScenarioAccordionProps {
  scenarios: ParsedScenario[]
  category: string
  completedIds?: Set<string>
  progressMap?: Record<string, ProgressData>
}

// =============================================================================
// Component
// =============================================================================

export function ScenarioAccordion({ 
  scenarios, 
  category,
  completedIds = new Set(),
  progressMap = {}
}: ScenarioAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="scenario-accordion">
      {scenarios.map((scenario) => (
        <ScenarioItem
          key={scenario.id}
          scenario={scenario}
          category={category}
          isOpen={openId === scenario.id}
          onToggle={() => setOpenId(openId === scenario.id ? null : scenario.id)}
          isCompleted={completedIds.has(scenario.id)}
          progress={progressMap[scenario.id]}
        />
      ))}
    </div>
  )
}

// =============================================================================
// Scenario Item
// =============================================================================

interface ScenarioItemProps {
  scenario: ParsedScenario
  category: string
  isOpen: boolean
  onToggle: () => void
  isCompleted: boolean
  progress?: ProgressData
}

function ScenarioItem({ 
  scenario, 
  category,
  isOpen, 
  onToggle,
  isCompleted,
  progress
}: ScenarioItemProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(scenario.aiPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className={`scenario-item ${isOpen ? "scenario-item--open" : ""} ${isCompleted ? "scenario-item--completed" : ""}`}>
      {/* Header - Always visible */}
      <button
        className="scenario-item__header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="scenario-item__header-left">
          {isCompleted ? (
            <span className="scenario-item__completed-badge">
              <CheckCircle2Icon className="h-4 w-4" />
            </span>
          ) : (
            <span className="scenario-item__id">{scenario.id}</span>
          )}
          <span className="scenario-item__title">{scenario.title}</span>
          <span className="scenario-item__difficulty">
            {Array.from({ length: scenario.difficulty }).map((_, i) => (
              <StarIcon key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
            ))}
          </span>
        </div>
        <ChevronDownIcon 
          className={`scenario-item__chevron h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Content - Expandable */}
      {isOpen && (
        <div className="scenario-item__content">
          {/* Situation */}
          <div className="scenario-section">
            <h4 className="scenario-section__title">Situation</h4>
            <p className="scenario-section__text">{scenario.situation}</p>
          </div>

          {/* Client Persona */}
          {scenario.persona && (
            <div className="scenario-section scenario-section--persona">
              <h4 className="scenario-section__title">
                <UserIcon className="h-4 w-4" />
                Client Persona
              </h4>
              <div className="scenario-section__text scenario-section__persona">
                {formatPersona(scenario.persona)}
              </div>
            </div>
          )}

          {/* Objective */}
          <div className="scenario-section">
            <h4 className="scenario-section__title">
              <TargetIcon className="h-4 w-4" />
              Your Objective
            </h4>
            <p className="scenario-section__text">{scenario.objective}</p>
          </div>

          {/* Two column layout for challenges and mistakes */}
          <div className="scenario-grid">
            {/* Key Challenges */}
            <div className="scenario-section scenario-section--challenges">
              <h4 className="scenario-section__title">
                <AlertCircleIcon className="h-4 w-4" />
                Key Challenges
              </h4>
              <div className="scenario-section__text">
                {formatList(scenario.challenges)}
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="scenario-section scenario-section--mistakes">
              <h4 className="scenario-section__title">
                <XCircleIcon className="h-4 w-4" />
                Common Mistakes
              </h4>
              <div className="scenario-section__text">
                {formatList(scenario.mistakes)}
              </div>
            </div>
          </div>

          {/* Model Approach */}
          <div className="scenario-section scenario-section--approach">
            <h4 className="scenario-section__title">
              <LightbulbIcon className="h-4 w-4" />
              Model Approach
            </h4>
            <div className="scenario-section__text">
              {formatList(scenario.approach)}
            </div>
          </div>

          {/* AI Prompt */}
          {scenario.aiPrompt && (
            <div className="scenario-section scenario-section--prompt">
              <div className="scenario-prompt__header">
                <h4 className="scenario-section__title">
                  <SparklesIcon className="h-4 w-4" />
                  AI Practice Prompt
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="scenario-prompt__copy"
                >
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
              <p className="scenario-prompt__instruction">
                Copy this prompt and paste it into ChatGPT, Claude, or any AI assistant to practice this scenario.
              </p>
              <pre className="scenario-prompt__code">
                <code>{scenario.aiPrompt}</code>
              </pre>
            </div>
          )}

          {/* Reflection Form */}
          <ScenarioReflection
            category={category}
            scenarioId={scenario.id}
            scenarioTitle={scenario.title}
            isCompleted={isCompleted}
            existingReflection={progress}
          />
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Helpers
// =============================================================================

function formatPersona(text: string): React.ReactNode {
  // Parse persona format with **Name:** patterns
  const lines = text.split("\n").filter(line => line.trim())
  
  return (
    <dl className="scenario-persona-list">
      {lines.map((line, idx) => {
        const match = line.match(/^\*\*(.+?):\*\*\s*(.+)$/)
        if (match) {
          return (
            <div key={idx} className="scenario-persona-item">
              <dt>{match[1]}</dt>
              <dd>{match[2]}</dd>
            </div>
          )
        }
        return <p key={idx}>{line}</p>
      })}
    </dl>
  )
}

function formatList(text: string): React.ReactNode {
  const lines = text.split("\n").filter(line => line.trim())
  
  // Check if it's a numbered or bulleted list
  const isList = lines.some(line => /^[-•\d]/.test(line.trim()))
  
  if (!isList) {
    return <p>{text}</p>
  }
  
  return (
    <ul className="scenario-list-items">
      {lines.map((line, idx) => {
        // Remove leading bullets, dashes, or numbers
        const cleanLine = line.replace(/^[-•]\s*/, "").replace(/^\d+\.\s*/, "").trim()
        if (cleanLine) {
          return <li key={idx}>{cleanLine}</li>
        }
        return null
      })}
    </ul>
  )
}
