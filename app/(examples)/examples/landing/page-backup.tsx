/**
 * CATALYST - Landing Page Example
 *
 * High-converting landing page demonstrating:
 * - Hero section with animated gradient effects
 * - Social proof with animated logo marquee
 * - Feature cards with gradient hover effects
 * - How it works process steps
 * - Testimonials grid
 * - Strong closing CTA
 *
 * Uses scroll-based animations and micro-interactions throughout.
 * This page uses bleed mode for full-width sections.
 */

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Container, Row, Stack, Text, Title, Avatar } from "@/components/core"
import { ExamplePrompt, getExample } from "../../_surface"
import { scrollToElement } from "@/lib/utils"

const example = getExample("landing")!

import {
  RocketIcon,
  ZapIcon,
  ShieldIcon,
  BarChart3Icon,
  SparklesIcon,
  ArrowRightIcon,
  CheckIcon,
  PlayIcon,
  StarIcon,
  LayersIcon,
  ChevronDownIcon,
} from "lucide-react"

// =============================================================================
// MOCK DATA
// =============================================================================

const trustedLogos = [
  { name: "Vercel", color: "bg-black dark:bg-white", textColor: "text-white dark:text-black" },
  { name: "Stripe", color: "bg-[#635bff]", textColor: "text-white" },
  { name: "Linear", color: "bg-[#5e6ad2]", textColor: "text-white" },
  { name: "Notion", color: "bg-black dark:bg-white", textColor: "text-white dark:text-black" },
  { name: "Figma", color: "bg-gradient-to-br from-[#f24e1e] via-[#a259ff] to-[#1abcfe]", textColor: "text-white" },
  { name: "Slack", color: "bg-[#4a154b]", textColor: "text-white" },
  { name: "GitHub", color: "bg-black dark:bg-white", textColor: "text-white dark:text-black" },
  { name: "Shopify", color: "bg-[#96bf48]", textColor: "text-white" },
]

const features = [
  {
    icon: ZapIcon,
    title: "Lightning Fast",
    description: "Optimized for speed with edge deployment and smart caching. Your users won't wait.",
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-500/10 to-orange-500/5",
    hoverGradient: "from-amber-500/20 to-orange-500/10",
  },
  {
    icon: ShieldIcon,
    title: "Enterprise Security",
    description: "Bank-grade encryption, SOC2 compliance, and role-based access control built in.",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-500/10 to-teal-500/5",
    hoverGradient: "from-emerald-500/20 to-teal-500/10",
  },
  {
    icon: BarChart3Icon,
    title: "Deep Analytics",
    description: "Real-time insights that help you make smarter decisions, faster.",
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-500/10 to-indigo-500/5",
    hoverGradient: "from-blue-500/20 to-indigo-500/10",
  },
  {
    icon: LayersIcon,
    title: "Seamless Integrations",
    description: "Connect with 100+ tools you already use. No code required.",
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-500/10 to-purple-500/5",
    hoverGradient: "from-violet-500/20 to-purple-500/10",
  },
]

const steps = [
  {
    number: "01",
    title: "Sign up in seconds",
    description: "Create your account with just an email. No credit card required to start.",
  },
  {
    number: "02",
    title: "Connect your tools",
    description: "Import data from your existing workflows with one-click integrations.",
  },
  {
    number: "03",
    title: "Watch it work",
    description: "Sit back as automation handles the heavy lifting. Focus on what matters.",
  },
]

const testimonials = [
  {
    quote: "This completely transformed how our team works. We shipped 3x faster in the first month.",
    author: "Sarah Chen",
    role: "CTO, TechFlow",
    avatar: "SC",
    rating: 5,
  },
  {
    quote: "The best investment we've made this year. ROI was positive within two weeks.",
    author: "Marcus Rodriguez",
    role: "Head of Product, Elevate",
    avatar: "MR",
    rating: 5,
  },
  {
    quote: "Finally, a tool that actually delivers on its promises. Our customers love it.",
    author: "Emily Watson",
    role: "Founder, Nimbus",
    avatar: "EW",
    rating: 5,
  },
]

