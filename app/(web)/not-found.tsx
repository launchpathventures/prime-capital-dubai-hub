/**
 * CATALYST - Web Surface 404 Page
 *
 * Server component for 404 errors within the web surface.
 * Displays branded "Page not found" with popular navigation links.
 */

import Link from "next/link"
import { Container, Stack, Grid, Title, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import {
  HomeIcon,
  BuildingIcon,
  UsersIcon,
  MailIcon,
  ArrowRightIcon,
} from "lucide-react"

export default function WebNotFound() {
  const popularLinks = [
    {
      href: "/properties",
      icon: BuildingIcon,
      title: "Properties",
      description: "Browse our curated portfolio",
    },
    {
      href: "/services",
      icon: UsersIcon,
      title: "Services",
      description: "How we can help you",
    },
    {
      href: "/contact",
      icon: MailIcon,
      title: "Contact",
      description: "Get in touch with us",
    },
  ]

  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)] min-h-[70vh] flex items-center">
      <Container size="lg">
        <Stack gap="xl" align="center" className="text-center">
          {/* 404 Indicator */}
          <div className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.25em]">
            Error 404
          </div>

          {/* Heading */}
          <Stack gap="md" align="center">
            <Title
              as="h1"
              className="font-headline text-[var(--web-ash)] text-[clamp(36px,6vw,56px)] font-normal leading-[1.1]"
            >
              Page not found
            </Title>
            <Text className="text-[var(--web-spruce)] text-[17px] font-light leading-relaxed max-w-lg">
              The page you are looking for may have been moved, renamed, or is
              temporarily unavailable. Let us help you find what you need.
            </Text>
          </Stack>

          {/* Primary CTA */}
          <Button
            size="lg"
            className="h-14 px-10 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
            render={<Link href="/" />}
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            Return to Homepage
          </Button>

          {/* Popular Links */}
          <Stack gap="md" align="center" className="mt-8 w-full max-w-2xl">
            <Text className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em]">
              Popular Pages
            </Text>

            <Grid cols={1} className="sm:grid-cols-3 gap-4 w-full">
              {popularLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex flex-col items-center p-6 bg-white rounded-[2px] border border-[var(--web-serenity)]/10 hover:border-[var(--web-serenity)]/30 shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-[var(--web-spruce)]/10 rounded-full mb-3 group-hover:bg-[var(--web-spruce)]/15 transition-colors">
                      <Icon className="h-5 w-5 text-[var(--web-spruce)]" />
                    </div>
                    <span className="font-headline text-[var(--web-ash)] text-[15px] font-normal mb-1">
                      {link.title}
                    </span>
                    <span className="text-[var(--web-spruce)] text-[12px] font-light">
                      {link.description}
                    </span>
                    <ArrowRightIcon className="h-4 w-4 text-[var(--web-serenity)] mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                )
              })}
            </Grid>
          </Stack>

          {/* Contact Support */}
          <Text className="text-[var(--web-serenity)] text-[13px] font-light mt-8">
            Still cannot find what you are looking for?{" "}
            <Link
              href="/contact"
              className="underline hover:text-[var(--web-spruce)] transition-colors"
            >
              Contact us
            </Link>{" "}
            and we will be happy to help.
          </Text>
        </Stack>
      </Container>
    </section>
  )
}
