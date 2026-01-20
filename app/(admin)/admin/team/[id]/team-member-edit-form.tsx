/**
 * Team Member Edit Form
 *
 * Full-page form for creating/editing team members.
 * Includes photo upload with preview.
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Container, Stack, Row, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/shared/image-upload"
import {
  ArrowLeftIcon,
  Loader2Icon,
  SaveIcon,
  EyeIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  LinkedinIcon,
  BriefcaseIcon,
  GraduationCapIcon,
} from "lucide-react"
import {
  createTeamMember,
  updateTeamMember,
  type TeamMemberRow,
  type TeamMemberInput,
} from "@/lib/actions/cms"
import { generateSlug } from "@/lib/utils"
import { toast } from "@/components/ui/toast"

type TeamMemberEditFormProps = {
  member: TeamMemberRow | null
}

export function TeamMemberEditForm({ member }: TeamMemberEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!member

  // Form state for controlled inputs (photo)
  const [photo, setPhoto] = useState<string | null>(member?.photo || null)

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
      photo: photo,
      linkedin: formData.get("linkedin") as string || null,
      is_founder: formData.get("is_founder") === "on",
      display_order: formData.get("display_order") ? Number(formData.get("display_order")) : 0,
    }

    try {
      if (isEditing) {
        const result = await updateTeamMember(member.id, input)
        if (result.success) {
          toast.success("Team member updated successfully")
          router.push("/admin/team")
          router.refresh()
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createTeamMember(input)
        if (result.success) {
          toast.success("Team member created successfully")
          router.push("/admin/team")
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
              onClick={() => router.push("/admin/team")}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Stack gap="none">
              <Title size="h4">{isEditing ? "Edit Team Member" : "Add New Team Member"}</Title>
              <Text size="sm" variant="muted">
                {isEditing ? member.name : "Create a new team member profile"}
              </Text>
            </Stack>
          </Row>
          <Row gap="sm">
            {isEditing && member.slug && (
              <Button
                type="button"
                variant="outline"
                render={<Link href={`/team/${member.slug}`} target="_blank" />}
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
              {isEditing ? "Save Changes" : "Create Team Member"}
            </Button>
          </Row>
        </Row>

        {/* Main Content - Two Column Layout */}
        <Grid cols={1} className="lg:grid-cols-[2fr_1fr] gap-8">
          {/* Left Column - Main Content */}
          <Stack gap="lg">
            {/* Photo & Basic Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Profile Photo & Name
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Stack gap="md">
                  {/* Photo Upload */}
                  <div className="max-w-xs">
                    <ImageUpload
                      label="Profile Photo"
                      value={photo}
                      onChange={setPhoto}
                      folder="team"
                      aspectRatio="square"
                      placeholder="Upload a professional headshot"
                    />
                  </div>

                  {/* Name & Slug */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={member?.name}
                        placeholder="e.g. John Smith"
                        required
                        className="text-lg font-medium"
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
              </CardContent>
            </Card>

            {/* Biography Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Biography</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack gap="md">
                  <div>
                    <Label htmlFor="short_bio">Short Bio (for cards/listings)</Label>
                    <Textarea
                      id="short_bio"
                      name="short_bio"
                      defaultValue={member?.short_bio || ""}
                      placeholder="A brief 1-2 sentence introduction..."
                      rows={3}
                    />
                    <Text size="xs" variant="muted" className="mt-1">
                      Displayed on team listing pages and cards
                    </Text>
                  </div>

                  <div>
                    <Label htmlFor="full_bio">Full Bio (for profile page)</Label>
                    <Textarea
                      id="full_bio"
                      name="full_bio"
                      defaultValue={member?.full_bio || ""}
                      placeholder="Detailed biography and career history..."
                      rows={6}
                    />
                    <Text size="xs" variant="muted" className="mt-1">
                      Displayed on the individual team member page
                    </Text>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* Expertise & Background Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCapIcon className="h-4 w-4" />
                  Expertise & Background
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Stack gap="md">
                  <div>
                    <Label htmlFor="expertise" className="flex items-center gap-1">
                      <BriefcaseIcon className="h-3 w-3" />
                      Areas of Expertise
                    </Label>
                    <Input
                      id="expertise"
                      name="expertise"
                      defaultValue={member?.expertise?.join(", ") || ""}
                      placeholder="Off-plan investments, Luxury villas, Golden Visa"
                    />
                    <Text size="xs" variant="muted" className="mt-1">
                      Comma-separated list of specialties
                    </Text>
                  </div>

                  <div>
                    <Label htmlFor="background">Background / Experience</Label>
                    <Input
                      id="background"
                      name="background"
                      defaultValue={member?.background?.join(", ") || ""}
                      placeholder="10+ years in Dubai real estate, Former banker"
                    />
                    <Text size="xs" variant="muted" className="mt-1">
                      Comma-separated list of background highlights
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
                <Stack gap="md" align="center" className="text-center">
                  {/* Photo preview */}
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted">
                    {photo ? (
                      <Image
                        src={photo}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <UserIcon className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  <Stack gap="xs" align="center">
                    <Text weight="medium" size="lg">{member?.name || "Name"}</Text>
                    <Text variant="muted">{member?.role || "Role"}</Text>
                    {member?.is_founder && (
                      <Badge className="mt-1">Founder</Badge>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* Contact Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack gap="md">
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-1">
                      <MailIcon className="h-3 w-3" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={member?.email || ""}
                      placeholder="name@primecapital.ae"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-1">
                      <PhoneIcon className="h-3 w-3" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      defaultValue={member?.phone || ""}
                      placeholder="+971 50 123 4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedin" className="flex items-center gap-1">
                      <LinkedinIcon className="h-3 w-3" />
                      LinkedIn Profile
                    </Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      type="url"
                      defaultValue={member?.linkedin || ""}
                      placeholder="https://linkedin.com/in/..."
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
                      defaultValue={member?.display_order || 0}
                      placeholder="0"
                    />
                    <Text size="xs" variant="muted" className="mt-1">
                      Lower numbers appear first in team listings
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
