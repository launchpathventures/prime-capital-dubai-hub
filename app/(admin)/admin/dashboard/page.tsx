/**
 * Dashboard Page
 *
 * Admin dashboard showing content overview and quick actions.
 * This is the default landing page after authentication.
 */

import Link from "next/link"
import { config } from "@/lib/config"
import { getProperties, getTeamMembers, getTestimonials, getStats } from "@/lib/content"
import { Container, Stack, Grid, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BuildingIcon,
  UsersIcon,
  MessageSquareQuoteIcon,
  TrendingUpIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  SettingsIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react"

export default async function DashboardPage() {
  const [properties, team, testimonials, stats] = await Promise.all([
    getProperties(),
    getTeamMembers(),
    getTestimonials(),
    getStats(),
  ])

  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Page Header */}
        <Row justify="between" align="center">
          <Stack gap="xs">
            <Title size="h3">Dashboard</Title>
            <Text variant="muted">
              Welcome to the {config.app.name} admin panel
            </Text>
          </Stack>
          <Button
            variant="outline"
            render={<Link href="/" target="_blank" />}
          >
            <ExternalLinkIcon className="h-4 w-4 mr-2" />
            View Website
          </Button>
        </Row>

        {/* Content Overview */}
        <Grid cols={4} gap="md">
          <ContentCard
            title="Properties"
            count={properties.length}
            href="/admin/properties"
            icon={BuildingIcon}
            enabled={config.features.properties}
          />
          <ContentCard
            title="Team Members"
            count={team.length}
            href="/admin/team"
            icon={UsersIcon}
            enabled={config.features.team}
          />
          <ContentCard
            title="Testimonials"
            count={testimonials.length}
            href="/admin/testimonials"
            icon={MessageSquareQuoteIcon}
            enabled={config.features.testimonials}
          />
          <ContentCard
            title="Statistics"
            count={stats.length}
            href="/admin/stats"
            icon={TrendingUpIcon}
            enabled={true}
          />
        </Grid>

        <Grid cols={2} gap="md">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="sm">
                <Button 
                  variant="outline" 
                  className="justify-start w-full" 
                  render={<Link href="/admin/properties" />}
                >
                  <BuildingIcon className="h-4 w-4" />
                  Manage Properties
                  <ArrowRightIcon className="h-4 w-4 ml-auto" />
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start w-full" 
                  render={<Link href="/admin/team" />}
                >
                  <UsersIcon className="h-4 w-4" />
                  Manage Team
                  <ArrowRightIcon className="h-4 w-4 ml-auto" />
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start w-full" 
                  render={<Link href="/admin/testimonials" />}
                >
                  <MessageSquareQuoteIcon className="h-4 w-4" />
                  Manage Testimonials
                  <ArrowRightIcon className="h-4 w-4 ml-auto" />
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start w-full" 
                  render={<Link href="/admin/site-settings" />}
                >
                  <SettingsIcon className="h-4 w-4" />
                  Site Settings
                  <ArrowRightIcon className="h-4 w-4 ml-auto" />
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Feature Status */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Status</CardTitle>
              <CardDescription>Website section visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="sm">
                <FeatureStatus 
                  label="Properties" 
                  enabled={config.features.properties} 
                />
                <FeatureStatus 
                  label="Team Profiles" 
                  enabled={config.features.team} 
                />
                <FeatureStatus 
                  label="Testimonials" 
                  enabled={config.features.testimonials} 
                />
                <FeatureStatus 
                  label="Blog" 
                  enabled={config.features.blog} 
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Properties */}
        {properties.length > 0 && (
          <Card>
            <CardHeader>
              <Row justify="between" align="center">
                <div>
                  <CardTitle>Recent Properties</CardTitle>
                  <CardDescription>Latest property listings</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  render={<Link href="/admin/properties" />}
                >
                  View All
                </Button>
              </Row>
            </CardHeader>
            <CardContent>
              <Stack gap="sm">
                {properties.slice(0, 3).map((property) => (
                  <Row 
                    key={property.id} 
                    justify="between" 
                    align="center" 
                    className="py-2 border-b last:border-0"
                  >
                    <Stack gap="none">
                      <Text weight="medium">{property.title}</Text>
                      <Text size="xs" variant="muted">
                        {property.location} • {property.type}
                      </Text>
                    </Stack>
                    <Row gap="sm" align="center">
                      {property.featured ? (
                        <Badge>Featured</Badge>
                      ) : (
                        <Badge variant="secondary">{property.status}</Badge>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon-sm"
                        render={<Link href={`/properties/${property.slug}`} target="_blank" />}
                      >
                        <ExternalLinkIcon className="h-4 w-4" />
                      </Button>
                    </Row>
                  </Row>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Container>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

function ContentCard({
  title,
  count,
  href,
  icon: Icon,
  enabled,
}: {
  title: string
  count: number
  href: string
  icon: React.ElementType
  enabled: boolean
}) {
  return (
    <Link href={href}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Row justify="between" align="end">
            <div className="text-2xl font-bold">{count}</div>
            {!enabled && (
              <Badge variant="secondary" className="text-xs">
                <EyeOffIcon className="h-3 w-3 mr-1" />
                Hidden
              </Badge>
            )}
          </Row>
        </CardContent>
      </Card>
    </Link>
  )
}

function FeatureStatus({
  label,
  enabled,
}: {
  label: string
  enabled: boolean
}) {
  return (
    <Row justify="between" align="center" className="py-2 border-b last:border-0">
      <Text size="sm">{label}</Text>
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
  )
}
