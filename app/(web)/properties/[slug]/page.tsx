/**
 * CATALYST - Property Detail Page
 *
 * The CRM (https://crm.primecapitaldubai.com) is the source of truth for
 * property data. This page fetches from /api/public/properties/{slug} and
 * embeds the CRM enquiry widget inline — no custom enquiry form on PDPs.
 */

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { JsonLd, propertyJsonLd, breadcrumbJsonLd } from "@/lib/json-ld"

import { getCrmPropertyBySlug } from "@/lib/crm/client"
import {
  formatCrmBedrooms,
  formatCrmPriceRange,
  getStatusBadge,
  isDevelopmentListing,
} from "@/lib/crm"
import { PropertyEnquiryWidget } from "@/components/shared/property-enquiry-widget"
import { PropertyProse } from "@/components/shared/property-enquiry-widget/property-prose"

import {
  ArrowLeftIcon,
  MapPinIcon,
  BedDoubleIcon,
  RulerIcon,
  CalendarIcon,
  BuildingIcon,
  CheckIcon,
  BathIcon,
} from "lucide-react"

export const revalidate = 300 // Match the CRM Cache-Control max-age

interface PageProps {
  params: Promise<{ slug: string }>
}

const SITE_URL = "https://primecapitaldubai.com"

function formatCompletionDate(dateStr: string): string {
  const quarterMatch = dateStr.match(/^(\d{4})-Q(\d)$/i)
  if (quarterMatch) return `Q${quarterMatch[2]} ${quarterMatch[1]}`
  const d = new Date(dateStr)
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" })
  }
  return dateStr
}

