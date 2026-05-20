/**
 * CATALYST - VoiceNoteButton
 *
 * Three-state recorder control (idle / recording / transcribing) shared by
 * every YouTube script-generator input path. Pair it with `useVoiceNote`,
 * which owns the MediaRecorder + transcription lifecycle.
 */

"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MicIcon, SquareIcon, Loader2Icon } from "lucide-react"
import type { VoiceNoteState } from "@/lib/hooks/use-voice-note"

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function VoiceNoteButton({
  voiceState,
  recordingDuration,
  onStart,
  onStop,
  idleLabel = "Record Voice Note",
}: {
  voiceState: VoiceNoteState
  recordingDuration: number
  onStart: () => void
  onStop: () => void
  idleLabel?: string
}) {
  if (voiceState === "recording") {
    return (
      <Button variant="destructive" onClick={onStop} className="gap-2 animate-pulse">
        <SquareIcon className="h-3 w-3 fill-current" />
        Stop Recording — {formatDuration(recordingDuration)}
      </Button>
    )
  }

  if (voiceState === "transcribing") {
    return (
      <Badge
        variant="secondary"
        className="h-9 px-3 gap-1.5"
        role="status"
        aria-live="polite"
      >
        <Loader2Icon className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        Transcribing...
      </Badge>
    )
  }

  return (
    <Button variant="outline" onClick={onStart} className="gap-2">
      <MicIcon className="h-4 w-4" />
      {idleLabel}
    </Button>
  )
}