const stats = [
  { value: "10K+", label: "Active teams" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "4.9/5", label: "User rating" },
  { value: "<100ms", label: "Response time" },
]

// =============================================================================
// ANIMATION HOOK
// =============================================================================

function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    const elements = document.querySelectorAll("[data-animate]")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return isVisible
}

// =============================================================================
// COMPONENTS
// =============================================================================

function AnimatedGradientOrb({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div 
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{ animationDuration: "4s", ...style }}
    />
  )
}

function LogoMarquee() {
  return (
    <div className="relative overflow-hidden py-4">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      
      {/* Scrolling logos */}
      <div className="flex animate-marquee">
        {[...trustedLogos, ...trustedLogos].map((logo, i) => (
          <div 
            key={`${logo.name}-${i}`}
            className="flex items-center gap-3 mx-8 shrink-0 group cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-xl ${logo.color} flex items-center justify-center font-bold text-sm ${logo.textColor} shadow-lg group-hover:scale-110 transition-transform`}>
              {logo.name[0]}
            </div>
            <span className="font-semibold text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function LandingPage() {
  const isVisible = useScrollAnimation()
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div className="examples-bleed landing-page">
      {/* Prompt Section */}
      <section className="examples-section py-6">
        <ExamplePrompt summary={example.summary}>
          {example.prompt}
        </ExamplePrompt>
      </section>

      {/* ================================================================= */}
      {/* HERO SECTION */}
      {/* ================================================================= */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 overflow-hidden">
        {/* Background Gradient Effects */}
        <AnimatedGradientOrb className="w-[800px] h-[800px] bg-violet-500/40 -top-60 left-1/2 -translate-x-1/2 animate-pulse" />
        <AnimatedGradientOrb className="w-[600px] h-[600px] bg-blue-500/30 top-20 -left-40 animate-pulse" style={{ animationDelay: "2s" }} />
        <AnimatedGradientOrb className="w-[500px] h-[500px] bg-violet-400/25 bottom-0 -right-20 animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Radial fade overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-background)_75%)]" />

        <Container size="lg" className="relative z-10">
          <Stack gap="xl" align="center" className="text-center">
            {/* Announcement Badge */}
            <div className="animate-in fade-in slide-in-from-top-4 duration-700">
              <Badge 
                variant="outline" 
                className="px-4 py-1.5 text-sm bg-background/50 backdrop-blur-sm border-violet-500/30 hover:border-violet-500/50 transition-colors cursor-pointer group"
              >
                <SparklesIcon className="h-3.5 w-3.5 mr-2 text-violet-500" />
                <span className="text-muted-foreground">New: AI-powered workflows</span>
                <ArrowRightIcon className="h-3 w-3 ml-2 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                Build products that
                <span className="block bg-gradient-to-r from-violet-600 via-blue-500 to-violet-600 bg-clip-text text-transparent bg-[size:200%_auto] animate-gradient">
                  customers love
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                The all-in-one platform that helps you ship faster, iterate smarter, and scale without limits. 
                Join 10,000+ teams building the future.
              </p>
            </div>

            {/* CTA Buttons */}
            <Row gap="md" className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <Button 
                size="lg" 
                variant="outline"
                className="h-12 px-8 group"
                onClick={() => scrollToElement("features")}
              >
                Learn more
                <ChevronDownIcon className="h-4 w-4 ml-2 group-hover:translate-y-0.5 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                className="h-12 px-8 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 shadow-lg shadow-violet-500/25 group border-0"
              >
                Start free trial
                <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Row>

            {/* Hero Visual - Dashboard Preview */}
            <div className="relative mt-12 w-full max-w-4xl animate-in fade-in zoom-in-95 duration-1000 delay-500">
              {/* App Window */}
              <div className="rounded-2xl border bg-background shadow-2xl shadow-violet-500/10 overflow-hidden">
                {/* Window Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-md bg-background border text-xs text-muted-foreground">
                      app.acme.com/dashboard
                    </div>
                  </div>
                </div>
                
                {/* App Content Preview */}
                <div className="p-6 bg-gradient-to-br from-muted/30 to-background">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {stats.map((stat, i) => (
                      <div 
                        key={stat.label} 
                        className="rounded-xl border bg-background p-4 text-center shadow-sm hover:shadow-md transition-shadow"
                        style={{ animationDelay: `${600 + i * 100}ms` }}
                      >
                        <Text className="text-2xl font-bold bg-gradient-to-br from-violet-600 to-blue-600 bg-clip-text text-transparent">
                          {stat.value}
                        </Text>
                        <Text size="sm" variant="muted">{stat.label}</Text>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border bg-background h-36 flex items-center justify-center shadow-sm">
                    <div className="flex items-center gap-3 text-muted-foreground/50">
                      <BarChart3Icon className="h-8 w-8" />
                      <Text size="sm">Interactive dashboard preview</Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Stack>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* SOCIAL PROOF - Logo Marquee */}
      {/* ================================================================= */}
      <section 
        id="logos" 
        data-animate 
        className={`py-12 border-y bg-muted/20 transition-all duration-700 ${isVisible.logos ? "opacity-100" : "opacity-0 translate-y-4"}`}
      >
        <Stack gap="md" align="center">
          <Text variant="muted" className="text-sm uppercase tracking-wider font-medium">
            Trusted by 10,000+ teams at companies like
          </Text>
          <LogoMarquee />
        </Stack>
      </section>

      {/* ================================================================= */}
      {/* FEATURES */}
      {/* ================================================================= */}
      <section 
        id="features" 
        data-animate 
        className={`py-24 transition-all duration-700 ${isVisible.features ? "opacity-100" : "opacity-0 translate-y-8"}`}
      >
        <Container size="lg" className="examples-section">
          <Stack gap="xl">
            {/* Section Header */}
            <Stack gap="md" align="center" className="text-center max-w-2xl mx-auto">
              <Badge variant="outline" className="text-violet-600 border-violet-200 dark:border-violet-800">
                Features
              </Badge>
              <Title size="h1">Everything you need to win</Title>
              <Text variant="muted" size="lg">
                Powerful features that work together seamlessly. No compromises, no workarounds.
              </Text>
            </Stack>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card 
                  key={feature.title}
                  className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                    hoveredFeature === index ? "ring-2 ring-violet-500/50" : ""
                  }`}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  {/* Background gradient - subtle by default, stronger on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} transition-opacity duration-300`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <CardContent className="relative p-8">
                    <Row gap="lg" align="start">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <feature.icon className="h-7 w-7 text-white" />
                      </div>
                      <Stack gap="sm">
                        <Title size="h4" className="group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {feature.title}
                        </Title>
                        <Text variant="muted" className="leading-relaxed">
                          {feature.description}
                        </Text>
                        <button className="flex items-center text-sm font-medium text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                          Learn more
                          <ArrowRightIcon className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Stack>
                    </Row>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Stack>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* HOW IT WORKS */}
      {/* ================================================================= */}
      <section 
        id="how-it-works" 
        data-animate 
        className={`py-24 bg-muted/20 transition-all duration-700 ${isVisible["how-it-works"] ? "opacity-100" : "opacity-0 translate-y-8"}`}
      >
        <Container size="lg" className="examples-section">
          <Stack gap="xl">
            {/* Section Header */}
            <Stack gap="md" align="center" className="text-center max-w-2xl mx-auto">
              <Badge variant="outline" className="text-blue-600 border-blue-200 dark:border-blue-800">
                How it works
              </Badge>
              <Title size="h1">Get started in minutes</Title>
              <Text variant="muted" size="lg">
                Three simple steps to transform your workflow forever.
              </Text>
            </Stack>

            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={step.number} className="relative group">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[calc(50%+50px)] w-[calc(100%-100px)] h-0.5 bg-gradient-to-r from-violet-500/50 via-blue-500/50 to-transparent" />
                  )}
                  
                  <Stack gap="md" align="center" className="text-center">
                    {/* Step number */}
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-violet-500/20">
                        <span className="text-3xl font-bold bg-gradient-to-br from-violet-600 to-blue-600 bg-clip-text text-transparent">
                          {step.number}
                        </span>
                      </div>
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 opacity-0 group-hover:opacity-20 blur-lg transition-opacity" />
                    </div>
                    
                    <Title size="h4">{step.title}</Title>
                    <Text variant="muted" className="max-w-xs">
                      {step.description}
                    </Text>
                  </Stack>
                </div>
              ))}
            </div>
          </Stack>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* TESTIMONIALS */}
      {/* ================================================================= */}
      <section 
        id="testimonials" 
        data-animate 
        className={`py-24 transition-all duration-700 ${isVisible.testimonials ? "opacity-100" : "opacity-0 translate-y-8"}`}
      >
        <Container size="lg" className="examples-section">
          <Stack gap="xl">
            {/* Section Header */}
            <Stack gap="md" align="center" className="text-center max-w-2xl mx-auto">
              <Badge variant="outline" className="text-emerald-600 border-emerald-200 dark:border-emerald-800">
                Testimonials
              </Badge>
              <Title size="h1">Loved by teams worldwide</Title>
              <Text variant="muted" size="lg">
                Don't just take our word for it. Here's what our customers say.
              </Text>
            </Stack>

            {/* Testimonial Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.author} className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <CardContent className="relative p-6">
                    <Stack gap="lg">
                      {/* Stars */}
                      <Row gap="xs">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <StarIcon key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </Row>
                      
                      {/* Quote */}
                      <Text className="text-lg leading-relaxed">
                        "{testimonial.quote}"
                      </Text>
                      
                      {/* Author */}
                      <Row gap="md" align="center">
                        <Avatar size="md" className="bg-gradient-to-br from-violet-500 to-blue-500 text-white font-semibold">
                          {testimonial.avatar}
                        </Avatar>
                        <Stack gap="none">
                          <Text weight="semibold">{testimonial.author}</Text>
                          <Text size="sm" variant="muted">{testimonial.role}</Text>
                        </Stack>
                      </Row>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Stack>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* FINAL CTA */}
      {/* ================================================================= */}
      <section 
        id="cta" 
        data-animate 
        className={`py-12 transition-all duration-700 ${isVisible.cta ? "opacity-100" : "opacity-0 translate-y-8"}`}
      >
        <Container size="lg" className="examples-section">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-blue-600 to-violet-700" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
            
            {/* Content */}
            <div className="relative px-8 py-20 sm:px-16 text-center text-white">
              <Stack gap="lg" align="center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <RocketIcon className="h-8 w-8" />
                </div>
                
                <Title size="h1" className="text-white max-w-2xl">
                  Ready to transform your workflow?
                </Title>
                
                <Text className="text-white/80 text-lg max-w-xl">
                  Join thousands of teams already building faster, smarter, and better. 
                  Start your free trial today — no credit card required.
                </Text>
                
                <Row gap="md" className="mt-4">
                  <Button size="lg" className="h-12 px-8 bg-white text-violet-600 hover:bg-white/90 shadow-lg group border-0">
                    Get started free
                    <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                  <Button size="lg" variant="ghost" className="h-12 px-8 text-white hover:bg-white/20">
                    Talk to sales
                  </Button>
                </Row>
                
                <Row gap="lg" className="mt-6 text-white/70 text-sm">
                  <Row gap="xs" align="center">
                    <CheckIcon className="h-4 w-4" />
                    Free 14-day trial
                  </Row>
                  <Row gap="xs" align="center">
                    <CheckIcon className="h-4 w-4" />
                    No credit card required
                  </Row>
                  <Row gap="xs" align="center">
                    <CheckIcon className="h-4 w-4" />
                    Cancel anytime
                  </Row>
                </Row>
              </Stack>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer spacer */}
      <div className="h-8" />

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
