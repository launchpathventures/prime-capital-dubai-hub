/**
 * CATALYST - Certification Preparation Page
 * 
 * Guides learners through certification requirements and preparation.
 * Shows readiness checklist and provides preparation materials.
 */

import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Row, Text } from "@/components/core"
import { 
  AwardIcon,
  CheckCircle2Icon,
  BookOpenIcon,
  ClipboardCheckIcon,
  UsersIcon,
  ClockIcon,
  SparklesIcon,
  MessageSquareIcon,
  InfoIcon,
  CircleIcon,
  ChevronRightIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Certification | Learning Portal",
  description: "Prepare for your Prime Capital consultant certification assessment.",
}

// =============================================================================
// Types
// =============================================================================

interface Competency {
  id: string
  slug: string
  name: string
  module_count: number
  quiz_count: number
}

interface UserProgress {
  competenciesCompleted: number
  totalCompetencies: number
  modulesCompleted: number
  totalModules: number
  quizzesCompleted: number
  totalQuizzes: number
  averageQuizScore: number | null
}

interface UserProfile {
  id: string
  certification_status: 'in_progress' | 'ready' | 'certified' | null
  full_name: string | null
}

// =============================================================================
// Data Fetching
// =============================================================================

async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data } = await supabase
    .from("user_profiles")
    .select("id, certification_status, full_name")
    .eq("id", user.id)
    .single()
  
  return data
}

