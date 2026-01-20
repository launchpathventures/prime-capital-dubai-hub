/**
 * Testimonials Admin Page
 *
 * CRUD interface for managing client testimonials.
 * Reads from Supabase database, supports create/edit/delete.
 */

import { Container } from "@/components/core"
import { TestimonialsClient } from "./testimonials-client"
import { getTestimonialsFromDb } from "@/lib/actions/cms"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Manage Testimonials | Admin",
}

export default async function TestimonialsAdminPage() {
  const result = await getTestimonialsFromDb()
  const testimonials = result.success ? result.data : []

  return (
    <Container size="lg" className="py-6">
      <TestimonialsClient testimonials={testimonials} />
    </Container>
  )
}
