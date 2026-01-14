/**
 * CATALYST - Module Audio Section
 * 
 * Displays available audio content for a module.
 * Shows intro, demo, and walkthrough audio in an elegant card layout.
 * Integrates with the audio coach player for playback.
 */

"use client"

import { useState } from "react"
import { Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  HeadphonesIcon, 
  PlayIcon, 
  BookOpenIcon,
  WrenchIcon,
  FootprintsIcon,
  ChevronDownIcon,
  ChevronUpIcon,
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
  moduleTitle: string
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
    description: "Get oriented with key concepts",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  demo: {
    icon: WrenchIcon,
    label: "Demonstration",
    description: "Watch strong vs weak approaches",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  walkthrough: {
    icon: FootprintsIcon,
    label: "Walkthrough",
    description: "Step-by-step guided practice",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
}

// =============================================================================
// Component
// =============================================================================

export function ModuleAudioSection({ 
  tracks, 
  moduleTitle,
  className,
  defaultExpanded = false,
}: ModuleAudioSectionProps) {
  const [expandedTrack, setExpandedTrack] = useState<string | null>(
    defaultExpanded && tracks.length > 0 ? tracks[0].slug : null
  )
  
  if (tracks.length === 0) {
    return null
  }
  
  const toggleTrack = (slug: string) => {
    setExpandedTrack(expandedTrack === slug ? null : slug)
  }

  return (
    <section className={cn("module-audio-section", className)}>
      <Card className="border-primary/10 overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-primary/10">
            <Row align="center" gap="md">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <HeadphonesIcon className="h-5 w-5 text-primary" />
              </div>
              <Stack gap="none">
                <Title size="h4" className="font-serif text-foreground">
                  Audio Coach
                </Title>
                <Text size="sm" className="text-muted-foreground">
                  {tracks.length} audio {tracks.length === 1 ? "lesson" : "lessons"} available
                </Text>
              </Stack>
            </Row>
          </div>
          
          {/* Track List */}
          <div className="divide-y divide-border">
            {tracks.map((track) => {
              const config = AUDIO_TYPE_CONFIG[track.type]
              const Icon = config.icon
              const isExpanded = expandedTrack === track.slug
              
              return (
                <div key={track.slug} className="group">
                  {/* Track Header - Clickable */}
                  <button
                    onClick={() => toggleTrack(track.slug)}
                    className="w-full px-6 py-4 flex items-center gap-4 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      config.bgColor
                    )}>
                      <Icon className={cn("h-5 w-5", config.color)} />
                    </div>
                    
                    <Stack gap="none" className="flex-1 min-w-0">
                      <Text weight="medium" className="text-foreground">
                        {config.label}
                      </Text>
                      <Text size="sm" className="text-muted-foreground truncate">
                        {config.description} • {track.duration}
                      </Text>
                    </Stack>
                    
                    <Row align="center" gap="sm" className="shrink-0">
                      {track.audioUrl && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayIcon className="h-4 w-4 text-primary-foreground ml-0.5" />
                        </div>
                      )}
                      {isExpanded ? (
                        <ChevronUpIcon className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Row>
                  </button>
                  
                  {/* Expanded Player */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2">
                      <AudioCoachPlayer
                        title={track.title}
                        duration={track.duration}
                        type={config.label}
                        transcript={track.transcript}
                        audioUrl={track.audioUrl}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
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
