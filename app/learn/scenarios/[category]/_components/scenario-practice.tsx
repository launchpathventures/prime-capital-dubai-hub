"use client"

/**
 * CATALYST - Scenario Practice Chat
 *
 * Inline AI roleplay practice within scenario accordion.
 * User practices as consultant, AI plays the client persona.
 * Supports voice input with Deepgram transcription for natural practice.
 */

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  SparklesIcon,
  XIcon,
  Loader2Icon,
  HelpCircleIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  RotateCcwIcon,
  ArrowRightIcon,
  MicIcon,
} from "lucide-react"
import { VoiceInput } from "@/components/lms/voice-input"
import type { ParsedScenario } from "./scenario-accordion"

// =============================================================================
// Types
// =============================================================================

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface EvaluationResult {
  passed: boolean
  objectivesMet: string[]
  objectivesMissed: string[]
  overallFeedback: string
  strengths: string[]
  improvements: string[]
}

interface ScenarioPracticeProps {
  scenario: ParsedScenario
  category: string
  onComplete: (passed: boolean) => void
  onCancel: () => void
}

// =============================================================================
// Component
// =============================================================================

export function ScenarioPractice({
  scenario,
  category,
  onComplete,
  onCancel,
}: ScenarioPracticeProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)
  const [isStarting, setIsStarting] = useState(true)
  const [sessionKey, setSessionKey] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Build scenario context for API
  const buildScenarioContext = useCallback(() => {
    return {
      id: scenario.id,
      category,
      title: scenario.title,
      situation: scenario.situation,
      persona: scenario.persona,
      objective: scenario.objective,
      challenges: scenario.challenges,
      approach: scenario.approach,
      aiPrompt: scenario.aiPrompt, // The detailed AI simulation prompt
    }
  }, [scenario, category])

  // Start conversation with AI opening
  useEffect(() => {
    const startConversation = async () => {
      setIsLoading(true)

      try {
        const scenarioContext = buildScenarioContext()
        
        // Log what we're sending for debugging
        console.log("Starting roleplay with scenario:", scenarioContext.title)

        const response = await fetch("/api/coach/roleplay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [],
            scenario: scenarioContext,
            mode: "roleplay",
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Roleplay start failed:", response.status, errorText)
          throw new Error(errorText || `Failed to start (${response.status})`)
        }

        if (!response.body) {
          throw new Error("No response body received")
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "",
        }
        setMessages([assistantMessage])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          setMessages((prev) => {
            const updated = [...prev]
            updated[0] = { ...updated[0], content: updated[0].content + chunk }
            return updated
          })
        }
      } catch (error) {
        console.error("Failed to start practice:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        setMessages([
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: errorMessage.includes("503") || errorMessage.includes("not configured")
              ? "AI service is not configured. Please contact support."
              : errorMessage.includes("401") || errorMessage.includes("Unauthorized")
              ? "Please log in to use AI practice."
              : `Unable to start practice: ${errorMessage}. Please try again.`,
          },
        ])
      } finally {
        setIsLoading(false)
        setIsStarting(false)
      }
    }

    startConversation()
  }, [buildScenarioContext, sessionKey])

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
      }

      const newMessages = [...messages, userMessage]
      setMessages(newMessages)
      setIsLoading(true)

      try {
        const response = await fetch("/api/coach/roleplay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
            scenario: buildScenarioContext(),
            mode: "roleplay",
          }),
        })

        if (!response.ok) throw new Error("Failed to send")

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "",
        }
        setMessages((prev) => [...prev, assistantMessage])

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value, { stream: true })
            setMessages((prev) => {
              const updated = [...prev]
              const lastIndex = updated.length - 1
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: updated[lastIndex].content + chunk,
              }
              return updated
            })
          }
        }
      } catch (error) {
        console.error("Failed to send message:", error)
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [messages, buildScenarioContext]
  )

  const requestCoaching = () => {
    sendMessage("How am I doing? Can I get some feedback on my approach so far?")
  }

  const endPractice = async () => {
    // Filter out any coaching exchanges for cleaner evaluation
    const practiceMessages = messages.filter(
      (m) =>
        !m.content.includes("Stepping out of character") &&
        !m.content.includes("How am I doing?")
    )

    if (practiceMessages.length < 4) {
      setEvaluation({
        passed: false,
        objectivesMet: [],
        objectivesMissed: ["Conversation too short to evaluate"],
        overallFeedback:
          "Please have a longer conversation (at least 2-3 exchanges) before ending the practice session.",
        strengths: [],
        improvements: ["Continue the conversation to demonstrate your approach"],
      })
      return
    }

    setIsEvaluating(true)

    try {
      const response = await fetch("/api/coach/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: practiceMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          scenario: buildScenarioContext(),
          mode: "evaluate",
        }),
      })

      if (!response.ok) throw new Error("Evaluation failed")

      const result: EvaluationResult = await response.json()
      setEvaluation(result)
    } catch (error) {
      console.error("Evaluation error:", error)
      setEvaluation({
        passed: false,
        objectivesMet: [],
        objectivesMissed: ["Evaluation failed"],
        overallFeedback: "We couldn't evaluate your session. Please try again.",
        strengths: [],
        improvements: [],
      })
    } finally {
      setIsEvaluating(false)
    }
  }

  const restart = () => {
    setMessages([])
    setEvaluation(null)
    setIsStarting(true)
    setSessionKey((k) => k + 1)
  }

  const handleComplete = () => {
    onComplete(evaluation?.passed ?? false)
  }

  // ---------------------------------------------------------------------------
  // Evaluation Results View
  // ---------------------------------------------------------------------------

  if (evaluation) {
    return (
      <div className="scenario-practice__evaluation">
        <div
          className={`scenario-practice__evaluation-header ${
            evaluation.passed
              ? "scenario-practice__evaluation-header--passed"
              : "scenario-practice__evaluation-header--failed"
          }`}
        >
          {evaluation.passed ? (
            <>
              <CheckCircle2Icon className="h-8 w-8" />
              <h3>Great Job!</h3>
              <p>You successfully addressed the client&apos;s concerns.</p>
            </>
          ) : (
            <>
              <AlertCircleIcon className="h-8 w-8" />
              <h3>Keep Practicing</h3>
              <p>You&apos;re on the right track. Review the feedback below.</p>
            </>
          )}
        </div>

        <div className="scenario-practice__evaluation-body">
          <p className="scenario-practice__feedback">{evaluation.overallFeedback}</p>

          {evaluation.strengths.length > 0 && (
            <div className="scenario-practice__section">
              <h4>What You Did Well</h4>
              <ul>
                {evaluation.strengths.map((item, idx) => (
                  <li key={idx}>
                    <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {evaluation.improvements.length > 0 && (
            <div className="scenario-practice__section">
              <h4>Areas to Improve</h4>
              <ul>
                {evaluation.improvements.map((item, idx) => (
                  <li key={idx}>
                    <ArrowRightIcon className="h-4 w-4 text-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="scenario-practice__evaluation-actions">
          <Button variant="outline" onClick={restart}>
            <RotateCcwIcon className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          {evaluation.passed ? (
            <Button onClick={handleComplete}>
              <CheckCircle2Icon className="h-4 w-4 mr-2" />
              Complete Scenario
            </Button>
          ) : (
            <Button variant="ghost" onClick={onCancel}>
              Exit Practice
            </Button>
          )}
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Practice Chat View
  // ---------------------------------------------------------------------------

  return (
    <div className="scenario-practice">
      {/* Header */}
      <div className="scenario-practice__header">
        <div className="scenario-practice__header-left">
          <SparklesIcon className="h-4 w-4 text-primary" />
          <span>AI Practice Session</span>
        </div>
        <div className="scenario-practice__header-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={requestCoaching}
            disabled={isLoading || isStarting}
            title="Get feedback on your approach"
          >
            <HelpCircleIcon className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:ml-1.5">Get Coaching</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            title="Exit practice"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="scenario-practice__messages">
        {/* Initial loading state - show while AI generates opening */}
        {isStarting && messages.length === 0 && (
          <div className="scenario-practice__starting">
            <Loader2Icon className="h-5 w-5 animate-spin text-primary" />
            <span>Client is joining the conversation...</span>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`scenario-practice__message scenario-practice__message--${message.role}`}
          >
            <div className="scenario-practice__avatar">
              {message.role === "assistant" ? "C" : "Y"}
            </div>
            <div className="scenario-practice__bubble">{message.content}</div>
          </div>
        ))}

        {/* Loading indicator for follow-up messages */}
        {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
          <div className="scenario-practice__message scenario-practice__message--assistant">
            <div className="scenario-practice__avatar">C</div>
            <div className="scenario-practice__bubble scenario-practice__bubble--loading">
              <div className="scenario-practice__typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice hint - encourage natural practice */}
      {messages.length === 1 && !isLoading && (
        <div className="scenario-practice__voice-hint">
          <MicIcon className="h-3.5 w-3.5" />
          <span>Tap the mic to practice with your voice</span>
        </div>
      )}

      {/* Input - integrated voice and text */}
      <div className="scenario-practice__input-form">
        <VoiceInput
          onTranscript={(text) => sendMessage(text)}
          onTextSubmit={(text) => sendMessage(text)}
          disabled={isLoading || isStarting}
          placeholder="Type or speak your response..."
        />
        <div className="scenario-practice__input-actions">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={endPractice}
            disabled={isLoading || isStarting || isEvaluating || messages.length < 2}
          >
            {isEvaluating ? (
              <>
                <Loader2Icon className="h-4 w-4 mr-1.5 animate-spin" />
                Evaluating...
              </>
            ) : (
              "End Practice"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
