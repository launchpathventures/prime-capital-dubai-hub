/**
 * CATALYST - Terms & Conditions Page
 *
 * Legal terms for Prime Capital Real Estate Brokers LLC.
 * RERA ORN: 28153 | Dubai, UAE
 *
 * Designed to match the visual quality of the rest of the web surface
 * with hero section, numbered section cards, and clear hierarchy.
 *
 * [CLIENT REVIEW] Items marked with this tag need client/legal verification:
 * - RERA ORN number (currently 28153)
 * - Registered business address
 * - Legal disclaimers and liability clauses
 */

import Link from "next/link"
import Image from "next/image"
import { Container, Stack, Grid, Text } from "@/components/core"
import { config } from "@/lib/config"
import {
  BuildingIcon,
  BriefcaseIcon,
  ShieldAlertIcon,
  DatabaseIcon,
  CookieIcon,
  CopyrightIcon,
  ScaleIcon,
  LandmarkIcon,
  PenLineIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
} from "lucide-react"

export const metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for Prime Capital Real Estate Brokers LLC services.",
  alternates: {
    canonical: "/terms",
  },
}

export default function TermsPage() {
  return (
    <div className="web-terms">
      <HeroSection />
      <TermsContentSection />
      <ContactSection />
    </div>
  )
}

// =============================================================================
// HERO SECTION
// Parallax-style hero consistent with other web pages
// =============================================================================

function HeroSection() {
  return (
    <section className="relative min-h-[45vh] flex flex-col justify-center items-center text-center">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero/about.jpg"
          alt=""
          fill
          priority
          className="object-cover object-[center_30%]"
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(63,65,66,0.6) 0%, rgba(63,65,66,0.7) 100%)" }}
        />
      </div>
      <Container size="lg" className="relative z-10 px-4">
        <Stack gap="md" align="center" className="max-w-[800px] mx-auto">
          <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.25em]">
            Legal
          </span>

          <h1
            className="font-headline text-[var(--web-off-white)] text-[clamp(32px,5vw,52px)] font-normal leading-[1.15] tracking-tight"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
          >
            Terms & Conditions
          </h1>

          <Text
            className="text-[var(--web-off-white)]/80 text-[clamp(14px,1.6vw,17px)] font-light leading-relaxed max-w-[500px] mt-1"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            Governing your use of services provided by Prime Capital Real
            Estate Brokers LLC
          </Text>

          <span className="text-[var(--web-off-white)]/50 text-[12px] mt-2">
            Last updated: February 2026
          </span>
        </Stack>
      </Container>
    </section>
  )
}

// =============================================================================
// TERMS CONTENT SECTION
// Numbered sections with cards and clear visual hierarchy
// =============================================================================

