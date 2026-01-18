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
  /** Callback when mode changes (if provided, component is controlled) */
  onModeChange?: (mode: "essentials" | "deepdive") => void
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
  onModeChange,
  className
}: ModuleControlsBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [expandedAudio, setExpandedAudio] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  // Derive mode from server or URL
  const urlMode = searchParams.get("mode")
  const currentMode = serverMode || urlMode || "deepdive"
  
  const setMode = (mode: "essentials" | "deepdive") => {
    // If controlled, use callback; otherwise use router
    if (onModeChange) {
      onModeChange(mode)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.set("mode", mode)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }
  
  const toggleAudio = (slug: string) => {
    if (expandedAudio === slug) {
      // Same track - toggle play/pause
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause()
          setIsPlaying(false)
        } else {
          audioRef.current.play()
          setIsPlaying(true)
        }
      }
    } else {
      // Different track - switch to it (will auto-play)
      setExpandedAudio(slug)
      setIsPlaying(true)
    }
  }
  
  const handleHeroClick = () => {
    if (expandedAudio) {
      // Track is selected - toggle play/pause
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause()
          setIsPlaying(false)
        } else {
          audioRef.current.play()
          setIsPlaying(true)
        }
      }
    } else {
      // No track selected - start first track
      const firstTrack = audioTracks[0]
      if (firstTrack) {
        setExpandedAudio(firstTrack.slug)
        setIsPlaying(true)
      }
    }
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
      
      {/* Audio Coach Card - Prominent, unmissable */}
      {hasAudio && (
        <div className="audio-coach-card">
          {/* Main hero area */}
          <div className="audio-coach-card__hero">
            {/* Left: Play button with waveform */}
            <div className="audio-coach-card__player">
              <button
                onClick={handleHeroClick}
                className={cn(
                  "audio-coach-card__play-btn",
                  isPlaying && "audio-coach-card__play-btn--active"
                )}
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
              >
                {isPlaying ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                  <PlayIcon className="h-6 w-6 ml-0.5" />
                )}
              </button>
              
              {/* Animated waveform bars */}
              <div className={cn(
                "audio-coach-card__waveform",
                isPlaying && "audio-coach-card__waveform--playing"
              )}>
                <span className="audio-coach-card__bar" style={{ animationDelay: "0ms" }} />
                <span className="audio-coach-card__bar" style={{ animationDelay: "150ms" }} />
                <span className="audio-coach-card__bar" style={{ animationDelay: "300ms" }} />
                <span className="audio-coach-card__bar" style={{ animationDelay: "450ms" }} />
                <span className="audio-coach-card__bar" style={{ animationDelay: "200ms" }} />
              </div>
            </div>
            
            {/* Center: Title and value prop */}
            <div className="audio-coach-card__content">
              <div className="audio-coach-card__header">
                <HeadphonesIcon className="h-4 w-4 text-primary" />
                <span className="audio-coach-card__title">Listen First</span>
                <span className="audio-coach-card__badge">Start Here</span>
              </div>
              <p className="audio-coach-card__description">
                {audioTracks.length === 1 
                  ? "Quick audio intro — sets the context for what you'll read"
                  : `${audioTracks.length} audio lessons to guide your learning`
                }
              </p>
            </div>
          </div>
          
          {/* Track selector - only show if multiple tracks */}
          {audioTracks.length > 1 && (
            <div className="audio-coach-card__tracks">
              {audioTracks.map((track, index) => {
                const config = AUDIO_TYPE_CONFIG[track.type]
                const Icon = config.icon
                const isActive = expandedAudio === track.slug
                
                return (
                  <button
                    key={track.slug}
                    onClick={() => toggleAudio(track.slug)}
                    className={cn(
                      "audio-coach-card__track",
                      isActive && "audio-coach-card__track--active"
                    )}
                    data-type={track.type}
                  >
                    <span className="audio-coach-card__track-number">
                      {index + 1}
                    </span>
                    <div className="audio-coach-card__track-info">
                      <span className="audio-coach-card__track-label">{config.label}</span>
                      <span className="audio-coach-card__track-meta">
                        <Icon className={cn("h-3.5 w-3.5", config.color)} />
                        {track.duration}
                      </span>
                    </div>
                    {isActive && isPlaying && (
                      <span className="audio-coach-card__track-playing">
                        <span className="audio-coach-card__track-playing-dot" />
                        Playing
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
          
          {/* Inline player - auto-expanded for single track */}
          {expandedTrack && expandedConfig && (
            <CompactAudioPlayer 
              track={expandedTrack} 
              config={expandedConfig}
              audioRef={audioRef}
              isPlaying={isPlaying}
              onPlayPause={() => {
                if (audioRef.current) {
                  if (isPlaying) {
                    audioRef.current.pause()
                    setIsPlaying(false)
                  } else {
                    audioRef.current.play()
                    setIsPlaying(true)
                  }
                }
              }}
              onEnded={() => setIsPlaying(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Compact Audio Player - Simple inline player with shared state
// =============================================================================

interface CompactPlayerProps {
  track: AudioTrack
  config: typeof AUDIO_TYPE_CONFIG.intro
  audioRef: React.RefObject<HTMLAudioElement | null>
  isPlaying: boolean
  onPlayPause: () => void
  onEnded: () => void
}

function CompactAudioPlayer({ track, config, audioRef, isPlaying, onPlayPause, onEnded }: CompactPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  
  // Auto-play when mounted or track changes
  useEffect(() => {
    if (audioRef.current && track.audioUrl) {
      audioRef.current.play().catch(() => {
        // Browser blocked autoplay, that's ok
      })
    }
  }, [track.slug, track.audioUrl, audioRef])
  
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => onEnded()
    
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [track.audioUrl, audioRef, onEnded])
  
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
          onClick={onPlayPause}
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
