/**
 * CATALYST - Feedback Voice Input
 *
 * Integrated textarea with voice recording button.
 * Mic button inside the input area for clear UX relationship.
 * Uses MediaRecorder API + Deepgram for transcription.
 */

"use client"

import { useState, useRef } from "react"
import { Mic, Square, Loader2, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { uploadFeedbackAudio } from "@/lib/lms/feedback"

type Props = {
  text: string
  onTextChange: (text: string) => void
  onTranscription: (text: string, audioPath: string) => void
}

export function FeedbackVoice({ text, onTextChange, onTranscription }: Props) {
  const [recording, setRecording] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string>()
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const startRecording = async () => {
    try {
      setError(undefined)
      
      // Get microphone access first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      // Brief countdown to let user prepare
      setCountdown(3)
      await new Promise(resolve => setTimeout(resolve, 400))
      setCountdown(2)
      await new Promise(resolve => setTimeout(resolve, 400))
      setCountdown(1)
      await new Promise(resolve => setTimeout(resolve, 400))
      setCountdown(null)
      
      // Now start recording - stream is already "warm"
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
        streamRef.current = null
        await processRecording(blob)
      }

      // Start with 100ms timeslice for more reliable capture
      mediaRecorder.start(100)
      setRecording(true)
    } catch (err) {
      console.error("Failed to start recording:", err)
      setError("Could not access microphone")
      setCountdown(null)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  const cancelCountdown = () => {
    setCountdown(null)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  const processRecording = async (blob: Blob) => {
    setProcessing(true)
    try {
      // Upload audio to Supabase Storage
      const formData = new FormData()
      formData.append("audio", blob, "recording.webm")
      
      let audioPath: string
      try {
        audioPath = await uploadFeedbackAudio(formData)
      } catch (uploadErr) {
        console.error("Upload failed:", uploadErr)
        setError("Failed to upload audio")
        setProcessing(false)
        return
      }

      // Transcribe with Deepgram
      const response = await fetch("/api/feedback/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioPath }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Transcription API error:", errorText)
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

  // Get status text for the bar
  const getStatusContent = () => {
    if (processing) {
      return (
        <span className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Transcribing...
        </span>
      )
    }
    if (countdown !== null) {
      return (
        <span className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold animate-pulse">
            {countdown}
          </span>
          <span className="text-muted-foreground">Get ready...</span>
          <button
            type="button"
            onClick={cancelCountdown}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Cancel
          </button>
        </span>
      )
    }
    if (recording) {
      return (
        <span className="flex items-center gap-2 text-red-500">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Recording... tap to stop
        </span>
      )
    }
    return (
      <span className="text-muted-foreground">
        Type or tap <Mic className="inline h-3.5 w-3.5 mx-0.5" /> to record
      </span>
    )
  }

  return (
    <div className="feedback-input-wrapper">
      <Textarea
        id="feedback-text"
        placeholder="Describe the issue, missing content, or suggestion..."
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        rows={4}
        className="feedback-input-textarea"
        disabled={recording || countdown !== null || processing}
      />
      
      {/* Bottom bar with mic button and status */}
      <div className="feedback-input-bar">
        <div className="feedback-input-status text-xs">
          {getStatusContent()}
        </div>
        
        {recording ? (
          <button
            type="button"
            onClick={stopRecording}
            className="feedback-input-mic feedback-input-mic--recording"
            aria-label="Stop recording"
          >
            <Square className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            disabled={countdown !== null || processing}
            className="feedback-input-mic"
            aria-label="Record voice message"
          >
            <Mic className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {error && (
        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
          <X className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  )
}
