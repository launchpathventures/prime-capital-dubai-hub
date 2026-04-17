/**
 * CATALYST - User Row
 *
 * Client component so lucide icons used here are registered as
 * client modules (Turbopack drops icon refs from client bundles
 * when they're only imported from server components).
 */

"use client"

import Link from "next/link"
import {
  ShieldIcon,
  GraduationCapIcon,
  MegaphoneIcon,
  CheckCircleIcon,
  ClockIcon,
  TrendingUpIcon,
  ChartNoAxesColumnIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { UserEditForm } from "./user-edit-form"
import { LoginAsButton } from "./login-as-button"
import type { UserWithEmail } from "./types"

const EXCLUDED_PROGRESS_EMAILS = new Set([
  "tim@launchpathventures.com",
  "ai@primecapitaldubai.com",
])

export function UserRow({ user }: { user: UserWithEmail }) {
  const joinedDate = new Date(user.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const statusLabel = {
    certified: "Certified",
    ready: "Ready",
    in_progress: "Not Certified",
  }[user.certification_status || "in_progress"] || "Not Certified"

  const showProgress = !EXCLUDED_PROGRESS_EMAILS.has(user.email.toLowerCase())

  return (
    <TableRow>
      <TableCell>
        <div className="admin-users-row__user">
          <div className="admin-users-row__avatar">
            {user.full_name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
          </div>
          <span className="admin-users-row__name">
            {user.full_name || "No name set"}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {user.email}
      </TableCell>
      <TableCell>
        <span className={`admin-users-row__role admin-users-row__role--${user.role}`}>
          {user.role === 'admin' && <ShieldIcon className="h-3.5 w-3.5" />}
          {user.role === 'marketing' && <MegaphoneIcon className="h-3.5 w-3.5" />}
          {user.role === 'learner' && <GraduationCapIcon className="h-3.5 w-3.5" />}
          {user.role === 'admin' ? 'Admin' : user.role === 'marketing' ? 'Marketing' : 'Learner'}
        </span>
      </TableCell>
      <TableCell>
        <span className={`admin-users-row__status admin-users-row__status--${user.certification_status || 'in_progress'}`}>
          {user.certification_status === 'certified' && <CheckCircleIcon className="h-3.5 w-3.5" />}
          {user.certification_status === 'ready' && <ClockIcon className="h-3.5 w-3.5" />}
          {(!user.certification_status || user.certification_status === 'in_progress') && <TrendingUpIcon className="h-3.5 w-3.5" />}
          {statusLabel}
        </span>
      </TableCell>
      <TableCell className="whitespace-nowrap text-muted-foreground">
        {joinedDate}
      </TableCell>
      <TableCell className="text-right">
        <div className="admin-users-row__actions">
          {showProgress && (
            <Button
              size="sm"
              variant="ghost"
              title={`View ${user.full_name || user.email}'s LMS progress`}
              render={<Link href={`/learn/admin/progress/${user.id}`} prefetch={false} />}
            >
              <ChartNoAxesColumnIcon className="h-3.5 w-3.5" />
            </Button>
          )}
          <LoginAsButton userId={user.id} userName={user.full_name || user.email} />
          <UserEditForm user={user} />
        </div>
      </TableCell>
    </TableRow>
  )
}
