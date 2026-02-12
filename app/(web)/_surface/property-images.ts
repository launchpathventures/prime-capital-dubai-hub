/**
 * CATALYST - Property Type Images
 *
 * Shared fallback images for property types when no cover image is available.
 * Used by homepage and properties filter components.
 */

export const propertyTypeImages: Record<string, string> = {
  villa: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop",
  penthouse: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
  apartment: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
  townhouse: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
}

/**
 * Get the image URL for a property type, falling back to default if not found.
 */
export function getPropertyTypeImage(type: string): string {
  return propertyTypeImages[type.toLowerCase()] || propertyTypeImages.default
}
