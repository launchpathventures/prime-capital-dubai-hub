# LMS-015: Generate Module Quizzes

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 2-3 hours (AI-assisted)  
**Dependencies:** Module content synced to database  

---

## Objective

Generate 5 quiz questions for each of the 52 learning modules that currently lack quizzes. This completes the original architecture intent of "1 quiz per module" with 3-5 questions each.

---

## Background

### Original Architecture Intent

From `legacy/lms/prime-capital-learning-architecture-v2.md`:

> "Each competency and key behaviour module includes an LMS quiz"
> - Questions per behaviour: 3-5
> - Pass threshold: 80%

### Current State

| Metric | Count |
|--------|-------|
| Total modules | 68 |
| Modules with quizzes | 16 |
| **Modules needing quizzes** | **52** |
| Questions to generate | ~260 (5 per module) |

### Existing Quiz Quality

Current quizzes follow this pattern (example from `client-discovery-1`):

```json
{
  "question": "What should be your opening approach when speaking with an investor prospect?",
  "options": [
    { "text": "Immediately share the best current opportunities", "correct": false },
    { "text": "Ask about their investment objectives and how Dubai fits their strategy", "correct": true },
    { "text": "Request their budget and timeline upfront", "correct": false },
    { "text": "Explain Dubai's regulatory framework", "correct": false }
  ],
  "explanation": "Opening with investment objectives signals a strategic, not transactional, approach and shows you'll provide tailored recommendations rather than generic options."
}
```

---

## Modules Requiring Quizzes

### Competency 0: Foundations (5 modules)

| Module # | Slug | Title |
|----------|------|-------|
| 0.1 | `company-orientation` | Prime Capital Orientation |
| 0.2 | `code-of-conduct` | Professional Standards |
| 0.3 | `broker-licensing` | Broker Licensing & Compliance |
| 0.4 | `essential-tools` | Essential Tools Overview |
| 0.5 | `daily-workflow` | Daily Workflow & Productivity |

### Competency 1: Market Intelligence (10 modules)

| Module # | Slug | Title |
|----------|------|-------|
| 1.1 | `dubai-overview` | Dubai Real Estate Overview |
| 1.2 | `competitive-landscape` | Prime Capital Positioning |
| 1.3 | `regulatory-framework` | Regulatory Framework |
| 1.4 | `offplan-vs-ready` | Off-Plan vs Ready Properties |
| 1.5 | `key-developers` | Key Developers |
| 1.6 | `area-knowledge` | Dubai Areas & Communities |
| 1.7 | `area-deep-dives` | Area Deep-Dives by Segment |
| 1.8 | `golden-visa` | Golden Visa & Residency |
| 1.9 | `economic-vision` | Dubai Economic Vision |
| 1.10 | `global-comparison` | Dubai vs Global Markets |

### Competency 2: Client Discovery (7 modules)

| Module # | Slug | Title |
|----------|------|-------|
| 2.1 | `investor-personas` | Investor Personas |
| 2.2 | `discovery-endusers` | Discovery: End-Users |
| 2.3 | `discovery-investors` | Discovery: Investors |
| 2.4 | `discovery-visa` | Discovery: Visa-Seekers |
| 2.5 | `active-listening` | Active Listening |
| 2.6 | `qualification-framework` | BANT+ Qualification |
| 2.7 | `managing-expectations` | Managing Expectations |

### Competency 3: Sales Mastery (8 modules)

| Module # | Slug | Title |
|----------|------|-------|
| 3.1 | `lead-sources` | Off-Plan Lead Sources |
| 3.2 | `first-contact` | First Contact Excellence |
| 3.3 | `needs-analysis` | Needs Analysis Conversation |
| 3.4 | `offplan-presentation` | Off-Plan Presentation Skills |
| 3.5 | `eoi-booking` | EOI & Booking Conversion |
| 3.6 | `followup-sequences` | Follow-Up Sequences |
| 3.7 | `closing-techniques` | Closing Techniques |
| 3.8 | `pipeline-management` | Pipeline Management |

### Competency 4: Property Matching (7 modules)

