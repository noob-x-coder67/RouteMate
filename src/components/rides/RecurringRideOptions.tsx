import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Repeat } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecurringRideOptionsProps {
  enabled: boolean;
  type: 'daily' | 'weekdays' | 'weekly';
  days: number[];
  onEnabledChange: (enabled: boolean) => void;
  onTypeChange: (type: 'daily' | 'weekdays' | 'weekly') => void;
  onDaysChange: (days: number[]) => void;
}

const weekDays = [
  { value: 0, label: 'Sun', short: 'S' },
  { value: 1, label: 'Mon', short: 'M' },
  { value: 2, label: 'Tue', short: 'T' },
  { value: 3, label: 'Wed', short: 'W' },
  { value: 4, label: 'Thu', short: 'T' },
  { value: 5, label: 'Fri', short: 'F' },
  { value: 6, label: 'Sat', short: 'S' },
];

export function RecurringRideOptions({
  enabled,
  type,
  days,
  onEnabledChange,
  onTypeChange,
  onDaysChange,
}: RecurringRideOptionsProps) {
  const handleDayToggle = (dayValue: number) => {
    if (days.includes(dayValue)) {
      onDaysChange(days.filter((d) => d !== dayValue));
    } else {
      onDaysChange([...days, dayValue].sort());
    }
  };

  const handleTypeChange = (newType: 'daily' | 'weekdays' | 'weekly') => {
    onTypeChange(newType);
    // Auto-select days based on type
    if (newType === 'daily') {
      onDaysChange([0, 1, 2, 3, 4, 5, 6]);
    } else if (newType === 'weekdays') {
      onDaysChange([1, 2, 3, 4, 5]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Repeat className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">Recurring Ride</p>
            <p className="text-sm text-muted-foreground">
              Set up a weekly schedule instead of individual rides
            </p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={onEnabledChange} />
      </div>

      {enabled && (
        <div className="space-y-4 p-4 rounded-lg border bg-card animate-in fade-in-0 slide-in-from-top-2">
          <div className="space-y-2">
            <Label>Schedule Type</Label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="daily">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Every Day</span>
                  </div>
                </SelectItem>
                <SelectItem value="weekdays">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Weekdays Only (Mon-Fri)</span>
                  </div>
                </SelectItem>
                <SelectItem value="weekly">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Custom Days</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === 'weekly' && (
            <div className="space-y-2">
              <Label>Select Days</Label>
              <div className="flex gap-2 flex-wrap">
                {weekDays.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleDayToggle(day.value)}
                    className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                      days.includes(day.value)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    {day.short}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Selected: {days.length === 0 
                  ? 'None' 
                  : days.map(d => weekDays.find(w => w.value === d)?.label).join(', ')}
              </p>
            </div>
          )}

          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-primary font-medium flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              {type === 'daily' && 'This ride will repeat every day at the same time'}
              {type === 'weekdays' && 'This ride will repeat Monday through Friday'}
              {type === 'weekly' && days.length > 0 && 
                `This ride will repeat every ${days.map(d => weekDays.find(w => w.value === d)?.label).join(', ')}`}
              {type === 'weekly' && days.length === 0 && 'Select at least one day'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
