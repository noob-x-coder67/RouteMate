import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/AuthModal';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import {
  Leaf,
  MapPin,
  Users,
  Shield,
  Car,
  Bike,
  TrendingDown,
  ArrowRight,
  Star,
  CheckCircle,
} from 'lucide-react';
import heroCarpool from '@/assets/hero-carpool.jpg';
import studentsBikes from '@/assets/students-bikes.jpg';
import environmentSavings from '@/assets/environment-savings.jpg';

export default function Landing() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Handle anchor links from other pages
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      return;
    }
    setAuthModalTab('signup');
    setAuthModalOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Verified Students Only',
      description: 'Only @nutech.edu.pk emails can register, ensuring a safe community of verified students.',
    },
    {
      icon: MapPin,
      title: 'Smart Route Matching',
      description: 'AI-powered matching finds rides along your route with compatible schedules.',
    },
    {
      icon: Users,
      title: 'Women Safety First',
      description: 'Women-only ride options with gender-matched pools for enhanced safety.',
    },
    {
      icon: Leaf,
      title: 'Track Your Impact',
      description: 'See your CO₂ savings, fuel reduced, and contribution to sustainability goals.',
    },
  ];

  const stats = [
    { value: '25-30%', label: 'CO₂ Reduction', sublabel: 'per shared ride' },
    { value: '0.8-1.4L', label: 'Fuel Saved', sublabel: 'per ride average' },
    { value: '15-20%', label: 'Congestion Cut', sublabel: 'with active adoption' },
  ];

  const steps = [
    { step: 1, title: 'Sign Up', description: 'Register with your NUTECH email to verify your student status.' },
    { step: 2, title: 'Find or Offer', description: 'Search for rides matching your route or offer your own.' },
    { step: 3, title: 'Connect & Go', description: 'Chat with riders, confirm details, and share your commute.' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent/50 to-background py-20 lg:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Leaf className="h-4 w-4" />
                RouteMate — where students help each other win.
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Sharing Ride,{' '}
                <span className="text-primary">Can Save Generations</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                RouteMate connects verified NUTECH students for safe, eco-friendly carpooling. 
                Reduce costs, cut emissions, and build a sustainable campus community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {isAuthenticated ? (
                  <Link to="/home">
                    <Button size="lg" className="w-full sm:w-auto">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" onClick={handleGetStarted}>
                    Start Saving Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
                <Link to="/find-carpool">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Find a Ride
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-4 mt-8 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  University Verified
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Free to Use
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Connect & Save
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl shadow-xl overflow-hidden">
                <img 
                  src={heroCarpool} 
                  alt="University students carpooling together" 
                  className="w-full h-[400px] object-cover"
                />
                {/* Floating stats */}
                <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" />
                    <div>
                      <p className="text-2xl font-bold">156kg</p>
                      <p className="text-xs opacity-90">CO₂ Saved</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="sustainability" className="py-16 border-y bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="font-medium">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose RouteMate?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Turn lonely rides into shared moments, big savings, and a lighter carbon footprint.
              The everyday choice that actually makes a difference.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-xl bg-card border hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start carpooling in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 h-8 w-8 text-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            {isAuthenticated ? (
              <Link to="/find-carpool">
                <Button size="lg">
                  Find Your First Ride
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Button size="lg" onClick={handleGetStarted}>
                Join RouteMate Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Students & Collaboration Image Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={studentsBikes} 
                alt="Students with bikes on campus" 
                className="w-full h-[300px] object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Connect, Collaborate, Commute
              </h2>
              <p className="text-muted-foreground mb-6">
                Join a vibrant community of NUTECH students who share rides, reduce costs, 
                and make friends along the way. Whether you have a car, bike, or need a seat, 
                RouteMate connects you with the right people.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Build Connections</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Share Commutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SDG Section */}
      <section className="py-20">
        <div className="container">
          <div className="bg-gradient-to-r from-primary/10 via-accent to-primary/10 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Contributing to Sustainable Development Goals
                </h2>
                <p className="text-muted-foreground mb-6">
                  Every ride you share contributes to a more sustainable future. RouteMate aligns with global sustainability targets.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="px-4 py-2 bg-card rounded-lg border">
                    <p className="font-bold text-primary">SDG 11</p>
                    <p className="text-sm text-muted-foreground">Sustainable Cities</p>
                  </div>
                  <div className="px-4 py-2 bg-card rounded-lg border">
                    <p className="font-bold text-primary">SDG 12</p>
                    <p className="text-sm text-muted-foreground">Responsible Consumption</p>
                  </div>
                  <div className="px-4 py-2 bg-card rounded-lg border">
                    <p className="font-bold text-primary">SDG 13</p>
                    <p className="text-sm text-muted-foreground">Climate Action</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="rounded-xl overflow-hidden">
                  <img 
                    src={environmentSavings} 
                    alt="Environmental savings illustration" 
                    className="w-48 h-48 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab={authModalTab}
      />
    </Layout>
  );
}
