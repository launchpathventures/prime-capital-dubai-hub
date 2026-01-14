# LMS-017: Certification Assessment System

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 6-8 hours  
**Dependencies:** LMS-016 (Scenario Integration)  

---

## Objective

Create a light platform integration for the certification assessment process:
1. Learner preparation page showing readiness and what to expect
2. Admin interface for evaluators to record assessment outcomes
3. Database tracking of certification attempts and results

---

## Background

### Certification Philosophy

The certification is a **conversation, not an exam**. A founding team leader (Faisal, Sarah, or James) conducts an in-person roleplay session with the trainee using fixed scenarios. The goal is to assess overall readiness to represent Prime Capital.

### Assessment Format

- **Duration:** 60-75 minutes
- **Format:** In-person with recording
- **Scenarios:** 5 fixed scenarios covering core competencies
- **Outcome:** Pass or needs further development
- **Recording:** Session recorded, transcribed, analyzed for feedback

### Fixed Scenario Sets

Two sets ensure fresh scenarios for retakes while testing the same competencies.

#### Set A — Primary (First Attempt)

| # | ID | Scenario | Category | Tests |
|---|-----|----------|----------|-------|
| 1 | DS-01 | End-User Buyer | Discovery | Needs analysis, listening, family dynamics |
| 2 | OB-01 | Bubble Concern | Objections | Market knowledge, data handling, composure |
| 3 | PR-01 | First Property View | Presentation | Product knowledge, storytelling |
| 4 | CL-01 | EOI Commitment | Closing | Process expertise, confidence |
| 5 | DIF-03 | Developer Delay | Difficult | Composure, de-escalation, honesty |

#### Set B — Alternate (Retakes)

| # | ID | Scenario | Category | Tests |
|---|-----|----------|----------|-------|
| 1 | DS-02 | Pure Investor | Discovery | Data-driven discussion, analytical client |
| 2 | OB-03 | Hidden Fees Concern | Objections | Transparency, cost knowledge, trust |
| 3 | CL-02 | Final Hesitation | Closing | Finding real concerns, gentle guidance |
| 4 | FC-01 | Portal Lead Response | First Contact | First impressions, differentiation |
| 5 | DIF-02 | Lost Deal to Competitor | Difficult | Grace under disappointment, relationship |

---

## Requirements

### 1. Learner Certification Prep Page

**Route:** `/learn/certification`

**Purpose:** Prepare learners for their certification session

**Content Sections:**

#### Header
- Title: "Certification Assessment"
- Status badge: "Ready for Certification" / "In Progress" / "Certified"

#### Readiness Checklist
Show completion status for:
- [ ] All modules completed
- [ ] All quizzes passed (≥80%)
- [ ] Practice scenarios reviewed
- Calculated readiness score

#### What to Expect
- Overview of the certification format
- Duration and structure
- What evaluators are looking for
- How to prepare

#### Assessment Criteria
Display the 5 rubric dimensions:
- Market Knowledge
- Client Focus
- Communication
- Process Expertise
- Composure

#### Scenarios Preview
List the 5 Set A scenarios (for first attempts) with brief descriptions:
- DS-01: End-User Buyer (Discovery)
- OB-01: Bubble Concern (Objections)
- PR-01: First Property View (Presentation)
- CL-01: EOI Commitment (Closing)
- DIF-03: Developer Delay (Difficult Situations)

Link to full scenario details in `/learn/scenarios/[category]` for practice.

Note: Retakes use Set B with different scenarios testing the same competencies.

#### Next Steps
- Instructions for scheduling (offline process — contact founding team)
- What to bring / how to prepare on the day
- Note: Sessions recorded via phone for review and feedback

---

### 2. Admin Certification Dashboard

**Route:** `/learn/admin/certification`

**Access:** Admin users only (via `user_profiles.role = 'admin'`)

**Purpose:** View learners ready for certification and record outcomes

**Content Sections:**

#### Learner Pipeline

Table showing all learners with columns:
- Name
- Progress (modules/quizzes completed)
- Readiness status
- Certification status
- Last activity
- Actions (View, Schedule, Record Outcome)

Filter options:
- Ready for certification
- Scheduled
- Completed
- Needs development

#### Record Outcome Form

When evaluator clicks "Record Outcome":

```
Learner: [Name]
Session Date: [Date picker]
Evaluator: [Dropdown: Faisal/Sarah/James]

Rubric Scores (1-5 each):
- Market Knowledge: [1-5 radio]
- Client Focus: [1-5 radio]
- Communication: [1-5 radio]
- Process Expertise: [1-5 radio]
- Composure: [1-5 radio]

Outcome: [Pass / Needs Development]

Notes:
[Textarea - overall impressions]

Areas for Development:
[Textarea - specific feedback if not passed]

Recording URL: [Text input - optional]
Transcript URL: [Text input - optional]

[Save] [Cancel]
```

#### Certification History

View past certification attempts for any learner:
- Date, evaluator, outcome
- Scores breakdown
- Notes and feedback
- Links to recording/transcript if available

---

### 3. Database Schema

**New Table:** `certification_attempts`

