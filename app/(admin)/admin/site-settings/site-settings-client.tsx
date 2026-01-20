/**
 * Site Settings Client Component
 * 
 * Interactive settings management with feature flags toggle.
 */

"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Container, Stack, Row, Grid, Text, Title } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast"
import { updateSiteSetting, type SiteSettingRow } from "@/lib/actions/cms"
import {
  SaveIcon,
  GlobeIcon,
  SettingsIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingIcon,
  Loader2Icon,
  EyeIcon,
  EyeOffIcon,
  SparklesIcon,
} from "lucide-react"

interface SiteSettingsClientProps {
  settings: SiteSettingRow[]
}

type FeatureFlags = {
  properties: boolean
  team: boolean
  testimonials: boolean
  blog: boolean
}

type CompanySettings = {
  name: string
  tagline: string
  description: string
  legalName: string
  founded: string
}

type ContactSettings = {
  email: string
  phone: string
  hours: string
  address: {
    line1: string
    line2: string
    city: string
    country: string
  }
}

type StrategyKitSettings = {
  title: string
  subtitle: string
  description: string
  formUrl: string | null
  benefits: string[]
}

export function SiteSettingsClient({ settings }: SiteSettingsClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  // Parse settings into typed objects
  const getSettingValue = <T,>(key: string, defaultValue: T): T => {
    const setting = settings.find(s => s.key === key)
    return setting?.value as T ?? defaultValue
  }
  
  // Feature flags state
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(
    getSettingValue("feature_flags", {
      properties: true,
      team: true,
      testimonials: true,
      blog: false,
    })
  )
  
  // Company settings state
  const [company, setCompany] = useState<CompanySettings>(
    getSettingValue("company", {
      name: "",
      tagline: "",
      description: "",
      legalName: "",
      founded: "",
    })
  )
  
  // Contact settings state
  const [contact, setContact] = useState<ContactSettings>(
    getSettingValue("contact", {
      email: "",
      phone: "",
      hours: "",
      address: { line1: "", line2: "", city: "", country: "" },
    })
  )
  
  // Strategy kit state
  const [strategyKit, setStrategyKit] = useState<StrategyKitSettings>(
    getSettingValue("strategy_kit", {
      title: "",
      subtitle: "",
      description: "",
      formUrl: null,
      benefits: [],
    })
  )
  
  // Track which sections have unsaved changes
  const [dirtyFlags, setDirtyFlags] = useState({
    featureFlags: false,
    company: false,
    contact: false,
    strategyKit: false,
  })

  const handleFeatureFlagToggle = (flag: keyof FeatureFlags) => {
    setFeatureFlags(prev => ({ ...prev, [flag]: !prev[flag] }))
    setDirtyFlags(prev => ({ ...prev, featureFlags: true }))
  }

  const handleSaveFeatureFlags = () => {
    startTransition(async () => {
      const result = await updateSiteSetting("feature_flags", featureFlags)
      if (result.success) {
        toast.success("Feature flags saved")
        setDirtyFlags(prev => ({ ...prev, featureFlags: false }))
        router.refresh()
      } else {
        toast.error(result.error || "Failed to save feature flags")
      }
    })
  }

  const handleSaveCompany = () => {
    startTransition(async () => {
      const result = await updateSiteSetting("company", company)
      if (result.success) {
        toast.success("Company settings saved")
        setDirtyFlags(prev => ({ ...prev, company: false }))
        router.refresh()
      } else {
        toast.error(result.error || "Failed to save company settings")
      }
    })
  }

  const handleSaveContact = () => {
    startTransition(async () => {
      const result = await updateSiteSetting("contact", contact)
      if (result.success) {
        toast.success("Contact information saved")
        setDirtyFlags(prev => ({ ...prev, contact: false }))
        router.refresh()
      } else {
        toast.error(result.error || "Failed to save contact information")
      }
    })
  }

  const handleSaveStrategyKit = () => {
    startTransition(async () => {
      const result = await updateSiteSetting("strategy_kit", {
        ...strategyKit,
        benefits: strategyKit.benefits,
      })
      if (result.success) {
        toast.success("Strategy kit settings saved")
        setDirtyFlags(prev => ({ ...prev, strategyKit: false }))
        router.refresh()
      } else {
        toast.error(result.error || "Failed to save strategy kit settings")
      }
    })
  }

  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Page Header */}
        <Stack gap="xs">
          <Title size="h3">Site Settings</Title>
          <Text variant="muted">
            Configure your website settings and feature flags
          </Text>
        </Stack>

        {/* Feature Flags */}
        <Card>
          <CardHeader>
            <Row justify="between" align="start">
              <div>
                <Row gap="sm" align="center">
                  <SettingsIcon className="h-5 w-5 text-primary" />
                  <CardTitle>Feature Flags</CardTitle>
                </Row>
                <CardDescription className="mt-1">
                  Toggle visibility of website sections
                </CardDescription>
              </div>
              {dirtyFlags.featureFlags && (
                <Button onClick={handleSaveFeatureFlags} disabled={isPending} size="sm">
                  {isPending ? (
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <SaveIcon className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              )}
            </Row>
          </CardHeader>
          <CardContent>
            <Grid cols={2} gap="lg">
              <FeatureToggle
                label="Properties Section"
                description="Show property listings on the website"
                enabled={featureFlags.properties}
                onToggle={() => handleFeatureFlagToggle("properties")}
                disabled={isPending}
              />
              <FeatureToggle
                label="Team Section"
                description="Show team member profiles"
                enabled={featureFlags.team}
                onToggle={() => handleFeatureFlagToggle("team")}
                disabled={isPending}
              />
              <FeatureToggle
                label="Testimonials Section"
                description="Show client testimonials"
                enabled={featureFlags.testimonials}
                onToggle={() => handleFeatureFlagToggle("testimonials")}
                disabled={isPending}
              />
              <FeatureToggle
                label="Blog Section"
                description="Show blog/insights pages"
                enabled={featureFlags.blog}
                onToggle={() => handleFeatureFlagToggle("blog")}
                disabled={isPending}
              />
            </Grid>
          </CardContent>
        </Card>

        <Grid cols={2} gap="lg">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <Row justify="between" align="start">
                <div>
                  <Row gap="sm" align="center">
                    <BuildingIcon className="h-5 w-5 text-primary" />
                    <CardTitle>Company Information</CardTitle>
                  </Row>
                  <CardDescription className="mt-1">
                    Basic company details and branding
                  </CardDescription>
                </div>
                {dirtyFlags.company && (
                  <Button onClick={handleSaveCompany} disabled={isPending} size="sm">
                    {isPending ? (
                      <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <SaveIcon className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                )}
              </Row>
            </CardHeader>
            <CardContent>
              <Stack gap="md">
                <div>
                  <Label>Company Name</Label>
                  <Input 
                    value={company.name}
                    onChange={(e) => {
                      setCompany(prev => ({ ...prev, name: e.target.value }))
                      setDirtyFlags(prev => ({ ...prev, company: true }))
                    }}
                    className="mt-1"
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label>Tagline</Label>
                  <Input 
                    value={company.tagline}
                    onChange={(e) => {
                      setCompany(prev => ({ ...prev, tagline: e.target.value }))
                      setDirtyFlags(prev => ({ ...prev, company: true }))
                    }}
                    className="mt-1"
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    value={company.description}
                    onChange={(e) => {
                      setCompany(prev => ({ ...prev, description: e.target.value }))
                      setDirtyFlags(prev => ({ ...prev, company: true }))
                    }}
                    className="mt-1"
                    rows={3}
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label>Legal Name</Label>
                  <Input 
                    value={company.legalName}
                    onChange={(e) => {
                      setCompany(prev => ({ ...prev, legalName: e.target.value }))
                      setDirtyFlags(prev => ({ ...prev, company: true }))
                    }}
                    className="mt-1"
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label>Founded Year</Label>
                  <Input 
                    value={company.founded}
                    onChange={(e) => {
                      setCompany(prev => ({ ...prev, founded: e.target.value }))
                      setDirtyFlags(prev => ({ ...prev, company: true }))
                    }}
                    className="mt-1"
                    disabled={isPending}
                  />
                </div>
              </Stack>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <Row justify="between" align="start">
                <div>
                  <Row gap="sm" align="center">
                    <MailIcon className="h-5 w-5 text-primary" />
                    <CardTitle>Contact Information</CardTitle>
                  </Row>
                  <CardDescription className="mt-1">
                    Business contact details
                  </CardDescription>
                </div>
                {dirtyFlags.contact && (
                  <Button onClick={handleSaveContact} disabled={isPending} size="sm">
                    {isPending ? (
                      <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <SaveIcon className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                )}
              </Row>
            </CardHeader>
            <CardContent>
              <Stack gap="md">
                <div>
                  <Label className="flex items-center gap-2">
                    <MailIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    Email
                  </Label>
                  <Input 
                    type="email"
                    value={contact.email}
                    onChange={(e) => {
                      setContact(prev => ({ ...prev, email: e.target.value }))
                      setDirtyFlags(prev => ({ ...prev, contact: true }))
                    }}
                    className="mt-1"
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <PhoneIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    Phone
                  </Label>
                  <Input 
                    value={contact.phone}
                    onChange={(e) => {
                      setContact(prev => ({ ...prev, phone: e.target.value }))
                      setDirtyFlags(prev => ({ ...prev, contact: true }))
                    }}
                    className="mt-1"
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label>Business Hours</Label>
                  <Input 
                    value={contact.hours}
                    onChange={(e) => {
                      setContact(prev => ({ ...prev, hours: e.target.value }))
                      setDirtyFlags(prev => ({ ...prev, contact: true }))
                    }}
                    className="mt-1"
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <MapPinIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    Address Line 1
                  </Label>
                  <Input 
                    value={contact.address.line1}
                    onChange={(e) => {
                      setContact(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, line1: e.target.value }
                      }))
                      setDirtyFlags(prev => ({ ...prev, contact: true }))
                    }}
                    className="mt-1"
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label>Address Line 2</Label>
                  <Input 
                    value={contact.address.line2}
                    onChange={(e) => {
                      setContact(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, line2: e.target.value }
                      }))
                      setDirtyFlags(prev => ({ ...prev, contact: true }))
                    }}
                    className="mt-1"
                    disabled={isPending}
                  />
                </div>
                <Grid cols={2} gap="md">
                  <div>
                    <Label>City</Label>
                    <Input 
                      value={contact.address.city}
                      onChange={(e) => {
                        setContact(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, city: e.target.value }
                        }))
                        setDirtyFlags(prev => ({ ...prev, contact: true }))
                      }}
                      className="mt-1"
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input 
                      value={contact.address.country}
                      onChange={(e) => {
                        setContact(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, country: e.target.value }
                        }))
                        setDirtyFlags(prev => ({ ...prev, contact: true }))
                      }}
                      className="mt-1"
                      disabled={isPending}
                    />
                  </div>
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Strategy Kit Settings */}
        <Card>
          <CardHeader>
            <Row justify="between" align="start">
              <div>
                <Row gap="sm" align="center">
                  <SparklesIcon className="h-5 w-5 text-primary" />
                  <CardTitle>Strategy Kit Lead Magnet</CardTitle>
                </Row>
                <CardDescription className="mt-1">
                  Configure the investment strategy kit download
                </CardDescription>
              </div>
              {dirtyFlags.strategyKit && (
                <Button onClick={handleSaveStrategyKit} disabled={isPending} size="sm">
                  {isPending ? (
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <SaveIcon className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              )}
            </Row>
          </CardHeader>
          <CardContent>
            <Grid cols={2} gap="lg">
              <Stack gap="md">
                <div>
                  <Label>Title</Label>
                  <Input 
                    value={strategyKit.title}
                    onChange={(e) => {
                      setStrategyKit(prev => ({ ...prev, title: e.target.value }))
                      setDirtyFlags(prev => ({ ...prev, strategyKit: true }))
                    }}
                    className="mt-1"
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input 
                    value={strategyKit.subtitle}
                    onChange={(e) => {
                      setStrategyKit(prev => ({ ...prev, subtitle: e.target.value }))
                      setDirtyFlags(prev => ({ ...prev, strategyKit: true }))
                    }}
                    className="mt-1"
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label>Form URL (optional)</Label>
                  <Input 
                    type="url"
                    value={strategyKit.formUrl || ""}
                    onChange={(e) => {
                      setStrategyKit(prev => ({ ...prev, formUrl: e.target.value || null }))
                      setDirtyFlags(prev => ({ ...prev, strategyKit: true }))
                    }}
                    placeholder="https://..."
                    className="mt-1"
                    disabled={isPending}
                  />
                </div>
              </Stack>
              <Stack gap="md">
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    value={strategyKit.description}
                    onChange={(e) => {
                      setStrategyKit(prev => ({ ...prev, description: e.target.value }))
                      setDirtyFlags(prev => ({ ...prev, strategyKit: true }))
                    }}
                    className="mt-1"
                    rows={3}
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label>Benefits (one per line)</Label>
                  <Textarea 
                    value={strategyKit.benefits.join("\n")}
                    onChange={(e) => {
                      setStrategyKit(prev => ({ 
                        ...prev, 
                        benefits: e.target.value.split("\n").filter(Boolean)
                      }))
                      setDirtyFlags(prev => ({ ...prev, strategyKit: true }))
                    }}
                    className="mt-1"
                    rows={3}
                    disabled={isPending}
                  />
                </div>
              </Stack>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}

function FeatureToggle({
  label,
  description,
  enabled,
  onToggle,
  disabled,
}: {
  label: string
  description: string
  enabled: boolean
  onToggle: () => void
  disabled?: boolean
}) {
  return (
    <Row justify="between" align="center" className="p-4 rounded-lg border bg-muted/30">
      <Stack gap="xs">
        <Row gap="sm" align="center">
          <Text weight="medium">{label}</Text>
          {enabled ? (
            <Badge variant="default" className="text-xs">
              <EyeIcon className="h-3 w-3 mr-1" />
              Visible
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              <EyeOffIcon className="h-3 w-3 mr-1" />
              Hidden
            </Badge>
          )}
        </Row>
        <Text size="sm" variant="muted">{description}</Text>
      </Stack>
      <Switch checked={enabled} onCheckedChange={onToggle} disabled={disabled} />
    </Row>
  )
}
