/**
 * CATALYST - Stats Admin Page
 *
 * CRUD interface for managing homepage statistics.
 * This is a placeholder that displays JSON data - full CRUD requires Supabase.
 */

import { getStats } from "@/lib/content"
import { Container, Stack, Row, Grid, Text, Title } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  PlusIcon,
  PencilIcon,
  AlertCircleIcon,
  SaveIcon,
} from "lucide-react"

export const metadata = {
  title: "Manage Stats | Admin",
}

export default function StatsAdminPage() {
  const stats = getStats()

  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Page Header */}
        <Row justify="between" align="center">
          <Stack gap="xs">
            <Title size="h3">Statistics</Title>
            <Text variant="muted">
              Manage homepage credibility statistics
            </Text>
          </Stack>
          <Button disabled>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Stat
          </Button>
        </Row>

        {/* Notice */}
        <Card className="border-warning bg-warning/5">
          <CardContent className="pt-6">
            <Row gap="md" align="start">
              <AlertCircleIcon className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <Stack gap="xs">
                <Text weight="medium">JSON Data Mode</Text>
                <Text size="sm" variant="muted">
                  Statistics are currently loaded from JSON files. Full CRUD operations 
                  require Supabase integration. This view shows read-only data from{" "}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">data/stats.json</code>.
                </Text>
              </Stack>
            </Row>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Homepage Statistics ({stats.length})</CardTitle>
            <CardDescription>
              These statistics appear in the stats bar on the homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.length > 0 ? (
              <Grid cols={2} gap="lg">
                {stats.map((stat) => (
                  <Card key={stat.id} className="bg-muted/30">
                    <CardContent className="pt-6">
                      <Stack gap="md">
                        <Row justify="between" align="start">
                          <Stack gap="xs">
                            <Text size="sm" variant="muted">Value</Text>
                            <Text size="2xl" weight="bold" className="text-primary">
                              {stat.value}
                            </Text>
                          </Stack>
                          <Button variant="ghost" size="icon-sm" disabled>
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </Row>

                        <div className="h-px bg-border" />

                        <Stack gap="sm">
                          <div>
                            <Label className="text-xs text-muted-foreground">Label</Label>
                            <Input 
                              value={stat.label} 
                              disabled 
                              className="mt-1 bg-background"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Description</Label>
                            <Input 
                              value={stat.description} 
                              disabled 
                              className="mt-1 bg-background"
                            />
                          </div>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            ) : (
              <Stack gap="md" align="center" className="py-12">
                <Text variant="muted">No statistics found</Text>
                <Button disabled>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add First Statistic
                </Button>
              </Stack>
            )}
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
