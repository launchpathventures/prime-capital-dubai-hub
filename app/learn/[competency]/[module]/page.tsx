/**
 * CATALYST - Module Page
 *
 * Multimodal learning experience: Read, Listen, Practice.
 * Route: /learn/[competency]/[module]
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Stack, Text, Title } from "@/components/core"
import { ChevronLeftIcon } from "lucide-react"
import { 
  getModule, 
  getCompetency, 
  getAudioTranscript,
} from "@/lib/learning"
import { 
  MarkdownRenderer,
  AudioCoachPlayer,
  LearningObjectives,
  ResourceList,
  KnowledgeCheckCTA,
} from "@/components/lms"

interface PageProps {
  params: Promise<{ 
    competency: string
    module: string 
  }>
}

export default async function ModulePage({ params }: PageProps) {
  const { competency: competencySlug, module: moduleSlug } = await params
  
  // Fetch all data in parallel
  const [competency, module, audioTranscript] = await Promise.all([
    getCompetency(competencySlug),
    getModule(competencySlug, moduleSlug),
    getAudioTranscript(moduleSlug),
  ])
  
  if (!competency || !module) {
    notFound()
  }
  
  // Extract from flexible frontmatter (JSONB)
  const frontmatter = module.frontmatter || {}
  const learningObjectives = frontmatter.learningObjectives as string[] | undefined
  const resources = frontmatter.resources as Array<{ title: string; type: string }> | undefined
  const quizId = frontmatter.quizId as string | undefined
  
  return (
    <Stack gap="xl">
      {/* Back link */}
      <Link 
        href={`/learn/${competencySlug}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Back to {competency.name}
      </Link>
      
      {/* Header */}
      <Stack gap="sm">
        <Text size="xs" className="uppercase tracking-wider text-muted-foreground">
          Module {module.moduleNumber}
        </Text>
        <Title size="h1" className="text-2xl sm:text-3xl">
          {module.title}
        </Title>
        {module.description && (
          <Text className="text-muted-foreground text-lg">
            {module.description}
          </Text>
        )}
      </Stack>
      
      {/* Audio Coach Demonstration (if transcript exists) */}
      {audioTranscript && (
        <AudioCoachPlayer
          title={audioTranscript.title}
          duration={audioTranscript.duration || "5 minutes"}
          type={audioTranscript.type || "demonstration"}
          transcript={audioTranscript.transcript}
          audioUrl={audioTranscript.audioUrl}
        />
      )}
      
      {/* Learning Objectives (if in frontmatter) */}
      {learningObjectives && (
        <LearningObjectives objectives={learningObjectives} />
      )}
      
      {/* Main Content - Rendered Markdown */}
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <MarkdownRenderer content={module.content} />
      </div>
      
      {/* Resources (if in frontmatter) */}
      {resources && resources.length > 0 && (
        <ResourceList resources={resources} />
      )}
      
      {/* Knowledge Check CTA (if quizId in frontmatter) */}
      {quizId && (
        <KnowledgeCheckCTA quizId={quizId} />
      )}
    </Stack>
  )
}