const SECTIONS = [
  {
    number: "01",
    title: "Company Information",
    icon: BuildingIcon,
    content: (
      <>
        <p>
          These Terms & Conditions govern your use of the services provided by{" "}
          <strong>Prime Capital Real Estate Brokers LLC</strong>, a company
          registered and licensed in the Emirate of Dubai, United Arab Emirates,
          operating under the regulatory framework of the Real Estate Regulatory
          Agency (RERA) of Dubai.
        </p>
        <div className="terms-details-grid">
          <div className="terms-detail">
            <span className="terms-detail-label">RERA ORN</span>
            {/* [CLIENT REVIEW] Verify RERA ORN number is correct */}
            <span className="terms-detail-value">{config.contact.reraOrn}</span>
          </div>
          <div className="terms-detail">
            <span className="terms-detail-label">Registered Address</span>
            {/* [CLIENT REVIEW] Confirm this is the official registered business address */}
            <span className="terms-detail-value">{config.contact.address}</span>
          </div>
          <div className="terms-detail">
            <span className="terms-detail-label">Email</span>
            <span className="terms-detail-value">{config.contact.email}</span>
          </div>
          <div className="terms-detail">
            <span className="terms-detail-label">Phone</span>
            <span className="terms-detail-value">{config.contact.phone}</span>
          </div>
        </div>
      </>
    ),
  },
  {
    number: "02",
    title: "Scope of Services",
    icon: BriefcaseIcon,
    content: (
      <>
        <p>
          Prime Capital Real Estate Brokers LLC provides real estate advisory and
          brokerage services, including but not limited to:
        </p>
        <ul>
          <li>Property acquisition advisory and sourcing</li>
          <li>Property valuation guidance</li>
          <li>Golden Visa eligibility consultation</li>
          <li>Property management referrals</li>
          <li>Exit strategy and resale advisory</li>
        </ul>
        <p>
          All services are provided on an advisory basis. Final property
          transactions are subject to separate agreements with developers,
          sellers, and other relevant parties.
        </p>
      </>
    ),
  },
  {
    number: "03",
    title: "Important Disclaimers",
    icon: ShieldAlertIcon,
    content: (
      <>
        <h4>Property Valuations</h4>
        <p>
          Any property valuations, price estimates, or market assessments
          provided by Prime Capital are for informational purposes only and do
          not constitute a formal valuation or appraisal. Property values may
          fluctuate based on market conditions, and past performance is not
          indicative of future results.
        </p>

        <h4>No Guaranteed Returns</h4>
        <p>
          Prime Capital does not guarantee any specific returns on property
          investments. Real estate investments carry inherent risks, including
          but not limited to market volatility, regulatory changes, currency
          fluctuations, and economic conditions. Investors should conduct their
          own due diligence and seek independent financial advice before making
          investment decisions.
        </p>

        <h4>Market Risk</h4>
        <p>
          The Dubai property market, like all real estate markets, is subject to
          fluctuation. Property values may increase or decrease. Rental yields
          may vary. Construction timelines for off-plan properties may be subject
          to delays. Prime Capital is not liable for any losses arising from
          market conditions or third-party actions.
        </p>

        <h4>Third-Party Services</h4>
        <p>
          Prime Capital may recommend or refer clients to third-party service
          providers including but not limited to mortgage brokers, legal
          advisors, property managers, and developers. Prime Capital is not
          responsible for the services, actions, or omissions of any third-party
          providers.
        </p>
      </>
    ),
  },
  {
    number: "04",
    title: "Data Collection & Privacy",
    icon: DatabaseIcon,
    content: (
      <>
        <h4>Information We Collect</h4>
        <p>
          When you submit an enquiry through our website, we collect the
          following information:
        </p>
        <ul>
          <li>Full name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Property preferences and requirements</li>
          <li>Investment timeline and budget range</li>
          <li>Any additional information you choose to provide</li>
        </ul>

        <h4>How We Use Your Information</h4>
        <p>Your information is used to:</p>
        <ul>
          <li>Respond to your enquiry and provide requested services</li>
          <li>
            Match you with suitable properties based on your stated preferences
          </li>
          <li>Send relevant property updates and market information</li>
          <li>Improve our services and customer experience</li>
          <li>Comply with legal and regulatory obligations</li>
        </ul>

        <h4>Information Sharing</h4>
        <p>
          We may share your information with the following categories of service
          providers:
        </p>
        <ul>
          <li>
            CRM system providers for lead management
          </li>
          <li>
            Property developers and sellers when facilitating transactions on
            your behalf
          </li>
          <li>Professional advisors when required for due diligence</li>
          <li>
            Regulatory authorities when required by law or regulatory obligations
          </li>
        </ul>
        <p>
          We do not sell or rent your personal information to third parties for
          marketing purposes.
        </p>

        <h4>Data Retention</h4>
        <p>
          We retain your personal information for as long as necessary to fulfil
          the purposes for which it was collected, or as required by applicable
          laws and regulations.
        </p>
      </>
    ),
  },
  {
    number: "05",
    title: "Cookie Usage",
    icon: CookieIcon,
    content: (
      <>
        <p>Our website uses cookies and similar technologies to:</p>
        <ul>
          <li>
            <strong>Vercel Analytics:</strong> Understand how visitors interact
            with our website to improve performance and experience. These cookies
            collect anonymised usage data and do not track you across other
            websites.
          </li>
          <li>
            <strong>Essential Cookies:</strong> Enable the website to function
            correctly, including session management and security features.
          </li>
        </ul>
        <p>
          By using our website, you consent to the use of these cookies. You can
          manage cookie preferences through your browser settings.
        </p>
      </>
    ),
  },
  {
    number: "06",
    title: "Intellectual Property",
    icon: CopyrightIcon,
    content: (
      <p>
        All content on this website, including text, images, logos, and design
        elements, is the property of Prime Capital Real Estate Brokers LLC or
        its licensors and is protected by applicable intellectual property laws.
        Reproduction or distribution without prior written consent is prohibited.
      </p>
    ),
  },
  {
    number: "07",
    title: "Limitation of Liability",
    icon: ScaleIcon,
    // [CLIENT REVIEW] This liability clause should be reviewed by legal counsel
    content: (
      <p>
        To the maximum extent permitted by UAE law, Prime Capital Real Estate Brokers
        LLC shall not be liable for any indirect, incidental, special,
        consequential, or punitive damages arising from or related to your use of
        our services or website, including but not limited to loss of profits,
        data, or business opportunities.
      </p>
    ),
  },
  {
    number: "08",
    title: "Governing Law & Jurisdiction",
    icon: LandmarkIcon,
    // [CLIENT REVIEW] Confirm jurisdiction preference (Dubai Courts vs DIFC Courts)
    content: (
      <p>
        These Terms & Conditions shall be governed by and construed in accordance
        with the laws of the United Arab Emirates and the Emirate of Dubai. Any
        disputes arising from or relating to these terms or our services shall be
        subject to the exclusive jurisdiction of the courts of Dubai, UAE, unless
        otherwise agreed in writing.
      </p>
    ),
  },
  {
    number: "09",
    title: "Amendments",
    icon: PenLineIcon,
    content: (
      <p>
        Prime Capital reserves the right to modify these Terms & Conditions at
        any time. Changes will be effective upon posting to this website. Your
        continued use of our services after any changes constitutes acceptance of
        the updated terms.
      </p>
    ),
  },
]

