/**
 * CATALYST - Competency Page
 * 
 * Shows competency details with sidebar for navigation.
 * Data driven from Supabase.
 * Uses LearnShell for unified shell with sidebar.
 */

import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Stack, Row, Text } from "@/components/core"
import { 
  ClockIcon, 
  PlayIcon,
  ArrowRightIcon,
  ClipboardCheckIcon,
  SparklesIcon,
  MessageSquareIcon,
  HeadphonesIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getUserRole, getUserForMenu } from "@/lib/auth/require-auth"
import { getCompetenciesForSidebar } from "@/lib/learning"
import { LearnShell } from "../_surface/learn-shell"
import { AudioPlayer, type AudioTrack } from "@/components/lms/audio-player"

// =============================================================================
// Types
// =============================================================================

interface Module {
  id: string
  slug: string
  title: string
  duration_minutes: number | null
  display_order: number
}

interface Competency {
  id: string
  slug: string
  name: string
  description: string | null
  display_order: number
  modules: Module[]
}

interface PageProps {
  params: Promise<{ competency: string }>
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { competency: slug } = await params
  const supabase = await createClient()
  
  const { data } = await supabase
    .from("competencies")
    .select("name, description")
    .eq("slug", slug)
    .single()
  
  if (!data) {
    return {
      title: "Competency | Learning Portal",
    }
  }
  
  return {
    title: `${data.name} | Learning Portal`,
    description: data.description || `Learn ${data.name} in the Prime Capital training program.`,
  }
}

// =============================================================================
// Data Fetching
// =============================================================================

async function getAllCompetencies(): Promise<Competency[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("competencies")
    .select(`
      id,
      slug,
      name,
      description,
      display_order,
      learning_modules (
        id,
        slug,
        title,
        duration_minutes,
        display_order
      )
    `)
    .order("display_order", { ascending: true })
  
  if (error) {
    console.error("Failed to fetch competencies:", error)
    return []
  }
  
  return (data as unknown as Competency[]).map(comp => ({
    ...comp,
    modules: ((comp as { learning_modules?: Module[] }).learning_modules || [])
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
  }))
}

interface Quiz {
  slug: string
  title: string
  question_count: number | null
  passing_score: number | null
}

interface ScenarioCategory {
  slug: string
  title: string
  scenario_count: number | null
}

async function getQuizzesForCompetency(competencySlug: string): Promise<Quiz[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("quizzes")
    .select("slug, title, question_count, passing_score")
    .eq("competency_slug", competencySlug)
    .order("slug")
  
  if (error) {
    console.error("Failed to fetch quizzes:", error)
    return []
  }
  
  return data || []
}

async function getScenariosForCompetency(competencySlug: string): Promise<ScenarioCategory[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("scenarios")
    .select("slug, title, scenario_count, competencies")
    .contains("competencies", [competencySlug])
  
  if (error) {
    console.error("Failed to fetch scenarios:", error)
    return []
  }
  
  return data || []
}

async function getCompetencyAudio(competencyId: string): Promise<AudioTrack | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("audio_transcripts")
    .select("slug, title, type, duration, audio_url, transcript")
    .eq("competency_id", competencyId)
    .eq("type", "intro")
    .single()
  
  if (error || !data) {
    return null
  }
  
  return {
    slug: data.slug,
    title: data.title,
    type: (data.type as "intro" | "demo" | "walkthrough") || "intro",
    duration: data.duration || "3 minutes",
    audioUrl: data.audio_url,
    transcript: data.transcript || "",
  }
}


// =============================================================================
// Page Component
// =============================================================================

