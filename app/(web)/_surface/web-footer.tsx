/**
 * CATALYST - Web Footer Component
 *
 * Substantial footer that anchors credibility for the marketing site.
 * Full contact details signal permanence and accessibility.
 */

"use client"

import Link from "next/link"
import Image from "next/image"
import { config } from "@/lib/config"
import { Container, Stack, Grid, Text } from "@/components/core"

// Navigation columns
const navColumns = [
  {
    title: "Services",
    links: [
      { href: "/services#acquisition", label: "Acquisition Advisory" },
      { href: "/services#golden-visa", label: "Golden Visa" },
      { href: "/services#management", label: "Property Management" },
      { href: "/services#exit", label: "Exit Strategy" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      ...(config.features.team ? [{ href: "/team", label: "Team" }] : []),
      { href: "/contact", label: "Contact" },
      { href: "/strategy-kit", label: "Strategy Kit" },
    ],
  },
  ...(config.features.properties
    ? [
        {
          title: "Properties",
          links: [
            { href: "/properties", label: "View All" },
            { href: "/properties?type=Villa", label: "Villas" },
            { href: "/properties?type=Apartment", label: "Apartments" },
            { href: "/properties?type=Penthouse", label: "Penthouses" },
          ],
        },
      ]
    : []),
]

export function WebFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="web-footer bg-[var(--web-ash)] text-[var(--web-off-white)]">
      <Container size="xl" className="py-16 md:py-20">
        <Grid cols={1} className="md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-12 md:gap-8">
          {/* Brand Column */}
          <Stack gap="md">
            <Link href="/" className="inline-block">
              <Image
                src="/logo-light.svg"
                alt="Prime Capital"
                width={144}
                height={72}
                className="h-[72px] w-auto"
              />
            </Link>

            <Text className="text-[var(--web-serenity)] text-[15px] font-light leading-relaxed max-w-[280px]">
              {config.app.tagline}. Guiding discerning investors through Dubai's
              premium property market.
            </Text>

            {/* Contact Details */}
            <Stack gap="xs" className="mt-4">
              <Text className="text-[var(--web-off-white)] text-sm font-light">
                {config.contact.address}
              </Text>
              <Link
                href={`tel:${config.contact.phone.replace(/\s/g, "")}`}
                className="text-[var(--web-off-white)] text-sm font-light hover:text-white transition-colors"
              >
                {config.contact.phone}
              </Link>
              <Link
                href={`mailto:${config.contact.email}`}
                className="text-[var(--web-off-white)] text-sm font-light hover:text-white transition-colors"
              >
                {config.contact.email}
              </Link>
            </Stack>
          </Stack>

          {/* Navigation Columns */}
          {navColumns.map((column, index) => (
            <Stack gap="md" key={index}>
              <Text className="text-[var(--web-serenity)] text-xs font-normal tracking-[0.15em] uppercase">
                {column.title}
              </Text>
              <Stack gap="sm">
                {column.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    className="text-[var(--web-off-white)] text-sm font-light hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Stack>
          ))}

          {/* Hours Column */}
          <Stack gap="md">
            <Text className="text-[var(--web-serenity)] text-xs font-normal tracking-[0.15em] uppercase">
              Hours
            </Text>
            <Text className="text-[var(--web-off-white)] text-sm font-light leading-relaxed">
              Sunday – Thursday 9:00
              <br />
              AM – 6:00 PM
            </Text>
          </Stack>
        </Grid>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-[var(--web-spruce)] flex flex-wrap justify-between items-center gap-4">
          <Text className="text-[var(--web-serenity)] text-[14px] font-light">
            © {currentYear} Prime Capital Dubai LLC. All rights reserved.
          </Text>

          <Link
            href="/terms"
            className="text-[var(--web-serenity)] text-[14px] font-light hover:text-[var(--web-off-white)] transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </Container>
    </footer>
  )
}
