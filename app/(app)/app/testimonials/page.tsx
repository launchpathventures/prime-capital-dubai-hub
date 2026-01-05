/**
 * CATALYST - Testimonials Admin Page
 *
 * CRUD interface for managing client testimonials.
 * This is a placeholder that displays JSON data - full CRUD requires Supabase.
 */

import { getTestimonials } from "@/lib/content"
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
  AlertCircleIcon,
  QuoteIcon,
} from "lucide-react"

export const metadata = {
  title: "Manage Testimonials | Admin",
}

export default function TestimonialsAdminPage() {
  const testimonials = getTestimonials()

  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Page Header */}
        <Row justify="between" align="center">
          <Stack gap="xs">
            <Title size="h3">Testimonials</Title>
            <Text variant="muted">
              Manage client testimonials
            </Text>
          </Stack>
          <Button disabled>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Testimonial
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
                  Testimonials are currently loaded from JSON files. Full CRUD operations 
                  require Supabase integration. This view shows read-only data from{" "}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">data/testimonials.json</code>.
                </Text>
              </Stack>
            </Row>
          </CardContent>
        </Card>

        {/* Testimonials Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Testimonials ({testimonials.length})</CardTitle>
            <CardDescription>
              Client testimonials displayed on the homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {testimonials.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Quote</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell>
                        <Row gap="sm" align="start">
                          <QuoteIcon className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                          <Text size="sm" className="line-clamp-2">
                            {testimonial.quote}
                          </Text>
                        </Row>
                      </TableCell>
                      <TableCell>
                        <Stack gap="none">
                          <Text size="sm" weight="medium">{testimonial.authorName}</Text>
                          {testimonial.authorTitle && (
                            <Text size="xs" variant="muted">{testimonial.authorTitle}</Text>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Text size="sm">{testimonial.authorLocation}</Text>
                      </TableCell>
                      <TableCell>
                        {testimonial.published ? (
                          <Badge>Published</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Row gap="xs" justify="end">
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
                <Text variant="muted">No testimonials found</Text>
                <Button disabled>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add First Testimonial
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
