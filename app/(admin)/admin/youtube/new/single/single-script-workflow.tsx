/**
 * CATALYST - Write One Script Workflow (Mode B)
 *
 * Three-step flow that goes from a chunk of context straight to a generated
 * script (no idea-batch loop):
 *
 *   Step 1 (input):   user pastes context, picks a format (required), submits
 *   Step 2 (confirm): AI returns 3 distilled angles; user picks one, edits if
 *                     needed, and confirms — guarding the expensive Opus call
 *                     from a wrong distillation
 *   Step 3 (generate): row is created, user is redirected to the detail page
 *                      with ?autoGenerate=1 to kick off script streaming
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
  CheckCircleIcon,
  PenLineIcon,
  AlertTriangleIcon,
  BarChart3Icon,
  AxeIcon,
  FlameIcon,
  UserIcon,
  ListOrderedIcon,
  MessageCircleQuestionIcon,
  PencilIcon,
} from "lucide-react"
import { createYouTubeScript } from "@/lib/actions/youtube"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import {
  FORMAT_META,
  FORMATS_IN_DISPLAY_ORDER,
  type Format,
} from "@/lib/youtube/prompts"
import { PROFILES, type ProfileSlug } from "@/lib/youtube/profiles"
import { ProfileChip } from "../../_components/profile-selector"
import { useVoiceNote } from "@/lib/hooks"
import { VoiceNoteButton } from "@/components/shared"

// =============================================================================
// TYPES
// =============================================================================

type DistilledAngle = {
  title: string
  topic: string
  why_this_angle: string
  news_peg: string | null
  needs_news_peg: boolean
  target_length: "quick_take" | "standard" | "deep_dive"
}

type Step = "input" | "confirm"

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
// FORMAT PILL
// =============================================================================

function FormatPill({
  format,
  selected,
  onSelect,
}: {
  format: Format
  selected: boolean
  onSelect: () => void
}) {
  const meta = FORMAT_META[format]
  return (
    <button
      type="button"
      onClick={onSelect}
      title={meta.hint}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm transition-all flex items-center gap-1.5",
        "hover:border-primary/60",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-foreground"
      )}
    >
      <FormatFlagIcon format={format} className="h-3.5 w-3.5 shrink-0 opacity-70" />
      <span className="font-medium">{meta.label}</span>
      <span
        className={cn(
          "text-xs",
          selected ? "text-primary-foreground/80" : "text-muted-foreground"
        )}
      >
        · {meta.minutesLabel}
      </span>
    </button>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function SingleScriptWorkflow({ lockedProfile }: { lockedProfile: ProfileSlug }) {
  const router = useRouter()
  const [step, setStep] = React.useState<Step>("input")
  const [context, setContext] = React.useState("")
  const profileSlug = lockedProfile
  const [format, setFormat] = React.useState<Format | null>(null)
  const [angles, setAngles] = React.useState<DistilledAngle[]>([])
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)
  const [isDistilling, setIsDistilling] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [editingTitle, setEditingTitle] = React.useState(false)
  const [editingTopic, setEditingTopic] = React.useState(false)

  // Voice note — transcript is appended to the pasted context.
  const { voiceState, recordingDuration, startRecording, stopRecording } =
    useVoiceNote({
      onTranscript: (text) =>
        setContext((prev) => (prev ? prev + " " + text : text)),
    })

  const selectedAngle = selectedIndex !== null ? angles[selectedIndex] : null

  // ---------------------------------------------------------------------------
  // Distill
  // ---------------------------------------------------------------------------

  async function handleDistill() {
    if (!context.trim() || !format) return
    setIsDistilling(true)
    try {
      const res = await fetch("/api/admin/youtube/distill-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: context.trim(), format, profileSlug }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to distil context")
      }
      const data = await res.json()
      const distilled = (data.angles as DistilledAngle[]) ?? []
      if (distilled.length === 0) {
        toast("No usable angles returned — try with more context", { type: "error" })
        return
      }
      setAngles(distilled)
      setSelectedIndex(0)
      setStep("confirm")
    } catch (err) {
      console.error("Distill error:", err)
      toast(err instanceof Error ? err.message : "Failed to distil context", {
        type: "error",
      })
    } finally {
      setIsDistilling(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Edit angle (in-place)
  // ---------------------------------------------------------------------------

  function updateAngleField(field: "title" | "topic", value: string) {
    if (selectedIndex === null) return
    setAngles((prev) => {
      const next = [...prev]
      next[selectedIndex] = { ...next[selectedIndex], [field]: value }
      return next
    })
  }

  // ---------------------------------------------------------------------------
  // Save and launch
  // ---------------------------------------------------------------------------

  async function handleConfirmAndGenerate() {
    if (!format || !selectedAngle) return
    if (selectedAngle.needs_news_peg) {
      toast("This Reaction angle needs a news peg before it can be saved", {
        type: "error",
      })
      return
    }
    setIsSaving(true)
    try {
      const result = await createYouTubeScript({
        title: selectedAngle.title,
        topic: selectedAngle.topic,
        target_length: selectedAngle.target_length,
        format,
        profile_slug: profileSlug,
        status: "idea",
        input_text: context.trim() || undefined,
      })
      if (!result.success) {
        throw new Error(result.error || "Failed to save")
      }
      // Hand off to the detail page; ?autoGenerate=1 kicks off Opus on mount.
      router.push(`/admin/youtube/${result.data.id}?autoGenerate=1`)
    } catch (err) {
      console.error("Save error:", err)
      toast(err instanceof Error ? err.message : "Failed to save", { type: "error" })
      setIsSaving(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Stack gap="lg">
      {/* Header */}
      <Row align="center" gap="sm">
        <Button
          variant="ghost"
          size="sm"
          render={
            <Link
              href={step === "input" ? "/admin/youtube/new" : "#"}
              onClick={(e) => {
                if (step !== "input") {
                  e.preventDefault()
                  setStep("input")
                }
              }}
            />
          }
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Stack gap="xs" className="flex-1">
          <Title size="h3">Write One Script</Title>
          <Text variant="muted" size="sm">
            {step === "input"
              ? "Step 1 — Pick a format and paste your context"
              : "Step 2 — Confirm the angle, then we'll generate the script"}
          </Text>
        </Stack>
        <Row gap="xs" align="center">
          <div
            className={cn(
              "h-2 w-8 rounded-full transition-colors",
              step === "input" ? "bg-primary" : "bg-primary/40"
            )}
          />
          <div
            className={cn(
              "h-2 w-8 rounded-full transition-colors",
              step === "confirm" ? "bg-primary" : "bg-muted"
            )}
          />
        </Row>
      </Row>

      {/* =================================================================== */}
      {/* STEP 1: INPUT                                                       */}
      {/* =================================================================== */}

      {step === "input" && (
        <Stack gap="lg">
          {/* Locked profile indicator — set by the picker upstream */}
          <Row align="center" gap="sm">
            <Text variant="muted" size="sm">Writing for</Text>
            <ProfileChip slug={profileSlug} />
            <Text variant="muted" size="sm">
              · {PROFILES[profileSlug].displayRole}
            </Text>
          </Row>

          {/* Format picker — required, sits at top */}
          <Stack gap="sm">
            <Stack gap="xs">
              <Text className="font-medium">
                Which format are you writing in?{" "}
                <span className="text-destructive">*</span>
              </Text>
              <Text variant="muted" size="sm">
                Each format has its own structure and CTA pattern. The script
                will be generated to that spec.
              </Text>
            </Stack>
            <Row gap="xs" wrap>
              {FORMATS_IN_DISPLAY_ORDER.map((f) => (
                <FormatPill
                  key={f}
                  format={f}
                  selected={format === f}
                  onSelect={() => setFormat(f)}
                />
              ))}
            </Row>
          </Stack>

          {/* Context input */}
          <Stack gap="sm">
            <Stack gap="xs">
              <Text className="font-medium">
                What's the context? <span className="text-destructive">*</span>
              </Text>
              <Text variant="muted" size="sm">
                Paste notes, a brief, a competitor video transcript, a half-formed
                thought — or record a voice note. The more concrete the context,
                the sharper the distilled angles.
              </Text>
            </Stack>
            <Textarea
              placeholder="e.g. I want to make a video on the new RERA escrow rules announced last week — specifically the 60-day rule on developer payment milestones. I have a client whose off-plan purchase is mid-payment and they're worried about exposure. The new framework actually protects them more than the old one did, but most agents are spinning it the wrong way..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-56 resize-y text-base leading-relaxed"
              disabled={voiceState === "transcribing"}
            />
            <Row align="center" className="justify-between">
              <Row gap="sm" align="center">
                <VoiceNoteButton
                  voiceState={voiceState}
                  recordingDuration={recordingDuration}
                  onStart={startRecording}
                  onStop={stopRecording}
                />
                <Text variant="muted" size="sm">
                  {context.length > 0
                    ? `${context.length.toLocaleString()} characters`
                    : "Empty"}
                </Text>
              </Row>
              <Button
                onClick={handleDistill}
                disabled={!context.trim() || !format || isDistilling || voiceState !== "idle"}
                size="lg"
              >
                {isDistilling ? (
                  <>
                    <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                    Distilling angles...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-4 w-4 mr-2" />
                    Distil into 3 angles
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </Row>
          </Stack>
        </Stack>
      )}

      {/* =================================================================== */}
      {/* STEP 2: CONFIRM                                                     */}
      {/* =================================================================== */}

      {step === "confirm" && format && (
        <Stack gap="lg">
          <Stack gap="xs">
            <Text className="font-medium">
              Three angles distilled from your context — pick one
            </Text>
            <Text variant="muted" size="sm">
              The selected angle becomes the script's working title and topic.
              You can edit either before generating.
            </Text>
          </Stack>

          {/* Angle cards */}
          <Stack gap="sm">
            {angles.map((angle, i) => {
              const isSelected = selectedIndex === i
              const isDisabled = angle.needs_news_peg
              return (
                <Card
                  key={i}
                  className={cn(
                    "transition-all cursor-pointer",
                    isDisabled
                      ? "opacity-50 border-dashed cursor-not-allowed"
                      : isSelected
                        ? "border-primary ring-1 ring-primary/20 bg-primary/5"
                        : "hover:border-primary/40"
                  )}
                  onClick={() => {
                    if (isDisabled) return
                    setSelectedIndex(i)
                    setEditingTitle(false)
                    setEditingTopic(false)
                  }}
                >
                  <CardContent className="p-4">
                    <Row align="start" gap="sm">
                      <div
                        className={cn(
                          "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                          isDisabled
                            ? "border-muted-foreground/20"
                            : isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/30"
                        )}
                      >
                        {isSelected && <CheckCircleIcon className="h-3.5 w-3.5" />}
                      </div>
                      <Stack gap="xs" className="flex-1 min-w-0">
                        {/* Title — inline editable if selected */}
                        {isSelected && editingTitle ? (
                          <Input
                            autoFocus
                            value={angle.title}
                            onChange={(e) => updateAngleField("title", e.target.value)}
                            onBlur={() => setEditingTitle(false)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === "Escape") {
                                setEditingTitle(false)
                              }
                            }}
                            className="text-base font-medium"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <Row align="center" gap="xs">
                            <Text className="font-medium leading-snug flex-1">
                              {angle.title}
                            </Text>
                            {isSelected && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingTitle(true)
                                }}
                                className="text-muted-foreground hover:text-foreground shrink-0"
                                aria-label="Edit title"
                              >
                                <PencilIcon className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </Row>
                        )}

                        {/* Topic — inline editable if selected */}
                        {isSelected && editingTopic ? (
                          <Textarea
                            autoFocus
                            value={angle.topic}
                            onChange={(e) => updateAngleField("topic", e.target.value)}
                            onBlur={() => setEditingTopic(false)}
                            className="text-sm min-h-20"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <Row align="start" gap="xs">
                            <Text variant="muted" size="sm" className="leading-relaxed flex-1">
                              {angle.topic}
                            </Text>
                            {isSelected && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingTopic(true)
                                }}
                                className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
                                aria-label="Edit topic"
                              >
                                <PencilIcon className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </Row>
                        )}

                        {/* Why this angle */}
                        {angle.why_this_angle && (
                          <Text size="sm" className="text-primary/80 italic leading-relaxed">
                            Why this angle: {angle.why_this_angle}
                          </Text>
                        )}

                        {/* News peg / warning */}
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
                              Needs a current news peg from DLD / RERA / Central Bank UAE / Fitch / Moody's / S&P
                            </Text>
                          </Row>
                        )}
                      </Stack>
                    </Row>
                  </CardContent>
                </Card>
              )
            })}
          </Stack>

          {/* Action bar */}
          <Row className="justify-between pt-4 border-t" wrap gap="sm">
            <Row align="center" gap="sm">
              <Badge variant="outline">
                <FormatFlagIcon
                  format={format}
                  className="h-3 w-3 mr-1"
                />
                {FORMAT_META[format].label}
              </Badge>
              <Text variant="muted" size="sm">
                {FORMAT_META[format].minutesLabel} · {FORMAT_META[format].wordsLabel}
              </Text>
            </Row>
            <Row gap="sm">
              <Button variant="outline" onClick={() => setStep("input")}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleConfirmAndGenerate}
                disabled={
                  selectedIndex === null ||
                  isSaving ||
                  (selectedAngle?.needs_news_peg ?? false)
                }
                size="lg"
              >
                {isSaving ? (
                  <>
                    <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                    Launching...
                  </>
                ) : (
                  <>
                    <PenLineIcon className="h-4 w-4 mr-2" />
                    Looks good — generate script
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </Row>
          </Row>
        </Stack>
      )}
    </Stack>
  )
}
