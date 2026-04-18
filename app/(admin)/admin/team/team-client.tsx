/**
 * CATALYST - Unified Team Client Component
 *
 * Client-side search, filtering, role management, and team profile status.
 * Primary source: user_profiles (system users).
 * Secondary: team_members (public website profiles), matched by email.
 */

"use client"

import { useState, useMemo, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Stack, Row, Text } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import {
  AlertTriangleIcon,
  SearchIcon,
  Loader2Icon,
  PencilIcon,
  ExternalLinkIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react"
import type { LearnerSummary } from "@/lib/lms/admin-queries"
import type { TeamMemberRow } from "@/lib/actions/cms"
import { deleteTeamMember } from "@/lib/actions/cms"
import { updateUserRole, type UserRole } from "@/lib/actions/users"
import { MagicLinkButton } from "./magic-link-button"
import { toast } from "@/components/ui/toast"

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "Never"
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

// -----------------------------------------------------------------------------
// Role Config
// -----------------------------------------------------------------------------

const ROLE_CONFIG: Record<UserRole, { label: string; variant: "default" | "secondary" | "outline" }> = {
  admin: { label: "Admin", variant: "default" },
  marketing: { label: "Marketing", variant: "outline" },
  learner: { label: "Learner", variant: "secondary" },
}

const ROLE_DESCRIPTIONS: Record<UserRole, (name: string) => string> = {
  admin: (name) => `This will give ${name} full admin access to manage website content, users, learning modules, and settings.`,
  marketing: (name) => `This will give ${name} access to manage website content (properties, testimonials, stats) but not user management or learning admin.`,
  learner: (name) => `This will restrict ${name} to the learning portal only. They will lose access to admin features.`,
}

const ROLES: UserRole[] = ["admin", "marketing", "learner"]

const ROLE_ITEMS = ROLES.map((role) => ({
  value: role,
  label: ROLE_CONFIG[role].label,
}))

// Title sort priority — matches recruitment hierarchy.
// Titles not in this list are sorted after, alphabetically.
const TITLE_ORDER = [
  "Associate Director",
  "Senior Property Consultant",
  "Property Consultant",
  "Operations Manager",
]

function titleRank(title: string | null | undefined): number {
  if (!title) return TITLE_ORDER.length + 1
  const idx = TITLE_ORDER.findIndex(
    (t) => t.toLowerCase() === title.toLowerCase(),
  )
  return idx === -1 ? TITLE_ORDER.length : idx
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Props = {
  users: LearnerSummary[]
  teamProfiles: Record<string, TeamMemberRow>
  /** Team members with no matching user_profiles entry */
  orphanProfiles: TeamMemberRow[]
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TeamClient({ users, teamProfiles, orphanProfiles }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all")
  const [updatingRole, setUpdatingRole] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  // Role confirmation dialog
  const [roleDialog, setRoleDialog] = useState<{
    userId: string
    name: string
    newRole: UserRole
  } | null>(null)
  const [isRoleUpdating, setIsRoleUpdating] = useState(false)

  // Delete profile dialog
  const [deleteDialog, setDeleteDialog] = useState<TeamMemberRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = useMemo(() => {
    let result = [...users]

    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      )
    }

    return result.sort((a, b) => {
      const titleA = teamProfiles[a.email.toLowerCase()]?.role
      const titleB = teamProfiles[b.email.toLowerCase()]?.role
      const rankDiff = titleRank(titleA) - titleRank(titleB)
      if (rankDiff !== 0) return rankDiff
      return a.fullName.localeCompare(b.fullName)
    })
  }, [users, teamProfiles, search, roleFilter])

  // Filtered orphan profiles
  const filteredOrphans = useMemo(() => {
    if (roleFilter !== "all") return [] // Orphans have no system role
    let result = orphanProfiles
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.email && p.email.toLowerCase().includes(q))
      )
    }
    return [...result].sort((a, b) => {
      const rankDiff = titleRank(a.role) - titleRank(b.role)
      if (rankDiff !== 0) return rankDiff
      return a.name.localeCompare(b.name)
    })
  }, [orphanProfiles, search, roleFilter])

  function handleRoleChange(userId: string, name: string, newRole: UserRole) {
    setRoleDialog({ userId, name, newRole })
  }

  async function handleRoleConfirm() {
    if (!roleDialog) return
    setIsRoleUpdating(true)
    try {
      const result = await updateUserRole(roleDialog.userId, roleDialog.newRole)
      if (result.success) {
        const roleLabel = ROLE_CONFIG[roleDialog.newRole].label
        toast.success(`${roleDialog.name} is now ${roleLabel}`)
        startTransition(() => router.refresh())
      } else {
        toast.error(result.error || "Failed to update role")
      }
    } catch {
      toast.error("Failed to update role")
    } finally {
      setIsRoleUpdating(false)
      setRoleDialog(null)
    }
  }

  async function handleDeleteProfile() {
    if (!deleteDialog) return
    setIsDeleting(true)
    try {
      const result = await deleteTeamMember(deleteDialog.id)
      if (result.success) {
        toast.success("Public profile deleted")
        startTransition(() => router.refresh())
      } else {
        toast.error(result.error || "Failed to delete profile")
      }
    } catch {
      toast.error("Failed to delete profile")
    } finally {
      setIsDeleting(false)
      setDeleteDialog(null)
    }
  }

  const adminCount = users.filter((u) => u.role === "admin").length
  const marketingCount = users.filter((u) => u.role === "marketing").length
  const learnerCount = users.filter((u) => u.role === "learner").length

  return (
    <>
      <Stack gap="md">
        {/* Search & Filters */}
        <Row gap="sm" align="center">
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Row gap="xs">
            <Button
              variant={roleFilter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setRoleFilter("all")}
            >
              All ({users.length})
            </Button>
            <Button
              variant={roleFilter === "learner" ? "default" : "ghost"}
              size="sm"
              onClick={() => setRoleFilter("learner")}
            >
              Learners ({learnerCount})
            </Button>
            <Button
              variant={roleFilter === "marketing" ? "default" : "ghost"}
              size="sm"
              onClick={() => setRoleFilter("marketing")}
            >
              Marketing ({marketingCount})
            </Button>
            <Button
              variant={roleFilter === "admin" ? "default" : "ghost"}
              size="sm"
              onClick={() => setRoleFilter("admin")}
            >
              Admins ({adminCount})
            </Button>
          </Row>
        </Row>

        {/* Users Table */}
        {filtered.length === 0 && filteredOrphans.length === 0 ? (
          <div className="py-12 text-center">
            <Text variant="muted">
              {search ? `No users matching "${search}"` : "No users found"}
            </Text>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="px-4 py-3">
                  <Text size="sm" weight="medium" variant="muted">User</Text>
                </TableHead>
                <TableHead className="px-4 py-3 w-24">
                  <Text size="sm" weight="medium" variant="muted">Role</Text>
                </TableHead>
                <TableHead className="px-4 py-3 w-48">
                  <Text size="sm" weight="medium" variant="muted">Title</Text>
                </TableHead>
                <TableHead className="px-4 py-3 w-44">
                  <Text size="sm" weight="medium" variant="muted">Progress</Text>
                </TableHead>
                <TableHead className="px-4 py-3 w-28">
                  <Text size="sm" weight="medium" variant="muted">Profile</Text>
                </TableHead>
                <TableHead className="px-4 py-3 w-24">
                  <Text size="sm" weight="medium" variant="muted"></Text>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  teamProfile={teamProfiles[user.email.toLowerCase()] || null}
                  updatingRole={updatingRole}
                  onRoleChange={handleRoleChange}
                  onDeleteProfile={setDeleteDialog}
                />
              ))}
              {/* Orphan team profiles — no system account */}
              {filteredOrphans.length > 0 && (
                <>
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableCell colSpan={6} className="px-4 py-2">
                      <Text size="xs" weight="medium" variant="muted">
                        Public profiles without a user account ({filteredOrphans.length})
                      </Text>
                    </TableCell>
                  </TableRow>
                  {filteredOrphans.map((profile) => (
                    <OrphanRow
                      key={profile.id}
                      profile={profile}
                      onDeleteProfile={setDeleteDialog}
                    />
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        )}
      </Stack>

      {/* Role Change Confirmation */}
      <AlertDialog open={!!roleDialog} onOpenChange={(open) => !open && setRoleDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Change Role to {roleDialog ? ROLE_CONFIG[roleDialog.newRole].label : ""}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {roleDialog ? ROLE_DESCRIPTIONS[roleDialog.newRole]?.(roleDialog.name) : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRoleUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={roleDialog?.newRole === "learner" ? "destructive" : "default"}
              onClick={handleRoleConfirm}
              disabled={isRoleUpdating}
            >
              {isRoleUpdating && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Profile Confirmation */}
      <AlertDialog open={!!deleteDialog} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Public Profile</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove &quot;{deleteDialog?.name}&quot; from the public website.
              {deleteDialog?.email && " Their user account will not be affected."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteProfile}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
              Delete Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

function UserRow({
  user,
  teamProfile,
  updatingRole,
  onRoleChange,
  onDeleteProfile,
}: {
  user: LearnerSummary
  teamProfile: TeamMemberRow | null
  updatingRole: string | null
  onRoleChange: (userId: string, name: string, newRole: UserRole) => void
  onDeleteProfile: (profile: TeamMemberRow) => void
}) {
  const isUpdating = updatingRole === user.id

  return (
    <TableRow>
      {/* User Info */}
      <TableCell className="px-4 py-3">
        <Link
          href={`/admin/progress/${user.id}`}
          className="block hover:opacity-80 transition-opacity"
        >
          <Row gap="sm" align="center">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
              {teamProfile?.photo ? (
                <Image
                  src={teamProfile.photo}
                  alt={user.fullName}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              )}
            </div>
            <Stack gap="none" className="min-w-0">
              <Row gap="xs" align="center">
                <Text weight="medium" className="truncate">{user.fullName}</Text>
                {user.isAtRisk && (
                  <AlertTriangleIcon className="h-4 w-4 text-warning flex-shrink-0" />
                )}
              </Row>
              <Text size="xs" variant="muted" className="truncate">{user.email}</Text>
            </Stack>
          </Row>
        </Link>
      </TableCell>

      {/* Role */}
      <TableCell className="px-4 py-3">
        {isUpdating ? (
          <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Select
            items={ROLE_ITEMS}
            value={user.role}
            onValueChange={(value) => onRoleChange(user.id, user.fullName, value as UserRole)}
          >
            <SelectTrigger size="sm" className="w-auto border-0 shadow-none hover:bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_ITEMS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </TableCell>

      {/* Title */}
      <TableCell className="px-4 py-3">
        {teamProfile?.role ? (
          <Text size="sm" className="truncate">{teamProfile.role}</Text>
        ) : (
          <Text size="sm" variant="muted">—</Text>
        )}
      </TableCell>

      {/* Progress + Status (combined) */}
      <TableCell className="px-4 py-3">
        <Row gap="sm" align="center">
          <Stack gap="xs" className="flex-1 min-w-0">
            <Row gap="sm" align="center">
              <Text size="sm" weight="medium">{user.overallProgress}%</Text>
              <Text size="xs" variant="muted">
                ({user.completedModules}/{user.totalModules})
              </Text>
            </Row>
            <Progress value={user.overallProgress} className="h-1.5" />
          </Stack>
          <CertBadge status={user.certificationStatus} />
        </Row>
      </TableCell>

      {/* Public Profile */}
      <TableCell className="px-4 py-3">
        {teamProfile ? (
          <Row gap="xs" align="center">
            {teamProfile.published ? (
              <Badge variant="secondary" className="text-xs">Published</Badge>
            ) : (
              <Badge variant="outline" className="text-xs text-muted-foreground">Draft</Badge>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              render={<Link href={`/admin/team/${teamProfile.id}`} />}
              title="Edit public profile"
            >
              <PencilIcon className="h-3.5 w-3.5" />
            </Button>
            {teamProfile.published && (
              <Button
                variant="ghost"
                size="icon-sm"
                render={<Link href={`/team/${teamProfile.slug}`} target="_blank" />}
                title="View live profile"
              >
                <ExternalLinkIcon className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDeleteProfile(teamProfile)}
              title="Delete public profile"
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </Button>
          </Row>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            render={<Link href="/admin/team/new" />}
            title="Create public profile"
          >
            <PlusIcon className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        )}
      </TableCell>

      {/* Actions */}
      <TableCell className="px-4 py-3">
        <Row gap="xs" align="center">
          <MagicLinkButton email={user.email} />
          <Link
            href={`/admin/progress/${user.id}`}
            className="text-sm text-primary hover:underline"
          >
            View
          </Link>
        </Row>
      </TableCell>
    </TableRow>
  )
}

/** Orphan team profile row — exists in CMS but has no system account */
function OrphanRow({
  profile,
  onDeleteProfile,
}: {
  profile: TeamMemberRow
  onDeleteProfile: (profile: TeamMemberRow) => void
}) {
  return (
    <TableRow className="opacity-70">
      {/* Info */}
      <TableCell className="px-4 py-3">
        <Row gap="sm" align="center">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
            {profile.photo ? (
              <Image
                src={profile.photo}
                alt={profile.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
          <Stack gap="none" className="min-w-0">
            <Text weight="medium" className="truncate">{profile.name}</Text>
            <Text size="xs" variant="muted" className="truncate">
              {profile.email || "No email"}
            </Text>
          </Stack>
        </Row>
      </TableCell>

      {/* Role — no system account */}
      <TableCell className="px-4 py-3">
        <Badge variant="outline" className="text-xs text-muted-foreground">No account</Badge>
      </TableCell>

      {/* Title */}
      <TableCell className="px-4 py-3">
        {profile.role ? (
          <Text size="sm" className="truncate">{profile.role}</Text>
        ) : (
          <Text size="sm" variant="muted">—</Text>
        )}
      </TableCell>

      {/* Progress — N/A */}
      <TableCell className="px-4 py-3">
        <Text size="xs" variant="muted">—</Text>
      </TableCell>

      {/* Profile */}
      <TableCell className="px-4 py-3">
        <Row gap="xs" align="center">
          {profile.published ? (
            <Badge variant="secondary" className="text-xs">Published</Badge>
          ) : (
            <Badge variant="outline" className="text-xs text-muted-foreground">Draft</Badge>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            render={<Link href={`/admin/team/${profile.id}`} />}
            title="Edit public profile"
          >
            <PencilIcon className="h-3.5 w-3.5" />
          </Button>
          {profile.published && (
            <Button
              variant="ghost"
              size="icon-sm"
              render={<Link href={`/team/${profile.slug}`} target="_blank" />}
              title="View live profile"
            >
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDeleteProfile(profile)}
            title="Delete public profile"
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </Button>
        </Row>
      </TableCell>

      {/* Actions */}
      <TableCell className="px-4 py-3" />
    </TableRow>
  )
}

function CertBadge({ status }: { status: "in_progress" | "ready" | "certified" }) {
  const config = {
    in_progress: { label: "In Progress", variant: "secondary" as const },
    ready: { label: "Ready", variant: "outline" as const },
    certified: { label: "Certified", variant: "default" as const },
  }
  const { label, variant } = config[status]
  return <Badge variant={variant} className="text-xs shrink-0">{label}</Badge>
}