| Module # | Slug | Title |
|----------|------|-------|
| 4.1 | `property-analysis` | Property Analysis Framework |
| 4.2 | `yield-calculations` | Yield & ROI Calculations |
| 4.3 | `offplan-evaluation` | Off-Plan Evaluation |
| 4.4 | `payment-plan-analysis` | Payment Plan Comparison |
| 4.5 | `secondary-evaluation` | Secondary Market Evaluation |
| 4.6 | `presentation-skills` | Property Presentation |
| 4.7 | `comparative-analysis` | Comparative Market Analysis |

### Competency 5: Transaction Management (12 modules)

| Module # | Slug | Title |
|----------|------|-------|
| 5.1 | `offplan-journey` | Off-Plan Transaction Journey |
| 5.2 | `secondary-journey` | Secondary Transaction Journey |
| 5.3 | `rera-contracts` | RERA Smart Contracts |
| 5.4 | `eoi-process` | EOI & Booking Process |
| 5.5 | `spa-process` | SPA & Down Payment |
| 5.6 | `oqood-registration` | Oqood Registration |
| 5.7 | `escrow-protection` | Escrow Accounts |
| 5.8 | `mortgage-process` | Mortgage Process |
| 5.9 | `mou-formf` | MOU & Form F |
| 5.10 | `noc-transfer` | NOC & Transfer |
| 5.11 | `handover-process` | Handover Process |
| 5.12 | `post-transaction` | Post-Transaction Service |

### Competency 6: Objection Navigation (4 modules)

| Module # | Slug | Title |
|----------|------|-------|
| 6.3 | `6.3-developer-objections` | Developer & Project Objections |
| 6.4 | `6.4-price-fee-objections` | Price & Fee Objections |
| 6.5 | `6.5-stall-objections` | Stall & Delay Objections |
| 6.6 | `6.6-strategic-followup` | Strategic Follow-Up |

### Competency 7: Relationship Stewardship (4 modules)

| Module # | Slug | Title |
|----------|------|-------|
| 7.1 | `client-communication` | Client Communication Standards |
| 7.2 | `follow-up-systems` | Follow-Up Systems |
| 7.3 | `referral-generation` | Referral Generation |
| 7.4 | `long-term-relationships` | Long-Term Client Development |

---

## Database Schema

### `quizzes` table

```sql
INSERT INTO quizzes (slug, competency_slug, related_module, title, description, passing_score, question_count, estimated_duration)
VALUES (
  '{competency_slug}-{module_order}',  -- e.g., 'foundations-1'
  '{competency_slug}',                 -- e.g., 'foundations'
  '{module_slug}',                     -- e.g., 'company-orientation'
  '{module_title} Quiz',               -- e.g., 'Prime Capital Orientation Quiz'
  'Knowledge check for {module_title}',
  80,
  5,
  '5 min'
);
```

### `quiz_questions` table

```sql
INSERT INTO quiz_questions (quiz_slug, competency_slug, related_module, question, options, explanation, display_order)
VALUES (
  '{quiz_slug}',          -- e.g., 'foundations-1'
  '{competency_slug}',    -- e.g., 'foundations'
  '{module_slug}',        -- e.g., 'company-orientation'
  '{question_text}',
  '[{"text": "Option A", "correct": false}, {"text": "Option B", "correct": true}, ...]'::jsonb,
  '{explanation}',
  {1-5}
);
```

---

## Question Generation Prompt

Use this prompt to generate quiz questions for each module:

