"use client"

/**
 * CATALYST - Scenario Reflection Form
 * 
 * Form for submitting learning reflections to complete scenarios.
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircleIcon, PencilIcon, Loader2Icon } from "lucide-react"
import { completeScenario } from "@/lib/actions/scenario-actions"

interface ScenarioReflectionProps {
  category: string
  scenarioId: string
  isCompleted?: boolean
  existingReflection?: {
    learned: string
    improve: string
  }
  onComplete?: () => void
}

export function ScenarioReflection({
  category,
  scenarioId,
  isCompleted = false,
  existingReflection,
  onComplete,
}: ScenarioReflectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [learned, setLearned] = useState(existingReflection?.learned || "")
  const [improve, setImprove] = useState(existingReflection?.improve || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const result = await completeScenario(category, scenarioId, {
      learned,
      improve,
    })

    setIsSubmitting(false)

    if (result.success) {
      setIsOpen(false)
      onComplete?.()
    } else {
      setError(result.error || "Failed to save reflection")
    }
  }

  if (isCompleted && !isOpen) {
    return (
      <div className="scenario-reflection scenario-reflection--completed">
        <div className="scenario-reflection__status">
          <CheckCircleIcon className="h-4 w-4" />
          <span>Completed</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="scenario-reflection__edit"
        >
          <PencilIcon className="h-3 w-3" />
          View/Edit Reflection
        </Button>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="scenario-reflection__trigger"
      >
        <CheckCircleIcon className="h-4 w-4" />
        Mark as Complete
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="scenario-reflection__form">
      <div className="scenario-reflection__header">
        <h4>Complete This Scenario</h4>
        <p>Reflect on your practice to mark this scenario complete.</p>
      </div>

      <div className="scenario-reflection__field">
        <label htmlFor={`learned-${scenarioId}`}>
          What did you learn from this scenario?
        </label>
        <textarea
          id={`learned-${scenarioId}`}
          value={learned}
          onChange={(e) => setLearned(e.target.value)}
          placeholder="Key insights, techniques, or approaches you discovered..."
          rows={3}
          required
          minLength={20}
        />
      </div>

      <div className="scenario-reflection__field">
        <label htmlFor={`improve-${scenarioId}`}>
          What would you do differently next time?
        </label>
        <textarea
          id={`improve-${scenarioId}`}
          value={improve}
          onChange={(e) => setImprove(e.target.value)}
          placeholder="Areas for improvement, alternative approaches to try..."
          rows={3}
          required
          minLength={20}
        />
      </div>

      {error && (
        <div className="scenario-reflection__error">
          {error}
        </div>
      )}

      <div className="scenario-reflection__actions">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircleIcon className="h-4 w-4" />
              Complete Scenario
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
