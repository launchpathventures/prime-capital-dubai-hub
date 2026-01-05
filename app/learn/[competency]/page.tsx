/**
 * CATALYST - Competency Page
 *
 * Lists all modules within a competency with progress tracking.
 * Dynamic route: /learn/[competency]
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Container, Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ChevronRightIcon,
  CheckCircleIcon,
  CircleIcon,
  PlayCircleIcon,
  ClockIcon,
  BookOpenIcon,
  BarChart3Icon,
  UsersIcon,
  HomeIcon,
  FileTextIcon,
  MessageSquareIcon,
  HeartHandshakeIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Competency Data (mock - would come from database)
// -----------------------------------------------------------------------------

const competencyData: Record<string, {
  name: string
  description: string
  icon: React.ElementType
  modules: Array<{
    slug: string
    title: string
    description: string
    duration: string
    status: "completed" | "in-progress" | "not-started"
  }>
}> = {
  "market-intelligence": {
    name: "Market Intelligence",
    description: "Understand Dubai's real estate landscape, regulations, and market dynamics",
    icon: BarChart3Icon,
    modules: [
      {
        slug: "dubai-real-estate-overview",
        title: "Dubai Real Estate Overview",
        description: "History, growth, and current state of the Dubai property market",
        duration: "30 min",
        status: "completed",
      },
      {
        slug: "regulatory-framework",
        title: "Regulatory Framework",
        description: "RERA, DLD, and key regulations governing property transactions",
        duration: "45 min",
        status: "completed",
      },
      {
        slug: "market-segments",
        title: "Market Segments",
        description: "Understanding off-plan, secondary, and commercial segments",
        duration: "35 min",
        status: "completed",
      },
      {
        slug: "key-developers",
        title: "Key Developers",
        description: "Major developers, their portfolios, and reputation",
        duration: "25 min",
        status: "completed",
      },
      {
        slug: "area-knowledge",
        title: "Area Knowledge",
        description: "Dubai's key areas, communities, and their characteristics",
        duration: "40 min",
        status: "completed",
      },
      {
        slug: "golden-visa",
        title: "Golden Visa & Residency",
        description: "Investment thresholds and residency benefits for property investors",
        duration: "20 min",
        status: "completed",
      },
      {
        slug: "market-trends",
        title: "Market Trends & Analysis",
        description: "How to read and interpret market data and trends",
        duration: "35 min",
        status: "completed",
      },
      {
        slug: "competitive-landscape",
        title: "Competitive Landscape",
        description: "Understanding Prime Capital's positioning and competitors",
        duration: "30 min",
        status: "completed",
      },
    ],
  },
  "client-discovery": {
    name: "Client Discovery",
    description: "Master the art of understanding client needs, goals, and preferences",
    icon: UsersIcon,
    modules: [
      {
        slug: "investor-personas",
        title: "Investor Personas",
        description: "Understanding different investor types and their motivations",
        duration: "35 min",
        status: "completed",
      },
      {
        slug: "discovery-questions",
        title: "Discovery Questions",
        description: "Crafting questions that uncover true client needs",
        duration: "40 min",
        status: "completed",
      },
      {
        slug: "active-listening",
        title: "Active Listening",
        description: "Techniques for truly understanding client communication",
        duration: "25 min",
        status: "completed",
      },
      {
        slug: "qualification-framework",
        title: "Qualification Framework",
        description: "Assessing client readiness and fit",
        duration: "30 min",
        status: "completed",
      },
      {
        slug: "understanding-investment-goals",
        title: "Understanding Investment Goals",
        description: "Identifying capital growth, yield, and lifestyle priorities",
        duration: "35 min",
        status: "in-progress",
      },
      {
        slug: "managing-expectations",
        title: "Managing Expectations",
        description: "Setting realistic expectations from the first conversation",
        duration: "25 min",
        status: "not-started",
      },
    ],
  },
  "property-matching": {
    name: "Property Matching",
    description: "Learn to identify and present properties that align with client criteria",
    icon: HomeIcon,
    modules: [
      {
        slug: "property-analysis",
        title: "Property Analysis",
        description: "Evaluating properties against client requirements",
        duration: "40 min",
        status: "not-started",
      },
      {
        slug: "yield-calculations",
        title: "Yield Calculations",
        description: "ROI, gross yield, and net yield calculations",
        duration: "35 min",
        status: "not-started",
      },
      {
        slug: "off-plan-evaluation",
        title: "Off-Plan Evaluation",
        description: "Assessing off-plan opportunities and risks",
        duration: "45 min",
        status: "not-started",
      },
      {
        slug: "secondary-market",
        title: "Secondary Market",
        description: "Evaluating resale properties and value",
        duration: "30 min",
        status: "not-started",
      },
      {
        slug: "presentation-skills",
        title: "Property Presentation",
        description: "Presenting properties professionally to clients",
        duration: "35 min",
        status: "not-started",
      },
      {
        slug: "viewings-management",
        title: "Managing Viewings",
        description: "Organizing and conducting effective property viewings",
        duration: "25 min",
        status: "not-started",
      },
      {
        slug: "comparative-analysis",
        title: "Comparative Market Analysis",
        description: "Creating compelling property comparisons",
        duration: "30 min",
        status: "not-started",
      },
    ],
  },
  "transaction-management": {
    name: "Transaction Management",
    description: "Navigate the full transaction process from offer to handover",
    icon: FileTextIcon,
    modules: [
      {
        slug: "transaction-process",
        title: "Transaction Process Overview",
        description: "End-to-end view of the Dubai property transaction",
        duration: "40 min",
        status: "not-started",
      },
      {
        slug: "offers-negotiation",
        title: "Offers & Negotiation",
        description: "Structuring offers and negotiating terms",
        duration: "45 min",
        status: "not-started",
      },
      {
        slug: "mou-process",
        title: "MOU Process",
        description: "Memorandum of Understanding requirements and process",
        duration: "30 min",
        status: "not-started",
      },
      {
        slug: "due-diligence",
        title: "Due Diligence",
        description: "Property verification and legal checks",
        duration: "35 min",
        status: "not-started",
      },
      {
        slug: "noc-transfer",
        title: "NOC & Transfer",
        description: "No Objection Certificate and title transfer process",
        duration: "30 min",
        status: "not-started",
      },
      {
        slug: "mortgage-process",
        title: "Mortgage Process",
        description: "Mortgage options and application process",
        duration: "40 min",
        status: "not-started",
      },
      {
        slug: "payment-plans",
        title: "Payment Plans",
        description: "Understanding developer payment plans",
        duration: "25 min",
        status: "not-started",
      },
      {
        slug: "handover-process",
        title: "Handover Process",
        description: "Property handover and snagging",
        duration: "30 min",
        status: "not-started",
      },
      {
        slug: "post-transaction",
        title: "Post-Transaction Support",
        description: "After-sale service and client follow-up",
        duration: "20 min",
        status: "not-started",
      },
    ],
  },
  "objection-navigation": {
    name: "Objection Navigation",
    description: "Handle investor concerns with confidence and credibility",
    icon: MessageSquareIcon,
    modules: [
      {
        slug: "common-objections",
        title: "Common Objections",
        description: "Understanding the most frequent investor concerns",
        duration: "30 min",
        status: "not-started",
      },
      {
        slug: "bubble-concerns",
        title: "Market Bubble Concerns",
        description: "Addressing fears about market overvaluation",
        duration: "35 min",
        status: "not-started",
      },
      {
        slug: "developer-delays",
        title: "Developer Delays",
        description: "Handling concerns about construction timelines",
        duration: "25 min",
        status: "not-started",
      },
      {
        slug: "hidden-fees",
        title: "Hidden Fees & Costs",
        description: "Transparency about all transaction costs",
        duration: "30 min",
        status: "not-started",
      },
      {
        slug: "objection-techniques",
        title: "Objection Handling Techniques",
        description: "Frameworks for addressing concerns professionally",
        duration: "35 min",
        status: "not-started",
      },
    ],
  },
  "relationship-stewardship": {
    name: "Relationship Stewardship",
    description: "Build lasting relationships through exceptional service and follow-up",
    icon: HeartHandshakeIcon,
    modules: [
      {
        slug: "client-communication",
        title: "Client Communication",
        description: "Professional communication standards and best practices",
        duration: "30 min",
        status: "not-started",
      },
      {
        slug: "follow-up-systems",
        title: "Follow-Up Systems",
        description: "Creating systematic client follow-up processes",
        duration: "25 min",
        status: "not-started",
      },
      {
        slug: "referral-generation",
        title: "Referral Generation",
        description: "Building a referral-based business",
        duration: "30 min",
        status: "not-started",
      },
      {
        slug: "long-term-relationships",
        title: "Long-Term Relationships",
        description: "Nurturing client relationships over time",
        duration: "25 min",
        status: "not-started",
      },
    ],
  },
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

interface PageProps {
  params: Promise<{
    competency: string
  }>
}

export default async function CompetencyPage({ params }: PageProps) {
  const { competency: competencySlug } = await params
  const competency = competencyData[competencySlug]

  if (!competency) {
    notFound()
  }

  const Icon = competency.icon
  const completedCount = competency.modules.filter((m) => m.status === "completed").length
  const progress = Math.round((completedCount / competency.modules.length) * 100)

  return (
    <Container size="lg" className="py-8">
      <Stack gap="xl">
        {/* Breadcrumb */}
        <Row gap="xs" align="center">
          <Link href="/learn">
            <Text size="sm" variant="muted" className="hover:text-foreground transition-colors">
              Learning Dashboard
            </Text>
          </Link>
          <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
          <Text size="sm">{competency.name}</Text>
        </Row>

        {/* Competency Header */}
        <Card>
          <CardContent className="pt-6">
            <Row gap="lg" align="start">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Icon className="h-8 w-8" />
              </div>
              <Stack gap="sm" className="flex-1">
                <Stack gap="xs">
                  <Title size="h2">{competency.name}</Title>
                  <Text variant="muted">{competency.description}</Text>
                </Stack>
                <Row gap="md" align="center">
                  <Row gap="xs" align="center">
                    <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
                    <Text size="sm" variant="muted">
                      {competency.modules.length} modules
                    </Text>
                  </Row>
                  <Row gap="xs" align="center">
                    <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                    <Text size="sm" variant="muted">
                      {completedCount} completed
                    </Text>
                  </Row>
                  <Row gap="xs" align="center">
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                    <Text size="sm" variant="muted">
                      ~{Math.round(competency.modules.reduce((sum, m) => sum + parseInt(m.duration), 0) / 60)} hours total
                    </Text>
                  </Row>
                </Row>
                <Stack gap="xs">
                  <Row gap="sm" align="center" justify="between">
                    <Text size="sm" variant="muted">Progress</Text>
                    <Text size="sm" weight="medium">{progress}%</Text>
                  </Row>
                  <Progress value={progress} className="h-2" />
                </Stack>
              </Stack>
            </Row>
          </CardContent>
        </Card>

        {/* Module List */}
        <Stack gap="md">
          <Title size="h4">Modules</Title>
          <Stack gap="sm">
            {competency.modules.map((module, index) => (
              <ModuleCard
                key={module.slug}
                module={module}
                competencySlug={competencySlug}
                index={index + 1}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  )
}

// -----------------------------------------------------------------------------
// Module Card Component
// -----------------------------------------------------------------------------

interface ModuleCardProps {
  module: {
    slug: string
    title: string
    description: string
    duration: string
    status: "completed" | "in-progress" | "not-started"
  }
  competencySlug: string
  index: number
}

function ModuleCard({ module, competencySlug, index }: ModuleCardProps) {
  const statusConfig = {
    completed: {
      icon: CheckCircleIcon,
      iconClass: "text-success",
      label: "Completed",
      variant: "default" as const,
    },
    "in-progress": {
      icon: PlayCircleIcon,
      iconClass: "text-primary",
      label: "In Progress",
      variant: "secondary" as const,
    },
    "not-started": {
      icon: CircleIcon,
      iconClass: "text-muted-foreground",
      label: "Not Started",
      variant: "outline" as const,
    },
  }

  const { icon: StatusIcon, iconClass, label, variant } = statusConfig[module.status]

  return (
    <Link href={`/learn/${competencySlug}/${module.slug}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="py-4">
          <Row gap="md" align="center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground">
              <Text size="sm" weight="medium">{index}</Text>
            </div>
            <StatusIcon className={`h-5 w-5 ${iconClass}`} />
            <Stack gap="none" className="flex-1 min-w-0">
              <Text weight="medium">{module.title}</Text>
              <Text size="sm" variant="muted" className="truncate">
                {module.description}
              </Text>
            </Stack>
            <Row gap="sm" align="center" className="shrink-0">
              <Badge variant={variant}>{label}</Badge>
              <Row gap="xs" align="center">
                <ClockIcon className="h-3 w-3 text-muted-foreground" />
                <Text size="xs" variant="muted">{module.duration}</Text>
              </Row>
              <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
            </Row>
          </Row>
        </CardContent>
      </Card>
    </Link>
  )
}

// -----------------------------------------------------------------------------
// Generate Static Params
// -----------------------------------------------------------------------------

export async function generateStaticParams() {
  return Object.keys(competencyData).map((competency) => ({
    competency,
  }))
}
