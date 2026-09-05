'use client';

import { AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FieldProps {
  label: string;
  htmlFor?: string;
  /** Majburiy maydon yonida qizil yulduzcha ko'rsatiladi */
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

/** Forma maydoni uchun yagona ko'rinish: sarlavha + maydon + xato xabari */
export function Field({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={htmlFor} className="flex items-center gap-1 text-[15px]">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-ink-faint">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1.5 text-sm font-medium text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
