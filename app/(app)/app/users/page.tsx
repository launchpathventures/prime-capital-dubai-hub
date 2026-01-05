/**
 * CATALYST - Admin Users Page
 *
 * Learner account management page.
 * Allows admins to create, view, and manage learner accounts.
 */

import Link from "next/link"
import { Container, Stack, Grid, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/core"
import {
  PlusIcon,
  SearchIcon,
  MoreHorizontalIcon,
  TrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// User Data (mock - would come from database)
// -----------------------------------------------------------------------------

const learners = [
  {
    id: "1",
    name: "Sarah Al Maktoum",
    email: "sarah.almaktoum@primecapital.ae",
    role: "learner",
    status: "active" as const,
    progress: 75,
    certificationStatus: "in-progress" as const,
    lastActive: "2 hours ago",
    joinedAt: "2024-12-15",
  },
  {
    id: "2",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@primecapital.ae",
    role: "learner",
    status: "active" as const,
    progress: 45,
    certificationStatus: "in-progress" as const,
    lastActive: "1 day ago",
    joinedAt: "2024-12-20",
  },
  {
    id: "3",
    name: "Maria Santos",
    email: "maria.santos@primecapital.ae",
    role: "learner",
    status: "active" as const,
    progress: 100,
    certificationStatus: "certified" as const,
    lastActive: "3 hours ago",
    joinedAt: "2024-11-01",
  },
  {
    id: "4",
    name: "John Smith",
    email: "john.smith@primecapital.ae",
    role: "learner",
    status: "inactive" as const,
    progress: 20,
    certificationStatus: "in-progress" as const,
    lastActive: "2 weeks ago",
    joinedAt: "2024-12-01",
  },
  {
    id: "5",
    name: "Fatima Al Rashid",
    email: "fatima.alrashid@primecapital.ae",
    role: "learner",
    status: "active" as const,
    progress: 90,
    certificationStatus: "ready" as const,
    lastActive: "30 minutes ago",
    joinedAt: "2024-11-15",
  },
]

const activeCount = learners.filter((l) => l.status === "active").length
const certifiedCount = learners.filter((l) => l.certificationStatus === "certified").length
const readyCount = learners.filter((l) => l.certificationStatus === "ready").length

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function AdminUsersPage() {
  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Page Header */}
        <Row gap="md" align="start" justify="between">
          <Stack gap="xs">
            <Title size="h3">User Management</Title>
            <Text variant="muted">
              Create and manage learner accounts for the training platform.
            </Text>
          </Stack>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Learner
          </Button>
        </Row>

        {/* Stats Overview */}
        <Grid cols={4} gap="md">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Learners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row gap="sm" align="baseline">
                <Title size="h2">{learners.length}</Title>
                <Text size="sm" variant="muted">accounts</Text>
              </Row>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row gap="sm" align="baseline">
                <Title size="h2">{activeCount}</Title>
                <Text size="sm" variant="muted">/ {learners.length}</Text>
              </Row>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ready for Certification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row gap="sm" align="baseline">
                <Title size="h2">{readyCount}</Title>
                <Text size="sm" variant="muted">learners</Text>
              </Row>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Certified
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row gap="sm" align="baseline">
                <Title size="h2">{certifiedCount}</Title>
                <Text size="sm" variant="muted">consultants</Text>
              </Row>
            </CardContent>
          </Card>
        </Grid>

        {/* Search and Filters */}
        <Row gap="md" align="center">
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search learners..." className="pl-9" />
          </div>
          <Button variant="outline">
            All Status
          </Button>
          <Button variant="outline">
            All Certification
          </Button>
        </Row>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_180px_120px_120px_80px] gap-4 px-4 py-3 bg-muted/50">
                <Text size="sm" weight="medium" variant="muted">Learner</Text>
                <Text size="sm" weight="medium" variant="muted">Progress</Text>
                <Text size="sm" weight="medium" variant="muted">Status</Text>
                <Text size="sm" weight="medium" variant="muted">Certification</Text>
                <Text size="sm" weight="medium" variant="muted"></Text>
              </div>
              
              {/* Table Body */}
              {learners.map((learner) => (
                <UserRow key={learner.id} learner={learner} />
              ))}
            </div>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}

// -----------------------------------------------------------------------------
// User Row Component
// -----------------------------------------------------------------------------

interface UserRowProps {
  learner: typeof learners[0]
}

function UserRow({ learner }: UserRowProps) {
  const statusConfig = {
    active: { label: "Active", variant: "default" as const },
    inactive: { label: "Inactive", variant: "secondary" as const },
  }
  
  const certificationConfig = {
    "in-progress": { label: "In Progress", variant: "secondary" as const, icon: ClockIcon },
    ready: { label: "Ready", variant: "outline" as const, icon: AlertCircleIcon },
    certified: { label: "Certified", variant: "default" as const, icon: CheckCircleIcon },
  }
  
  const { label: statusLabel, variant: statusVariant } = statusConfig[learner.status]
  const { 
    label: certLabel, 
    variant: certVariant, 
    icon: CertIcon 
  } = certificationConfig[learner.certificationStatus]

  return (
    <div className="grid grid-cols-[1fr_180px_120px_120px_80px] gap-4 px-4 py-3 items-center hover:bg-muted/30 transition-colors">
      {/* Learner Info */}
      <Row gap="sm" align="center">
        <Avatar name={learner.name} size="sm" />
        <Stack gap="none" className="min-w-0">
          <Text weight="medium" className="truncate">{learner.name}</Text>
          <Text size="xs" variant="muted" className="truncate">{learner.email}</Text>
        </Stack>
      </Row>
      
      {/* Progress */}
      <Stack gap="xs">
        <Row gap="sm" align="center" justify="between">
          <Text size="sm">{learner.progress}%</Text>
          <Text size="xs" variant="muted">{learner.lastActive}</Text>
        </Row>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${learner.progress}%` }}
          />
        </div>
      </Stack>
      
      {/* Status */}
      <Badge variant={statusVariant}>{statusLabel}</Badge>
      
      {/* Certification */}
      <Badge variant={certVariant}>
        <CertIcon className="h-3 w-3 mr-1" />
        {certLabel}
      </Badge>
      
      {/* Actions */}
      <Row gap="xs" justify="end">
        <Button variant="ghost" size="sm" nativeButton={false} render={<Link href={`/app/progress?user=${learner.id}`} />}>
          <TrendingUpIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </Row>
    </div>
  )
}
