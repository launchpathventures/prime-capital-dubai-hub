/**
 * CATALYST - Voice Input Component
 *
 * World-class integrated speech-to-text input for scenario practice.
 * Combines text input with voice recording in a single polished interface.
 * 
 * Features:
 * - Integrated mic button inside text input
 * - Smooth state transitions (idle → recording → transcribing)
 * - Animated waveform during recording
 * - Cancel/send controls for recordings
 * - Auto-switches between mic and send icons based on text presence
 */

"use client"

import * as React from "react"
import { MicIcon, SendIcon, XIcon, Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface VoiceInputProps {
  /** Called when voice transcription is complete */
  onTranscript: (text: string) => void
  /** Called when user submits text (Enter key or send button) */
  onTextSubmit?: (text: string) => void
  /** Whether input is disabled */
  disabled?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Custom class name */
  className?: string
}

type RecordingState = "idle" | "preparing" | "recording" | "transcribing"

export interface VoiceInputRef {
  focus: () => void
  clear: () => void
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const VoiceInput = React.forwardRef<VoiceInputRef, VoiceInputProps>(
  function VoiceInput(
    {
      onTranscript,
      onTextSubmit,
      disabled = false,
      placeholder = "Type or speak your response...",
      className,
    },
    ref
  ) {
    const [state, setState] = React.useState<RecordingState>("idle")
    const [countdown, setCountdown] = React.useState<number | null>(null)
    const [duration, setDuration] = React.useState(0)
    const [error, setError] = React.useState<string | null>(null)
    const [textValue, setTextValue] = React.useState("")

    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
    const chunksRef = React.useRef<Blob[]>([])
    const timerRef = React.useRef<NodeJS.Timeout | null>(null)
    const streamRef = React.useRef<MediaStream | null>(null)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    // Max recording duration (60 seconds)
    const MAX_DURATION = 60

    // Expose imperative methods
    React.useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
      clear: () => setTextValue("")
    }))

    // Cleanup on unmount
    React.useEffect(() => {
      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }
      }
    }, [])

    // Auto-clear error
    React.useEffect(() => {
      if (error) {
        const timeout = setTimeout(() => setError(null), 4000)
        return () => clearTimeout(timeout)
      }
    }, [error])

    // Auto-resize textarea
    React.useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
      }
    }, [textValue])

    const startRecording = async () => {
      try {
        setError(null)
        setState("preparing")
        
        // Get microphone access FIRST - this warms up the stream
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true
          } 
        })
        streamRef.current = stream

        // Brief countdown while stream is warming up
        // This ensures no words are lost at the start
        setCountdown(3)
        await new Promise(resolve => setTimeout(resolve, 400))
        setCountdown(2)
        await new Promise(resolve => setTimeout(resolve, 400))
        setCountdown(1)
        await new Promise(resolve => setTimeout(resolve, 400))
        setCountdown(null)

        // Stream is now "warm" - start recording immediately
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported("audio/webm")
            ? "audio/webm"
            : "audio/mp4",
        })
        mediaRecorderRef.current = mediaRecorder
        chunksRef.current = []

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data)
          }
        }

        mediaRecorder.onstop = async () => {
          // Stop all tracks
          stream.getTracks().forEach((track) => track.stop())
          
          // Only process if we have data
          if (chunksRef.current.length > 0) {
            setState("transcribing")

            const blob = new Blob(chunksRef.current, {
              type: mediaRecorder.mimeType || "audio/webm",
            })

            await transcribeAudio(blob)
          } else {
            setState("idle")
          }
        }

        // Start recording with 100ms timeslice for reliable capture
        mediaRecorder.start(100)
        setState("recording")
        setDuration(0)

        // Start timer
        timerRef.current = setInterval(() => {
          setDuration((d) => {
            const newDuration = d + 1
            if (newDuration >= MAX_DURATION) {
              stopRecording()
            }
            return newDuration
          })
        }, 1000)
      } catch (err) {
        console.error("Error starting recording:", err)
        setState("idle")
        setCountdown(null)
        if (err instanceof Error && err.name === "NotAllowedError") {
          setError("Microphone access denied")
        } else {
          setError("Could not access microphone")
        }
      }
    }

    const stopRecording = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      if (mediaRecorderRef.current && state === "recording") {
        mediaRecorderRef.current.stop()
      }
    }

    const cancelRecording = () => {
      // Stop tracks immediately
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      // Clear chunks so onstop doesn't process
      chunksRef.current = []
      
      if (mediaRecorderRef.current && state === "recording") {
        mediaRecorderRef.current.stop()
      }
      
      setState("idle")
      setCountdown(null)
      setDuration(0)
    }

    const transcribeAudio = async (blob: Blob) => {
      try {
        const formData = new FormData()
        formData.append("audio", blob)

        console.log("Sending audio for transcription:", blob.size, "bytes", blob.type)

        const response = await fetch("/api/speech-to-text", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Transcription API error:", response.status, errorText)
          try {
            const errorData = JSON.parse(errorText)
            throw new Error(errorData.error || "Transcription failed")
          } catch {
            throw new Error(`Transcription failed (${response.status})`)
          }
        }

        const { transcript } = await response.json()

        if (transcript && transcript.trim()) {
          onTranscript(transcript)
        } else {
          setError("No speech detected")
        }
      } catch (err) {
        console.error("Transcription error:", err)
        setError(err instanceof Error ? err.message : "Failed to transcribe")
      } finally {
        setState("idle")
        setDuration(0)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleTextSubmit()
      }
    }

    const handleTextSubmit = () => {
      if (textValue.trim() && onTextSubmit) {
        onTextSubmit(textValue.trim())
        setTextValue("")
      }
    }

    const formatDuration = (seconds: number): string => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const isDisabled = disabled || state === "transcribing" || state === "preparing"
    const hasText = textValue.trim().length > 0

    return (
      <div 
        className={cn("voice-input-field", className)}
        data-state={state}
      >
        {/* Error message */}
        {error && (
          <div className="voice-input-field__error">
            {error}
            <button type="button" onClick={() => setError(null)}>
              <XIcon className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Preparing state - countdown before recording */}
        {state === "preparing" && (
          <div className="voice-input-field__preparing">
            <span className="voice-input-field__countdown">{countdown}</span>
            <span className="voice-input-field__preparing-text">Get ready...</span>
            <button
              type="button"
              onClick={cancelRecording}
              className="voice-input-field__cancel"
              title="Cancel"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Recording state */}
        {state === "recording" && (
          <div className="voice-input-field__recording">
            <div className="voice-input-field__waveform">
              <span /><span /><span /><span /><span />
            </div>
            <span className="voice-input-field__duration">
              {formatDuration(duration)}
            </span>
            <div className="voice-input-field__controls">
              <button
                type="button"
                onClick={cancelRecording}
                className="voice-input-field__cancel"
                title="Cancel"
              >
                <XIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={stopRecording}
                className="voice-input-field__send"
                title="Send"
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Transcribing state */}
        {state === "transcribing" && (
          <div className="voice-input-field__transcribing">
            <Loader2Icon className="h-4 w-4 animate-spin" />
            <span>Sending to client...</span>
          </div>
        )}

        {/* Idle state - text input with mic/send */}
        {state === "idle" && (
          <div className="voice-input-field__input">
            <textarea
              ref={textareaRef}
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isDisabled}
              rows={1}
            />
            <button
              type="button"
              onClick={hasText ? handleTextSubmit : startRecording}
              disabled={isDisabled}
              className={cn(
                "voice-input-field__action",
                hasText && "voice-input-field__action--send"
              )}
              title={hasText ? "Send message" : "Record voice"}
            >
              {hasText ? (
                <SendIcon className="h-4 w-4" />
              ) : (
                <MicIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>
    )
  }
)

