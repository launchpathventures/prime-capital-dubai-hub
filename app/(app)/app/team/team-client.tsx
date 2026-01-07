/**
 * CATALYST - Team Admin Client Component
 * 
 * Client-side logic for team member CRUD operations.
 */

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExternalLinkIcon,
  Loader2Icon,
  DatabaseIcon,
} from "lucide-react"
import { TeamMemberForm } from "./team-member-form"
import { deleteTeamMember, type TeamMemberRow } from "@/lib/actions/cms"
import { toast } from "@/components/ui/toast"

type TeamClientProps = {
  members: TeamMemberRow[]
}

export function TeamClient({ members }: TeamClientProps) {
  const router = useRouter()
  const [formOpen, setFormOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMemberRow | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<TeamMemberRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  function handleCreate() {
    setEditingMember(undefined)
    setFormOpen(true)
  }

  function handleEdit(member: TeamMemberRow) {
    setEditingMember(member)
    setFormOpen(true)
  }

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
    } catch (error) {
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
          <Button onClick={handleCreate}>
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
            <CardTitle>All Team Members ({members.length})</CardTitle>
            <CardDescription>
              Click a member to view on the public website
            </CardDescription>
          </CardHeader>
          <CardContent>
            {members.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Expertise</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
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
                        {member.is_founder ? (
                          <Badge>Founder</Badge>
                        ) : (
                          <Badge variant="secondary">Team</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Row gap="xs" justify="end">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            nativeButton={false}
                            render={<Link href={`/team/${member.slug}`} target="_blank" />}
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon-sm"
                            onClick={() => handleEdit(member)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon-sm"
                            onClick={() => handleDeleteClick(member)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </Row>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Stack gap="md" align="center" className="py-12">
                <Text variant="muted">No team members found</Text>
                <Button onClick={handleCreate}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add First Team Member
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>

      {/* Create/Edit Form Dialog */}
      <TeamMemberForm 
        member={editingMember}
        open={formOpen}
        onOpenChange={setFormOpen}
      />

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
