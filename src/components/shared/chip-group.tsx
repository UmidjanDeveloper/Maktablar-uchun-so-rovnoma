'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChipOption {
  name: string;
  icon?: string;
}

interface ChipGroupProps {
  options: ChipOption[];
  values: string[];
  onChange: (values: string[]) => void;
  /** `true` bo'lsa faqat bitta variant tanlanadi */
  single?: boolean;
  /**
   * Tanlanganda boshqa barcha tanlovlarni bekor qiladigan variant.
   * Masalan: "Hech qaysi" to'garagi.
   */
  exclusiveOption?: string;
  className?: string;
}

/**
 * Katta, bosish oson bo'lgan chiplar guruhi.
 * Sensorli ekran va sichqonchada ham qulay — bolalar uchun mo'ljallangan.
 */
export function ChipGroup({
  options,
  values,
  onChange,
  single = false,
  exclusiveOption,
  className,
}: ChipGroupProps) {
  const handleClick = (name: string) => {
    if (single) {
      onChange(values.includes(name) ? [] : [name]);
      return;
    }

    // "Hech qaysi" bosilsa — qolganlari bekor qilinadi
    if (exclusiveOption && name === exclusiveOption) {
      onChange(values.includes(name) ? [] : [name]);
      return;
    }

    const next = values.includes(name)
      ? values.filter((v) => v !== name)
      : [...values.filter((v) => v !== exclusiveOption), name];
    onChange(next);
  };

  return (
    <div className={cn('flex flex-wrap gap-2.5', className)}>
      {options.map((option) => {
        const selected = values.includes(option.name);
        return (
          <motion.button
            key={option.name}
            type="button"
            onClick={() => handleClick(option.name)}
            whileTap={{ scale: 0.95 }}
            aria-pressed={selected}
            className={cn(
              'flex items-center gap-2 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition-colors',
              'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100',
              selected
                ? 'border-brand-600 bg-brand-50 text-brand-800'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            )}
          >
            {option.icon && <span className="text-lg leading-none">{option.icon}</span>}
            <span>{option.name}</span>
            {selected && <Check className="h-4 w-4 stroke-[3] text-brand-600" />}
          </motion.button>
        );
      })}
    </div>
  );
}
