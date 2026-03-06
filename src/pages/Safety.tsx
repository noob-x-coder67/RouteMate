import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Phone, 
  MapPin,
  Eye,
  Star,
  Lock,
  Bell,
  Car,
  UserCheck
} from 'lucide-react';

export default function Safety() {
  const forDrivers = [
    {
      icon: UserCheck,
      title: 'Verify Passengers',
      description: 'Only accept ride requests from verified students. Check their ratings and reviews before accepting.',
    },
    {
      icon: MapPin,
      title: 'Choose Safe Locations',
      description: 'Set pickup points in well-lit, public areas. Avoid isolated locations, especially at night.',
    },
    {
      icon: Phone,
      title: 'Share Your Route',
      description: 'Let a friend or family member know your planned route and expected arrival time.',
    },
    {
      icon: Eye,
      title: 'Trust Your Instincts',
      description: 'If something feels wrong, it\'s okay to cancel. Your safety is more important than any ride.',
    },
  ];

  const forPassengers = [
    {
      icon: Star,
      title: 'Check Driver Ratings',
      description: 'Review the driver\'s ratings and read comments from previous passengers before requesting a ride.',
    },
    {
      icon: Shield,
      title: 'Use Women-Only Rides',
      description: 'Female passengers can filter for women-only rides offered by verified female drivers.',
    },
    {
      icon: Bell,
      title: 'Share Trip Details',
      description: 'Use our trip sharing feature to send your ride details to a trusted contact.',
    },
    {
      icon: Car,
      title: 'Verify Vehicle Details',
      description: 'Confirm the vehicle type and any identifying details before getting in.',
    },
  ];

  const generalTips = [
    'Always meet in public, well-lit areas',
    'Trust your instincts - if something feels off, don\'t proceed',
    'Keep your phone charged and accessible during rides',
    'Share your live location with a trusted friend or family member',
    'Sit in the back seat when possible',
    'Keep personal belongings close to you',
    'Avoid sharing sensitive personal information',
    'Report any concerning behavior immediately',
  ];

  const verificationFeatures = [
    {
      title: 'Email Verification',
      description: 'Only @nutech.edu.pk emails can register, ensuring all users are verified students.',
    },
    {
      title: 'Profile Verification',
      description: 'Users must complete their profile with department and preferences.',
    },
    {
      title: 'Rating System',
      description: 'Both drivers and passengers can rate each other after rides.',
    },
    {
      title: 'Gender Matching',
      description: 'Women-only ride options for enhanced comfort and safety.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Shield className="h-3 w-3 mr-1" />
              Safety First
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Your Safety is Our Priority</h1>
            <p className="text-lg text-muted-foreground">
              RouteMate is built with safety at its core. Learn about our safety features 
              and best practices for secure carpooling.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Notice */}
      <section className="py-8">
        <div className="container">
          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              <strong>In case of emergency:</strong> Contact local authorities immediately. 
              Pakistan Emergency: 1122 | Police: 15 | Women's Helpline: 1099
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Verification Features */}
      <section className="py-12">
        <div className="container">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">
              <Lock className="h-3 w-3 mr-1" />
              Trust & Verification
            </Badge>
            <h2 className="text-2xl font-bold">How We Keep You Safe</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {verificationFeatures.map((feature, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tips for Drivers */}
      <section id="safety" className="py-12 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Badge variant="outline" className="mb-4">For Drivers</Badge>
              <h2 className="text-2xl font-bold mb-6">Driver Safety Tips</h2>
              <div className="space-y-4">
                {forDrivers.map((tip, i) => (
                  <Card key={i}>
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                          <tip.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{tip.title}</h3>
                          <p className="text-sm text-muted-foreground">{tip.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Badge variant="outline" className="mb-4">For Passengers</Badge>
              <h2 className="text-2xl font-bold mb-6">Passenger Safety Tips</h2>
              <div className="space-y-4">
                {forPassengers.map((tip, i) => (
                  <Card key={i}>
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                          <tip.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{tip.title}</h3>
                          <p className="text-sm text-muted-foreground">{tip.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* General Tips */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  General Safety Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {generalTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Report Section */}
      <section className="py-12 bg-primary/5">
        <div className="container text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Report a Safety Concern</h2>
          <p className="text-muted-foreground mb-4 max-w-xl mx-auto">
            If you experience or witness any unsafe behavior, please report it immediately. 
            All reports are taken seriously and handled confidentially.
          </p>
          <p className="text-sm text-muted-foreground">
            Contact us at: <span className="font-medium">safety@routemate.pk</span>
          </p>
        </div>
      </section>
    </Layout>
  );
}
