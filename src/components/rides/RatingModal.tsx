import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rideId: string | null;
}

export function RatingModal({ open, onOpenChange, rideId }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    toast({ title: 'Rating submitted!', description: 'Thank you for your feedback.' });
    setIsLoading(false);
    setRating(0);
    setComment('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Ride</DialogTitle>
          <DialogDescription>How was your experience?</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-2 py-4">
          {[1,2,3,4,5].map(star => (
            <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)}>
              <Star className={cn('h-10 w-10 transition-colors', (hoveredRating || rating) >= star ? 'fill-primary text-primary' : 'text-muted-foreground')} />
            </button>
          ))}
        </div>
        <Textarea placeholder="Leave a comment (optional)" value={comment} onChange={e => setComment(e.target.value)} />
        <Button onClick={handleSubmit} disabled={rating === 0 || isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Submit Rating
        </Button>
      </DialogContent>
    </Dialog>
  );
}
