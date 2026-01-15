/**
 * CATALYST - Learning Progress Page
 * 
 * Clean overview of learner's progress through the course.
 * Shows module completion status based on learning_progress table.
 */

import { Metadata } from "next"
import Link from "next/link"
import { 
  CheckCircleIcon, 
  CircleIcon,
  ArrowRightIcon,
  MessageSquareIcon,
  TrendingUpIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getUserRole, getUserForMenu } from "@/lib/auth/require-auth"
import { getCompetenciesForSidebar } from "@/lib/learning"
import { LearnShell } from "../_surface/learn-shell"
import { getScenarioCompletionStats } from "@/lib/actions/scenario-actions"

export const metadata: Metadata = {
  title: "My Progress | Learning Portal",
  description: "Track your learning progress through the Prime Capital training program.",
}

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
    return { modules: [], completed: [] }
  }
  
  // Get user's completed modules from learning_progress
  const { data: { user } } = await supabase.auth.getUser()
  let completed: CompletedModule[] = []
  
  if (user) {
    const { data: progress } = await supabase
      .from("learning_progress")
      .select("module_id, completed_at")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
    
    if (progress) {
      completed = progress.map(r => ({
        module_id: r.module_id,
        completed_at: r.completed_at,
      }))
    }
  }
  
  // Transform to expected format
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
  
  return { modules: transformedModules, completed }
}

// =============================================================================
// Page Component
// =============================================================================

export default async function ProgressPage() {
  const [{ modules, completed }, competencies, scenarioStats, userRole, userMenu] = await Promise.all([
    getModulesWithProgress(),
    getCompetenciesForSidebar(),
    getScenarioCompletionStats(),
    getUserRole(),
    getUserForMenu(),
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
      userRole={userRole}
      user={userMenu ?? undefined}
    >
      <div className="learn-content">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
            My Progress
          </h1>
          <p className="text-gray-500">
            Track your journey through the consultant training program.
          </p>
        </header>
        
        {/* Progress Summary Card */}
        <div className="lms-card p-6 mb-6 bg-gradient-to-br from-primary-50 to-white border-primary-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 text-primary-600">
              <TrendingUpIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{progressPercent}%</div>
              <div className="text-sm text-gray-500">
                {completedCount} of {totalCount} modules completed
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          {completedCount < totalCount && (
            <Link 
              href="/learn"
              className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Continue Learning
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          )}
        </div>
        
        {/* Scenario Practice Progress */}
        {scenarioStats.completedScenarios > 0 && (
          <div className="lms-card p-5 mb-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600">
                  <MessageSquareIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Scenario Practice</div>
                  <div className="text-sm text-gray-500">
                    {scenarioStats.completedScenarios} scenario{scenarioStats.completedScenarios !== 1 ? 's' : ''} completed
                  </div>
                </div>
              </div>
              <Link 
                href="/learn/scenarios"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                View All
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            
            {scenarioStats.byCategory.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 grid gap-1">
                {scenarioStats.byCategory.map((cat) => (
                  <Link
                    key={cat.category}
                    href={`/learn/scenarios/${cat.category}`}
                    className="flex items-center justify-between py-2 px-3 -mx-1 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-700 capitalize">
                      {cat.category.replace(/-/g, ' ')}
                    </span>
                    <span className="text-xs font-medium text-gray-400">
                      {cat.completed} completed
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Competency Progress */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Progress by Competency
          </h2>
          
          <div className="space-y-4">
            {competencies.map(({ slug, name }) => {
              // Get full module data from byCompetency for completion status
              const fullModules = byCompetency[slug]?.modules || []
              const compCompleted = fullModules.filter(m => completedIds.has(m.id)).length
              const compPercent = fullModules.length > 0 ? Math.round((compCompleted / fullModules.length) * 100) : 0
              
              return (
                <div key={slug} className="lms-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{name}</h3>
                    <span className="text-sm font-medium text-gray-400">
                      {compCompleted}/{fullModules.length}
                    </span>
                  </div>
                  
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${compPercent}%` }}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    {fullModules.map(m => {
                      const isComplete = completedIds.has(m.id)
                      return (
                        <Link
                          key={m.id}
                          href={`/learn/${slug}/${m.slug}`}
                          className="flex items-center gap-3 py-2 px-3 -mx-1 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          {isComplete ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <CircleIcon className="h-4 w-4 text-gray-300 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${isComplete ? "text-gray-500" : "text-gray-700 group-hover:text-gray-900"}`}>
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
        </section>
      </div>
    </LearnShell>
  )
}
