/**
 * CATALYST - Feedback Voice Recording
 *
 * Voice recording component with Deepgram transcription.
 * Uses MediaRecorder API for audio capture.
 */

"use client"

import { useState, useRef } from "react"
import { Mic, Square, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadFeedbackAudio } from "@/lib/lms/feedback"

type Props = {
  onTranscription: (text: string, audioPath: string) => void
}

export function FeedbackVoice({ onTranscription }: Props) {
  const [recording, setRecording] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string>()
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      setError(undefined)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      })

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        stream.getTracks().forEach((track) => track.stop())
        await processRecording(blob)
      }

      mediaRecorder.start()
      setRecording(true)
    } catch (err) {
      console.error("Failed to start recording:", err)
      setError("Could not access microphone")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  const processRecording = async (blob: Blob) => {
    setProcessing(true)
    try {
      // Upload audio to Supabase Storage
      const formData = new FormData()
      formData.append("audio", blob, "recording.webm")
      const audioPath = await uploadFeedbackAudio(formData)

      // Transcribe with Deepgram
      const response = await fetch("/api/feedback/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioPath }),
      })

      if (!response.ok) {
        throw new Error("Transcription failed")
      }

      const { transcript } = await response.json()
      onTranscription(transcript, audioPath)
    } catch (err) {
      console.error("Failed to process recording:", err)
      setError("Failed to transcribe audio")
    } finally {
      setProcessing(false)
    }
  }

  if (processing) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Transcribing...
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {recording ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={stopRecording}
          >
            <Square className="h-4 w-4 mr-1" />
            Stop
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={startRecording}
          >
            <Mic className="h-4 w-4 mr-1" />
            Record Voice
          </Button>
        )}
        {recording && (
          <span className="text-sm text-red-500 animate-pulse">
            Recording...
          </span>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
