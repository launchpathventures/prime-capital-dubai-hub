/**
 * Testimonial Edit Form
 *
 * Full-page form for creating/editing testimonials.
 * Simple layout since testimonials have fewer fields.
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Stack, Row, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeftIcon,
  Loader2Icon,
  SaveIcon,
  QuoteIcon,
  UserIcon,
  MapPinIcon,
} from "lucide-react"
import {
  createTestimonial,
  updateTestimonial,
  type TestimonialRow,
  type TestimonialInput,
} from "@/lib/actions/cms"
import { toast } from "@/components/ui/toast"

type TestimonialEditFormProps = {
  testimonial: TestimonialRow | null
}

export function TestimonialEditForm({ testimonial }: TestimonialEditFormProps) {
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
          router.push("/admin/testimonials")
          router.refresh()
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createTestimonial(input)
        if (result.success) {
          toast.success("Testimonial created successfully")
          router.push("/admin/testimonials")
          router.refresh()
        } else {
          toast.error(result.error)
        }
      }
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="xl">
        {/* Page Header */}
        <Row justify="between" align="center" className="sticky top-0 z-10 bg-background py-4 border-b -mx-6 px-6">
          <Row gap="md" align="center">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => router.push("/admin/testimonials")}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Stack gap="none">
              <Title size="h4">{isEditing ? "Edit Testimonial" : "Add New Testimonial"}</Title>
              <Text size="sm" variant="muted">
                {isEditing ? `From ${testimonial.author}` : "Add a new client testimonial"}
              </Text>
            </Stack>
          </Row>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <SaveIcon className="h-4 w-4 mr-2" />
            )}
            {isEditing ? "Save Changes" : "Create Testimonial"}
          </Button>
        </Row>

        {/* Main Content - Two Column Layout */}
        <Grid cols={1} className="lg:grid-cols-[2fr_1fr] gap-8">
          {/* Left Column - Main Content */}
          <Stack gap="lg">
            {/* Quote Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <QuoteIcon className="h-4 w-4" />
                  Testimonial Quote
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Stack gap="md">
                  <div>
                    <Label htmlFor="quote">Quote *</Label>
                    <Textarea
                      id="quote"
                      name="quote"
                      defaultValue={testimonial?.quote}
                      placeholder="What the client said about their experience..."
                      rows={6}
                      required
                      className="text-base"
                    />
                    <Text size="xs" variant="muted" className="mt-1">
                      The full testimonial text that will be displayed on the website
                    </Text>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* Author Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Author Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Stack gap="md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="author">Author Name *</Label>
                      <Input
                        id="author"
                        name="author"
                        defaultValue={testimonial?.author}
                        placeholder="e.g. John Smith"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="location" className="flex items-center gap-1">
                        <MapPinIcon className="h-3 w-3" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        defaultValue={testimonial?.location || ""}
                        placeholder="e.g. London, UK"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="context">Context / Purchase Details</Label>
                    <Input
                      id="context"
                      name="context"
                      defaultValue={testimonial?.context || ""}
                      placeholder="e.g. Palm Jumeirah villa purchase"
                    />
                    <Text size="xs" variant="muted" className="mt-1">
                      Brief context about their purchase (shown below their name)
                    </Text>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          {/* Right Column - Sidebar */}
          <Stack gap="lg">
            {/* Preview Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-base">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack gap="md" className="p-4 bg-muted/50 rounded-lg">
                  <QuoteIcon className="h-6 w-6 text-muted-foreground" />
                  <Text className="italic text-sm leading-relaxed">
                    "{testimonial?.quote || "Your testimonial quote will appear here..."}"
                  </Text>
                  <Stack gap="xs">
                    <Text weight="medium" size="sm">
                      {testimonial?.author || "Author Name"}
                    </Text>
                    <Text size="xs" variant="muted">
                      {[testimonial?.context, testimonial?.location].filter(Boolean).join(" · ") || "Context · Location"}
                    </Text>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack gap="md">
                  <div>
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      name="display_order"
                      type="number"
                      defaultValue={testimonial?.display_order || 0}
                      placeholder="0"
                    />
                    <Text size="xs" variant="muted" className="mt-1">
                      Lower numbers appear first on the homepage
                    </Text>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Stack>
    </form>
  )
}
