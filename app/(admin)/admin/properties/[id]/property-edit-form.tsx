/**
 * Property Edit Form
 *
 * Full-page form for creating/editing properties.
 * Designed to mirror the live property page layout for intuitive editing.
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
} from "lucide-react"
import {
  createProperty,
  updateProperty,
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

export function PropertyEditForm({ property }: PropertyEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!property

  // Form state for controlled inputs
  const [coverImage, setCoverImage] = useState<string | null>(property?.cover_image || null)
  const [isDistressed, setIsDistressed] = useState(property?.tags?.includes("distressed") || false)
  const [isPublished, setIsPublished] = useState(property?.published !== false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    const input: PropertyInput = {
      slug: formData.get("slug") as string || generateSlug(formData.get("title") as string),
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      location: formData.get("location") as string,
      city: formData.get("city") as string || null,
      country: formData.get("country") as string || "UAE",
      developer: formData.get("developer") as string || null,
      developer_website: formData.get("developer_website") as string || null,
      project_website: formData.get("project_website") as string || null,
      price: formData.get("price") as string || null,
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

        {/* Distressed Property Guide */}
        <DistressedHelpGuide />

        {/* Main Content - Two Column Layout */}
        <Grid cols={1} className="lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Left Column - Main Content */}
          <Stack gap="lg">
            {/* Cover Image */}
            <Card>
              <CardContent className="p-5">
                <ImageUpload
                  label="Cover Image"
                  value={coverImage}
                  onChange={setCoverImage}
                  folder="properties"
                  aspectRatio="video"
                  placeholder="Upload a high-quality cover image"
                />
              </CardContent>
            </Card>

            {/* Core Details */}
            <Card>
              <CardContent className="p-5">
                <Stack gap="lg">
                  {/* Section: Basic Info */}
                  <div>
                    <Text size="sm" weight="semibold" className="mb-4">Basic Information</Text>
                    <Stack gap="md">
                      <div>
                        <Label htmlFor="title">Property Title <span className="text-destructive">*</span></Label>
                        <Input
                          id="title"
                          name="title"
                          defaultValue={property?.title}
                          placeholder="e.g. Sobha One Tower D — 1 Bed + Study"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
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

                        <div>
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
                    </Stack>
                  </div>

                  {/* Divider */}
                  <div className="border-t" />

                  {/* Section: Location */}
                  <div>
                    <Text size="sm" weight="semibold" className="mb-4 flex items-center gap-1.5">
                      <MapPinIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      Location
                    </Text>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="location">Area <span className="text-destructive">*</span></Label>
                        <Input
                          id="location"
                          name="location"
                          defaultValue={property?.location}
                          placeholder="e.g. Sobha Hartland, MBR City"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="developer">Developer</Label>
                        <Input
                          id="developer"
                          name="developer"
                          defaultValue={property?.developer || ""}
                          placeholder="e.g. Emaar"
                        />
                      </div>

                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          defaultValue={property?.city || "Dubai"}
                          placeholder="Dubai"
                        />
                      </div>

                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          defaultValue={property?.country || "UAE"}
                          placeholder="UAE"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t" />

                  {/* Section: Specifications */}
                  <div>
                    <Text size="sm" weight="semibold" className="mb-4 flex items-center gap-1.5">
                      <RulerIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      Specifications
                    </Text>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
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

                      <div>
                        <Label htmlFor="bathrooms">Baths</Label>
                        <Input
                          id="bathrooms"
                          name="bathrooms"
                          type="number"
                          defaultValue={property?.bathrooms || ""}
                          placeholder="2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="size_from">Size From</Label>
                        <Input
                          id="size_from"
                          name="size_from"
                          type="number"
                          defaultValue={property?.size_from || ""}
                          placeholder="740 sq ft"
                        />
                      </div>

                      <div>
                        <Label htmlFor="size_to">Size To</Label>
                        <Input
                          id="size_to"
                          name="size_to"
                          type="number"
                          defaultValue={property?.size_to || ""}
                          placeholder="740 sq ft"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t" />

                  {/* Section: Completion & Slug */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
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

                    <div>
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        name="slug"
                        defaultValue={property?.slug}
                        placeholder="auto-generated from title"
                      />
                    </div>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* Description & Features */}
            <Card>
              <CardContent className="p-5">
                <Text size="sm" weight="semibold" className="mb-4">Description & Features</Text>
                <Stack gap="md">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={property?.description || ""}
                      placeholder="Property description — include discount details and payment terms for distressed deals..."
                      rows={5}
                    />
                  </div>

                  <div>
                    <Label htmlFor="features">Features</Label>
                    <Input
                      id="features"
                      name="features"
                      defaultValue={property?.features?.join(", ") || ""}
                      placeholder="Full Golf Course View, High Floor, 60% Paid by Seller"
                    />
                    <Text size="xs" variant="muted" className="mt-1.5">
                      Separate features with commas
                    </Text>
                  </div>

                  <div>
                    <Label htmlFor="images">Gallery Images</Label>
                    <Textarea
                      id="images"
                      name="images"
                      defaultValue={property?.images?.join(",\n") || ""}
                      placeholder="https://example.com/image1.jpg,&#10;https://example.com/image2.jpg"
                      rows={3}
                    />
                    <Text size="xs" variant="muted" className="mt-1.5">
                      Comma-separated URLs
                    </Text>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          {/* Right Column - Sidebar */}
          <Stack gap="md" className="lg:sticky lg:top-16">
            {/* Pricing */}
            <Card>
              <CardContent className="p-5">
                <Text size="sm" weight="semibold" className="mb-4 flex items-center gap-1.5">
                  <DollarSignIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  Pricing
                </Text>
                <Stack gap="md">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="price_from" className="text-xs">Price From</Label>
                      <Input
                        id="price_from"
                        name="price_from"
                        type="number"
                        defaultValue={property?.price_from || ""}
                        placeholder="1,750,000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price_to" className="text-xs">Price To</Label>
                      <Input
                        id="price_to"
                        name="price_to"
                        type="number"
                        defaultValue={property?.price_to || ""}
                        placeholder="1,870,000"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="currency" className="text-xs">Currency</Label>
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
                  {isDistressed && (
                    <Text size="xs" variant="muted">
                      For distressed: Price From = asking price, Price To = original price
                    </Text>
                  )}
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
                  <div>
                    <Label htmlFor="developer_website" className="text-xs">Developer Website</Label>
                    <Input
                      id="developer_website"
                      name="developer_website"
                      type="url"
                      defaultValue={property?.developer_website || ""}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
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

            {/* Visibility & Settings */}
            <Card>
              <CardContent className="p-5">
                <Text size="sm" weight="semibold" className="mb-4">Visibility</Text>
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

                  <div className="border-t pt-3 mt-1">
                    <Label htmlFor="display_order" className="text-xs">Display Order</Label>
                    <Input
                      id="display_order"
                      name="display_order"
                      type="number"
                      defaultValue={property?.display_order || 0}
                      placeholder="0"
                      className="mt-1"
                    />
                    <Text size="xs" variant="muted" className="mt-1.5">
                      Lower numbers appear first
                    </Text>
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
    </form>
  )
}

