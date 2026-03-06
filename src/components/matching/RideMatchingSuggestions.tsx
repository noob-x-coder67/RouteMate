import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Star, 
  Users,
  Car,
  Bike,
  TrendingUp,
  Leaf
} from 'lucide-react';
import { Route, User } from '@/types';
import { mockRoutes, enrichRouteWithDriver } from '@/data/mockData';
import { format, differenceInMinutes } from 'date-fns';
import { calculateRideCo2Savings, calculateRideFuelSavings, calculateDistance } from '@/utils/sustainability';

interface RideMatchingSuggestionsProps {
  user: User;
  preferredPickup?: { lat: number; lng: number; address: string };
  preferredDropoff?: { lat: number; lng: number; address: string };
  preferredTime?: string;
}

interface ScoredRoute {
  route: Route & { driver?: User };
  score: number;
  matchReasons: string[];
  estimatedSavings: { co2: number; fuel: number };
}

export function RideMatchingSuggestions({ 
  user, 
  preferredPickup, 
  preferredDropoff, 
  preferredTime 
}: RideMatchingSuggestionsProps) {
  
  const scoredRoutes = useMemo(() => {
    const routes = mockRoutes
      .filter(r => r.status === 'active' && r.driverId !== user.id && r.availableSeats > 0)
      .map(enrichRouteWithDriver);

    const scored: ScoredRoute[] = routes.map(route => {
      let score = 0;
      const matchReasons: string[] = [];

      // 1. Route overlap score (0-40 points)
      if (preferredPickup && preferredDropoff) {
        const pickupDistance = calculateDistance(
          preferredPickup.lat, preferredPickup.lng,
          route.pickup.lat, route.pickup.lng
        );
        const dropoffDistance = calculateDistance(
          preferredDropoff.lat, preferredDropoff.lng,
          route.dropoff.lat, route.dropoff.lng
        );
        
        if (pickupDistance < 2) {
          score += 20 - pickupDistance * 5;
          matchReasons.push('Pickup nearby');
        }
        if (dropoffDistance < 2) {
          score += 20 - dropoffDistance * 5;
          matchReasons.push('Destination match');
        }
      } else {
        // Default scoring based on common routes to NUTECH
        if (route.dropoff.address.includes('NUTECH')) {
          score += 15;
          matchReasons.push('Goes to NUTECH');
        }
      }

      // 2. Time compatibility score (0-20 points)
      if (preferredTime) {
        const preferredDate = new Date(preferredTime);
        const routeDate = new Date(route.datetime);
        const timeDiff = Math.abs(differenceInMinutes(routeDate, preferredDate));
        
        if (timeDiff <= 30) {
          score += 20 - (timeDiff / 3);
          matchReasons.push('Perfect timing');
        } else if (timeDiff <= 60) {
          score += 10;
          matchReasons.push('Flexible timing');
        }
      } else {
        // Prefer morning rides (typical commute time)
        const routeHour = new Date(route.datetime).getHours();
        if (routeHour >= 7 && routeHour <= 9) {
          score += 10;
          matchReasons.push('Morning commute');
        }
      }

      // 3. Same department bonus (10 points)
      if (route.driver?.department === user.department) {
        score += 10;
        matchReasons.push('Same department');
      }

      // 4. Gender preference match (10 points)
      if (user.gender === 'female' && route.womenOnly) {
        score += 10;
        matchReasons.push('Women-only ride');
      }

      // 5. Driver rating bonus (0-10 points)
      if (route.driver && route.driver.rating >= 4.5) {
        score += (route.driver.rating - 4) * 5;
        matchReasons.push('Highly rated driver');
      }

      // 6. Preference compatibility (0-10 points)
      if (user.preferences.noSmoking && route.driver?.preferences.noSmoking) {
        score += 5;
      }
      if (user.preferences.musicAllowed === route.driver?.preferences.musicAllowed) {
        score += 5;
      }

      // Calculate estimated savings
      const distance = calculateDistance(
        route.pickup.lat, route.pickup.lng,
        route.dropoff.lat, route.dropoff.lng
      );
      const estimatedSavings = {
        co2: calculateRideCo2Savings(distance, route.vehicle, 1),
        fuel: calculateRideFuelSavings(distance, route.vehicle, 1),
      };

      return { route, score, matchReasons, estimatedSavings };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [user, preferredPickup, preferredDropoff, preferredTime]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (scoredRoutes.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Smart Ride Suggestions
        </CardTitle>
        <CardDescription>
          AI-matched carpools based on your route, schedule, and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scoredRoutes.map(({ route, score, matchReasons, estimatedSavings }, index) => (
            <div 
              key={route.id}
              className="relative p-4 rounded-lg border hover:border-primary/50 transition-colors"
            >
              {/* Match Score Badge */}
              {index === 0 && (
                <Badge className="absolute -top-2 -right-2 bg-primary">
                  Best Match
                </Badge>
              )}

              <div className="flex items-start gap-4">
                {/* Driver Avatar */}
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {route.driver ? getInitials(route.driver.name) : '??'}
                  </AvatarFallback>
                </Avatar>

                {/* Ride Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{route.driver?.name}</span>
                    {route.driver && (
                      <span className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                        {route.driver.rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>
                      {route.pickup.address.split(',')[0]} → {route.dropoff.address.split(',')[0]}
                    </span>
                  </div>

                  {/* Time & Vehicle */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(route.datetime), 'EEE, h:mm a')}
                    </span>
                    <span className="flex items-center gap-1">
                      {route.vehicle === 'car' ? <Car className="h-3 w-3" /> : <Bike className="h-3 w-3" />}
                      {route.availableSeats} seats
                    </span>
                  </div>

                  {/* Match Reasons */}
                  <div className="flex flex-wrap gap-1">
                    {matchReasons.slice(0, 3).map((reason, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Savings & Action */}
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-primary mb-2">
                    <Leaf className="h-3 w-3" />
                    <span className="font-medium">{estimatedSavings.co2.toFixed(1)} kg CO₂</span>
                  </div>
                  <Button size="sm">
                    Request Ride
                  </Button>
                </div>
              </div>

              {/* Match Score Bar */}
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Match Score</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min(score, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{Math.round(score)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
