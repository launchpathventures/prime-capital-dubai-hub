/**
 * CATALYST - Landing Page Example
 *
 * High-converting landing page demonstrating:
 * - Hero section with animated gradient effects
 * - Social proof with animated logo marquee
 * - Feature cards with gradient hover effects
 * - Interactive "How it works" tabs
 * - Pricing tables
 * - FAQ accordion
 * - Testimonials grid
 * - Strong closing CTA
 *
 * Uses scroll-based animations and micro-interactions throughout.
 * This page uses bleed mode for full-width sections.
 */

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Container, Row, Stack, Text, Title, Avatar, Section, Grid } from "@/components/core"
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
  GlobeIcon,
  UsersIcon,
  CpuIcon,
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
    gradient: "from-orange-400 to-amber-400",
    bgGradient: "from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20",
    hoverGradient: "from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30",
  },
  {
    icon: ShieldIcon,
    title: "Enterprise Security",
    description: "Bank-grade encryption, SOC2 compliance, and role-based access control built in.",
    gradient: "from-emerald-400 to-teal-400",
    bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
    hoverGradient: "from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30",
  },
  {
    icon: BarChart3Icon,
    title: "Deep Analytics",
    description: "Real-time insights that help you make smarter decisions, faster.",
    gradient: "from-blue-400 to-indigo-400",
    bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
    hoverGradient: "from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30",
  },
  {
    icon: LayersIcon,
    title: "Seamless Integrations",
    description: "Connect with 100+ tools you already use. No code required.",
    gradient: "from-violet-400 to-purple-400",
    bgGradient: "from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20",
    hoverGradient: "from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30",
  },
]

const steps = [
  {
    id: "connect",
    number: "01",
    title: "Connect Data",
    description: "Import data from your existing workflows with one-click integrations.",
    icon: GlobeIcon,
    color: "text-blue-500",
    image: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
  },
  {
    id: "automate",
    number: "02",
    title: "Automate",
    description: "Set up powerful workflows that run on autopilot 24/7.",
    icon: CpuIcon,
    color: "text-violet-500",
    image: "bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20",
  },
  {
    id: "scale",
    number: "03",
    title: "Scale Up",
    description: "Grow without limits. Our infrastructure handles the heavy lifting.",
    icon: RocketIcon,
    color: "text-emerald-500",
    image: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
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

const pricing = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for side projects and hobbyists.",
    features: ["Up to 3 projects", "Basic analytics", "Community support", "1GB storage"],
    cta: "Start for free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For growing teams and startups.",
    features: ["Unlimited projects", "Advanced analytics", "Priority support", "10GB storage", "Custom domains"],
    cta: "Get started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with specific needs.",
    features: ["SSO & SAML", "Dedicated success manager", "99.99% SLA", "Unlimited storage", "On-premise deployment"],
    cta: "Contact sales",
    popular: false,
  },
]

