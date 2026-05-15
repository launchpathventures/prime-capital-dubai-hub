/**
 * CATALYST - Script Chat Panel
 *
 * Slide-in chat drawer for refining a YouTube script. Hosts the conversation
 * with the editor agent. Three flavours of turn from the assistant:
 *
 *   1. Text-only reply — rendered as a normal chat bubble
 *   2. Direct-edit tool call (replace_section / replace_entire_script) — the
 *      edit is already applied server-side, we just render the explanation
 *      with a green "Applied" badge
 *   3. request_regen — we render the rationale plus a "Run regen" / "Discard"
 *      action row. The user has to explicitly confirm; the regen handler
 *      lives on the parent because it owns the streamed-content display.
 *
 * After a regen is confirmed and completes, the parent calls reloadMessages()
 * to clear the visible thread (server already marked rows cleared_at).
 */

"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Stack, Row, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  SendIcon,
  Loader2Icon,
  CheckCircle2Icon,
  SparklesIcon,
  XIcon,
  MessageSquareTextIcon,
  AlertTriangleIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/toast"
import type {
  YouTubeScript,
  YouTubeScriptMessage,
} from "@/lib/actions/youtube"

// =============================================================================
// TYPES
// =============================================================================

interface ScriptChatPanelProps {
  scriptId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  initialMessages: YouTubeScriptMessage[]
  /** Called when a direct-edit tool was applied — parent should merge into script state. */
  onScriptUpdate: (next: Partial<YouTubeScript>) => void
  /** Called when the user confirms a request_regen. Parent owns the regen stream. */
  onConfirmRegen: (rationale: string) => Promise<void>
  /** True while parent is mid-regen — disables input and shows progress. */
  isRegenerating: boolean
  /** Called by parent after a regen succeeds, signalling the panel to clear. */
  refreshKey: number
  /** Loader the parent gives us so we can reload active messages on demand. */
  loadMessages: () => Promise<YouTubeScriptMessage[]>
}

