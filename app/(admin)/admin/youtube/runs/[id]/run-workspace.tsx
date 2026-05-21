/**
 * CATALYST - Run Workspace (client)
 *
 * Lets the user choose which of the 3 distilled angles to generate, view the
 * ones already generated, and refine the context — all without losing the
 * original input or the other angles.
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Stack, Row, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Loader2Icon,
  SparklesIcon,
  AlertTriangleIcon,
  BarChart3Icon,
  AxeIcon,
  FlameIcon,
  UserIcon,
  ListOrderedIcon,
  MessageCircleQuestionIcon,
  PencilIcon,
  FileTextIcon,
  CheckCircleIcon,
  RefreshCwIcon,
} from "lucide-react"

// Mirrors the cap in /api/admin/youtube/distill-idea. Stored context can exceed
// this but the LLM will only see the first 12,000 characters.
const CONTEXT_CHAR_CAP = 12_000
import {
  createYouTubeScript,
  updateYouTubeScriptRun,
  type YouTubeScriptRun,
  type YouTubeScript,
  type DistilledAngle,
} from "@/lib/actions/youtube"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { FORMAT_META, type Format } from "@/lib/youtube/prompts"
import { PROFILES } from "@/lib/youtube/profiles"
import { ProfileChip } from "../../_components/profile-selector"
import { useVoiceNote } from "@/lib/hooks"
import { VoiceNoteButton } from "@/components/shared"

// =============================================================================
// FORMAT ICON
// =============================================================================

function FormatFlagIcon({ format, className }: { format: Format; className?: string }) {
  switch (format) {
    case "authority_analysis":
      return <BarChart3Icon className={className} />
    case "myth_buster":
      return <AxeIcon className={className} />
    case "reaction":
      return <FlameIcon className={className} />
    case "case_study":
      return <UserIcon className={className} />
    case "listicle":
      return <ListOrderedIcon className={className} />
    case "qa_mailbag":
      return <MessageCircleQuestionIcon className={className} />
  }
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function RunWorkspace({
  run: initial,
  initialScripts,
}: {
  run: YouTubeScriptRun
  initialScripts: YouTubeScript[]
}) {
  const router = useRouter()

  // Local mirror of the run row so context + angle edits feel immediate.
  const [contextText, setContextText] = React.useState(initial.context_text)
  // Snapshot of the last persisted context, used to compute the dirty flag.
  // `initial.context_text` is a prop and never refreshes, so comparing against
  // it would leave "Save context" stuck visible after every save.
  const [savedContext, setSavedContext] = React.useState(initial.context_text)
  const [angles, setAngles] = React.useState<DistilledAngle[]>(initial.angles)
  const [editingTitle, setEditingTitle] = React.useState<number | null>(null)
  const [editingTopic, setEditingTopic] = React.useState<number | null>(null)
  const [isSavingContext, setIsSavingContext] = React.useState(false)
  const [isRedistilling, setIsRedistilling] = React.useState(false)
  const [generatingIndex, setGeneratingIndex] = React.useState<number | null>(null)

  const meta = FORMAT_META[initial.format]

  // Map angle_index -> script row, for the per-angle "generate vs view" choice.
  const scriptsByAngle = React.useMemo(() => {
    const map = new Map<number, YouTubeScript>()
    for (const s of initialScripts) {
      if (s.angle_index !== null) map.set(s.angle_index, s)
    }
    return map
  }, [initialScripts])

  const contextDirty = contextText !== savedContext
  const contextOverCap = contextText.length > CONTEXT_CHAR_CAP

  // Voice note — transcript appends to the context exactly as in step 1.
  const { voiceState, recordingDuration, startRecording, stopRecording } =
    useVoiceNote({
      onTranscript: (text) =>
        setContextText((prev) => (prev ? prev + " " + text : text)),
    })

  // ---------------------------------------------------------------------------
  // Save context edits
  // ---------------------------------------------------------------------------

  async function saveContext() {
    if (!contextDirty) return
    setIsSavingContext(true)
    try {
      const result = await updateYouTubeScriptRun(initial.id, {
        context_text: contextText,
      })
      if (!result.success) throw new Error(result.error || "Failed to save")
      setSavedContext(result.data.context_text)
      toast("Context saved", { type: "success" })
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save", { type: "error" })
    } finally {
      setIsSavingContext(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Re-distil — only refreshes angles that haven't been generated yet
  // ---------------------------------------------------------------------------

  async function redistil() {
    setIsRedistilling(true)
    try {
      // Persist any pending context edits first so the LLM sees them.
      if (contextDirty) {
        const saved = await updateYouTubeScriptRun(initial.id, {
          context_text: contextText,
        })
        if (!saved.success) throw new Error(saved.error || "Failed to save context")
        setSavedContext(saved.data.context_text)
      }

      const res = await fetch("/api/admin/youtube/distill-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: contextText.trim(),
          format: initial.format,
          profileSlug: initial.profile_slug,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to re-distil")
      }
      const data = await res.json()
      const fresh = (data.angles as DistilledAngle[]) ?? []
      if (fresh.length === 0) {
        toast("No usable angles returned", { type: "error" })
        return
      }

      // Preserve angles that already have a generated script — they're real
      // work and the user can still view them. Fill the rest from the new
      // distillation, in order.
      const next: DistilledAngle[] = []
      let cursor = 0
      for (let i = 0; i < 3; i++) {
        if (scriptsByAngle.has(i) && angles[i]) {
          next.push(angles[i])
        } else if (cursor < fresh.length) {
          next.push(fresh[cursor])
          cursor++
        } else if (angles[i]) {
          next.push(angles[i])
        }
      }

      const saved = await updateYouTubeScriptRun(initial.id, { angles: next })
      if (!saved.success) throw new Error(saved.error || "Failed to save angles")
      setAngles(next)
      if (fresh.length < 3) {
        toast(
          `Only ${fresh.length} fresh angle${fresh.length === 1 ? "" : "s"} returned — kept previous suggestions in the empty slot${3 - fresh.length === 1 ? "" : "s"}.`,
          { type: "info" }
        )
      } else {
        toast("Angles refreshed", { type: "success" })
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to re-distil", {
        type: "error",
      })
    } finally {
      setIsRedistilling(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Inline edit angle title/topic — persists on blur
  // ---------------------------------------------------------------------------

  function updateAngleField(index: number, field: "title" | "topic", value: string) {
    setAngles((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  async function persistAngles(next: DistilledAngle[]) {
    try {
      const result = await updateYouTubeScriptRun(initial.id, { angles: next })
      if (!result.success) throw new Error(result.error || "Failed to save")
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save", { type: "error" })
    }
  }

  // ---------------------------------------------------------------------------
  // Generate this angle → create script row → detail page autoGenerate
  // ---------------------------------------------------------------------------

  async function generateAngle(index: number) {
    const angle = angles[index]
    if (!angle) return
    if (angle.needs_news_peg) {
      toast("This Reaction angle needs a news peg before it can be generated", {
        type: "error",
      })
      return
    }
    setGeneratingIndex(index)
    try {
      // Persist unsaved context first so the run row and the script row share
      // the same input — otherwise "Back to angles" would show stale context.
      if (contextDirty) {
        const saved = await updateYouTubeScriptRun(initial.id, {
          context_text: contextText,
        })
        if (!saved.success) throw new Error(saved.error || "Failed to save context")
        setSavedContext(saved.data.context_text)
      }
      const result = await createYouTubeScript({
        title: angle.title,
        topic: angle.topic,
        target_length: angle.target_length,
        format: initial.format,
        profile_slug: initial.profile_slug,
        status: "idea",
        input_text: contextText.trim() || undefined,
        run_id: initial.id,
        angle_index: index,
      })
      if (!result.success) throw new Error(result.error || "Failed to create script")
      router.push(`/admin/youtube/${result.data.id}?autoGenerate=1`)
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create script", {
        type: "error",
      })
      setGeneratingIndex(null)
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Stack gap="lg">
      {/* Header */}
      <Row align="start" gap="sm">
        <Button
          variant="ghost"
          size="sm"
          className="mt-1"
          aria-label="Back to YouTube scripts"
          render={<Link href={`/admin/youtube?profile=${initial.profile_slug}`} />}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Stack gap="xs" className="flex-1 min-w-0">
          <Title size="h3">Pick an angle to generate</Title>
          <Text variant="muted" size="sm">
            Three angles were distilled from your context. Pick one to generate
            now — you can come back here and try a different angle anytime.
          </Text>
        </Stack>
      </Row>

      {/* Run meta — profile + format */}
      <Row align="center" gap="sm" wrap>
        <Text variant="muted" size="sm">Writing for</Text>
        <ProfileChip slug={initial.profile_slug} />
        <Text variant="muted" size="sm">
          · {PROFILES[initial.profile_slug].displayRole}
        </Text>
        <Badge variant="outline">
          <FormatFlagIcon format={initial.format} className="h-3 w-3 mr-1" />
          {meta.label}
        </Badge>
        <Text variant="muted" size="sm">
          · {meta.minutesLabel} · {meta.wordsLabel}
        </Text>
      </Row>

      {/* Context block — editable, with voice-note + save/re-distil controls */}
      <Card>
        <CardContent className="p-4">
          <Stack gap="sm">
            <Stack gap="xs">
              <Text className="font-medium">Your context</Text>
              <Text variant="muted" size="sm">
                Edit the text or append a voice note. Re-distil if you want a
                fresh set of angles for the slots that haven't been generated yet.
              </Text>
            </Stack>
            <Textarea
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
              className="min-h-40 resize-y text-sm leading-relaxed"
              disabled={voiceState === "transcribing" || isRedistilling}
            />
            <Row align="center" className="justify-between" wrap gap="sm">
              <Row gap="sm" align="center">
                <VoiceNoteButton
                  voiceState={voiceState}
                  recordingDuration={recordingDuration}
                  onStart={startRecording}
                  onStop={stopRecording}
                />
                <Text
                  variant="muted"
                  size="sm"
                  className={cn(contextOverCap && "text-amber-700 dark:text-amber-300")}
                >
                  {contextText.length > 0
                    ? `${contextText.length.toLocaleString()} characters`
                    : "Empty"}
                  {contextOverCap &&
                    ` · only the first ${CONTEXT_CHAR_CAP.toLocaleString()} reach the LLM`}
                </Text>
              </Row>
              <Row gap="sm">
                {contextDirty && (
                  <Button
                    variant="outline"
                    onClick={saveContext}
                    disabled={isSavingContext || isRedistilling || voiceState !== "idle"}
                  >
                    {isSavingContext ? (
                      <>
                        <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save context"
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={redistil}
                  disabled={
                    !contextText.trim() ||
                    isRedistilling ||
                    voiceState !== "idle" ||
                    generatingIndex !== null
                  }
                >
                  {isRedistilling ? (
                    <>
                      <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                      Re-distilling...
                    </>
                  ) : (
                    <>
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Re-distil
                    </>
                  )}
                </Button>
              </Row>
            </Row>
          </Stack>
        </CardContent>
      </Card>

      {/* Angle cards */}
      <Stack gap="sm">
        {angles.map((angle, i) => {
          const generated = scriptsByAngle.get(i) ?? null
          const isGenerating = generatingIndex === i
          const isDisabled = !generated && angle.needs_news_peg
          const isEditingTitle = editingTitle === i
          const isEditingTopic = editingTopic === i
          return (
            <Card
              key={i}
              className={cn(
                "transition-all",
                generated
                  ? "border-primary/20 bg-primary/5"
                  : isDisabled
                    ? "opacity-60 border-dashed"
                    : "hover:border-primary/40"
              )}
            >
              <CardContent className="p-4">
                <Row align="start" gap="sm">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-full border flex items-center justify-center shrink-0 text-xs font-medium",
                      generated
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30 text-muted-foreground"
                    )}
                  >
                    {generated ? <CheckCircleIcon className="h-4 w-4" /> : i + 1}
                  </div>
                  <Stack gap="xs" className="flex-1 min-w-0">
                    {/* Title */}
                    {isEditingTitle && !generated ? (
                      <Input
                        autoFocus
                        value={angle.title}
                        onChange={(e) => updateAngleField(i, "title", e.target.value)}
                        onBlur={() => {
                          setEditingTitle(null)
                          void persistAngles(angles)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === "Escape") {
                            setEditingTitle(null)
                            void persistAngles(angles)
                          }
                        }}
                        disabled={isRedistilling}
                        className="text-base font-medium"
                      />
                    ) : (
                      <Row align="center" gap="xs">
                        <Text className="font-medium leading-snug flex-1">
                          {angle.title}
                        </Text>
                        {!generated && (
                          <button
                            type="button"
                            onClick={() => setEditingTitle(i)}
                            disabled={isRedistilling}
                            className="text-muted-foreground hover:text-foreground shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Edit title"
                          >
                            <PencilIcon className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </Row>
                    )}

                    {/* Topic */}
                    {isEditingTopic && !generated ? (
                      <Textarea
                        autoFocus
                        value={angle.topic}
                        onChange={(e) => updateAngleField(i, "topic", e.target.value)}
                        onBlur={() => {
                          setEditingTopic(null)
                          void persistAngles(angles)
                        }}
                        disabled={isRedistilling}
                        className="text-sm min-h-20"
                      />
                    ) : (
                      <Row align="start" gap="xs">
                        <Text variant="muted" size="sm" className="leading-relaxed flex-1">
                          {angle.topic}
                        </Text>
                        {!generated && (
                          <button
                            type="button"
                            onClick={() => setEditingTopic(i)}
                            disabled={isRedistilling}
                            className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Edit topic"
                          >
                            <PencilIcon className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </Row>
                    )}

                    {angle.why_this_angle && (
                      <Text size="sm" className="text-primary/80 italic leading-relaxed">
                        Why this angle: {angle.why_this_angle}
                      </Text>
                    )}

                    {angle.news_peg && (
                      <Row gap="xs" align="center">
                        <Badge variant="outline" size="sm">
                          News peg
                        </Badge>
                        <Text variant="muted" size="sm">
                          {angle.news_peg}
                        </Text>
                      </Row>
                    )}

                    {isDisabled && (
                      <Row gap="xs" align="center">
                        <AlertTriangleIcon className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <Text size="sm" className="text-amber-700 dark:text-amber-300">
                          Needs a current news peg from DLD / RERA / Central Bank UAE / Fitch / Moody&apos;s / S&amp;P
                        </Text>
                      </Row>
                    )}

                    {/* Action row */}
                    <Row className="pt-2 justify-end" gap="sm" wrap>
                      {generated ? (
                        <Button
                          render={
                            <Link href={`/admin/youtube/${generated.id}`} />
                          }
                          variant="outline"
                        >
                          <FileTextIcon className="h-4 w-4 mr-2" />
                          View script
                          <ArrowRightIcon className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => generateAngle(i)}
                          disabled={isDisabled || generatingIndex !== null || isRedistilling}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                              Launching...
                            </>
                          ) : (
                            <>
                              <SparklesIcon className="h-4 w-4 mr-2" />
                              Generate this angle
                              <ArrowRightIcon className="h-4 w-4 ml-2" />
                            </>
                          )}
                        </Button>
                      )}
                    </Row>
                  </Stack>
                </Row>
              </CardContent>
            </Card>
          )
        })}
      </Stack>
    </Stack>
  )
}
