/**
 * CATALYST - Audio Coach Player
 * 
 * Plays AI coach demonstration audio with transcript support.
 * Shows "demonstrate then explain" format with transcript toggle.
 */

"use client"

import { useState, useRef } from "react"
import { Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  PlayIcon, 
  PauseIcon, 
  Volume2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  HeadphonesIcon,
} from "lucide-react"
import { MarkdownRenderer } from "./markdown-renderer"

interface AudioCoachPlayerProps {
  title: string
  duration: string
  type: string
  transcript: string
  audioUrl?: string | null
}

export function AudioCoachPlayer({ 
  title, 
  duration, 
  type,
  transcript,
  audioUrl,
}: AudioCoachPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const totalSeconds = parseDuration(duration)
  
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
  
  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
      <CardContent className="p-6">
        <Stack gap="md">
          {/* Header */}
          <Row align="center" gap="md">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <HeadphonesIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <Stack gap="none" className="flex-1">
              <Text size="xs" className="uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold">
                Coach Demonstration
              </Text>
              <Title size="h4">{title}</Title>
              <Text size="sm" className="text-muted-foreground">
                {duration} • {type}
              </Text>
            </Stack>
          </Row>
          
          {/* Description */}
          <Text className="text-muted-foreground">
            Listen as the coach demonstrates strong vs weak approaches, 
            then explains the reasoning behind each technique.
          </Text>
          
          {/* Audio Player */}
          {audioUrl ? (
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
              <audio 
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
              />
              
              <Row align="center" gap="md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="h-10 w-10 rounded-full bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
                >
                  {isPlaying ? (
                    <PauseIcon className="h-5 w-5" />
                  ) : (
                    <PlayIcon className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
                
                <div className="flex-1">
                  <Slider
                    value={[currentTime]}
                    max={totalSeconds}
                    step={1}
                    onValueChange={handleSeek}
                    className="cursor-pointer"
                  />
                </div>
                
                <Text size="sm" className="text-muted-foreground w-24 text-right">
                  {formatTime(currentTime)} / {duration}
                </Text>
                
                <Volume2Icon className="h-4 w-4 text-muted-foreground" />
              </Row>
            </div>
          ) : (
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 text-center">
              <Text className="text-muted-foreground">
                🔊 Audio coming soon — view transcript below
              </Text>
            </div>
          )}
          
          {/* Transcript Toggle */}
          <Button
            variant="ghost"
            onClick={() => setShowTranscript(!showTranscript)}
            className="gap-2"
          >
            📜 {showTranscript ? "Hide" : "Show"} Transcript
            {showTranscript ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
          
          {/* Transcript Content */}
          {showTranscript && (
            <div className="bg-white dark:bg-black/40 rounded-lg p-4 border max-h-96 overflow-y-auto">
              <MarkdownRenderer 
                content={transcript} 
                className="prose-sm"
              />
            </div>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

function parseDuration(duration: string): number {
  const match = duration.match(/(\d+)\s*(?:min|minute)/i)
  return match ? parseInt(match[1]) * 60 : 300
}
