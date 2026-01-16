/**
 * CATALYST - Module Page
 * 
 * Shows module content with full sidebar navigation.
 * Supports two modes:
 * - Essentials: AI-extracted key facts, scripts, and practice scenarios
 * - Deep Dive: Full markdown content
 * 
 * Mode is determined by URL query param: ?mode=essentials|deepdive
 * Defaults to essentials if available, otherwise deep dive.
 */

import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ReadingProgress } from "@/components/lms"
import { ModuleContentSwitcher } from "@/components/lms/module-content-switcher"
import { ModuleToCSwitcher } from "@/components/lms/module-toc-switcher"
import { KnowledgeCheckCTA } from "@/components/lms/knowledge-check-cta"
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  GraduationCapIcon,
  ClockIcon,
  CheckCircleIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getAudioForModule, formatAudioDuration } from "@/lib/lms"
import type { EssentialsContent } from "@/lib/learning-types"

// =============================================================================
// Types
// =============================================================================

interface Module {
  id: string
  slug: string
  title: string
  content: string | null
  duration_minutes: number | null
  display_order: number
  essentials: EssentialsContent | null
}

interface Competency {
  id: string
  slug: string
  name: string
  display_order: number
  modules: Module[]
}

/** Minimal scenario data for linking */
export interface ScenarioLink {
  slug: string
  title: string
  scenarioCount: number | null
}

interface PageProps {
  params: Promise<{ competency: string; module: string }>
  searchParams: Promise<{ mode?: string }>
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { competency: competencySlug, module: moduleSlug } = await params
  const supabase = await createClient()
  
  const { data: competency } = await supabase
    .from("competencies")
    .select("name")
    .eq("slug", competencySlug)
    .single()
  
  const { data: moduleData } = await supabase
    .from("learning_modules")
    .select("title")
    .eq("slug", moduleSlug)
    .single()
  
  if (!moduleData) {
    return {
      title: "Module | Learning Portal",
    }
  }
  
  const competencyName = competency?.name || "Training"
  
