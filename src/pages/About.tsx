import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Leaf, 
  Users, 
  Car, 
  Target, 
  Heart, 
  Globe,
  Lightbulb,
  Rocket,
  MapPin,
  Shield
} from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Every shared ride reduces carbon emissions and contributes to a greener future.',
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Verified student-only community with gender-matched options for enhanced security.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building meaningful connections among NUTECH students through shared commutes.',
    },
    {
      icon: Heart,
      title: 'Affordability',
      description: 'Splitting travel costs makes commuting more accessible for all students.',
    },
  ];

  const benefits = [
    'Reduce your carbon footprint by up to 30% per shared ride',
    'Save money on fuel and transportation costs',
    'Connect with fellow students from your department',
    'Safe, verified community of NUTECH students only',
    'Flexible scheduling with recurring ride options',
    'Real-time tracking and in-app messaging',
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-16 lg:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Lightbulb className="h-3 w-3 mr-1" />
              Your Campus Carpooling Companion
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
               RouteMate!
            </h1>
            <p className="text-lg text-muted-foreground">
              RouteMate is a student-driven initiative to transform campus commuting through 
              sustainable, safe, and affordable carpooling solutions for NUTECH students.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Our Mission</Badge>
              <h2 className="text-3xl font-bold mb-6">
                Revolutionizing Campus Mobility Through Shared Rides
              </h2>
              <p className="text-muted-foreground mb-4">
                At RouteMate, we believe that sustainable transportation shouldn't be complicated. 
                Our platform connects verified NUTECH students who share similar routes, making 
                daily commutes more efficient, affordable, and environmentally friendly.
              </p>
              <p className="text-muted-foreground mb-6">
                By leveraging technology, we're not just reducing the number of vehicles on the road—we're 
                building a community of environmentally conscious students who contribute to the UN's 
                Sustainable Development Goals while saving time and money.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">SDG 11: Sustainable Cities</Badge>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">SDG 12: Responsible Consumption</Badge>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">SDG 13: Climate Action</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map((value, i) => (
                <Card key={i} className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <value.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold mb-1">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What is Carpooling */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4">
              <Car className="h-3 w-3 mr-1" />
              Understanding Carpooling
            </Badge>
            <h2 className="text-3xl font-bold mb-4">What is Carpooling?</h2>
            <p className="text-muted-foreground">
              Carpooling is the sharing of car or bike journeys so that more than one person travels 
              in a vehicle, reducing the number of individual trips and associated costs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Benefits of Carpooling
                </h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs">✓</span>
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Environmental Impact
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/5">
                    <p className="text-3xl font-bold text-primary">25-30%</p>
                    <p className="text-sm text-muted-foreground">CO₂ reduction per shared ride</p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5">
                    <p className="text-3xl font-bold text-primary">0.8-1.4L</p>
                    <p className="text-sm text-muted-foreground">Fuel saved per ride on average</p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5">
                    <p className="text-3xl font-bold text-primary">15-20%</p>
                    <p className="text-sm text-muted-foreground">Traffic congestion reduction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4">
              <Rocket className="h-3 w-3 mr-1" />
              Meet the Founder
            </Badge>
            <h2 className="text-3xl font-bold mb-4">The Mind Behind RouteMate</h2>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    RZ
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-2xl font-bold mb-1">Rao Muhammad Zubair</h3>
                <p className="text-muted-foreground mb-4">Founder & Developer</p>
                <div className="flex gap-2 mb-6">
                  <Badge variant="secondary">Software Engineering Student</Badge>
                  <Badge variant="secondary">NUTECH</Badge>
                </div>
                <blockquote className="text-lg italic text-muted-foreground max-w-lg">
                  "A software engineering student trying to solve the real challenges of the 
                  people through technology. RouteMate is my vision of making campus commuting 
                  sustainable, safe, and accessible for every student."
                </blockquote>
                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  NUTECH, Islamabad, Pakistan
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container text-center">
          <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Join the Green Commute Revolution</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Be part of the change. Every shared ride counts towards a sustainable future 
            for our campus and our planet.
          </p>
        </div>
      </section>
    </Layout>
  );
}
