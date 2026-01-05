/**
 * CATALYST - Site Settings Admin Page
 *
 * Configuration for site-wide settings and feature flags.
 * This is a placeholder - full settings management requires Supabase.
 */

import { config } from "@/lib/config"
import { getSiteConfig } from "@/lib/content"
import { Container, Stack, Row, Grid, Text, Title } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircleIcon,
  SaveIcon,
  GlobeIcon,
  EyeIcon,
  EyeOffIcon,
  SettingsIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
} from "lucide-react"

export const metadata = {
  title: "Site Settings | Admin",
}

export default function SiteSettingsPage() {
  const siteConfig = getSiteConfig()

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

        {/* Notice */}
        <Card className="border-warning bg-warning/5">
          <CardContent className="pt-6">
            <Row gap="md" align="start">
              <AlertCircleIcon className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <Stack gap="xs">
                <Text weight="medium">Configuration Mode</Text>
                <Text size="sm" variant="muted">
                  Site settings are loaded from JSON and environment variables. 
                  Changes here are for preview only. Edit{" "}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">data/config.json</code> or{" "}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">lib/config.ts</code> to make changes.
                </Text>
              </Stack>
            </Row>
          </CardContent>
        </Card>

        <Grid cols={2} gap="lg">
          {/* Site Information */}
          <Card>
            <CardHeader>
              <Row gap="sm" align="center">
                <GlobeIcon className="h-5 w-5 text-primary" />
                <CardTitle>Site Information</CardTitle>
              </Row>
              <CardDescription>
                Basic site metadata and branding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="md">
                <div>
                  <Label>Site Name</Label>
                  <Input 
                    value={config.app.name} 
                    disabled 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Tagline</Label>
                  <Input 
                    value={config.app.tagline || siteConfig.site.tagline} 
                    disabled 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input 
                    value={config.app.description} 
                    disabled 
                    className="mt-1"
                  />
                </div>
              </Stack>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <Row gap="sm" align="center">
                <MailIcon className="h-5 w-5 text-primary" />
                <CardTitle>Contact Information</CardTitle>
              </Row>
              <CardDescription>
                Business contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="md">
                <div>
                  <Label className="flex items-center gap-2">
                    <MailIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    Email
                  </Label>
                  <Input 
                    value={config.contact.email} 
                    disabled 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <PhoneIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    Phone
                  </Label>
                  <Input 
                    value={config.contact.phone} 
                    disabled 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <MapPinIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    Address
                  </Label>
                  <Input 
                    value={config.contact.address} 
                    disabled 
                    className="mt-1"
                  />
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Feature Flags */}
        <Card>
          <CardHeader>
            <Row gap="sm" align="center">
              <SettingsIcon className="h-5 w-5 text-primary" />
              <CardTitle>Feature Flags</CardTitle>
            </Row>
            <CardDescription>
              Toggle visibility of website sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Grid cols={2} gap="lg">
              <FeatureToggle
                label="Properties Section"
                description="Show property listings on the website"
                enabled={config.features.properties}
              />
              <FeatureToggle
                label="Team Section"
                description="Show team member profiles"
                enabled={config.features.team}
              />
              <FeatureToggle
                label="Testimonials Section"
                description="Show client testimonials"
                enabled={config.features.testimonials}
              />
              <FeatureToggle
                label="Blog Section"
                description="Show blog/insights pages (coming soon)"
                enabled={config.features.blog}
              />
            </Grid>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Row justify="end">
          <Button disabled>
            <SaveIcon className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </Row>
      </Stack>
    </Container>
  )
}

function FeatureToggle({
  label,
  description,
  enabled,
}: {
  label: string
  description: string
  enabled: boolean
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
      <Switch checked={enabled} disabled />
    </Row>
  )
}
