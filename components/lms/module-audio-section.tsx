/**
 * CATALYST - Module Audio Section
 * 
 * Compact audio track bar with expandable player.
 * Shows tracks as horizontal pills, expands to full player on click.
 */

"use client"

import { useState } from "react"
import { Row, Text } from "@/components/core"
import { 
  HeadphonesIcon, 
  PlayIcon, 
  BookOpenIcon,
  WrenchIcon,
  FootprintsIcon,
  XIcon,
} from "lucide-react"
import { AudioCoachPlayer } from "./audio-coach-player"
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

interface ModuleAudioSectionProps {
  tracks: AudioTrack[]
  moduleTitle?: string
  className?: string
  defaultExpanded?: boolean
}

// =============================================================================
// Constants
// =============================================================================

const AUDIO_TYPE_CONFIG = {
  intro: {
    icon: BookOpenIcon,
    label: "Introduction",
    shortLabel: "Intro",
    description: "Get oriented with key concepts",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    borderColor: "border-blue-200 dark:border-blue-800",
    hoverBg: "hover:bg-blue-100 dark:hover:bg-blue-900/50",
  },
  demo: {
    icon: WrenchIcon,
    label: "Demonstration",
    shortLabel: "Demo",
    description: "Watch strong vs weak approaches",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
    borderColor: "border-amber-200 dark:border-amber-800",
    hoverBg: "hover:bg-amber-100 dark:hover:bg-amber-900/50",
  },
  walkthrough: {
    icon: FootprintsIcon,
    label: "Walkthrough",
    shortLabel: "Walkthrough",
    description: "Step-by-step guided practice",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    hoverBg: "hover:bg-emerald-100 dark:hover:bg-emerald-900/50",
  },
}

// =============================================================================
// Component
// =============================================================================

export function ModuleAudioSection({ 
  tracks, 
  className,
}: ModuleAudioSectionProps) {
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null)
  
  if (tracks.length === 0) {
    return null
  }
  
  const toggleTrack = (slug: string) => {
    setExpandedTrack(expandedTrack === slug ? null : slug)
  }
  
  const selectedTrack = tracks.find(t => t.slug === expandedTrack)
  const selectedConfig = selectedTrack ? AUDIO_TYPE_CONFIG[selectedTrack.type] : null

  return (
    <section className={cn("module-audio-section", className)}>
      {/* Compact pill bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Row align="center" gap="xs" className="text-muted-foreground shrink-0">
          <HeadphonesIcon className="h-4 w-4" />
          <Text size="sm" weight="medium">Audio Coach</Text>
        </Row>
        
        <div className="flex items-center gap-2 flex-wrap">
          {tracks.map((track) => {
            const config = AUDIO_TYPE_CONFIG[track.type]
            const Icon = config.icon
            const isActive = expandedTrack === track.slug
            
            return (
              <button
                key={track.slug}
                onClick={() => toggleTrack(track.slug)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  "border",
                  isActive 
                    ? cn(config.bgColor, config.borderColor, config.color)
                    : cn(
                        "bg-muted/50 border-border text-muted-foreground",
                        config.hoverBg,
                        "hover:border-border/80"
                      )
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", isActive && config.color)} />
                <span>{config.shortLabel}</span>
                {track.audioUrl && !isActive && (
                  <PlayIcon className="h-3 w-3 opacity-50" />
                )}
                <span className="text-xs opacity-60">{track.duration}</span>
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Expanded player */}
      {selectedTrack && selectedConfig && (
        <div className={cn(
          "mt-4 rounded-lg border overflow-hidden",
          selectedConfig.borderColor,
          selectedConfig.bgColor
        )}>
          <div className="p-4">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <selectedConfig.icon className={cn("h-5 w-5", selectedConfig.color)} />
                <Text weight="medium" className={selectedConfig.color}>
                  {selectedConfig.label}
                </Text>
                <Text size="sm" className="text-muted-foreground">
                  • {selectedConfig.description}
                </Text>
              </div>
              <button
                onClick={() => setExpandedTrack(null)}
                className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <XIcon className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <AudioCoachPlayer
              title={selectedTrack.title}
              duration={selectedTrack.duration}
              type={selectedConfig.label}
              transcript={selectedTrack.transcript}
              audioUrl={selectedTrack.audioUrl}
            />
          </div>
        </div>
      )}
    </section>
  )
}

// =============================================================================
// Compact variant for ToC/Quick Links
// =============================================================================

interface AudioQuickLinksProps {
  tracks: AudioTrack[]
  onPlay: (slug: string) => void
  className?: string
}

export function AudioQuickLinks({ tracks, onPlay, className }: AudioQuickLinksProps) {
  if (tracks.length === 0) return null
  
  return (
    <div className={cn("audio-quick-links", className)}>
      <Text size="xs" className="uppercase tracking-wider text-muted-foreground font-semibold mb-2">
        Audio Coach
      </Text>
      <Stack gap="xs">
        {tracks.map((track) => {
          const config = AUDIO_TYPE_CONFIG[track.type]
          const Icon = config.icon
          
          return (
            <button
              key={track.slug}
              onClick={() => onPlay(track.slug)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-left group"
            >
              <Icon className={cn("h-3.5 w-3.5 shrink-0", config.color)} />
              <span className="truncate">{config.label}</span>
              {track.audioUrl && (
                <PlayIcon className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          )
        })}
      </Stack>
    </div>
  )
}
