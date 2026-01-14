/**
 * CATALYST - Certification Admin Dashboard
 * 
 * Allows evaluators to record certification outcomes and view history.
 * Simplified interface focused on outcome recording.
 * Uses LearnShell for consistent sidebar navigation.
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  AwardIcon,
  UserIcon,
  ClipboardCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  BookOpenIcon,
  FileTextIcon,
  UsersIcon,
  TrendingUpIcon,
  GraduationCapIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { LearnShell } from "@/app/learn/_surface/learn-shell"
import { getUserRole, getUserForMenu } from "@/lib/auth/require-auth"

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
  certification_status: 'in_progress' | 'ready' | 'certified' | null
  created_at?: string
  role?: string
}

interface LearnerWithProgress {
  id: string
  full_name: string | null
  certification_status: 'in_progress' | 'ready' | 'certified' | null
  created_at?: string
  role?: string
  modules_completed: number
  total_modules: number
  last_activity?: string
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
  
  // Only fetch learners (not admins) who are pending certification
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, full_name, certification_status")
    .eq("role", "learner")
    .in("certification_status", ["ready", "in_progress"])
    .order("full_name")
  
  if (error) {
    console.error("Failed to fetch trainees:", error)
    return []
  }
  
  return data || []
}

async function getAllLearners(): Promise<LearnerWithProgress[]> {
  const supabase = await createClient()
  
  // Get all learners (role = 'learner')
  // Note: email is not on user_profiles, only on auth.users
  const { data: learners, error: learnersError } = await supabase
    .from("user_profiles")
    .select("id, full_name, certification_status, created_at, role")
    .eq("role", "learner")
    .order("created_at", { ascending: false })
  
  if (learnersError) {
    console.error("Failed to fetch learners:", learnersError)
    return []
  }
  
  // Get total module count
  const { count: totalModules } = await supabase
    .from("learning_modules")
    .select("*", { count: "exact", head: true })
  
  // Get progress for each learner
  const learnersWithProgress: LearnerWithProgress[] = await Promise.all(
    (learners || []).map(async (learner) => {
      const { count: completedCount } = await supabase
        .from("learning_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", learner.id)
        .eq("status", "completed")
      
      // Get last activity
      const { data: lastActivity } = await supabase
        .from("learning_progress")
        .select("updated_at")
        .eq("user_id", learner.id)
        .order("updated_at", { ascending: false })
        .limit(1)
      
      return {
        ...learner,
        modules_completed: completedCount || 0,
        total_modules: totalModules || 0,
        last_activity: lastActivity?.[0]?.updated_at,
      }
    })
  )
  
  return learnersWithProgress
}

async function getStats() {
  const supabase = await createClient()
  
  // Only count learners (not admins)
  const { count: certifiedCount } = await supabase
    .from("user_profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "learner")
    .eq("certification_status", "certified")
  
  const { count: pendingCount } = await supabase
    .from("user_profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "learner")
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
  icon,
  tooltip,
}: { 
  label: string
  value: string | number 
  icon: React.ReactNode
  tooltip?: string
}) {
  return (
    <div className="cert-admin-stat" title={tooltip}>
      <div className="cert-admin-stat__icon">{icon}</div>
      <div className="cert-admin-stat__content">
        <span className="cert-admin-stat__value">{value}</span>
        <span className="cert-admin-stat__label">{label}</span>
      </div>
    </div>
  )
}

function LearnerRow({ learner }: { learner: LearnerWithProgress }) {
  const joinedDate = learner.created_at 
    ? new Date(learner.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—"
  
  const progressPercent = learner.total_modules > 0 
    ? Math.round((learner.modules_completed / learner.total_modules) * 100)
    : 0
  
  const statusLabel = {
    certified: "Certified",
    ready: "Ready",
    in_progress: "In Progress",
  }[learner.certification_status || "in_progress"] || "In Progress"
  
  return (
    <div className="cert-admin-learner">
      <div className="cert-admin-learner__name">
        <UserIcon className="h-4 w-4 text-gray-400" />
        <span>{learner.full_name || "Unknown"}</span>
      </div>
      <div className="cert-admin-learner__progress">
        <div className="cert-admin-learner__progress-bar">
          <div 
            className="cert-admin-learner__progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="cert-admin-learner__progress-text">
          {learner.modules_completed}/{learner.total_modules} modules
        </span>
      </div>
      <div className={`cert-admin-learner__status cert-admin-learner__status--${learner.certification_status || 'in_progress'}`}>
        {learner.certification_status === 'certified' && <CheckCircleIcon className="h-3.5 w-3.5" />}
        {learner.certification_status === 'ready' && <GraduationCapIcon className="h-3.5 w-3.5" />}
        {(!learner.certification_status || learner.certification_status === 'in_progress') && <TrendingUpIcon className="h-3.5 w-3.5" />}
        <span>{statusLabel}</span>
      </div>
      <div className="cert-admin-learner__joined">
        {joinedDate}
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
  const [attempts, trainees, stats, learners, userRole, userMenu] = await Promise.all([
    getCertificationAttempts(),
    getPendingTrainees(),
    getStats(),
    getAllLearners(),
    getUserRole(),
    getUserForMenu(),
  ])

  return (
    <LearnShell 
      activeSection="admin"
      userRole={userRole}
      user={userMenu ?? undefined}
      coachContext={{ level: "course" }}
    >
      <div className="learn-content">
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
            tooltip="Learners who have passed certification"
          />
          <StatCard 
            label="Awaiting Certification" 
            value={stats.pending}
            icon={<ClockIcon className="h-5 w-5" />}
            tooltip="Learners with status 'in_progress' or 'ready' who haven't been certified yet"
          />
          <StatCard 
            label="Total Attempts" 
            value={stats.totalAttempts}
            icon={<ClipboardCheckIcon className="h-5 w-5" />}
            tooltip="Number of certification assessments recorded"
          />
          <StatCard 
            label="Pass Rate" 
            value={stats.passRate !== null ? `${stats.passRate}%` : "—"}
            icon={<CheckCircleIcon className="h-5 w-5" />}
            tooltip="Percentage of assessments that resulted in a pass"
          />
        </div>

        {/* Learner Progress Report */}
        <section className="cert-admin-section">
          <div className="cert-admin-section__header">
            <h2 className="cert-admin-section__title">
              <UsersIcon className="h-5 w-5" />
              All Learners
            </h2>
            <span className="cert-admin-section__count">{learners.length} total</span>
          </div>
          {learners.length > 0 ? (
            <div className="cert-admin-learners">
              <div className="cert-admin-learners__header">
                <span>Name</span>
                <span>Progress</span>
                <span>Status</span>
                <span>Joined</span>
              </div>
              {learners.map((learner) => (
                <LearnerRow key={learner.id} learner={learner} />
              ))}
            </div>
          ) : (
            <div className="cert-admin-empty cert-admin-empty--small">
              <UsersIcon className="h-8 w-8 text-gray-300" />
              <p>No learners registered yet</p>
            </div>
          )}
        </section>

        {/* Pending Trainees */}
        {trainees.length > 0 && (
          <section className="cert-admin-section">
            <h2 className="cert-admin-section__title">Ready for Assessment</h2>
            <div className="cert-admin-trainees">
              {trainees.map((trainee) => (
                <div key={trainee.id} className="cert-admin-trainee">
                  <div className="cert-admin-trainee__info">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="cert-admin-trainee__name">
                      {trainee.full_name || "Unknown"}
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
      </div>
    </LearnShell>
  )
}
