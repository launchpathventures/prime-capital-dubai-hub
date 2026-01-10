/**
 * CATALYST - Competency Overview Page
 *
 * Shows competency details with sidebar navigation.
 * Dynamic route: /learn/[competency]
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { CompetencySidebar } from "../_surface/competency-sidebar"

// -----------------------------------------------------------------------------
// Competency Data
// -----------------------------------------------------------------------------

const competencies = [
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

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

interface PageProps {
  params: Promise<{
    competency: string
  }>
}

export default async function CompetencyOverviewPage({ params }: PageProps) {
  const { competency: competencySlug } = await params
  const competency = competencies.find((c) => c.slug === competencySlug)

  if (!competency) {
    notFound()
  }

  // For now, just redirect to the first behaviour
  const firstBehaviour = competency.behaviours[0]
  if (firstBehaviour) {
    // In a real implementation, we'd show an overview page
    // For now, redirect to first behaviour
    const { redirect } = await import("next/navigation")
    redirect(`/learn/${competencySlug}/${firstBehaviour.slug}`)
  }

  return null
}

// -----------------------------------------------------------------------------
// Generate Static Params
// -----------------------------------------------------------------------------

export async function generateStaticParams() {
  return competencies.map((competency) => ({
    competency: competency.slug,
  }))
}
