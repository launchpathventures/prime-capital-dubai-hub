/**
 * CATALYST - Contact Page
 *
 * Contact form and information for Prime Capital Dubai.
 * Matches design: hero with contact buttons, 2-column form + contact details, consultation process
 */

import Image from "next/image"
import { config } from "@/lib/config"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
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
// Two columns: form + contact details with image
// =============================================================================

function ContactFormSection() {
  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="xl">
        <Grid cols={1} className="lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16">
          {/* Left Column - Form */}
          <div className="bg-white rounded-[2px] p-8 lg:p-10 shadow-sm">
            <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-2">
              Send a Message
            </span>
            <Title
              as="h2"
              className="font-headline text-[var(--web-ash)] text-[clamp(24px,3vw,32px)] font-normal leading-[1.25] mb-8"
            >
              How can we help?
            </Title>

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--web-ash)] text-[14px] font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-[var(--web-serenity)]/40 rounded-[2px] text-[15px] text-[var(--web-ash)] placeholder:text-[var(--web-spruce)]/50 focus:outline-none focus:border-[var(--web-spruce)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[var(--web-ash)] text-[14px] font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-4 py-3 border border-[var(--web-serenity)]/40 rounded-[2px] text-[15px] text-[var(--web-ash)] placeholder:text-[var(--web-spruce)]/50 focus:outline-none focus:border-[var(--web-spruce)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--web-ash)] text-[14px] font-medium mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+971..."
                  className="w-full px-4 py-3 border border-[var(--web-serenity)]/40 rounded-[2px] text-[15px] text-[var(--web-ash)] placeholder:text-[var(--web-spruce)]/50 focus:outline-none focus:border-[var(--web-spruce)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[var(--web-ash)] text-[13px] font-medium mb-2">
                  Area of Interest
                </label>
                <input
                  type="text"
                  placeholder="e.g., Property acquisition, Golden Visa, Investment advice"
                  className="w-full px-4 py-3 border border-[var(--web-serenity)]/40 rounded-[2px] text-[14px] text-[var(--web-ash)] placeholder:text-[var(--web-spruce)]/50 focus:outline-none focus:border-[var(--web-spruce)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[var(--web-ash)] text-[14px] font-medium mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your investment objectives..."
                  className="w-full px-4 py-3 border border-[var(--web-serenity)]/40 rounded-[2px] text-[15px] text-[var(--web-ash)] placeholder:text-[var(--web-spruce)]/50 focus:outline-none focus:border-[var(--web-spruce)] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto h-12 px-10 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
              >
                Send Message
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>

              <Text className="text-[var(--web-spruce)] text-[13px] font-light">
                We typically respond within one business day.
              </Text>
            </form>
          </div>

          {/* Right Column - Contact Details */}
          <Stack gap="lg">
            {/* Office Image */}
            <div className="relative aspect-[16/9] rounded-[2px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
                alt="Prime Capital Dubai Office"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <div className="text-[var(--web-off-white)] text-[14px] font-medium">
                  Visit Our Office
                </div>
                <div className="text-white/70 text-[13px]">
                  By appointment only
                </div>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white rounded-[2px] p-6 shadow-sm">
              <Title
                as="h3"
                className="font-headline text-[var(--web-ash)] text-lg font-normal mb-6"
              >
                Contact Details
              </Title>

              <Stack gap="md">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--web-off-white)] rounded-[2px] flex items-center justify-center shrink-0">
                    <MailIcon className="h-5 w-5 text-[var(--web-spruce)]" />
                  </div>
                  <div>
                    <div className="text-[var(--web-spruce)] text-[10px] uppercase tracking-[0.15em] mb-1">
                      Email
                    </div>
                    <a
                      href={`mailto:${config.contact.email}`}
                      className="text-[var(--web-ash)] text-[14px] font-medium hover:text-[var(--web-spruce)] transition-colors"
                    >
                      {config.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--web-off-white)] rounded-[2px] flex items-center justify-center shrink-0">
                    <PhoneIcon className="h-5 w-5 text-[var(--web-spruce)]" />
                  </div>
                  <div>
                    <div className="text-[var(--web-spruce)] text-[10px] uppercase tracking-[0.15em] mb-1">
                      Phone
                    </div>
                    <a
                      href={`tel:${config.contact.phone.replace(/\s/g, "")}`}
                      className="text-[var(--web-ash)] text-[14px] font-medium hover:text-[var(--web-spruce)] transition-colors"
                    >
                      {config.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--web-off-white)] rounded-[2px] flex items-center justify-center shrink-0">
                    <svg className="h-5 w-5 text-[var(--web-spruce)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[var(--web-spruce)] text-[10px] uppercase tracking-[0.15em] mb-1">
                      Office
                    </div>
                    <div className="text-[var(--web-ash)] text-[14px] font-medium">
                      {config.contact.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--web-off-white)] rounded-[2px] flex items-center justify-center shrink-0">
                    <svg className="h-5 w-5 text-[var(--web-spruce)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[var(--web-spruce)] text-[10px] uppercase tracking-[0.15em] mb-1">
                      Office Hours
                    </div>
                    <div className="text-[var(--web-ash)] text-[14px] font-medium">
                      Sunday – Thursday: 9:00 AM – 6:00 PM
                    </div>
                  </div>
                </div>
              </Stack>
            </div>

            {/* Prefer a Call Card */}
            <div className="bg-[var(--web-spruce)] rounded-[2px] p-6">
              <Title
                as="h3"
                className="font-headline text-[var(--web-off-white)] text-lg font-normal mb-2"
              >
                Prefer a call?
              </Title>
              <Text className="text-[var(--web-serenity)] text-[14px] font-light">
                We're happy to schedule a consultation at your convenience.
              </Text>
            </div>
          </Stack>
        </Grid>
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
      className="py-[var(--web-section-gap)]"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(63,65,66,0.97) 0%, rgba(63,65,66,0.98) 100%), url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container size="xl">
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
                className="font-headline text-[var(--web-off-white)] text-lg font-normal mb-3"
              >
                {step.title}
              </Title>
              
              <Text className="text-[var(--web-serenity)] text-[13px] font-light leading-relaxed">
                {step.description}
              </Text>
            </div>
          ))}
        </Grid>
      </Container>
    </section>
  )
}
