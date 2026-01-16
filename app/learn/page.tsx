/**
 * CATALYST - Learn Dashboard
 * 
 * Course overview page showing all competencies.
 * Premium design with refined visual hierarchy.
 * 
 * Shell is provided by layout.tsx - this page only renders content.
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  BookOpenIcon, 
  ClockIcon, 
  LockIcon,
  PlayIcon,
  GraduationCapIcon,
  ArrowRightIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { AcademyTour } from "./_surface/academy-tour"

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

// =============================================================================
// Data Fetching
// =============================================================================

async function getCompetenciesWithModules(): Promise<Competency[]> {
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

// =============================================================================
// Page Component
// =============================================================================

export default async function LearnDashboardPage() {
  const competencies = await getCompetenciesWithModules()
  
  const totalModules = competencies.reduce((sum, c) => sum + c.modules.length, 0)
  const totalDuration = competencies.reduce(
    (sum, c) => sum + c.modules.reduce((s, m) => s + (m.duration_minutes || 0), 0),
    0
  )
  const availableCompetencies = competencies.filter(c => c.modules.length > 0)
  
  // Find first competency with modules for CTA
  const firstCompetency = availableCompetencies[0]
  
  return (
    <div className="learn-content">
      {/* Hero Section */}
        <section className="lms-hero">
          <div className="lms-hero__content">
            <div className="lms-hero__eyebrow">
              <GraduationCapIcon className="h-3.5 w-3.5" />
              Prime Capital Dubai
            </div>
            <h1 className="lms-hero__title">
              Consultant Training Program
            </h1>
            <p className="lms-hero__description">
              Master the skills and knowledge you need to succeed as a Prime Capital 
              real estate consultant. Complete all competencies to earn your certification.
            </p>
            <div className="lms-hero__stats">
              <div className="lms-hero__stat">
                <span className="lms-hero__stat-value">{competencies.length}</span>
                <span className="lms-hero__stat-label">Competencies</span>
              </div>
              <div className="lms-hero__stat">
                <span className="lms-hero__stat-value">{totalModules}</span>
                <span className="lms-hero__stat-label">Modules</span>
              </div>
              <div className="lms-hero__stat">
                <span className="lms-hero__stat-value">~{Math.round((totalDuration || totalModules * 25) / 60)}h</span>
                <span className="lms-hero__stat-label">Duration</span>
              </div>
            </div>
            {firstCompetency && (
              <div className="lms-hero__actions">
                <Button 
                  size="lg" 
                  className="gap-2 bg-white text-primary-700 hover:bg-white/90"
                  nativeButton={false}
                  render={<Link href={`/learn/${firstCompetency.slug}`} />}
                >
                  <PlayIcon className="h-4 w-4" />
                  Start Learning
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Academy Tour */}
        <AcademyTour />
        
        {/* Competency List */}
        <section className="lms-section" id="learning-path">
          <div className="lms-section__header">
            <h2 className="lms-section__title">Your Learning Path</h2>
            <span className="lms-section__subtitle">
              {availableCompetencies.length} of {competencies.length} available
            </span>
          </div>
          
          <div className="lms-list">
            {competencies.map((comp, index) => {
              const hasModules = comp.modules.length > 0
            const duration = comp.modules.reduce((s, m) => s + (m.duration_minutes || 0), 0)
            const isLocked = !hasModules
            
            if (isLocked) {
              return (
                <div 
                  key={comp.id}
                  className="lms-card competency-card competency-card--locked"
                >
                  <div className="competency-card__index">
                    {index + 1}
                  </div>
                  <div className="competency-card__body">
                    <h3 className="competency-card__title">{comp.name}</h3>
                    {comp.description && (
                      <p className="competency-card__description">{comp.description}</p>
                    )}
                    <div className="competency-card__meta">
                      <span className="competency-card__meta-item">
                        <LockIcon className="h-3 w-3" />
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            
            return (
              <Link
                key={comp.id}
                href={`/learn/${comp.slug}`}
                className="lms-card lms-card--clickable competency-card"
              >
                <div className="competency-card__index">
                  {index + 1}
                </div>
                <div className="competency-card__body">
                  <h3 className="competency-card__title">{comp.name}</h3>
                  {comp.description && (
                    <p className="competency-card__description">{comp.description}</p>
                  )}
                  <div className="competency-card__meta">
                    <span className="competency-card__meta-item">
                      <BookOpenIcon className="h-3 w-3" />
                      {comp.modules.length} modules
                    </span>
                    {duration > 0 && (
                      <span className="competency-card__meta-item">
                        <ClockIcon className="h-3 w-3" />
                        {duration} min
                      </span>
                    )}
                  </div>
                </div>
                <div className="competency-card__action">
                  <ArrowRightIcon className="h-4 w-4" />
                </div>
              </Link>
            )
          })}
          </div>
        </section>
      </div>
  )
}
