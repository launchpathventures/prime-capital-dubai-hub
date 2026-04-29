/**
 * CATALYST - Script Detail Page
 *
 * Full-page script view with:
 * - Generate / Regenerate script (streamed)
 * - Validate against brand guide
 * - Download as PDF
 * - Status management
 * - Delete
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Stack, Row, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import {
  ArrowLeftIcon,
  Loader2Icon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  FileTextIcon,
  ShieldCheckIcon,
  DownloadIcon,
} from "lucide-react"
import {
  type YouTubeScript,
  type ScriptStatus,
  updateYouTubeScript,
  updateScriptStatus,
  deleteYouTubeScript,
} from "@/lib/actions/youtube"
import { FORMAT_META, DEFAULT_FORMAT } from "@/lib/youtube/prompts"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

// =============================================================================
// CONSTANTS
// =============================================================================

const STATUS_OPTIONS: { value: ScriptStatus; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "script_drafted", label: "Script Drafted" },
  { value: "script_ready", label: "Script Ready" },
  { value: "script_recorded", label: "Script Recorded" },
  { value: "script_live", label: "Script Live" },
]

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Extract a named section from markdown by matching "## {title}" to the next "## "
 * or end of document. Returns the section's body (excluding the heading).
 */
function extractMarkdownSection(markdown: string, titlePattern: RegExp): string | null {
  // Match `## <title>...\n` up to the next `## ` or EOF
  const regex = new RegExp(
    `##\\s+${titlePattern.source}[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s|$)`,
    "i"
  )
  const match = markdown.match(regex)
  if (!match) return null
  return match[1].trim().replace(/^---+\s*$/gm, "").trim() || null
}

function parseScriptSections(markdown: string): {
  packaging: string | null
  hook_v1: string | null
  hook_v2: string | null
} {
  return {
    packaging: extractMarkdownSection(markdown, /Packaging/),
    hook_v1: extractMarkdownSection(markdown, /Hook\s*V?1/),
    hook_v2: extractMarkdownSection(markdown, /Hook\s*V?2/),
  }
}

