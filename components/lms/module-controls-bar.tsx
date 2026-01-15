/**
 * CATALYST - Module Controls Bar
 * 
 * Two-part control section:
 * 1. Mode toggle (Essentials/Deep Dive) - primary, prominent tabs
 * 2. Audio pills - secondary, compact row below
 * 
 * Clear visual hierarchy with mode toggle as the main decision point.
 */

"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Sparkles, 
  BookOpen, 
  HeadphonesIcon,
  PlayIcon,
  PauseIcon,
  BookOpenIcon,
  WrenchIcon,
  FootprintsIcon,
  Volume2Icon,
} from "lucide-react"
import { Row, Text } from "@/components/core"
import { Slider } from "@/components/ui/slider"

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

interface ModuleControlsBarProps {
  /** Audio tracks available for this module */
  audioTracks?: AudioTrack[]
  /** Duration for essentials mode */
  essentialsDuration?: string
  /** Duration for deep dive mode */
  deepDiveDuration?: string
  /** Whether this module has essentials */
  hasEssentials: boolean
  /** Current mode from server */
  currentMode?: "essentials" | "deepdive"
  /** Additional classes */
  className?: string
}

// =============================================================================
// Constants
// =============================================================================

const AUDIO_TYPE_CONFIG = {
  intro: {
    icon: BookOpenIcon,
    label: "Introduction",
    shortLabel: "Intro",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  demo: {
    icon: WrenchIcon,
    label: "Demonstration",
    shortLabel: "Demo",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  walkthrough: {
    icon: FootprintsIcon,
    label: "Walkthrough",
    shortLabel: "Walkthrough",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
}

// =============================================================================
// Component
// =============================================================================

export function ModuleControlsBar({ 
  audioTracks = [],
  essentialsDuration = "15 min",
  deepDiveDuration = "25 min",
  hasEssentials,
  currentMode: serverMode,
  className
}: ModuleControlsBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [expandedAudio, setExpandedAudio] = useState<string | null>(null)
  
  // Derive mode from server or URL
  const urlMode = searchParams.get("mode")
  const currentMode = serverMode || urlMode || "deepdive"
  
  const setMode = (mode: "essentials" | "deepdive") => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("mode", mode)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }
  
  const toggleAudio = (slug: string) => {
    setExpandedAudio(expandedAudio === slug ? null : slug)
  }
  
  const expandedTrack = audioTracks.find(t => t.slug === expandedAudio)
  const expandedConfig = expandedTrack ? AUDIO_TYPE_CONFIG[expandedTrack.type] : null
  
  const hasAudio = audioTracks.length > 0
  
  // Calculate total audio duration
  const totalAudioMinutes = audioTracks.reduce((acc, track) => {
    const parts = track.duration.split(":")
    const mins = parseInt(parts[0]) || 0
    const secs = parseInt(parts[1]) || 0
    return acc + mins + secs / 60
  }, 0)
  const totalAudioDuration = `${Math.round(totalAudioMinutes)} min`
  
  // Don't render if no essentials and no audio
  if (!hasEssentials && !hasAudio) {
    return null
  }

  return (
    <div className={cn("module-controls", className)}>
      {/* Mode Toggle - Primary, prominent tabs */}
      {hasEssentials && (
        <div className="module-controls__mode-section">
          <div className="module-controls__mode-tabs">
            <button
              onClick={() => setMode("essentials")}
              className={cn(
                "module-controls__mode-tab",
                currentMode === "essentials" && "module-controls__mode-tab--active"
              )}
              aria-pressed={currentMode === "essentials"}
            >
              <div className="module-controls__mode-tab-icon">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="module-controls__mode-tab-content">
                <span className="module-controls__mode-tab-title">Essentials</span>
                <span className="module-controls__mode-tab-meta">{essentialsDuration} • Key facts & scripts</span>
              </div>
            </button>
            
            <button
              onClick={() => setMode("deepdive")}
              className={cn(
                "module-controls__mode-tab",
                currentMode === "deepdive" && "module-controls__mode-tab--active"
              )}
              aria-pressed={currentMode === "deepdive"}
            >
              <div className="module-controls__mode-tab-icon">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="module-controls__mode-tab-content">
                <span className="module-controls__mode-tab-title">Deep Dive</span>
                <span className="module-controls__mode-tab-meta">{deepDiveDuration} • Full content</span>
              </div>
            </button>
          </div>
        </div>
      )}
      
      {/* Audio Section - with "Start here" prompt */}
      {hasAudio && (
        <div className="module-controls__audio-section">
          <div className="module-controls__audio-header">
            <HeadphonesIcon className="h-4 w-4" />
            <span className="module-controls__audio-title">Listen First</span>
            <span className="module-controls__audio-badge">Start here</span>
            <span className="module-controls__audio-meta">{audioTracks.length} {audioTracks.length === 1 ? 'lesson' : 'lessons'} • {totalAudioDuration}</span>
          </div>
          
          <div className="module-controls__audio-tracks">
            {audioTracks.map((track) => {
              const config = AUDIO_TYPE_CONFIG[track.type]
              const Icon = config.icon
              const isActive = expandedAudio === track.slug
              
              return (
                <button
                  key={track.slug}
                  onClick={() => toggleAudio(track.slug)}
                  className={cn(
                    "module-controls__audio-track",
                    isActive && "module-controls__audio-track--active",
                    isActive && config.bgColor,
                    isActive && config.borderColor,
                    isActive && config.color
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? config.color : "text-gray-500")} />
                  <span className="module-controls__audio-track-label">{config.shortLabel}</span>
                  <span className="module-controls__audio-track-duration">{track.duration}</span>
                  {track.audioUrl && (
                    <PlayIcon className={cn(
                      "h-3.5 w-3.5 module-controls__audio-track-play",
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )} />
                  )}
                </button>
              )
            })}
          </div>
          
          {/* Compact inline player - same style as competency page */}
          {expandedTrack && expandedConfig && (
            <CompactAudioPlayer 
              track={expandedTrack} 
              config={expandedConfig}
              onClose={() => setExpandedAudio(null)}
            />
          )}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Compact Audio Player - Simple inline player with auto-play
// =============================================================================

interface CompactPlayerProps {
  track: AudioTrack
  config: typeof AUDIO_TYPE_CONFIG.intro
  onClose: () => void
}

function CompactAudioPlayer({ track, config, onClose }: CompactPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  // Auto-play when mounted
  useEffect(() => {
    if (audioRef.current && track.audioUrl) {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch(() => {
        // Browser blocked autoplay, that's ok
      })
    }
  }, [track.audioUrl])
  
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => {
      setIsPlaying(false)
      onClose()
    }
    
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [track.audioUrl, onClose])
  
  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }
  
  const handleSeek = (value: number | readonly number[]) => {
    if (audioRef.current) {
      const seekTime = Array.isArray(value) ? value[0] : value
      audioRef.current.currentTime = seekTime
      setCurrentTime(seekTime)
    }
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }
  
  const Icon = config.icon
  
  return (
    <div className={cn(
      "module-controls__inline-player",
      config.bgColor,
      config.borderColor
    )}>
      {track.audioUrl && (
        <audio ref={audioRef} src={track.audioUrl} />
      )}
      
      <Row align="center" gap="sm" className="module-controls__inline-player-row">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          disabled={!track.audioUrl}
          className={cn(
            "module-controls__inline-player-btn",
            track.audioUrl ? config.color : "text-gray-400"
          )}
        >
          {isPlaying ? (
            <PauseIcon className="h-5 w-5" />
          ) : (
            <PlayIcon className="h-5 w-5 ml-0.5" />
          )}
        </button>
        
        {/* Track info */}
        <div className="module-controls__inline-player-info">
          <Icon className={cn("h-4 w-4", config.color)} />
          <Text size="sm" weight="medium">{config.label}</Text>
        </div>
        
        {/* Progress bar */}
        <div className="module-controls__inline-player-progress">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="flex-1"
          />
        </div>
        
        {/* Time */}
        <Text size="xs" className="text-muted-foreground tabular-nums shrink-0">
          {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : track.duration}
        </Text>
        
        {/* Volume icon (decorative) */}
        <Volume2Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      </Row>
    </div>
  )
}
