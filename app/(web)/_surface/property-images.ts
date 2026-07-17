/**
 * CATALYST - Property Image Fallback
 *
 * A single, recognisably generic Dubai image for listings whose CRM record has
 * no photography. Property-type stock photos can look like the actual home and
 * are therefore misleading.
 */

export const PROPERTY_IMAGE_FALLBACK = "/images/hero/properties.jpg"
export const PROPERTY_IMAGE_FALLBACK_ALT = "Dubai skyline — listing images coming soon"

export function getPropertyCoverImage(images: readonly string[]) {
  const listingImage = images.find((image) => image.trim().length > 0)

  return {
    src: listingImage ?? PROPERTY_IMAGE_FALLBACK,
    isFallback: !listingImage,
  }
}
