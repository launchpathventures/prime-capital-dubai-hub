/**
 * CATALYST - Module/Behaviour Content Page
 *
 * Displays learning content with sidebar navigation matching the design.
 * Dynamic route: /learn/[competency]/[module]
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Stack, Row, Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  CircleIcon,
  LockIcon,
  AlertTriangleIcon,
  CheckIcon,
  FileTextIcon,
  UsersIcon,
  HeartIcon,
  ChevronRightIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Data Types and Mock Data
// -----------------------------------------------------------------------------

interface Founder {
  initials: string
  name: string
  experience: string
  focus: string
}

interface BrandValue {
  title: string
  description: string
}

interface ProcessStep {
  number: number
  title: string
  description: string
  quote: string
}

interface Resource {
  title: string
  slug: string
}

interface ModuleContent {
  title: string
  subtitle: string
  description: string
  riskReward: {
    risk: string
    reward: string
  }
  founders?: Founder[]
  brandValues?: BrandValue[]
  processSteps?: ProcessStep[]
  resources: Resource[]
}

// All competencies for sidebar
const allCompetencies = [
  { id: 1, slug: "prime-capital-identity", name: "Prime Capital Identity", behaviourCount: 5, status: "active" as const },
  { id: 2, slug: "market-intelligence", name: "Market Intelligence", behaviourCount: 5, status: "coming-soon" as const },
  { id: 3, slug: "client-discovery", name: "Client Discovery", behaviourCount: 5, status: "coming-soon" as const },
  { id: 4, slug: "property-matching", name: "Property Matching", behaviourCount: 5, status: "coming-soon" as const },
  { id: 5, slug: "objection-navigation", name: "Objection Navigation", behaviourCount: 5, status: "coming-soon" as const },
  { id: 6, slug: "transaction-management", name: "Transaction Management", behaviourCount: 5, status: "coming-soon" as const },
  { id: 7, slug: "relationship-stewardship", name: "Relationship Stewardship", behaviourCount: 5, status: "coming-soon" as const },
]

// Behaviours for sidebar navigation
const behavioursList = [
  { slug: "our-story", title: "Our Story", status: "current" as const },
  { slug: "boutique-positioning", title: "Boutique Positioning", status: "current" as const },
  { slug: "service-model", title: "Service Model", status: "current" as const },
  { slug: "founders-vision", title: "Founders' Vision", status: "current" as const },
  { slug: "brand-voice", title: "Brand Voice", status: "locked" as const },
]

// Module content data
const moduleContentData: Record<string, Record<string, ModuleContent>> = {
  "prime-capital-identity": {
    "our-story": {
      title: "Articulates the Prime Capital Story",
      subtitle: "KEY BEHAVIOUR 1.1",
      description: "Can clearly explain who Prime Capital is, how we started, and what we stand for in a way that resonates with sophisticated investors.",
      riskReward: {
        risk: "You give a generic description that sounds like any agency. Client doesn't understand why we're different.",
        reward: "Client immediately grasps our unique positioning and feels they've found something special.",
      },
      founders: [
        {
          initials: "TM",
          name: "Tahir Majithia",
          experience: "20+ years experience: UHNW client relationships, real estate portfolio management, YouTube/social media presence",
          focus: "Client trust & content",
        },
        {
          initials: "SH",
          name: "Shaad Haji",
          experience: "20+ years experience: Developer relationships (Ellington, DAMAC, CBRE), off-plan sales, project management",
          focus: "Developer partnerships",
        },
        {
          initials: "RS",
          name: "Rohit Saluja",
          experience: "20+ years experience: International markets (UK, China, India), project development, new-age marketing",
          focus: "Global reach",
        },
      ],
      brandValues: [
        { title: "AUTHORITATIVE", description: "We know this market deeply. Our founders have 60+ years combined experience." },
        { title: "DISCREET", description: "We protect client privacy. No flashy social media posts about deals." },
        { title: "TRANSPARENT", description: "No hidden agendas. We tell clients what they need to hear, not what they want to hear." },
        { title: "CALM", description: "No pressure tactics. No artificial urgency. Sophisticated investors don't respond to that." },
      ],
      processSteps: [
        {
          number: 1,
          title: "Know the Origin Story",
          description: "Understand how Prime Capital was founded and what gap in the market it was created to fill.",
          quote: '"Prime Capital was founded by three partners who saw a gap: there was no truly client-first boutique serving international investors who wanted expertise without the sales pressure."',
        },
        {
          number: 2,
          title: "Articulate the Combined Expertise",
          description: "Be able to explain what each founder brings and how it creates a unique combination.",
          quote: '"Our founders bring 60+ years combined experience — Tahir in client relationships, Shaad in developer networks, and Rohit in international markets. You get institutional knowledge in a boutique setting."',
        },
        {
          number: 3,
          title: "Connect to Client Benefit",
          description: "Always tie the story back to what it means for the client.",
          quote: '"What this means for you is access to off-market opportunities, honest guidance, and a team that genuinely doesn\'t need your business — we work with clients we believe in."',
        },
      ],
      resources: [
        { title: "Prime Capital Origin Story", slug: "origin-story" },
        { title: "Founder Biography Document", slug: "founder-bios" },
        { title: "Brand Values One-Pager", slug: "brand-values" },
      ],
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

export default async function ModulePage({ params }: PageProps) {
  const { competency: competencySlug, module: moduleSlug } = await params
  
  const competencyContent = moduleContentData[competencySlug]
  if (!competencyContent) {
    notFound()
  }
  
  const moduleData = competencyContent[moduleSlug]
  if (!moduleData) {
    notFound()
  }

  const currentBehaviourIndex = behavioursList.findIndex(b => b.slug === moduleSlug)

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
                      0/{comp.behaviourCount} behaviours
                    </Text>
                  </div>
                </Link>

                {/* Expanded Behaviours */}
                {isExpanded && (
                  <div className="pl-12 pr-4 pb-2">
                    {behavioursList.map((behaviour) => {
                      const isCurrent = behaviour.slug === moduleSlug
                      return (
                        <Link
                          key={behaviour.slug}
                          href={`/learn/${comp.slug}/${behaviour.slug}`}
                          className={`flex items-center gap-2 py-2 text-sm transition-colors ${
                            isCurrent 
                              ? "text-white bg-white/10 -mx-2 px-2 rounded" 
                              : "text-white/70 hover:text-white"
                          }`}
                        >
                          {behaviour.status === "locked" ? (
                            <LockIcon className="h-3 w-3 text-white/40" />
                          ) : (
                            <CircleIcon className="h-4 w-4 text-white/60" />
                          )}
                          <span className={behaviour.status === "locked" ? "text-white/40" : ""}>
                            {behaviour.title}
                          </span>
                        </Link>
                      )
                    })}
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
              0 / 35
            </Text>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-12">
          {/* Back Link */}
          <Link 
            href={`/learn/${competencySlug}`}
            className="inline-flex items-center gap-2 text-[#576C75] hover:text-[#3F4142] transition-colors mb-8 text-sm uppercase tracking-wider"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Competency Overview
          </Link>

          {/* Module Header */}
          <Stack gap="sm" className="mb-8">
            <Text size="xs" className="text-[#576C75] uppercase tracking-wider">
              {moduleData.subtitle}
            </Text>
            <h1 className="font-headline text-3xl text-[#3F4142]">
              {moduleData.title}
            </h1>
            <Text className="text-[#576C75] text-lg">
              {moduleData.description}
            </Text>
          </Stack>

          {/* Risk/Reward Cards */}
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
                  {moduleData.riskReward.risk}
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
                  {moduleData.riskReward.reward}
                </Text>
              </CardContent>
            </Card>
          </div>

          {/* Our Founders Section */}
          {moduleData.founders && (
            <Stack gap="md" className="mb-10">
              <Row gap="sm" align="center">
                <UsersIcon className="h-5 w-5 text-[#576C75]" />
                <h2 className="font-headline text-xl text-[#3F4142]">Our Founders</h2>
              </Row>
              <Stack gap="sm">
                {moduleData.founders.map((founder) => (
                  <Card key={founder.initials} className="bg-white border-[#E5E2DD] rounded-[2px]">
                    <CardContent className="p-5">
                      <Row gap="md" align="start">
                        <div className="w-12 h-12 rounded-full bg-[#576C75] text-white flex items-center justify-center font-semibold flex-shrink-0">
                          {founder.initials}
                        </div>
                        <Stack gap="xs" className="flex-1">
                          <Text weight="semibold" className="text-[#3F4142]">
                            {founder.name}
                          </Text>
                          <Text size="sm" className="text-[#576C75]">
                            <strong>{founder.experience.split(":")[0]}:</strong>
                            {founder.experience.split(":")[1]}
                          </Text>
                          <Text size="sm" className="text-[#576C75]">
                            <strong>Focus:</strong> {founder.focus}
                          </Text>
                        </Stack>
                      </Row>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Stack>
          )}

          {/* Brand Values Section */}
          {moduleData.brandValues && (
            <Stack gap="md" className="mb-10">
              <Row gap="sm" align="center">
                <HeartIcon className="h-5 w-5 text-[#576C75]" />
                <h2 className="font-headline text-xl text-[#3F4142]">Brand Values</h2>
              </Row>
              <div className="grid grid-cols-2 gap-4">
                {moduleData.brandValues.map((value) => (
                  <Card key={value.title} className="bg-white border-[#E5E2DD] rounded-[2px]">
                    <CardContent className="p-5">
                      <Text size="xs" weight="semibold" className="text-[#576C75] uppercase tracking-wider mb-2">
                        {value.title}
                      </Text>
                      <Text size="sm" className="text-[#3F4142] italic">
                        {value.description}
                      </Text>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Stack>
          )}

          {/* Process Model Section */}
          {moduleData.processSteps && (
            <Stack gap="md" className="mb-10">
              <Row gap="sm" align="center">
                <svg className="h-5 w-5 text-[#576C75]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <h2 className="font-headline text-xl text-[#3F4142]">The Process Model</h2>
              </Row>
              <Stack gap="md">
                {moduleData.processSteps.map((step) => (
                  <Card key={step.number} className="bg-white border-[#E5E2DD] rounded-[2px]">
                    <CardContent className="p-5">
                      <Row gap="md" align="start">
                        <div className="w-8 h-8 rounded-full bg-[#576C75] text-white flex items-center justify-center font-semibold flex-shrink-0 text-sm">
                          {step.number}
                        </div>
                        <Stack gap="sm" className="flex-1">
                          <Text weight="semibold" className="text-[#3F4142]">
                            {step.title}
                          </Text>
                          <Text size="sm" className="text-[#576C75]">
                            {step.description}
                          </Text>
                          <div className="border-l-4 border-[#576C75]/30 pl-4 mt-2">
                            <Text size="sm" className="text-[#3F4142] italic">
                              {step.quote}
                            </Text>
                          </div>
                        </Stack>
                      </Row>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Stack>
          )}

          {/* Resources Section */}
          {moduleData.resources.length > 0 && (
            <Stack gap="md" className="mb-10">
              <Row gap="sm" align="center">
                <FileTextIcon className="h-5 w-5 text-[#576C75]" />
                <h2 className="font-headline text-xl text-[#3F4142]">Resources</h2>
              </Row>
              <Stack gap="xs">
                {moduleData.resources.map((resource) => (
                  <Card key={resource.slug} className="bg-white border-[#E5E2DD] rounded-[2px] hover:border-[#576C75]/30 transition-colors cursor-pointer">
                    <CardContent className="py-4 px-5">
                      <Row gap="sm" align="center">
                        <FileTextIcon className="h-4 w-4 text-[#576C75]" />
                        <Text className="text-[#3F4142]">{resource.title}</Text>
                      </Row>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Stack>
          )}

          {/* Continue to Knowledge Check CTA */}
          <div className="flex justify-center pt-4">
            <Button
              nativeButton={false}
              render={<Link href={`/learn/quiz/${competencySlug}-${moduleSlug}`} />}
              className="bg-[#576C75] hover:bg-[#4a5d65] text-white rounded-[2px] gap-2 px-8 uppercase tracking-wider"
            >
              Continue to Knowledge Check
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Generate Static Params
// -----------------------------------------------------------------------------

export async function generateStaticParams() {
  const params: { competency: string; module: string }[] = []
  
  for (const [competency, modules] of Object.entries(moduleContentData)) {
    for (const moduleSlug of Object.keys(modules)) {
      params.push({ competency, module: moduleSlug })
    }
  }
  
  return params
}
