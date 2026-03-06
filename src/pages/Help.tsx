import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Mail,
  Search,
  Car,
  MapPin,
  CreditCard,
  Shield,
  Star,
  Clock,
  Users
} from 'lucide-react';

export default function Help() {
  const categories = [
    {
      icon: Car,
      title: 'Getting Started',
      description: 'Learn how to use RouteMate',
    },
    {
      icon: Search,
      title: 'Finding Rides',
      description: 'Tips for searching carpools',
    },
    {
      icon: MapPin,
      title: 'Offering Rides',
      description: 'How to share your commute',
    },
    {
      icon: Shield,
      title: 'Safety & Trust',
      description: 'Our verification system',
    },
  ];

  const faqs = [
    {
      question: 'How do I sign up for RouteMate?',
      answer: 'Click the "Get Started" button on the homepage and enter your NUTECH email address (@nutech.edu.pk). You\'ll need to verify your email and complete your profile with your department and preferences.',
    },
    {
      question: 'Is RouteMate free to use?',
      answer: 'Yes! RouteMate is completely free for all verified NUTECH students. We don\'t charge any platform fees. Any cost-sharing between drivers and passengers is arranged directly between them.',
    },
    {
      question: 'How do I find a carpool?',
      answer: 'Go to "Find Carpool" and enter your pickup location, destination, and preferred time. You can use filters to find female-only rides, same-department drivers, or highly-rated drivers. Browse available rides and send a request to join.',
    },
    {
      question: 'How do I offer a ride?',
      answer: 'Navigate to "Offer Ride" and complete the 3-step form: 1) Set your route with pickup and dropoff locations, 2) Choose your departure date and time, 3) Set your preferences including vehicle type and available seats. You can also set up recurring rides for your regular commute.',
    },
    {
      question: 'What is the women-only option?',
      answer: 'Female drivers can mark their rides as "Women Only," meaning only verified female students can request to join. This feature provides an additional layer of comfort and safety for female commuters.',
    },
    {
      question: 'How does the rating system work?',
      answer: 'After each completed ride, both drivers and passengers can rate each other on a 5-star scale and leave optional comments. These ratings help build trust in the community and help users make informed decisions.',
    },
    {
      question: 'Can I set up recurring rides?',
      answer: 'Yes! When offering a ride, you can enable recurring schedules. Choose from daily, weekdays-only, or custom weekly patterns. This is perfect for regular commuters who travel at the same time each day.',
    },
    {
      question: 'How do I communicate with other users?',
      answer: 'Once your ride request is accepted, you can use the in-app messaging feature to coordinate pickup details, share contact information, or discuss any changes to the schedule.',
    },
    {
      question: 'What if I need to cancel a ride?',
      answer: 'You can cancel a ride from your dashboard. Please cancel as early as possible to give other users time to make alternative arrangements. Frequent cancellations may affect your rating.',
    },
    {
      question: 'How are CO₂ savings calculated?',
      answer: 'We use the ICCT (International Council on Clean Transportation) methodology. On average, each shared ride saves approximately 0.12 kg of CO₂ per kilometer compared to solo driving. Your dashboard shows your personal and community impact.',
    },
  ];

  const guides = [
    {
      icon: BookOpen,
      title: 'First-Time User Guide',
      steps: [
        'Sign up with your @nutech.edu.pk email',
        'Complete your profile with department and preferences',
        'Browse available carpools or offer your first ride',
        'Send or accept ride requests',
        'Rate your experience after each ride',
      ],
    },
    {
      icon: Car,
      title: 'For Drivers',
      steps: [
        'Go to "Offer Ride" from the menu',
        'Set your pickup and dropoff locations on the map',
        'Choose your departure date and time',
        'Select vehicle type and available seats',
        'Enable recurring rides for daily commutes',
        'Review and approve ride requests',
      ],
    },
    {
      icon: Users,
      title: 'For Passengers',
      steps: [
        'Use "Find Carpool" to search available rides',
        'Apply filters to find compatible rides',
        'Check driver ratings and reviews',
        'Send a ride request with optional message',
        'Wait for driver approval',
        'Coordinate pickup details via messaging',
      ],
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <HelpCircle className="h-3 w-3 mr-1" />
              Help Center
            </Badge>
            <h1 className="text-4xl font-bold mb-4">How Can We Help?</h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions and learn how to make the most of RouteMate.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-12 border-b">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Card key={i} className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6">Quick Start Guides</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {guides.map((guide, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <guide.icon className="h-5 w-5 text-primary" />
                    {guide.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {guide.steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                          {j + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 bg-muted/30">
        <div className="container">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-lg border px-4">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Reach out to us and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Card className="flex-1 max-w-xs">
                <CardContent className="pt-6 text-center">
                  <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Email Support</h3>
                  <p className="text-sm text-muted-foreground">support@routemate.pk</p>
                </CardContent>
              </Card>
              <Card className="flex-1 max-w-xs">
                <CardContent className="pt-6 text-center">
                  <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">In-App Chat</h3>
                  <p className="text-sm text-muted-foreground">Message us anytime</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
