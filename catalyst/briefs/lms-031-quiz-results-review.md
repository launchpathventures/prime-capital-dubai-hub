# LMS-031: Quiz Results Review & Markdown Download

**Status:** 🚧 IN PROGRESS  
**Priority:** High  
**Estimated Time:** 4 hours  
**Dependencies:** LMS-014 (Quiz System)  

---

## Problem Statement

After completing a quiz or RERA exam, users only see a score summary (e.g., "15/20 — 75%"). They cannot:
- See which questions they got right vs wrong
- Review the correct answers for questions they missed
- Understand their mistakes via explanations
- Save their results for offline review

This limits learning effectiveness — users can't identify knowledge gaps.

---

## Solution

Add a detailed results review screen after quiz completion that:
1. Shows every question with the user's answer highlighted
2. Clearly indicates correct (green) vs incorrect (red)
3. Displays the correct answer and explanation
4. Provides a "Download Results" button (markdown file)

---

## Scope

### In Scope
- Results breakdown UI showing all questions
- Visual indicators (correct = green, incorrect = red)
- Show user's answer, correct answer, explanation per question
- Collapsible/expandable question list
- Markdown download for offline review
- Works for both regular quizzes and RERA exams

### Out of Scope
- Historical results viewing (view past attempts)
- PDF export
- Analytics/performance tracking
- Printing functionality

---

## Technical Approach

### Data Already Available
The quiz-page-client.tsx already tracks:
- `questions` — All quiz questions with options and correct answers
- `answers` — User's selected option for each question (Record<questionId, optionIndex>)
- `quiz` — Quiz metadata (title, passing_score, etc.)
- `score` — Final score

No additional data fetching required.

### Implementation

#### 1. Extend Results Screen
Replace the simple score card in `quiz-page-client.tsx` with:
- Summary section (existing score display)
- "Review Answers" section with expandable questions
- Download button

#### 2. Question Review Component
For each question, show:
- Question number and text
- All options with visual status:
  - User's selection (highlighted)
  - Correct answer (green checkmark)
  - Incorrect selection (red X)
- Explanation text (if available)

#### 3. Markdown Generator
Generate markdown with:
- Quiz title, date, score
- Each question with user answer, correct answer, explanation
- Summary statistics

#### 4. Download Trigger
Use browser download API to save markdown file.

---

## UI Design

### Results Screen Layout
```
┌─────────────────────────────────────────┐
│ ✓ Great Job! / Keep Practicing          │
│ Quiz Title                              │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │         Your Score: 15/20           │ │
│ │              75%                    │ │
│ │ ████████████████████░░░░░░░░░░░░░░ │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Download Results]  [Try Again]         │
│                                         │
│ ─────── Review Your Answers ─────────  │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ✓ Q1: What is the DLD fee...        │ │
│ │   Your answer: 4% (Correct)         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ✗ Q2: RERA broker registration...   │ │
│ │   Your answer: B) 5,000 AED         │ │
│ │   Correct: C) 10,000 AED            │ │
│ │   ───                               │ │
│ │   💡 RERA requires 10,000 AED...    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Back to Dashboard]                     │
└─────────────────────────────────────────┘
```

### Visual Indicators
- **Correct answer**: Green background, checkmark icon
- **Incorrect answer**: Red background/border, X icon
- **User's selection**: Bold, highlighted
- **Explanation**: Muted background, lightbulb icon

---

## Deliverables

### 1. Update quiz-page-client.tsx
- Add results review section to "complete" state
- Add markdown generation function
- Add download handler

### 2. Files Changed
- `app/learn/quiz/[quizId]/quiz-page-client.tsx`

---

## Testing

1. Complete a quiz with mixed correct/incorrect answers
2. Verify each question shows:
   - User's answer clearly marked
   - Correct answer visible (especially for wrong answers)
   - Explanation displayed
3. Click "Download Results" and verify:
   - File downloads with `.md` extension
   - Contains quiz title, date, score
   - Each question with full details
4. Test on RERA practice exam (larger question set)

---

## Markdown Export Format

```markdown
# Quiz Results: [Quiz Title]

**Date:** January 16, 2026
**Score:** 15/20 (75%)
**Result:** PASSED ✓

---

## Question 1 ✓
**What is the standard DLD transfer fee percentage?**

- A) 2%
- B) 3%
- **C) 4%** ← Your Answer (Correct)
- D) 5%

---

## Question 2 ✗
**What is the RERA broker registration fee?**

- A) 5,000 AED
- **B) 7,500 AED** ← Your Answer
- C) 10,000 AED ✓ Correct Answer
- D) 15,000 AED

**Explanation:** RERA requires a 10,000 AED registration fee for broker licensing...

---
```
