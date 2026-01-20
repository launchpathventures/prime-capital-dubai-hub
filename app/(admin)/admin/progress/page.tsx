/**
 * Admin Progress Page
 *
 * Team progress dashboard showing learner completion and certification status.
 * Provides visibility into agent readiness without individual check-ins.
 */

import { Container, Stack, Grid, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar } from "@/components/core"
import {
  SearchIcon,
  FilterIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Progress Data (mock - would come from database)
// -----------------------------------------------------------------------------

const learnerProgress = [
  {
    id: "1",
    name: "Sarah Al Maktoum",
    email: "sarah.almaktoum@primecapital.ae",
    overallProgress: 75,
    lastActivity: "2 hours ago",
    certificationStatus: "in-progress" as const,
    competencies: {
      "market-intelligence": 100,
      "client-discovery": 67,
      "property-matching": 0,
      "transaction-management": 0,
      "objection-navigation": 0,
      "relationship-stewardship": 0,
    },
    trend: "up" as const,
  },
  {
    id: "2",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@primecapital.ae",
    overallProgress: 45,
    lastActivity: "1 day ago",
    certificationStatus: "in-progress" as const,
    competencies: {
      "market-intelligence": 100,
      "client-discovery": 33,
      "property-matching": 0,
      "transaction-management": 0,
      "objection-navigation": 0,
      "relationship-stewardship": 0,
    },
    trend: "neutral" as const,
  },
  {
    id: "3",
    name: "Maria Santos",
    email: "maria.santos@primecapital.ae",
    overallProgress: 100,
    lastActivity: "3 hours ago",
    certificationStatus: "certified" as const,
    competencies: {
      "market-intelligence": 100,
      "client-discovery": 100,
      "property-matching": 100,
      "transaction-management": 100,
      "objection-navigation": 100,
      "relationship-stewardship": 100,
    },
    trend: "up" as const,
  },
  {
    id: "4",
    name: "John Smith",
    email: "john.smith@primecapital.ae",
    overallProgress: 20,
    lastActivity: "2 weeks ago",
    certificationStatus: "in-progress" as const,
    competencies: {
      "market-intelligence": 50,
      "client-discovery": 0,
      "property-matching": 0,
      "transaction-management": 0,
      "objection-navigation": 0,
      "relationship-stewardship": 0,
    },
    trend: "down" as const,
  },
  {
    id: "5",
    name: "Fatima Al Rashid",
    email: "fatima.alrashid@primecapital.ae",
    overallProgress: 90,
    lastActivity: "30 minutes ago",
    certificationStatus: "ready" as const,
    competencies: {
      "market-intelligence": 100,
      "client-discovery": 100,
      "property-matching": 100,
      "transaction-management": 100,
      "objection-navigation": 100,
      "relationship-stewardship": 40,
    },
    trend: "up" as const,
  },
]

const competencyLabels: Record<string, string> = {
  "market-intelligence": "Market Intelligence",
  "client-discovery": "Client Discovery",
  "property-matching": "Property Matching",
  "transaction-management": "Transaction Management",
  "objection-navigation": "Objection Navigation",
  "relationship-stewardship": "Relationship Stewardship",
}

const avgProgress = Math.round(
  learnerProgress.reduce((sum, l) => sum + l.overallProgress, 0) / learnerProgress.length
)
const readyCount = learnerProgress.filter((l) => l.certificationStatus === "ready").length
const certifiedCount = learnerProgress.filter((l) => l.certificationStatus === "certified").length
const atRiskCount = learnerProgress.filter((l) => l.trend === "down").length

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function AdminProgressPage() {
  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Page Header */}
        <Stack gap="xs">
          <Title size="h3">Team Progress</Title>
          <Text variant="muted">
            Monitor learner progress and certification readiness across the team.
          </Text>
        </Stack>

        {/* Stats Overview */}
        <Grid cols={4} gap="md">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row gap="sm" align="baseline">
                <Title size="h2">{avgProgress}%</Title>
                <Row gap="xs" align="center">
                  <ArrowUpIcon className="h-3 w-3 text-success" />
                  <Text size="xs" className="text-success">+5%</Text>
                </Row>
              </Row>
              <Progress value={avgProgress} className="h-2 mt-2" />
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
              <Text size="xs" variant="muted" className="mt-1">
                Awaiting founder session
              </Text>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Certified Consultants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row gap="sm" align="baseline">
                <Title size="h2">{certifiedCount}</Title>
                <Text size="sm" variant="muted">/ {learnerProgress.length}</Text>
              </Row>
              <Text size="xs" variant="muted" className="mt-1">
                Ready for client contact
              </Text>
            </CardContent>
          </Card>
          
          <Card className={atRiskCount > 0 ? "border-warning/50" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                At Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row gap="sm" align="baseline">
                <Title size="h2" className={atRiskCount > 0 ? "text-warning" : ""}>
                  {atRiskCount}
                </Title>
                <Text size="sm" variant="muted">learners</Text>
              </Row>
              <Text size="xs" variant="muted" className="mt-1">
                Declining engagement
              </Text>
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
            <FilterIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </Row>

        {/* Progress Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Header */}
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3">
                      <Text size="sm" weight="medium" variant="muted">Learner</Text>
                    </th>
                    <th className="text-left px-4 py-3 w-32">
                      <Text size="sm" weight="medium" variant="muted">Progress</Text>
                    </th>
                    {Object.keys(competencyLabels).map((key) => (
                      <th key={key} className="text-center px-2 py-3 w-16">
                        <Text size="xs" weight="medium" variant="muted" className="truncate">
                          {competencyLabels[key].split(" ")[0]}
                        </Text>
                      </th>
                    ))}
                    <th className="text-left px-4 py-3 w-28">
                      <Text size="sm" weight="medium" variant="muted">Status</Text>
                    </th>
                    <th className="text-left px-4 py-3 w-24">
                      <Text size="sm" weight="medium" variant="muted">Activity</Text>
                    </th>
                  </tr>
                </thead>
                
                {/* Table Body */}
                <tbody className="divide-y">
                  {learnerProgress.map((learner) => (
                    <ProgressRow key={learner.id} learner={learner} />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardContent className="py-3">
            <Row gap="lg" align="center" justify="center">
              <Row gap="xs" align="center">
                <div className="w-4 h-4 rounded bg-success" />
                <Text size="xs" variant="muted">Complete (100%)</Text>
              </Row>
              <Row gap="xs" align="center">
                <div className="w-4 h-4 rounded bg-primary" />
                <Text size="xs" variant="muted">In Progress (1-99%)</Text>
              </Row>
              <Row gap="xs" align="center">
                <div className="w-4 h-4 rounded bg-muted" />
                <Text size="xs" variant="muted">Not Started (0%)</Text>
              </Row>
            </Row>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}

// -----------------------------------------------------------------------------
// Progress Row Component
// -----------------------------------------------------------------------------

interface ProgressRowProps {
  learner: typeof learnerProgress[0]
}

function ProgressRow({ learner }: ProgressRowProps) {
  const certificationConfig = {
    "in-progress": { label: "In Progress", variant: "secondary" as const },
    ready: { label: "Ready", variant: "outline" as const },
    certified: { label: "Certified", variant: "default" as const },
  }
  
  const { label, variant } = certificationConfig[learner.certificationStatus]
  
  const TrendIcon = learner.trend === "up" 
    ? ArrowUpIcon 
    : learner.trend === "down" 
      ? ArrowDownIcon 
      : null
  
  const trendColor = learner.trend === "up" 
    ? "text-success" 
    : learner.trend === "down" 
      ? "text-warning" 
      : "text-muted-foreground"

  return (
    <tr className="hover:bg-muted/30 transition-colors">
      {/* Learner Info */}
      <td className="px-4 py-3">
        <Row gap="sm" align="center">
          <Avatar name={learner.name} size="sm" />
          <Stack gap="none" className="min-w-0">
            <Text weight="medium" className="truncate">{learner.name}</Text>
            <Text size="xs" variant="muted" className="truncate">{learner.email}</Text>
          </Stack>
        </Row>
      </td>
      
      {/* Overall Progress */}
      <td className="px-4 py-3">
        <Stack gap="xs">
          <Row gap="sm" align="center">
            <Text size="sm" weight="medium">{learner.overallProgress}%</Text>
            {TrendIcon && <TrendIcon className={`h-3 w-3 ${trendColor}`} />}
          </Row>
          <Progress value={learner.overallProgress} className="h-1.5" />
        </Stack>
      </td>
      
      {/* Competency Progress */}
      {Object.entries(learner.competencies).map(([key, value]) => (
        <td key={key} className="px-2 py-3 text-center">
          <CompetencyIndicator value={value} />
        </td>
      ))}
      
      {/* Certification Status */}
      <td className="px-4 py-3">
        <Badge variant={variant}>{label}</Badge>
      </td>
      
      {/* Last Activity */}
      <td className="px-4 py-3">
        <Text size="xs" variant="muted">{learner.lastActivity}</Text>
      </td>
    </tr>
  )
}

// -----------------------------------------------------------------------------
// Competency Indicator Component
// -----------------------------------------------------------------------------

function CompetencyIndicator({ value }: { value: number }) {
  const bgColor = value === 100 
    ? "bg-success" 
    : value > 0 
      ? "bg-primary" 
      : "bg-muted"
  
  return (
    <div className="flex justify-center">
      <div 
        className={`w-8 h-8 rounded flex items-center justify-center ${bgColor}`}
        title={`${value}%`}
      >
        {value === 100 ? (
          <CheckCircleIcon className="h-4 w-4 text-success-foreground" />
        ) : value > 0 ? (
          <Text size="xs" className="text-primary-foreground">{value}</Text>
        ) : (
          <span className="w-2 h-0.5 bg-muted-foreground/30 rounded" />
        )}
      </div>
    </div>
  )
}
