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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/shared/image-upload"
import {
  ArrowLeftIcon,
  Loader2Icon,
  SaveIcon,
  EyeIcon,
  MapPinIcon,
  BedDoubleIcon,
  RulerIcon,
  CalendarIcon,
  BuildingIcon,
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

export function PropertyEditForm({ property }: PropertyEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!property

  // Form state for controlled inputs (images)
  const [coverImage, setCoverImage] = useState<string | null>(property?.cover_image || null)

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
      <Stack gap="xl">
        {/* Page Header */}
        <Row justify="between" align="center" className="sticky top-0 z-10 bg-background py-4 border-b -mx-6 px-6">
          <Row gap="md" align="center">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => router.push("/admin/properties")}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Stack gap="none">
              <Title size="h4">{isEditing ? "Edit Property" : "Add New Property"}</Title>
              <Text size="sm" variant="muted">
                {isEditing ? property.title : "Create a new property listing"}
              </Text>
            </Stack>
          </Row>
          <Row gap="sm">
            {isEditing && property.slug && (
              <Button
                type="button"
                variant="outline"
                render={<Link href={`/properties/${property.slug}`} target="_blank" />}
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                View Live
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <SaveIcon className="h-4 w-4 mr-2" />
              )}
              {isEditing ? "Save Changes" : "Create Property"}
            </Button>
          </Row>
        </Row>

        {/* Main Content - Two Column Layout */}
        <Grid cols={1} className="lg:grid-cols-[2fr_1fr] gap-8">
          {/* Left Column - Main Content */}
          <Stack gap="lg">
            {/* Hero Preview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cover Image & Title</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack gap="md">
                  {/* Cover Image Upload */}
                  <ImageUpload
                    label="Cover Image"
                    value={coverImage}
                    onChange={setCoverImage}
                    folder="properties"
                    aspectRatio="video"
                    placeholder="Upload a high-quality cover image"
                  />

                  {/* Title & Slug */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="title">Property Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={property?.title}
                        placeholder="e.g. Palm Jumeirah Villa"
                        required
                        className="text-lg font-medium"
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

                    <div>
                      <Label htmlFor="type">Property Type *</Label>
                      <Select name="type" defaultValue={property?.type || "villa"}>
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
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="location">Location / Area *</Label>
                    <Input
                      id="location"
                      name="location"
                      defaultValue={property?.location}
                      placeholder="e.g. Palm Jumeirah, Dubai"
                      required
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
              </CardContent>
            </Card>

            {/* Property Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BuildingIcon className="h-4 w-4" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Stack gap="md">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="bedrooms" className="flex items-center gap-1">
                        <BedDoubleIcon className="h-3 w-3" />
                        Bedrooms
                      </Label>
                      <Input
                        id="bedrooms"
                        name="bedrooms"
                        defaultValue={property?.bedrooms || ""}
                        placeholder="3-5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        name="bathrooms"
                        type="number"
                        defaultValue={property?.bathrooms || ""}
                        placeholder="4"
                      />
                    </div>

                    <div>
                      <Label htmlFor="size_from" className="flex items-center gap-1">
                        <RulerIcon className="h-3 w-3" />
                        Size From
                      </Label>
                      <Input
                        id="size_from"
                        name="size_from"
                        type="number"
                        defaultValue={property?.size_from || ""}
                        placeholder="5000"
                      />
                    </div>

                    <div>
                      <Label htmlFor="size_to">Size To</Label>
                      <Input
                        id="size_to"
                        name="size_to"
                        type="number"
                        defaultValue={property?.size_to || ""}
                        placeholder="8000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status *</Label>
                      <Select name="status" defaultValue={property?.status || "available"}>
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

                    <div>
                      <Label htmlFor="completion_date" className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        Completion Date
                      </Label>
                      <Input
                        id="completion_date"
                        name="completion_date"
                        defaultValue={property?.completion_date || ""}
                        placeholder="Q4 2025"
                      />
                    </div>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* Description & Features Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Description & Features</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack gap="md">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={property?.description || ""}
                      placeholder="Detailed property description..."
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="features">Features (comma-separated)</Label>
                    <Input
                      id="features"
                      name="features"
                      defaultValue={property?.features?.join(", ") || ""}
                      placeholder="Private pool, Beach access, Smart home, Gym"
                    />
                    <Text size="xs" variant="muted" className="mt-1">
                      Separate features with commas
                    </Text>
                  </div>

                  <div>
                    <Label htmlFor="images">Gallery Images (comma-separated URLs)</Label>
                    <Textarea
                      id="images"
                      name="images"
                      defaultValue={property?.images?.join(",\n") || ""}
                      placeholder="https://example.com/image1.jpg,&#10;https://example.com/image2.jpg"
                      rows={3}
                    />
                    <Text size="xs" variant="muted" className="mt-1">
                      Add additional gallery images (one URL per line or comma-separated)
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
                <Stack gap="md">
                  {/* Mini preview */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BuildingIcon className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  <Stack gap="xs">
                    <Row gap="sm">
                      <Badge variant="outline" className="capitalize text-xs">
                        {property?.type || "villa"}
                      </Badge>
                      {property?.featured && (
                        <Badge variant="secondary" className="text-xs">Featured</Badge>
                      )}
                    </Row>
                    <Text weight="medium">{property?.title || "Property Title"}</Text>
                    <Text size="sm" variant="muted">{property?.location || "Location"}</Text>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack gap="md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price_from">Price From</Label>
                      <Input
                        id="price_from"
                        name="price_from"
                        type="number"
                        defaultValue={property?.price_from || ""}
                        placeholder="5000000"
                      />
                    </div>

                    <div>
                      <Label htmlFor="price_to">Price To</Label>
                      <Input
                        id="price_to"
                        name="price_to"
                        type="number"
                        defaultValue={property?.price_to || ""}
                        placeholder="10000000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select name="currency" defaultValue={property?.currency || "AED"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AED">AED</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* Developer Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Developer</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack gap="md">
                  <div>
                    <Label htmlFor="developer">Developer Name</Label>
                    <Input
                      id="developer"
                      name="developer"
                      defaultValue={property?.developer || ""}
                      placeholder="e.g. Emaar"
                    />
                  </div>

                  <div>
                    <Label htmlFor="developer_website">Developer Website</Label>
                    <Input
                      id="developer_website"
                      name="developer_website"
                      type="url"
                      defaultValue={property?.developer_website || ""}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="project_website">Project Website</Label>
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
                      defaultValue={property?.display_order || 0}
                      placeholder="0"
                    />
                    <Text size="xs" variant="muted" className="mt-1">
                      Lower numbers appear first
                    </Text>
                  </div>

                  <Row align="center" gap="sm" className="pt-2">
                    <Switch
                      id="featured"
                      name="featured"
                      defaultChecked={property?.featured || false}
                    />
                    <Label htmlFor="featured">Featured Property</Label>
                  </Row>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Stack>
    </form>
  )
}
