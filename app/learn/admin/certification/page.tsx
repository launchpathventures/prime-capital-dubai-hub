/**
 * CATALYST - Certification Admin Dashboard
 * 
 * Allows evaluators to record certification outcomes and view history.
 * Simplified interface focused on outcome recording.
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Stack, Row, Text } from "@/components/core"
import { 
  GraduationCapIcon,
  AwardIcon,
  UserIcon,
  CalendarIcon,
  ClipboardCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  SearchIcon,
  PlusIcon,
  BookOpenIcon,
  FileTextIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

// =============================================================================
// Types
// =============================================================================

interface CertificationAttempt {
  id: string
  created_at: string
  user_id: string
  evaluator_name: string
  outcome: 'passed' | 'needs_work'
  market_knowledge: number
  client_focus: number
  communication: number
  process_expertise: number
  composure: number
  average_score: number
  notes: string | null
  recording_url: string | null
  user_profile?: {
    full_name: string | null
    email: string | null
  }
}

interface UserProfile {
  id: string
  full_name: string | null
  email: string | null
  certification_status: 'in_progress' | 'ready' | 'certified' | null
}

// =============================================================================
// Data Fetching
// =============================================================================

async function getCertificationAttempts(): Promise<CertificationAttempt[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("certification_attempts")
    .select(`
      *,
      user_profile:user_profiles(full_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(50)
  
  if (error) {
    // Table might not exist yet
    console.log("Certification attempts not available:", error.message)
    return []
  }
  
  return data || []
}

async function getPendingTrainees(): Promise<UserProfile[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, full_name, email, certification_status")
    .in("certification_status", ["ready", "in_progress"])
    .order("full_name")
  
  if (error) {
    console.error("Failed to fetch trainees:", error)
    return []
  }
  
  return data || []
}

async function getStats() {
  const supabase = await createClient()
  
  const { count: certifiedCount } = await supabase
    .from("user_profiles")
    .select("*", { count: "exact", head: true })
    .eq("certification_status", "certified")
  
  const { count: pendingCount } = await supabase
    .from("user_profiles")
    .select("*", { count: "exact", head: true })
    .in("certification_status", ["ready", "in_progress"])
  
  // Get pass rate from attempts (if table exists)
  const { data: attempts } = await supabase
    .from("certification_attempts")
    .select("outcome")
  
  const passRate = attempts && attempts.length > 0
    ? Math.round((attempts.filter(a => a.outcome === 'passed').length / attempts.length) * 100)
    : null
  
  return {
    certified: certifiedCount || 0,
    pending: pendingCount || 0,
    passRate,
    totalAttempts: attempts?.length || 0,
  }
}

// =============================================================================
// Components
// =============================================================================

function StatCard({ 
  label, 
  value, 
  icon 
}: { 
  label: string
  value: string | number 
  icon: React.ReactNode 
}) {
  return (
    <div className="cert-admin-stat">
      <div className="cert-admin-stat__icon">{icon}</div>
      <div className="cert-admin-stat__content">
        <span className="cert-admin-stat__value">{value}</span>
        <span className="cert-admin-stat__label">{label}</span>
      </div>
    </div>
  )
}

function AttemptRow({ attempt }: { attempt: CertificationAttempt }) {
  const date = new Date(attempt.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  
  return (
    <div className="cert-admin-attempt">
      <div className="cert-admin-attempt__main">
        <div className="cert-admin-attempt__user">
          <UserIcon className="h-4 w-4 text-gray-400" />
          <span className="cert-admin-attempt__name">
            {attempt.user_profile?.full_name || "Unknown"}
          </span>
        </div>
        <div className="cert-admin-attempt__meta">
          <span className="cert-admin-attempt__date">{date}</span>
          <span className="cert-admin-attempt__evaluator">by {attempt.evaluator_name}</span>
        </div>
      </div>
      <div className="cert-admin-attempt__scores">
        <span className="cert-admin-attempt__score">Avg: {attempt.average_score.toFixed(1)}</span>
      </div>
      <div className={`cert-admin-attempt__outcome cert-admin-attempt__outcome--${attempt.outcome}`}>
        {attempt.outcome === 'passed' ? (
          <>
            <CheckCircleIcon className="h-4 w-4" />
            <span>Passed</span>
          </>
        ) : (
          <>
            <XCircleIcon className="h-4 w-4" />
            <span>Needs Work</span>
          </>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="cert-admin-empty">
      <ClipboardCheckIcon className="h-10 w-10 text-gray-300" />
      <h3>No Certification Records Yet</h3>
      <p>
        Certification attempts will appear here once recorded.
        Use the "Record Outcome" button after conducting an assessment.
      </p>
    </div>
  )
}

// =============================================================================
// Page Component
// =============================================================================

export default async function CertificationAdminPage() {
  const [attempts, trainees, stats] = await Promise.all([
    getCertificationAttempts(),
    getPendingTrainees(),
    getStats(),
  ])

  return (
    <div className="learn-shell">
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
              <span className="learn-header__breadcrumb-current">Certification Admin</span>
            </nav>
          </div>
          <nav className="learn-header__nav">
            <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/learn/certification" />}>
              Learner View
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="learn-content">
        {/* Title */}
        <div className="cert-admin-header">
          <div>
            <h1 className="cert-admin-title">Certification Dashboard</h1>
            <p className="cert-admin-subtitle">
              Record assessment outcomes and track certification progress
            </p>
          </div>
          <div className="cert-admin-header__actions">
            <Button variant="outline" nativeButton={false} render={<Link href="/learn/admin/certification/resources" />}>
              <BookOpenIcon className="h-4 w-4 mr-2" />
              Resources
            </Button>
            <Button size="lg" nativeButton={false} render={<Link href="/learn/admin/certification/record" />}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Record Outcome
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="cert-admin-stats">
          <StatCard 
            label="Certified" 
            value={stats.certified}
            icon={<AwardIcon className="h-5 w-5" />}
          />
          <StatCard 
            label="Pending" 
            value={stats.pending}
            icon={<ClockIcon className="h-5 w-5" />}
          />
          <StatCard 
            label="Total Attempts" 
            value={stats.totalAttempts}
            icon={<ClipboardCheckIcon className="h-5 w-5" />}
          />
          <StatCard 
            label="Pass Rate" 
            value={stats.passRate !== null ? `${stats.passRate}%` : "—"}
            icon={<CheckCircleIcon className="h-5 w-5" />}
          />
        </div>

        {/* Pending Trainees */}
        {trainees.length > 0 && (
          <section className="cert-admin-section">
            <h2 className="cert-admin-section__title">Pending Trainees</h2>
            <div className="cert-admin-trainees">
              {trainees.map((trainee) => (
                <div key={trainee.id} className="cert-admin-trainee">
                  <div className="cert-admin-trainee__info">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="cert-admin-trainee__name">
                      {trainee.full_name || trainee.email || "Unknown"}
                    </span>
                  </div>
                  <span className={`cert-admin-trainee__status cert-admin-trainee__status--${trainee.certification_status}`}>
                    {trainee.certification_status === 'ready' ? 'Ready for Assessment' : 'In Progress'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Attempts */}
        <section className="cert-admin-section">
          <h2 className="cert-admin-section__title">Recent Assessments</h2>
          {attempts.length > 0 ? (
            <div className="cert-admin-attempts">
              {attempts.map((attempt) => (
                <AttemptRow key={attempt.id} attempt={attempt} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>

        {/* Quick Resources */}
        <section className="cert-admin-section">
          <h2 className="cert-admin-section__title">Quick Resources</h2>
          <div className="cert-admin-resources">
            <Link href="/learn/admin/certification/resources?view=evaluator-guide" className="cert-admin-resource">
              <BookOpenIcon className="h-5 w-5" />
              <div>
                <span className="cert-admin-resource__title">Evaluator Guide</span>
                <span className="cert-admin-resource__desc">Session structure & scoring guidance</span>
              </div>
            </Link>
            <Link href="/learn/admin/certification/resources?view=rubric" className="cert-admin-resource">
              <ClipboardCheckIcon className="h-5 w-5" />
              <div>
                <span className="cert-admin-resource__title">Scoring Rubric</span>
                <span className="cert-admin-resource__desc">5-dimension criteria & pass thresholds</span>
              </div>
            </Link>
            <Link href="/learn/admin/certification/resources?view=scenarios-a" className="cert-admin-resource">
              <FileTextIcon className="h-5 w-5" />
              <div>
                <span className="cert-admin-resource__title">Scenario Set A</span>
                <span className="cert-admin-resource__desc">Primary assessment scenarios</span>
              </div>
            </Link>
            <Link href="/learn/admin/certification/resources?view=scenarios-b" className="cert-admin-resource">
              <FileTextIcon className="h-5 w-5" />
              <div>
                <span className="cert-admin-resource__title">Scenario Set B</span>
                <span className="cert-admin-resource__desc">Retake assessment scenarios</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Info Box */}
        <div className="cert-admin-info">
          <h4>Recording an Outcome</h4>
          <p>
            After conducting a certification assessment, click "Record Outcome" to enter:
          </p>
          <ul>
            <li>Trainee name and assessment date</li>
            <li>Scores for each of the 5 dimensions (1-5 scale)</li>
            <li>Overall outcome (Pass or Needs Work)</li>
            <li>Recording URL and qualitative notes</li>
          </ul>
          <p>
            The system will automatically update the trainee's certification status based on the outcome.
          </p>
        </div>
      </main>
    </div>
  )
}
