import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RatingModal } from '@/components/rides/RatingModal';
import { mockRides, mockPastRoutes, mockUsers, enrichRide } from '@/data/mockData';
import { format } from 'date-fns';
import { Car, Bike, MapPin, Clock, Star, History } from 'lucide-react';

export default function RideHistory() {
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);

  const enrichedRides = mockRides.map(enrichRide);

  const handleRateRide = (rideId: string) => {
    setSelectedRideId(rideId);
    setRatingModalOpen(true);
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Ride History</h1>
        <p className="text-muted-foreground mb-8">View your past rides and leave ratings</p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Past Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enrichedRides.map(ride => {
                const route = ride.route;
                const driver = route?.driver;
                return (
                  <div key={ride.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      {route?.vehicle === 'car' ? <Car className="h-6 w-6" /> : <Bike className="h-6 w-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium truncate">
                          {route?.pickup.address.split(',')[0]} → {route?.dropoff.address.split(',')[0]}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {route && format(new Date(route.datetime), 'MMM d, yyyy')}
                        </span>
                        {driver && <span>Driver: {driver.name}</span>}
                      </div>
                    </div>
                    {ride.feedback ? (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />{ride.feedback.rating}
                      </Badge>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleRateRide(ride.id)}>
                        <Star className="mr-1 h-3 w-3" />Rate
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      <RatingModal open={ratingModalOpen} onOpenChange={setRatingModalOpen} rideId={selectedRideId} />
    </Layout>
  );
}
