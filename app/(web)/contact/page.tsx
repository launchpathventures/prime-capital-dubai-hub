/**
 * CATALYST - Contact Page
 *
 * Contact form and information for Prime Capital Dubai.
 * Clean, focused layout: hero with quick contact options, centered form, consultation process.
 */

import { config } from "@/lib/config"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { LeadForm } from "@/components/shared/lead-form"
import { PhoneIcon, MailIcon, MessageCircleIcon } from "lucide-react"

export const metadata = {
  title: "Contact Us | Prime Capital Dubai",
  description: "Get in touch with Prime Capital Dubai for investment advisory.",
}

export default function ContactPage() {
  return (
    <div className="web-contact">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Contact Form + Details */}
      <ContactFormSection />
      
      {/* Consultation Process */}
      <ConsultationProcessSection />
    </div>
  )
}

// =============================================================================
// HERO SECTION
// Full-width hero with contact quick links
// =============================================================================

function HeroSection() {
  return (
    <section
      className="relative min-h-[55vh] flex flex-col justify-center items-center text-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(63,65,66,0.55) 0%, rgba(63,65,66,0.65) 100%), url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
      }}
    >
      <Container size="lg" className="relative z-10 px-4">
        <Stack gap="md" align="center" className="max-w-[800px] mx-auto">
          <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.25em]">
            Contact
          </span>
          
          <h1
            className="font-headline text-[var(--web-off-white)] text-[clamp(36px,5.5vw,56px)] font-normal leading-[1.1] tracking-tight"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
          >
            Let's start a conversation
          </h1>

          <Text
            className="text-white/80 text-[clamp(15px,1.8vw,18px)] font-light leading-relaxed max-w-[540px] mt-2"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.2)" }}
          >
            Whether you have a specific property in mind or are exploring your options,
            we're here to help.
          </Text>
        </Stack>
      </Container>

      {/* Contact Quick Links */}
      <div className="absolute bottom-0 left-0 right-0 bg-[var(--web-off-white)]">
        <Container size="xl">
          <div className="flex flex-wrap justify-center gap-4 py-6">
            <a
              href={`tel:${config.contact.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 px-6 py-3 border border-[var(--web-spruce)]/30 rounded-[2px] text-[var(--web-spruce)] text-[13px] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)] transition-colors"
            >
              <PhoneIcon className="h-4 w-4" />
              {config.contact.phone}
            </a>
            <a
              href={`mailto:${config.contact.email}`}
              className="flex items-center gap-3 px-6 py-3 border border-[var(--web-spruce)]/30 rounded-[2px] text-[var(--web-spruce)] text-[13px] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)] transition-colors"
            >
              <MailIcon className="h-4 w-4" />
              {config.contact.email}
            </a>
            <a
              href={`https://wa.me/${config.contact.phone.replace(/\s/g, "").replace("+", "")}`}
              className="flex items-center gap-3 px-6 py-3 border border-[var(--web-spruce)]/30 rounded-[2px] text-[var(--web-spruce)] text-[13px] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)] transition-colors"
            >
              <MessageCircleIcon className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </Container>
      </div>
    </section>
  )
}

// =============================================================================
// CONTACT FORM SECTION
// Centered, focused form layout
// =============================================================================

function ContactFormSection() {
  return (
    <section className="bg-[var(--web-off-white)] pt-12 pb-[var(--web-section-gap)]">
      <Container size="sm">
        <LeadForm mode="contact" theme="light" />
      </Container>
    </section>
  )
}

// =============================================================================
// CONSULTATION PROCESS SECTION
// Dark background with 3 steps
// =============================================================================

function ConsultationProcessSection() {
  const steps = [
    {
      number: "01",
      title: "Initial Response",
      description: "We'll respond to your enquiry within one business day to schedule a call.",
    },
    {
      number: "02",
      title: "Discovery Call",
      description: "A 30-minute conversation to understand your objectives and answer your questions.",
    },
    {
      number: "03",
      title: "Tailored Proposal",
      description: "Based on our discussion, we'll outline how we can best support your goals.",
    },
  ]

  return (
    <section
      className="py-[var(--web-section-gap)] relative"
      style={{
        backgroundColor: "#4a5a5e", // Blue-slate, consistent with other CTAs
      }}
    >
      {/* Subtle cityscape silhouette */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
        }}
      />
      <Container size="xl" className="relative z-10">
        <Stack gap="xl" align="center" className="text-center mb-16">
          <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em]">
            What to Expect
          </span>
          <Title
            as="h2"
            className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.3]"
          >
            Our consultation process
          </Title>
          <Text className="text-white/60 text-[15px] font-light max-w-[500px]">
            A straightforward path from enquiry to tailored advice
          </Text>
        </Stack>

        <Grid cols={1} className="md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white/5 rounded-[2px] p-8 text-center"
            >
              {/* Circle with number */}
              <div className="w-14 h-14 rounded-full border-2 border-[var(--web-serenity)]/40 flex items-center justify-center mx-auto mb-6">
                <span className="font-headline text-[var(--web-off-white)] text-lg">
                  {step.number}
                </span>
              </div>
              
              <Title
                as="h3"
                className="font-headline text-[var(--web-off-white)] text-lg font-normal mb-3 text-center"
              >
                {step.title}
              </Title>
              
              <Text className="text-[var(--web-serenity)] text-[13px] font-light leading-relaxed text-center">
                {step.description}
              </Text>
            </div>
          ))}
        </Grid>
      </Container>
      
      {/* Bottom separator line for visual break with footer */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
    </section>
  )
}
