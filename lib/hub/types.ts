/**
 * CATALYST - Hub Type Definitions
 *
 * Type definitions for the client engagement hub.
 * Maps to Supabase schema for projects, tasks, questions, and activity.
 */

// -----------------------------------------------------------------------------
// Projects
// -----------------------------------------------------------------------------

export type ProjectStatus = "active" | "completed" | "on_hold" | "archived"

export interface Project {
  id: string
  slug: string
  name: string
  description: string | null
  status: ProjectStatus
  clientName: string | null
  progress: number
  displayOrder: number
  createdAt: string
  updatedAt: string
}

// -----------------------------------------------------------------------------
// Tasks
// -----------------------------------------------------------------------------

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled"
export type TaskPriority = "low" | "medium" | "high" | "urgent"

export interface Task {
  id: string
  projectId: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  assigneeId: string | null
  assigneeName?: string | null
  dueDate: string | null
  completedAt: string | null
  displayOrder: number
  createdAt: string
  updatedAt: string
  // Relations
  project?: Project
}

// -----------------------------------------------------------------------------
// Questions
// -----------------------------------------------------------------------------

export type QuestionStatus = "pending" | "answered" | "resolved"

export interface Question {
  id: string
  projectId: string
  title: string
  description: string | null
  context: string | null
  status: QuestionStatus
  createdById: string | null
  createdByName?: string | null
  createdAt: string
  updatedAt: string
  // Relations
  project?: Project
  responses?: QuestionResponse[]
  responseCount?: number
}

// -----------------------------------------------------------------------------
// Question Responses
// -----------------------------------------------------------------------------

export interface QuestionResponse {
  id: string
  questionId: string
  respondentId: string | null
  respondentName: string | null
  textResponse: string | null
  audioUrl: string | null
  audioDuration: number | null
  transcription: string | null
  createdAt: string
}

// -----------------------------------------------------------------------------
// Activity Feed
// -----------------------------------------------------------------------------

export type ActivityAction = 
  | "project_created"
  | "project_updated"
  | "task_created"
  | "task_completed"
  | "task_updated"
  | "question_created"
  | "question_answered"
  | "question_resolved"

export type ActivityTargetType = "project" | "task" | "question"

export interface Activity {
  id: string
  projectId: string
  userId: string | null
  userName?: string | null
  action: ActivityAction
  targetType: ActivityTargetType
  targetId: string
  metadata: Record<string, unknown>
  createdAt: string
  // Relations
  project?: Project
}

// -----------------------------------------------------------------------------
// Form/Input Types
// -----------------------------------------------------------------------------

export interface CreateProjectInput {
  name: string
  slug: string
  description?: string
  status?: ProjectStatus
  clientName?: string
}

export interface UpdateProjectInput {
  name?: string
  description?: string
  status?: ProjectStatus
  progress?: number
}

export interface CreateTaskInput {
  projectId: string
  title: string
  description?: string
  priority?: TaskPriority
  assigneeId?: string
  dueDate?: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: string
  dueDate?: string
}

export interface CreateQuestionInput {
  projectId: string
  title: string
  description?: string
  context?: string
}

export interface CreateResponseInput {
  questionId: string
  textResponse?: string
  audioUrl?: string
  audioDuration?: number
}
