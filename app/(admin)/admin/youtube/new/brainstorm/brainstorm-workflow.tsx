/**
 * CATALYST - Brainstorm Ideas Workflow
 *
 * Full-page multi-step workflow:
 * Step 1: Input — text or voice recording, with optional format pre-selection
 * Step 2: Review — select from AI-generated ideas, generate more variations
 * Step 3: Save — creates scripts and redirects to kanban
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Stack, Row, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeftIcon,
  Loader2Icon,
  SparklesIcon,
  CheckCircleIcon,
  PlusIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  RadarIcon,
  RefreshCwIcon,
  FlameIcon,
  UserIcon,
  MessageCircleQuestionIcon,
  AlertTriangleIcon,
  BarChart3Icon,
  AxeIcon,
  ListOrderedIcon,
} from "lucide-react"
import { createYouTubeScripts } from "@/lib/actions/youtube"
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

type TopicSuggestion = {
  title: string
  prompt: string
  timeliness: string
  style: "contrarian" | "analytical" | "hot_take" | "process" | "macro" | string
}

type ScriptIdea = {
  title: string
  topic: string
  fear_addressed: string
  format: Format
  news_peg: string | null
  needs_news_peg: boolean
  target_length: "quick_take" | "standard" | "deep_dive"
}

type Step = "input" | "ideas"

// =============================================================================
// FORMAT FLAG ICON
// =============================================================================

/**
 * Every format gets a distinguishing icon so the format reads at a glance
 * on idea cards and pill rows. Reaction / Case Study / Q&A keep their
 * special-requirement icons (flame / user / question) — Authority Analysis
 * / Myth-Buster / Listicle pick up generic-but-distinct icons.
 */
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
// FORMAT PILL — used in step 1 (pre-selection) and step 2 (generate-more panel)
// =============================================================================