export default async function CompetencyPage({ params }: PageProps) {
  const { competency: slug } = await params
  const allCompetencies = await getAllCompetencies()
  
  const currentCompetency = allCompetencies.find(c => c.slug === slug)
  
  if (!currentCompetency) {
    notFound()
  }
  
  const totalDuration = currentCompetency.modules.reduce(
    (sum, m) => sum + (m.duration_minutes || 0),
    0
  )
  
  const firstModule = currentCompetency.modules[0]
  
  // Get quizzes, scenarios, audio, and sidebar data for this competency
  const [quizzes, scenarios, competencyAudio, sidebarCompetencies, userRole, userMenu] = await Promise.all([
    getQuizzesForCompetency(slug),
    getScenariosForCompetency(slug),
    getCompetencyAudio(currentCompetency.id),
    getCompetenciesForSidebar(),
    getUserRole(),
    getUserForMenu(),
  ])
  
  return (
    <LearnShell 
      activeSection="course"
      competencies={sidebarCompetencies}
      currentCompetency={slug}
      userRole={userRole}
      user={userMenu ?? undefined}
      coachContext={{ 
        level: "competency",
        competencySlug: slug,
        competencyName: currentCompetency.name,
      }}
    >
      <div className="learn-content">
        {/* Hero Section */}
        <section className="lms-hero lms-hero--compact">
          <div className="lms-hero__content">
            <div className="lms-hero__eyebrow">
              Competency {currentCompetency.display_order + 1}
            </div>
            <h1 className="lms-hero__title">
              {currentCompetency.name}
            </h1>
            {currentCompetency.description && (
              <p className="lms-hero__description">
                {currentCompetency.description}
              </p>
            )}
            <div className="lms-hero__stats">
              <div className="lms-hero__stat">
              <span className="lms-hero__stat-value">{currentCompetency.modules.length}</span>
              <span className="lms-hero__stat-label">Modules</span>
            </div>
            <div className="lms-hero__stat">
              <span className="lms-hero__stat-value">{totalDuration || currentCompetency.modules.length * 25}</span>
              <span className="lms-hero__stat-label">Minutes</span>
            </div>
          </div>
          {firstModule && (
            <div className="lms-hero__actions">
              <Button 
                size="lg" 
                className="gap-2 bg-white text-primary-700 hover:bg-white/90"
                nativeButton={false}
                render={<Link href={`/learn/${currentCompetency.slug}/${firstModule.slug}`} />}
              >
                <PlayIcon className="h-4 w-4" />
                Start Learning
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Competency Audio Introduction */}
      {competencyAudio && (
        <section className="lms-section">
          <div className="lms-section__header">
            <Row align="center" gap="sm">
              <HeadphonesIcon className="h-5 w-5 text-primary" />
              <h2 className="lms-section__title">Listen to Introduction</h2>
            </Row>
          </div>
          <AudioPlayer 
            track={competencyAudio} 
            variant="full"
          />
        </section>
      )}
      
      {/* Module List */}
      <section className="lms-section">
        <div className="lms-section__header">
          <h2 className="lms-section__title">Modules</h2>
          <span className="lms-section__subtitle">
            {currentCompetency.modules.length} lessons
          </span>
        </div>
        
        <div className="lms-list">
          {currentCompetency.modules.map((module, index) => (
            <Link
              key={module.id}
              href={`/learn/${currentCompetency.slug}/${module.slug}`}
              className="lms-card lms-card--clickable competency-card"
            >
              <div className="competency-card__index">
                {index + 1}
              </div>
              <div className="competency-card__body">
                <h3 className="competency-card__title">{module.title}</h3>
                <div className="competency-card__meta">
                  <span className="competency-card__meta-item">
                    <ClockIcon className="h-3 w-3" />
                    {module.duration_minutes ? `${module.duration_minutes} min` : '5-10 min read'}
                  </span>
                </div>
              </div>
              <div className="competency-card__action">
                <ArrowRightIcon className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Quiz Section */}
      {quizzes.length > 0 && (
        <section className="lms-section">
          <div className="lms-section__header">
            <Row align="center" gap="sm">
              <ClipboardCheckIcon className="h-5 w-5 text-primary" />
              <h2 className="lms-section__title">Knowledge Checks</h2>
            </Row>
            <span className="lms-section__subtitle">
              {quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'}
            </span>
          </div>
          
          <Stack gap="sm">
            {quizzes.map((quiz) => (
              <Link
                key={quiz.slug}
                href={`/learn/quiz/${quiz.slug}`}
                className="lms-card lms-card--clickable"
              >
                <Row align="center" justify="between" className="w-full p-4">
                  <Stack gap="xs">
                    <Text weight="medium">{quiz.title}</Text>
                    <Text size="sm" className="text-muted-foreground">
                      {quiz.question_count || '?'} questions • {quiz.passing_score || 80}% to pass
                    </Text>
                  </Stack>
                  <ArrowRightIcon className="h-5 w-5 text-muted-foreground" />
                </Row>
              </Link>
            ))}
          </Stack>
        </section>
      )}

      {/* Practice Scenarios Section */}
      {scenarios.length > 0 && (
        <section className="lms-section">
          <div className="lms-section__header">
            <Row align="center" gap="sm">
              <SparklesIcon className="h-5 w-5 text-amber-500" />
              <h2 className="lms-section__title">Practice Scenarios</h2>
            </Row>
            <span className="lms-section__subtitle">
              AI roleplay practice
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Apply your learning through AI-powered roleplay conversations.
          </p>
          
          <Stack gap="sm">
            {scenarios.map((scenario) => (
              <Link
                key={scenario.slug}
                href={`/learn/scenarios/${scenario.slug}`}
                className="lms-card lms-card--clickable"
              >
                <Row align="center" justify="between" className="w-full p-4">
                  <Row align="center" gap="md">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <MessageSquareIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <Stack gap="xs">
                      <Text weight="medium">{scenario.title}</Text>
                      <Text size="sm" className="text-muted-foreground">
                        {scenario.scenario_count} scenarios to practice
                      </Text>
                    </Stack>
                  </Row>
                  <ArrowRightIcon className="h-5 w-5 text-muted-foreground" />
                </Row>
              </Link>
            ))}
          </Stack>
        </section>
      )}
      </div>
    </LearnShell>
  )
}