function formatNoteDate(date: string): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return date
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const property = await getCrmPropertyBySlug(slug)

  if (!property) {
    return { title: "Property Not Found" }
  }

  const heroImage = property.images[0]
  const description = property.description?.slice(0, 160) ?? ""

  return {
    title: property.title,
    description,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: {
      title: property.title,
      description,
      images: heroImage ? [{ url: heroImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description,
      images: heroImage ? [heroImage] : undefined,
    },
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const property = await getCrmPropertyBySlug(slug)

  if (!property) notFound()

  const statusBadge = getStatusBadge(property.status)
  const isDevelopment = isDevelopmentListing(property)
  const propertyUrl = `${SITE_URL}/properties/${property.slug}`
  const heroImage = property.images[0]
  const galleryImages = property.images.slice(1)

  return (
    <div className="web-property-detail">
      <JsonLd
        data={propertyJsonLd({
          title: property.title,
          description: property.description,
          slug: property.slug,
          cover_image: heroImage ?? null,
          created_at: property.createdAt,
          price: property.priceFrom ?? property.price ?? null,
          area: property.area,
          bedrooms: property.bedrooms ?? property.bedroomsMin ?? null,
          size_sqft: property.sqft,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Properties", url: `${SITE_URL}/properties` },
          { name: property.title },
        ])}
      />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex flex-col justify-end">
        <div className="absolute inset-0 bg-[var(--web-ash)]">
          {heroImage ? (
            <Image src={heroImage} alt={property.title} fill className="object-cover" priority />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BuildingIcon className="h-24 w-24 text-[var(--web-spruce)]/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
        </div>

        <Container size="xl" className="relative z-10 pt-28 pb-12">
          <Link
            href="/properties"
            className="group inline-flex items-center gap-2 text-white/60 text-[13px] hover:text-white/90 transition-colors mb-6"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Properties
          </Link>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <Stack gap="sm">
              <div className="flex flex-wrap gap-2">
                {statusBadge && (
                  <Badge className="bg-[var(--web-ash)] text-[var(--web-serenity)] text-[10px] uppercase tracking-wider rounded-[2px] border border-[var(--web-serenity)]/30">
                    {statusBadge}
                  </Badge>
                )}
                {isDevelopment ? (
                  <Badge className="bg-[var(--web-spruce)] text-[var(--web-off-white)] text-[10px] uppercase tracking-wider rounded-[2px] border-0">
                    Off-Plan
                  </Badge>
                ) : (
                  <Badge className="bg-[var(--web-spruce)] text-[var(--web-off-white)] text-[10px] uppercase tracking-wider rounded-[2px] border-0">
                    Ready
                  </Badge>
                )}
                <Badge className="bg-white/20 text-white text-[10px] uppercase tracking-wider rounded-[2px] border-0 capitalize">
                  {property.propertyType}
                </Badge>
              </div>

              <h1 className="font-headline text-[var(--web-off-white)] text-[clamp(32px,5vw,48px)] font-normal leading-[1.1]">
                {property.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-white/80 text-[14px]">
                <MapPinIcon className="h-4 w-4" />
                <span>{property.area}</span>
                {property.developer && (
                  <>
                    <span className="mx-2 text-white/40">•</span>
                    <span>by {property.developer}</span>
                  </>
                )}
                {property.buildingName && (
                  <>
                    <span className="mx-2 text-white/40">•</span>
                    <span>{property.buildingName}</span>
                  </>
                )}
              </div>
            </Stack>

            <Stack gap="sm" align="end">
              <div className="text-white/70 text-[13px]">
                {isDevelopment ? "Starting from" : "Price"}
              </div>
              <div className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,40px)]">
                {formatCrmPriceRange(property)}
              </div>
            </Stack>
          </div>
        </Container>
      </section>

      {/* Key metrics bar */}
      <section className="bg-[var(--web-ash)]">
        <Container size="xl">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 py-8">
            <div className="text-center">
              <BedDoubleIcon className="h-6 w-6 text-[var(--web-serenity)] mx-auto mb-2" />
              <div className="font-headline text-[var(--web-off-white)] text-xl">
                {formatCrmBedrooms(property)}
              </div>
              <div className="text-[var(--web-serenity)] text-[11px] uppercase tracking-[0.15em]">
                Bedrooms
              </div>
            </div>

            {property.bathrooms != null && (
              <div className="text-center">
                <BathIcon className="h-6 w-6 text-[var(--web-serenity)] mx-auto mb-2" />
                <div className="font-headline text-[var(--web-off-white)] text-xl">{property.bathrooms}</div>
                <div className="text-[var(--web-serenity)] text-[11px] uppercase tracking-[0.15em]">
                  Bathrooms
                </div>
              </div>
            )}

            {property.sqft != null && (
              <div className="text-center">
                <RulerIcon className="h-6 w-6 text-[var(--web-serenity)] mx-auto mb-2" />
                <div className="font-headline text-[var(--web-off-white)] text-xl">
                  {property.sqft.toLocaleString("en-AE")} sqft
                </div>
                <div className="text-[var(--web-serenity)] text-[11px] uppercase tracking-[0.15em]">Size</div>
              </div>
            )}

            {property.completionDate && (
              <div className="text-center">
                <CalendarIcon className="h-6 w-6 text-[var(--web-serenity)] mx-auto mb-2" />
                <div className="font-headline text-[var(--web-off-white)] text-xl">
                  {formatCompletionDate(property.completionDate)}
                </div>
                <div className="text-[var(--web-serenity)] text-[11px] uppercase tracking-[0.15em]">
                  Completion
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Content + sidebar */}
      <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
        <Container size="xl">
          <Grid cols={1} className="lg:grid-cols-[2fr_1fr] gap-12">
            {/* Main content */}
            <Stack gap="xl">
              {property.notes.length > 0 && (
                <div className="bg-[var(--web-serenity)]/10 border border-[var(--web-serenity)]/30 rounded-[2px] p-6">
                  <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-3">
                    Latest Updates
                  </span>
                  <Stack gap="sm">
                    {property.notes.slice(0, 5).map((note) => (
                      <div key={note.id} className="flex flex-col gap-1">
                        <div className="flex items-center gap-3 text-[var(--web-spruce)] text-[12px]">
                          <span className="uppercase tracking-wider">{note.category}</span>
                          <span className="opacity-50">{formatNoteDate(note.date)}</span>
                        </div>
                        <Text className="text-[var(--web-ash)] text-[14px] font-light leading-relaxed">
                          {note.summary}
                        </Text>
                      </div>
                    ))}
                  </Stack>
                </div>
              )}

              {property.reasonsToInvest && (
                <div className="bg-[var(--web-ash)] rounded-[2px] p-8">
                  <Title
                    as="h2"
                    className="font-headline text-[var(--web-off-white)] text-xl font-normal mb-6"
                  >
                    Why Invest in {property.title}?
                  </Title>
                  <PropertyProse
                    content={property.reasonsToInvest}
                    className="text-white/80 text-[14px]"
                  />
                </div>
              )}

              {property.description && (
                <div>
                  <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-3">
                    About This Property
                  </span>
                  <Text className="text-[var(--web-spruce)] text-[15px] font-light leading-relaxed whitespace-pre-line">
                    {property.description}
                  </Text>
                </div>
              )}

              {isDevelopment && property.unitTypes && property.unitTypes.length > 0 && (
                <div>
                  <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-4">
                    Available Unit Types
                  </span>
                  <div className="bg-white rounded-[2px] overflow-hidden border border-[var(--web-serenity)]/30">
                    <table className="w-full text-[13px]">
                      <thead className="bg-[var(--web-serenity)]/10">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium text-[var(--web-ash)]">Type</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--web-ash)]">Beds</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--web-ash)]">Size</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--web-ash)]">From</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--web-ash)]">
                            Available
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {property.unitTypes.map((unit) => (
                          <tr
                            key={unit.name}
                            className="border-t border-[var(--web-serenity)]/20 text-[var(--web-spruce)]"
                          >
                            <td className="px-4 py-3 font-medium text-[var(--web-ash)]">{unit.name}</td>
                            <td className="px-4 py-3">{unit.bedrooms ?? "—"}</td>
                            <td className="px-4 py-3">
                              {unit.size_sqft != null
                                ? `${unit.size_sqft.toLocaleString("en-AE")} sqft`
                                : "—"}
                            </td>
                            <td className="px-4 py-3">
                              {unit.price_from != null
                                ? formatCrmPriceRange({
                                    price: unit.price_from,
                                    priceFrom: unit.price_from,
                                    priceTo: unit.price_to,
                                  })
                                : "—"}
                            </td>
                            <td className="px-4 py-3">
                              {unit.available_units} / {unit.total_units}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {property.paymentPlan && property.paymentPlan.installments.length > 0 && (
                <div>
                  <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-3">
                    Payment Plan
                  </span>
                  {property.paymentPlan.summary && (
                    <Text className="text-[var(--web-ash)] text-[15px] font-medium mb-4">
                      {property.paymentPlan.summary}
                    </Text>
                  )}
                  <div className="bg-white rounded-[2px] border border-[var(--web-serenity)]/30 overflow-hidden">
                    {property.paymentPlan.installments.map((step, idx) => (
                      <div
                        key={`${step.milestone}-${idx}`}
                        className="flex items-center justify-between px-4 py-3 border-b border-[var(--web-serenity)]/20 last:border-b-0"
                      >
                        <div className="flex flex-col">
                          <span className="text-[var(--web-ash)] text-[14px]">{step.milestone}</span>
                          {step.date && (
                            <span className="text-[var(--web-spruce)] text-[12px] opacity-70">
                              {step.date}
                            </span>
                          )}
                        </div>
                        <span className="font-headline text-[var(--web-spruce)] text-[15px]">
                          {step.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                  {(property.paymentPlan.dld_waiver || property.paymentPlan.post_handover) && (
                    <div className="mt-3 flex flex-wrap gap-2 text-[12px] text-[var(--web-spruce)]">
                      {property.paymentPlan.dld_waiver && (
                        <Badge className="bg-[var(--web-spruce)]/10 text-[var(--web-spruce)] border-0">
                          DLD waiver
                        </Badge>
                      )}
                      {property.paymentPlan.post_handover && (
                        <Badge className="bg-[var(--web-spruce)]/10 text-[var(--web-spruce)] border-0">
                          Post-handover
                          {property.paymentPlan.post_handover_years
                            ? ` ${property.paymentPlan.post_handover_years}y`
                            : ""}
                        </Badge>
                      )}
                    </div>
                  )}
                  {property.paymentPlanDetails && (
                    <div className="mt-4">
                      <PropertyProse content={property.paymentPlanDetails} />
                    </div>
                  )}
                </div>
              )}

              {property.locationAndViews && (
                <div>
                  <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-3">
                    Location & Views
                  </span>
                  <PropertyProse content={property.locationAndViews} />
                </div>
              )}

              {property.aboutDeveloper && (
                <div>
                  <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-3">
                    About the Developer
                  </span>
                  <PropertyProse content={property.aboutDeveloper} />
                </div>
              )}

              {property.features.length > 0 && (
                <div>
                  <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-4">
                    Key Features
                  </span>
                  <Grid cols={2} className="gap-3">
                    {property.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-[var(--web-spruce)] shrink-0" />
                        <Text className="text-[var(--web-spruce)] text-[14px] font-light">
                          {feature}
                        </Text>
                      </div>
                    ))}
                  </Grid>
                </div>
              )}

              {property.amenities.length > 0 && (
                <div>
                  <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-4">
                    Amenities
                  </span>
                  <Grid cols={2} className="gap-3">
                    {property.amenities.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-[var(--web-spruce)] shrink-0" />
                        <Text className="text-[var(--web-spruce)] text-[14px] font-light">{item}</Text>
                      </div>
                    ))}
                  </Grid>
                </div>
              )}

              {galleryImages.length > 0 && (
                <div>
                  <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-4">
                    Gallery
                  </span>
                  <Grid cols={2} className="gap-4">
                    {galleryImages.map((image, index) => (
                      <div
                        key={image}
                        className="relative aspect-[4/3] rounded-[2px] overflow-hidden bg-[var(--web-serenity)]/20"
                      >
                        <Image
                          src={image}
                          alt={`${property.title} - Image ${index + 2}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </Grid>
                </div>
              )}

              {(property.media?.brochure_url ||
                property.factsheetUrl ||
                property.masterPlanUrl ||
                property.media?.video_url ||
                property.media?.tour_3d_url) && (
                <div className="flex flex-wrap gap-3">
                  {property.media?.brochure_url && (
                    <a
                      href={property.media.brochure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-[2px] text-[12px] uppercase tracking-wider bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)]"
                    >
                      Download brochure
                    </a>
                  )}
                  {property.factsheetUrl && (
                    <a
                      href={property.factsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-[2px] text-[12px] uppercase tracking-wider bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)]"
                    >
                      Factsheet
                    </a>
                  )}
                  {property.masterPlanUrl && (
                    <a
                      href={property.masterPlanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-[2px] text-[12px] uppercase tracking-wider border border-[var(--web-spruce)] text-[var(--web-spruce)] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)]"
                    >
                      Master plan
                    </a>
                  )}
                  {property.media?.video_url && (
                    <a
                      href={property.media.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-[2px] text-[12px] uppercase tracking-wider border border-[var(--web-spruce)] text-[var(--web-spruce)] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)]"
                    >
                      Video
                    </a>
                  )}
                  {property.media?.tour_3d_url && (
                    <a
                      href={property.media.tour_3d_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-[2px] text-[12px] uppercase tracking-wider border border-[var(--web-spruce)] text-[var(--web-spruce)] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)]"
                    >
                      3D tour
                    </a>
                  )}
                </div>
              )}
            </Stack>

            {/* Sidebar */}
            <Stack gap="lg">
              <div className="lg:sticky lg:top-24">
                <PropertyEnquiryWidget
                  slug={property.slug}
                  propertyName={property.title}
                  propertyUrl={propertyUrl}
                />
              </div>

              <div className="bg-white rounded-[2px] p-6 shadow-sm">
                <Title
                  as="h3"
                  className="font-headline text-[var(--web-ash)] text-lg font-normal mb-6"
                >
                  Property Details
                </Title>
                <Stack gap="md">
                  {property.developer && (
                    <DetailRow label="Developer" value={property.developer} />
                  )}
                  {property.reference && (
                    <DetailRow label="Reference" value={property.reference} />
                  )}
                  <DetailRow
                    label="Property Type"
                    value={<span className="capitalize">{property.propertyType}</span>}
                  />
                  <DetailRow label="Location" value={property.area} />
                  {property.address && <DetailRow label="Address" value={property.address} />}
                  {property.floor && <DetailRow label="Floor" value={property.floor} />}
                  {property.unitNumber && <DetailRow label="Unit" value={property.unitNumber} />}
                  {property.view && <DetailRow label="View" value={property.view} />}
                  {property.furnished && (
                    <DetailRow
                      label="Furnishing"
                      value={<span className="capitalize">{property.furnished.replace("-", " ")}</span>}
                    />
                  )}
                  {property.constructionProgress != null && (
                    <DetailRow
                      label="Construction"
                      value={`${Math.round(property.constructionProgress)}% complete`}
                    />
                  )}
                  <DetailRow
                    label="Status"
                    value={
                      <Badge className="bg-[var(--web-spruce)] text-[var(--web-off-white)] text-[10px] rounded-[2px] capitalize">
                        {statusBadge ?? (isDevelopment ? "Off-Plan" : "Available")}
                      </Badge>
                    }
                  />
                </Stack>
              </div>
            </Stack>
          </Grid>
        </Container>
      </section>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-[var(--web-spruce)] text-[13px]">{label}</span>
      <span className="text-[var(--web-ash)] text-[13px] font-medium text-right">{value}</span>
    </div>
  )
}
