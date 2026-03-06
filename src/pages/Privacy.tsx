import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, UserCheck, Bell } from 'lucide-react';

export default function Privacy() {
  const sections = [
    {
      title: 'Information We Collect',
      content: `When you use RouteMate, we collect the following information:
      
• **Account Information**: Your name, email address (@nutech.edu.pk), gender, and department.
• **Profile Data**: Your preferences (smoking, music, pets), vehicle details if you're a driver.
• **Location Data**: Pickup and dropoff locations for your rides.
• **Usage Data**: Ride history, ratings, and in-app messages.
• **Device Information**: Basic device identifiers for app functionality.`,
    },
    {
      title: 'How We Use Your Information',
      content: `We use your information to:

• Verify your identity as a NUTECH student
• Match you with compatible carpools based on route and preferences
• Facilitate communication between drivers and passengers
• Calculate and display sustainability metrics (CO₂ savings)
• Improve our services and user experience
• Ensure platform safety and prevent misuse`,
    },
    {
      title: 'Information Sharing',
      content: `We share your information only in the following circumstances:

• **With Other Users**: Your name, rating, and department are visible to potential carpool matches. Email and contact details are only shared after a ride is confirmed.
• **For Safety**: We may share information with law enforcement if required by law or to protect user safety.
• **Service Providers**: We may use third-party services for analytics and infrastructure, bound by confidentiality agreements.

We never sell your personal information to advertisers or third parties.`,
    },
    {
      title: 'Data Security',
      content: `We implement industry-standard security measures to protect your data:

• All data transmission is encrypted using HTTPS/TLS
• Passwords are hashed and never stored in plain text
• Access to user data is restricted to authorized personnel only
• Regular security audits and vulnerability assessments`,
    },
    {
      title: 'Your Rights',
      content: `You have the right to:

• **Access**: Request a copy of your personal data
• **Correction**: Update or correct your profile information
• **Deletion**: Request deletion of your account and associated data
• **Portability**: Request your data in a portable format

To exercise these rights, contact us at privacy@routemate.pk`,
    },
    {
      title: 'Data Retention',
      content: `We retain your data as follows:

• **Active Accounts**: Data is retained while your account is active
• **Ride History**: Kept for 2 years for safety and dispute resolution
• **Deleted Accounts**: Data is permanently deleted within 30 days of account deletion
• **Messages**: Retained for 90 days after ride completion`,
    },
  ];

  const highlights = [
    { icon: Lock, text: 'End-to-end encryption for messages' },
    { icon: Eye, text: 'No tracking outside the app' },
    { icon: Database, text: 'Data stored securely in Pakistan' },
    { icon: UserCheck, text: 'NUTECH-only verification' },
    { icon: Shield, text: 'No data sold to third parties' },
    { icon: Bell, text: 'You control notification preferences' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Lock className="h-3 w-3 mr-1" />
              Privacy Policy
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Your Privacy Matters</h1>
            <p className="text-lg text-muted-foreground">
              We're committed to protecting your personal information. This policy explains 
              how we collect, use, and safeguard your data.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: January 2026
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-4">
            {highlights.map((item, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
                <item.icon className="h-4 w-4 text-primary" />
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-8">
            {sections.map((section, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">{section.title}</h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    {section.content.split('\n').map((line, j) => (
                      <p key={j} className="mb-2">
                        {line.startsWith('•') ? (
                          <span dangerouslySetInnerHTML={{ 
                            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') 
                          }} />
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-xl font-bold mb-4">Questions About Your Privacy?</h2>
          <p className="text-muted-foreground">
            Contact our Privacy Team at: <span className="font-medium">privacy@routemate.pk</span>
          </p>
        </div>
      </section>
    </Layout>
  );
}