```
You are creating quiz questions for a real estate training program at Prime Capital Dubai.

**Context:**
- Company: Prime Capital Dubai, a boutique real estate advisory serving high-net-worth international investors
- Brand voice: Authoritative, discreet, transparent, calm — NOT pushy or salesy
- Audience: Real estate consultants learning to serve sophisticated international clients
- Quiz purpose: Validate understanding before client interactions

**Module:** {module_title}
**Content:** 
{module_content}

**Requirements:**
1. Generate exactly 5 multiple-choice questions
2. Each question has 4 options, with exactly ONE correct answer
3. Include a clear explanation for each correct answer
4. Question types should include:
   - 2 concept/fact questions (testing key knowledge)
   - 2 scenario questions ("A client says X. What do you do?")
   - 1 application question (testing judgment/decision-making)

**Quality Standards:**
- Questions must be directly answerable from the module content
- Incorrect options should be plausible but clearly wrong
- Avoid trick questions or ambiguous wording
- Explanations should reinforce learning, not just state the answer
- Use professional language accessible to non-native English speakers

**Output Format (JSON):**
{
  "questions": [
    {
      "question": "Question text here?",
      "options": [
        { "text": "Option A", "correct": false },
        { "text": "Option B", "correct": true },
        { "text": "Option C", "correct": false },
        { "text": "Option D", "correct": false }
      ],
      "explanation": "Explanation of why the correct answer is correct and why it matters."
    }
  ]
}
```

---

## Execution Process

### Option A: Batch Generation Script

Create a script at `scripts/generate-module-quizzes.ts`:

```typescript
/**
 * CATALYST - Generate quiz questions for all modules
 * 
 * Usage: pnpm generate:quizzes [--module=slug] [--competency=slug] [--dry-run]
 */

import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const QUESTION_PROMPT = `...` // From above

async function generateQuizForModule(module: Module) {
  // 1. Fetch module content from DB
  // 2. Call Claude with prompt + content
  // 3. Parse JSON response
  // 4. Insert quiz record
  // 5. Insert 5 question records
  // 6. Log success/failure
}

async function main() {
  const modulesWithoutQuizzes = await fetchModulesNeedingQuizzes()
  
  for (const module of modulesWithoutQuizzes) {
    await generateQuizForModule(module)
    await sleep(1000) // Rate limiting
  }
}
```

### Option B: Manual Generation by Competency

Process one competency at a time:

1. **Read module content** from database
2. **Generate questions** using Claude/GPT with the prompt above
3. **Review output** for quality and accuracy
4. **Insert into database** via Supabase SQL or API
5. **Test in UI** at `/learn/{competency}/{module}`

---

## Naming Convention

| Field | Pattern | Example |
|-------|---------|---------|
| Quiz slug | `{competency}-{order}` | `foundations-1` |
| Related module | Module slug | `company-orientation` |
| Title | `{Module Title} Quiz` | `Prime Capital Orientation Quiz` |

---

## Validation Checklist

After generating quizzes:

- [ ] Each module has exactly 1 quiz linked via `related_module`
- [ ] Each quiz has exactly 5 questions
- [ ] Each question has exactly 4 options with 1 correct
- [ ] All explanations are present and helpful
- [ ] Quiz displays correctly in slide-over from module page
- [ ] Quiz displays correctly at `/learn/quiz/{slug}`
- [ ] Passing score (80%) calculated correctly

---

## SQL Queries for Validation

```sql
-- Check quiz coverage
SELECT 
  c.slug,
  COUNT(DISTINCT m.slug) as modules,
  COUNT(DISTINCT q.slug) as quizzes,
  COUNT(DISTINCT m.slug) - COUNT(DISTINCT q.slug) as missing
FROM competencies c
JOIN learning_modules m ON m.competency_id = c.id
LEFT JOIN quizzes q ON q.related_module = m.slug
WHERE c.slug != 'rera-exam-prep'
GROUP BY c.slug, c.display_order
ORDER BY c.display_order;

-- Check question counts per quiz
SELECT 
  q.slug,
  q.related_module,
  COUNT(qq.id) as question_count
FROM quizzes q
LEFT JOIN quiz_questions qq ON qq.quiz_slug = q.slug
GROUP BY q.slug, q.related_module
HAVING COUNT(qq.id) != 5
ORDER BY q.slug;
```

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Modules with quizzes | 68/68 (100%) |
| Questions per module | 5 |
| Total quiz questions | 340+ |
| Question quality | Reviewed by human |
| UI integration | Working in slide-over + standalone page |

---

## Notes

- RERA Exam Prep modules are excluded (they have dedicated RERA practice exams)
- Existing 16 quizzes should remain unchanged
- Questions should test module-specific knowledge, not general real estate knowledge
- Priority order: Foundations → Market Intelligence → Client Discovery (onboarding path)
