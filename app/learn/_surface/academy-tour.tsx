/**
 * CATALYST - Academy Tour
 *
 * Interactive onboarding tour modal for new trainees.
 * Step-by-step walkthrough of platform features.
 * Triggered by "Take a Tour" button on overview page and sidebar.
 */

"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  BookOpenIcon,
  MessageSquareIcon,
  AwardIcon,
  SparklesIcon,
  ClipboardCheckIcon,
  PlayCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  InfoIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Tour Slides Data
// -----------------------------------------------------------------------------

const tourSlides = [
  {
    id: "welcome",
    icon: PlayCircleIcon,
    title: "Welcome to the Academy",
    description: "This quick tour will show you how to get the most out of your training. It only takes a minute.",
    details: [
      "Complete training at your own pace",
      "Track your progress as you learn",
      "Get certified when you're ready",
    ],
  },
  {
    id: "modules",
    icon: BookOpenIcon,
    title: "Step 1: Learn",
    description: "Work through each competency in order. Every module includes:",
    details: [
      "Reading material to build understanding",
      "Audio narration so you can listen and learn",
      "A quiz to test what you've learned",
    ],
    tip: "Complete modules in order — each builds on the last.",
  },
  {
    id: "scenarios",
    icon: MessageSquareIcon,
    title: "Step 2: Practice with AI Scenarios",
    description: "Apply what you learn in realistic conversations with AI-powered clients.",
    details: [
      "Practice discovery calls, objection handling, and more",
      "Get feedback on your responses",
      "Build confidence before real client interactions",
    ],
    tip: "Find scenarios in the sidebar under 'Practice'.",
  },
  {
    id: "rera",
    icon: ClipboardCheckIcon,
    title: "Step 2: RERA Exam Prep",
    description: "Test your knowledge with official exam-style questions from the RERA question bank.",
    details: [
      "Practice questions organized by topic",
      "Track which areas need more study",
      "Be ready for your certification exam",
    ],
    tip: "Access RERA prep from the sidebar under 'Practice'.",
  },
  {
    id: "certification",
    icon: AwardIcon,
    title: "Step 3: Get Certified",
    description: "Complete all competencies and pass your final assessment to earn your Prime Capital certification.",
    details: [
      "Finish all required modules",
      "Pass each module quiz",
      "Complete the certification assessment",
    ],
    tip: "Check your progress anytime in 'My Progress'.",
  },
  {
    id: "coach",
    icon: SparklesIcon,
    title: "Your AI Coach",
    description: "Need help? Your AI Coach is always available to answer questions and provide guidance.",
    details: [
      "Ask about any training content",
      "Get help with scenarios",
      "Clarify concepts you're unsure about",
    ],
    tip: "Look for the chat button in the bottom right corner.",
  },
]

// -----------------------------------------------------------------------------
// Tour Modal Component
// -----------------------------------------------------------------------------

interface AcademyTourModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function AcademyTourModal({ open, onOpenChange }: AcademyTourModalProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  
  const slide = tourSlides[currentSlide]
  const isFirst = currentSlide === 0
  const isLast = currentSlide === tourSlides.length - 1
  
  const handleNext = () => {
    if (isLast) {
      onOpenChange(false)
      setCurrentSlide(0)
    } else {
      setCurrentSlide(currentSlide + 1)
    }
  }
  
  const handlePrev = () => {
    if (!isFirst) {
      setCurrentSlide(currentSlide - 1)
    }
  }
  
  const handleClose = () => {
    onOpenChange(false)
    setCurrentSlide(0)
  }
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="tour-modal sm:max-w-lg"
        showCloseButton={false}
      >
        {/* Progress Indicator */}
        <div className="tour-modal__progress">
          {tourSlides.map((_, index) => (
            <button
              key={index}
              className="tour-modal__progress-dot"
              data-active={index === currentSlide}
              data-complete={index < currentSlide}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Slide Content */}
        <div className="tour-modal__slide">
          <div className="tour-modal__icon">
            <slide.icon className="h-7 w-7" />
          </div>
          
          <h2 className="tour-modal__title">{slide.title}</h2>
          <p className="tour-modal__description">{slide.description}</p>
          
          <ul className="tour-modal__details">
            {slide.details.map((detail, i) => (
              <li key={i} className="tour-modal__detail">
                <CheckIcon className="tour-modal__detail-icon" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
          
          {slide.tip && (
            <div className="tour-modal__tip">
              <InfoIcon className="tour-modal__tip-icon" />
              <span>{slide.tip}</span>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <div className="tour-modal__nav">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={isFirst}
            className="gap-1"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Back
          </Button>
          
          <span className="tour-modal__counter">
            {currentSlide + 1} / {tourSlides.length}
          </span>
          
          <Button
            onClick={handleNext}
            className="gap-1"
          >
            {isLast ? (
              <>
                Get Started
                <CheckIcon className="h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// -----------------------------------------------------------------------------
// Tour Trigger Button (for hero section)
// -----------------------------------------------------------------------------

interface TourTriggerButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function TourTriggerButton({ 
  variant = "outline", 
  size = "default",
  className,
}: TourTriggerButtonProps) {
  const [open, setOpen] = React.useState(false)
  
  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        onClick={() => setOpen(true)}
        className={className}
      >
        <PlayCircleIcon className="h-4 w-4" />
        Take a Tour
      </Button>
      <AcademyTourModal open={open} onOpenChange={setOpen} />
    </>
  )
}

// -----------------------------------------------------------------------------
// Tour Sidebar Link (for sidebar navigation)
// -----------------------------------------------------------------------------

interface TourSidebarLinkProps {
  onNavigate?: () => void
}

export function TourSidebarLink({ onNavigate }: TourSidebarLinkProps) {
  const [open, setOpen] = React.useState(false)
  
  const handleClick = () => {
    setOpen(true)
    onNavigate?.()
  }
  
  return (
    <>
      <button
        type="button"
        className="learn-sidebar__nav-item"
        onClick={handleClick}
      >
        <InfoIcon className="learn-sidebar__nav-icon" />
        <span>How to Use</span>
      </button>
      <AcademyTourModal open={open} onOpenChange={setOpen} />
    </>
  )
}

// -----------------------------------------------------------------------------
// Inline Tour Summary (compact version for page)
// -----------------------------------------------------------------------------

export function AcademyTourSummary() {
  const [open, setOpen] = React.useState(false)
  
  return (
    <section className="lms-tour-summary" id="how-to-use">
      <div className="lms-tour-summary__content">
        <div className="lms-tour-summary__icon">
          <PlayCircleIcon className="h-5 w-5" />
        </div>
        <div className="lms-tour-summary__text">
          <p className="lms-tour-summary__title">New to the Academy?</p>
          <p className="lms-tour-summary__description">
            Take a quick tour to learn how to get the most out of your training.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setOpen(true)}
          className="lms-tour-summary__button"
        >
          Take a Tour
        </Button>
      </div>
      <AcademyTourModal open={open} onOpenChange={setOpen} />
    </section>
  )
}

// Keep old export name for backwards compatibility during transition
export { AcademyTourSummary as AcademyTour }
