import { RideSearchFilters } from '@/types';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Users, Star, Ban, Building2, UserCircle } from 'lucide-react';

interface RideFiltersProps {
  filters: RideSearchFilters;
  onFiltersChange: (filters: RideSearchFilters) => void;
}

export function RideFilters({ filters, onFiltersChange }: RideFiltersProps) {
  const handleChange = (key: keyof RideSearchFilters, value: boolean | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Minimum Seats */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Minimum Seats
        </Label>
        <Input
          type="number"
          min={1}
          max={6}
          placeholder="Any"
          value={filters.minSeats || ''}
          onChange={(e) => handleChange('minSeats', e.target.value ? parseInt(e.target.value) : undefined)}
          className="w-full"
        />
      </div>

      {/* Driver Preferences */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <UserCircle className="h-4 w-4" />
          Driver Preference
        </Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="femaleDriver"
              checked={filters.femaleDriverOnly}
              onCheckedChange={(checked) => {
                handleChange('femaleDriverOnly', !!checked);
                if (checked) handleChange('maleDriverOnly', false);
              }}
            />
            <Label htmlFor="femaleDriver" className="text-sm font-normal cursor-pointer">
              Female drivers only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="maleDriver"
              checked={filters.maleDriverOnly}
              onCheckedChange={(checked) => {
                handleChange('maleDriverOnly', !!checked);
                if (checked) handleChange('femaleDriverOnly', false);
              }}
            />
            <Label htmlFor="maleDriver" className="text-sm font-normal cursor-pointer">
              Male drivers only
            </Label>
          </div>
        </div>
      </div>

      {/* Other Filters */}
      <div className="space-y-3">
        <Label>Additional Filters</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sameDept"
              checked={filters.sameDepartment}
              onCheckedChange={(checked) => handleChange('sameDepartment', !!checked)}
            />
            <Label htmlFor="sameDept" className="text-sm font-normal cursor-pointer flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              Same department
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ratedOnly"
              checked={filters.ratedDriversOnly}
              onCheckedChange={(checked) => handleChange('ratedDriversOnly', !!checked)}
            />
            <Label htmlFor="ratedOnly" className="text-sm font-normal cursor-pointer flex items-center gap-1">
              <Star className="h-3 w-3" />
              Rated 4+ only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="noSmoking"
              checked={filters.noSmoking}
              onCheckedChange={(checked) => handleChange('noSmoking', !!checked)}
            />
            <Label htmlFor="noSmoking" className="text-sm font-normal cursor-pointer flex items-center gap-1">
              <Ban className="h-3 w-3" />
              No smoking
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
