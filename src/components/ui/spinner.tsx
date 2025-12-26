import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  default: 'h-5 w-5 border-2',
  lg: 'h-8 w-8 border-3',
};

export function Spinner({ size = 'default', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-current border-t-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Spinner;
