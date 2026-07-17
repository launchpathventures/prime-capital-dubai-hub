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
  isBasicTier,
  isDevelopmentListing,
  lockedSectionLabel,
} from "@/lib/crm"
import { paramReaderFromRecord, selectShareToken } from "@/lib/crm/share-token"
import { PropertyEnquiryWidget } from "@/components/shared/property-enquiry-widget"
import { PropertyProse } from "@/components/shared/property-enquiry-widget/property-prose"
import { StripShareToken } from "./strip-share-token"

import {
  ArrowLeftIcon,
  MapPinIcon,
  BedDoubleIcon,
  RulerIcon,
  CalendarIcon,
  BuildingIcon,
  CheckIcon,
  BathIcon,
  BellIcon,
  SparklesIcon,
  HomeIcon,
  CreditCardIcon,
  ImagesIcon,
  FileTextIcon,
  LayersIcon,
  UtensilsIcon,
  SofaIcon,
  LockIcon,
} from "lucide-react"

// The CRM serves property detail as Cache-Control: no-store for both anonymous
// and token-bearing responses, so this route must never be cached. Fully dynamic
// (it also reads searchParams for the share token).
export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
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

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { slug } = await params
  const token = selectShareToken(paramReaderFromRecord(await searchParams))
  // Metadata (title/OG) only needs the public basic view; never fetch the full
  // projection here. A token-bearing page must not be indexed or leak the token
  // via the referrer.
  const property = await getCrmPropertyBySlug(slug)

  if (!property) {
    return { title: "Property Not Found" }
  }

  const heroImage = property.images[0]
  const description = (property.overview ?? property.description)?.slice(0, 160) ?? ""

  const tokenMeta = token.present
    ? { robots: { index: false, follow: false }, referrer: "no-referrer" as const }
    : {}

  return {
    ...tokenMeta,
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

export default async function PropertyDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const token = selectShareToken(paramReaderFromRecord(await searchParams))
  const property = await getCrmPropertyBySlug(slug, { shareToken: token })

  if (!property) notFound()

  const statusBadge = getStatusBadge(property.status)
  const isDevelopment = isDevelopmentListing(property)
  const isBasic = isBasicTier(property)
  // Off-plan pricing reads "Starting from". In the gated basic view the
  // unit-mix is withheld (so isDevelopment is false), but a gated response is
  // always an off-plan listing — key off the tier too.
  const showStartingFrom = isDevelopment || isBasic
  const propertyUrl = `${SITE_URL}/properties/${property.slug}`
  const heroImage = property.images[0]
  const galleryImages = property.images.slice(1)

  return (
    <div className="web-property-detail">
      {token.present && <StripShareToken />}
      <JsonLd
        data={propertyJsonLd({
          title: property.title,
          description: property.overview ?? property.description,
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
                {showStartingFrom ? "Starting from" : "Price"}
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

            {property.bathrooms != null && property.bathrooms > 0 && (
              <div className="text-center">
                <BathIcon className="h-6 w-6 text-[var(--web-serenity)] mx-auto mb-2" />
                <div className="font-headline text-[var(--web-off-white)] text-xl">{property.bathrooms}</div>
                <div className="text-[var(--web-serenity)] text-[11px] uppercase tracking-[0.15em]">
                  Bathrooms
                </div>
              </div>
            )}

            {property.sqft != null && property.sqft > 0 && (
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
              {isBasic && <LockedDetailsCard lockedSections={property.access?.lockedSections ?? []} />}

              {property.notes.length > 0 && (
                <SectionCard title="Latest Updates" icon={BellIcon}>
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
                </SectionCard>
              )}

              {property.reasonsToInvest && (
                <SectionCard
                  title={`Why Invest in ${property.title}?`}
                  icon={SparklesIcon}
                >
                  <PropertyProse content={property.reasonsToInvest} />
                </SectionCard>
              )}

              {(property.overview ?? property.description) && (
                <SectionCard title="About This Property" icon={BuildingIcon}>
                  <PropertyProse content={(property.overview ?? property.description)!} />
                </SectionCard>
              )}

              {property.finishingAndMaterials && (
                <SectionCard title="Finishing & Materials" icon={LayersIcon}>
                  <PropertyProse content={property.finishingAndMaterials} />
                </SectionCard>
              )}

              {property.kitchenAndAppliances && (
                <SectionCard title="Kitchen & Appliances" icon={UtensilsIcon}>
                  <PropertyProse content={property.kitchenAndAppliances} />
                </SectionCard>
              )}

              {property.furnishings && (
                <SectionCard title="Furnishings" icon={SofaIcon}>
                  <PropertyProse content={property.furnishings} />
                </SectionCard>
              )}

              {isDevelopment && property.unitTypes && property.unitTypes.length > 0 && (
                <SectionCard title="Available Unit Types" icon={HomeIcon}>
                  <div className="overflow-hidden border border-[var(--web-serenity)]/25 rounded-[2px]">
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
                              {unit.size_sqft != null && unit.size_sqft > 0
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
                </SectionCard>
              )}

              {property.paymentPlan && property.paymentPlan.installments.length > 0 && (
                <SectionCard title="Payment Plan" icon={CreditCardIcon}>
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
                </SectionCard>
              )}

              {property.locationAndViews && (
                <SectionCard title="Location & Views" icon={MapPinIcon}>
                  <PropertyProse content={property.locationAndViews} />
                </SectionCard>
              )}

              {property.aboutDeveloper && (
                <SectionCard title="About the Developer" icon={BuildingIcon}>
                  <PropertyProse content={property.aboutDeveloper} />
                </SectionCard>
              )}

              {property.features.length > 0 && (
                <SectionCard title="Key Features" icon={CheckIcon}>
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
                </SectionCard>
              )}

              {property.amenities.length > 0 && (
                <SectionCard title="Amenities" icon={SparklesIcon}>
                  <Grid cols={2} className="gap-3">
                    {property.amenities.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-[var(--web-spruce)] shrink-0" />
                        <Text className="text-[var(--web-spruce)] text-[14px] font-light">{item}</Text>
                      </div>
                    ))}
                  </Grid>
                </SectionCard>
              )}

              {galleryImages.length > 0 && (
                <SectionCard title="Gallery" icon={ImagesIcon}>
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
                </SectionCard>
              )}

              {(property.media?.brochure_url ||
                property.factsheetUrl ||
                property.masterPlanUrl ||
                property.media?.video_url ||
                property.media?.tour_3d_url) && (
                <SectionCard title="Documents & Media" icon={FileTextIcon}>
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
                </SectionCard>
              )}
            </Stack>

            {/* Sidebar */}
            <Stack gap="lg">
              <SectionCard title="Property Details" icon={FileTextIcon}>
                <Stack gap="md">
                  {property.developer && (
                    <DetailRow label="Developer" value={property.developer} />
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
              </SectionCard>

              <div id="enquiry" className="lg:sticky lg:top-24 scroll-mt-24">
                <PropertyEnquiryWidget
                  slug={property.slug}
                  propertyName={property.title}
                  propertyUrl={propertyUrl}
                  shareRef={token.present ? { present: true, value: token.value } : undefined}
                />
              </div>
            </Stack>
          </Grid>
        </Container>
      </section>
    </div>
  )
}

/**
 * Basic-view teaser. Renders once, at the top of the detail column, with a
 * single primary CTA (per the CRM handoff: no repeated unlock buttons, no
 * forced modal). The enquiry widget in the sidebar is the CTA target.
 */
function LockedDetailsCard({ lockedSections }: { lockedSections: string[] }) {
  return (
    <div className="bg-white rounded-[2px] border border-[var(--web-serenity)]/30 shadow-sm">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-[var(--web-serenity)]/25">
        <LockIcon className="h-4 w-4 text-[var(--web-spruce)]" />
        <Title
          as="h2"
          className="font-headline text-[var(--web-ash)] text-[15px] font-normal uppercase tracking-[0.15em] leading-none"
        >
          Full details on request
        </Title>
      </div>
      <div className="px-6 py-6">
        <Stack gap="md">
          <Text className="text-[var(--web-ash)] text-[15px] font-light leading-relaxed">
            The complete profile for this residence — pricing, plans and developer
            information — is shared privately with qualified buyers.
          </Text>

          {lockedSections.length > 0 && (
            <Grid cols={2} className="gap-3">
              {lockedSections.map((section) => (
                <div key={section} className="flex items-center gap-2">
                  <LockIcon className="h-3.5 w-3.5 text-[var(--web-spruce)] shrink-0" />
                  <Text className="text-[var(--web-spruce)] text-[14px] font-light">
                    {lockedSectionLabel(section)}
                  </Text>
                </div>
              ))}
            </Grid>
          )}

          <a
            href="#enquiry"
            className="inline-flex items-center justify-center self-start px-6 py-3 rounded-[2px] text-[11px] uppercase tracking-[0.2em] bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] transition-colors"
          >
            Request full details
          </a>
        </Stack>
      </div>
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

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-[2px] border border-[var(--web-serenity)]/30 shadow-sm">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-[var(--web-serenity)]/25">
        {Icon && <Icon className="h-4 w-4 text-[var(--web-spruce)]" />}
        <Title
          as="h2"
          className="font-headline text-[var(--web-ash)] text-[15px] font-normal uppercase tracking-[0.15em] leading-none"
        >
          {title}
        </Title>
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  )
}
