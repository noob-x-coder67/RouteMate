import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { departments } from '@/data/mockData';
import { Loader2, User, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Consistent security logic across the platform
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  gender: z.enum(['MALE', 'FEMALE']),
  department: z.string().min(1, 'Please select a department'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(data => {
  if (data.newPassword && !data.currentPassword) return false;
  return true;
}, {
  message: 'Current password is required to change to a new one',
  path: ['currentPassword'],
}).refine(data => {
  if (data.newPassword && !passwordRegex.test(data.newPassword)) return false;
  return true;
}, {
  message: 'New password must be 8+ chars with Uppercase, Number, and Special Char',
  path: ['newPassword'],
}).refine(data => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) return false;
  return true;
}, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      gender: (user?.gender?.toUpperCase() as 'MALE' | 'FEMALE') || 'MALE',
      department: user?.department || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // Connects to your authService.updateProfile in the backend
      const success = await updateProfile({
        name: data.name,
        gender: data.gender,
        department: data.department,
        currentPassword: data.currentPassword || undefined,
        newPassword: data.newPassword || undefined,
      });

      if (success) {
        toast({ title: 'Success', description: 'Profile updated successfully' });
        onOpenChange(false);
      }
    } catch (err: any) {
      toast({ 
        title: 'Error', 
        description: err.message || 'Failed to update profile', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-primary/20">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
            <User className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Account Settings</DialogTitle>
          <DialogDescription className="text-center">Keep your profile information up to date</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input {...form.register('name')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={form.watch('gender')} onValueChange={(v) => form.setValue('gender', v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={form.watch('department')} onValueChange={(v) => form.setValue('department', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <Label className="text-xs font-bold text-muted-foreground uppercase">Change Password</Label>
            <div className="space-y-2">
              <Label className="text-xs">Current Password</Label>
              <Input type="password" placeholder="Required for changes" {...form.register('currentPassword')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">New Password</Label>
                <div className="relative">
                  <Input type={showPassword ? 'text' : 'password'} {...form.register('newPassword')} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 text-muted-foreground">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Confirm New</Label>
                <Input type="password" {...form.register('confirmPassword')} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}