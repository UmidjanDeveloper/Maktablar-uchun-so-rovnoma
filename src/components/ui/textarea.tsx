import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        'flex min-h-[110px] w-full rounded-xl border-2 border-cream-deep bg-white px-4 py-3 text-base text-ink transition-colors',
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
Textarea.displayName = 'Textarea';

export { Textarea };
