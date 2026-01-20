/**
 * Testimonial Edit Page
 *
 * Dedicated page for creating/editing testimonials.
 */

import { notFound } from "next/navigation"
import { getTestimonialById } from "@/lib/actions/cms"
import { TestimonialEditForm } from "./testimonial-edit-form"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function TestimonialEditPage({ params }: PageProps) {
  const { id } = await params
  const isNew = id === "new"

  let testimonial = null
  if (!isNew) {
    const result = await getTestimonialById(id)
    if (!result.success || !result.data) {
      notFound()
    }
    testimonial = result.data
  }

  return <TestimonialEditForm testimonial={testimonial} />
}