```sql
CREATE TABLE certification_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  evaluator_id UUID REFERENCES auth.users(id),
  evaluator_name TEXT NOT NULL,
  
  -- Status tracking
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'passed', 'needs_work')) 
    DEFAULT 'scheduled',
  scheduled_date DATE,
  completed_at TIMESTAMPTZ,
  
  -- Rubric scores (1-5 each, nullable until completed)
  score_market_knowledge INT CHECK (score_market_knowledge BETWEEN 1 AND 5),
  score_client_focus INT CHECK (score_client_focus BETWEEN 1 AND 5),
  score_communication INT CHECK (score_communication BETWEEN 1 AND 5),
  score_process_expertise INT CHECK (score_process_expertise BETWEEN 1 AND 5),
  score_composure INT CHECK (score_composure BETWEEN 1 AND 5),
  
  -- Calculated average (trigger or app-level)
  average_score DECIMAL(3,2),
  
  -- Qualitative feedback
  notes TEXT,
  areas_for_development TEXT,
  
  -- Recording/transcript references
  recording_url TEXT,
  transcript_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE certification_attempts ENABLE ROW LEVEL SECURITY;

-- Learners can view their own attempts
CREATE POLICY "Users can view own certification attempts"
  ON certification_attempts FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can do everything
CREATE POLICY "Admins can manage all certification attempts"
  ON certification_attempts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Index for common queries
CREATE INDEX idx_certification_attempts_user ON certification_attempts(user_id);
CREATE INDEX idx_certification_attempts_status ON certification_attempts(status);
```

**Update trigger:** When status changes to 'passed', update `user_profiles.certification_status`:

```sql
CREATE OR REPLACE FUNCTION update_certification_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'passed' THEN
    UPDATE user_profiles
    SET certification_status = 'certified',
        updated_at = now()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_certification_passed
  AFTER UPDATE ON certification_attempts
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'passed')
  EXECUTE FUNCTION update_certification_status();
```

---

## Technical Implementation

### File Structure

```
app/learn/
├── certification/
│   └── page.tsx              # Learner prep page
├── admin/
│   └── certification/
│       ├── page.tsx          # Admin dashboard
│       └── [userId]/
│           └── page.tsx      # Individual learner detail/record outcome
```

### API Routes (if needed)

```
app/api/learn/
├── certification/
│   ├── route.ts              # GET learner's certification status
│   └── schedule/route.ts     # POST schedule certification
├── admin/certification/
│   ├── route.ts              # GET all learners for admin
│   └── outcome/route.ts      # POST record outcome
```

### Readiness Calculation

```typescript
interface ReadinessData {
  modulesCompleted: number
  totalModules: number
  quizzesPassed: number
  totalQuizzes: number
  scenariosReviewed: number  // Optional enhancement
}

function calculateReadiness(data: ReadinessData): {
  score: number  // 0-100
  isReady: boolean
  checklist: { item: string; complete: boolean }[]
} {
  const moduleScore = (data.modulesCompleted / data.totalModules) * 50
  const quizScore = (data.quizzesPassed / data.totalQuizzes) * 50
  const score = Math.round(moduleScore + quizScore)
  
  return {
    score,
    isReady: score >= 80,
    checklist: [
      { item: "Complete all learning modules", complete: data.modulesCompleted === data.totalModules },
      { item: "Pass all knowledge quizzes (≥80%)", complete: data.quizzesPassed === data.totalQuizzes },
      { item: "Review practice scenarios", complete: data.scenariosReviewed > 0 },
    ]
  }
}
```

---

## UI Components

### ReadinessCard
```tsx
<ReadinessCard
  score={85}
  isReady={true}
  checklist={[...]}
/>
```

### RubricScoreInput
```tsx
<RubricScoreInput
  dimension="Market Knowledge"
  description="Understanding of Dubai market fundamentals"
  value={score}
  onChange={setScore}
/>
```

### CertificationStatusBadge
```tsx
<CertificationStatusBadge status="ready" />
// Variants: in-progress, ready, certified, needs-work
```

---

## Acceptance Criteria

### Learner Page
- [ ] Shows certification status clearly
- [ ] Displays readiness checklist with completion states
- [ ] Explains assessment format and what to expect
- [ ] Shows the 5 scenarios with links to practice
- [ ] Shows scheduling status
- [ ] Mobile responsive

### Admin Dashboard
- [ ] Lists all learners with certification status
- [ ] Filters work correctly
- [ ] Can record outcome with all rubric scores
- [ ] Notes and feedback saved correctly
- [ ] Updates learner's certification_status on pass
- [ ] Shows certification history per learner

### Database
- [ ] certification_attempts table created with proper constraints
- [ ] RLS policies protect data appropriately
- [ ] Trigger updates user_profiles on pass

---

## Out of Scope

- Recording integration (phone recording, uploaded manually as URL)
- Automated transcription (done externally if needed)
- AI analysis of transcripts
- Email notifications
- Calendar/scheduling integration (handled offline)

---

## Related Briefs

- [lms-016-scenario-integration.md](lms-016-scenario-integration.md) — Scenario pages (prerequisite)
- [lms-018-certification-content.md](lms-018-certification-content.md) — Content for evaluator guide
