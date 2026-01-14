# LMS-016: Scenario Integration

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 4-6 hours  
**Dependencies:** None  

---

## Objective

Surface the existing 75 AI roleplay scenarios within the LMS so learners can practice client conversations before certification. Scenarios should be accessible both as a dedicated section and contextually linked from relevant competencies.

---

## Background

### Current State
- 75 scenarios exist in `content/lms/scenarios/` across 6 categories
- Scenarios are synced to `scenarios` table (6 rows — one per category)
- Each category file contains 10-20 individual scenarios with AI prompts
- Scenarios are **not visible** to learners in the current LMS UI

### Scenario Categories (from database)

| Slug | Title | Count | Linked Competencies |
|------|-------|-------|---------------------|
| first-contact | First Contact Scenarios | 10 | client-discovery, relationship-stewardship |
| discovery | Discovery Scenarios | 15 | client-discovery, market-intelligence, property-matching |
| presentation | Presentation Scenarios | 10 | property-matching, market-intelligence, transaction-management |
| objections | Objection Scenarios | 20 | objection-navigation, market-intelligence |
| closing | Closing Scenarios | 10 | transaction-management, objection-navigation, relationship-stewardship |
| difficult-situations | Difficult Situations | 10 | relationship-stewardship, transaction-management |

---

## Requirements

### 1. Scenario Index Page

**Route:** `/learn/scenarios`

**Purpose:** Overview of all practice scenario categories

**Content:**
- Page title: "Practice Scenarios"
- Intro text explaining roleplay practice with AI
- Grid of 6 category cards showing:
  - Category title
  - Scenario count
  - Brief description
  - Linked competencies (as badges)
  - Link to category page

**Design:** Follow existing LMS patterns (learn-shell, similar to competency cards)

### 2. Scenario Category Pages

**Route:** `/learn/scenarios/[category]`

**Purpose:** Display all scenarios within a category

**Content:**
- Category title and description (from `scenarios` table)
- List of individual scenarios parsed from markdown content
- Each scenario shows:
  - Scenario ID (e.g., "DS-01")
  - Title
  - Difficulty indicator (⭐ = Foundation, ⭐⭐ = Intermediate, ⭐⭐⭐ = Advanced)
  - Brief situation description
- Click to expand full scenario (accordion or modal)

**Expanded Scenario View:**
- Situation
- Client Persona
- Consultant Objective
- Key Challenges
- Common Mistakes
- Model Approach
- AI Simulation Prompt (copyable code block)

**Design:** Clean, readable layout. The AI prompt should be easy to copy for use with ChatGPT/Claude.

### 3. Competency Page Integration

**Route:** `/learn/[competency]` (existing page)

**Change:** Add "Practice Scenarios" section after Quizzes section

**Content:**
- Section heading: "Practice Scenarios"
- Brief intro: "Apply your learning through AI-powered roleplay"
- List relevant scenario categories (based on competency mapping)
- Show scenario counts
- Link to scenario category pages

**Logic:**
```typescript
// Get scenarios linked to this competency
const { data: scenarios } = await supabase
  .from("scenarios")
  .select("*")
  .contains("competencies", [competencySlug])
```

### 4. Navigation Updates

- Add "Scenarios" link to learn header nav
- Add "Practice" section to learn sidebar (after Quizzes)
- Breadcrumb: Course > Scenarios > [Category]

---

## Technical Implementation

### File Structure

```
app/learn/
├── scenarios/
│   ├── page.tsx              # Scenario index
│   └── [category]/
│       └── page.tsx          # Category detail with all scenarios
```

### Data Fetching

The `scenarios` table contains the full markdown content. Parse individual scenarios from the content field:

```typescript
// Scenarios are delimited by ## headers with pattern "XX-##:"
// e.g., "## DS-01: The End-User Buyer ⭐"

function parseScenarios(content: string) {
  const scenarioPattern = /^## ([A-Z]{2,3}-\d{2}): (.+?)(⭐+)?$/gm
  // Split and parse each scenario section
}
```

### Scenario Parsing

Each scenario in the markdown follows this structure:
```markdown
## DS-01: The End-User Buyer ⭐

### Situation
[text]

### Client Persona
[text]

### Consultant Objective
[text]

### Key Challenges
[text]

### Common Mistakes
[text]

### Model Approach
[text]

### AI Simulation Prompt
```[prompt]```
```

Parse into:
```typescript
interface ParsedScenario {
  id: string           // "DS-01"
  title: string        // "The End-User Buyer"
  difficulty: 1 | 2 | 3 // star count
  situation: string
  persona: string
  objective: string
  challenges: string
  mistakes: string
  approach: string
  aiPrompt: string
}
```

---

## UI Components

### ScenarioCategoryCard

Used on index page:
```tsx
<ScenarioCategoryCard
  title="Discovery Scenarios"
  description="Understanding investor needs..."
  count={15}
  competencies={["client-discovery", "market-intelligence"]}
  href="/learn/scenarios/discovery"
/>
```

### ScenarioAccordion

Used on category page:
```tsx
<ScenarioAccordion scenarios={parsedScenarios}>
  {/* Expands to show full scenario details */}
</ScenarioAccordion>
```

### CopyablePrompt

For AI simulation prompts:
```tsx
<CopyablePrompt prompt={scenario.aiPrompt} />
// Shows code block with copy button
```

---

## Acceptance Criteria

- [ ] `/learn/scenarios` shows all 6 categories with counts
- [ ] `/learn/scenarios/[category]` displays all scenarios for that category
- [ ] Individual scenarios can be expanded to see full details
- [ ] AI prompts are copyable with one click
- [ ] Competency pages show relevant scenarios section
- [ ] Mobile responsive
- [ ] Follows existing LMS visual patterns

---

## Out of Scope

- Progress tracking for scenario completion
- AI-powered roleplay within the platform
- Recording or feedback on practice sessions
- Individual scenario URLs (e.g., `/learn/scenarios/discovery/ds-01`)

---

## Related Briefs

- [lms-017-certification-system.md](lms-017-certification-system.md) — Uses scenarios for capstone assessment
- [lms-content-audit-scenarios.md](lms-content-audit-scenarios.md) — Content audit of scenario files
