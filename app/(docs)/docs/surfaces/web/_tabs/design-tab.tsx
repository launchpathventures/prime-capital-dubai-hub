/**
 * CATALYST - Web Surface Doc Tab: Design
 *
 * A living showcase of Web surface design patterns.
 * Focus on marketing-style components: heroes, CTAs, testimonials, features.
 */

"use client"

import { Stack, Text, Title, Row } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle2Icon,
  XCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  ZapIcon,
  ShieldIcon,
  TrendingUpIcon,
  StarIcon,
} from "lucide-react"

export function DesignTab() {
  return (
    <article>
      <Stack gap="xl">
        {/* Summary Card */}
        <div className="border-primary bg-primary/5 space-y-4 rounded-lg border-l-4 p-5">
          <div>
            <p className="text-lg font-medium leading-snug">
              Web Surface Design
            </p>
            <p className="text-muted-foreground mt-1">
              Guidelines for building high-performance public websites
            </p>
          </div>

          {/* Core message */}
          <p className="leading-relaxed">
            The Web surface prioritizes <strong>clarity</strong>,{" "}
            <strong>performance</strong>, and{" "}
            <strong>purposeful layouts</strong>. Whether you&apos;re building a
            marketing page or a full content site, every section should serve
            your visitors&apos; goals.
          </p>

          {/* Principles */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {[
              { label: "Clear", desc: "One purpose per section" },
              { label: "Fast", desc: "Optimized for performance" },
              { label: "Scannable", desc: "Easy to navigate" },
              { label: "Purposeful", desc: "Every element earns its place" },
            ].map((p) => (
              <div key={p.label} className="bg-background rounded-md border p-2.5">
                <Text size="sm" weight="medium">
                  {p.label}
                </Text>
                <Text size="xs" variant="muted">
                  {p.desc}
                </Text>
              </div>
            ))}
          </div>

          {/* Do / Don't */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="bg-background rounded-md border p-3">
              <Row gap="sm" className="mb-2 items-center">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
                <Text size="sm" weight="medium">
                  Do
                </Text>
              </Row>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>Lead with clear value propositions</li>
                <li>Use consistent section spacing</li>
                <li>Make navigation obvious and accessible</li>
                <li>Use whitespace generously</li>
              </ul>
            </div>
            <div className="bg-background rounded-md border p-3">
              <Row gap="sm" className="mb-2 items-center">
                <XCircleIcon className="h-4 w-4 text-red-600" />
                <Text size="sm" weight="medium">
                  Don&apos;t
                </Text>
              </Row>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>Clutter pages with competing elements</li>
                <li>Use sidebar navigation (that&apos;s for App)</li>
                <li>Sacrifice performance for flashy effects</li>
                <li>Hide important content below heavy folds</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hero Section Example */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-background overflow-hidden rounded-2xl border">
          <div className="px-8 py-16 text-center">
            <Badge variant="secondary" className="mb-4">
              New Release
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Build faster with
              <span className="text-primary"> Catalyst</span>
            </h1>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
              The AI-first development kit that helps you ship production-ready
              applications in days, not months.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg">
                Get Started Free
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                See Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section>
          <div className="mb-6 text-center">
            <Title size="h2" align="center">Everything you need</Title>
            <Text variant="muted" className="mt-2">
              Built-in features to accelerate your development
            </Text>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureItem
              icon={ZapIcon}
              title="Lightning Fast"
              description="Optimized for performance with server-side rendering and edge caching."
            />
            <FeatureItem
              icon={ShieldIcon}
              title="Secure by Default"
              description="Authentication, authorization, and data protection built in."
            />
            <FeatureItem
              icon={TrendingUpIcon}
              title="Analytics Ready"
              description="Track user behavior and measure conversion from day one."
            />
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="bg-muted/30 rounded-2xl border p-8">
          <div className="mb-6 text-center">
            <Title size="h3" align="center">Trusted by developers</Title>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <TestimonialCard
              quote="Catalyst cut our development time in half. The AI-first approach is a game changer."
              author="Sarah Chen"
              role="CTO, TechStart"
            />
            <TestimonialCard
              quote="Finally, a starter kit that understands how modern teams actually build software."
              author="Marcus Johnson"
              role="Lead Developer, Acme Inc"
            />
          </div>
        </section>

        {/* Pricing Preview */}
        <section>
          <div className="mb-6 text-center">
            <Title size="h2" align="center">Simple, transparent pricing</Title>
            <Text variant="muted" className="mt-2">
              Start free, scale when you&apos;re ready
            </Text>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <PricingCard
              name="Starter"
              price="Free"
              description="Perfect for side projects"
              features={["1 project", "Community support", "Basic analytics"]}
            />
            <PricingCard
              name="Pro"
              price="$29"
              description="For growing teams"
              features={[
                "Unlimited projects",
                "Priority support",
                "Advanced analytics",
                "Team collaboration",
              ]}
              highlighted
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              description="For large organizations"
              features={[
                "Everything in Pro",
                "SSO & SAML",
                "Dedicated support",
                "Custom integrations",
              ]}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary rounded-2xl p-8 text-center text-primary-foreground">
          <Title size="h2" align="center" className="text-primary-foreground">
            Ready to get started?
          </Title>
          <Text className="mx-auto mt-2 max-w-xl text-primary-foreground/80">
            Join thousands of developers building faster with Catalyst.
          </Text>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              Start Building
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              Contact Sales
            </Button>
          </div>
        </section>
      </Stack>
    </article>
  )
}

// -----------------------------------------------------------------------------
// Helper Components
// -----------------------------------------------------------------------------

function FeatureItem({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="bg-primary/10 mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg">
          <Icon className="text-primary h-5 w-5" />
        </div>
        <h3 className="mb-2 font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string
  author: string
  role: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-foreground mb-4">&ldquo;{quote}&rdquo;</p>
        <div>
          <Text weight="medium">{author}</Text>
          <Text size="sm" variant="muted">
            {role}
          </Text>
        </div>
      </CardContent>
    </Card>
  )
}

function PricingCard({
  name,
  price,
  description,
  features,
  highlighted,
}: {
  name: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
}) {
  return (
    <Card className={highlighted ? "border-primary ring-primary/20 ring-2" : ""}>
      <CardHeader>
        {highlighted && (
          <Badge className="mb-2 w-fit">Most Popular</Badge>
        )}
        <CardTitle>{name}</CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Free" && price !== "Custom" && (
            <span className="text-muted-foreground">/month</span>
          )}
        </div>
        <Text size="sm" variant="muted">
          {description}
        </Text>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          className="mt-6 w-full"
          variant={highlighted ? "default" : "outline"}
        >
          Get Started
        </Button>
      </CardContent>
    </Card>
  )
}
