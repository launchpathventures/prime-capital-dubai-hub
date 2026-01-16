/**
 * CATALYST - LMS Components
 *
 * Barrel export for Learning Management System components.
 */

export { CourseHero } from "./course-hero"
export { HowItWorks } from "./how-it-works"
export { LearningPathway } from "./learning-pathway"

// Module Learning Experience Components
export { MarkdownRenderer } from "./markdown-renderer"
export { SectionRenderer } from "./section-renderer"
export { ModuleToC } from "./module-toc"
export { ModuleToCRight } from "./module-toc-right"
export { ReadingProgress } from "./reading-progress"
export { DocumentFigure } from "./document-figure"
export { AudioCoachPlayer } from "./audio-coach-player"
export { AudioPlayer, AudioSection } from "./audio-player"
export { ModuleAudioSection, AudioQuickLinks } from "./module-audio-section"
export { ModuleControlsBar } from "./module-controls-bar"
export { LearningObjectives } from "./learning-objectives"
export { ResourceList } from "./resource-list"
// KnowledgeCheckCTA is a server component - import directly, not from barrel

// Essentials Mode Components
export { ModeSwitch } from "./mode-switch"
export { EssentialsView } from "./essentials-view"
export { EssentialsToCRight } from "./essentials-toc-right"
export { ModuleContentSwitcher } from "./module-content-switcher"
export { ModuleToCSwitcher } from "./module-toc-switcher"

// Dashboard Components
export { DashboardStats } from "./dashboard-stats"

// Quiz Components
export { QuizProgress } from "./quiz-progress"
export { QuizQuestion } from "./quiz-question"
export { QuizResult } from "./quiz-result"
export { QuizNextSteps } from "./quiz-next-steps"
export { QuizSheet } from "./quiz-sheet"
export { CompetencyProgressList } from "./competency-progress-list"

// Loading Skeletons
export { DashboardSkeleton } from "./skeletons/dashboard-skeleton"
export { CompetencySkeleton } from "./skeletons/competency-skeleton"
export { ModuleSkeleton } from "./skeletons/module-skeleton"
export { ModuleContentSkeleton } from "./skeletons/module-content-skeleton"
export { QuizSkeleton } from "./skeletons/quiz-skeleton"
export { PageSkeleton } from "./skeletons/page-skeleton"

// Empty State
export { EmptyState } from "./empty-state"