interface PendingRegen {
  messageId: string
  rationale: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ScriptChatPanel({
  scriptId,
  open,
  onOpenChange,
  initialMessages,
  onScriptUpdate,
  onConfirmRegen,
  isRegenerating,
  refreshKey,
  loadMessages,
}: ScriptChatPanelProps) {
  const [messages, setMessages] = React.useState<YouTubeScriptMessage[]>(initialMessages)
  const [input, setInput] = React.useState("")
  const [isSending, setIsSending] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // After a regen completes the parent bumps refreshKey — pull the latest
  // active messages (should be empty, since regen clears the thread).
  React.useEffect(() => {
    if (refreshKey === 0) return
    let cancelled = false
    void loadMessages().then((fresh) => {
      if (!cancelled) setMessages(fresh)
    })
    return () => {
      cancelled = true
    }
  }, [refreshKey, loadMessages])

  // Auto-scroll to bottom on new message
  React.useEffect(() => {
    if (!open) return
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages, open, isSending])

  // Focus the input when the panel opens
  React.useEffect(() => {
    if (!open) return
    // Defer one tick to let the sheet animation settle
    const t = setTimeout(() => textareaRef.current?.focus(), 120)
    return () => clearTimeout(t)
  }, [open])

  // -------------------------------------------------------------------------
  // Send a chat turn
  // -------------------------------------------------------------------------

  async function handleSend() {
    const text = input.trim()
    if (!text || isSending || isRegenerating) return

    // Optimistic user bubble — we'll replace with the server row once it returns
    const optimistic: YouTubeScriptMessage = {
      id: `optimistic-${Date.now()}`,
      script_id: scriptId,
      role: "user",
      content: text,
      tool_name: null,
      tool_input: null,
      cleared_at: null,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimistic])
    setInput("")
    setIsSending(true)

    try {
      const res = await fetch("/api/admin/youtube/chat-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scriptId, userMessage: text }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(err.error || `Chat failed (${res.status})`)
      }
      const data = await res.json() as {
        userMessage: YouTubeScriptMessage
        assistantMessage: YouTubeScriptMessage
        updatedScript: Partial<YouTubeScript> | null
        toolError: string | null
      }
      // Replace optimistic with server rows; append assistant
      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m.id !== optimistic.id)
        return [...withoutOptimistic, data.userMessage, data.assistantMessage]
      })
      if (data.updatedScript) {
        onScriptUpdate(data.updatedScript)
        toast("Edit applied to script")
      }
      if (data.toolError) {
        toast(data.toolError, { type: "error" })
      }
    } catch (err) {
      console.error("Chat error:", err)
      toast(err instanceof Error ? err.message : "Failed to send message", { type: "error" })
      // Roll back the optimistic message so the user can retry
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id))
      setInput(text)
    } finally {
      setIsSending(false)
    }
  }

  // -------------------------------------------------------------------------
  // Pending request_regen → confirmation handling
  // -------------------------------------------------------------------------

  // The most recent assistant message with a pending request_regen tool call.
  // It's "pending" if it's the very last message in the thread — once any
  // further user message lands, the regen offer is treated as withdrawn.
  const pendingRegen: PendingRegen | null = React.useMemo(() => {
    if (messages.length === 0) return null
    const last = messages[messages.length - 1]
    if (last.role !== "assistant") return null
    if (last.tool_name !== "request_regen") return null
    const rationale = String(
      (last.tool_input as { rationale?: string } | null)?.rationale ?? ""
    )
    if (!rationale.trim()) return null
    return { messageId: last.id, rationale }
  }, [messages])

  async function handleConfirmRegen() {
    if (!pendingRegen) return
    try {
      await onConfirmRegen(pendingRegen.rationale)
    } catch (err) {
      console.error("Regen confirm error:", err)
      toast(err instanceof Error ? err.message : "Failed to regenerate", { type: "error" })
    }
  }

  function handleDiscardRegen() {
    // Local-only — the AI's message stays in history but the offer is
    // dismissed for this thread. The user can ask for a regen again.
    if (!pendingRegen) return
    const dismissId = pendingRegen.messageId
    setMessages((prev) =>
      prev.map((m) =>
        m.id === dismissId
          ? {
              ...m,
              // Strip the tool data so the pendingRegen memo treats it as
              // text-only on next render. Tool history in DB stays intact.
              tool_name: null,
              tool_input: null,
            }
          : m
      )
    )
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-lg flex flex-col p-0 gap-0"
        showCloseButton={false}
      >
        {/* Header */}
        <SheetHeader className="border-b">
          <Row align="center" gap="sm" className="justify-between">
            <Row align="center" gap="sm">
              <MessageSquareTextIcon className="h-5 w-5 text-primary" />
              <Stack gap="xs">
                <SheetTitle>Chat with the editor</SheetTitle>
                <SheetDescription>
                  Ask for edits, tweaks, or a full regen. The editor sees the
                  full brand guide and format spec.
                </SheetDescription>
              </Stack>
            </Row>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenChange(false)}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </Row>
        </SheetHeader>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.length === 0 && !isRegenerating && (
            <EmptyState />
          )}
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {isSending && <TypingIndicator />}
          {isRegenerating && <RegenIndicator />}
        </div>

        {/* Pending regen confirmation */}
        {pendingRegen && !isRegenerating && (
          <div className="border-t bg-amber-50 dark:bg-amber-950/40 px-4 py-3">
            <Stack gap="sm">
              <Row align="center" gap="xs">
                <AlertTriangleIcon className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                <Text size="sm" className="font-medium text-amber-900 dark:text-amber-200">
                  Confirm full regeneration?
                </Text>
              </Row>
              <Text size="sm" className="text-amber-900/90 dark:text-amber-100/90">
                We&apos;ll snapshot the current draft, clear this chat, then
                rewrite from scratch using the brief above. The snapshot is
                kept in version history.
              </Text>
              <Row gap="sm">
                <Button size="sm" onClick={handleConfirmRegen}>
                  <SparklesIcon className="h-4 w-4 mr-1.5" />
                  Run regen
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDiscardRegen}>
                  Keep editing instead
                </Button>
              </Row>
            </Stack>
          </div>
        )}

        {/* Composer */}
        <div className="border-t p-3">
          <Stack gap="xs">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  void handleSend()
                }
              }}
              placeholder={
                isRegenerating
                  ? "Regenerating… chat unavailable until it finishes"
                  : "Ask for an edit, or paste validation feedback to address…"
              }
              disabled={isSending || isRegenerating}
              className="min-h-[80px] resize-none text-sm"
            />
            <Row align="center" className="justify-between">
              <Text variant="muted" size="sm">
                {input.length > 0 && `${input.length.toLocaleString()} chars`}
                {input.length === 0 && "⌘+Enter to send"}
              </Text>
              <Button
                size="sm"
                onClick={handleSend}
                disabled={!input.trim() || isSending || isRegenerating}
              >
                {isSending ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <SendIcon className="h-4 w-4 mr-1.5" />
                    Send
                  </>
                )}
              </Button>
            </Row>
          </Stack>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function MessageBubble({ message }: { message: YouTubeScriptMessage }) {
  const isUser = message.role === "user"
  const toolName = message.tool_name
  const toolInput = message.tool_input as { heading?: string; explanation?: string; rationale?: string } | null

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-lg bg-primary text-primary-foreground px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    )
  }

  // Assistant
  return (
    <div className="flex flex-col gap-1.5">
      {message.content && (
        <div className="max-w-[92%] rounded-lg border bg-muted/40 px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      )}
      {toolName === "replace_section" && toolInput && (
        <Row gap="xs" align="center" className="ml-1">
          <Badge variant="secondary" size="sm">
            <CheckCircle2Icon className="h-3 w-3 mr-1" />
            Edited <code className="ml-1 px-1 rounded bg-background/60">## {toolInput.heading}</code>
          </Badge>
        </Row>
      )}
      {toolName === "replace_entire_script" && (
        <Row gap="xs" align="center" className="ml-1">
          <Badge variant="secondary" size="sm">
            <CheckCircle2Icon className="h-3 w-3 mr-1" />
            Full body rewritten
          </Badge>
        </Row>
      )}
      {toolName === "request_regen" && toolInput?.rationale && (
        <div className="max-w-[92%] rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800/60 px-3.5 py-2 text-sm">
          <Text size="sm" className="font-medium mb-1">
            Proposed regen brief
          </Text>
          <Text size="sm" className="whitespace-pre-wrap">
            {toolInput.rationale}
          </Text>
        </div>
      )}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-3.5 py-2 text-sm text-muted-foreground">
      <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
      <span>Editor is thinking…</span>
    </div>
  )
}

function RegenIndicator() {
  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 px-3.5 py-3 text-sm">
      <Row align="center" gap="sm">
        <Loader2Icon className="h-4 w-4 animate-spin text-primary" />
        <Stack gap="xs">
          <Text size="sm" className="font-medium">Regenerating</Text>
          <Text variant="muted" size="sm">
            The new draft is streaming into the script view. The chat will
            reset once the rewrite is saved.
          </Text>
        </Stack>
      </Row>
    </div>
  )
}

function EmptyState() {
  return (
    <Stack gap="md" className="items-center text-center py-12 px-4">
      <div className={cn(
        "h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center",
      )}>
        <MessageSquareTextIcon className="h-6 w-6 text-primary" />
      </div>
      <Stack gap="xs" className="items-center max-w-xs">
        <Text className="font-medium">Refine through chat</Text>
        <Text variant="muted" size="sm">
          Ask for surgical edits (&ldquo;tighten the hook&rdquo;), point at
          validation feedback, or ask for a full regen with a different angle.
        </Text>
      </Stack>
    </Stack>
  )
}