// =============================================================================
// DISTRESSED HELP GUIDE
// Collapsible card with guidance for creating distressed property listings.
// =============================================================================

function DistressedHelpGuide() {
  return (
    <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-900 dark:bg-orange-950/20">
      <Collapsible>
        <CardContent className="p-0">
          <CollapsibleTrigger
            render={<div role="button" tabIndex={0} />}
            className="group flex items-center justify-between w-full cursor-pointer p-4"
          >
            <Row gap="md" align="center">
              <HelpCircleIcon className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0" />
              <Stack gap="none">
                <Text size="sm" weight="medium">Distressed listing guide</Text>
                <Text size="xs" variant="muted">
                  How to set up pricing, description, and features for a distressed deal
                </Text>
              </Stack>
            </Row>
            <ChevronDownIcon className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-data-[open]:rotate-180" />
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="px-4 pb-4 pt-0">
              <div className="grid gap-6 md:grid-cols-2 text-sm">
                {/* Left column */}
                <Stack gap="md">
                  <div>
                    <Text size="sm" weight="medium" className="mb-1">Pricing setup</Text>
                    <ul className="text-muted-foreground space-y-1 list-disc pl-4 text-sm">
                      <li><strong>Price From</strong> — the current asking price (discounted)</li>
                      <li><strong>Price To</strong> — the original price or market value</li>
                      <li>The public page shows Price From as headline, Price To crossed out</li>
                    </ul>
                  </div>

                  <div>
                    <Text size="sm" weight="medium" className="mb-1">Description</Text>
                    <ul className="text-muted-foreground space-y-1 list-disc pl-4 text-sm">
                      <li>State the discount — &quot;Original AED X, now AED Y&quot;</li>
                      <li>Mention payment plan status — &quot;60% paid by seller&quot;</li>
                      <li>Include handover timeline if off-plan</li>
                      <li>Factual, restrained tone — no urgency language</li>
                    </ul>
                  </div>

                  <div>
                    <Text size="sm" weight="medium" className="mb-1">Features to include</Text>
                    <ul className="text-muted-foreground space-y-1 list-disc pl-4 text-sm">
                      <li>Payment split — &quot;60% Paid by Seller&quot;</li>
                      <li>Price context — &quot;Below Original Price&quot;</li>
                      <li>Standout specs — floor, views, layout</li>
                      <li>Keep to 4–5 concise items</li>
                    </ul>
                  </div>
                </Stack>

                {/* Right column */}
                <Stack gap="md">
                  <div>
                    <Text size="sm" weight="medium" className="mb-1">Example listing</Text>
                    <div className="rounded-md border bg-background p-3 space-y-1.5 text-xs">
                      <Text size="xs" weight="medium">Sobha One Tower D — 1 Bed + Study</Text>
                      <Text size="xs" variant="muted">
                        Price: AED 1,750,000 (original AED 1,870,000)
                      </Text>
                      <Text size="xs" variant="muted">
                        &quot;High floor 1-bed + study with golf views. 60% paid by seller —
                        buyer assumes 40% balance on handover.&quot;
                      </Text>
                      <Text size="xs" variant="muted">
                        Features: Golf View · High Floor · 60% Paid · 40% on Handover
                      </Text>
                    </div>
                  </div>

                  <div>
                    <Text size="sm" weight="medium" className="mb-1">Checklist</Text>
                    <ul className="text-muted-foreground space-y-1 list-disc pl-4 text-sm">
                      <li>Set Price From (asking) and Price To (original)</li>
                      <li>Add a cover image</li>
                      <li>Write description with discount and payment terms</li>
                      <li>Add 4–5 features highlighting deal specifics</li>
                      <li>Toggle &quot;Published&quot; when ready</li>
                    </ul>
                  </div>
                </Stack>
              </div>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  )
}
