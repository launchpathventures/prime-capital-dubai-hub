/**
 * CATALYST - Competency Page
 *
 * Displays competency overview with sidebar navigation matching the design.
 * Dynamic route: /learn/[competency]
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Stack, Row, Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  CircleIcon,
  LockIcon,
  BookOpenIcon,
  AlertTriangleIcon,
  CheckIcon,
  FileTextIcon,
  TargetIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Competency Data (mock - would come from database)
// -----------------------------------------------------------------------------

interface Behaviour {
  slug: string
  title: string
  description: string
  status: "completed" | "current" | "locked"
}

interface Competency {
  id: number
  name: string
  subtitle: string
  quote: string
  behaviours: Behaviour[]
  context: {
    intro: string
    paragraphs: string[]
  }
  riskReward: {
    risk: string
    reward: string
  }
  toolkit: Array<{
    title: string
    slug: string
  }>
}

const allCompetencies: Array<{
  id: number
  slug: string
  name: string
  behaviourCount: number
  status: "active" | "coming-soon"
}> = [
  { id: 1, slug: "prime-capital-identity", name: "Prime Capital Identity", behaviourCount: 5, status: "active" },
  { id: 2, slug: "market-intelligence", name: "Market Intelligence", behaviourCount: 5, status: "coming-soon" },
  { id: 3, slug: "client-discovery", name: "Client Discovery", behaviourCount: 5, status: "coming-soon" },
  { id: 4, slug: "property-matching", name: "Property Matching", behaviourCount: 5, status: "coming-soon" },
  { id: 5, slug: "objection-navigation", name: "Objection Navigation", behaviourCount: 5, status: "coming-soon" },
  { id: 6, slug: "transaction-management", name: "Transaction Management", behaviourCount: 5, status: "coming-soon" },
  { id: 7, slug: "relationship-stewardship", name: "Relationship Stewardship", behaviourCount: 5, status: "coming-soon" },
]

const competencyData: Record<string, Competency> = {
  "prime-capital-identity": {
    id: 1,
    name: "Prime Capital Identity",
    subtitle: '"Who are we and what makes us different?"',
    quote: "",
    behaviours: [
      {
        slug: "our-story",
        title: "Articulates the Prime Capital story",
        description: "Explains our founding, our journey, and why we exist",
        status: "current",
      },
      {
        slug: "boutique-positioning",
        title: "Embodies boutique positioning",
        description: "Demonstrates 'quiet luxury' — expertise without arrogance",
        status: "current",
      },
      {
        slug: "service-model",
        title: "Explains our service model",
        description: "Articulates how we serve clients differently than competitors",
        status: "current",
      },
      {
        slug: "founders-vision",
        title: "Represents the founders' vision",
        description: "Understands and communicates Tahir, Shaad, and Rohit's combined expertise",
        status: "current",
      },
      {
        slug: "brand-voice",
        title: "Demonstrates brand voice",
        description: "Communicates with authority, discretion, and calm confidence",
        status: "locked",
      },
    ],
    context: {
      intro: "This is where every consultant's journey begins. Before you can represent Prime Capital to clients, you need to deeply understand who we are, what we stand for, and how we're different from every other real estate company in Dubai.",
      paragraphs: [
        "Prime Capital Dubai is not just another real estate company. We are a boutique advisory serving discerning international investors who expect more than transactions — they expect trusted guidance.",
        "**Our Positioning:** Quiet luxury. We don't chase volume. We don't use pressure tactics. We build relationships with sophisticated clients who value expertise, discretion, and transparency.",
        "**Our Founders:** 60+ combined years of experience across Tahir (client relationships, content), Shaad (developer relationships, off-plan), and Rohit (international markets, project development). This isn't a startup — it's institutional knowledge in a boutique setting.",
        "**Our Promise:** From initial enquiry to handover and beyond, we guide clients through every step. We earn trust through competence, not persuasion.",
      ],
    },
    riskReward: {
      risk: "You sound like every other agent in Dubai. Clients don't see the difference. You compete on price and lose to bigger firms.",
      reward: "You articulate our unique value proposition with confidence. Clients choose us because they understand we're different — and you embody that difference.",
    },
    toolkit: [
      { title: "Prime Capital Brand Guidelines", slug: "brand-guidelines" },
      { title: "Founder Bios & Expertise Areas", slug: "founder-bios" },
      { title: "Client Testimonials Library", slug: "testimonials" },
    ],
  },
  "market-intelligence": {
    id: 2,
    name: "Market Intelligence",
    subtitle: '"Understanding the Dubai real estate landscape"',
    quote: "",
    behaviours: [
      {
        slug: "market-overview",
        title: "Explains Dubai market fundamentals",
        description: "Demonstrates knowledge of market history, trends, and dynamics",
        status: "locked",
      },
      {
        slug: "regulatory-knowledge",
        title: "Navigates regulatory framework",
        description: "Understands RERA, DLD, and compliance requirements",
        status: "locked",
      },
      {
        slug: "area-expertise",
        title: "Shows area expertise",
        description: "Knows Dubai communities, developments, and investment potential",
        status: "locked",
      },
      {
        slug: "developer-knowledge",
        title: "Evaluates developers",
        description: "Assesses developer reputation, track record, and reliability",
        status: "locked",
      },
      {
        slug: "market-analysis",
        title: "Analyzes market data",
        description: "Interprets trends, yields, and investment indicators",
        status: "locked",
      },
    ],
    context: {
      intro: "Understanding Dubai's real estate market is fundamental to advising clients effectively.",
      paragraphs: [
        "Dubai's property market is dynamic and evolving. To serve sophisticated investors, you must demonstrate deep market knowledge.",
      ],
    },
    riskReward: {
      risk: "You can't answer basic market questions. Clients lose confidence in your expertise.",
      reward: "You demonstrate authoritative market knowledge. Clients trust your recommendations.",
    },
    toolkit: [
      { title: "Dubai Market Overview", slug: "market-overview" },
      { title: "Area Guides", slug: "area-guides" },
    ],
  },
}

// Default competency for unknown slugs
const defaultCompetency: Competency = {
  id: 0,
  name: "Coming Soon",
  subtitle: "This competency is under development",
  quote: "",
  behaviours: [],
  context: {
    intro: "This competency is coming soon.",
    paragraphs: [],
  },
  riskReward: {
    risk: "",
    reward: "",
  },
  toolkit: [],
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
  const competency = competencyData[competencySlug] || defaultCompetency
  
  // For coming soon competencies, show a placeholder
  if (!competencyData[competencySlug]) {
    const found = allCompetencies.find(c => c.slug === competencySlug)
    if (!found) {
      notFound()
    }
  }

  const currentCompetencyIndex = allCompetencies.findIndex(c => c.slug === competencySlug)
  const completedBehaviours = competency.behaviours.filter(b => b.status === "completed").length
  const totalBehaviours = competency.behaviours.length

  return (
    <div className="flex min-h-screen bg-[#F2EFEA]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#576C75] text-white flex-shrink-0 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <Text size="xs" className="text-white/60 uppercase tracking-wider mb-3">
            Consultant Training
          </Text>
          <Link 
            href="/learn" 
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Exit to Course Overview
          </Link>
        </div>

        {/* Competency Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {allCompetencies.map((comp, index) => {
            const isActive = comp.slug === competencySlug
            const isExpanded = isActive
            const compData = competencyData[comp.slug]
            
            return (
              <div key={comp.slug}>
                {/* Competency Item */}
                <Link
                  href={`/learn/${comp.slug}`}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                    isActive 
                      ? "bg-white/10" 
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className={`flex items-center justify-center w-6 h-6 rounded text-xs font-medium flex-shrink-0 ${
                    isActive ? "bg-white text-[#576C75]" : "bg-white/20 text-white"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Text size="sm" className="text-white truncate">
                        {comp.name}
                      </Text>
                      {isExpanded && <ChevronDownIcon className="h-4 w-4 text-white/60 flex-shrink-0" />}
                    </div>
                    <Text size="xs" className="text-white/60">
                      {completedBehaviours}/{comp.behaviourCount} behaviours
                    </Text>
                  </div>
                </Link>

                {/* Expanded Behaviours */}
                {isExpanded && compData && (
                  <div className="pl-12 pr-4 pb-2">
                    {compData.behaviours.map((behaviour) => (
                      <Link
                        key={behaviour.slug}
                        href={`/learn/${comp.slug}/${behaviour.slug}`}
                        className="flex items-center gap-2 py-2 text-sm text-white/70 hover:text-white transition-colors"
                      >
                        {behaviour.status === "completed" ? (
                          <CheckCircleIcon className="h-4 w-4 text-white/60" />
                        ) : behaviour.status === "current" ? (
                          <CircleIcon className="h-4 w-4 text-white/60" />
                        ) : (
                          <LockIcon className="h-3 w-3 text-white/40" />
                        )}
                        <span className={behaviour.status === "locked" ? "text-white/40" : ""}>
                          {behaviour.title.split(" ").slice(0, 2).join(" ")}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Coming Soon Badge */}
                {comp.status === "coming-soon" && !isActive && (
                  <div className="px-4 pb-2 pl-12">
                    <Badge className="bg-white/10 text-white/60 text-[10px] border-0">
                      <LockIcon className="h-3 w-3 mr-1" />
                      COMING SOON
                    </Badge>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex justify-between items-center text-sm">
            <Text size="xs" className="text-white/60 uppercase tracking-wider">
              Overall Progress
            </Text>
            <Text size="xs" className="text-white/80">
              {completedBehaviours} / 35
            </Text>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-12">
          {/* Competency Header */}
          <Stack gap="sm" className="mb-8">
            <Text size="xs" className="text-[#576C75] uppercase tracking-wider">
              Competency {currentCompetencyIndex + 1}
            </Text>
            <h1 className="font-headline text-4xl text-[#3F4142]">
              {competency.name}
            </h1>
            {competency.subtitle && (
              <Text className="text-[#576C75] italic text-lg">
                {competency.subtitle}
              </Text>
            )}
          </Stack>

          {/* The Context Section */}
          <Stack gap="md" className="mb-10">
            <Row gap="sm" align="center">
              <BookOpenIcon className="h-5 w-5 text-[#576C75]" />
              <h2 className="font-headline text-xl text-[#3F4142]">The Context</h2>
            </Row>
            <div className="prose prose-sm max-w-none text-[#3F4142]">
              <p>{competency.context.intro}</p>
              {competency.context.paragraphs.map((para, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              ))}
            </div>
          </Stack>

          {/* Risk/Reward Cards */}
          {competency.riskReward.risk && (
            <div className="grid grid-cols-2 gap-4 mb-10">
              <Card className="bg-[#FEF3F2] border-[#FEE4E2] rounded-[2px]">
                <CardContent className="p-5">
                  <Row gap="xs" align="center" className="mb-3">
                    <AlertTriangleIcon className="h-4 w-4 text-[#D92D20]" />
                    <Text size="xs" weight="semibold" className="text-[#D92D20] uppercase tracking-wider">
                      The Risk
                    </Text>
                  </Row>
                  <Text size="sm" className="text-[#3F4142]">
                    {competency.riskReward.risk}
                  </Text>
                </CardContent>
              </Card>
              <Card className="bg-[#ECFDF3] border-[#D1FADF] rounded-[2px]">
                <CardContent className="p-5">
                  <Row gap="xs" align="center" className="mb-3">
                    <CheckIcon className="h-4 w-4 text-[#039855]" />
                    <Text size="xs" weight="semibold" className="text-[#039855] uppercase tracking-wider">
                      The Reward
                    </Text>
                  </Row>
                  <Text size="sm" className="text-[#3F4142]">
                    {competency.riskReward.reward}
                  </Text>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Key Behaviours Section */}
          {competency.behaviours.length > 0 && (
            <Stack gap="md" className="mb-10">
              <Row gap="sm" align="center">
                <TargetIcon className="h-5 w-5 text-[#576C75]" />
                <h2 className="font-headline text-xl text-[#3F4142]">
                  Key Behaviours ({completedBehaviours}/{totalBehaviours} completed)
                </h2>
              </Row>
              <Stack gap="sm">
                {competency.behaviours.map((behaviour, index) => (
                  <BehaviourCard
                    key={behaviour.slug}
                    behaviour={behaviour}
                    competencySlug={competencySlug}
                    index={index + 1}
                  />
                ))}
              </Stack>
            </Stack>
          )}

          {/* Toolkit Section */}
          {competency.toolkit.length > 0 && (
            <Stack gap="md">
              <Row gap="sm" align="center">
                <FileTextIcon className="h-5 w-5 text-[#576C75]" />
                <h2 className="font-headline text-xl text-[#3F4142]">Toolkit</h2>
              </Row>
              <Stack gap="xs">
                {competency.toolkit.map((item) => (
                  <Card key={item.slug} className="bg-white border-[#E5E2DD] rounded-[2px] hover:border-[#576C75]/30 transition-colors cursor-pointer">
                    <CardContent className="py-4 px-5">
                      <Row gap="sm" align="center">
                        <FileTextIcon className="h-4 w-4 text-[#576C75]" />
                        <Text className="text-[#3F4142]">{item.title}</Text>
                      </Row>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Stack>
          )}
        </div>
      </main>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Behaviour Card Component
// -----------------------------------------------------------------------------

interface BehaviourCardProps {
  behaviour: Behaviour
  competencySlug: string
  index: number
}

function BehaviourCard({ behaviour, competencySlug, index }: BehaviourCardProps) {
  const isLocked = behaviour.status === "locked"
  
  const content = (
    <Card className={`bg-white border-[#E5E2DD] rounded-[2px] ${!isLocked ? "hover:border-[#576C75]/30 transition-colors cursor-pointer" : "opacity-60"}`}>
      <CardContent className="py-4 px-5">
        <Row gap="md" align="center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            behaviour.status === "completed" 
              ? "bg-[#039855] text-white" 
              : behaviour.status === "current"
                ? "bg-[#576C75] text-white"
                : "bg-[#E5E2DD] text-[#576C75]"
          }`}>
            {index}
          </div>
          <Stack gap="none" className="flex-1">
            <Row gap="sm" align="center">
              <Text weight="medium" className="text-[#3F4142]">
                {behaviour.title}
              </Text>
              {behaviour.status === "current" && (
                <Badge className="bg-[#3F4142] text-white text-[10px] rounded-[2px]">
                  CURRENT
                </Badge>
              )}
              {behaviour.status === "locked" && (
                <Badge className="bg-[#E5E2DD] text-[#576C75] text-[10px] rounded-[2px]">
                  <LockIcon className="h-3 w-3 mr-1" />
                  LOCKED
                </Badge>
              )}
            </Row>
            <Text size="sm" className="text-[#576C75]">
              {behaviour.description}
            </Text>
          </Stack>
          {!isLocked && (
            <ChevronRightIcon className="h-5 w-5 text-[#576C75]" />
          )}
        </Row>
      </CardContent>
    </Card>
  )

  if (isLocked) {
    return content
  }

  return (
    <Link href={`/learn/${competencySlug}/${behaviour.slug}`}>
      {content}
    </Link>
  )
}

// -----------------------------------------------------------------------------
// Generate Static Params
// -----------------------------------------------------------------------------

export async function generateStaticParams() {
  return allCompetencies.map((competency) => ({
    competency: competency.slug,
  }))
}
