/**
 * CATALYST - Competency Sidebar
 *
 * Left sidebar navigation showing all competencies and behaviours.
 * Used on competency and behaviour pages.
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Stack, Row, Text } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronDownIcon, ChevronRightIcon, LockIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface Behaviour {
  slug: string
  title: string
  locked: boolean
  completed?: boolean
}

interface Competency {
  id: number
  slug: string
  name: string
  behaviours: Behaviour[]
}

interface CompetencySidebarProps {
  competencies: Competency[]
  currentCompetency: string
  currentBehaviour?: string
  completedBehaviours?: number
  totalBehaviours?: number
}

// -----------------------------------------------------------------------------
// CompetencySidebar Component
// -----------------------------------------------------------------------------

export function CompetencySidebar({
  competencies,
  currentCompetency,
  currentBehaviour,
  completedBehaviours = 0,
  totalBehaviours = 35,
}: CompetencySidebarProps) {
  const [expandedCompetencies, setExpandedCompetencies] = React.useState<Set<string>>(
    new Set([currentCompetency])
  )

  const toggleCompetency = (slug: string) => {
    setExpandedCompetencies((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  return (
    <aside className="w-64 border-r bg-[#5a6c7d] text-white flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <Stack gap="sm">
          <Text size="xs" className="text-white/70 uppercase tracking-wider">
            Consultant Training
          </Text>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/learn/course" />}
            className="justify-start gap-2 text-white hover:bg-white/10 -ml-2"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <Text size="sm">Exit to Course Overview</Text>
          </Button>
        </Stack>
      </div>

      {/* Competencies List */}
      <div className="flex-1 overflow-y-auto">
        <Stack gap="none">
          {competencies.map((competency) => {
            const isExpanded = expandedCompetencies.has(competency.slug)
            const isActive = currentCompetency === competency.slug

            return (
              <div key={competency.slug}>
                {/* Competency Header */}
                <button
                  onClick={() => toggleCompetency(competency.slug)}
                  className={cn(
                    "w-full px-4 py-3 text-left transition-colors",
                    "hover:bg-white/5",
                    isActive && "bg-white/10"
                  )}
                >
                  <Row gap="sm" align="center" justify="between">
                    <Row gap="sm" align="center" className="flex-1 min-w-0">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white text-xs font-semibold shrink-0">
                        {competency.id}
                      </div>
                      <Text size="sm" weight="medium" className="text-white truncate">
                        {competency.name}
                      </Text>
                    </Row>
                    {isExpanded ? (
                      <ChevronDownIcon className="h-4 w-4 text-white/70 shrink-0" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4 text-white/70 shrink-0" />
                    )}
                  </Row>
                </button>

                {/* Behaviours List */}
                {isExpanded && (
                  <Stack gap="none" className="bg-black/10">
                    {competency.behaviours.map((behaviour) => {
                      const isCurrent =
                        currentBehaviour === behaviour.slug && currentCompetency === competency.slug

                      return (
                        <Link
                          key={behaviour.slug}
                          href={
                            behaviour.locked
                              ? "#"
                              : `/learn/${competency.slug}/${behaviour.slug}`
                          }
                          className={cn(
                            "block px-4 py-2.5 pl-14 transition-colors",
                            behaviour.locked
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-white/5",
                            isCurrent && "bg-white/10 border-l-2 border-white"
                          )}
                          onClick={(e) => {
                            if (behaviour.locked) {
                              e.preventDefault()
                            }
                          }}
                        >
                          <Row gap="sm" align="center" justify="between">
                            <Text
                              size="sm"
                              className={cn(
                                "text-white/90",
                                isCurrent && "font-medium text-white"
                              )}
                            >
                              {behaviour.title}
                            </Text>
                            {behaviour.locked && (
                              <LockIcon className="h-3 w-3 text-white/50 shrink-0" />
                            )}
                            {behaviour.completed && (
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                            )}
                          </Row>
                        </Link>
                      )
                    })}
                  </Stack>
                )}
              </div>
            )
          })}
        </Stack>
      </div>

      {/* Footer - Progress */}
      <div className="p-4 border-t border-white/10">
        <Stack gap="xs">
          <Text size="xs" className="text-white/70 uppercase tracking-wider">
            Overall Progress
          </Text>
          <Text size="lg" weight="semibold" className="text-white">
            {completedBehaviours} / {totalBehaviours}
          </Text>
        </Stack>
      </div>
    </aside>
  )
}
