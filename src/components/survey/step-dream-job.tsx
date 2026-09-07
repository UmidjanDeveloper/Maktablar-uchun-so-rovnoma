'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Field } from './field';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/shared/theme-provider';
import { Check } from 'lucide-react';
import { categoryTheme, jobTheme, KASB_KATEGORIYALARI } from '@/lib/constants';
import { EntityIcon } from '@/lib/icons';
import type { FormState } from './types';

interface Profession {
  name: string;
  category: string;
  icon: string;
}

interface StepDreamJobProps {
  form: FormState;
  errors: Record<string, string>;
  update: (patch: Partial<FormState>) => void;
  kasblar: Profession[];
}

/** 3-qadam: orzudagi kasbni tanlash */
export function StepDreamJob({ form, errors, update, kasblar }: StepDreamJobProps) {
  // Boshlang'ich yo'nalish: tanlangan kasb bo'lsa — uning yo'nalishi, aks holda birinchisi
  const { resolved } = useTheme();
  const [category, setCategory] = useState<string>(
    form.jobCategory || KASB_KATEGORIYALARI[0].value
  );

  /**
   * Yo'nalishlar ro'yxati: asosiy 7 ta tab + admin panel orqali qo'shilgan
   * yangi yo'nalishlar (agar bo'lsa) avtomatik qo'shiladi.
   */
  const categories = useMemo(() => {
    const base = KASB_KATEGORIYALARI.map((c) => ({ ...c }));
    const known = new Set(base.map((c) => c.value));
    for (const k of kasblar) {
      if (!known.has(k.category)) {
        known.add(k.category);
        base.push({ label: k.category, value: k.category, icon: '⭐' });
      }
    }
    return base;
  }, [kasblar]);

  const visible = useMemo(
    () => kasblar.filter((k) => k.category === category),
    [kasblar, category]
  );

  const selected = kasblar.find((k) => k.name === form.dreamJob);
  // Tanlangan kasbning O'Z jumlasi va rangi — yo'nalishniki emas
  const selectedTheme = jobTheme(form.dreamJob, selected?.category ?? form.jobCategory);
  const selectedAccent =
    resolved === 'dark' ? selectedTheme.colorDark : selectedTheme.color;

  return (
    <div className="space-y-6">
      <Field label="Qaysi yo'nalish senga qiziq?" required error={errors.dreamJob}>
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="w-full justify-start">
            {categories.map((c) => (
              <TabsTrigger key={c.value} value={c.value}>
                <EntityIcon name={c.value} className="h-4 w-4 shrink-0" />
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Field>

      {/* Kasb kartochkalari */}
      <div className="grid grid-cols-2 gap-2.5 xs:gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((kasb, index) => {
          const isSelected = form.dreamJob === kasb.name;
          const theme = categoryTheme(kasb.category);
          // Qorong'i temada to'q rang ko'rinmaydi
          const accent = resolved === 'dark' ? theme.colorDark : theme.color;
          return (
            <motion.button
              key={kasb.name}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.2) }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => update({ dreamJob: kasb.name, jobCategory: kasb.category })}
              aria-pressed={isSelected}
              style={
                isSelected
                  ? {
                      borderColor: accent,
                      background: `color-mix(in srgb, ${accent} 14%, transparent)`,
                      boxShadow: `0 0 0 1px ${accent}, 0 14px 34px -16px ${accent}`,
                    }
                  : undefined
              }
              className={cn(
                'relative flex min-h-[110px] flex-col items-center justify-center gap-2.5 rounded-md border p-3 text-center',
                'transition-[color,background-color,border-color,box-shadow,transform] duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
                !isSelected && 'glass hover:-translate-y-[2px] hover:border-line-strong'
              )}
            >
              <EntityIcon
                name={kasb.name}
                strokeWidth={1.6}
                className="h-7 w-7 shrink-0"
                style={{ color: isSelected ? accent : 'var(--text-faint)' }}
              />
              <span
                className="font-display text-[12px] font-semibold leading-tight xs:text-[13px]"
                style={{ color: isSelected ? 'var(--text)' : 'var(--text-muted)' }}
              >
                {kasb.name}
              </span>

              {isSelected && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: accent }}
                >
                  <Check className="h-3 w-3 stroke-[3.5]" />
                </motion.span>
              )}
            </motion.button>
          );
        })}
        {visible.length === 0 && (
          <p className="col-span-full rounded-md border border-line bg-surface p-6 text-center text-sm text-ink-faint">
            Bu yo&apos;nalishda hozircha kasblar qo&apos;shilmagan.
          </p>
        )}
      </div>

    </div>
  );
}