  return {
    title: `${moduleData.title} | ${competencyName}`,
    description: `Learn about ${moduleData.title} in the ${competencyName} competency.`,
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
      display_order,
      learning_modules (
        id,
        slug,
        title,
        content,
        duration_minutes,
        display_order,
        essentials
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

/**
 * Get quizzes for a competency to find one related to this module.
 */
async function getRelatedQuiz(
  competencySlug: string,
  moduleSlug: string
): Promise<{ slug: string; title: string } | null> {
  const supabase = await createClient()
  
  // Try to find quiz that references this module
  const { data: exactMatch } = await supabase
    .from("quizzes")
    .select("slug, title")
    .eq("competency_slug", competencySlug)
    .ilike("related_module", `%${moduleSlug}%`)
    .limit(1)
    .single()
  
  if (exactMatch) return exactMatch
  
  // Fallback: get first quiz for this competency
  const { data: anyQuiz } = await supabase
    .from("quizzes")
    .select("slug, title")
    .eq("competency_slug", competencySlug)
    .order("slug")
    .limit(1)
    .single()
  
  return anyQuiz
}

/**
 * Get scenarios linked to a competency for the Practice with AI section.
 */
async function getScenariosForCompetency(
  competencySlug: string
): Promise<ScenarioLink[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("scenarios")
    .select("slug, title, scenario_count")
    .contains("competencies", [competencySlug])
    .order("title")
  
  if (error) {
    console.error("Failed to fetch scenarios:", error)
    return []
  }
  
  return (data || []).map(s => ({
    slug: s.slug,
    title: s.title,
    scenarioCount: s.scenario_count,
  }))
}

// =============================================================================
// Page Component
// =============================================================================

export default async function ModulePage({ params, searchParams }: PageProps) {
  const { competency: competencySlug, module: moduleSlug } = await params
  const { mode: modeParam } = await searchParams
  
  const allCompetencies = await getAllCompetencies()
  const currentCompetency = allCompetencies.find(c => c.slug === competencySlug)
  
  if (!currentCompetency) {
    notFound()
  }
  
  const currentModuleIndex = currentCompetency.modules.findIndex(m => m.slug === moduleSlug)
  
  if (currentModuleIndex === -1) {
    notFound()
  }
  
  const currentModule = currentCompetency.modules[currentModuleIndex]
  const prevModule = currentModuleIndex > 0 ? currentCompetency.modules[currentModuleIndex - 1] : null
  const nextModule = currentModuleIndex < currentCompetency.modules.length - 1 
    ? currentCompetency.modules[currentModuleIndex + 1] 
    : null
  
  // Determine mode: default to deep dive, essentials is opt-in
  const hasEssentials = currentModule.essentials !== null
  const mode = modeParam === "deepdive" || modeParam === "essentials" 
    ? modeParam 
    : "deepdive"
  
  // Estimate durations
  const deepDiveDuration = currentModule.duration_minutes ? `${currentModule.duration_minutes} min` : "25 min"
  const essentialsDuration = "15 min" // TODO: Calculate from essentials content
  
  // Get related quiz and scenarios for this module
  const [relatedQuiz, linkedScenarios] = await Promise.all([
    getRelatedQuiz(competencySlug, moduleSlug),
    getScenariosForCompetency(competencySlug),
  ])
  
  // Get audio tracks for this module
  const audioData = await getAudioForModule(
    currentCompetency.display_order,
    currentModuleIndex
  )
  const audioTracks = audioData.map((track) => ({
    slug: track.slug,
    title: track.title,
    type: track.type,
    duration: formatAudioDuration(track.audioDurationSeconds),
    audioUrl: track.audioUrl,
    transcript: track.transcript,
  }))
  
  return (
    <>
      {/* Content area with optional right ToC */}
      <div className="learn-content-wrapper">
        {/* Reading progress bar */}
        <ReadingProgress />
        
        <div className="learn-content">
          
          {/* Module header */}
          <div className="lms-module-header">
            <div className="lms-module-header__meta">
              <span>Module {currentModule.display_order + 1} of {currentCompetency.modules.length}</span>
              {currentModule.duration_minutes && (
                <>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ClockIcon className="h-3.5 w-3.5" />
                    {mode === "essentials" ? essentialsDuration : deepDiveDuration}
                  </span>
                </>
              )}
            </div>
            <h1 className="lms-module-header__title">
              {currentModule.title}
            </h1>
          </div>
          
          {/* AI Coach + Mode Toggle + Content - all handled by client component for instant switching */}
          {(currentModule.essentials || currentModule.content) ? (
            <ModuleContentSwitcher
              moduleTitle={currentModule.title}
              moduleSlug={moduleSlug}
              competencySlug={competencySlug}
              essentials={currentModule.essentials}
              deepDiveContent={currentModule.content}
              audioTracks={audioTracks}
              essentialsDuration={essentialsDuration}
              deepDiveDuration={deepDiveDuration}
              linkedScenarios={linkedScenarios}
              initialMode={mode}
            />
          ) : (
            <div className="lms-card" style={{ padding: '1.75rem' }}>
              <div className="lms-prose">
                <div className="lms-empty">
                  <div className="lms-empty__icon">
                    <GraduationCapIcon className="h-full w-full" />
                  </div>
                  <h3 className="lms-empty__title">Content Coming Soon</h3>
                  <p className="lms-empty__description">
                    This module is being prepared. Check back soon for the full learning material.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Quiz CTA - shown if a related quiz exists */}
          {relatedQuiz && (
            <section id="knowledge-check" className="mt-8">
              <KnowledgeCheckCTA quizId={relatedQuiz.slug} />
            </section>
          )}
        
          {/* Navigation */}
          <nav className="lms-nav">
            <div className="lms-nav__prev">
              {prevModule && (
                <Button variant="ghost" nativeButton={false} render={<Link href={`/learn/${currentCompetency.slug}/${prevModule.slug}`} />}>
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              )}
            </div>
            
            <div className="lms-nav__next">
              {nextModule ? (
                <Button nativeButton={false} render={<Link href={`/learn/${currentCompetency.slug}/${nextModule.slug}`} />}>
                  Next Module
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button variant="outline" className="gap-2" nativeButton={false} render={<Link href={`/learn/${currentCompetency.slug}`} />}>
                  <CheckCircleIcon className="h-4 w-4" />
                  Finish Competency
                </Button>
              )}
            </div>
          </nav>
          
        </div>
        
        {/* Right ToC - switches based on mode in URL */}
        <ModuleToCSwitcher
          essentials={currentModule.essentials}
          deepDiveContent={currentModule.content}
          hasQuiz={!!relatedQuiz}
          initialMode={mode}
        />
      </div>
    </>
  )
}
