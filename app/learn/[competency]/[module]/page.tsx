/**
 * CATALYST - Module Page
 * 
 * Shows module content with full sidebar navigation.
 * Sidebar shows all competencies with the current one expanded.
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  GraduationCapIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"

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
}

interface Competency {
  id: string
  slug: string
  name: string
  display_order: number
  modules: Module[]
}

interface PageProps {
  params: Promise<{ competency: string; module: string }>
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

export default async function ModulePage({ params }: PageProps) {
  const { competency: competencySlug, module: moduleSlug } = await params
  
  const allCompetencies = await getAllCompetencies()
  const currentCompetency = allCompetencies.find(c => c.slug === competencySlug)
  
  if (!currentCompetency) {
    notFound()
  }
  
  const currentModuleIndex = currentCompetency.modules.findIndex(m => m.slug === moduleSlug)
  
  if (currentModuleIndex === -1) {
    notFound()
  }
  
  const module = currentCompetency.modules[currentModuleIndex]
  const prevModule = currentModuleIndex > 0 ? currentCompetency.modules[currentModuleIndex - 1] : null
  const nextModule = currentModuleIndex < currentCompetency.modules.length - 1 
    ? currentCompetency.modules[currentModuleIndex + 1] 
    : null
  
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
              <Link href={`/learn/${currentCompetency.slug}`}>{currentCompetency.name}</Link>
              <span className="learn-header__breadcrumb-sep">›</span>
              <span className="learn-header__breadcrumb-current">{module.title}</span>
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
                const isActive = comp.slug === competencySlug
                const hasModules = comp.modules.length > 0
                
                return (
                  <div key={comp.id} className="learn-sidebar__competency">
                    <Link
                      href={hasModules ? `/learn/${comp.slug}` : "#"}
                      className={`learn-sidebar__competency-link ${isActive ? 'learn-sidebar__competency-link--active' : ''}`}
                    >
                      <span className="learn-sidebar__competency-number">{index + 1}</span>
                      <span>{comp.name}</span>
                    </Link>
                    
                    {/* Show modules if this is active competency */}
                    {isActive && comp.modules.length > 0 && (
                      <div className="learn-sidebar__modules">
                        {comp.modules.map((mod) => {
                          const isModuleActive = mod.slug === moduleSlug
                          return (
                            <Link
                              key={mod.id}
                              href={`/learn/${comp.slug}/${mod.slug}`}
                              className={`learn-sidebar__module-link ${isModuleActive ? 'learn-sidebar__module-link--active' : ''}`}
                              aria-current={isModuleActive ? "page" : undefined}
                            >
                              {mod.title}
                            </Link>
                          )
                        })}
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
          
          {/* Module header */}
          <div className="lms-module-header">
            <div className="lms-module-header__meta">
              <span>Module {module.display_order + 1} of {currentCompetency.modules.length}</span>
              {module.duration_minutes && (
                <>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ClockIcon className="h-3.5 w-3.5" />
                    {module.duration_minutes} min read
                  </span>
                </>
              )}
            </div>
            <h1 className="lms-module-header__title">
              {module.title}
            </h1>
          </div>
          
          {/* Module content */}
          <div className="lms-card" style={{ padding: '1.75rem' }}>
            <div className="lms-prose">
              {module.content ? (
                <p>{module.content}</p>
              ) : (
                <div className="lms-empty">
                  <div className="lms-empty__icon">
                    <GraduationCapIcon className="h-full w-full" />
                  </div>
                  <h3 className="lms-empty__title">Content Coming Soon</h3>
                  <p className="lms-empty__description">
                    This module is being prepared. Check back soon for the full learning material.
                  </p>
                </div>
              )}
            </div>
          </div>
          
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
      </main>
    </div>
  )
}
