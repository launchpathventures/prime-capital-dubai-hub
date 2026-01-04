/**
 * CATALYST - Terms & Conditions Page
 *
 * Placeholder page for Terms & Conditions.
 */

import { Container, Stack, Title, Text, Prose } from "@/components/core"

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using our service.",
}

export default function TermsPage() {
  return (
    <Container size="md" className="py-16">
      <Stack gap="lg">
        <Stack gap="sm">
          <Title size="h1">Terms & Conditions</Title>
          <Text variant="muted">Last updated: December 2024</Text>
        </Stack>

        <Prose>
          <h2>1. Introduction</h2>
          <p>
            Welcome to our service. By accessing or using our platform, you agree to be 
            bound by these Terms & Conditions. Please read them carefully.
          </p>

          <h2>2. Use of Service</h2>
          <p>
            You agree to use this service only for lawful purposes and in accordance 
            with these Terms. You are responsible for maintaining the confidentiality 
            of your account credentials.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            When you create an account, you must provide accurate and complete information. 
            You are solely responsible for activity that occurs under your account.
          </p>

          <h2>4. Privacy</h2>
          <p>
            Your use of the service is also governed by our Privacy Policy. Please review 
            our Privacy Policy to understand our practices.
          </p>

          <h2>5. Modifications</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users 
            of any material changes via email or through the service.
          </p>

          <h2>6. Contact</h2>
          <p>
            If you have any questions about these Terms, please contact us.
          </p>
        </Prose>
      </Stack>
    </Container>
  )
}
