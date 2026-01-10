/**
 * CATALYST - Competency Overview Page
 *
 * Shows competency details with list of behaviours (modules).
 * Route: /learn/[competency]
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Stack, Row, Grid, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpenIcon, 
  ChevronRightIcon,
  ChevronLeftIcon,
  FileTextIcon,
} from "lucide-react"
import { getCompetencyWithModules, getLearnUser } from "@/lib/learning"
import { LearnShell } from "../_surface"

// -----------------------------------------------------------------------------
// Hardcoded competency data for sidebar (until DB provides full context)
// -----------------------------------------------------------------------------

const competenciesData = [
  {
    id: 1,
    slug: "prime-capital-identity",
    name: "Prime Capital Identity",
    description: "Who are we and what makes us different?",
    behaviours: [
      { slug: "our-story", title: "Our Story", locked: false },
      { slug: "boutique-positioning", title: "Boutique Positioning", locked: false },
      { slug: "service-model", title: "Service Model", locked: false },
      { slug: "founders-vision", title: "Founders' Vision", locked: false },
      { slug: "brand-voice", title: "Brand Voice", locked: false },
    ],
  },
  {
    id: 2,
    slug: "market-intelligence",
    name: "Market Intelligence",
    description: "Why Dubai? Why now?",
    behaviours: [
      { slug: "market-overview", title: "Market Overview", locked: true },
      { slug: "regulatory-framework", title: "Regulatory Framework", locked: true },
      { slug: "investment-landscape", title: "Investment Landscape", locked: true },
      { slug: "developer-ecosystem", title: "Developer Ecosystem", locked: true },
      { slug: "market-positioning", title: "Market Positioning", locked: true },
    ],
  },
  {
    id: 3,
    slug: "client-discovery",
    name: "Client Discovery",
    description: "Understanding client needs",
    behaviours: [
      { slug: "investor-personas", title: "Investor Personas", locked: true },
      { slug: "qualification-framework", title: "Qualification Framework", locked: true },
      { slug: "needs-assessment", title: "Needs Assessment", locked: true },
      { slug: "expectation-setting", title: "Expectation Setting", locked: true },
      { slug: "discovery-calls", title: "Discovery Calls", locked: true },
    ],
  },
  {
    id: 4,
    slug: "property-matching",
    name: "Property Matching",
    description: "Connecting clients with opportunities",
    behaviours: [
      { slug: "criteria-analysis", title: "Criteria Analysis", locked: true },
      { slug: "market-research", title: "Market Research", locked: true },
      { slug: "property-evaluation", title: "Property Evaluation", locked: true },
      { slug: "presentation-skills", title: "Presentation Skills", locked: true },
      { slug: "viewing-management", title: "Viewing Management", locked: true },
    ],
  },
  {
    id: 5,
    slug: "objection-navigation",
    name: "Objection Navigation",
    description: "Addressing concerns with expertise",
    behaviours: [
      { slug: "common-concerns", title: "Common Concerns", locked: true },
      { slug: "market-objections", title: "Market Objections", locked: true },
      { slug: "price-discussions", title: "Price Discussions", locked: true },
      { slug: "timing-concerns", title: "Timing Concerns", locked: true },
      { slug: "confidence-building", title: "Confidence Building", locked: true },
    ],
  },
  {
    id: 6,
    slug: "transaction-excellence",
    name: "Transaction Excellence",
    description: "Guiding the process",
    behaviours: [
      { slug: "offer-process", title: "Offer Process", locked: true },
      { slug: "negotiation-skills", title: "Negotiation Skills", locked: true },
      { slug: "documentation", title: "Documentation", locked: true },
      { slug: "coordination", title: "Coordination", locked: true },
      { slug: "handover", title: "Handover", locked: true },
    ],
  },
  {
    id: 7,
    slug: "relationship-building",
    name: "Relationship Building",
    description: "Creating lasting partnerships",
    behaviours: [
      { slug: "communication", title: "Communication", locked: true },
      { slug: "follow-up", title: "Follow-Up", locked: true },
      { slug: "referral-generation", title: "Referral Generation", locked: true },
      { slug: "portfolio-management", title: "Portfolio Management", locked: true },
      { slug: "long-term-value", title: "Long-Term Value", locked: true },
    ],
  },
]

// Transform data for sidebar component
function getCompetenciesForSidebar() {
  return competenciesData.map((comp) => ({
    slug: comp.slug,
    name: comp.name,
    number: comp.id,
    locked: comp.behaviours.every(b => b.locked),
    modules: comp.behaviours.map((b) => ({
      slug: b.slug,
      title: b.title,
      status: b.locked ? "locked" as const : "current" as const,
    })),
  }))
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ competency: string }>
}

export default async function CompetencyOverviewPage({ params }: PageProps) {
  const { competency: competencySlug } = await params
  
  // Get user (gracefully handle Supabase errors)
  let user = { name: "Learner", email: "", role: "learner" }
  try {
    user = await getLearnUser()
  } catch {
    // Use default user if Supabase fails
  }
  
  // Try to fetch competency from database (gracefully handle errors)
  let dbCompetency = null
  try {
    dbCompetency = await getCompetencyWithModules(competencySlug)
  } catch {
    // Fall back to hardcoded data if DB fails
  }
  
  // Fallback to hardcoded data if not in DB
  const hardcodedCompetency = competenciesData.find((c) => c.slug === competencySlug)
  
  if (!dbCompetency && !hardcodedCompetency) {
    notFound()
  }
  
  // Use DB data if available, otherwise fallback
  const competencyId = dbCompetency?.displayOrder ?? hardcodedCompetency?.id ?? 1
  const competencyName = dbCompetency?.name ?? hardcodedCompetency?.name ?? "Competency"
  const competencyDescription = dbCompetency?.description ?? hardcodedCompetency?.description ?? ""
  
  // Get modules from DB or hardcoded data
  const modules = dbCompetency?.modules ?? []
  const behaviours = hardcodedCompetency?.behaviours ?? []
  
  // Use DB modules if available, otherwise fallback to behaviours
  const displayModules = modules.length > 0 
    ? modules.map((m, index) => ({
        slug: m.slug,
        title: m.title,
        description: m.description || "",
        status: index < 4 ? "current" as const : "locked" as const,
      }))
    : behaviours.map((b, index) => ({
        slug: b.slug,
        title: b.title,
        description: "",
        status: (b.locked ? "locked" : index < 4 ? "current" : "locked") as "complete" | "current" | "locked",
      }))
  
  // Calculate progress
  const completedCount = 0 // TODO: Get from user progress
  const totalCount = displayModules.length
  
  // Get competencies for sidebar
  const competencies = getCompetenciesForSidebar()
  
  return (
    <LearnShell 
      user={user}
      showSidebar={true}
      competencies={competencies}
      currentCompetency={competencySlug}
    >
      <Stack gap="xl">
        {/* Back link */}
        <Link 
          href="/learn/course"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to Course Overview
        </Link>
        
        {/* Header */}
        <Stack gap="sm">
          <Text size="xs" className="uppercase tracking-wider text-muted-foreground">
            Competency {competencyId}
          </Text>
          <Title size="h1" className="text-3xl sm:text-4xl">
            {competencyName}
          </Title>
          {competencyDescription && (
            <Text className="text-muted-foreground italic">
              &ldquo;{competencyDescription}&rdquo;
            </Text>
          )}
        </Stack>
        
        {/* The Context */}
        <Stack gap="md">
          <Row gap="sm" align="center">
            <BookOpenIcon className="h-5 w-5 text-muted-foreground" />
            <Title size="h3">The Context</Title>
          </Row>
          
          <Stack gap="md" className="text-foreground/90 leading-relaxed">
            <Text>
              This is where every consultant&apos;s journey begins. Before you can represent 
              Prime Capital to clients, you need to deeply understand who we are, what we 
              stand for, and how we&apos;re different from every other real estate company in Dubai.
            </Text>
            
            <Text>
              Prime Capital Dubai is not just another real estate company. We are a boutique 
              advisory serving discerning international investors who expect more than 
              transactions — they expect trusted guidance.
            </Text>
            
            <Stack gap="sm">
              <Text>
                <strong>Our Positioning:</strong> Quiet luxury. We don&apos;t chase volume. We don&apos;t 
                use pressure tactics. We build relationships with sophisticated clients who value 
                expertise, discretion, and transparency.
              </Text>
              <Text>
                <strong>Our Founders:</strong> 60+ combined years of experience across Tahir 
                (client relationships, content), Shaad (developer relationships), and Rohit 
                (international markets, project development). This isn&apos;t a startup — it&apos;s 
                institutional knowledge in a boutique setting.
              </Text>
              <Text>
                <strong>Our Promise:</strong> From initial enquiry to handover and beyond, we 
                guide clients through every step. We earn trust through competence, not persuasion.
              </Text>
            </Stack>
          </Stack>
        </Stack>
        
        {/* Risk / Reward Callouts */}
        <Grid cols={2} gap="md" className="grid-cols-1 sm:grid-cols-2">
          <div className="learn-callout learn-callout--risk">
            <div className="learn-callout__label">⚠️ The Risk</div>
            <div className="learn-callout__text">
              You sound like every other agent in Dubai. Clients don&apos;t see the difference. 
              You compete on price and lose to bigger firms.
            </div>
          </div>
          <div className="learn-callout learn-callout--reward">
            <div className="learn-callout__label">✓ The Reward</div>
            <div className="learn-callout__text">
              You articulate our unique value proposition with confidence. Clients choose 
              us because they understand we&apos;re different — and you embody that difference.
            </div>
          </div>
        </Grid>
        
        {/* Key Behaviours */}
        <Stack gap="md">
          <Row gap="sm" align="center" justify="between">
            <Title size="h3">Key Behaviours ({completedCount}/{totalCount} completed)</Title>
          </Row>
          
          <Stack gap="sm">
            {displayModules.map((module, index) => (
              <BehaviourCard
                key={module.slug}
                number={index + 1}
                title={module.title}
                description={module.description}
                status={module.status}
                href={`/learn/${competencySlug}/${module.slug}`}
              />
            ))}
          </Stack>
        </Stack>
        
        {/* Toolkit */}
        <Stack gap="md">
          <Row gap="sm" align="center">
            <FileTextIcon className="h-5 w-5 text-muted-foreground" />
            <Title size="h3">Toolkit</Title>
          </Row>
          
          <Stack gap="xs">
            <ResourceLink title="Prime Capital Brand Guidelines" />
            <ResourceLink title="Founder Bios & Expertise Areas" />
            <ResourceLink title="Client Testimonials Library" />
          </Stack>
        </Stack>
      </Stack>
    </LearnShell>
  )
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

