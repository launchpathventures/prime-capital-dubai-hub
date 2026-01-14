/**
 * CATALYST - Document Figure Component
 * 
 * Displays reference documents (contracts, certificates) with:
 * - Thumbnail preview in content flow
 * - Click-to-zoom modal for detailed viewing
 * - Support for multi-page documents as galleries
 * - Caption and source attribution
 */

"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Text } from "@/components/core"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  ZoomInIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  FileTextIcon,
  XIcon
} from "lucide-react"

// =============================================================================
// TYPES
// =============================================================================

interface DocumentPage {
  src: string
  alt: string
}

interface DocumentFigureProps {
  /** Single image source or array for multi-page documents */
  src: string | DocumentPage[]
  /** Alt text for accessibility (used for single image) */
  alt?: string
  /** Caption displayed below the image */
  caption?: string
  /** Additional context or source attribution */
  source?: string
  /** Optional className for the container */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DocumentFigure({ 
  src, 
  alt = "Reference document",
  caption, 
  source,
  className 
}: DocumentFigureProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  
  // Normalize to array of pages
  const pages: DocumentPage[] = Array.isArray(src) 
    ? src 
    : [{ src, alt }]
  
  const isMultiPage = pages.length > 1
  const currentImage = pages[currentPage]
  
  const goToPrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : pages.length - 1))
  }
  
  const goToNext = () => {
    setCurrentPage((prev) => (prev < pages.length - 1 ? prev + 1 : 0))
  }

  return (
    <>
      {/* Thumbnail Preview */}
      <figure className={cn("my-8", className)}>
        <button
          onClick={() => setIsOpen(true)}
          className="group relative block w-full max-w-md mx-auto overflow-hidden rounded-lg border border-border bg-muted/30 transition-all hover:border-primary/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {/* Document Icon Badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
            <FileTextIcon className="h-3.5 w-3.5" />
            {isMultiPage ? `${pages.length} pages` : "Document"}
          </div>
          
          {/* Zoom Hint */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-primary/90 px-2.5 py-1 text-xs font-medium text-primary-foreground opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <ZoomInIcon className="h-3.5 w-3.5" />
            Click to enlarge
          </div>
          
          {/* Image */}
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={pages[0].src}
              alt={pages[0].alt}
              fill
              className="object-contain p-4 transition-transform group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
          
          {/* Multi-page indicator */}
          {isMultiPage && (
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {pages.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    idx === 0 ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          )}
        </button>
        
        {/* Caption */}
        {(caption || source) && (
          <figcaption className="mt-3 text-center">
            {caption && (
              <Text size="sm" className="text-muted-foreground">
                {caption}
              </Text>
            )}
            {source && (
              <Text size="xs" className="text-muted-foreground/70 mt-1">
                Source: {source}
              </Text>
            )}
          </figcaption>
        )}
      </figure>

      {/* Zoom Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0 bg-background/95 backdrop-blur-sm">
          <DialogTitle className="sr-only">
            {currentImage.alt}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isMultiPage 
              ? `Page ${currentPage + 1} of ${pages.length}. Use arrow buttons or keyboard to navigate.`
              : "Click outside or press escape to close."
            }
          </DialogDescription>
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
              <Text size="sm" className="font-medium">
                {caption || currentImage.alt}
              </Text>
              {isMultiPage && (
                <Text size="sm" className="text-muted-foreground">
                  — Page {currentPage + 1} of {pages.length}
                </Text>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          {/* Image Container */}
          <div className="relative flex-1 overflow-auto p-4">
            <div className="relative h-full w-full flex items-center justify-center">
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                width={800}
                height={1100}
                className="max-h-full w-auto object-contain"
                priority
              />
            </div>
          </div>
          
          {/* Navigation (multi-page only) */}
          {isMultiPage && (
            <div className="flex items-center justify-center gap-4 border-t border-border px-4 py-3">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevious}
                className="gap-1.5"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </Button>
              
              {/* Page indicators */}
              <div className="flex gap-2">
                {pages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors",
                      idx === currentPage 
                        ? "bg-primary" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                  >
                    <span className="sr-only">Go to page {idx + 1}</span>
                  </button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                className="gap-1.5"
              >
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
