/**
 * Properties Admin Page
 *
 * CRUD interface for managing property listings.
 * Reads from Supabase database, supports create/edit/delete.
 */

import { Container } from "@/components/core"
import { PropertiesClient } from "./properties-client"
import { getPropertiesFromDb } from "@/lib/actions/cms"

export const metadata = {
  title: "Manage Properties | Admin",
}

export default async function PropertiesAdminPage() {
  const result = await getPropertiesFromDb()
  const properties = result.success ? result.data : []

  return (
    <Container size="lg" className="py-6">
      <PropertiesClient properties={properties} />
    </Container>
  )
}
