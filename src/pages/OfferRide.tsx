import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { LocationAutocomplete } from '@/components/common/LocationAutocomplete';
import { RecurringRideOptions } from '@/components/rides/RecurringRideOptions';
import { format } from 'date-fns';
import { CalendarDays, Clock, Car, Bike, Users, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = ['Route', 'Schedule', 'Preferences'];

export default function OfferRide() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    pickup: '',
    pickupLat: undefined as number | undefined,
    pickupLng: undefined as number | undefined,
    dropoff: '',
    dropoffLat: undefined as number | undefined,
    dropoffLng: undefined as number | undefined,
    date: undefined as Date | undefined,
    time: '',
    vehicle: 'car' as 'car' | 'bike',
    seats: '3',
    womenOnly: false,
    recurring: {
      enabled: false,
      type: 'weekdays' as 'daily' | 'weekdays' | 'weekly',
      days: [1, 2, 3, 4, 5] as number[],
    },
  });

  const handlePickupChange = (value: string, lat?: number, lng?: number) => {
    setFormData({
      ...formData,
      pickup: value,
      pickupLat: lat,
      pickupLng: lng,
    });
  };

  const handleDropoffChange = (value: string, lat?: number, lng?: number) => {
    setFormData({
      ...formData,
      dropoff: value,
      dropoffLat: lat,
      dropoffLng: lng,
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!formData.pickupLat || !formData.pickupLng) {
      toast({
        title: "Please select pickup location",
        description: "Choose a location from the dropdown suggestions.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.dropoffLat || !formData.dropoffLng) {
      toast({
        title: "Please select dropoff location",
        description: "Choose a location from the dropdown suggestions.",
        variant: "destructive",
      });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const departureTime =
        formData.date && formData.time
          ? new Date(
              `${format(formData.date, "yyyy-MM-dd")}T${formData.time}`,
            ).toISOString()
          : new Date().toISOString();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/rides`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          originAddress: formData.pickup,
          originLat: formData.pickupLat || 0,
          originLng: formData.pickupLng || 0,
          destAddress: formData.dropoff,
          destLat: formData.dropoffLat || 0,
          destLng: formData.dropoffLng || 0,
          distance: 10,
          vehicle: formData.vehicle.toUpperCase(),
          totalSeats: parseInt(formData.seats),
          departureTime,
          womenOnly: formData.womenOnly,
        }),
      });

      if (!response.ok) throw new Error("Failed to post ride");

      toast({
        title: "Ride Posted!",
        description: "Your ride is now visible to other students.",
      });
      navigate("/find-carpool");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post ride. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Offer a Ride</h1>
        <p className="text-muted-foreground mb-8">Share your commute with fellow NUTECH students</p>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className={cn(
                'h-10 w-10 rounded-full flex items-center justify-center font-medium',
                i < currentStep ? 'bg-primary text-primary-foreground' :
                i === currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}>
                {i < currentStep ? <Check className="h-5 w-5" /> : i + 1}
              </div>
              <span className={cn('ml-2 hidden sm:block', i === currentStep ? 'font-medium' : 'text-muted-foreground')}>{step}</span>
              {i < steps.length - 1 && <div className="w-12 sm:w-24 h-1 mx-2 bg-muted rounded" />}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>{steps[currentStep]}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {currentStep === 0 && (
              <>
                <div className="space-y-2">
                  <Label>Pickup Location</Label>
                  <LocationAutocomplete
                    value={formData.pickup}
                    onChange={handlePickupChange}
                    placeholder="e.g., F-7 Markaz, Islamabad"
                    icon="pickup"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Drop-off Location</Label>
                  <LocationAutocomplete
                    value={formData.dropoff}
                    onChange={handleDropoffChange}
                    placeholder="e.g., NUTECH Campus"
                    icon="dropoff"
                  />
                </div>
              </>
            )}
            {currentStep === 1 && (
              <>
                <RecurringRideOptions
                  enabled={formData.recurring.enabled}
                  type={formData.recurring.type}
                  days={formData.recurring.days}
                  onEnabledChange={(enabled) =>
                    setFormData({ ...formData, recurring: { ...formData.recurring, enabled } })
                  }
                  onTypeChange={(type) =>
                    setFormData({ ...formData, recurring: { ...formData.recurring, type } })
                  }
                  onDaysChange={(days) =>
                    setFormData({ ...formData, recurring: { ...formData.recurring, days } })
                  }
                />

                {!formData.recurring.enabled && (
                  <div className="space-y-2">
                    <Label><CalendarDays className="inline h-4 w-4 mr-1" />Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start', !formData.date && 'text-muted-foreground')}>
                          {formData.date ? format(formData.date, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-popover"><Calendar mode="single" selected={formData.date} onSelect={d => setFormData({...formData, date: d})} className="pointer-events-auto" /></PopoverContent>
                    </Popover>
                  </div>
                )}

                <div className="space-y-2">
                  <Label><Clock className="inline h-4 w-4 mr-1" />Departure Time</Label>
                  <Input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
              </>
            )}
            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  <Select value={formData.vehicle} onValueChange={v => setFormData({...formData, vehicle: v as 'car' | 'bike'})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="car"><Car className="inline h-4 w-4 mr-2" />Car</SelectItem>
                      <SelectItem value="bike"><Bike className="inline h-4 w-4 mr-2" />Bike</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label><Users className="inline h-4 w-4 mr-1" />Available Seats</Label>
                  <Select value={formData.seats} onValueChange={v => setFormData({...formData, seats: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover">{[1,2,3,4].map(n => <SelectItem key={n} value={String(n)}>{n} seat{n>1?'s':''}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div><p className="font-medium">Women Only Ride</p><p className="text-sm text-muted-foreground">Only female passengers can request</p></div>
                  <Switch checked={formData.womenOnly} onCheckedChange={v => setFormData({...formData, womenOnly: v})} />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>Next<ArrowRight className="ml-2 h-4 w-4" /></Button>
          ) : (
            <Button onClick={handleSubmit}>Post Ride<Check className="ml-2 h-4 w-4" /></Button>
          )}
        </div>
      </div>
    </Layout>
  );
}
