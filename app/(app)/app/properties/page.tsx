/**
 * CATALYST - Properties Admin Page
 *
 * CRUD interface for managing property listings.
 * This is a placeholder that displays JSON data - full CRUD requires Supabase.
 */

import Link from "next/link"
import { getProperties, formatPriceRange } from "@/lib/content"
import { Container, Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExternalLinkIcon,
  AlertCircleIcon,
} from "lucide-react"

export const metadata = {
  title: "Manage Properties | Admin",
}

export default function PropertiesAdminPage() {
  const properties = getProperties()

  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Page Header */}
        <Row justify="between" align="center">
          <Stack gap="xs">
            <Title size="h3">Properties</Title>
            <Text variant="muted">
              Manage your property listings
            </Text>
          </Stack>
          <Button disabled>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Property
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
                  Properties are currently loaded from JSON files. Full CRUD operations 
                  require Supabase integration. This view shows read-only data from{" "}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">data/properties.json</code>.
                </Text>
              </Stack>
            </Row>
          </CardContent>
        </Card>

        {/* Properties Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Properties ({properties.length})</CardTitle>
            <CardDescription>
              Click a property to view on the public website
            </CardDescription>
          </CardHeader>
          <CardContent>
            {properties.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <Stack gap="none">
                          <Text weight="medium">{property.title}</Text>
                          <Text size="xs" variant="muted">{property.developer}</Text>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {property.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Text size="sm">{property.location}</Text>
                      </TableCell>
                      <TableCell>
                        <Text size="sm">
                          {formatPriceRange(property.priceFrom, property.priceTo, property.currency)}
                        </Text>
                      </TableCell>
                      <TableCell>
                        {property.published ? (
                          <Badge>Published</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Row gap="xs" justify="end">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            nativeButton={false}
                            render={<Link href={`/properties/${property.slug}`} target="_blank" />}
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" disabled>
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" disabled>
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </Row>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Stack gap="md" align="center" className="py-12">
                <Text variant="muted">No properties found</Text>
                <Button disabled>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add First Property
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
