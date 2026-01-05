/**
 * CATALYST - Contact Page
 *
 * Contact form and information for Prime Capital Dubai.
 */

import { config } from "@/lib/config"
import { Container, Section, Stack, Row, Grid, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { LeadForm } from "@/components/shared"
import {
  MapPinIcon,
  MailIcon,
  PhoneIcon,
  ClockIcon,
} from "lucide-react"

export const metadata = {
  title: "Contact Us | Prime Capital Dubai",
  description: "Get in touch with Prime Capital Dubai for investment advisory.",
}

export default function ContactPage() {
  return (
    <Stack gap="none">
      {/* Hero */}
      <Section padding="xl" className="bg-gradient-to-b from-primary/5 to-background">
        <Container size="lg">
          <Stack gap="lg" align="center" className="text-center max-w-3xl mx-auto">
            <Title as="h1" size="h1" className="font-headline">
              Get In <span className="text-primary">Touch</span>
            </Title>
            <Text size="lg" variant="muted" className="leading-relaxed">
              We're here to answer your questions and discuss how we can support 
              your Dubai real estate objectives. No pressure, no obligation.
            </Text>
          </Stack>
        </Container>
      </Section>

      {/* Content */}
      <Section padding="xl">
        <Container size="xl">
          <Grid cols={3} gap="xl">
            {/* Contact Info */}
            <Stack gap="lg">
              <Title as="h2" size="h4" className="font-headline">Contact Information</Title>

              <Card>
                <CardContent className="pt-6">
                  <Stack gap="lg">
                    <Row gap="md" align="start">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPinIcon className="h-5 w-5 text-primary" />
                      </div>
                      <Stack gap="xs">
                        <Text weight="medium">Office Location</Text>
                        <Text size="sm" variant="muted">
                          {config.contact.address}
                        </Text>
                      </Stack>
                    </Row>

                    <Row gap="md" align="start">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <MailIcon className="h-5 w-5 text-primary" />
                      </div>
                      <Stack gap="xs">
                        <Text weight="medium">Email</Text>
                        <a
                          href={`mailto:${config.contact.email}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {config.contact.email}
                        </a>
                      </Stack>
                    </Row>

                    <Row gap="md" align="start">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <PhoneIcon className="h-5 w-5 text-primary" />
                      </div>
                      <Stack gap="xs">
                        <Text weight="medium">Phone</Text>
                        <a
                          href={`tel:${config.contact.phone.replace(/\s/g, "")}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {config.contact.phone}
                        </a>
                      </Stack>
                    </Row>

                    <Row gap="md" align="start">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <ClockIcon className="h-5 w-5 text-primary" />
                      </div>
                      <Stack gap="xs">
                        <Text weight="medium">Office Hours</Text>
                        <Text size="sm" variant="muted">
                          Sunday - Thursday<br />
                          9:00 AM - 6:00 PM (GST)
                        </Text>
                      </Stack>
                    </Row>
                  </Stack>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <Stack gap="md">
                    <Title as="h3" size="h5" className="font-headline">What to Expect</Title>
                    <Text size="sm" variant="muted" className="leading-relaxed">
                      After you submit the form, one of our advisors will review your 
                      enquiry and respond within one business day. There's no pressure 
                      to commit to anything—we're happy to simply answer questions and 
                      provide guidance.
                    </Text>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>

            {/* Contact Form */}
            <Stack gap="lg" className="col-span-2">
              <Title as="h2" size="h4" className="font-headline">Send Us a Message</Title>
              <LeadForm formId={config.forms.contact} minHeight={600} />
            </Stack>
          </Grid>
        </Container>
      </Section>
    </Stack>
  )
}
