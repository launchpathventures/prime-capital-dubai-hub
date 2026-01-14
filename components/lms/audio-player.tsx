/**
 * CATALYST - Audio Player
 * 
 * Streamlined audio player with one-click play.
 * Transcript toggle is optional - doesn't block playback.
 * Designed for inline placement in module content.
 */

"use client"

import { useState, useRef, useEffect } from "react"
import { Row, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  PlayIcon, 
  PauseIcon, 
  HeadphonesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookOpenIcon,
  WrenchIcon,
  FootprintsIcon,
} from "lucide-react"
import { MarkdownRenderer } from "./markdown-renderer"
import { cn } from "@/lib/utils"

// =============================================================================
// Types
// =============================================================================

export interface AudioTrack {
  slug: string
  title: string
  type: "intro" | "demo" | "walkthrough"
  duration: string
  audioUrl: string | null
  transcript: string
}

// =============================================================================
// Utilities
// =============================================================================

function stripFrontmatter(content: string): string {
  // Remove YAML frontmatter (--- ... ---)
  return content.replace(/^---[\s\S]*?---\n*/m, "").trim()
}

interface AudioPlayerProps {
  track: AudioTrack
  variant?: "full" | "compact" | "inline"
  className?: string
  showTranscriptByDefault?: boolean
}

// =============================================================================
// Constants
// =============================================================================

const TYPE_CONFIG = {
  intro: {
    icon: BookOpenIcon,
    label: "Introduction",
    color: "text-blue-600",
    bgColor: "bg-blue-500",
    lightBg: "bg-blue-50",
  },
  demo: {
    icon: WrenchIcon,
    label: "Demonstration",
    color: "text-amber-600",
    bgColor: "bg-amber-500",
    lightBg: "bg-amber-50",
  },
  walkthrough: {
    icon: FootprintsIcon,
    label: "Walkthrough",
    color: "text-emerald-600",
    bgColor: "bg-emerald-500",
    lightBg: "bg-emerald-50",
  },
}

// =============================================================================
// Component
// =============================================================================

export function AudioPlayer({ 
  track,
  variant = "full",
  className,
  showTranscriptByDefault = false,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showTranscript, setShowTranscript] = useState(showTranscriptByDefault)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const config = TYPE_CONFIG[track.type]
  const Icon = config.icon
  
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }
    
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    return () => audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
  }, [track.audioUrl])
  
  const togglePlay = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }
  
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }
  
  const displayDuration = duration > 0 ? formatTime(duration) : track.duration
  
  // Compact inline variant - just play button and basic info
  if (variant === "inline") {
    return (
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-lg border bg-card",
        className
      )}>
        {track.audioUrl && (
          <audio 
            ref={audioRef}
            src={track.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          />
        )}
        
        <button
          onClick={togglePlay}
          disabled={!track.audioUrl}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all",
            track.audioUrl 
              ? "bg-primary text-primary-foreground hover:bg-primary/90" 
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {isPlaying ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4 ml-0.5" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <Text weight="medium" className="truncate">{config.label}</Text>
          <Text size="sm" className="text-muted-foreground">{displayDuration}</Text>
        </div>
        
        {track.transcript && (
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            {showTranscript ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    )
  }
  
  // Full variant - main audio section
  return (
    <div className={cn(
      "rounded-xl border overflow-hidden",
      "bg-gradient-to-br from-primary/5 via-background to-primary/5",
      className
    )}>
      {track.audioUrl && (
        <audio 
          ref={audioRef}
          src={track.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      )}
      
      {/* Main player row */}
      <div className="p-4">
        <Row align="center" gap="md">
          {/* Play button - primary action */}
          <button
            onClick={togglePlay}
            disabled={!track.audioUrl}
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-all shadow-md",
              track.audioUrl 
                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105" 
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {isPlaying ? (
              <PauseIcon className="h-6 w-6" />
            ) : (
              <PlayIcon className="h-6 w-6 ml-1" />
            )}
          </button>
          
          {/* Info & progress */}
          <div className="flex-1 min-w-0">
            <Row align="center" gap="sm" className="mb-1">
              <div className={cn("p-1 rounded", config.lightBg)}>
                <Icon className={cn("h-3.5 w-3.5", config.color)} />
              </div>
              <Text size="sm" weight="medium" className={config.color}>
                {config.label}
              </Text>
              <Text size="sm" className="text-muted-foreground">
                • {track.title}
              </Text>
            </Row>
            
            {/* Progress bar */}
            <Row align="center" gap="sm">
              <div className="flex-1">
                <Slider
                  value={[currentTime]}
                  max={duration || 1}
                  step={0.1}
                  onValueChange={handleSeek}
                  disabled={!track.audioUrl}
                  className="cursor-pointer"
                />
              </div>
              <Text size="xs" className="text-muted-foreground w-20 text-right tabular-nums">
                {formatTime(currentTime)} / {displayDuration}
              </Text>
            </Row>
          </div>
        </Row>
      </div>
      
      {/* Transcript toggle - secondary action */}
      {track.transcript && (
        <>
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full px-4 py-2 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-t"
          >
            {showTranscript ? "Hide" : "View"} Transcript
            {showTranscript ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
          
          {showTranscript && (
            <div className="px-4 pb-4 border-t bg-background/50">
              <div className="pt-4 max-h-64 overflow-y-auto">
                <MarkdownRenderer 
                  content={stripFrontmatter(track.transcript)} 
                  className="prose-sm"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// =============================================================================
// Audio Section - Groups multiple tracks
// =============================================================================

interface AudioSectionProps {
  tracks: AudioTrack[]
  className?: string
}

export function AudioSection({ tracks, className }: AudioSectionProps) {
  if (tracks.length === 0) return null
  
  // Single track - show full player
  if (tracks.length === 1) {
    return (
      <section className={className}>
        <AudioPlayer track={tracks[0]} variant="full" />
      </section>
    )
  }
  
  // Multiple tracks - show header + list
  return (
    <section className={cn("space-y-3", className)}>
      <Row align="center" gap="sm" className="px-1">
        <HeadphonesIcon className="h-4 w-4 text-primary" />
        <Text size="sm" weight="medium" className="text-primary">
          Audio Coach
        </Text>
        <Text size="sm" className="text-muted-foreground">
          • {tracks.length} lessons
        </Text>
      </Row>
      
      <div className="space-y-2">
        {tracks.map((track) => (
          <AudioPlayer key={track.slug} track={track} variant="full" />
        ))}
      </div>
    </section>
  )
}
