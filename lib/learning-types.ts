/**
 * CATALYST - Learning Types
 *
 * Type definitions for LMS entities.
 * Can be imported in both Server and Client Components.
 *
 * Key principle: frontmatter is stored as JSONB, not rigid columns.
 * This allows different modules to have different fields without schema changes.
 */

// =============================================================================
// DATABASE ENTITY TYPES
// =============================================================================

export interface Competency {
  id: string
  slug: string
  name: string
  description: string | null
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface LearningModule {
  id: string
  competencyId: string
  slug: string
  title: string
  description: string | null
  moduleNumber: string | null // "1.2", "0.1", etc.
  type: "knowledge" | "skills" | "skills-script"
  estimatedDuration: string | null // "25 minutes"
  displayOrder: number

  // Full markdown content (after frontmatter)
  content: string

  // Flexible frontmatter - stores ALL fields from markdown as JSONB
  // Access specific fields: module.frontmatter?.learningObjectives
  frontmatter: Record<string, unknown> | null

  // AI-generated essentials (structured key facts, scripts, etc.)
  essentials: Record<string, unknown> | null

  createdAt: string
  updatedAt: string
}

export interface AudioTranscript {
  id: string
  moduleId: string | null
  competencyId: string | null
  slug: string
  title: string
  duration: string | null // "8 minutes"
  voice: string // "coach"
  type: string // "demonstration", "summary", "walkthrough"
  transcript: string // Full markdown transcript
  audioUrl: string | null // URL after TTS generation
  frontmatter: Record<string, unknown> | null
  createdAt: string
}

export interface QuizQuestion {
  id: string
  quizId: string // "market-intelligence-1"
  competencySlug: string
  relatedModule: string | null
  questionNumber: number
  questionText: string
  options: QuizOption[]
  explanation: string | null
  displayOrder: number
}

export interface QuizOption {
  text: string
  correct: boolean
}

export interface LearningProgress {
  id: string
  userId: string
  moduleId: string
  status: "not_started" | "in_progress" | "completed"
  startedAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface QuizAttempt {
  id: string
  userId: string
  moduleId: string
  score: number
  maxScore: number
  passed: boolean
  answers: Record<string, string> | null
  attemptedAt: string
}

// =============================================================================
// ENRICHED TYPES (with joins/computed fields)
// =============================================================================

export interface CompetencyWithModules extends Competency {
  modules: LearningModule[]
  moduleCount: number
}

export interface CompetencyWithProgress extends Competency {
  modules: ModuleWithProgress[]
  completedCount: number
  totalCount: number
  progressPercent: number
}

export interface ModuleWithProgress extends LearningModule {
  progress: LearningProgress | null
  isCompleted: boolean
  isLocked: boolean // Based on previous module completion
}

export interface UserLearningStats {
  totalCompetencies: number
  completedCompetencies: number
  totalModules: number
  completedModules: number
  inProgressModules: number
  overallProgressPercent: number
  quizzesPassed: number
  quizzesTotal: number
}

export interface ProgressStats {
  totalModules: number
  completedModules: number
  inProgressModules: number
  totalQuizzes: number
  passedQuizzes: number
  currentStreak: number
  overallProgressPercent: number
}

// =============================================================================
// ESSENTIALS TYPES
// =============================================================================

/** A key fact with specific numbers that clients ask about */
export interface EssentialsFact {
  fact: string
  context?: string
  source?: string
}

/** A client-facing script extracted verbatim */
export interface EssentialsScript {
  scenario: string
  script: string
  source?: string
}

/** An image from /public/images/lms/ */
export interface EssentialsImage {
  src: string
  alt: string
  caption: string
  essential: boolean
  context?: string
}

/** Reference to an audio transcript */
export interface EssentialsAudio {
  slug: string
  title: string
  duration: string
  context: string
}

/** LPAR practice scenario */
export interface EssentialsPractice {
  situation: string
  task: string
  success: string
}

/** Complete essentials content structure */
export interface EssentialsContent {
  // LEARN: Core summary
  tldr: string
  keyFacts: EssentialsFact[]
  scripts: EssentialsScript[]
  
  // VISUAL & AUDIO ASSETS
  images: EssentialsImage[]
  audio: EssentialsAudio[]
  
  // PRACTICE & APPLY
  practice: EssentialsPractice
  reflection: string
  
  // METADATA
  generatedAt: string
  sourceHash: string
  promptVersion: string
}

/** Learning module with typed essentials and status info */
export interface LearningModuleWithEssentials extends Omit<LearningModule, 'essentials'> {
  essentials: EssentialsContent | null
  essentialsGeneratedAt: string | null
  essentialsSourceHash: string | null
  essentialsPromptVersion: string | null
  essentialsAvailable: boolean
  essentialsStale: boolean
}