const faqs = [
  {
    question: "How does the free trial work?",
    answer: "You get full access to all Pro features for 14 days. No credit card required. At the end of the trial, you can choose to upgrade or downgrade to the free plan.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
  },
  {
    question: "Do you offer discounts for non-profits?",
    answer: "Yes! We offer a 50% discount for registered non-profit organizations. Contact our sales team with your documentation to apply.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use bank-grade encryption for all data in transit and at rest. We are SOC2 Type II compliant and undergo regular security audits.",
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
    <div className="relative w-full overflow-hidden py-10 bg-muted/30 border-y border-muted/50">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background to-transparent z-20" />
      <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background to-transparent z-20" />
      
      <div className="flex flex-col gap-8">
        {/* Row 1: Left */}
        <div className="flex animate-marquee w-max">
          {[...trustedLogos, ...trustedLogos, ...trustedLogos].map((logo, i) => (
            <div 
              key={`r1-${logo.name}-${i}`}
              className="flex items-center gap-3 mx-8 shrink-0 group cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0"
            >
              <div className={`w-10 h-10 rounded-xl ${logo.color} flex items-center justify-center font-bold text-sm ${logo.textColor} shadow-sm group-hover:shadow-md transition-all scale-90 group-hover:scale-100`}>
                {logo.name[0]}
              </div>
              <span className="font-bold text-lg text-foreground tracking-tight">
                {logo.name}
              </span>
            </div>
          ))}
        </div>

        {/* Row 2: Right (Reverse) */}
        <div className="flex animate-marquee-reverse w-max ml-[-100px]">
           {[...trustedLogos.reverse(), ...trustedLogos, ...trustedLogos].map((logo, i) => (
            <div 
              key={`r2-${logo.name}-${i}`}
              className="flex items-center gap-3 mx-8 shrink-0 group cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0"
            >
              <div className={`w-10 h-10 rounded-xl ${logo.color} flex items-center justify-center font-bold text-sm ${logo.textColor} shadow-sm group-hover:shadow-md transition-all scale-90 group-hover:scale-100`}>
                {logo.name[0]}
              </div>
              <span className="font-bold text-lg text-foreground tracking-tight">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
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
      <section className="relative min-h-[75vh] flex items-center justify-center py-12 overflow-hidden">
        {/* Background Gradient Effects */}
        <AnimatedGradientOrb className="w-[1200px] h-[1200px] bg-violet-500/30 -top-[400px] left-1/2 -translate-x-1/2 animate-pulse" />
        <AnimatedGradientOrb className="w-[800px] h-[800px] bg-blue-500/20 top-0 -left-20 animate-pulse" style={{ animationDelay: "2s" }} />
        <AnimatedGradientOrb className="w-[800px] h-[800px] bg-indigo-500/20 -bottom-40 -right-20 animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Radial fade overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-background)_75%)]" />

        <Container size="lg" className="relative z-10">
          <Stack gap="xl" align="center" className="text-center">
            {/* Announcement Badge */}
            <div className="animate-in fade-in slide-in-from-top-4 duration-700">
              <Badge 
                variant="outline" 
                className="px-4 py-2 text-sm bg-background/50 backdrop-blur-sm border-violet-500/30 hover:border-violet-500/50 transition-colors cursor-pointer group rounded-full"
              >
                <SparklesIcon className="h-3.5 w-3.5 mr-2 text-violet-500" />
                <span className="text-muted-foreground">Version 2.0 Now Public</span>
                <ArrowRightIcon className="h-3 w-3 ml-2 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 max-w-4xl">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                Build products that
                <span className="block bg-gradient-to-r from-violet-600 via-blue-500 to-violet-600 bg-clip-text text-transparent bg-[size:200%_auto] animate-gradient pb-2">
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
                className="h-12 px-8 group rounded-full"
                onClick={() => scrollToElement("features")}
              >
                Learn more
                <ChevronDownIcon className="h-4 w-4 ml-2 group-hover:translate-y-0.5 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                className="h-12 px-8 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 shadow-lg shadow-violet-500/25 group border-0 rounded-full"
              >
                Start free trial
                <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Row>

            {/* Hero Visual - Dashboard Preview */}
            <div className="relative mt-16 w-full max-w-5xl animate-in fade-in zoom-in-95 duration-1000 delay-500">
              {/* Glow effect behind image */}
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-blue-500 rounded-2xl blur opacity-20" />
              
              {/* App Window */}
              <div className="relative rounded-2xl border bg-background shadow-2xl shadow-violet-500/10 overflow-hidden">
                {/* Window Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-md bg-background border text-xs text-muted-foreground flex items-center gap-2">
                      <ShieldIcon className="w-3 h-3" />
                      app.acme.com/dashboard
                    </div>
                  </div>
                </div>
                
                {/* App Content Preview */}
                <div className="p-6 bg-gradient-to-br from-muted/30 to-background min-h-[400px]">
                  <div className="grid grid-cols-4 gap-4 mb-6">
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
                  
                  <div className="grid grid-cols-3 gap-6 h-64">
                    <div className="col-span-2 rounded-xl border bg-background p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                      {/* Grid lines background */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                      
                      <div className="flex items-center justify-between relative z-10">
                        <Title size="h5">Revenue Growth</Title>
                        <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">+12.5%</Badge>
                      </div>
                      <div className="flex-1 flex items-end gap-2 relative z-10">
                        {[35, 45, 40, 60, 55, 75, 70, 90].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col justify-end group">
                            <div 
                              className={`w-full rounded-t-md transition-all duration-1000 ease-out ${
                                i === 7 
                                  ? "bg-gradient-to-t from-violet-600 to-blue-500 shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)]" 
                                  : "bg-violet-100 dark:bg-violet-900/20 hover:bg-violet-200 dark:hover:bg-violet-900/40"
                              }`}
                              style={{ height: `${h}%` }}
                            >
                                {i === 7 && (
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        $42.5k
                                    </div>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border bg-background p-6 shadow-sm flex flex-col gap-4">
                      <Title size="h5">Active Users</Title>
                      <div className="flex-1 flex items-center justify-center relative">
                        <div className="w-32 h-32 rounded-full border-8 border-blue-100 dark:border-blue-900/20 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold">84%</div>
                            <div className="text-xs text-muted-foreground">Retention</div>
                          </div>
                        </div>
                      </div>
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
            Trusted by world-leading teams
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
                  className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border-muted ${
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
      {/* HOW IT WORKS (Interactive) */}
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

            {/* Interactive Tabs */}
            <Tabs defaultValue="connect" className="w-full">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left: Steps List */}
                <TabsList className="flex flex-col h-auto bg-transparent space-y-4 p-0 w-full">
                  {steps.map((step) => (
                    <TabsTrigger 
                      key={step.id} 
                      value={step.id}
                      className="w-full p-6 justify-start text-left h-auto bg-background border border-transparent data-[state=active]:border-violet-500/30 data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all rounded-xl group"
                    >
                      <Row gap="md" align="start">
                        <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0 group-data-[state=active]:bg-violet-100 dark:group-data-[state=active]:bg-violet-900/30 transition-colors`}>
                          <step.icon className={`h-6 w-6 text-muted-foreground group-data-[state=active]:${step.color}`} />
                        </div>
                        <Stack gap="xs">
                          <Title size="h5" className="group-data-[state=active]:text-violet-600 dark:group-data-[state=active]:text-violet-400">
                            {step.title}
                          </Title>
                          <Text variant="muted" className="text-sm">
                            {step.description}
                          </Text>
                        </Stack>
                      </Row>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Right: Visual Preview */}
                <div className="relative h-[400px] rounded-2xl overflow-hidden border bg-background shadow-2xl">
                  {steps.map((step) => (
                    <TabsContent key={step.id} value={step.id} className="absolute inset-0 m-0 h-full w-full animate-in fade-in zoom-in-95 duration-300">
                      <div className={`w-full h-full ${step.image} flex items-center justify-center p-8`}>
                        <div className="text-center space-y-4">
                          <div className={`w-24 h-24 mx-auto rounded-3xl bg-white dark:bg-black/20 backdrop-blur-sm flex items-center justify-center shadow-xl`}>
                            <step.icon className={`h-12 w-12 ${step.color}`} />
                          </div>
                          <Title size="h3" className="text-foreground/80">{step.title} Interface</Title>
                          <Text variant="muted">Interactive preview would go here</Text>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </div>
              </div>
            </Tabs>
          </Stack>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* PRICING */}
      {/* ================================================================= */}
      <section 
        id="pricing" 
        data-animate 
        className={`py-24 transition-all duration-700 ${isVisible.pricing ? "opacity-100" : "opacity-0 translate-y-8"}`}
      >
        <Container size="lg" className="examples-section">
          <Stack gap="xl">
            <Stack gap="md" align="center" className="text-center max-w-2xl mx-auto">
              <Badge variant="outline" className="text-orange-600 border-orange-200 dark:border-orange-800">
                Pricing
              </Badge>
              <Title size="h1">Simple, transparent pricing</Title>
              <Text variant="muted" size="lg">
                Choose the plan that's right for you. No hidden fees.
              </Text>
            </Stack>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              {pricing.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    plan.popular ? "border-violet-500 shadow-lg scale-105 z-10" : "hover:-translate-y-1"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <CheckIcon className="h-4 w-4 text-violet-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={`w-full ${plan.popular ? "bg-violet-600 hover:bg-violet-700" : ""}`} 
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
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
        className={`py-24 bg-muted/20 transition-all duration-700 ${isVisible.testimonials ? "opacity-100" : "opacity-0 translate-y-8"}`}
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
                <Card key={testimonial.author} className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-background">
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
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <RocketIcon className="h-8 w-8 text-white" />
                </div>
                
                <Title size="h1" className="text-white max-w-2xl">
                  Ready to transform your workflow?
                </Title>
                
                <Text className="text-white/80 text-lg max-w-xl">
                  Join thousands of teams already building faster, smarter, and better. 
                  Start your free trial today — no credit card required.
                </Text>
                
                <Row gap="md" className="mt-4 flex-col sm:flex-row">
                  <Button size="lg" className="h-12 px-8 bg-white text-violet-600 hover:bg-white/90 shadow-lg group border-0 rounded-full w-full sm:w-auto">
                    Get started free
                    <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                  <Button size="lg" variant="ghost" className="h-12 px-8 text-white hover:bg-white/20 rounded-full w-full sm:w-auto">
                    Talk to sales
                  </Button>
                </Row>
                
                <Row gap="lg" className="mt-6 text-white/70 text-sm flex-wrap justify-center">
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
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee 40s linear infinite reverse;
        }
        .animate-marquee:hover, .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