async function getCompetencies(): Promise<Competency[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("competencies")
    .select(`
      id,
      slug,
      name
    `)
    .order("display_order")
  
  if (error) {
    console.error("Failed to fetch competencies:", error)
    return []
  }
  
  // Get module and quiz counts per competency
  const competenciesWithCounts = await Promise.all(
    (data || []).map(async (comp) => {
      const { count: moduleCount } = await supabase
        .from("learning_modules")
        .select("*", { count: "exact", head: true })
        .eq("competency_id", comp.id)
      
      const { count: quizCount } = await supabase
        .from("quizzes")
        .select("*", { count: "exact", head: true })
        .eq("competency_slug", comp.slug)
      
      return {
        ...comp,
        module_count: moduleCount || 0,
        quiz_count: quizCount || 0,
      }
    })
  )
  
  return competenciesWithCounts
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- userId reserved for future per-user filtering
async function getUserProgress(_userId: string): Promise<UserProgress> {
  const supabase = await createClient()
  
  // Get total counts
  const { count: totalModules } = await supabase
    .from("learning_modules")
    .select("*", { count: "exact", head: true })
  
  const { count: totalQuizzes } = await supabase
    .from("quizzes")
    .select("*", { count: "exact", head: true })
  
  const { count: totalCompetencies } = await supabase
    .from("competencies")
    .select("*", { count: "exact", head: true })
  
  // Get user progress (simplified - in production would track actual progress)
  // For now, return mock data
  return {
    competenciesCompleted: 0,
    totalCompetencies: totalCompetencies || 0,
    modulesCompleted: 0,
    totalModules: totalModules || 0,
    quizzesCompleted: 0,
    totalQuizzes: totalQuizzes || 0,
    averageQuizScore: null,
  }
}

// =============================================================================
// Components
// =============================================================================

function ReadinessChecklist({ progress }: { progress: UserProgress }) {
  const checks = [
    {
      label: "Complete all modules",
      done: progress.modulesCompleted >= progress.totalModules,
      detail: `${progress.modulesCompleted}/${progress.totalModules} modules completed`,
    },
    {
      label: "Pass all quizzes",
      done: progress.quizzesCompleted >= progress.totalQuizzes,
      detail: `${progress.quizzesCompleted}/${progress.totalQuizzes} quizzes passed`,
    },
    {
      label: "Average quiz score ≥80%",
      done: (progress.averageQuizScore ?? 0) >= 80,
      detail: progress.averageQuizScore 
        ? `Current average: ${Math.round(progress.averageQuizScore)}%`
        : "Complete quizzes to see average",
    },
    {
      label: "Practice with scenarios",
      done: false, // Would track scenario practice
      detail: "Recommended: Practice 3+ scenarios per category",
    },
  ]
  
  const allDone = checks.every(c => c.done)
  
  return (
    <div className="cert-checklist">
      <div className="cert-checklist__header">
        <ClipboardCheckIcon className="h-5 w-5" />
        <h3>Readiness Checklist</h3>
      </div>
      <div className="cert-checklist__items">
        {checks.map((check, i) => (
          <div 
            key={i} 
            className={`cert-checklist__item ${check.done ? 'cert-checklist__item--done' : ''}`}
          >
            {check.done ? (
              <CheckCircle2Icon className="h-5 w-5 text-green-600" />
            ) : (
              <CircleIcon className="h-5 w-5 text-gray-300" />
            )}
            <div className="cert-checklist__content">
              <span className="cert-checklist__label">{check.label}</span>
              <span className="cert-checklist__detail">{check.detail}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={`cert-checklist__footer ${allDone ? 'cert-checklist__footer--ready' : ''}`}>
        {allDone ? (
          <Text size="sm" className="text-green-700">
            You meet all requirements for certification!
          </Text>
        ) : (
          <Text size="sm" className="text-gray-500">
            Complete all items to become eligible for certification
          </Text>
        )}
      </div>
    </div>
  )
}

function AssessmentFormat() {
  const steps = [
    {
      icon: <ClockIcon className="h-5 w-5" />,
      title: "90 minutes",
      description: "In-person session with a founding team member",
    },
    {
      icon: <MessageSquareIcon className="h-5 w-5" />,
      title: "5 scenarios",
      description: "Discovery, objection handling, presentation, closing, difficult situation",
    },
    {
      icon: <UsersIcon className="h-5 w-5" />,
      title: "Roleplay format",
      description: "Evaluator plays client personas, you respond as consultant",
    },
    {
      icon: <AwardIcon className="h-5 w-5" />,
      title: "Pass or develop",
      description: "Clear outcome with specific feedback for improvement",
    },
  ]
  
  return (
    <div className="cert-format">
      <h3 className="cert-format__title">Assessment Format</h3>
      <div className="cert-format__grid">
        {steps.map((step, i) => (
          <div key={i} className="cert-format__item">
            <div className="cert-format__icon">{step.icon}</div>
            <div className="cert-format__content">
              <span className="cert-format__item-title">{step.title}</span>
              <span className="cert-format__item-desc">{step.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PreparationTips() {
  const tips = [
    {
      title: "Practice out loud",
      description: "Reading scenarios is good. Speaking them is essential. Record yourself and listen back.",
    },
    {
      title: "Review weak areas",
      description: "Check your quiz scores. Any competency below 80% needs extra attention.",
    },
    {
      title: "Know your market data",
      description: "You'll be challenged on Dubai market knowledge. Review prices, areas, and trends.",
    },
    {
      title: "Get good rest",
      description: "Don't cram the night before. A clear head beats last-minute memorization.",
    },
  ]
  
  return (
    <div className="cert-tips">
      <h3 className="cert-tips__title">Preparation Tips</h3>
      <div className="cert-tips__list">
        {tips.map((tip, i) => (
          <div key={i} className="cert-tips__item">
            <div className="cert-tips__number">{i + 1}</div>
            <div className="cert-tips__content">
              <span className="cert-tips__item-title">{tip.title}</span>
              <p className="cert-tips__item-desc">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// Page Component
// =============================================================================

export default async function CertificationPage() {
  const [profile, competencies] = await Promise.all([
    getUserProfile(),
    getCompetencies(),
  ])
  
  // Get progress (would be real progress tracking in production)
  const progress = profile 
    ? await getUserProgress(profile.id)
    : {
        competenciesCompleted: 0,
        totalCompetencies: competencies.length,
        modulesCompleted: 0,
        totalModules: competencies.reduce((sum, c) => sum + c.module_count, 0),
        quizzesCompleted: 0,
        totalQuizzes: competencies.reduce((sum, c) => sum + c.quiz_count, 0),
        averageQuizScore: null,
      }
  
  const isReadyForCertification = 
    progress.modulesCompleted >= progress.totalModules &&
    progress.quizzesCompleted >= progress.totalQuizzes &&
    (progress.averageQuizScore ?? 0) >= 80
  
  const isCertified = profile?.certification_status === 'certified'

  return (
    <div className="learn-content">
        {/* Hero Section */}
        <section className="cert-hero">
          <div className="cert-hero__icon">
            <AwardIcon className="h-8 w-8" />
          </div>
          <h1 className="cert-hero__title">
            {isCertified ? "You're Certified!" : "Certification Assessment"}
          </h1>
          <p className="cert-hero__description">
            {isCertified ? (
              "Congratulations! You've demonstrated readiness to represent Prime Capital to clients."
            ) : (
              "The final step to becoming a Prime Capital consultant. Complete your training, then demonstrate your readiness in a practical assessment."
            )}
          </p>
        </section>

      {/* Certified State */}
      {isCertified && (
        <section className="cert-certified">
          <div className="cert-certified__badge">
            <AwardIcon className="h-12 w-12" />
          </div>
          <h2>Prime Capital Certified Consultant</h2>
          <p>You&apos;re ready to work with clients. Keep developing your skills through practice.</p>
          <Row gap="md" className="mt-6">
            <Button render={<Link href="/learn/scenarios" />}>
              Continue Practicing
            </Button>
            <Button variant="outline" render={<Link href="/learn" />}>
              Review Materials
            </Button>
          </Row>
        </section>
      )}

      {/* Not Certified - Show Preparation */}
      {!isCertified && (
        <>
          {/* Progress Overview */}
          <section className="cert-progress">
            <h2 className="cert-progress__title">Your Progress</h2>
            <div className="cert-progress__bars">
              <div className="cert-progress__bar">
                <div className="cert-progress__bar-header">
                  <span>Modules</span>
                  <span>{progress.modulesCompleted}/{progress.totalModules}</span>
                </div>
                <div className="cert-progress__bar-track">
                  <div 
                    className="cert-progress__bar-fill"
                    style={{ 
                      width: `${progress.totalModules > 0 
                        ? (progress.modulesCompleted / progress.totalModules) * 100 
                        : 0}%` 
                    }}
                  />
                </div>
              </div>
              <div className="cert-progress__bar">
                <div className="cert-progress__bar-header">
                  <span>Quizzes</span>
                  <span>{progress.quizzesCompleted}/{progress.totalQuizzes}</span>
                </div>
                <div className="cert-progress__bar-track">
                  <div 
                    className="cert-progress__bar-fill"
                    style={{ 
                      width: `${progress.totalQuizzes > 0 
                        ? (progress.quizzesCompleted / progress.totalQuizzes) * 100 
                        : 0}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Two Column Layout */}
          <div className="cert-columns">
            {/* Left: Checklist */}
            <div className="cert-column">
              <ReadinessChecklist progress={progress} />
            </div>
            
            {/* Right: Format */}
            <div className="cert-column">
              <AssessmentFormat />
            </div>
          </div>

          {/* Preparation Tips */}
          <PreparationTips />

          {/* Resources Section */}
          <section className="cert-resources">
            <h3 className="cert-resources__title">Preparation Resources</h3>
            <div className="cert-resources__grid">
              <Link href="/learn/certification/guide" className="cert-resource-card">
                  <div className="cert-resource-card__icon">
                    <ClipboardCheckIcon className="h-5 w-5" />
                  </div>
                  <div className="cert-resource-card__content">
                    <span className="cert-resource-card__title">Preparation Guide</span>
                    <span className="cert-resource-card__desc">
                      What to expect on assessment day and how to prepare
                    </span>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                </Link>
              
              <Link href="/learn/scenarios" className="cert-resource-card">
                  <div className="cert-resource-card__icon">
                    <SparklesIcon className="h-5 w-5" />
                  </div>
                  <div className="cert-resource-card__content">
                    <span className="cert-resource-card__title">Practice Scenarios</span>
                    <span className="cert-resource-card__desc">
                      75 scenarios across 6 categories to practice before your assessment
                    </span>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                </Link>
                
                <Link href="/learn" className="cert-resource-card">
                  <div className="cert-resource-card__icon">
                    <BookOpenIcon className="h-5 w-5" />
                  </div>
                  <div className="cert-resource-card__content">
                    <span className="cert-resource-card__title">Review Materials</span>
                    <span className="cert-resource-card__desc">
                      Go back through modules and quizzes to reinforce your knowledge
                    </span>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                </Link>
              </div>
            </section>

            {/* Schedule CTA */}
            <section className="cert-cta">
              <div className="cert-cta__content">
                <h3>Ready to Schedule?</h3>
                <p>
                  {isReadyForCertification ? (
                    "You meet all requirements! Contact your training coordinator to schedule your assessment."
                  ) : (
                    "Complete the checklist items above, then contact your training coordinator to schedule."
                  )}
                </p>
              </div>
              <Button 
                size="lg"
                disabled={!isReadyForCertification}
                className={!isReadyForCertification ? "opacity-50 cursor-not-allowed" : ""}
              >
                {isReadyForCertification ? "Contact Coordinator" : "Complete Training First"}
              </Button>
            </section>

            {/* Info Note */}
            <div className="cert-info">
              <InfoIcon className="h-4 w-4" />
              <Text size="sm" className="text-gray-600">
                Certification sessions are scheduled offline with founding team members. 
                Results are typically communicated within 48 hours.
              </Text>
            </div>
          </>
        )}
    </div>
  )
}
