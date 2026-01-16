/**
 * CATALYST - Example Presentation
 *
 * Demonstrates code-first slide decks with Catalyst.
 * Features URL hash navigation for deep linking (e.g., /present/20241221-catalyst-example#insight)
 *
 * This is an EXAMPLE — delete and create your own presentations.
 * The presentation system (usePresentationSlides hook) handles navigation automatically.
 */

"use client"

import "./page.css"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  SlidesShell,
  Slide,
  SlideContainer,
  SlideDots,
  ScrollHint,
  usePresentationSlides,
} from "../../_surface"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn, Comment } from "@/lib/utils"
import { getPresentationByPath } from "@/lib/navigation"
import {
  SparklesIcon,
  CodeIcon,
  ZapIcon,
  CheckIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  MousePointerClickIcon,
  ClockIcon,
  RefreshCwIcon,
  BrainIcon,
  LayersIcon,
  RotateCcwIcon,
  BookOpenIcon,
  TargetIcon,
  ShieldCheckIcon,
  RocketIcon,
  TerminalIcon,
  Wand2Icon,
  PaletteIcon,
  LayoutTemplateIcon,
  MonitorPlayIcon,
  AlertCircleIcon,
  FileTextIcon,
  MinusIcon,
  PlusIcon,
  EqualIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function CatalystExamplePresentation() {
  const pathname = usePathname()
  const presentation = getPresentationByPath(pathname)
  
  // All navigation logic handled by the hook
  const {
    containerRef,
    activeSlide,
    totalSlides,
    slideLabels,
    scrollToSlide,
  } = usePresentationSlides()

  // Ref for scroll-driven animation on Slide 2 (example-specific)
  const slide2BackRef = React.useRef<HTMLDivElement>(null)

  // Scroll-driven micro-animation (Slide 2): rotate the back red layer based on
  // how "centered" the slide is in the viewport.
  React.useEffect(() => {
    const container = containerRef.current
    const back = slide2BackRef.current
    if (!container || !back) return

    const slides = container.querySelectorAll<HTMLElement>("[data-slide]")
    const slide2 = slides[1]
    if (!slide2) return

    let rafId: number | null = null

    const update = () => {
      rafId = null

      const containerRect = container.getBoundingClientRect()
      const slideRect = slide2.getBoundingClientRect()

      const containerCenter = containerRect.top + containerRect.height / 2
      const slideCenter = slideRect.top + slideRect.height / 2
      const distance = Math.abs(slideCenter - containerCenter)

      // t=1 when Slide 2 is centered, t=0 when it's ~one viewport away.
      const t = 1 - Math.min(distance / (containerRect.height / 2), 1)

      const minRotation = 2
      const maxRotation = 22
      const rotation = maxRotation + (minRotation - maxRotation) * t

      back.style.setProperty("--catalyst-slide2-rot", `${rotation.toFixed(2)}deg`)
    }

    const schedule = () => {
      if (rafId != null) return
      rafId = window.requestAnimationFrame(update)
    }

    schedule()
    container.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      if (rafId != null) window.cancelAnimationFrame(rafId)
      container.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [containerRef])

  return (
    <SlidesShell 
      title={presentation?.title ?? "Presentation"} 
      addendum={presentation?.addendum}
    >
      <SlideDots
        total={totalSlides}
        active={activeSlide}
        labels={slideLabels}
        onDotClick={scrollToSlide}
      />

      <SlideContainer ref={containerRef}>
        <Comment text="Slide: Title" />
        <Slide
          slug="title"
          label="Title"
          className="relative overflow-hidden bg-background"
          innerClassName="items-center px-8 py-20"
        >
          <div className="present-slide__background bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-70" />
          <div className="present-blob -bottom-32 -left-32 h-96 w-96" />

          <div className="present-slide__content max-w-4xl text-center my-auto">
            <div className="mb-8">
              <SectionBadge icon={SparklesIcon}>Example Presentation</SectionBadge>
            </div>
            <h1 className="mb-6 text-5xl font-extrabold tracking-tighter md:text-7xl lg:text-8xl text-balance animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              Storytelling, <br />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Reimagined.
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground md:text-2xl text-balance animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Stop fighting with drag-and-drop tools. Start building presentations with the same
              power you build apps.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-600">
              <Button
                size="lg"
                className="rounded-full border-none px-8 h-14 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                onClick={() => scrollToSlide(1)}
              >
                Start the Show
                <ChevronDownIcon className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          {activeSlide === 0 && <ScrollHint className="animate-bounce" />}
        </Slide>

        <Comment text="Slide: The Struggle" />
        <Slide slug="struggle" label="The Struggle" innerClassName="items-center px-8 py-20">
          <div className="present-slide__content grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto w-full my-auto">
            <div className="order-2 lg:order-1 relative">
              {/* Chaos Visual (auto-floats; hover pops badges sequentially) */}
              <div className="relative aspect-square max-w-md mx-auto group">
                <div className="absolute inset-0 catalyst-float-a group-hover:[animation-play-state:paused]">
                  <div
                    ref={slide2BackRef}
                    className={cn(
                      "h-full w-full bg-destructive/5 rounded-3xl border border-destructive/10",
                      "will-change-transform transition-all duration-300 ease-out",
                      "shadow-sm group-hover:shadow-md",
                      "group-hover:-translate-x-2 group-hover:-translate-y-2",
                      "group-hover:rotate-[6deg] group-hover:scale-[1.03]"
                    )}
                    style={{ transform: "rotate(var(--catalyst-slide2-rot, 3deg))" }}
                  />
                </div>

                <div className="absolute inset-0 catalyst-float-b group-hover:[animation-play-state:paused]">
                  <div className="h-full w-full bg-background rounded-3xl -rotate-3 border shadow-xl p-8 flex flex-col gap-4 will-change-transform transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-2xl">
                    <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-full bg-muted/50 rounded" />
                    <div className="h-4 w-5/6 bg-muted/50 rounded" />

                    <div className="flex-1 border-2 border-dashed border-destructive/20 rounded-xl flex items-center justify-center bg-destructive/5">
                      <span className="text-destructive/50 font-mono text-sm">
                        Alignment: Random
                      </span>
                    </div>

                    {/* Floating Error Badges */}
                    <Badge
                      variant="destructive"
                      className={cn(
                        "absolute -top-4 -right-4 rotate-12 shadow-lg px-4 py-2 text-base",
                        "will-change-transform transition-all duration-300 ease-out",
                        "group-hover:-translate-y-2 group-hover:shadow-xl group-hover:delay-0"
                      )}
                    >
                      Font missing!
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "absolute top-1/2 -left-8 -rotate-12 shadow-lg border-destructive/20 text-destructive",
                        "will-change-transform transition-all duration-300 ease-out",
                        "group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:delay-75"
                      )}
                    >
                      v2_final_FINAL.pptx
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "absolute -bottom-4 right-8 rotate-6 bg-background shadow-lg",
                        "will-change-transform transition-all duration-300 ease-out",
                        "group-hover:-translate-y-1 group-hover:shadow-xl group-hover:delay-150"
                      )}
                    >
                      Point-and-click
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="mb-6">
                <SectionBadge icon={AlertCircleIcon} variant="destructive">
                  The Struggle
                </SectionBadge>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance">
                Presentations shouldn't be hard...
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                We build cutting-edge software all day, but time to present, and we're back in
                2010 fighting clunky UI.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <PainPointRow
                  icon={MousePointerClickIcon}
                  title="Point-click tedium"
                  description="Dragging boxes, aligning text, fighting margins."
                />
                <PainPointRow
                  icon={ClockIcon}
                  title="Slow to create"
                  description="Hours spent on visuals, not content."
                />
                <PainPointRow
                  icon={RefreshCwIcon}
                  title="Hard to iterate"
                  description="Change the brand? Rebuild every slide."
                />
                <PainPointRow
                  icon={LayersIcon}
                  title="Copy-paste chaos"
                  description="Duplicate the same card style 50 times."
                />
              </div>
            </div>
          </div>
        </Slide>

        <Comment text="Slide: The Insight" />
        <Slide
          slug="insight"
          label="The Insight"
          className="present-slide--tinted relative overflow-hidden"
          innerClassName="items-center px-8 py-20"
        >
          <div className="present-slide__background bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent opacity-70 dark:from-white/5" />
          <div className="present-blob top-1/4 left-1/4 w-64 h-64 catalyst-float-a" />
          <div className="present-blob bottom-1/4 right-1/4 w-96 h-96 catalyst-float-b" />

          <div className="present-slide__content max-w-5xl w-full flex flex-col items-center my-auto">
            <div className="mb-8">
              <SectionBadge icon={SparklesIcon}>The Insight</SectionBadge>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl text-center text-balance mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              We were already solving this.
            </h2>
            <p className="text-lg md:text-2xl text-muted-foreground dark:text-white/80 text-center max-w-3xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
              Our landing pages were engaging, easy to build, and reusable.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              <GlassCard
                icon={LayoutTemplateIcon}
                title="Same Components"
                description="Don't rebuild. Reuse."
              />
              <GlassCard
                icon={PaletteIcon}
                title="Same Design System"
                description="Brand consistency built-in."
              />
              <GlassCard icon={BrainIcon} title="Same AI" description="Generative structure." />
            </div>

            <div className="w-full max-w-2xl mx-auto border-t border-primary/10 dark:border-white/10 pt-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <p className="text-lg md:text-xl text-muted-foreground dark:text-white/80">
                Why not presentations too?
              </p>
            </div>
          </div>
        </Slide>

        <Comment text="Slide: The Shift" />
        <Slide
          slug="shift"
          label="The Shift"
          className="relative overflow-hidden"
          innerClassName="items-center px-8 py-20"
        >
          <div className="present-slide__background bg-background dark:bg-[#0A0A0A]" />
          <div className="present-slide__background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-80 dark:from-primary/20 dark:opacity-100" />
          <div className="present-blob -top-24 left-1/2 h-80 w-[60rem] -translate-x-1/2" />

          <div className="present-slide__content max-w-5xl mx-auto w-full my-auto">
            <div className="text-center mb-12">
              <div className="mb-6">
                <SectionBadge icon={ZapIcon}>Paradigm Shift</SectionBadge>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-balance">
                AI bridges the gap between <br />
                <span className="text-tertiary">Content</span> and{" "}
                <span className="text-primary">Code</span>.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Old Way Card */}
              <div className="group relative overflow-hidden rounded-3xl border border-destructive/20 bg-background/60 dark:bg-white/5 p-8 shadow-sm backdrop-blur-sm transition-all hover:bg-background/70 dark:hover:bg-white/10 dark:hover:border-destructive/50 dark:hover:shadow-[0_0_40px_-10px_var(--color-destructive)]">
                <div className="pointer-events-none absolute -inset-12 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100 bg-destructive/5 dark:opacity-0" />

                <div className="absolute left-6 top-6 z-10">
                  <Badge
                    variant="destructive"
                    className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20"
                  >
                    Before
                  </Badge>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <FileTextIcon className="h-32 w-32" />
                </div>
                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-2 text-muted-foreground">The Manual Loop</h3>
                  <p className="text-sm text-muted-foreground/80 mb-6">
                    Separate tools. No connection.
                  </p>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex gap-3">
                      <MinusIcon className="h-5 w-5 text-destructive/50 shrink-0" />
                      <span>Write draft in Docs</span>
                    </li>
                    <li className="flex gap-3">
                      <MinusIcon className="h-5 w-5 text-destructive/50 shrink-0" />
                      <span>Copy-paste to Slides</span>
                    </li>
                    <li className="flex gap-3">
                      <MinusIcon className="h-5 w-5 text-destructive/50 shrink-0" />
                      <span>Re-format everything</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* New Way Card */}
              <div className="group relative overflow-hidden rounded-3xl border border-primary/30 bg-background/60 dark:bg-white/5 p-8 shadow-lg backdrop-blur-sm transition-all hover:scale-[1.02] dark:border-primary dark:shadow-[0_0_40px_-10px_var(--color-primary)]">
                <div className="pointer-events-none absolute -inset-12 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100 bg-primary/15" />
                <div className="absolute left-6 top-6 z-10">
                  <Badge className="bg-primary text-primary-foreground">Now</Badge>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <SparklesIcon className="h-32 w-32 text-primary" />
                </div>
                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-2 text-primary">The Catalyst Flow</h3>
                  <p className="text-sm text-muted-foreground dark:text-primary-foreground/70 mb-6">
                    Unified workflow. Co-writer.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-center">
                      <CheckIcon className="h-5 w-5 text-primary shrink-0" />
                      <span className="font-medium">"Hey Claude, make a slide..."</span>
                    </li>
                    <li className="flex gap-3 items-center">
                      <CheckIcon className="h-5 w-5 text-primary shrink-0" />
                      <span>AI generates structure + code</span>
                    </li>
                    <li className="flex gap-3 items-center">
                      <CheckIcon className="h-5 w-5 text-primary shrink-0" />
                      <span className="inline-flex items-center gap-2">
                        Ship it <RocketIcon className="h-4 w-4" />
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        <Comment text="Slide: The Features" />
        <Slide
          slug="features"
          label="The Features"
          className="present-slide--tinted relative overflow-hidden"
          innerClassName="items-center px-8 py-20"
        >
          <div className="present-slide__background bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent opacity-70 dark:from-white/5" />
          <div className="present-blob top-1/4 left-1/4 w-64 h-64 catalyst-float-a" />
          <div className="present-blob bottom-1/4 right-1/4 w-96 h-96 catalyst-float-b" />

          <div className="present-slide__content max-w-6xl w-full my-auto">
            <div className="text-center mb-12">
              <div className="mb-6">
                <SectionBadge icon={LayersIcon}>The Features</SectionBadge>
              </div>
              <h2 className="text-4xl font-bold md:text-5xl mb-4">First-Class Citizen</h2>
              <p className="text-xl text-muted-foreground dark:text-white/80">
                Treat your slide decks like products.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[180px]">
              {/* Large Card */}
              <div className="present-card-glass md:col-span-2 row-span-2 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                <div>
                  <div className="present-icon lg rounded-2xl mb-6">
                    <CodeIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Code-First Control</h3>
                  <p className="text-muted-foreground dark:text-white/70 text-lg">
                    Version controlled. Diffable. Reviewable. Your presentations live in your repo,
                    evolve with your product, and never get "lost" in a Drive folder.
                  </p>
                </div>
                <div className="mt-8 rounded-xl bg-muted/50 dark:bg-black/20 p-4 font-mono text-xs text-muted-foreground dark:text-white/60 border dark:border-white/10">
                  <div className="flex gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <p className="text-primary dark:text-white">git commit -m "Update pricing slide"</p>
                  <p>git push</p>
                </div>
              </div>

              {/* Tall Card */}
              <div className="present-card-glass row-span-2 rounded-3xl p-8 flex flex-col">
                <div className="h-12 w-12 rounded-2xl bg-orange-500/10 dark:bg-white/10 flex items-center justify-center mb-6 text-orange-500 dark:text-white">
                  <LayoutTemplateIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Component System</h3>
                <p className="text-muted-foreground dark:text-white/70 mb-8">
                  Don't rebuild the button. Import it. Use your actual design system.
                </p>
                <div className="flex-1 bg-muted/30 dark:bg-black/20 rounded-xl border border-dashed dark:border-white/10 flex items-center justify-center p-4">
                  <Button>Button Component</Button>
                </div>
              </div>

              {/* Small Cards */}
              <div className="present-card-glass rounded-3xl p-6 flex flex-col justify-center">
                <Wand2Icon className="h-8 w-8 text-purple-500 dark:text-white mb-3" />
                <h3 className="font-bold">AI Assisted</h3>
                <p className="text-sm text-muted-foreground dark:text-white/70">
                  Draft content & code instantly.
                </p>
              </div>

              <div className="present-card-glass rounded-3xl p-6 flex flex-col justify-center">
                <MonitorPlayIcon className="h-8 w-8 text-blue-500 dark:text-white mb-3" />
                <h3 className="font-bold">Present Anywhere</h3>
                <p className="text-sm text-muted-foreground dark:text-white/70">
                  Responsive & web-native.
                </p>
              </div>

              <div className="present-card-glass rounded-3xl p-6 flex flex-col justify-center">
                <PaletteIcon className="h-8 w-8 text-pink-500 dark:text-white mb-3" />
                <h3 className="font-bold">Themable</h3>
                <p className="text-sm text-muted-foreground dark:text-white/70">
                  Dark mode included.
                </p>
              </div>
            </div>
          </div>
        </Slide>

        <Comment text="Slide: The Result" />
        <Slide
          slug="result"
          label="The Result"
          className="present-slide--tinted relative overflow-hidden"
          innerClassName="items-center px-8 py-20"
        >
          <div className="present-slide__background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="present-slide__background bg-[radial-gradient(circle_800px_at_50%_200px,var(--tw-gradient-stops))] from-primary/20 via-background to-transparent" />

          <div className="present-slide__content max-w-5xl w-full flex flex-col items-center text-center my-auto">
            <div className="mb-8">
              <SectionBadge icon={TerminalIcon}>The Result</SectionBadge>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              <span className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent dark:from-white dark:to-white/60">
                A few prompts,
              </span>
              <br />
              <span className="text-primary">~800 lines of code.</span>
            </h2>

            <p className="text-xl text-muted-foreground max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 dark:text-white/80">
              No drag-and-drop. No alignment struggles. Just React components and Tailwind CSS,
              generated by AI.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <StatCard icon={LayersIcon} value="10" label="Slides" />
              <StatCard icon={ClockIcon} value="< 10m" label="Build Time" />
              <StatCard icon={ZapIcon} value="< $0.01" label="AI Cost" />
              <StatCard icon={CheckIcon} value="100%" label="Ready to Ship" />
            </div>
          </div>
        </Slide>

        <Comment text="Slide: Why Catalyst" />
        <Slide
          slug="catalyst"
          label="Why Catalyst"
          className="present-slide--tinted relative overflow-hidden"
          innerClassName="px-8 py-20"
        >
          <div className="present-slide__background bg-[radial-gradient(circle_800px_at_50%_200px,var(--tw-gradient-stops))] from-primary/20 via-background to-transparent" />

          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-16 w-1 bg-primary rounded-full" />
              <div>
                <h2 className="text-4xl font-bold md:text-5xl">Why Catalyst?</h2>
                <p className="text-muted-foreground dark:text-white/80 text-lg">
                  More than just slides. It's a delivery system.
                </p>
                <p className="text-sm text-muted-foreground/60 dark:text-white/50 mt-1">
                  This slide scrolls to demonstrate in-slide overflow.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <ExpandableCard
                icon={ZapIcon}
                title="Speed without Chaos"
                color="text-yellow-500"
                bg="bg-yellow-500/10"
              >
                <p className="mb-4">
                  AI builds fast—but often builds the wrong thing. Catalyst provides structured
                  checkpoints (Brief, Build, Review, Refine) that keep speed aligned with stakeholder
                  expectations.
                </p>
                <div className="flex gap-2 text-sm font-medium">
                  <Badge variant="secondary">Workshop → Proof in ~1 week</Badge>
                  <Badge variant="secondary">No surprises</Badge>
                </div>
              </ExpandableCard>

              <ExpandableCard
                icon={LayersIcon}
                title="Staged Quality"
                color="text-blue-500"
                bg="bg-blue-500/10"
              >
                <p className="mb-4">
                  Prototypes should feel like prototypes. Production should feel safe. Catalyst
                  stages set clear expectations so you don't over-engineer early or ship junk late.
                </p>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono mt-2">
                  <div className="bg-muted p-2 rounded">POC</div>
                  <div className="bg-muted p-2 rounded">MVP</div>
                  <div className="bg-muted p-2 rounded">MMP</div>
                  <div className="bg-primary/20 p-2 rounded text-primary font-bold">PROD</div>
                </div>
              </ExpandableCard>

              <ExpandableCard
                icon={TargetIcon}
                title="Smart Stacks"
                color="text-green-500"
                bg="bg-green-500/10"
              >
                <p>
                  Begin with Next.js static. Add Supabase when you need auth. Graduate to Laravel
                  for complex backends. No commitment until needed.
                </p>
              </ExpandableCard>

              <ExpandableCard
                icon={ShieldCheckIcon}
                title="Knowledge Transfer"
                color="text-purple-500"
                bg="bg-purple-500/10"
              >
                <p>
                  Decisions are captured where AI can see them. New team members onboard in hours,
                  not weeks. The "hero lead" bottleneck dissolves.
                </p>
              </ExpandableCard>
            </div>
            <div className="h-20" />
          </div>
        </Slide>

        <Comment text="Slide: The Stack" />
        <Slide
          slug="stack"
          label="The Stack"
          className="present-slide--tinted relative overflow-hidden"
          innerClassName="items-center px-8 py-20"
        >
          <div className="present-slide__background bg-[radial-gradient(circle_800px_at_50%_200px,var(--tw-gradient-stops))] from-primary/20 via-background to-transparent" />

          <div className="present-slide__content max-w-md w-full flex flex-col items-center gap-4 my-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2">The Stack</h2>
              <p className="text-muted-foreground dark:text-white/80">
                Built on the tools you already trust.
              </p>
            </div>
            <div className="present-card-glow w-full p-6 flex flex-col items-center text-center">
              <h3 className="font-bold text-lg dark:text-white">Next.js & React</h3>
              <p className="text-sm text-muted-foreground dark:text-white/70">The Foundation</p>
            </div>
            <PlusIcon className="h-6 w-6 text-primary dark:text-white" />
            <div className="present-card-glow w-full p-6 flex flex-col items-center text-center">
              <h3 className="font-bold text-lg dark:text-white">Shadcn & Tailwind 4</h3>
              <p className="text-sm text-muted-foreground dark:text-white/70">The Design System</p>
            </div>
            <PlusIcon className="h-6 w-6 text-primary dark:text-white" />
            <div className="present-card-glow w-full p-6 flex flex-col items-center text-center">
              <h3 className="font-bold text-lg dark:text-white">AI Agents</h3>
              <p className="text-sm text-muted-foreground dark:text-white/70">The Engine</p>
            </div>
            <EqualIcon className="h-6 w-6 text-primary dark:text-white" />
            <div className="w-full bg-primary/10 dark:bg-primary/20 border border-primary rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_40px_-10px_var(--color-primary)]">
              <h3 className="font-bold text-2xl text-primary dark:text-white">Catalyst</h3>
              <p className="text-sm text-primary/70 dark:text-white/80">The Outcome</p>
            </div>
          </div>
        </Slide>

        <Comment text="Slide: The Process" />
        <Slide
          slug="process"
          label="The Process"
          className="present-slide--tinted relative overflow-hidden"
          innerClassName="items-center px-8 py-20"
        >
          <div className="present-slide__background bg-[radial-gradient(circle_800px_at_50%_200px,var(--tw-gradient-stops))] from-primary/20 via-background to-transparent" />

          <div className="present-slide__content max-w-6xl w-full my-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                The <span className="text-primary dark:text-white">Workflow</span>
              </h2>
              <p className="text-xl text-muted-foreground dark:text-white/80">
                Stop dragging rectangles. Start shipping.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="relative group">
                <div className="present-card-glow p-8 h-48 flex flex-col justify-center items-center text-center">
                  <h3 className="font-bold text-xl mb-2 dark:text-white">Prompt</h3>
                  <p className="text-sm text-muted-foreground dark:text-white/70">
                    Describe your story
                    <br />
                    in plain English
                  </p>
                </div>
                <ArrowRightIcon className="hidden md:block absolute -right-8 top-1/2 -translate-y-1/2 text-primary dark:text-white h-6 w-6 z-10" />
              </div>
              <div className="relative group">
                <div className="present-card-glow p-8 h-48 flex flex-col justify-center items-center text-center">
                  <h3 className="font-bold text-xl mb-2 dark:text-white">Generate</h3>
                  <p className="text-sm text-muted-foreground dark:text-white/70">
                    AI scaffolds the
                    <br />
                    structure & components
                  </p>
                </div>
                <ArrowRightIcon className="hidden md:block absolute -right-8 top-1/2 -translate-y-1/2 text-primary dark:text-white h-6 w-6 z-10" />
              </div>
              <div className="relative group">
                <div className="bg-primary/10 dark:bg-primary/20 border border-primary rounded-2xl p-8 h-48 flex flex-col justify-center items-center text-center shadow-[0_0_40px_-10px_var(--color-primary)]">
                  <h3 className="font-bold text-xl mb-2 text-primary dark:text-white">Present</h3>
                  <p className="text-sm text-primary/70 dark:text-white/80">
                    Deploy to the web
                    <br />
                    and share the link
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-16 text-muted-foreground/60 dark:text-white/50 text-lg">
              Iterate in code. Commit to git.
            </div>
          </div>
        </Slide>

        <Comment text="Slide: Launch" />
        <Slide
          slug="launch"
          label="Launch"
          className="present-slide--tinted relative overflow-hidden"
          innerClassName="items-center px-8 py-20"
        >
          <div className="present-slide__background bg-[radial-gradient(circle_800px_at_50%_200px,var(--tw-gradient-stops))] from-primary/20 via-background to-transparent" />

          <div className="present-slide__content max-w-3xl text-center my-auto">
            <div className="relative inline-block">
              <RocketIcon className="mx-auto mb-8 h-20 w-20 animate-bounce text-primary dark:text-white" />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/20 dark:bg-white/20 blur-sm rounded-full animate-pulse" />
            </div>
            <h2 className="mb-8 text-5xl font-bold md:text-7xl tracking-tight">Your Turn.</h2>
            <p className="mb-12 text-2xl text-balance font-light text-muted-foreground dark:text-white/80">
              Ask AI to create a Presentation. <br />
              Tell your story, then ship.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6">
              <Button
                size="lg"
                variant="secondary"
                className="h-16 px-8 text-lg rounded-full shadow-xl hover:scale-105 transition-transform dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                onClick={() => scrollToSlide(0)}
              >
                <RotateCcwIcon className="mr-2 h-5 w-5" />
                Replay
              </Button>
              <Button
                size="lg"
                className="h-16 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-xl hover:scale-105 transition-transform text-primary-foreground"
                render={<Link href="/docs" />}
              >
                <BookOpenIcon className="mr-2 h-5 w-5" />
                Read the Docs
              </Button>
            </div>
          </div>
        </Slide>
      </SlideContainer>
    </SlidesShell>
  )
}

