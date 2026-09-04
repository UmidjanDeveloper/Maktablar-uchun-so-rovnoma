'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Field } from './field';
import { cn } from '@/lib/utils';
import { KASB_KATEGORIYALARI } from '@/lib/constants';
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
              className={cn(
                'flex min-h-[128px] flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 text-center transition-colors',
                'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100',
                isSelected
                  ? 'border-brand-600 bg-brand-50 shadow-soft'
                  : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50'
              )}
            >
              <span className="text-4xl leading-none">{kasb.icon}</span>
              <span
                className={cn(
                  'text-sm font-semibold leading-tight',
                  isSelected ? 'text-brand-800' : 'text-slate-700'
                )}
              >
                {kasb.name}
              </span>
            </motion.button>
          );
        })}
        {visible.length === 0 && (
          <p className="col-span-full rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
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
          <div className="flex items-center gap-3 rounded-2xl border-2 border-brand-100 bg-brand-50 p-4">
            <span className="text-3xl leading-none">{selected?.icon ?? '⭐'}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                Sening tanlovingiz
              </p>
              <p className="text-lg font-bold text-brand-900">{form.dreamJob}</p>
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
