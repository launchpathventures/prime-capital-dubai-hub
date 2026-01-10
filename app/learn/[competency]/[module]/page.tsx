/**
 * CATALYST - Behaviour Content Page
 *
 * Displays learning behaviour content with sidebar navigation.
 * Dynamic route: /learn/[competency]/[module]
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LearnShell } from "../../_surface"
import { getLearnUser } from "@/lib/learning"
import { ChevronRightIcon, BookOpenIcon } from "lucide-react"

// -----------------------------------------------------------------------------
// Competency Data
// -----------------------------------------------------------------------------

const competenciesData = [
  {
    id: 1,
    slug: "prime-capital-identity",
    name: "Prime Capital Identity",
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

// Mock content data - in production this would come from CMS/database
const behaviourContent: Record<string, Record<string, {
  title: string
  subtitle: string
  content: React.ReactNode
}>> = {
  "prime-capital-identity": {
    "our-story": {
      title: "Articulates the Prime Capital Story",
      subtitle: "Can clearly explain who Prime Capital is, how we started, and what we stand for in a way that resonates with sophisticated investors.",
      content: (
        <>
          <div className="space-y-6">
            <div>
              <Title size="h3" className="mb-3">The Context</Title>
              <Text className="leading-relaxed">
                This is where every consultant's journey begins. Before you can represent Prime Capital to clients, you need to deeply understand who we are, what we stand for, and how we're different from every other real estate company in Dubai.
              </Text>
              <Text className="leading-relaxed mt-4">
                Prime Capital Dubai is not just another real estate company. We are a boutique advisory serving discerning international investors who expect more than transactions — they expect trusted guidance.
              </Text>
            </div>

            <div>
              <Title size="h4" className="mb-3">Our Positioning</Title>
              <Text className="leading-relaxed">
                Quiet luxury. We don't chase volume. We don't use pressure tactics. We build relationships with sophisticated clients who value expertise, discretion, and transparency.
              </Text>
            </div>

            <div>
              <Title size="h4" className="mb-3">Our Founders</Title>
              <Text className="leading-relaxed">
                60+ combined years of experience across Tahir (client relationships, content), Shaad (developer relationships), and Rohit (international markets, project development). This isn't a startup — it's institutional knowledge in a boutique setting.
              </Text>
            </div>

            <div>
              <Title size="h4" className="mb-3">Our Promise</Title>
              <Text className="leading-relaxed">
                From initial enquiry to handover and beyond, we guide clients through every step. We earn trust through competence, not persuasion.
              </Text>
            </div>

            {/* Risk/Reward Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <Badge variant="destructive" className="mb-3">THE RISK</Badge>
                  <Text size="sm">
                    You sound like every other agent in Dubai. Clients don't see the difference. You compete on price and lose to bigger firms.
                  </Text>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <Badge className="mb-3 bg-green-600">THE REWARD</Badge>
                  <Text size="sm">
                    Client immediately grasps our unique positioning and feels they've found something special. They choose us because they understand we're different — and you embody that difference.
                  </Text>
                </CardContent>
              </Card>
            </div>

            {/* Founder Profiles */}
            <div>
              <Title size="h3" className="mb-4">Our Founders</Title>
              <Stack gap="md">
                <Card>
                  <CardContent className="pt-6">
                    <Row gap="md" align="start">
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                        TM
                      </div>
                      <Stack gap="xs">
                        <Text weight="semibold" size="lg">Tahir Majitha</Text>
                        <Text size="sm">20+ years experience: UHNW client relationships, real estate portfolio management, YouTube/social media presence</Text>
                        <Text size="sm" weight="medium" className="text-primary">Focus: Client trust & content</Text>
                      </Stack>
                    </Row>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <Row gap="md" align="start">
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                        SH
                      </div>
                      <Stack gap="xs">
                        <Text weight="semibold" size="lg">Shaad Haji</Text>
                        <Text size="sm">20+ years experience: Developer relationships (Ellington, DAMAC, CBRE), off-plan sales, project management</Text>
                        <Text size="sm" weight="medium" className="text-primary">Focus: Developer partnerships</Text>
                      </Stack>
                    </Row>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <Row gap="md" align="start">
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                        RS
                      </div>
                      <Stack gap="xs">
                        <Text weight="semibold" size="lg">Rohit Saluja</Text>
                        <Text size="sm">20+ years experience: International markets (UK, China, India), project development, new-age marketing</Text>
                        <Text size="sm" weight="medium" className="text-primary">Focus: Global reach</Text>
                      </Stack>
                    </Row>
                  </CardContent>
                </Card>
              </Stack>
            </div>

            {/* Brand Values */}
            <div>
              <Title size="h3" className="mb-4">Brand Values</Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <Text weight="semibold" className="mb-2">AUTHORITATIVE</Text>
                    <Text size="sm" variant="muted">We know this market deeply. Our founders have 60+ years combined experience.</Text>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <Text weight="semibold" className="mb-2">DISCREET</Text>
                    <Text size="sm" variant="muted">We protect client privacy. No flashy social media posts about deals.</Text>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <Text weight="semibold" className="mb-2">TRANSPARENT</Text>
                    <Text size="sm" variant="muted">No hidden agendas. We tell clients what they need to hear, not what they want to hear.</Text>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <Text weight="semibold" className="mb-2">CALM</Text>
                    <Text size="sm" variant="muted">No pressure tactics. No flashy urgency. Sophisticated investors don't respond to that.</Text>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </>
      ),
    },
  },
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

