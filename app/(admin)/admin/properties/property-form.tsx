/**
 * Property Form Component
 * 
 * Reusable form for creating and editing properties.
 * Uses React Hook Form with server actions.
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Stack, Row, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
  createProperty, 
  updateProperty, 
  type PropertyRow, 
  type PropertyInput 
} from "@/lib/actions/cms"
import { generateSlug } from "@/lib/utils"
import { toast } from "@/components/ui/toast"

type PropertyFormProps = {
  property?: PropertyRow
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function PropertyForm({ property, open, onOpenChange }: PropertyFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!property

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
      cover_image: formData.get("cover_image") as string || null,
      images: (formData.get("images") as string)?.split(",").map(i => i.trim()).filter(Boolean) || null,
      featured: formData.get("featured") === "on",
      display_order: formData.get("display_order") ? Number(formData.get("display_order")) : 0,
    }

    try {
      if (isEditing) {
        const result = await updateProperty(property.id, input)
        if (result.success) {
          toast.success("Property updated successfully")
          onOpenChange(false)
          router.refresh()
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createProperty(input)
        if (result.success) {
          toast.success("Property created successfully")
          onOpenChange(false)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Property" : "Add New Property"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the property details below." 
              : "Fill in the details to create a new property listing."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            {/* Basic Info */}
            <Stack gap="md">
              <Text weight="medium" size="sm">Basic Information</Text>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    defaultValue={property?.title}
                    placeholder="e.g. Palm Jumeirah Villa"
                    required 
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

            {/* Location */}
            <Stack gap="md">
              <Text weight="medium" size="sm">Location</Text>
              
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
            </Stack>

            {/* Developer */}
            <Stack gap="md">
              <Text weight="medium" size="sm">Developer</Text>
              
              <div className="grid grid-cols-2 gap-4">
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
              </div>
            </Stack>

            {/* Pricing */}
            <Stack gap="md">
              <Text weight="medium" size="sm">Pricing</Text>
              
              <div className="grid grid-cols-3 gap-4">
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
              </div>
            </Stack>

            {/* Property Details */}
            <Stack gap="md">
              <Text weight="medium" size="sm">Property Details</Text>
              
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
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
                  <Label htmlFor="size_from">Size From</Label>
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
                  <Label htmlFor="completion_date">Completion Date</Label>
                  <Input 
                    id="completion_date" 
                    name="completion_date" 
                    defaultValue={property?.completion_date || ""}
                    placeholder="Q4 2025"
                  />
                </div>
              </div>
            </Stack>

            {/* Description */}
            <Stack gap="md">
              <Text weight="medium" size="sm">Description & Features</Text>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  defaultValue={property?.description || ""}
                  placeholder="Property description..."
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input 
                  id="features" 
                  name="features" 
                  defaultValue={property?.features?.join(", ") || ""}
                  placeholder="Private pool, Beach access, Smart home"
                />
              </div>
            </Stack>

            {/* Images */}
            <Stack gap="md">
              <Text weight="medium" size="sm">Images</Text>
              
              <div>
                <Label htmlFor="cover_image">Cover Image URL</Label>
                <Input 
                  id="cover_image" 
                  name="cover_image" 
                  defaultValue={property?.cover_image || ""}
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <Label htmlFor="images">Gallery Images (comma-separated URLs)</Label>
                <Input 
                  id="images" 
                  name="images" 
                  defaultValue={property?.images?.join(", ") || ""}
                  placeholder="https://..., https://..."
                />
              </div>
            </Stack>

            {/* Settings */}
            <Stack gap="md">
              <Text weight="medium" size="sm">Settings</Text>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input 
                    id="display_order" 
                    name="display_order" 
                    type="number"
                    defaultValue={property?.display_order || 0}
                    placeholder="0"
                  />
                </div>
                
                <Row align="center" gap="sm" className="pt-6">
                  <Switch 
                    id="featured" 
                    name="featured" 
                    defaultChecked={property?.featured || false}
                  />
                  <Label htmlFor="featured">Featured Property</Label>
                </Row>
              </div>
            </Stack>

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
                {isEditing ? "Save Changes" : "Create Property"}
              </Button>
            </DialogFooter>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
