/**
 * CATALYST - Team Admin Page
 *
 * CRUD interface for managing team members.
 * This is a placeholder that displays JSON data - full CRUD requires Supabase.
 */

import Link from "next/link"
import { getTeamMembers } from "@/lib/content"
import { Container, Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExternalLinkIcon,
  AlertCircleIcon,
} from "lucide-react"

export const metadata = {
  title: "Manage Team | Admin",
}

export default function TeamAdminPage() {
  const team = getTeamMembers()

  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Page Header */}
        <Row justify="between" align="center">
          <Stack gap="xs">
            <Title size="h3">Team Members</Title>
            <Text variant="muted">
              Manage your team profiles
            </Text>
          </Stack>
          <Button disabled>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </Row>

        {/* Notice */}
        <Card className="border-warning bg-warning/5">
          <CardContent className="pt-6">
            <Row gap="md" align="start">
              <AlertCircleIcon className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <Stack gap="xs">
                <Text weight="medium">JSON Data Mode</Text>
                <Text size="sm" variant="muted">
                  Team data is currently loaded from JSON files. Full CRUD operations 
                  require Supabase integration. This view shows read-only data from{" "}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">data/team.json</code>.
                </Text>
              </Stack>
            </Row>
          </CardContent>
        </Card>

        {/* Team Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Team Members ({team.length})</CardTitle>
            <CardDescription>
              Click a member to view on the public website
            </CardDescription>
          </CardHeader>
          <CardContent>
            {team.length > 0 ? (
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
                  {team.map((member) => (
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
                          {member.expertise.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {member.expertise.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{member.expertise.length - 2}
                            </Badge>
                          )}
                        </Row>
                      </TableCell>
                      <TableCell>
                        {member.published ? (
                          <Badge>Published</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
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
                          <Button variant="ghost" size="icon-sm" disabled>
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" disabled>
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
                <Button disabled>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add First Team Member
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
