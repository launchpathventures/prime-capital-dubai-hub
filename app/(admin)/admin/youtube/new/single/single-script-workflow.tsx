/**
 * CATALYST - Write One Script — Step 1 (context capture)
 *
 * Single step: pick a format, paste context (optionally append a voice-note
 * transcript), submit. On success we persist a "run" (context + 3 distilled
 * angles) and route to /admin/youtube/runs/[runId], where the user can pick
 * which angle to generate — and come back to try the others without losing
 * the context or the transcript.
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Stack, Row, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Loader2Icon,
  SparklesIcon,
  BarChart3Icon,
  AxeIcon,
  FlameIcon,
  UserIcon,
  ListOrderedIcon,
  MessageCircleQuestionIcon,
} from "lucide-react"
import {
  createYouTubeScriptRun,
  type DistilledAngle,
} from "@/lib/actions/youtube"
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

// Mirrors the cap in /api/admin/youtube/distill-idea. Anything beyond this is
// silently truncated before the LLM sees it.
const CONTEXT_CHAR_CAP = 12_000

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
  const [context, setContext] = React.useState("")
  const profileSlug = lockedProfile
  const [format, setFormat] = React.useState<Format | null>(null)
  const [isWorking, setIsWorking] = React.useState(false)

  // Voice note — transcript is appended to the pasted context.
  const { voiceState, recordingDuration, startRecording, stopRecording } =
    useVoiceNote({
      onTranscript: (text) =>
        setContext((prev) => (prev ? prev + " " + text : text)),
    })

  // ---------------------------------------------------------------------------
  // Distil → persist run → route to run workspace
  // ---------------------------------------------------------------------------

  async function handleDistilAndCreateRun() {
    if (!context.trim() || !format) return
    setIsWorking(true)
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
      const angles = (data.angles as DistilledAngle[]) ?? []
      if (angles.length === 0) {
        toast("No usable angles returned — try with more context", { type: "error" })
        return
      }

      const runResult = await createYouTubeScriptRun({
        context_text: context.trim(),
        format,
        profile_slug: profileSlug,
        angles,
      })
      if (!runResult.success) {
        throw new Error(runResult.error || "Failed to save run")
      }

      router.push(`/admin/youtube/runs/${runResult.data.id}`)
    } catch (err) {
      console.error("Distill error:", err)
      toast(err instanceof Error ? err.message : "Failed to distil context", {
        type: "error",
      })
      setIsWorking(false)
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
          render={<Link href="/admin/youtube/new" />}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Stack gap="xs" className="flex-1">
          <Title size="h3">Write One Script</Title>
          <Text variant="muted" size="sm">
            Pick a format and paste your context — we'll distil it into 3 angles
            you can choose from
          </Text>
        </Stack>
      </Row>

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
              <Text
                variant="muted"
                size="sm"
                className={cn(
                  context.length > CONTEXT_CHAR_CAP &&
                    "text-amber-700 dark:text-amber-300"
                )}
              >
                {context.length > 0
                  ? `${context.length.toLocaleString()} characters`
                  : "Empty"}
                {context.length > CONTEXT_CHAR_CAP &&
                  ` · only the first ${CONTEXT_CHAR_CAP.toLocaleString()} reach the LLM`}
              </Text>
            </Row>
            <Button
              onClick={handleDistilAndCreateRun}
              disabled={!context.trim() || !format || isWorking || voiceState !== "idle"}
              size="lg"
            >
              {isWorking ? (
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
    </Stack>
  )
}