// -----------------------------------------------------------------------------
// Supporting Components (Example-specific)
// -----------------------------------------------------------------------------

/** Section badge — pill at top of slides to label the section */
function SectionBadge({
  icon: Icon,
  children,
  variant = "default",
}: {
  icon: React.ElementType
  children: React.ReactNode
  variant?: "default" | "destructive"
}) {
  return (
    <div
      className={cn(
        "present-badge animate-in fade-in slide-in-from-bottom-4 duration-700",
        variant === "destructive" && "destructive"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </div>
  )
}

/** Glass card — frosted glass card for feature grids */
function GlassCard({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: React.ElementType
  title: string
  description: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "present-card-glass group flex flex-col items-center text-center gap-4",
        className
      )}
    >
      <div className="present-icon lg rounded-full group-hover:scale-110 transition-transform">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <h3 className="font-bold text-xl mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground dark:text-white/70">{description}</p>
      </div>
    </div>
  )
}

function PainPointRow({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-start gap-2 p-4 rounded-xl bg-destructive/5 border border-destructive/10 transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-destructive" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="present-card-glow group relative overflow-hidden p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="present-icon md rounded-full p-3">
          <Icon className="h-6 w-6" />
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold tracking-tight dark:text-white">{value}</div>
          <div className="text-sm font-medium text-muted-foreground dark:text-white/70">
            {label}
          </div>
        </div>
      </div>
    </div>
  )
}

function ExpandableCard({
  icon: Icon,
  title,
  children,
  color,
  bg,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
  color: string
  bg: string
}) {
  return (
    <div className="present-card-glow group p-6">
      <div className="flex items-start gap-4">
        <div className={cn("rounded-xl p-3 transition-transform group-hover:scale-110", bg)}>
          <Icon className={cn("h-6 w-6", color)} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary dark:text-white transition-colors">
            {title}
          </h3>
          <div className="text-muted-foreground dark:text-white/70 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
