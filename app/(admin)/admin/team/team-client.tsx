/**
 * Team Admin Client Component
 *
 * Client-side logic for team member CRUD operations.
 * Uses dedicated edit pages instead of modals for better UX.
 */

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Stack, Row, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { Progress } from "@/components/ui/progress"
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExternalLinkIcon,
  Loader2Icon,
  DatabaseIcon,
  UserIcon,
  ListIcon,
  GroupIcon,
  BookOpenIcon,
} from "lucide-react"
import { deleteTeamMember, type TeamMemberRow } from "@/lib/actions/cms"
import { toast } from "@/components/ui/toast"

type LmsProgressInfo = {
  overallProgress: number
  certificationStatus: "in_progress" | "ready" | "certified"
  completedModules: number
  totalModules: number
}

type TeamClientProps = {
  members: TeamMemberRow[]
  lmsProgress: Record<string, LmsProgressInfo>
}

export function TeamClient({ members, lmsProgress }: TeamClientProps) {
  const router = useRouter()
  const [groupByRole, setGroupByRole] = useState(false)

  // A-Z sorted list (default)
  const sortedMembers = [...members].sort((a, b) => a.name.localeCompare(b.name))

  // Grouped: sort by role then name within each role
  const groupedByRole = sortedMembers.reduce<Record<string, TeamMemberRow[]>>((acc, member) => {
    const role = member.role || "No Role"
    if (!acc[role]) acc[role] = []
    acc[role].push(member)
    return acc
  }, {})
  const sortedRoles = Object.keys(groupedByRole).sort()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<TeamMemberRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  function handleDeleteClick(member: TeamMemberRow) {
    setMemberToDelete(member)
    setDeleteDialogOpen(true)
  }

  async function handleDeleteConfirm() {
    if (!memberToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteTeamMember(memberToDelete.id)
      if (result.success) {
        toast.success("Team member deleted successfully")
        setDeleteDialogOpen(false)
        setMemberToDelete(null)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Failed to delete team member")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Stack gap="xl">
        {/* Page Header */}
        <Row justify="between" align="center">
          <Stack gap="xs">
            <Title size="h3">Team Members</Title>
            <Text variant="muted">
              Manage your team profiles
            </Text>
          </Stack>
          <Button render={<Link href="/admin/team/new" />}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </Row>

        {/* Connected Badge */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <Row gap="md" align="start">
              <DatabaseIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <Stack gap="xs">
                <Text weight="medium">Connected to Supabase</Text>
                <Text size="sm" variant="muted">
                  Team members are stored in your Supabase database. Changes sync to the public website immediately.
                </Text>
              </Stack>
            </Row>
          </CardContent>
        </Card>

        {/* Team Table */}
        <Card>
          <CardHeader>
            <Row justify="between" align="center">
              <Stack gap="xs">
                <CardTitle>All Team Members ({members.length})</CardTitle>
                <CardDescription>
                  Click edit to update a team member, or view to see the live page
                </CardDescription>
              </Stack>
              <Button
                variant={groupByRole ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setGroupByRole(!groupByRole)}
              >
                {groupByRole ? <GroupIcon className="h-4 w-4 mr-2" /> : <ListIcon className="h-4 w-4 mr-2" />}
                {groupByRole ? "Grouped by Role" : "A–Z"}
              </Button>
            </Row>
          </CardHeader>
          <CardContent>
            {members.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Expertise</TableHead>
                    <TableHead>LMS Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupByRole ? (
                    sortedRoles.map((role) => (
                      <>
                        <TableRow key={`role-${role}`} className="bg-muted/30 hover:bg-muted/30 border-t-2">
                          <TableCell colSpan={8} className="py-2">
                            <Text weight="medium" size="sm" variant="muted">{role}</Text>
                          </TableCell>
                        </TableRow>
                        {groupedByRole[role].map((member) => (
                          <MemberRow key={member.id} member={member} onDelete={handleDeleteClick} lmsProgress={member.email ? lmsProgress[member.email.toLowerCase()] : undefined} />
                        ))}
                      </>
                    ))
                  ) : (
                    sortedMembers.map((member) => (
                      <MemberRow key={member.id} member={member} onDelete={handleDeleteClick} lmsProgress={member.email ? lmsProgress[member.email.toLowerCase()] : undefined} />
                    ))
                  )}
                </TableBody>
              </Table>
            ) : (
              <Stack gap="md" align="center" className="py-12">
                <Text variant="muted">No team members found</Text>
                <Button render={<Link href="/admin/team/new" />}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add First Team Member
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{memberToDelete?.name}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function MemberRow({ member, onDelete, lmsProgress }: { member: TeamMemberRow; onDelete: (m: TeamMemberRow) => void; lmsProgress?: LmsProgressInfo }) {
  return (
    <TableRow>
      <TableCell>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={member.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Text weight="medium">{member.name}</Text>
      </TableCell>
      <TableCell>
        <Text size="sm">{member.role}</Text>
      </TableCell>
      <TableCell>
        <Text size="sm" variant="muted">{member.email}</Text>
      </TableCell>
      <TableCell>
        <Row gap="xs" wrap>
          {member.expertise?.slice(0, 2).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {member.expertise && member.expertise.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{member.expertise.length - 2}
            </Badge>
          )}
        </Row>
      </TableCell>
      <TableCell>
        {lmsProgress ? (
          <Stack gap="xs">
            <Row gap="sm" align="center">
              <Text size="sm" weight="medium">{lmsProgress.overallProgress}%</Text>
              <Text size="xs" variant="muted">
                ({lmsProgress.completedModules}/{lmsProgress.totalModules})
              </Text>
            </Row>
            <Progress value={lmsProgress.overallProgress} className="h-1.5 w-24" />
          </Stack>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            <BookOpenIcon className="h-3 w-3 mr-1" />
            Not Started
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <Row gap="xs">
          {member.published ? (
            <Badge variant="secondary">Published</Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">Draft</Badge>
          )}
          {member.is_founder && (
            <Badge>Founder</Badge>
          )}
        </Row>
      </TableCell>
      <TableCell className="text-right">
        <Row gap="xs" justify="end">
          <Button
            variant="ghost"
            size="icon-sm"
            render={<Link href={`/team/${member.slug}`} target="_blank" />}
          >
            <ExternalLinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            render={<Link href={`/admin/team/${member.id}`} />}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(member)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </Row>
      </TableCell>
    </TableRow>
  )
}
