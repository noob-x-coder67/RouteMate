import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Leaf, Fuel, TreePine, TrendingDown } from 'lucide-react';
import { calculateCumulativeMetrics, formatCo2, formatFuel, formatMoney } from '@/utils/sustainability';

interface SustainabilityWidgetProps {
  co2Saved: number;
  fuelSaved: number;
  totalRides: number;
}

export function SustainabilityWidget({ co2Saved = 0, fuelSaved = 0, totalRides = 0 }: SustainabilityWidgetProps) {
  const metrics = calculateCumulativeMetrics(totalRides, co2Saved, fuelSaved);
  
  // Dynamic goal: defaults to 500kg
  const co2Goal = 500;
  const progressPercent = Math.min((co2Saved / co2Goal) * 100, 100);

  return (
    <Card className="border-primary/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-3 bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Leaf className="h-5 w-5 text-primary" />
          Sustainability Impact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <div>
          <div className="flex justify-between text-sm mb-2 font-medium">
            <span className="text-muted-foreground">CO₂ Reduced</span>
            <span>{formatCo2(co2Saved)} / {formatCo2(co2Goal)}</span>
          </div>
          <Progress value={progressPercent} className="h-2.5" />
          <p className="text-[11px] text-muted-foreground mt-2">
            You are <strong>{progressPercent.toFixed(1)}%</strong> towards your next eco-milestone!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MetricBox 
            icon={<TrendingDown className="h-4 w-4" />} 
            label="Total CO₂" 
            value={formatCo2(co2Saved)} 
            variant="primary" 
          />
          <MetricBox 
            icon={<Fuel className="h-4 w-4" />} 
            label="Fuel Saved" 
            value={formatFuel(fuelSaved)} 
            variant="amber" 
          />
          <MetricBox 
            icon={<TreePine className="h-4 w-4" />} 
            label="Trees Equiv." 
            value={metrics.treesEquivalent.toFixed(1)} 
            variant="green" 
          />
          <MetricBox 
            icon={<span className="text-xs font-bold">₨</span>} 
            label="Cash Saved" 
            value={formatMoney(metrics.totalMoneySaved)} 
            variant="blue" 
          />
        </div>

        <div className="pt-3 border-t flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Global Goals</span>
          <div className="flex gap-1">
            {[11, 12, 13].map(sdg => (
              <div key={sdg} className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded">
                SDG {sdg}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricBox({ icon, label, value, variant }: { icon: React.ReactNode, label: string, value: string, variant: string }) {
  const colors: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-100 text-amber-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700"
  };

  return (
    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 border border-transparent hover:border-primary/10 transition-all">
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${colors[variant]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold truncate leading-tight">{value}</p>
        <p className="text-[10px] text-muted-foreground truncate uppercase">{label}</p>
      </div>
    </div>
  );
}