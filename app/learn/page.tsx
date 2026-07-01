/**
 * CATALYST - Learn Dashboard
 *
 * Course overview page showing all competencies with per-competency progress.
 * Premium design with refined visual hierarchy.
 *
 * Shell is provided by layout.tsx - this page only renders content.
 */

import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import {
  BookOpenIcon,
  ClockIcon,
  LockIcon,
  PlayIcon,
  GraduationCapIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getMyCertificate } from "@/lib/lms/certificate-queries"
import { AcademyTour } from "./_surface/academy-tour"
import { getMyProgress, type CompetencyProgress } from "@/lib/lms/admin-queries"

export const metadata: Metadata = {
  title: "Dashboard | Learning Portal",
  description: "Track competencies, modules, and certification progress in the Prime Capital Dubai learning portal.",
}

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
  const [competencies, myProgress, certificate] = await Promise.all([
    getCompetenciesWithModules(),
    getMyProgress(),
    getMyCertificate(),
  ])

  const isAuthenticated = myProgress !== null

  // Build competency slug -> progress lookup
  const progressBySlug: Record<string, CompetencyProgress> = {}
  if (myProgress) {
    for (const cp of myProgress.competencyProgress) {
      progressBySlug[cp.slug] = cp
    }
  }

  const totalModules = competencies.reduce((sum, c) => sum + c.modules.length, 0)
  const totalDuration = competencies.reduce(
    (sum, c) => sum + c.modules.reduce((s, m) => s + (m.duration_minutes || 0), 0),
    0
  )
  const totalCompleted = myProgress?.completedModules ?? 0
  const overallPercent = myProgress?.overallProgress ?? 0
  const availableCompetencies = competencies.filter(c => c.modules.length > 0)

  // Find the next competency to work on (first incomplete with modules)
  const nextCompetency = isAuthenticated
    ? availableCompetencies.find(c => {
        const cp = progressBySlug[c.slug]
        const completed = cp?.completedModules ?? 0
        const total = cp?.totalModules ?? c.modules.length
        return completed < total
      }) || availableCompetencies[0]
    : availableCompetencies[0]

  // CTA text based on progress
  const ctaText = !isAuthenticated || totalCompleted === 0
    ? "Start Learning"
    : overallPercent === 100
      ? "Review Course"
      : "Continue Learning"

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
            {isAuthenticated && totalCompleted > 0 ? (
              /* Progress-aware stats for returning users */
              <div className="lms-hero__stats">
                <div className="lms-hero__stat">
                  <span className="lms-hero__stat-value">{overallPercent}%</span>
                  <span className="lms-hero__stat-label">Complete</span>
                </div>
                <div className="lms-hero__stat">
                  <span className="lms-hero__stat-value">{totalCompleted}/{totalModules}</span>
                  <span className="lms-hero__stat-label">Modules</span>
                </div>
                <div className="lms-hero__stat">
                  <span className="lms-hero__stat-value">{Object.values(progressBySlug).filter(cp => cp.completedModules === cp.totalModules).length}/{competencies.length}</span>
                  <span className="lms-hero__stat-label">Competencies</span>
                </div>
              </div>
            ) : (
              /* Default stats for new/unauthenticated users */
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
            )}
            {nextCompetency && (
              <div className="lms-hero__actions">
                <Button
                  size="lg"
                  className="gap-2 bg-white text-primary-700 hover:bg-white/90"
                  render={<Link href={`/learn/${nextCompetency.slug}`} />}
                >
                  <PlayIcon className="h-4 w-4" />
                  {ctaText}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Certificate Banner */}
        {certificate && !certificate.revokedAt && (
          <Link href="/learn/certification" className="lms-card lms-card--clickable lms-certificate-banner">
            <div className="lms-certificate-banner__icon">
              <GraduationCapIcon className="h-6 w-6" />
            </div>
            <div className="lms-certificate-banner__content">
              <h3 className="lms-certificate-banner__title">Your Certificate is Ready</h3>
              <p className="lms-certificate-banner__description">
                You&apos;ve completed the training. View and download your completion certificate.
              </p>
            </div>
            <div className="lms-certificate-banner__action">
              <ArrowRightIcon className="h-5 w-5" />
            </div>
          </Link>
        )}

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
                    {index}
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

            const cp = progressBySlug[comp.slug]
            const completed = cp?.completedModules ?? 0
            const total = cp?.totalModules ?? comp.modules.length
            const percent = cp?.progressPercent ?? 0
            const isComplete = completed === total && total > 0

            return (
              <Link
                key={comp.id}
                href={`/learn/${comp.slug}`}
                className="lms-card lms-card--clickable competency-card"
              >
                <div className={`competency-card__index${isComplete ? " competency-card__index--complete" : ""}`}>
                  {isComplete ? <CheckCircle2Icon className="h-5 w-5" /> : index}
                </div>
                <div className="competency-card__body">
                  <h3 className="competency-card__title">{comp.name}</h3>
                  {comp.description && (
                    <p className="competency-card__description">{comp.description}</p>
                  )}

                  <div className="competency-card__meta">
                    <span className="competency-card__meta-item">
                      <BookOpenIcon className="h-3 w-3" />
                      {completed}/{total} modules
                    </span>
                    {duration > 0 && (
                      <span className="competency-card__meta-item">
                        <ClockIcon className="h-3 w-3" />
                        {duration} min
                      </span>
                    )}
                  </div>
                  {/* Progress bar */}
                  {total > 0 && (
                    <div className="competency-card__progress">
                      <div className="competency-card__progress-bar">
                        <div
                          className={`competency-card__progress-fill${isComplete ? " competency-card__progress-fill--complete" : ""}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )}
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
