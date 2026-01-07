/**
 * CATALYST - Testimonial Card Component
 *
 * Displays a client testimonial in card format.
 * Used on the homepage and about page.
 */

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { type Testimonial } from "@/lib/content-types"
import { QuoteIcon } from "lucide-react"

interface TestimonialCardProps {
  testimonial: Testimonial
  className?: string
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <Card
      className={cn(
        "testimonial-card relative overflow-hidden",
        className
      )}
    >
      {/* Quote Icon */}
      <QuoteIcon className="absolute top-4 right-4 h-8 w-8 text-primary/10" />

      <CardContent className="pt-6">
        {/* Quote */}
        <blockquote className="text-lg leading-relaxed mb-6 relative z-10">
          "{testimonial.quote}"
        </blockquote>

        {/* Author */}
        <footer className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {testimonial.authorName.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium text-sm">{testimonial.authorName}</div>
            {(testimonial.authorTitle || testimonial.authorLocation) && (
              <div className="text-xs text-muted-foreground">
                {testimonial.authorTitle && `${testimonial.authorTitle}, `}
                {testimonial.authorLocation}
              </div>
            )}
          </div>
        </footer>
      </CardContent>
    </Card>
  )
}
