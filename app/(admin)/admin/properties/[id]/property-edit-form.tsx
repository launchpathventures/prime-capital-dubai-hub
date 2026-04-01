/**
 * Property Edit Form
 *
 * Full-page form for creating/editing properties.
 * Fields ordered by frontend impact — what makes the listing look good comes first.
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Stack, Row, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUpload } from "@/components/shared/image-upload"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import {
  ArrowLeftIcon,
  Loader2Icon,
  SaveIcon,
  EyeIcon,
  TrashIcon,
  BedDoubleIcon,
  RulerIcon,
  CalendarIcon,
  BuildingIcon,
  TagIcon,
  HelpCircleIcon,
  ChevronDownIcon,
  MapPinIcon,
  LinkIcon,
  DollarSignIcon,
  ImageIcon,
  CopyIcon,
  CheckIcon,
  SparklesIcon,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import {
  createProperty,
  updateProperty,
  deleteProperty,
  type PropertyRow,
  type PropertyInput,
} from "@/lib/actions/cms"
import { generateSlug } from "@/lib/utils"
import { toast } from "@/components/ui/toast"

type PropertyEditFormProps = {
  property: PropertyRow | null
}

const PROPERTY_TYPES = [
  { value: "villa", label: "Villa" },
  { value: "apartment", label: "Apartment" },
  { value: "penthouse", label: "Penthouse" },
  { value: "townhouse", label: "Townhouse" },
  { value: "mansion", label: "Mansion" },
]

const PROPERTY_STATUS = [
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
  { value: "off-plan", label: "Off-Plan" },
  { value: "coming-soon", label: "Coming Soon" },
]

const CURRENCIES = [
  { value: "AED", label: "AED" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
]

// Prompt template for AI-assisted property content generation
const AI_PROMPT = `I need you to help me create content for a Dubai real estate property listing. I'll give you the raw details and you produce the fields I need.

Here's the property info:
[PASTE YOUR PROPERTY DETAILS HERE — developer brochure, notes, listing sheet, etc.]

Based on that, produce the following in a copy-pasteable format:

1. **Property Title** — concise, e.g. "Sobha One Tower D — 1 Bed + Study". Format: [Project Name] [Building/Phase if relevant] — [Unit type]. Keep it short.

2. **Description** (3-5 sentences) — factual, restrained tone. Mention: location highlights, unit layout, key views, completion status, payment plan if relevant. No urgency language or superlatives.

3. **Features** (4-6 items, comma-separated) — the standout selling points. E.g. "Full Golf Course View, High Floor, Premium Finishes, Smart Home, Covered Parking". Focus on what differentiates this unit.

4. **Price From / Price To** — if it's a distressed/resale deal, Price From = asking price, Price To = original price. If it's a new launch with a range, use the unit price range.

5. **Bedrooms** — format as "1", "2", or a range like "1-3" if multiple configurations.

6. **Size** — size range in sq ft if available.

7. **Completion Date** — format as "Q4 2026" or "Ready".

Keep the tone aligned with a premium real estate advisory — factual, concise, no hype.`

export function PropertyEditForm({ property }: PropertyEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)
  const isEditing = !!property

  async function handleDelete() {
    if (!property) return
    setIsDeleting(true)
    try {
      const result = await deleteProperty(property.id)
      if (result.success) {
        toast.success("Property deleted")
        router.push("/admin/properties")
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Failed to delete property")
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const [coverImage, setCoverImage] = useState<string | null>(property?.cover_image || null)
  const [isDistressed, setIsDistressed] = useState(property?.tags?.includes("distressed") || false)
  const [isPublished, setIsPublished] = useState(property?.published !== false)

  // Auto-generate slug from title
  const [title, setTitle] = useState(property?.title || "")
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [slugValue, setSlugValue] = useState(property?.slug || "")

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (!slugManuallyEdited) {
      setSlugValue(generateSlug(newTitle))
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugManuallyEdited(true)
    setSlugValue(e.target.value)
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(AI_PROMPT)
    setPromptCopied(true)
    toast.success("AI prompt copied to clipboard")
    setTimeout(() => setPromptCopied(false), 2000)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    const input: PropertyInput = {
      slug: slugValue || generateSlug(title),
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      location: formData.get("location") as string,
      city: formData.get("city") as string || null,
      country: formData.get("country") as string || "UAE",
      developer: formData.get("developer") as string || null,
      developer_website: formData.get("developer_website") as string || null,
      project_website: formData.get("project_website") as string || null,
      price: null,
      price_from: formData.get("price_from") ? Number(formData.get("price_from")) : null,
      price_to: formData.get("price_to") ? Number(formData.get("price_to")) : null,
      currency: formData.get("currency") as string || "AED",
      status: formData.get("status") as string || "available",
      sale_status: formData.get("sale_status") as string || null,
      completion_date: formData.get("completion_date") as string || null,
      bedrooms: formData.get("bedrooms") as string || null,
      bathrooms: formData.get("bathrooms") ? Number(formData.get("bathrooms")) : null,
      size_from: formData.get("size_from") ? Number(formData.get("size_from")) : null,
      size_to: formData.get("size_to") ? Number(formData.get("size_to")) : null,
      size_unit: formData.get("size_unit") as string || "sq ft",
      description: formData.get("description") as string || null,
      features: (formData.get("features") as string)?.split(",").map(f => f.trim()).filter(Boolean) || null,
      cover_image: coverImage,
      images: (formData.get("images") as string)?.split(",").map(i => i.trim()).filter(Boolean) || null,
      tags: isDistressed ? ["distressed"] : [],
      published: isPublished,
      featured: formData.get("featured") === "on",
      display_order: formData.get("display_order") ? Number(formData.get("display_order")) : 0,
    }

    try {
      if (isEditing) {
        const result = await updateProperty(property.id, input)
        if (result.success) {
          toast.success("Property updated successfully")
          router.push("/admin/properties")
          router.refresh()
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createProperty(input)
        if (result.success) {
          toast.success("Property created successfully")
          router.push("/admin/properties")
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
      <Stack gap="lg">
        {/* Page Header */}
        <div className="sticky top-0 z-20 -mx-6 px-6 py-3 border-b bg-background/80 backdrop-blur-lg">
          <Row justify="between" align="center">
            <Row gap="sm" align="center">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => router.push("/admin/properties")}
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              <div>
                <Title size="h4">{isEditing ? "Edit Property" : "New Property"}</Title>
                {isEditing && property.title && (
                  <Text size="xs" variant="muted" className="mt-0.5">{property.title}</Text>
                )}
              </div>
            </Row>
            <Row gap="sm">
              {/* Copy AI Prompt */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyPrompt}
              >
                {promptCopied ? (
                  <CheckIcon className="h-4 w-4 mr-1.5" />
                ) : (
                  <SparklesIcon className="h-4 w-4 mr-1.5" />
                )}
                {promptCopied ? "Copied" : "AI Prompt"}
              </Button>

              {isEditing && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <TrashIcon className="h-4 w-4 mr-1.5" />
                  Delete
                </Button>
              )}
              {isEditing && property.slug && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  render={<Link href={`/properties/${property.slug}`} target="_blank" />}
                >
                  <EyeIcon className="h-4 w-4 mr-1.5" />
                  Preview
                </Button>
              )}
              <Button type="submit" size="sm" disabled={isLoading}>
                {isLoading ? (
                  <Loader2Icon className="h-4 w-4 mr-1.5 animate-spin" />
                ) : (
                  <SaveIcon className="h-4 w-4 mr-1.5" />
                )}
                {isEditing ? "Save Changes" : "Create Property"}
              </Button>
            </Row>
          </Row>
        </div>

        {/* Main Content - Two Column Layout */}
        <Grid cols={1} className="lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Left Column - Main Content */}
          <Stack gap="lg">
            {/* ─── Section 1: Headline — title, type, location, price ─── */}
            <Card>
              <CardContent className="p-5">
                <Stack gap="lg">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title <span className="text-destructive">*</span></Label>
                    <Input
                      id="title"
                      name="title"
                      value={title}
                      onChange={handleTitleChange}
                      placeholder="e.g. Sobha One Tower D — 1 Bed + Study"
                      required
                    />
                    <Text size="xs" variant="muted">
                      The main headline on cards and the detail page hero
                    </Text>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type <span className="text-destructive">*</span></Label>
                      <Select name="type" defaultValue={property?.type || "apartment"} items={PROPERTY_TYPES}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROPERTY_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status <span className="text-destructive">*</span></Label>
                      <Select name="status" defaultValue={property?.status || "available"} items={PROPERTY_STATUS}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROPERTY_STATUS.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">
                        <MapPinIcon className="h-3 w-3 inline mr-1" />
                        Location <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        defaultValue={property?.location}
                        placeholder="e.g. Sobha Hartland, MBR City"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="developer">Developer</Label>
                      <Input
                        id="developer"
                        name="developer"
                        defaultValue={property?.developer || ""}
                        placeholder="e.g. Emaar"
                      />
                    </div>
                  </div>

                  <div className="border-t" />

                  {/* Pricing */}
                  <div>
                    <Text size="sm" weight="semibold" className="mb-3 flex items-center gap-1.5">
                      <DollarSignIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      Pricing
                    </Text>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price_from">Price From</Label>
                        <Input
                          id="price_from"
                          name="price_from"
                          type="number"
                          defaultValue={property?.price_from || ""}
                          placeholder="1750000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price_to">Price To</Label>
                        <Input
                          id="price_to"
                          name="price_to"
                          type="number"
                          defaultValue={property?.price_to || ""}
                          placeholder="1870000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select name="currency" defaultValue={property?.currency || "AED"} items={CURRENCIES}>
                          <SelectTrigger>
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {CURRENCIES.map(c => (
                              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {isDistressed && (
                      <Text size="xs" variant="muted" className="mt-2">
                        Distressed: Price From = asking price, Price To = original price
                      </Text>
                    )}
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* ─── Section 2: Specifications — metrics bar on detail page ─── */}
            <Card>
              <CardContent className="p-5">
                <Text size="sm" weight="semibold" className="mb-3 flex items-center gap-1.5">
                  <RulerIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  Specifications
                </Text>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms" className="flex items-center gap-1">
                      <BedDoubleIcon className="h-3 w-3" />
                      Beds
                    </Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      defaultValue={property?.bedrooms || ""}
                      placeholder="1-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Baths</Label>
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      defaultValue={property?.bathrooms || ""}
                      placeholder="2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size_from">Size From</Label>
                    <Input
                      id="size_from"
                      name="size_from"
                      type="number"
                      defaultValue={property?.size_from || ""}
                      placeholder="740"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size_to">Size To</Label>
                    <Input
                      id="size_to"
                      name="size_to"
                      type="number"
                      defaultValue={property?.size_to || ""}
                      placeholder="1200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="completion_date" className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      Completion Date
                    </Label>
                    <Input
                      id="completion_date"
                      name="completion_date"
                      defaultValue={property?.completion_date || ""}
                      placeholder="Q4 2026"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ─── Section 3: Description & Features — detail page content ─── */}
            <Card>
              <CardContent className="p-5">
                <Text size="sm" weight="semibold" className="mb-3">Description & Features</Text>
                <Stack gap="md">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={property?.description || ""}
                      placeholder="Property description — shown as the main body text on the detail page..."
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="features">Features</Label>
                    <Input
                      id="features"
                      name="features"
                      defaultValue={property?.features?.join(", ") || ""}
                      placeholder="Full Golf Course View, High Floor, 60% Paid by Seller"
                    />
                    <Text size="xs" variant="muted">
                      Separate with commas — shown as a checklist on the detail page
                    </Text>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* ─── Section 4: Images ─── */}
            <Card>
              <CardContent className="p-5">
                <Text size="sm" weight="semibold" className="mb-3 flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  Images
                </Text>
                <Stack gap="md">
                  <ImageUpload
                    label="Cover Image"
                    value={coverImage}
                    onChange={setCoverImage}
                    folder="properties"
                    aspectRatio="video"
                    placeholder="Upload a cover image (used on property cards)"
                  />

                  <div className="space-y-2">
                    <Label htmlFor="images">Gallery Images</Label>
                    <Textarea
                      id="images"
                      name="images"
                      defaultValue={property?.images?.join(",\n") || ""}
                      placeholder="https://example.com/image1.jpg,&#10;https://example.com/image2.jpg"
                      rows={3}
                    />
                    <Text size="xs" variant="muted">
                      Comma-separated URLs. The <strong>first image</strong> becomes the detail page hero.
                    </Text>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          {/* Right Column - Sidebar */}
          <Stack gap="md" className="lg:sticky lg:top-16">
            {/* Publishing */}
            <Card>
              <CardContent className="p-5">
                <Text size="sm" weight="semibold" className="mb-4">Publishing</Text>
                <Stack gap="sm">
                  <Row align="center" justify="between" className="py-1">
                    <Label htmlFor="published" className="text-sm cursor-pointer">Published</Label>
                    <Switch
                      id="published"
                      checked={isPublished}
                      onCheckedChange={setIsPublished}
                    />
                  </Row>

                  <Row align="center" justify="between" className="py-1">
                    <Label htmlFor="featured" className="text-sm cursor-pointer">Featured</Label>
                    <Switch
                      id="featured"
                      name="featured"
                      defaultChecked={property?.featured || false}
                    />
                  </Row>

                  <Row align="center" justify="between" className="py-1">
                    <Label htmlFor="distressed" className="text-sm cursor-pointer flex items-center gap-1.5">
                      <TagIcon className="h-3 w-3" />
                      Distressed Sale
                    </Label>
                    <Switch
                      id="distressed"
                      checked={isDistressed}
                      onCheckedChange={setIsDistressed}
                    />
                  </Row>

                  {isDistressed && <DistressedHelpGuide />}
                </Stack>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardContent className="p-5">
                <Text size="sm" weight="semibold" className="mb-4">Additional Details</Text>
                <Stack gap="md">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-xs">City</Label>
                      <Input
                        id="city"
                        name="city"
                        defaultValue={property?.city || "Dubai"}
                        placeholder="Dubai"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-xs">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        defaultValue={property?.country || "UAE"}
                        placeholder="UAE"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-xs">URL Slug</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={slugValue}
                      onChange={handleSlugChange}
                      placeholder="auto-generated from title"
                    />
                    {slugValue && !slugManuallyEdited && (
                      <Text size="xs" variant="muted">Auto-generated from title</Text>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="display_order" className="text-xs">Display Order</Label>
                    <Input
                      id="display_order"
                      name="display_order"
                      type="number"
                      defaultValue={property?.display_order || 0}
                      placeholder="0"
                    />
                    <Text size="xs" variant="muted">
                      Lower numbers appear first
                    </Text>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardContent className="p-5">
                <Text size="sm" weight="semibold" className="mb-4 flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  Links
                </Text>
                <Stack gap="md">
                  <div className="space-y-2">
                    <Label htmlFor="developer_website" className="text-xs">Developer Website</Label>
                    <Input
                      id="developer_website"
                      name="developer_website"
                      type="url"
                      defaultValue={property?.developer_website || ""}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project_website" className="text-xs">Project Website</Label>
                    <Input
                      id="project_website"
                      name="project_website"
                      type="url"
                      defaultValue={property?.project_website || ""}
                      placeholder="https://..."
                    />
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardContent className="p-5">
                <Text size="sm" weight="semibold" className="mb-3">Preview</Text>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mb-3">
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BuildingIcon className="h-8 w-8 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
                <Row gap="sm" className="flex-wrap">
                  <Badge variant="outline" className="capitalize text-xs">
                    {property?.type || "apartment"}
                  </Badge>
                  {isDistressed && (
                    <Badge variant="secondary" className="text-xs">
                      <TagIcon className="h-3 w-3 mr-1" />
                      Distressed
                    </Badge>
                  )}
                  {!isPublished && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">Draft</Badge>
                  )}
                </Row>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

      </Stack>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{property?.title}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  )
}

