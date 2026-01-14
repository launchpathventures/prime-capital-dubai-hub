/**
 * CATALYST - Learning Progress Page
 * 
 * Simple overview of learner's progress through the course.
 * Shows module completion status based on quiz results and scenario reflections.
 */

import Link from "next/link"
import { 
  CheckCircleIcon, 
  CircleIcon,
  BookOpenIcon,
  GraduationCapIcon,
  ArrowRightIcon,
  MessageSquareIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { LearnShell } from "../_surface/learn-shell"
import { getScenarioCompletionStats } from "@/lib/actions/scenario-actions"

// =============================================================================
// Types
// =============================================================================

interface Module {
  id: string
  slug: string
  title: string
  competency_slug: string
  competency_name: string
}

interface CompletedModule {
  module_id: string
  completed_at: string
}

// =============================================================================
// Data Fetching
// =============================================================================

async function getModulesWithProgress(): Promise<{
  modules: Module[]
  completed: CompletedModule[]
  competencies: Array<{ slug: string; name: string; number: number; locked: boolean; modules: Array<{ slug: string; title: string; status: "complete" | "current" | "locked" }> }>
}> {
  const supabase = await createClient()
  
  // Get all modules with their competency info
  const { data: modules, error: modulesError } = await supabase
    .from("learning_modules")
    .select(`
      id,
      slug,
      title,
      competency:competencies(slug, name, display_order)
    `)
    .order("display_order")
  
  if (modulesError) {
    console.error("Failed to fetch modules:", modulesError)
    return { modules: [], completed: [], competencies: [] }
  }
  
  // Get user's completed modules (from quiz results)
  const { data: { user } } = await supabase.auth.getUser()
  let completed: CompletedModule[] = []
  
  if (user) {
    const { data: quizResults } = await supabase
      .from("quiz_attempts")
      .select("module_id, created_at")
      .eq("user_id", user.id)
      .eq("passed", true)
      .not("module_id", "is", null)
      .order("created_at", { ascending: false })
    
    if (quizResults) {
      // Dedupe by module_id, keeping the first (most recent) completion
      const seen = new Set<string>()
      completed = quizResults.filter(r => {
        if (seen.has(r.module_id)) return false
        seen.add(r.module_id)
        return true
      }).map(r => ({
        module_id: r.module_id,
        completed_at: r.created_at,
      }))
    }
  }
  
  // Transform to expected format
  const completedIds = new Set(completed.map(c => c.module_id))
  
  const transformedModules = (modules || []).map(m => {
    const comp = m.competency as unknown as { slug: string; name: string } | null
    return {
      id: m.id,
      slug: m.slug,
      title: m.title,
      competency_slug: comp?.slug || "",
      competency_name: comp?.name || "",
    }
  })
  
  // Build competency structure for sidebar
  const competencyMap = new Map<string, { 
    slug: string
    name: string
    display_order: number
    modules: Array<{ slug: string; title: string; status: "complete" | "current" | "locked" }>
  }>()
  
  for (const m of modules || []) {
    const comp = m.competency as unknown as { slug: string; name: string; display_order: number } | null
    if (!comp) continue
    
    if (!competencyMap.has(comp.slug)) {
      competencyMap.set(comp.slug, {
        slug: comp.slug,
        name: comp.name,
        display_order: comp.display_order,
        modules: [],
      })
    }
    
    competencyMap.get(comp.slug)!.modules.push({
      slug: m.slug,
      title: m.title,
      status: completedIds.has(m.id) ? "complete" : "current",
    })
  }
  
  const competencies = Array.from(competencyMap.values())
    .sort((a, b) => a.display_order - b.display_order)
    .map((c, i) => ({
      ...c,
      number: i + 1,
      locked: false,
    }))
  
  return { modules: transformedModules, completed, competencies }
}

// =============================================================================
// Page Component
// =============================================================================

export default async function ProgressPage() {
  const [{ modules, completed, competencies }, scenarioStats] = await Promise.all([
    getModulesWithProgress(),
    getScenarioCompletionStats(),
  ])
  
  const completedIds = new Set(completed.map(c => c.module_id))
  const completedCount = completed.length
  const totalCount = modules.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  
  // Group modules by competency
  const byCompetency = modules.reduce((acc, m) => {
    if (!acc[m.competency_slug]) {
      acc[m.competency_slug] = {
        name: m.competency_name,
        modules: [],
      }
    }
    acc[m.competency_slug].modules.push(m)
    return acc
  }, {} as Record<string, { name: string; modules: Module[] }>)
  
  return (
    <LearnShell 
      activeSection="progress"
      competencies={competencies}
    >
      <div className="learn-content">
        <div className="lms-page">
          {/* Header */}
          <div className="lms-page__header">
            <div className="lms-page__eyebrow">
              <GraduationCapIcon className="h-4 w-4" />
              Learning Progress
            </div>
            <h1 className="lms-page__title">My Progress</h1>
            <p className="lms-page__description">
              Track your journey through the consultant training program.
            </p>
          </div>
        
        {/* Progress Summary */}
        <div className="lms-card lms-card--highlight">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div>
              <div className="text-3xl font-bold text-gray-900">{progressPercent}%</div>
              <div className="text-sm text-gray-500">Overall Progress</div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {completedCount} of {totalCount} modules completed
              </div>
            </div>
            {completedCount < totalCount && (
              <Link 
                href="/learn"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Continue Learning
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
        
        {/* Scenario Practice Progress */}
        {scenarioStats.completedScenarios > 0 && (
          <div className="lms-card">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600">
                  <MessageSquareIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Scenario Practice</div>
                  <div className="text-sm text-gray-500">
                    {scenarioStats.completedScenarios} scenario{scenarioStats.completedScenarios !== 1 ? 's' : ''} completed with reflections
                  </div>
                </div>
              </div>
              <Link 
                href="/learn/scenarios"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All Scenarios
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            
            {/* Breakdown by category */}
            {scenarioStats.byCategory.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid gap-2">
                  {scenarioStats.byCategory.map((cat) => (
                    <Link
                      key={cat.category}
                      href={`/learn/scenarios/${cat.category}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm text-gray-700 capitalize">
                        {cat.category.replace(/-/g, ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {cat.completed} completed
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Competency Progress */}
        <div className="lms-section">
          <h2 className="lms-section__title">Progress by Competency</h2>
          
          <div className="space-y-6">
            {Object.entries(byCompetency).map(([slug, { name, modules: compModules }]) => {
              const compCompleted = compModules.filter(m => completedIds.has(m.id)).length
              const compPercent = Math.round((compCompleted / compModules.length) * 100)
              
              return (
                <div key={slug} className="lms-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{name}</h3>
                    <span className="text-sm text-gray-500">
                      {compCompleted}/{compModules.length} complete
                    </span>
                  </div>
                  
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${compPercent}%` }}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    {compModules.map(m => {
                      const isComplete = completedIds.has(m.id)
                      return (
                        <Link
                          key={m.id}
                          href={`/learn/${slug}/${m.slug}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {isComplete ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <CircleIcon className="h-5 w-5 text-gray-300 flex-shrink-0" />
                          )}
                          <span className={isComplete ? "text-gray-600" : "text-gray-900"}>
                            {m.title}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        </div>
      </div>
    </LearnShell>
  )
}