function FormatPill({
  format,
  selected,
  onToggle,
}: {
  format: Format
  selected: boolean
  onToggle: () => void
}) {
  const meta = FORMAT_META[format]
  return (
    <button
      type="button"
      onClick={onToggle}
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
      <span className={cn(
        "text-xs",
        selected ? "text-primary-foreground/80" : "text-muted-foreground"
      )}>
        · {meta.minutesLabel}
      </span>
    </button>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function BrainstormWorkflow({ lockedProfile }: { lockedProfile: ProfileSlug }) {
  const router = useRouter()
  const [step, setStep] = React.useState<Step>("input")
  const [input, setInput] = React.useState("")
  const [ideas, setIdeas] = React.useState<ScriptIdea[]>([])
  // Keyed by idea.title so selection survives reorders or in-place mutations
  // of the ideas array (e.g. the "Generate more variations" path) — index
  // keying breaks the moment the array shape changes.
  const [selectedIdeas, setSelectedIdeas] = React.useState<Set<string>>(new Set())
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)

  // Profile — every idea in this batch is written for this person.
  // Locked upstream by the picker so it can't change mid-flow.
  const profileSlug = lockedProfile

  // Format pre-selection (step 1)
  const [selectedFormats, setSelectedFormats] = React.useState<Set<Format>>(new Set())

  // "Generate more variations" panel (step 2)
  const [variationFormats, setVariationFormats] = React.useState<Set<Format>>(new Set())
  const [isGeneratingMore, setIsGeneratingMore] = React.useState(false)

  // Market scan suggestions
  const [suggestions, setSuggestions] = React.useState<TopicSuggestion[]>([])
  const [isScanning, setIsScanning] = React.useState(false)
  const scanAbortRef = React.useRef<AbortController | null>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Voice recording — shared hook appends the transcript to the idea input.
  const { voiceState, recordingDuration, startRecording, stopRecording } =
    useVoiceNote({
      onTranscript: (text) =>
        setInput((prev) => (prev ? prev + " " + text : text)),
    })

  React.useEffect(() => {
    return () => {
      scanAbortRef.current?.abort()
    }
  }, [])

  // ---------------------------------------------------------------------------
  // Market scan (Perplexity)
  // ---------------------------------------------------------------------------

  async function runMarketScan() {
    scanAbortRef.current?.abort()
    const controller = new AbortController()
    scanAbortRef.current = controller

    setIsScanning(true)
    try {
      const res = await fetch("/api/admin/youtube/topic-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          focus: input.trim() || undefined,
          formats: Array.from(selectedFormats),
          profileSlug,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Scan failed (${res.status})`)
      }
      const data = await res.json()
      if (!Array.isArray(data.suggestions) || data.suggestions.length === 0) {
        throw new Error("No suggestions returned")
      }
      setSuggestions(data.suggestions)
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
      console.error("Market scan error:", err)
      const msg = err instanceof Error ? err.message : "Failed to scan market"
      toast(msg, { type: "error" })
    } finally {
      setIsScanning(false)
    }
  }

  function applySuggestion(s: TopicSuggestion) {
    const text = `${s.title}\n\n${s.prompt}`
    setInput(text)
    setSuggestions([])
    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (el) {
        el.focus()
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    })
  }

  // ---------------------------------------------------------------------------
  // Format pre-selection
  // ---------------------------------------------------------------------------

  function toggleFormat(format: Format) {
    setSelectedFormats((prev) => {
      const next = new Set(prev)
      if (next.has(format)) next.delete(format)
      else next.add(format)
      return next
    })
  }

  function toggleVariationFormat(format: Format) {
    setVariationFormats((prev) => {
      const next = new Set(prev)
      if (next.has(format)) next.delete(format)
      else next.add(format)
      return next
    })
  }

  // ---------------------------------------------------------------------------
  // Idea Generation
  // ---------------------------------------------------------------------------

  async function handleGenerate() {
    if (!input.trim()) return
    setIsGenerating(true)
    try {
      const res = await fetch("/api/admin/youtube/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: input.trim(),
          count: 5,
          formats: Array.from(selectedFormats),
          profileSlug,
        }),
      })
      if (!res.ok) throw new Error("Failed to generate ideas")
      const data = await res.json()
      setIdeas(data.ideas)
      setSelectedIdeas(new Set())
      // Pre-fill the variations panel with whatever formats are present in this batch
      const formatsInBatch = new Set<Format>(
        (data.ideas as ScriptIdea[]).map((i) => i.format)
      )
      setVariationFormats(formatsInBatch)
      setStep("ideas")
    } catch {
      toast("Failed to generate ideas", { type: "error" })
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleGenerateMoreVariations() {
    if (!input.trim() || ideas.length === 0) return
    setIsGeneratingMore(true)
    try {
      const res = await fetch("/api/admin/youtube/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: input.trim(),
          count: 5,
          formats: Array.from(variationFormats),
          existingTitles: ideas.map((i) => i.title),
          profileSlug,
        }),
      })
      if (!res.ok) throw new Error("Failed to generate more ideas")
      const data = await res.json()
      const newIdeas = (data.ideas as ScriptIdea[]) ?? []
      if (newIdeas.length === 0) {
        toast("No new ideas returned — try different formats", { type: "error" })
        return
      }
      setIdeas((prev) => [...prev, ...newIdeas])
      toast(`${newIdeas.length} more variation${newIdeas.length === 1 ? "" : "s"} added`)
    } catch {
      toast("Failed to generate more variations", { type: "error" })
    } finally {
      setIsGeneratingMore(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Save
  // ---------------------------------------------------------------------------

  async function saveSelectedIdeas() {
    const selected = ideas.filter((idea) => selectedIdeas.has(idea.title))
    if (selected.length === 0) return null
    const inputs = selected.map((idea) => ({
      title: idea.title,
      topic: idea.topic,
      target_length: idea.target_length,
      format: idea.format,
      profile_slug: profileSlug,
      input_text: input.trim() || undefined,
    }))
    const result = await createYouTubeScripts(inputs)
    if (!result.success) throw new Error(result.error)
    return result.data
  }

  async function handleSave() {
    setIsSaving(true)
    try {
      const saved = await saveSelectedIdeas()
      if (saved) {
        toast(`${saved.length} idea${saved.length === 1 ? "" : "s"} added to pipeline`)
        router.push(`/admin/youtube?profile=${profileSlug}`)
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save ideas", { type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleSaveAndGenerate() {
    setIsSaving(true)
    try {
      const saved = await saveSelectedIdeas()
      if (saved && saved.length > 0) {
        toast(`${saved.length} ideas saved — opening first for script generation`)
        // autoGenerate=1 tells the detail page to immediately kick off Opus;
        // this is the Mode-B handoff that distinguishes "Save & Generate"
        // from the plain "Save to Pipeline" path above.
        router.push(`/admin/youtube/${saved[0].id}?autoGenerate=1`)
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save ideas", { type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  function toggleIdea(idea: ScriptIdea) {
    if (idea.needs_news_peg) {
      toast("This idea needs a current news peg before it can be saved", { type: "error" })
      return
    }
    setSelectedIdeas((prev) => {
      const next = new Set(prev)
      if (next.has(idea.title)) next.delete(idea.title)
      else next.add(idea.title)
      return next
    })
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const selectableCount = ideas.filter((i) => !i.needs_news_peg).length

  return (
    <Stack gap="lg">
      {/* Header */}
      <Row align="center" gap="sm">
        <Button variant="ghost" size="sm" render={<Link href="/admin/youtube/new" />}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Stack gap="xs" className="flex-1">
          <Title size="h3">Brainstorm Ideas</Title>
          <Text variant="muted" size="sm">
            {step === "input"
              ? "Step 1 — Describe your video idea"
              : "Step 2 — Review and select ideas"}
          </Text>
        </Stack>
        {/* Step indicator */}
        <Row gap="xs" align="center">
          <div className={cn(
            "h-2 w-8 rounded-full transition-colors",
            step === "input" ? "bg-primary" : "bg-primary/40"
          )} />
          <div className={cn(
            "h-2 w-8 rounded-full transition-colors",
            step === "ideas" ? "bg-primary" : "bg-muted"
          )} />
        </Row>
      </Row>

      {/* ================================================================== */}
      {/* STEP 1: INPUT                                                      */}
      {/* ================================================================== */}

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

          {/* 1. Format pre-selection — leads the page so it informs the market scan and idea generation */}
          <Stack gap="sm">
            <Stack gap="xs">
              <Text className="font-medium">
                Which script formats would you like? <span className="text-muted-foreground font-normal">(optional)</span>
              </Text>
              <Text variant="muted" size="sm">
                Pre-select one or more to constrain the variations — or leave blank and the AI picks the best mix. Topic suggestions and idea generation both respect this selection.
              </Text>
            </Stack>
            <Row gap="xs" wrap>
              {FORMATS_IN_DISPLAY_ORDER.map((format) => (
                <FormatPill
                  key={format}
                  format={format}
                  selected={selectedFormats.has(format)}
                  onToggle={() => toggleFormat(format)}
                />
              ))}
            </Row>
            {selectedFormats.size > 0 && (
              <Row gap="sm" align="center">
                <Text variant="muted" size="sm">
                  {selectedFormats.size} format{selectedFormats.size === 1 ? "" : "s"} selected
                </Text>
                <button
                  type="button"
                  onClick={() => setSelectedFormats(new Set())}
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2"
                >
                  Clear
                </button>
              </Row>
            )}
          </Stack>

          {/* 2. Input — type, record voice, or pick a market-scan suggestion below */}
          <Stack gap="sm">
            <Text className="font-medium">
              What do you want to make a video about?
            </Text>
            <Text variant="muted" size="sm">
              Type your idea, record a voice note, or scan the market below —
              the AI will distil it into multiple focused script concepts.
            </Text>
          </Stack>

          <Textarea
            ref={textareaRef}
            placeholder="e.g. I want to make a video about why off-plan properties in Dubai Marina are becoming risky for investors in 2026, covering oversupply concerns and what alternatives exist..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-48 resize-y text-base leading-relaxed"
            disabled={voiceState === "transcribing"}
          />

          {/* Voice + Generate — sit between input and the market-scan fallback */}
          <Row gap="sm" align="center" className="justify-between">
            <VoiceNoteButton
              voiceState={voiceState}
              recordingDuration={recordingDuration}
              onStart={startRecording}
              onStop={stopRecording}
            />

            <Button
              onClick={handleGenerate}
              disabled={!input.trim() || isGenerating || voiceState !== "idle"}
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                  Generating ideas...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Generate Ideas
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </Row>

          {/* 3. Market scan — cold-start fallback. Honours the formats selected above. */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-5">
              <Row gap="md" align="center" wrap>
                <div className="h-11 w-11 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <RadarIcon className="h-5 w-5 text-primary" />
                </div>
                <Stack gap="xs" className="flex-1 min-w-0">
                  <Text className="font-semibold">
                    Stuck for ideas? Scan the market.
                  </Text>
                  <Text variant="muted" size="sm">
                    We&rsquo;ll pull the latest Dubai property market developments
                    and suggest 5 timely video topics tuned for Prime Capital&rsquo;s
                    audience
                    {selectedFormats.size > 0 ? " — biased toward the formats you've selected" : ""}.
                  </Text>
                </Stack>
                <Button
                  onClick={runMarketScan}
                  disabled={isScanning}
                  className="gap-2 shrink-0"
                >
                  {isScanning ? (
                    <>
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                      Scanning market...
                    </>
                  ) : suggestions.length > 0 ? (
                    <>
                      <RefreshCwIcon className="h-4 w-4" />
                      Get More Ideas
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-4 w-4" />
                      Get Topic Ideas
                    </>
                  )}
                </Button>
              </Row>

              {/* Suggestions list */}
              {suggestions.length > 0 && (
                <Stack gap="sm" className="mt-5 pt-5 border-t border-primary/20">
                  <Text size="sm" className="font-medium">
                    Click a topic to use it as your starting point:
                  </Text>
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applySuggestion(s)}
                      className="text-left rounded-lg border bg-background p-4 hover:border-primary hover:shadow-sm transition-all w-full"
                    >
                      <Stack gap="xs">
                        <Row align="center" gap="sm" className="justify-between">
                          <Text className="font-medium">{s.title}</Text>
                          {s.style && (
                            <Badge variant="outline" size="sm" className="shrink-0">
                              {s.style.replace(/_/g, " ")}
                            </Badge>
                          )}
                        </Row>
                        <Text variant="muted" size="sm" className="leading-relaxed">
                          {s.prompt}
                        </Text>
                        {s.timeliness && (
                          <Text size="sm" className="text-primary/80 italic">
                            Why now: {s.timeliness}
                          </Text>
                        )}
                      </Stack>
                    </button>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* ================================================================== */}
      {/* STEP 2: REVIEW IDEAS                                               */}
      {/* ================================================================== */}

      {step === "ideas" && (
        <Stack gap="lg">
          <Row align="center" className="justify-between">
            <Stack gap="xs">
              <Text className="font-medium">
                {ideas.length} idea{ideas.length === 1 ? "" : "s"} generated
                {ideas.length !== selectableCount && (
                  <span className="text-muted-foreground font-normal">
                    {" "}({selectableCount} selectable)
                  </span>
                )}
              </Text>
              <Text variant="muted" size="sm">
                Select the ideas you want to develop into full scripts. Click the checkbox to select.
              </Text>
            </Stack>
            <Row gap="sm">
              <Button variant="outline" onClick={() => setStep("input")}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Row>
          </Row>

          <Stack gap="sm">
            {ideas.map((idea, i) => {
              const meta = FORMAT_META[idea.format]
              const isSelected = selectedIdeas.has(idea.title)
              const isDisabled = idea.needs_news_peg
              return (
                <Collapsible key={i}>
                  <Card
                    className={cn(
                      "transition-all",
                      isDisabled
                        ? "opacity-50 border-dashed"
                        : isSelected
                          ? "border-primary ring-1 ring-primary/20 bg-primary/5"
                          : "opacity-60 hover:opacity-90"
                    )}
                  >
                    <CardContent className="p-0">
                      <CollapsibleTrigger className="w-full text-left">
                        <div className="p-4">
                          {/* Row 1: Checkbox + prominent format badge + length + chevron */}
                          <Row align="center" gap="sm">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); toggleIdea(idea) }}
                              disabled={isDisabled}
                              className={cn(
                                "h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                                isDisabled
                                  ? "border-muted-foreground/20 cursor-not-allowed"
                                  : isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted-foreground/30 hover:border-muted-foreground"
                              )}
                            >
                              {isSelected && (
                                <CheckCircleIcon className="h-3.5 w-3.5" />
                              )}
                            </button>

                            {/* Format — leading visual identifier of the card */}
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary shrink-0">
                              <FormatFlagIcon format={idea.format} className="h-3.5 w-3.5" />
                              <span className="font-semibold">{meta.label}</span>
                              <span className="opacity-70 font-normal">· {meta.minutesLabel}</span>
                            </div>

                            {/* Length only if it differs from the format default */}
                            {idea.target_length && idea.target_length !== meta.defaultLength && (
                              <Badge variant="outline" size="sm" className="opacity-70 shrink-0">
                                {idea.target_length.replace(/_/g, " ")}
                              </Badge>
                            )}

                            <div className="flex-1" />

                            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                              <ChevronDownIcon className="h-5 w-5 transition-transform [[data-open]_&]:rotate-180" strokeWidth={2.5} />
                            </div>
                          </Row>

                          {/* Row 2: Title — full width, indented to align with format badge */}
                          <Text className="font-medium ml-8 mt-2 leading-snug">
                            {idea.title}
                          </Text>

                          {/* Row 3: Teaser — hidden when expanded */}
                          <Text
                            variant="muted"
                            size="sm"
                            className="mt-1 ml-8 line-clamp-1 [[data-open]_&]:hidden"
                          >
                            {idea.topic}
                          </Text>

                          {/* News-peg flag — visible when collapsed */}
                          {isDisabled && (
                            <Row gap="xs" align="center" className="mt-2 ml-8 [[data-open]_&]:hidden">
                              <AlertTriangleIcon className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                              <Text size="sm" className="text-amber-700 dark:text-amber-300">
                                Needs a current news peg before it can be saved
                              </Text>
                            </Row>
                          )}
                        </div>
                      </CollapsibleTrigger>

                      {/* Expanded: full detail replaces teaser */}
                      <CollapsibleContent>
                        <Stack gap="sm" className="px-4 pb-4 ml-8">
                          <Text variant="muted" size="sm" className="leading-relaxed">
                            {idea.topic}
                          </Text>
                          {idea.fear_addressed && (
                            <Text size="sm">
                              <span className="font-medium">Addresses: </span>
                              <span className="italic">{idea.fear_addressed}</span>
                            </Text>
                          )}
                          {idea.news_peg && (
                            <Text size="sm">
                              <span className="font-medium">News peg: </span>
                              <span className="italic">{idea.news_peg}</span>
                            </Text>
                          )}
                          {isDisabled && (
                            <Stack gap="xs" className="rounded-md border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-3">
                              <Row gap="xs" align="center">
                                <AlertTriangleIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                <Text size="sm" className="font-medium text-amber-800 dark:text-amber-200">
                                  Reaction needs a current news peg
                                </Text>
                              </Row>
                              <Text variant="muted" size="sm" className="text-amber-700 dark:text-amber-300/80">
                                Add a fresh news event from an allowed source (DLD, RERA, Central Bank UAE, Fitch, Moody&apos;s, S&amp;P) to your input and regenerate. Reactions live or die on freshness.
                              </Text>
                            </Stack>
                          )}
                        </Stack>
                      </CollapsibleContent>
                    </CardContent>
                  </Card>
                </Collapsible>
              )
            })}
          </Stack>

          {/* Generate more variations panel */}
          <Card className="border-dashed">
            <CardContent className="p-5">
              <Stack gap="md">
                <Stack gap="xs">
                  <Text className="font-medium">
                    Want more variations on this topic?
                  </Text>
                  <Text variant="muted" size="sm">
                    Pick the formats you&rsquo;d like more ideas in. Existing ideas stay — new ones are added below.
                  </Text>
                </Stack>
                <Row gap="xs" wrap>
                  {FORMATS_IN_DISPLAY_ORDER.map((format) => (
                    <FormatPill
                      key={format}
                      format={format}
                      selected={variationFormats.has(format)}
                      onToggle={() => toggleVariationFormat(format)}
                    />
                  ))}
                </Row>
                <Row align="center" className="justify-between">
                  <Text variant="muted" size="sm">
                    {variationFormats.size === 0
                      ? "No formats selected — AI will pick the best mix"
                      : `${variationFormats.size} format${variationFormats.size === 1 ? "" : "s"} selected`}
                  </Text>
                  <Button
                    variant="outline"
                    onClick={handleGenerateMoreVariations}
                    disabled={isGeneratingMore}
                  >
                    {isGeneratingMore ? (
                      <>
                        <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                        Generating more...
                      </>
                    ) : (
                      <>
                        <RefreshCwIcon className="h-4 w-4 mr-2" />
                        Generate More Variations
                      </>
                    )}
                  </Button>
                </Row>
              </Stack>
            </CardContent>
          </Card>

          {/* Bottom action bar */}
          <Row className="justify-between pt-4 border-t" wrap gap="sm">
            <Text variant="muted" size="sm" className="self-center">
              {selectedIdeas.size === 0
                ? "Select ideas to continue"
                : `${selectedIdeas.size} idea${selectedIdeas.size !== 1 ? "s" : ""} selected`}
            </Text>
            <Row gap="sm">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={selectedIdeas.size === 0 || isSaving}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Save to Pipeline
              </Button>
              <Button
                onClick={handleSaveAndGenerate}
                disabled={selectedIdeas.size === 0 || isSaving}
                size="lg"
              >
                {isSaving ? (
                  <>
                    <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-4 w-4 mr-2" />
                    Save &amp; Generate Scripts
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
