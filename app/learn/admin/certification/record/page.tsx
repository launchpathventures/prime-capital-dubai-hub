/**
 * CATALYST - Record Certification Outcome
 * 
 * Form for evaluators to record assessment results after conducting
 * an in-person certification conversation.
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  GraduationCapIcon,
  ArrowLeftIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth/require-auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

// =============================================================================
// Types
// =============================================================================

interface UserProfile {
  id: string
  full_name: string | null
  certification_status: 'in_progress' | 'ready' | 'certified' | null
}

// =============================================================================
// Data Fetching
// =============================================================================

async function getTrainees(): Promise<UserProfile[]> {
  const supabase = await createClient()
  
  // Only show learners (not admins) who haven't been certified yet
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

async function getNextAttemptNumber(userId: string): Promise<number> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from("certification_attempts")
    .select("attempt_number")
    .eq("user_id", userId)
    .order("attempt_number", { ascending: false })
    .limit(1)
  
  return data && data.length > 0 ? data[0].attempt_number + 1 : 1
}

// =============================================================================
// Server Action
// =============================================================================

async function recordOutcome(formData: FormData) {
  "use server"
  
  const supabase = await createClient()
  
  const userId = formData.get("user_id") as string
  const evaluatorName = formData.get("evaluator_name") as string
  const scenarioSet = formData.get("scenario_set") as string
  const marketKnowledge = parseFloat(formData.get("market_knowledge") as string)
  const clientFocus = parseFloat(formData.get("client_focus") as string)
  const communication = parseFloat(formData.get("communication") as string)
  const processExpertise = parseFloat(formData.get("process_expertise") as string)
  const composure = parseFloat(formData.get("composure") as string)
  const outcome = formData.get("outcome") as string
  const notes = formData.get("notes") as string
  const recordingUrl = formData.get("recording_url") as string
  
  // Get next attempt number
  const attemptNumber = await getNextAttemptNumber(userId)
  
  const { error } = await supabase
    .from("certification_attempts")
    .insert({
      user_id: userId,
      evaluator_name: evaluatorName,
      scenario_set: scenarioSet,
      attempt_number: attemptNumber,
      market_knowledge: marketKnowledge,
      client_focus: clientFocus,
      communication: communication,
      process_expertise: processExpertise,
      composure: composure,
      outcome: outcome,
      notes: notes || null,
      recording_url: recordingUrl || null,
    })
  
  if (error) {
    console.error("Failed to record outcome:", error)
    // In production, handle error properly
    return
  }
  
  revalidatePath("/learn/admin/certification")
  redirect("/learn/admin/certification")
}

// =============================================================================
// Components
// =============================================================================

function ScoreInput({ 
  name, 
  label, 
  description 
}: { 
  name: string
  label: string
  description: string 
}) {
  return (
    <div className="cert-record-score">
      <div className="cert-record-score__header">
        <label htmlFor={name} className="cert-record-score__label">{label}</label>
        <p className="cert-record-score__desc">{description}</p>
      </div>
      <div className="cert-record-score__input">
        <select 
          name={name} 
          id={name} 
          required 
          className="cert-record-select"
          defaultValue=""
        >
          <option value="" disabled>Select</option>
          <option value="1">1 - Not Ready</option>
          <option value="2">2 - Developing</option>
          <option value="3">3 - Competent</option>
          <option value="4">4 - Proficient</option>
          <option value="5">5 - Exemplary</option>
        </select>
      </div>
    </div>
  )
}

// =============================================================================
// Page Component
// =============================================================================

export default async function RecordCertificationPage() {
  // Require admin access
  await requireAdmin()

  const trainees = await getTrainees()

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
              <Link href="/learn/admin/certification">Certification Admin</Link>
              <span className="learn-header__breadcrumb-sep">›</span>
              <span className="learn-header__breadcrumb-current">Record Outcome</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="learn-content">
        {/* Back Link */}
        <Link href="/learn/admin/certification" className="cert-record-back">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Form Container */}
        <div className="cert-record-container">
          <div className="cert-record-header">
            <h1 className="cert-record-title">Record Certification Outcome</h1>
            <p className="cert-record-subtitle">
              Enter the assessment results after conducting the certification conversation
            </p>
          </div>

          <form action={recordOutcome} className="cert-record-form">
            {/* Basic Info Section */}
            <section className="cert-record-section">
              <h2 className="cert-record-section__title">Assessment Details</h2>
              
              <div className="cert-record-field">
                <label htmlFor="user_id" className="cert-record-label">
                  <UserIcon className="h-4 w-4" />
                  Trainee
                </label>
                <select 
                  name="user_id" 
                  id="user_id" 
                  required 
                  className="cert-record-select"
                  defaultValue=""
                >
                  <option value="" disabled>Select trainee...</option>
                  {trainees.map((trainee) => (
                    <option key={trainee.id} value={trainee.id}>
                      {trainee.full_name || "Unknown"} 
                      {trainee.certification_status === 'ready' ? ' (Ready)' : ' (In Progress)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cert-record-field">
                <label htmlFor="evaluator_name" className="cert-record-label">
                  <UserIcon className="h-4 w-4" />
                  Evaluator Name
                </label>
                <input 
                  type="text" 
                  name="evaluator_name" 
                  id="evaluator_name"
                  required
                  placeholder="Enter your name"
                  className="cert-record-input"
                />
              </div>

              <div className="cert-record-row">
                <div className="cert-record-field">
                  <label htmlFor="scenario_set" className="cert-record-label">
                    Scenario Set
                  </label>
                  <select 
                    name="scenario_set" 
                    id="scenario_set" 
                    required 
                    className="cert-record-select"
                    defaultValue="A"
                  >
                    <option value="A">Set A (Primary)</option>
                    <option value="B">Set B (Retake)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Scores Section */}
            <section className="cert-record-section">
              <h2 className="cert-record-section__title">Dimension Scores</h2>
              <p className="cert-record-section__desc">
                Rate each dimension from 1 (Not Ready) to 5 (Exemplary). 
                Pass requires average ≥3.5 with no dimension below 2.
              </p>
              
              <div className="cert-record-scores">
                <ScoreInput 
                  name="market_knowledge"
                  label="Market Knowledge"
                  description="Dubai market facts, regulations, area expertise"
                />
                <ScoreInput 
                  name="client_focus"
                  label="Client Focus"
                  description="Needs discovery, solution alignment, relationship building"
                />
                <ScoreInput 
                  name="communication"
                  label="Communication"
                  description="Clarity, professionalism, active listening"
                />
                <ScoreInput 
                  name="process_expertise"
                  label="Process Expertise"
                  description="Transaction steps, documentation, timelines"
                />
                <ScoreInput 
                  name="composure"
                  label="Composure"
                  description="Handling objections, pressure, unexpected situations"
                />
              </div>
            </section>

            {/* Outcome Section */}
            <section className="cert-record-section">
              <h2 className="cert-record-section__title">Overall Outcome</h2>
              
              <div className="cert-record-outcomes">
                <label className="cert-record-outcome">
                  <input 
                    type="radio" 
                    name="outcome" 
                    value="passed" 
                    required 
                  />
                  <span className="cert-record-outcome__box cert-record-outcome__box--pass">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="cert-record-outcome__label">Passed</span>
                    <span className="cert-record-outcome__desc">
                      Ready to represent Prime Capital to clients
                    </span>
                  </span>
                </label>
                <label className="cert-record-outcome">
                  <input 
                    type="radio" 
                    name="outcome" 
                    value="needs_work" 
                    required 
                  />
                  <span className="cert-record-outcome__box cert-record-outcome__box--work">
                    <CalendarIcon className="h-5 w-5" />
                    <span className="cert-record-outcome__label">Needs Work</span>
                    <span className="cert-record-outcome__desc">
                      Additional development required before retake
                    </span>
                  </span>
                </label>
              </div>
            </section>

            {/* Notes Section */}
            <section className="cert-record-section">
              <h2 className="cert-record-section__title">Additional Information</h2>
              
              <div className="cert-record-field">
                <label htmlFor="recording_url" className="cert-record-label">
                  Recording URL (optional)
                </label>
                <input 
                  type="url" 
                  name="recording_url" 
                  id="recording_url"
                  placeholder="https://..."
                  className="cert-record-input"
                />
              </div>

              <div className="cert-record-field">
                <label htmlFor="notes" className="cert-record-label">
                  Qualitative Notes (optional)
                </label>
                <textarea 
                  name="notes" 
                  id="notes"
                  rows={4}
                  placeholder="Specific strengths, areas for improvement, notable moments..."
                  className="cert-record-textarea"
                />
              </div>
            </section>

            {/* Submit */}
            <div className="cert-record-actions">
              <Button 
                variant="ghost" 
                render={<Link href="/learn/admin/certification" />}
              >
                Cancel
              </Button>
              <Button type="submit" size="lg">
                Record Outcome
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
