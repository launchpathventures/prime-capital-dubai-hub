/**
 * Settings Page
 *
 * User preferences and application settings.
 */

import { config } from "@/lib/config"
import { Container, Stack, Grid, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  SunIcon,
  MoonIcon,
  BellIcon,
  MailIcon,
  ShieldIcon,
  GlobeIcon,
} from "lucide-react"

export const metadata = {
  title: `Settings | ${config.app.name}`,
  description: "Manage your preferences and settings",
}

export default function SettingsPage() {
  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Page Header */}
        <Stack gap="xs">
          <Title size="h3">Settings</Title>
          <Text variant="muted">
            Manage your account preferences and application settings.
          </Text>
        </Stack>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="md">
              <SettingRow
                icon={SunIcon}
                title="Theme"
                description="Choose your preferred color scheme"
              >
                <Select defaultValue="system">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>

              <Separator />

              <SettingRow
                icon={MoonIcon}
                title="Reduced Motion"
                description="Minimize animations throughout the app"
              >
                <Switch />
              </SettingRow>
            </Stack>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive updates</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="md">
              <SettingRow
                icon={BellIcon}
                title="Push Notifications"
                description="Receive notifications in your browser"
              >
                <Switch defaultChecked />
              </SettingRow>

              <Separator />

              <SettingRow
                icon={MailIcon}
                title="Email Notifications"
                description="Get important updates via email"
              >
                <Switch defaultChecked />
              </SettingRow>
            </Stack>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
            <CardDescription>Control your data and security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="md">
              <SettingRow
                icon={ShieldIcon}
                title="Two-Factor Authentication"
                description="Add an extra layer of security to your account"
              >
                <Switch />
              </SettingRow>

              <Separator />

              <SettingRow
                icon={GlobeIcon}
                title="Public Profile"
                description="Make your profile visible to others"
              >
                <Switch defaultChecked />
              </SettingRow>
            </Stack>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card>
          <CardHeader>
            <CardTitle>Language & Region</CardTitle>
            <CardDescription>Set your language and regional preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="md">
              <SettingRow
                icon={GlobeIcon}
                title="Language"
                description="Select your preferred language"
              >
                <Select defaultValue="en">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>

              <Separator />

              <SettingRow
                icon={GlobeIcon}
                title="Timezone"
                description="Set your local timezone"
              >
                <Select defaultValue="utc">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="pst">Pacific Time</SelectItem>
                    <SelectItem value="est">Eastern Time</SelectItem>
                    <SelectItem value="gmt">GMT</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Row className="justify-between items-center">
      <Row gap="sm" className="items-center">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <Stack gap="none">
          <Label className="text-sm font-medium">{title}</Label>
          <Text size="xs" variant="muted">{description}</Text>
        </Stack>
      </Row>
      {children}
    </Row>
  )
}
