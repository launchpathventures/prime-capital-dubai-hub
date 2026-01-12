/**
 * CATALYST - Competency Page
 * 
 * Shows competency details with sidebar for navigation.
 * Data driven from Supabase.
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  BookOpenIcon, 
  ClockIcon, 
  ChevronRightIcon,
  GraduationCapIcon,
  PlayIcon,
  ArrowRightIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"

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
  
  return (
    <div className="learn-shell learn-shell--with-sidebar">
      {/* Header */}
      <header className="learn-header">
        <div className="learn-header__inner">
          <div className="learn-header__left">
            <Link href="/learn" className="learn-header__logo">
              <span className="learn-header__logo-icon">
                <GraduationCapIcon className="h-3.5 w-3.5" />
              </span>
              Prime Capital Learning
            </Link>
            <nav className="learn-header__breadcrumb">
              <Link href="/learn">Course</Link>
              <span className="learn-header__breadcrumb-sep">›</span>
              <span className="learn-header__breadcrumb-current">{currentCompetency.name}</span>
            </nav>
          </div>
          <nav className="learn-header__nav">
            <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/" />}>
              Home
            </Button>
          </nav>
        </div>
      </header>
      
      {/* Main content with sidebar */}
      <main className="learn-main">
        {/* Sidebar */}
        <aside className="learn-sidebar">
          <div className="learn-sidebar__section">
            <div className="learn-sidebar__heading">Competencies</div>
            <nav className="learn-sidebar__list">
              {allCompetencies.map((comp, index) => {
                const isActive = comp.slug === slug
                const hasModules = comp.modules.length > 0
                
                return (
                  <div key={comp.id} className="learn-sidebar__competency">
                    <Link
                      href={hasModules ? `/learn/${comp.slug}` : "#"}
                      className={`learn-sidebar__competency-link ${isActive ? 'learn-sidebar__competency-link--active' : ''} ${!hasModules ? 'learn-sidebar__competency-link--locked' : ''}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="learn-sidebar__competency-number">{index + 1}</span>
                      <span>{comp.name}</span>
                    </Link>
                    
                    {/* Show modules if this is active competency */}
                    {isActive && comp.modules.length > 0 && (
                      <div className="learn-sidebar__modules">
                        {comp.modules.map((mod) => (
                          <Link
                            key={mod.id}
                            href={`/learn/${comp.slug}/${mod.slug}`}
                            className="learn-sidebar__module-link"
                          >
                            {mod.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </aside>
        
        {/* Content */}
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
                  <span className="lms-hero__stat-value">{totalDuration}</span>
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
                        {module.duration_minutes ? `${module.duration_minutes} min` : 'Coming soon'}
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
        </div>
      </main>
    </div>
  )
}