function buildValidationFeedback(notes: Record<string, unknown>): string {
  const parts: string[] = []

  if (notes.overall) parts.push(`OVERALL: ${notes.overall}`)

  const checks = notes.checks as { category: string; passed: boolean; notes: string }[] | undefined
  if (checks) {
    const failed = checks.filter((c) => !c.passed)
    if (failed.length > 0) {
      parts.push("FAILED CHECKS:")
      for (const c of failed) {
        parts.push(`- ${c.category}: ${c.notes}`)
      }
    }
  }

  const banned = notes.banned_words_found as string[] | undefined
  if (banned && banned.length > 0) {
    parts.push(`BANNED WORDS FOUND: ${banned.join(", ")}`)
  }

  const suggestions = notes.suggestions as string[] | undefined
  if (suggestions && suggestions.length > 0) {
    parts.push("SUGGESTIONS:")
    for (const s of suggestions) {
      parts.push(`- ${s}`)
    }
  }

  return parts.join("\n")
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ScriptDetailPage({ script: initial }: { script: YouTubeScript }) {
  const router = useRouter()
  const [script, setScript] = React.useState(initial)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isValidating, setIsValidating] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [showDelete, setShowDelete] = React.useState(false)
  const [streamedContent, setStreamedContent] = React.useState("")
  const abortRef = React.useRef<AbortController | null>(null)

  const hasScript = !!script.script_body
  const hasValidation = script.validation_score !== null
  const displayContent = script.script_body || streamedContent

  // Abort any in-flight stream on unmount
  React.useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  async function handleStatusChange(newStatus: ScriptStatus) {
    const result = await updateScriptStatus(script.id, newStatus)
    if (result.success) {
      setScript(result.data)
      toast("Status updated")
    } else {
      toast("Failed to update status", { type: "error" })
    }
  }

  // ---------------------------------------------------------------------------
  // Generate Script
  // ---------------------------------------------------------------------------

  async function handleGenerateScript() {
    // Abort any in-flight generation (e.g., user clicked Regenerate during streaming)
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsGenerating(true)
    setStreamedContent("")

    // Build validation feedback for regeneration (captured BEFORE clearing state)
    const validationFeedback = hasScript && script.validation_notes
      ? buildValidationFeedback(script.validation_notes as Record<string, unknown>)
      : undefined

    // Clear stale validation UI so we don't show old red cards while new content streams
    setScript((prev) => ({
      ...prev,
      validation_score: null,
      validation_notes: null,
      validated_at: null,
    }))

    try {
      const res = await fetch("/api/admin/youtube/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          title: script.title,
          topic: script.topic || script.title,
          format: script.format || DEFAULT_FORMAT,
          scriptId: script.id,
          previousScript: hasScript ? script.script_body : undefined,
          validationFeedback,
        }),
      })

      if (!res.ok) {
        const errText = await res.text().catch(() => "")
        console.error("Generate script failed:", res.status, errText)
        throw new Error(`Failed to generate script (${res.status})`)
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ""
      let streamComplete = false
      let streamAborted = false

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) { streamComplete = true; break }
            const chunk = decoder.decode(value, { stream: true })
            fullText += chunk
            setStreamedContent(fullText)
          }
        } catch (err) {
          // Distinguish user-initiated abort from genuine stream failure
          if (err instanceof DOMException && err.name === "AbortError") {
            streamAborted = true
          } else {
            console.error("Stream read error:", err)
            toast("Stream interrupted — partial content shown was not saved", { type: "error" })
          }
        }
      }

      if (streamAborted) return
      if (!fullText.trim()) throw new Error("No content received")
      if (!streamComplete) {
        // Non-abort failure with partial content — clear display and inform user
        setStreamedContent("")
        throw new Error("Generation failed before completing — please try again")
      }

      const wordCount = fullText.split(/\s+/).filter(Boolean).length
      const sections = parseScriptSections(fullText)
      const result = await updateYouTubeScript(script.id, {
        script_body: fullText,
        word_count: wordCount,
        status: "script_drafted",
        packaging: sections.packaging || undefined,
        hook_v1: sections.hook_v1 || undefined,
        hook_v2: sections.hook_v2 || undefined,
      })
      if (!result.success) {
        throw new Error(result.error || "Failed to save script")
      }
      setScript(result.data)
      toast("Script generated — running validation...")
      // Auto-validate after generation, passing the fresh script state so we
      // don't rely on the stale closure reference to `script`.
      setIsGenerating(false)
      await runValidation(fullText, result.data)
    } catch (err) {
      // Silently swallow user-initiated aborts
      if (err instanceof DOMException && err.name === "AbortError") {
        return
      }
      console.error("Generate script error:", err)
      const msg = err instanceof Error ? err.message : "Failed to generate script"
      toast(msg, { type: "error" })
    } finally {
      setIsGenerating(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Validate
  // ---------------------------------------------------------------------------

  async function runValidation(scriptBody?: string, freshScript?: YouTubeScript) {
    const src = freshScript || script
    const body = scriptBody || src.script_body || streamedContent
    if (!body) return
    setIsValidating(true)
    try {
      const res = await fetch("/api/admin/youtube/validate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scriptId: src.id,
          scriptBody: body,
          format: src.format || DEFAULT_FORMAT,
          packaging: src.packaging,
          hookV1: src.hook_v1,
          hookV2: src.hook_v2,
        }),
      })
      if (!res.ok) {
        const errText = await res.text().catch(() => "")
        console.error("Validation failed:", res.status, errText)
        throw new Error(`Failed to validate (${res.status})`)
      }
      const data = await res.json()
      if (!data.validation || typeof data.validation.score !== "number") {
        console.error("Invalid validation response:", data)
        throw new Error("Invalid validation response")
      }
      const score = data.validation.score
      setScript((prev) => ({
        ...prev,
        validation_score: score,
        validation_notes: data.validation,
        validated_at: new Date().toISOString(),
      }))
      if (score >= 70) {
        toast(`Validation passed: ${score}/100`)
      } else {
        toast(`Validation flagged issues: ${score}/100 — review feedback below`, { type: "error" })
      }
    } catch (err) {
      console.error("Validation error:", err)
      const msg = err instanceof Error ? err.message : "Failed to validate script"
      toast(msg, { type: "error" })
    } finally {
      setIsValidating(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  async function handleDelete() {
    setIsDeleting(true)
    const result = await deleteYouTubeScript(script.id)
    if (result.success) {
      toast("Script deleted")
      router.push("/admin/youtube")
    } else {
      toast("Failed to delete", { type: "error" })
      setIsDeleting(false)
      setShowDelete(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Validation display
  // ---------------------------------------------------------------------------

  const validationNotes = script.validation_notes as {
    overall?: string
    score?: number
    checks?: { category: string; passed: boolean; notes: string }[]
    suggestions?: string[]
    banned_words_found?: string[]
  } | null

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Stack gap="lg">
      {/* Header + back nav */}
      <Row align="start" gap="sm">
        <Button variant="ghost" size="sm" className="mt-1" render={<Link href="/admin/youtube" />}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Stack gap="xs" className="flex-1 min-w-0">
          <Title size="h3" className="line-clamp-2">{script.title}</Title>
          {script.topic && (
            <Text variant="muted" size="sm" className="line-clamp-2">
              {script.topic}
            </Text>
          )}
          {script.format && (
            <Row gap="xs" align="center">
              <Badge variant="outline" size="sm">
                {FORMAT_META[script.format].label}
              </Badge>
              <Text variant="muted" size="sm">
                {FORMAT_META[script.format].minutesLabel} · {FORMAT_META[script.format].wordsLabel}
              </Text>
            </Row>
          )}
        </Stack>
      </Row>

      {/* Action bar */}
      <Row gap="sm" wrap className="py-3 px-4 -mx-4 border-y bg-muted/20 rounded-lg">
        <Select
          value={script.status}
          onValueChange={(value) => handleStatusChange(value as ScriptStatus)}
          items={STATUS_OPTIONS}
        >
          <SelectTrigger className="h-9 w-44 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {!hasScript && !isGenerating && (
          <Button size="sm" onClick={handleGenerateScript}>
            <SparklesIcon className="h-4 w-4 mr-1.5" />
            Generate Script
          </Button>
        )}
        {hasScript && !isGenerating && (
          <Button size="sm" variant="outline" onClick={handleGenerateScript}>
            <SparklesIcon className="h-4 w-4 mr-1.5" />
            Regenerate
          </Button>
        )}
        {hasScript && (
          <Button
            size="sm"
            variant="outline"
            render={
              <a
                href={`/api/admin/youtube/${script.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <DownloadIcon className="h-4 w-4 mr-1.5" />
            PDF
          </Button>
        )}

        {isGenerating && (
          <Badge variant="secondary">
            <Loader2Icon className="h-3 w-3 animate-spin mr-1.5" />
            Generating...
          </Badge>
        )}
        {isValidating && (
          <Badge variant="secondary">
            <Loader2Icon className="h-3 w-3 animate-spin mr-1.5" />
            Validating...
          </Badge>
        )}

        {/* Validation score — prominent display */}
        {hasValidation && !isValidating && (
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium",
            script.validation_score! >= 70
              ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
          )}>
            <ShieldCheckIcon className="h-4 w-4" />
            Validation: {script.validation_score}/100
          </div>
        )}

        <div className="flex-1" />

        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={() => setShowDelete(true)}
        >
          <TrashIcon className="h-4 w-4 mr-1.5" />
          Delete
        </Button>
      </Row>

      {/* Validation results */}
      {validationNotes && (
        <Stack gap="sm" className="rounded-lg border p-5">
          <Row align="center" gap="sm">
            <ShieldCheckIcon className="h-5 w-5 text-primary" />
            <Title size="h5">Validation Results</Title>
            <Badge variant={(validationNotes.score ?? 0) >= 70 ? "default" : "destructive"}>
              {validationNotes.score}/100
            </Badge>
          </Row>

          {validationNotes.overall && (
            <Text size="sm">{validationNotes.overall}</Text>
          )}

          {validationNotes.checks && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {validationNotes.checks.map((check, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-md border p-4",
                    check.passed
                      ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
                      : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
                  )}
                >
                  <Row gap="xs" align="center" className="mb-2">
                    {check.passed ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                    )}
                    <Text size="sm" className="font-medium">{check.category}</Text>
                  </Row>
                  <Text variant="muted" size="sm">{check.notes}</Text>
                </div>
              ))}
            </div>
          )}

          {validationNotes.banned_words_found && validationNotes.banned_words_found.length > 0 && (
            <Stack gap="xs">
              <Text size="sm" className="font-medium text-destructive">
                Banned words detected:
              </Text>
              <Row gap="xs" wrap>
                {validationNotes.banned_words_found.map((word, i) => (
                  <Badge key={i} variant="destructive" size="sm">{word}</Badge>
                ))}
              </Row>
            </Stack>
          )}

          {validationNotes.suggestions && validationNotes.suggestions.length > 0 && (
            <Stack gap="xs">
              <Text size="sm" className="font-medium">Suggestions:</Text>
              <ul className="list-disc list-inside space-y-1">
                {validationNotes.suggestions.map((s, i) => (
                  <li key={i}>
                    <Text as="span" variant="muted" size="sm">{s}</Text>
                  </li>
                ))}
              </ul>
            </Stack>
          )}
        </Stack>
      )}

      {/* Script content */}
      {displayContent ? (
        <Stack gap="sm">
          <Row align="center" gap="sm" className="justify-between">
            <Row align="center" gap="sm">
              <FileTextIcon className="h-5 w-5 text-primary" />
              <Title size="h5">Script</Title>
              {script.word_count && (
                <Text variant="muted" size="sm">
                  {script.word_count.toLocaleString()} words
                </Text>
              )}
            </Row>
            {hasScript && (
              <Button
                size="sm"
                variant="outline"
                render={
                  <a
                    href={`/api/admin/youtube/${script.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <DownloadIcon className="h-4 w-4 mr-1.5" />
                Download PDF
              </Button>
            )}
          </Row>
          <div className={cn(
            "rounded-lg border bg-muted/20 p-8 md:p-10 max-w-none",
            // Prose base
            "prose prose-base dark:prose-invert",
            // Headings
            "prose-headings:text-foreground",
            "prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-6 prose-h1:pb-3 prose-h1:border-b-2 prose-h1:border-primary/20",
            "prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border",
            "prose-h3:text-base prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-2",
            // Body
            "prose-p:leading-relaxed prose-p:mb-4 prose-p:text-foreground/90",
            // Horizontal rules — section dividers
            "prose-hr:my-8 prose-hr:border-border",
            // Tables — packaging section
            "prose-table:my-4 prose-th:text-left prose-th:font-semibold prose-th:text-foreground prose-th:py-2 prose-th:px-3 prose-th:bg-muted/50",
            "prose-td:py-2 prose-td:px-3 prose-td:align-top",
            // Strong / emphasis
            "prose-strong:text-foreground prose-strong:font-semibold",
          )}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {displayContent}
            </ReactMarkdown>
          </div>
        </Stack>
      ) : (
        <Stack gap="md" className="items-center py-16 rounded-lg border border-dashed">
          <FileTextIcon className="h-12 w-12 text-muted-foreground/30" />
          <Stack gap="xs" className="items-center text-center max-w-md">
            <Text className="font-medium">No script generated yet</Text>
            <Text variant="muted" size="sm">
              Click &ldquo;Generate Script&rdquo; to create a full
              teleprompter-ready script from this idea.
            </Text>
          </Stack>
          <Button onClick={handleGenerateScript} disabled={isGenerating} size="lg">
            {isGenerating ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4 mr-2" />
                Generate Script
              </>
            )}
          </Button>
        </Stack>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Script</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{script.title}&rdquo;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <TrashIcon className="h-4 w-4 mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Stack>
  )
}
