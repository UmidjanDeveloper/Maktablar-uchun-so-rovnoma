import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full rounded-xl border-2 border-cream-deep bg-white px-4 py-2 text-base text-ink transition-colors',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-ink-faint/70',
        'focus-visible:outline-none focus-visible:border-brand-500 focus-visible:ring-4 focus-visible:ring-brand-100',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export { Input };