// =============================================================================
// DISTRESSED HELP GUIDE
// Inline collapsible shown only when the distressed toggle is on.
// =============================================================================

function DistressedHelpGuide() {
  return (
    <div className="border border-orange-200 bg-orange-50/50 dark:border-orange-900 dark:bg-orange-950/20 rounded-md mt-2">
      <Collapsible>
        <CollapsibleTrigger
          render={<div role="button" tabIndex={0} />}
          className="group flex items-center justify-between w-full cursor-pointer p-3"
        >
          <Row gap="sm" align="center">
            <HelpCircleIcon className="h-4 w-4 text-orange-600 dark:text-orange-400 shrink-0" />
            <Text size="xs" weight="medium">Distressed listing guide</Text>
          </Row>
          <ChevronDownIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform group-data-[open]:rotate-180" />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-3 pb-3 pt-0">
            <Stack gap="sm" className="text-xs text-muted-foreground">
              <div>
                <Text size="xs" weight="medium" className="mb-1">Pricing</Text>
                <ul className="space-y-0.5 list-disc pl-4">
                  <li><strong>Price From</strong> = asking price (discounted)</li>
                  <li><strong>Price To</strong> = original / market price</li>
                </ul>
              </div>
              <div>
                <Text size="xs" weight="medium" className="mb-1">Description tips</Text>
                <ul className="space-y-0.5 list-disc pl-4">
                  <li>State the discount clearly</li>
                  <li>Mention payment plan status</li>
                  <li>Factual tone — no urgency language</li>
                </ul>
              </div>
              <div>
                <Text size="xs" weight="medium" className="mb-1">Features to include</Text>
                <ul className="space-y-0.5 list-disc pl-4">
                  <li>Payment split (e.g. &quot;60% Paid by Seller&quot;)</li>
                  <li>Price context (e.g. &quot;Below Original Price&quot;)</li>
                  <li>Standout specs — floor, views, layout</li>
                </ul>
              </div>
            </Stack>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
