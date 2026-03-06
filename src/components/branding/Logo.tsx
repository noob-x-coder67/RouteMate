import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, iconOnly = false, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 'h-7 w-7', text: 'text-lg' },
    md: { icon: 'h-9 w-9', text: 'text-xl' },
    lg: { icon: 'h-12 w-12', text: 'text-2xl' },
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Custom RouteMate Logo - Represents ride sharing, connections, environment */}
      <div className={cn(
        'relative flex items-center justify-center rounded-xl bg-primary',
        sizes[size].icon
      )}>
        {/* Stylized route/path with connected people and leaf element */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-[60%] w-[60%]"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Connected route path */}
          <path 
            d="M4 12C4 8 8 4 12 4C16 4 20 8 20 12" 
            className="text-primary-foreground"
          />
          {/* Connection points representing people */}
          <circle cx="4" cy="12" r="2" className="fill-primary-foreground text-primary-foreground" />
          <circle cx="20" cy="12" r="2" className="fill-primary-foreground text-primary-foreground" />
          {/* Leaf element for sustainability */}
          <path 
            d="M12 8C12 8 14 10 14 13C14 16 12 18 12 18C12 18 10 16 10 13C10 10 12 8 12 8Z" 
            className="fill-primary-foreground text-primary-foreground"
          />
          <path 
            d="M12 12V18" 
            className="text-primary"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      {!iconOnly && (
        <span className={cn('font-bold text-foreground', sizes[size].text)}>
          RouteMate
        </span>
      )}
    </div>
  );
}
