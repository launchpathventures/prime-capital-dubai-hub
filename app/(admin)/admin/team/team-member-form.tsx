/**
 * Team Member Form Component
 * 
 * Reusable form for creating and editing team members.
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Stack, Row, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  createTeamMember, 
  updateTeamMember, 
  type TeamMemberRow, 
  type TeamMemberInput 
} from "@/lib/actions/cms"
import { generateSlug } from "@/lib/utils"
import { toast } from "@/components/ui/toast"

type TeamMemberFormProps = {
  member?: TeamMemberRow
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeamMemberForm({ member, open, onOpenChange }: TeamMemberFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!member

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    
    const input: TeamMemberInput = {
      slug: formData.get("slug") as string || generateSlug(formData.get("name") as string),
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      short_bio: formData.get("short_bio") as string || null,
      full_bio: formData.get("full_bio") as string || null,
      expertise: (formData.get("expertise") as string)?.split(",").map(e => e.trim()).filter(Boolean) || null,
      background: (formData.get("background") as string)?.split(",").map(b => b.trim()).filter(Boolean) || null,
      email: formData.get("email") as string || null,
      phone: formData.get("phone") as string || null,
      photo: formData.get("photo") as string || null,
      linkedin: formData.get("linkedin") as string || null,
      is_founder: formData.get("is_founder") === "on",
      display_order: formData.get("display_order") ? Number(formData.get("display_order")) : 0,
    }

    try {
      if (isEditing) {
        const result = await updateTeamMember(member.id, input)
        if (result.success) {
          toast.success("Team member updated successfully")
          onOpenChange(false)
          router.refresh()
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createTeamMember(input)
        if (result.success) {
          toast.success("Team member created successfully")
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the team member details below." 
              : "Fill in the details to add a new team member."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            {/* Basic Info */}
            <Stack gap="md">
              <Text weight="medium" size="sm">Basic Information</Text>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    defaultValue={member?.name}
                    placeholder="e.g. John Smith"
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input 
                    id="slug" 
                    name="slug" 
                    defaultValue={member?.slug}
                    placeholder="auto-generated from name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Job Title / Role *</Label>
                  <Input 
                    id="role" 
                    name="role" 
                    defaultValue={member?.role}
                    placeholder="e.g. Senior Property Consultant"
                    required 
                  />
                </div>
                
                <Row align="center" gap="sm" className="pt-6">
                  <Switch 
                    id="is_founder" 
                    name="is_founder" 
                    defaultChecked={member?.is_founder || false}
                  />
                  <Label htmlFor="is_founder">Founder / Leadership</Label>
                </Row>
              </div>
            </Stack>

            {/* Contact Info */}
            <Stack gap="md">
              <Text weight="medium" size="sm">Contact Information</Text>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    defaultValue={member?.email || ""}
                    placeholder="name@primecapital.ae"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    defaultValue={member?.phone || ""}
                    placeholder="+971 50 123 4567"
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                  <Input 
                    id="linkedin" 
                    name="linkedin" 
                    type="url"
                    defaultValue={member?.linkedin || ""}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
            </Stack>

            {/* Bio */}
            <Stack gap="md">
              <Text weight="medium" size="sm">Biography</Text>
              
              <div>
                <Label htmlFor="short_bio">Short Bio (for cards/listings)</Label>
                <Textarea 
                  id="short_bio" 
                  name="short_bio" 
                  defaultValue={member?.short_bio || ""}
                  placeholder="A brief 1-2 sentence introduction..."
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="full_bio">Full Bio (for profile page)</Label>
                <Textarea 
                  id="full_bio" 
                  name="full_bio" 
                  defaultValue={member?.full_bio || ""}
                  placeholder="Detailed biography and career history..."
                  rows={4}
                />
              </div>
            </Stack>

            {/* Expertise & Background */}
            <Stack gap="md">
              <Text weight="medium" size="sm">Expertise & Background</Text>
              
              <div>
                <Label htmlFor="expertise">Areas of Expertise (comma-separated)</Label>
                <Input 
                  id="expertise" 
                  name="expertise" 
                  defaultValue={member?.expertise?.join(", ") || ""}
                  placeholder="Off-plan investments, Luxury villas, Golden Visa"
                />
              </div>
              
              <div>
                <Label htmlFor="background">Background / Experience (comma-separated)</Label>
                <Input 
                  id="background" 
                  name="background" 
                  defaultValue={member?.background?.join(", ") || ""}
                  placeholder="10+ years in Dubai real estate, Former banker"
                />
              </div>
            </Stack>

            {/* Photo */}
            <Stack gap="md">
              <Text weight="medium" size="sm">Profile Photo</Text>
              
              <div>
                <Label htmlFor="photo">Photo URL</Label>
                <Input 
                  id="photo" 
                  name="photo" 
                  defaultValue={member?.photo || ""}
                  placeholder="https://..."
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
                    defaultValue={member?.display_order || 0}
                    placeholder="0"
                  />
                </div>
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
                {isEditing ? "Save Changes" : "Add Team Member"}
              </Button>
            </DialogFooter>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
