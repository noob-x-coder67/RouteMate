import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Navigation, 
  Phone, 
  MessageSquare, 
  Clock, 
  MapPin,
  Car,
  CheckCircle,
  Circle
} from 'lucide-react';
import { Route, User } from '@/types';

interface RideTrackingProps {
  route: Route & { driver?: User };
  userRole: 'driver' | 'passenger';
}

export function RideTracking({ route, userRole }: RideTrackingProps) {
  const [driverLocation, setDriverLocation] = useState({
    lat: route.pickup.lat - 0.02,
    lng: route.pickup.lng - 0.01,
  });
  const [eta, setEta] = useState(8); // minutes
  const [status, setStatus] = useState<'approaching' | 'arrived' | 'in_progress' | 'completed'>('approaching');

  // Simulate live location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation(prev => ({
        lat: prev.lat + (route.pickup.lat - prev.lat) * 0.1,
        lng: prev.lng + (route.pickup.lng - prev.lng) * 0.1,
      }));

      setEta(prev => {
        if (prev <= 1) {
          setStatus('arrived');
          return 0;
        }
        return prev - 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [route.pickup.lat, route.pickup.lng]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const statusSteps = [
    { id: 'confirmed', label: 'Ride Confirmed', done: true },
    { id: 'approaching', label: 'Driver Approaching', done: status !== 'approaching' || eta < 5 },
    { id: 'arrived', label: 'Driver Arrived', done: status === 'arrived' || status === 'in_progress' || status === 'completed' },
    { id: 'in_progress', label: 'Ride in Progress', done: status === 'in_progress' || status === 'completed' },
    { id: 'completed', label: 'Arrived at Destination', done: status === 'completed' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Live Ride Tracking
          </CardTitle>
          <Badge variant={status === 'arrived' ? 'default' : 'secondary'}>
            {status === 'approaching' && `ETA: ${eta} min`}
            {status === 'arrived' && 'Driver Arrived'}
            {status === 'in_progress' && 'In Progress'}
            {status === 'completed' && 'Completed'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Live Map Placeholder */}
        <div className="relative h-48 rounded-lg bg-muted mb-4 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="relative">
                {/* Driver marker */}
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
                  style={{
                    left: `${30 + (eta < 5 ? 20 : 0)}%`,
                    top: `${60 - (eta < 5 ? 10 : 0)}%`,
                  }}
                >
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Car className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rotate-45" />
                </div>

                {/* Pickup marker */}
                <div className="absolute left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center shadow-lg border-2 border-card">
                    <MapPin className="h-5 w-5 text-accent-foreground" />
                  </div>
                </div>

                {/* Route line */}
                <svg className="absolute inset-0 w-full h-full" style={{ width: '100%', height: '100%' }}>
                  <line 
                    x1="30%" 
                    y1="60%" 
                    x2="50%" 
                    y2="50%" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="2" 
                    strokeDasharray="4"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-card/80 px-2 py-1 rounded">
            Live tracking enabled
          </div>
        </div>

        {/* Driver Info */}
        {route.driver && userRole === 'passenger' && (
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(route.driver.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{route.driver.name}</p>
              <p className="text-sm text-muted-foreground">{route.vehicle === 'car' ? 'Car' : 'Bike'} • {route.driver.department}</p>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="outline">
                <Phone className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Status Timeline */}
        <div className="space-y-3">
          {statusSteps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                step.done ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step.done ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>
              <span className={step.done ? 'font-medium' : 'text-muted-foreground'}>
                {step.label}
              </span>
              {step.id === 'approaching' && status === 'approaching' && (
                <Badge variant="outline" className="ml-auto">
                  <Clock className="h-3 w-3 mr-1" />
                  {eta} min away
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button className="flex-1" variant="outline">
            <Navigation className="h-4 w-4 mr-2" />
            Open in Maps
          </Button>
          <Button className="flex-1">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Driver
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