interface PageProps {
  params: Promise<{
    competency: string
    module: string
  }>
}

export default async function BehaviourPage({ params }: PageProps) {
  const { competency: competencySlug, module: behaviourSlug } = await params
  const user = await getLearnUser()

  const competency = competenciesData.find((c) => c.slug === competencySlug)
  if (!competency) {
    notFound()
  }

  const behaviour = competency.behaviours.find((b) => b.slug === behaviourSlug)
  if (!behaviour || behaviour.locked) {
    notFound()
  }

  const content = behaviourContent[competencySlug]?.[behaviourSlug]
  if (!content) {
    notFound()
  }

  const competencies = getCompetenciesForSidebar()

  return (
    <LearnShell 
      user={user}
      showSidebar={true}
      competencies={competencies}
      currentCompetency={competencySlug}
      currentModule={behaviourSlug}
    >
      <Stack gap="xl">
        {/* Breadcrumb */}
        <Row gap="xs" align="center" className="text-sm">
          <Link href="/learn/course" className="text-muted-foreground hover:text-foreground">
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
          <Text size="sm" variant="muted">BACK TO COMPETENCY OVERVIEW</Text>
        </Row>

        {/* Header */}
        <Stack gap="sm">
          <Text size="sm" variant="muted" className="uppercase tracking-wider">
            Competency {competency.id}
          </Text>
          <Title size="h1">{content.title}</Title>
          <Text size="lg" className="italic text-muted-foreground">
            "{content.subtitle}"
          </Text>
        </Stack>

        {/* Content */}
        <Card>
          <CardContent className="pt-8 pb-8">
            {content.content}
          </CardContent>
        </Card>

        {/* Knowledge Check CTA */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6 pb-6 text-center">
            <Stack gap="md">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <BookOpenIcon className="h-6 w-6 text-primary" />
              </div>
              <Stack gap="sm">
                <Text weight="semibold" size="lg">Ready to test your knowledge?</Text>
                <Text size="sm" variant="muted">
                  Complete a short quiz to demonstrate your understanding of this behaviour.
                </Text>
              </Stack>
              <div>
                <Button size="lg" nativeButton={false} render={<Link href={`/learn/quiz/${competencySlug}-${behaviourSlug}`} />}>
                  CONTINUE TO KNOWLEDGE CHECK
                  <ChevronRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </LearnShell>
  )
}

// -----------------------------------------------------------------------------
// Generate Static Params
// -----------------------------------------------------------------------------

export async function generateStaticParams() {
  const params: { competency: string; module: string }[] = []

  for (const competency of competenciesData) {
    for (const behaviour of competency.behaviours) {
      if (!behaviour.locked) {
        params.push({
          competency: competency.slug,
          module: behaviour.slug,
        })
      }
    }
  }

  return params
}
