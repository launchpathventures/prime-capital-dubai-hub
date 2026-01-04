/**
 * CATALYST - Placeholder Presentation
 *
 * Minimal 2-slide presentation to validate the presentation system.
 * This serves as a template for new presentations.
 */

"use client"

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
import Link from "next/link"
import { ArrowLeftIcon, RocketIcon } from "lucide-react"
import { getPresentationByPath } from "@/lib/navigation"

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function PlaceholderPresentation() {
  const pathname = usePathname()
  const presentation = getPresentationByPath(pathname)
  
  const {
    containerRef,
    activeSlide,
    totalSlides,
    slideLabels,
    scrollToSlide,
  } = usePresentationSlides()

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
        {/* Slide 1: Title */}
        <Slide
          slug="title"
          label="Title"
          className="bg-background"
          innerClassName="items-center justify-center px-8"
        >
          <div className="present-slide__content max-w-2xl text-center my-auto">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <RocketIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
              Your Presentation Title
            </h1>
            <p className="text-xl text-muted-foreground">
              Replace this with your story. Use the{" "}
              <code className="rounded bg-muted px-2 py-1 text-sm">usePresentationSlides</code>{" "}
              hook for navigation.
            </p>
          </div>
          {activeSlide === 0 && <ScrollHint />}
        </Slide>

        {/* Slide 2: Next Steps */}
        <Slide
          slug="next"
          label="Next Steps"
          className="bg-muted/30"
          innerClassName="items-center justify-center px-8"
        >
          <div className="present-slide__content max-w-2xl text-center my-auto">
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">Ready to Build?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Copy this file and start adding your slides. Each slide needs a{" "}
              <code className="rounded bg-muted px-2 py-1 text-sm">slug</code> and{" "}
              <code className="rounded bg-muted px-2 py-1 text-sm">label</code>.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" nativeButton={false} render={<Link href="/present" />}>
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Presentations
              </Button>
              <Button nativeButton={false} render={<Link href="/docs" />}>
                View the Docs
              </Button>
            </div>
          </div>
        </Slide>
      </SlideContainer>
    </SlidesShell>
  )
}
