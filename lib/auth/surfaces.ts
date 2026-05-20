/**
 * CATALYST - Accessible Surfaces by Role
 *
 * Single source of truth for which surfaces each role can use. The post-login
 * redirect and the /launch picker both read from here so the label, icon, and
 * destination of each card stay consistent everywhere a user encounters them.
 *
 * Surfaces are named by what they DO ("YouTube Generator"), not by their
 * internal route group ("admin"). That matters for users like youtube_editor
 * who would not recognise "admin" as a label for their work.
 */

import {
  GraduationCapIcon,
  ShieldIcon,
  VideoIcon,
  type LucideIcon,
} from "lucide-react"

export type SurfaceId = "youtube" | "admin-dashboard" | "learn"

export type Surface = {
  id: SurfaceId
  href: string
  title: string
  description: string
  icon: LucideIcon
}

export type AppRole = "admin" | "marketing" | "youtube_editor" | "learner"

const YOUTUBE_GENERATOR: Surface = {
  id: "youtube",
  href: "/admin/youtube",
  title: "YouTube Generator",
  description: "Brainstorm, draft, and review YouTube scripts.",
  icon: VideoIcon,
}

const ADMIN_DASHBOARD: Surface = {
  id: "admin-dashboard",
  href: "/admin/dashboard",
  title: "Admin Dashboard",
  description: "Team, testimonials, stats, and other admin tools.",
  icon: ShieldIcon,
}

const LEARNING_PORTAL: Surface = {
  id: "learn",
  href: "/learn",
  title: "Learning Portal",
  description: "Courses, scenarios, RERA practice, and certification.",
  icon: GraduationCapIcon,
}

export function getAccessibleSurfaces(role: AppRole): Surface[] {
  switch (role) {
    case "admin":
      return [YOUTUBE_GENERATOR, ADMIN_DASHBOARD, LEARNING_PORTAL]
    case "marketing":
      // Marketing has scoped admin access (no team/progress/learning) but the
      // YouTube generator and the LMS are both open to them.
      return [YOUTUBE_GENERATOR, ADMIN_DASHBOARD, LEARNING_PORTAL]
    case "youtube_editor":
      return [YOUTUBE_GENERATOR]
    case "learner":
    default:
      return [LEARNING_PORTAL]
  }
}
