/**
 * Testimonial Form Component
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Stack, Row, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2Icon } from "lucide-react"
import { 
  createTestimonial, 
  updateTestimonial, 
  type TestimonialRow, 
  type TestimonialInput 
} from "@/lib/actions/cms"
import { toast } from "@/components/ui/toast"

type TestimonialFormProps = {
  testimonial?: TestimonialRow
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TestimonialForm({ testimonial, open, onOpenChange }: TestimonialFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!testimonial

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    
    const input: TestimonialInput = {
      quote: formData.get("quote") as string,
      author: formData.get("author") as string,
      location: formData.get("location") as string || null,
      context: formData.get("context") as string || null,
      display_order: formData.get("display_order") ? Number(formData.get("display_order")) : 0,
    }

    try {
      if (isEditing) {
        const result = await updateTestimonial(testimonial.id, input)
        if (result.success) {
          toast.success("Testimonial updated successfully")
          onOpenChange(false)
          router.refresh()
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createTestimonial(input)
        if (result.success) {
          toast.success("Testimonial created successfully")
          onOpenChange(false)
          router.refresh()
        } else {
          toast.error(result.error)
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the testimonial details below." 
              : "Add a new client testimonial."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <div>
              <Label htmlFor="quote">Quote *</Label>
              <Textarea 
                id="quote" 
                name="quote" 
                defaultValue={testimonial?.quote}
                placeholder="What the client said..."
                rows={4}
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author">Author Name *</Label>
                <Input 
                  id="author" 
                  name="author" 
                  defaultValue={testimonial?.author}
                  placeholder="John Smith"
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location" 
                  defaultValue={testimonial?.location || ""}
                  placeholder="London, UK"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="context">Context</Label>
              <Input 
                id="context" 
                name="context" 
                defaultValue={testimonial?.context || ""}
                placeholder="e.g. Palm Jumeirah villa purchase"
              />
            </div>
            
            <div>
              <Label htmlFor="display_order">Display Order</Label>
              <Input 
                id="display_order" 
                name="display_order" 
                type="number"
                defaultValue={testimonial?.display_order || 0}
                placeholder="0"
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
                {isEditing ? "Save Changes" : "Add Testimonial"}
              </Button>
            </DialogFooter>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
