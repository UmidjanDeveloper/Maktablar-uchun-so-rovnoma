'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Field } from './field';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { categoryTheme, KASB_KATEGORIYALARI } from '@/lib/constants';
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
  const selectedTheme = categoryTheme(selected?.category ?? form.jobCategory);

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
                      borderColor: theme.color,
                      background: `color-mix(in srgb, ${theme.color} 14%, transparent)`,
                      boxShadow: `0 0 0 1px ${theme.color}, 0 14px 34px -16px ${theme.color}`,
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
                {...({ style: { color: isSelected ? theme.color : 'var(--text-faint)' } } as object)}
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
                  style={{ backgroundColor: theme.color }}
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

      {/* Kasb tanlangandan keyin sabab so'raladi */}
      {form.dreamJob && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.25 }}
          className="space-y-4 overflow-hidden"
        >
          <div
            className="flex items-center gap-4 rounded-md border p-4"
            style={{
              borderColor: `color-mix(in srgb, ${selectedTheme.color} 45%, transparent)`,
              background: `color-mix(in srgb, ${selectedTheme.color} 10%, transparent)`,
            }}
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border"
              style={{
                borderColor: `color-mix(in srgb, ${selectedTheme.color} 45%, transparent)`,
                color: selectedTheme.color,
              }}
            >
              <EntityIcon name={form.dreamJob} strokeWidth={1.6} className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p
                className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: selectedTheme.color }}
              >
                Sening tanlovingiz
              </p>
              <p className="font-display text-lg font-bold text-ink">{form.dreamJob}</p>
              <p className="mt-0.5 text-sm text-ink-muted">{selectedTheme.cheer}</p>
            </div>
          </div>

          <Field
            label="Nima uchun aynan shu kasbni tanlading?"
            htmlFor="motivation"
            error={errors.motivation}
            hint="Fikringni erkin yoz — bu majburiy emas"
          >
            <Textarea
              id="motivation"
              value={form.motivation}
              onChange={(e) => update({ motivation: e.target.value })}
              placeholder="Masalan: Men odamlarga yordam berishni yaxshi ko'raman..."
              maxLength={500}
            />
          </Field>
        </motion.div>
      )}
    </div>
  );
}
