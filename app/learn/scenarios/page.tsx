/**
 * CATALYST - Scenario Practice Index
 * 
 * Overview of all roleplay scenario categories for practice.
 * Learners can browse and practice AI-powered conversations.
 */

import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  MessageSquareIcon,
  UsersIcon,
  PresentationIcon,
  ShieldAlertIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ChevronRightIcon,
  SparklesIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Practice Scenarios | Learning Portal",
  description: "Practice real-world client conversations with AI-powered roleplay scenarios.",
}

// =============================================================================
// Types
// =============================================================================

interface ScenarioCategory {
  slug: string
  title: string
  description: string | null
  competencies: string[] | null
  scenario_count: number | null
}

// =============================================================================
// Data Fetching
// =============================================================================

async function getScenarioCategories(): Promise<ScenarioCategory[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("scenarios")
    .select("slug, title, description, competencies, scenario_count")
    .order("slug")
  
  if (error) {
    console.error("Failed to fetch scenarios:", error)
    return []
  }
  
  return data || []
}

// =============================================================================
// Category Icons
// =============================================================================

const categoryIcons: Record<string, React.ReactNode> = {
  "first-contact": <MessageSquareIcon className="h-5 w-5" />,
  "discovery": <UsersIcon className="h-5 w-5" />,
  "presentation": <PresentationIcon className="h-5 w-5" />,
  "objections": <ShieldAlertIcon className="h-5 w-5" />,
  "closing": <CheckCircleIcon className="h-5 w-5" />,
  "difficult-situations": <AlertTriangleIcon className="h-5 w-5" />,
}

const categoryColors: Record<string, string> = {
  "first-contact": "from-blue-500/10 to-blue-600/5 border-blue-200/50",
  "discovery": "from-emerald-500/10 to-emerald-600/5 border-emerald-200/50",
  "presentation": "from-purple-500/10 to-purple-600/5 border-purple-200/50",
  "objections": "from-amber-500/10 to-amber-600/5 border-amber-200/50",
  "closing": "from-green-500/10 to-green-600/5 border-green-200/50",
  "difficult-situations": "from-rose-500/10 to-rose-600/5 border-rose-200/50",
}

// =============================================================================
// Competency Badge Mapping
// =============================================================================

const competencyLabels: Record<string, string> = {
  "client-discovery": "Client Discovery",
  "market-intelligence": "Market Intelligence",
  "property-matching": "Property Matching",
  "transaction-management": "Transaction Management",
  "objection-navigation": "Objection Navigation",
  "relationship-stewardship": "Relationship Stewardship",
}

// =============================================================================
// Page Component
// =============================================================================

export default async function ScenariosIndexPage() {
  const categories = await getScenarioCategories()
  
  const totalScenarios = categories.reduce(
    (sum, cat) => sum + (cat.scenario_count || 0), 
    0
  )

  return (
    <div className="learn-content">
        {/* Hero Section */}
        <section className="scenario-hero">
          <div className="scenario-hero__icon">
            <SparklesIcon className="h-8 w-8" />
          </div>
          <h1 className="scenario-hero__title">Practice Scenarios</h1>
          <p className="scenario-hero__description">
            Master client conversations through AI-powered roleplay. Practice handling 
            real situations you&apos;ll encounter as a Prime Capital consultant.
          </p>
          <div className="scenario-hero__stats">
            <span className="scenario-hero__stat">
              <strong>{totalScenarios}</strong> scenarios
            </span>
            <span className="scenario-hero__stat-sep">•</span>
            <span className="scenario-hero__stat">
              <strong>{categories.length}</strong> categories
            </span>
          </div>
        </section>

      {/* How It Works */}
      <section className="scenario-intro">
        <h2 className="scenario-intro__title">How It Works</h2>
        <div className="scenario-intro__steps">
          <div className="scenario-intro__step">
            <div className="scenario-intro__step-num">1</div>
            <div className="scenario-intro__step-content">
              <strong>Choose a scenario</strong>
              <span>Select a situation you&apos;ll encounter with real clients</span>
            </div>
          </div>
          <div className="scenario-intro__step">
            <div className="scenario-intro__step-num">2</div>
            <div className="scenario-intro__step-content">
              <strong>Review the brief</strong>
              <span>Understand the client, their concerns, and your objective</span>
            </div>
          </div>
          <div className="scenario-intro__step">
            <div className="scenario-intro__step-num">3</div>
            <div className="scenario-intro__step-content">
              <strong>Practice with AI</strong>
              <span>Start a live roleplay conversation and get instant feedback</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="scenario-categories">
        <h2 className="scenario-categories__title">Scenario Categories</h2>
        <div className="scenario-categories__grid">
          {categories.map((category) => (
            <Link 
              key={category.slug}
              href={`/learn/scenarios/${category.slug}`}
              className={`scenario-card bg-gradient-to-br ${categoryColors[category.slug] || "from-gray-500/10 to-gray-600/5 border-gray-200/50"}`}
            >
              <div className="scenario-card__icon">
                {categoryIcons[category.slug] || <MessageSquareIcon className="h-5 w-5" />}
              </div>
              <div className="scenario-card__content">
                <h3 className="scenario-card__title">{category.title}</h3>
                <p className="scenario-card__description">
                  {category.description}
                </p>
                <div className="scenario-card__meta">
                  <span className="scenario-card__count">
                    {category.scenario_count} scenarios
                  </span>
                </div>
                {category.competencies && category.competencies.length > 0 && (
                  <div className="scenario-card__competencies">
                    {category.competencies.slice(0, 2).map((comp) => (
                      <span key={comp} className="scenario-card__competency">
                        {competencyLabels[comp] || comp}
                      </span>
                    ))}
                    {category.competencies.length > 2 && (
                      <span className="scenario-card__competency">
                        +{category.competencies.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <ChevronRightIcon className="scenario-card__arrow h-5 w-5" />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA to Certification */}
      <section className="scenario-cta">
        <div className="scenario-cta__content">
          <h3 className="scenario-cta__title">Ready for Certification?</h3>
          <p className="scenario-cta__description">
            Once you&apos;ve practiced these scenarios and completed your modules, 
            you&apos;ll be ready for your certification assessment with the founding team.
          </p>
          <Button 
            variant="default" 
            size="sm" 
            nativeButton={false} 
            render={<Link href="/learn/certification" />}
          >
            View Certification Requirements
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </section>
    </div>
  )
}
