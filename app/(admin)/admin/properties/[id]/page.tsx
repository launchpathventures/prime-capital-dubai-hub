/**
 * Property Edit Page
 *
 * Dedicated page for creating/editing properties with image uploads.
 */

import { notFound } from "next/navigation"
import { getPropertyById } from "@/lib/actions/cms"
import { PropertyEditForm } from "./property-edit-form"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function PropertyEditPage({ params }: PageProps) {
  const { id } = await params
  const isNew = id === "new"

  let property = null
  if (!isNew) {
    const result = await getPropertyById(id)
    if (!result.success || !result.data) {
      notFound()
    }
    property = result.data
  }

  return <PropertyEditForm property={property} />
}