function TermsContentSection() {
  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="md">
        <Stack gap="xl">
          {SECTIONS.map((section) => (
            <TermsBlock key={section.number} {...section} />
          ))}
        </Stack>
      </Container>
    </section>
  )
}

function TermsBlock({
  number,
  title,
  icon: Icon,
  content,
}: {
  number: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  content: React.ReactNode
}) {
  return (
    <div className="terms-block">
      {/* Section header */}
      <div className="terms-block-header">
        <div className="terms-block-number">
          <Icon className="w-4 h-4" />
          <span>{number}</span>
        </div>
        <h2 className="terms-block-title">{title}</h2>
      </div>

      {/* Section content */}
      <div className="terms-block-content">{content}</div>
    </div>
  )
}

// =============================================================================
// CONTACT SECTION
// Dark footer CTA with contact info — matches consultation process pattern
// =============================================================================

function ContactSection() {
  return (
    <section
      className="relative py-[var(--web-section-gap)] overflow-hidden"
      style={{ background: "#4a5a5e" }}
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.06]">
        <Image
          src="/images/hero/about.jpg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <Container size="sm" className="relative z-10">
        <Stack gap="lg" align="center" className="text-center">
          <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.25em]">
            Questions?
          </span>

          <h2 className="font-headline text-[var(--web-off-white)] text-[clamp(24px,3.5vw,36px)] font-normal leading-[1.2]">
            Get in touch with our team
          </h2>

          <Text className="text-[var(--web-off-white)]/70 text-[15px] font-light leading-relaxed max-w-[400px]">
            If you have any questions about these Terms & Conditions, we're here
            to help.
          </Text>

          <Grid cols={1} className="sm:grid-cols-3 gap-6 mt-4 w-full max-w-[600px]">
            <a
              href={`mailto:${config.contact.email}`}
              className="terms-contact-card"
            >
              <MailIcon className="w-5 h-5" />
              <span className="terms-contact-label">Email</span>
              <span className="terms-contact-value">{config.contact.email}</span>
            </a>

            <a
              href={`tel:${config.contact.phone.replace(/\s/g, "")}`}
              className="terms-contact-card"
            >
              <PhoneIcon className="w-5 h-5" />
              <span className="terms-contact-label">Phone</span>
              <span className="terms-contact-value">{config.contact.phone}</span>
            </a>

            <Link href="/contact" className="terms-contact-card">
              <MapPinIcon className="w-5 h-5" />
              <span className="terms-contact-label">Visit</span>
              <span className="terms-contact-value">Contact Page</span>
            </Link>
          </Grid>
        </Stack>
      </Container>
    </section>
  )
}
