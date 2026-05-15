/**
 * CATALYST - Review & Rewrite Workflow (Mode A)
 *
 * Single-step flow:
 *   - User pastes an existing script (text or .md / .txt upload)
 *   - User picks the format the script is intended to be (required)
 *   - Optional working title — derived from the first heading if omitted
 *   - Submit creates a youtube_scripts row with script_body filled and
 *     status = script_drafted, then redirects to the detail page with
 *     ?autoValidate=1 so the user immediately sees the validator verdict
 *
 * The actual rewrite loop reuses the existing /generate-script regen path
 * (previousScript + validationFeedback) once the user is on the detail page.
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Stack, Row, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Loader2Icon,
  ShieldCheckIcon,
  UploadIcon,
  BarChart3Icon,
  AxeIcon,
  FlameIcon,
  UserIcon,
  ListOrderedIcon,
  MessageCircleQuestionIcon,
} from "lucide-react"
import { createYouTubeScript } from "@/lib/actions/youtube"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import {
  FORMAT_META,
  FORMATS_IN_DISPLAY_ORDER,
  type Format,
} from "@/lib/youtube/prompts"

// =============================================================================
// HELPERS
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

/** Pull a working title from the first H1 / H2 / first line of the pasted script. */
function deriveTitle(body: string): string {
  const trimmed = body.trim()
  if (!trimmed) return ""
  const headingMatch = trimmed.match(/^#{1,2}\s+(.+)$/m)
  if (headingMatch) return headingMatch[1].trim().slice(0, 200)
  const firstLine = trimmed.split("\n").map((l) => l.trim()).find(Boolean)
  return (firstLine ?? "").slice(0, 200)
}

function wordCount(body: string): number {
  return body.trim().split(/\s+/).filter(Boolean).length
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ReviewScriptWorkflow() {
  const router = useRouter()
  const [scriptBody, setScriptBody] = React.useState("")
  const [format, setFormat] = React.useState<Format | null>(null)
  const [title, setTitle] = React.useState("")
  const [titleDirty, setTitleDirty] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Auto-fill title from the script body until the user types over it.
  React.useEffect(() => {
    if (titleDirty) return
    setTitle(deriveTitle(scriptBody))
  }, [scriptBody, titleDirty])

  // ---------------------------------------------------------------------------
  // File upload
  // ---------------------------------------------------------------------------

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      setScriptBody(text)
    } catch (err) {
      console.error("File read error:", err)
      toast("Failed to read file", { type: "error" })
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // ---------------------------------------------------------------------------
  // Save & launch
  // ---------------------------------------------------------------------------

  async function handleSubmit() {
    if (!scriptBody.trim() || !format) return
    const resolvedTitle = title.trim() || deriveTitle(scriptBody) || "Untitled draft"
    setIsSaving(true)
    try {
      const result = await createYouTubeScript({
        title: resolvedTitle,
        topic: undefined,
        format,
        status: "script_drafted",
        script_body: scriptBody,
        word_count: wordCount(scriptBody),
      })
      if (!result.success) {
        throw new Error(result.error || "Failed to save")
      }
      router.push(`/admin/youtube/${result.data.id}?autoValidate=1`)
    } catch (err) {
      console.error("Save error:", err)
      toast(err instanceof Error ? err.message : "Failed to save", { type: "error" })
      setIsSaving(false)
    }
  }

  const wc = wordCount(scriptBody)
  const canSubmit = !!scriptBody.trim() && !!format && !isSaving

  return (
    <Stack gap="lg">
      {/* Header */}
      <Row align="center" gap="sm">
        <Button variant="ghost" size="sm" render={<Link href="/admin/youtube/new" />}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Stack gap="xs" className="flex-1">
          <Title size="h3">Review & Rewrite</Title>
          <Text variant="muted" size="sm">
            Paste an existing draft. We'll save it, validate against the format
            spec, and you can rewrite to fix every issue.
          </Text>
        </Stack>
      </Row>

      {/* Format picker — required */}
      <Stack gap="sm">
        <Stack gap="xs">
          <Text className="font-medium">
            Which format is this script written in? <span className="text-destructive">*</span>
          </Text>
          <Text variant="muted" size="sm">
            The validator scores structure, hooks, and CTAs against this format's
            spec. Pick the format you want the script measured against.
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

      {/* Title — optional, auto-derived */}
      <Stack gap="sm">
        <Stack gap="xs">
          <Text className="font-medium">
            Working title <span className="text-muted-foreground font-normal">(optional)</span>
          </Text>
          <Text variant="muted" size="sm">
            Auto-derived from the first heading. Edit if you want a different label
            in the pipeline.
          </Text>
        </Stack>
        <Input
          placeholder="e.g. Why off-plan in Dubai Marina is risky in 2026"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setTitleDirty(true)
          }}
        />
      </Stack>

      {/* Script body */}
      <Stack gap="sm">
        <Row align="center" className="justify-between">
          <Stack gap="xs">
            <Text className="font-medium">
              Paste your script <span className="text-destructive">*</span>
            </Text>
            <Text variant="muted" size="sm">
              Markdown is supported. The validator reads packaging + hooks if you
              include them as ## Packaging / ## Hook V1 / ## Hook V2 sections.
            </Text>
          </Stack>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon className="h-4 w-4 mr-2" />
            Upload .md / .txt
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,.txt,text/plain,text/markdown"
            onChange={handleFileUpload}
            className="hidden"
          />
        </Row>
        <Textarea
          placeholder="Paste your script here — markdown headings, body text, CTAs, all welcome. The validator will check structure, voice, banned words, and CTA inventory against the format spec."
          value={scriptBody}
          onChange={(e) => setScriptBody(e.target.value)}
          className="min-h-[420px] resize-y font-mono text-sm leading-relaxed"
        />
        <Text variant="muted" size="sm">
          {wc > 0 ? `${wc.toLocaleString()} words` : "Empty"}
        </Text>
      </Stack>

      {/* Action bar */}
      <Row className="justify-between pt-4 border-t" wrap gap="sm">
        <Text variant="muted" size="sm" className="self-center">
          On submit, we'll save your script as a draft, validate it, then drop you
          on the detail page where you can rewrite or chat.
        </Text>
        <Button onClick={handleSubmit} disabled={!canSubmit} size="lg">
          {isSaving ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
              Saving and validating...
            </>
          ) : (
            <>
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              Save & Validate
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </Row>
    </Stack>
  )
}
