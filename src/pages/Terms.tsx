import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Terms() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing or using RouteMate, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. These terms apply to all users, including drivers and passengers.`,
    },
    {
      title: '2. Eligibility',
      content: `To use RouteMate, you must:
• Be a currently enrolled student at NUTECH
• Have a valid @nutech.edu.pk email address
• Be at least 18 years of age
• Have a valid driver's license if offering rides

RouteMate reserves the right to verify eligibility and suspend accounts that do not meet these requirements.`,
    },
    {
      title: '3. User Accounts',
      content: `You are responsible for:
• Maintaining the confidentiality of your account credentials
• All activities that occur under your account
• Providing accurate and current information in your profile
• Notifying us immediately of any unauthorized access

We may suspend or terminate accounts that violate these terms or engage in fraudulent activity.`,
    },
    {
      title: '4. User Conduct',
      content: `You agree NOT to:
• Provide false or misleading information
• Harass, threaten, or discriminate against other users
• Use the platform for any illegal purposes
• Attempt to circumvent safety features
• Share login credentials with others
• Engage in any behavior that endangers other users

Violation of these rules may result in immediate account suspension.`,
    },
    {
      title: '5. Ride Arrangements',
      content: `RouteMate is a platform that connects drivers and passengers. We are NOT a transportation provider. Key points:

• All ride arrangements are made directly between users
• Cost-sharing arrangements are between drivers and passengers
• Drivers are responsible for maintaining valid licenses and insurance
• Both parties must agree to pickup times and locations
• Either party may cancel, though frequent cancellations may affect ratings`,
    },
    {
      title: '6. Safety Disclaimer',
      content: `While we implement verification and safety features:
• We cannot guarantee the identity or behavior of users
• We are not responsible for the actions of drivers or passengers
• Users participate in rides at their own risk
• We encourage users to follow our safety guidelines
• Report any safety concerns immediately`,
    },
    {
      title: '7. Ratings and Reviews',
      content: `The rating system is designed to build trust:
• Rate other users honestly and fairly
• Reviews should be based on actual ride experiences
• False or malicious reviews are prohibited
• We may remove reviews that violate our guidelines
• Low ratings may result in account review`,
    },
    {
      title: '8. Intellectual Property',
      content: `All content on RouteMate, including logos, text, graphics, and software, is our property or licensed to us. You may not:
• Copy or distribute our content without permission
• Use our trademarks without authorization
• Reverse engineer our platform
• Create derivative works from our content`,
    },
    {
      title: '9. Limitation of Liability',
      content: `To the maximum extent permitted by law:
• RouteMate is provided "as is" without warranties
• We are not liable for any damages arising from platform use
• We are not responsible for ride outcomes or user actions
• Our total liability is limited to the extent permitted by law

This does not affect statutory rights that cannot be waived.`,
    },
    {
      title: '10. Changes to Terms',
      content: `We may update these terms from time to time. We will notify users of significant changes via email or in-app notification. Continued use of the platform after changes constitutes acceptance of the new terms.`,
    },
    {
      title: '11. Governing Law',
      content: `These terms are governed by the laws of Pakistan. Any disputes will be resolved in the courts of Islamabad, Pakistan.`,
    },
    {
      title: '12. Contact',
      content: `For questions about these Terms of Service, contact us at:
Email: legal@routemate.pk
Address: NUTECH Campus, Islamabad, Pakistan`,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <FileText className="h-3 w-3 mr-1" />
              Terms of Service
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">
              Please read these terms carefully before using RouteMate.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: January 2026
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8">
        <div className="container max-w-3xl mx-auto">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              RouteMate is a platform connecting students for carpooling. We do not provide 
              transportation services. All rides are arranged between users, and participants 
              are responsible for their own safety and compliance with local laws.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-6">
            {sections.map((section, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-bold mb-3">{section.title}</h2>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Agreement */}
      <section className="py-12 bg-muted/30">
        <div className="container text-center">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            By using RouteMate, you acknowledge that you have read, understood, and agree 
            to be bound by these Terms of Service and our Privacy Policy.
          </p>
        </div>
      </section>
    </Layout>
  );
}
