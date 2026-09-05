'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Field } from './field';
import { cn } from '@/lib/utils';
import { categoryTheme, KASB_KATEGORIYALARI } from '@/lib/constants';
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
                <span className="text-base leading-none">{c.icon}</span>
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Field>

      {/* Kasb kartochkalari */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
                      backgroundColor: theme.soft,
                      boxShadow: `0 14px 32px -14px ${theme.color}88`,
                    }
                  : undefined
              }
              className={cn(
                'flex min-h-[132px] flex-col items-center justify-center gap-2.5 rounded-3xl border-2 p-4 text-center transition-all',
                'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100',
                isSelected
                  ? 'scale-[1.02]'
                  : 'border-cream-deep bg-white hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft'
              )}
            >
              <span className="text-[42px] leading-none">{kasb.icon}</span>
              <span
                className="font-display text-sm font-bold leading-tight"
                style={{ color: isSelected ? theme.color : '#3D556B' }}
              >
                {kasb.name}
              </span>
            </motion.button>
          );
        })}
        {visible.length === 0 && (
          <p className="col-span-full rounded-2xl bg-cream-deep/60 p-6 text-center text-sm text-ink-faint">
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
            className="flex items-center gap-4 rounded-3xl border-2 p-4"
            style={{
              borderColor: `${selectedTheme.color}33`,
              backgroundColor: selectedTheme.soft,
            }}
          >
            <span className="text-4xl leading-none">{selected?.icon ?? '⭐'}</span>
            <div className="min-w-0">
              <p
                className="text-[11px] font-bold uppercase tracking-[0.14em]"
                style={{ color: selectedTheme.color }}
              >
                Sening tanlovingiz
              </p>
              <p className="font-display text-xl font-extrabold text-ink">{form.dreamJob}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{selectedTheme.cheer}</p>
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
