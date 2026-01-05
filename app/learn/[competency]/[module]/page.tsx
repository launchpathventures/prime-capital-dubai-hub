/**
 * CATALYST - Module Content Page
 *
 * Displays learning module content with progress tracking.
 * Dynamic route: /learn/[competency]/[module]
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Container, Stack, Row, Text, Title, Prose } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  ClipboardCheckIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Module Content Data (mock - would come from database/CMS)
// -----------------------------------------------------------------------------

const moduleContent: Record<string, Record<string, {
  title: string
  duration: string
  content: string
  keyTakeaways: string[]
  nextModule?: { slug: string; title: string }
  prevModule?: { slug: string; title: string }
  quizId?: string
}>> = {
  "market-intelligence": {
    "dubai-real-estate-overview": {
      title: "Dubai Real Estate Overview",
      duration: "30 min",
      content: `
## Introduction

Dubai's real estate market is one of the most dynamic and attractive in the world. Understanding its history, growth trajectory, and current state is fundamental to advising international investors effectively.

## Historical Context

Dubai's transformation from a small trading port to a global metropolis is one of the most remarkable urban development stories of the modern era. The real estate sector has been central to this transformation.

### Key Milestones

- **1997**: Freehold property ownership introduced for UAE nationals
- **2002**: Freehold ownership extended to foreign nationals in designated areas
- **2004-2008**: First real estate boom, major developments launched
- **2008-2010**: Global financial crisis impact and market correction
- **2011-2014**: Recovery and sustainable growth period
- **2020-Present**: Pandemic-driven transformation and record growth

## Current Market State

The Dubai real estate market has demonstrated remarkable resilience and growth, particularly since 2021. Key characteristics include:

### Market Fundamentals

- **Population Growth**: Dubai's population continues to grow, driving housing demand
- **Economic Diversification**: Tourism, finance, and technology sectors drive investment
- **Regulatory Maturity**: RERA and DLD provide robust investor protection
- **Infrastructure**: World-class infrastructure supports property values

### Price Dynamics

Dubai remains competitively priced compared to global cities like London, New York, and Singapore, offering attractive entry points for international investors.

## Why This Matters

Understanding the market context enables you to:

1. Position Dubai as a credible investment destination
2. Address investor concerns with factual context
3. Demonstrate expertise that builds client trust
4. Make informed property recommendations
      `,
      keyTakeaways: [
        "Dubai's property market has matured significantly since 2002",
        "The regulatory framework (RERA, DLD) provides strong investor protection",
        "Dubai offers competitive pricing compared to global gateway cities",
        "Population growth and economic diversification drive long-term demand",
      ],
      nextModule: { slug: "regulatory-framework", title: "Regulatory Framework" },
      quizId: "market-intelligence-1",
    },
    "regulatory-framework": {
      title: "Regulatory Framework",
      duration: "45 min",
      content: `
## Introduction

Dubai's real estate regulatory framework is designed to protect investors and ensure market transparency. Understanding these regulations is essential for providing accurate advice to clients.

## Key Regulatory Bodies

### RERA (Real Estate Regulatory Agency)

RERA is the regulatory arm of the Dubai Land Department, responsible for:

- Licensing real estate professionals and companies
- Regulating property advertisements
- Managing escrow accounts for off-plan projects
- Handling disputes between parties

### DLD (Dubai Land Department)

The DLD is the government authority that:

- Registers all property transactions
- Issues title deeds (Oqood for off-plan, Title Deed for completed)
- Maintains the property ownership registry
- Collects registration fees (4% of property value)

## Ownership Types

### Freehold

- Full ownership rights in perpetuity
- Available to foreign nationals in designated areas
- Most common for international investors

### Leasehold

- Long-term lease (typically 99 years)
- Less common, mainly in older developments

## Registration Process

All property transactions must be registered with the DLD:

1. **MOU (Memorandum of Understanding)**: Initial agreement between buyer and seller
2. **NOC (No Objection Certificate)**: Issued by developer confirming no outstanding payments
3. **Transfer**: Official registration at DLD trustee office
4. **Title Deed**: Issued by DLD confirming ownership

## Escrow Regulations

For off-plan purchases, developers must:

- Register the project with RERA
- Open a dedicated escrow account
- Use buyer payments only for construction
- Meet milestone requirements before fund release

This protects buyers from developer insolvency or fund misuse.
      `,
      keyTakeaways: [
        "RERA and DLD work together to regulate Dubai's property market",
        "All transactions must be registered with DLD (4% registration fee)",
        "Escrow accounts protect off-plan buyers from developer default",
        "Freehold ownership is available to foreign nationals in designated areas",
      ],
      prevModule: { slug: "dubai-real-estate-overview", title: "Dubai Real Estate Overview" },
      nextModule: { slug: "market-segments", title: "Market Segments" },
      quizId: "market-intelligence-2",
    },
  },
  "client-discovery": {
    "understanding-investment-goals": {
      title: "Understanding Investment Goals",
      duration: "35 min",
      content: `
## Introduction

Every investor has unique goals, constraints, and priorities. Understanding these thoroughly is the foundation of providing genuinely valuable advice.

## Investment Goal Categories

### Capital Growth

Investors prioritizing capital growth typically:

- Have a longer time horizon (5+ years)
- Accept lower initial yields for appreciation potential
- Prefer emerging areas or off-plan purchases
- Focus on developer reputation and project quality

### Rental Yield

Yield-focused investors typically:

- Need regular income from their investment
- Prefer completed, tenanted properties
- Focus on established areas with rental demand
- Prioritize property management convenience

### Lifestyle & Usage

Some investors seek:

- A holiday home or potential retirement residence
- Access to Dubai's amenities and lifestyle
- A combination of personal use and rental income
- Specific location or property type preferences

### Golden Visa & Residency

Many investors want:

- UAE residency through the Golden Visa program
- Property investment of AED 2M+ for 10-year visa
- Access to UAE banking and business opportunities
- A foothold in the region for business purposes

## Discovery Questions Framework

### Financial Position

- "What budget range are you comfortable with?"
- "Would you be financing the purchase or paying cash?"
- "What timeline works for your capital deployment?"

### Investment Objectives

- "Is your primary goal capital growth, rental income, or a mix of both?"
- "Are you interested in the Golden Visa program?"
- "What investment horizon are you considering?"

### Experience & Concerns

- "Have you invested in property overseas before?"
- "What concerns, if any, do you have about Dubai real estate?"
- "What would make this a successful investment for you?"

## Matching Goals to Properties

Use this framework to match investor goals:

| Goal | Property Type | Area | Timing |
|------|--------------|------|--------|
| Capital Growth | Off-plan, emerging areas | Dubai South, Creek Harbour | Now |
| Rental Yield | Ready, established | Marina, Downtown, JVC | Now |
| Lifestyle | Ready, premium | Palm, Bluewaters | Now |
| Golden Visa | AED 2M+ ready | Any prime location | Now |
      `,
      keyTakeaways: [
        "Investment goals fall into four main categories: growth, yield, lifestyle, and residency",
        "Discovery questions should explore financial position, objectives, and concerns",
        "Match property recommendations to specific investor goals",
        "Golden Visa requires AED 2M+ property investment for 10-year residency",
      ],
      prevModule: { slug: "qualification-framework", title: "Qualification Framework" },
      nextModule: { slug: "managing-expectations", title: "Managing Expectations" },
      quizId: "client-discovery-5",
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
  
  const competencyModules = moduleContent[competencySlug]
  if (!competencyModules) {
    notFound()
  }
  
  const moduleData = competencyModules[moduleSlug]
  if (!moduleData) {
    notFound()
  }

  return (
    <Container size="md" className="py-8">
      <Stack gap="xl">
        {/* Breadcrumb */}
        <Row gap="xs" align="center" className="flex-wrap">
          <Link href="/learn">
            <Text size="sm" variant="muted" className="hover:text-foreground transition-colors">
              Dashboard
            </Text>
          </Link>
          <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
          <Link href={`/learn/${competencySlug}`}>
            <Text size="sm" variant="muted" className="hover:text-foreground transition-colors capitalize">
              {competencySlug.replace(/-/g, " ")}
            </Text>
          </Link>
          <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
          <Text size="sm">{moduleData.title}</Text>
        </Row>

        {/* Module Header */}
        <Stack gap="md">
          <Stack gap="sm">
            <Badge variant="outline" className="w-fit">
              <BookOpenIcon className="h-3 w-3 mr-1" />
              Module
            </Badge>
            <Title size="h1">{moduleData.title}</Title>
          </Stack>
          <Row gap="md" align="center">
            <Row gap="xs" align="center">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <Text size="sm" variant="muted">{moduleData.duration} read</Text>
            </Row>
          </Row>
        </Stack>

        {/* Module Content */}
        <Prose className="module-content">
          <div dangerouslySetInnerHTML={{ __html: formatMarkdown(moduleData.content) }} />
        </Prose>

        {/* Key Takeaways */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <Stack gap="md">
              <Row gap="sm" align="center">
                <CheckCircleIcon className="h-5 w-5 text-primary" />
                <Title size="h4">Key Takeaways</Title>
              </Row>
              <ul className="space-y-2">
                {moduleData.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <Text size="sm">{takeaway}</Text>
                  </li>
                ))}
              </ul>
            </Stack>
          </CardContent>
        </Card>

        {/* Knowledge Check CTA */}
        {moduleData.quizId && (
          <Card>
            <CardContent className="pt-6">
              <Row gap="md" align="center" justify="between">
                <Stack gap="xs">
                  <Row gap="sm" align="center">
                    <ClipboardCheckIcon className="h-5 w-5 text-primary" />
                    <Text weight="medium">Knowledge Check</Text>
                  </Row>
                  <Text size="sm" variant="muted">
                    Test your understanding of this module with a short quiz.
                  </Text>
                </Stack>
                <Button nativeButton={false} render={<Link href={`/learn/quiz/${moduleData.quizId}`} />}>
                  Take Quiz
                </Button>
              </Row>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <Row gap="md" align="center" justify="between" className="pt-4 border-t">
          {moduleData.prevModule ? (
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={`/learn/${competencySlug}/${moduleData.prevModule.slug}`} />}
              className="gap-2"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <Stack gap="none" align="start">
                <Text size="xs" variant="muted">Previous</Text>
                <Text size="sm">{moduleData.prevModule.title}</Text>
              </Stack>
            </Button>
          ) : (
            <div />
          )}
          
          {moduleData.nextModule ? (
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={`/learn/${competencySlug}/${moduleData.nextModule.slug}`} />}
              className="gap-2"
            >
              <Stack gap="none" align="end">
                <Text size="xs" variant="muted">Next</Text>
                <Text size="sm">{moduleData.nextModule.title}</Text>
              </Stack>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              nativeButton={false}
              render={<Link href={`/learn/${competencySlug}`} />}
            >
              Complete Competency
            </Button>
          )}
        </Row>
      </Stack>
    </Container>
  )
}

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

function formatMarkdown(content: string): string {
  // Simple markdown to HTML conversion
  // In production, use a proper markdown library like remark/rehype
  return content
    .replace(/## (.*)/g, '<h2>$1</h2>')
    .replace(/### (.*)/g, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n- (.*)/g, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>')
    .replace(/\n\| /g, '<tr><td>')
    .replace(/ \| /g, '</td><td>')
    .replace(/ \|$/gm, '</td></tr>')
}

// -----------------------------------------------------------------------------
// Generate Static Params
// -----------------------------------------------------------------------------

export async function generateStaticParams() {
  const params: { competency: string; module: string }[] = []
  
  for (const [competency, modules] of Object.entries(moduleContent)) {
    for (const moduleSlug of Object.keys(modules)) {
      params.push({ competency, module: moduleSlug })
    }
  }
  
  return params
}
