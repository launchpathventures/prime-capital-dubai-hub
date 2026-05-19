/**
 * CATALYST - useVoiceNote
 *
 * Records a short voice note, transcribes it via /api/speech-to-text, and
 * hands the text back to the caller. Powers the "Record Voice Note"
 * affordance on every YouTube script-generator input path (brainstorm,
 * write-one-script, review).
 *
 * Lifecycle: idle → recording → transcribing → idle
 *   - Auto-stops at `maxDurationSeconds` (default 120s)
 *   - Surfaces permission / device errors as toasts
 *   - Cleans up timer, recorder, and mic stream on unmount
 */

"use client"

import * as React from "react"
import { toast } from "@/components/ui/toast"

export type VoiceNoteState = "idle" | "recording" | "transcribing"

type UseVoiceNoteOptions = {
  /** Called with the transcribed text once transcription succeeds. */
  onTranscript: (text: string) => void
  /** Hard cap on recording length before it auto-stops. Default 120s. */
  maxDurationSeconds?: number
}

type UseVoiceNoteResult = {
  voiceState: VoiceNoteState
  recordingDuration: number
  startRecording: () => Promise<void>
  stopRecording: () => void
}

export function useVoiceNote({
  onTranscript,
  maxDurationSeconds = 120,
}: UseVoiceNoteOptions): UseVoiceNoteResult {
  const [voiceState, setVoiceState] = React.useState<VoiceNoteState>("idle")
  const [recordingDuration, setRecordingDuration] = React.useState(0)

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const chunksRef = React.useRef<Blob[]>([])
  const streamRef = React.useRef<MediaStream | null>(null)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  const mountedRef = React.useRef(true)

  // Keep the latest callback without making it a startRecording dependency —
  // the MediaRecorder.onstop closure reads it through the ref.
  const onTranscriptRef = React.useRef(onTranscript)
  React.useEffect(() => {
    onTranscriptRef.current = onTranscript
  }, [onTranscript])

  React.useEffect(() => {
    return () => {
      mountedRef.current = false
      if (timerRef.current) clearInterval(timerRef.current)
      // Stop the recorder so its onstop handler tears the stream down. The
      // mountedRef guard inside onstop skips the transcription request, so we
      // don't fire a doomed fetch against an unmounted component.
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  const stopRecording = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    // Key off the recorder's own state, not React state — the auto-stop timer
    // closes over a stale `voiceState` otherwise and the stop never fires.
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop()
    }
  }, [])

  async function transcribeAudio(blob: Blob) {
    try {
      const formData = new FormData()
      formData.append("audio", blob)
      const res = await fetch("/api/speech-to-text", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Transcription failed")
      const { transcript } = await res.json()
      if (transcript?.trim()) {
        onTranscriptRef.current(transcript)
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
        if (!mountedRef.current) return
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
          if (d + 1 >= maxDurationSeconds) stopRecording()
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

  return { voiceState, recordingDuration, startRecording, stopRecording }
}