interface BehaviourCardProps {
  number: number
  title: string
  description: string
  status: "complete" | "current" | "locked"
  href: string
}

function BehaviourCard({ number, title, description, status, href }: BehaviourCardProps) {
  const isLocked = status === "locked"
  
  const content = (
    <Card 
      className={`border transition-colors ${
        isLocked 
          ? "opacity-60 cursor-not-allowed" 
          : "hover:border-foreground/20 cursor-pointer"
      }`}
    >
      <CardContent className="p-4">
        <Row align="center" gap="md">
          {/* Number */}
          <div className="flex items-center justify-center w-8 h-8 rounded bg-muted text-sm font-semibold flex-shrink-0">
            {number}
          </div>
          
          {/* Content */}
          <Stack gap="xs" className="flex-1 min-w-0">
            <Row align="center" gap="sm" className="flex-wrap">
              <Text weight="medium" className="truncate">{title}</Text>
              <Badge 
                variant={status === "locked" ? "outline" : "secondary"}
                className="text-xs uppercase"
              >
                {status === "complete" && "Complete"}
                {status === "current" && "Current"}
                {status === "locked" && "Locked"}
              </Badge>
            </Row>
            {description && (
              <Text size="sm" className="text-muted-foreground line-clamp-1">
                {description}
              </Text>
            )}
          </Stack>
          
          {/* Arrow */}
          {!isLocked && (
            <ChevronRightIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          )}
        </Row>
      </CardContent>
    </Card>
  )
  
  if (isLocked) {
    return content
  }
  
  return (
    <Link href={href}>
      {content}
    </Link>
  )
}

function ResourceLink({ title }: { title: string }) {
  return (
    <Card className="border hover:border-foreground/20 transition-colors cursor-pointer">
      <CardContent className="p-4">
        <Row align="center" justify="between">
          <Row gap="sm" align="center">
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
            <Text size="sm">{title}</Text>
          </Row>
          <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
        </Row>
      </CardContent>
    </Card>
  )
}

// -----------------------------------------------------------------------------
// Generate Static Params (for known competencies)
// -----------------------------------------------------------------------------

export async function generateStaticParams() {
  return competenciesData.map((competency) => ({
    competency: competency.slug,
  }))
}
