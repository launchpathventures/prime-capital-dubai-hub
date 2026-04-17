/**
 * CATALYST - New Script Workflow
 *
 * Full-page multi-step workflow:
 * Step 1: Input — text or voice recording
 * Step 2: Review — select from AI-generated ideas
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
  MicIcon,
  SquareIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  RadarIcon,
  RefreshCwIcon,
} from "lucide-react"
import { createYouTubeScripts } from "@/lib/actions/youtube"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

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
  video_type: string
  target_length: string
}

type Step = "input" | "ideas"

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function NewScriptWorkflow() {
  const router = useRouter()
  const [step, setStep] = React.useState<Step>("input")
  const [input, setInput] = React.useState("")
  const [ideas, setIdeas] = React.useState<ScriptIdea[]>([])
  const [selectedIdeas, setSelectedIdeas] = React.useState<Set<number>>(new Set())
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)

  // Market scan suggestions
  const [suggestions, setSuggestions] = React.useState<TopicSuggestion[]>([])
  const [isScanning, setIsScanning] = React.useState(false)
  const scanAbortRef = React.useRef<AbortController | null>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Voice recording
  const [voiceState, setVoiceState] = React.useState<"idle" | "recording" | "transcribing">("idle")
  const [recordingDuration, setRecordingDuration] = React.useState(0)
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const chunksRef = React.useRef<Blob[]>([])
  const streamRef = React.useRef<MediaStream | null>(null)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
      scanAbortRef.current?.abort()
    }
  }, [])

  // ---------------------------------------------------------------------------
  // Voice Recording
  // ---------------------------------------------------------------------------

  async function startRecording() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        const protocol = window.location.protocol
        const host = window.location.host
        toast(`Microphone unavailable on ${protocol}//${host} — use localhost or HTTPS`, { type: "error" })
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4",
      })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        if (chunksRef.current.length > 0) {
          setVoiceState("transcribing")
          const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" })
          await transcribeAudio(blob)
        } else {
          setVoiceState("idle")
        }
      }

      mediaRecorder.start(100)
      setVoiceState("recording")
      setRecordingDuration(0)
      timerRef.current = setInterval(() => {
        setRecordingDuration((d) => {
          if (d + 1 >= 120) stopRecording()
          return d + 1
        })
      }, 1000)
    } catch (err) {
      console.error("Microphone access error:", err)
      let msg = "Could not access microphone"
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") msg = "Microphone permission denied — check browser settings"
        else if (err.name === "NotFoundError") msg = "No microphone found"
        else if (err.name === "NotReadableError") msg = "Microphone is in use by another app"
        else msg = `Microphone error: ${err.name} — ${err.message}`
      }
      toast(msg, { type: "error" })
      setVoiceState("idle")
    }
  }

  function stopRecording() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    if (mediaRecorderRef.current && voiceState === "recording") mediaRecorderRef.current.stop()
  }

  async function transcribeAudio(blob: Blob) {
    try {
      const formData = new FormData()
      formData.append("audio", blob)
      const res = await fetch("/api/speech-to-text", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Transcription failed")
      const { transcript } = await res.json()
      if (transcript?.trim()) {
        setInput((prev) => (prev ? prev + " " + transcript : transcript))
      } else {
        toast("No speech detected", { type: "error" })
      }
    } catch {
      toast("Failed to transcribe audio", { type: "error" })
    } finally {
      setVoiceState("idle")
      setRecordingDuration(0)
    }
  }

  function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  // ---------------------------------------------------------------------------
  // Market scan (Perplexity)
  // ---------------------------------------------------------------------------

  async function runMarketScan() {
    // Abort any in-flight scan
    scanAbortRef.current?.abort()
    const controller = new AbortController()
    scanAbortRef.current = controller

    setIsScanning(true)
    try {
      const res = await fetch("/api/admin/youtube/topic-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ focus: input.trim() || undefined }),
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
    // Scroll + focus textarea so user can see their input landed
    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (el) {
        el.focus()
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
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
        body: JSON.stringify({ input: input.trim(), count: 5 }),
      })
      if (!res.ok) throw new Error("Failed to generate ideas")
      const data = await res.json()
      setIdeas(data.ideas)
      setSelectedIdeas(new Set())
      setStep("ideas")
    } catch {
      toast("Failed to generate ideas", { type: "error" })
    } finally {
      setIsGenerating(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Save
  // ---------------------------------------------------------------------------

  async function saveSelectedIdeas() {
    const selected = ideas.filter((_, i) => selectedIdeas.has(i))
    if (selected.length === 0) return null
    const inputs = selected.map((idea) => ({
      title: idea.title,
      topic: idea.topic,
      target_length: idea.target_length,
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
        toast(`${saved.length} ideas added to pipeline`)
        router.push("/admin/youtube")
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
        router.push(`/admin/youtube/${saved[0].id}`)
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save ideas", { type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  function toggleIdea(index: number) {
    setSelectedIdeas((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Stack gap="lg">
      {/* Header */}
      <Row align="center" gap="sm">
        <Button variant="ghost" size="sm" render={<Link href="/admin/youtube" />}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Stack gap="xs" className="flex-1">
          <Title size="h3">New Script</Title>
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
          {/* Market scan — cold-start helper */}
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
                    audience.
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

          <Stack gap="sm">
            <Text className="font-medium">
              What do you want to make a video about?
            </Text>
            <Text variant="muted" size="sm">
              Type your idea, record a voice note, or pick a suggestion above —
              the AI will distill it into multiple focused script concepts.
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

          {/* Actions */}
          <Row gap="sm" align="center" className="justify-between">
            <Row gap="sm" align="center">
              {voiceState === "idle" && (
                <Button variant="outline" onClick={startRecording} className="gap-2">
                  <MicIcon className="h-4 w-4" />
                  Record Voice Note
                </Button>
              )}
              {voiceState === "recording" && (
                <Button variant="destructive" onClick={stopRecording} className="gap-2 animate-pulse">
                  <SquareIcon className="h-3 w-3 fill-current" />
                  Stop Recording — {formatDuration(recordingDuration)}
                </Button>
              )}
              {voiceState === "transcribing" && (
                <Badge variant="secondary" className="h-9 px-3 gap-1.5">
                  <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                  Transcribing...
                </Badge>
              )}
            </Row>

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
                {ideas.length} ideas generated
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
            {ideas.map((idea, i) => (
              <Collapsible key={i}>
                <Card
                  className={cn(
                    "transition-all",
                    selectedIdeas.has(i)
                      ? "border-primary ring-1 ring-primary/20 bg-primary/5"
                      : "opacity-60 hover:opacity-90"
                  )}
                >
                  <CardContent className="p-0">
                    <CollapsibleTrigger className="w-full text-left">
                      <div className="p-4">
                        {/* Row 1: Checkbox + title + badges + chevron */}
                        <Row align="center" gap="sm">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleIdea(i) }}
                            className={cn(
                              "h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                              selectedIdeas.has(i)
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/30 hover:border-muted-foreground"
                            )}
                          >
                            {selectedIdeas.has(i) && (
                              <CheckCircleIcon className="h-3.5 w-3.5" />
                            )}
                          </button>

                          <Text className="font-medium flex-1 min-w-0">{idea.title}</Text>

                          <Row gap="xs" className="shrink-0">
                            {idea.video_type && (
                              <Badge variant="outline" size="sm">
                                {idea.video_type.replace(/_/g, " ")}
                              </Badge>
                            )}
                            {idea.target_length && (
                              <Badge variant="outline" size="sm">
                                {idea.target_length.replace(/_/g, " ")}
                              </Badge>
                            )}
                            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                              <ChevronDownIcon className="h-5 w-5 transition-transform [[data-open]_&]:rotate-180" strokeWidth={2.5} />
                            </div>
                          </Row>
                        </Row>

                        {/* Row 2: Teaser — hidden when expanded */}
                        <Text
                          variant="muted"
                          size="sm"
                          className="mt-1.5 ml-8 line-clamp-1 [[data-open]_&]:hidden"
                        >
                          {idea.topic}
                        </Text>
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
                      </Stack>
                    </CollapsibleContent>
                  </CardContent>
                </Card>
              </Collapsible>
            ))}
          </Stack>

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
