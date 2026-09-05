'use client';

import { motion } from 'framer-motion';
import { Check, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/shared/searchable-select';
import { Field } from './field';
import { cn } from '@/lib/utils';
import { JINSLAR, SINFLAR, VILOYAT, TUMAN } from '@/lib/constants';
import type { FormState } from './types';

interface StepPersonalProps {
  form: FormState;
  errors: Record<string, string>;
  update: (patch: Partial<FormState>) => void;
  mahallalar: string[];
  maktablar: string[];
}

/** 1-qadam: shaxsiy ma'lumotlar */
export function StepPersonal({ form, errors, update, mahallalar, maktablar }: StepPersonalProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Ism" htmlFor="firstName" required error={errors.firstName}>
          <Input
            id="firstName"
            value={form.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            placeholder="Masalan: Javohir"
            autoComplete="off"
            className={cn(errors.firstName && 'border-danger')}
          />
        </Field>

        <Field label="Familiya" htmlFor="lastName" required error={errors.lastName}>
          <Input
            id="lastName"
            value={form.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            placeholder="Masalan: Karimov"
            autoComplete="off"
            className={cn(errors.lastName && 'border-danger')}
          />
        </Field>
      </div>

      <Field label="Jinsing" required error={errors.gender}>
        <div className="grid grid-cols-2 gap-3">
          {JINSLAR.map((jins) => {
            const selected = form.gender === jins;
            const isBoy = jins === "O'g'il bola";
            return (
              <motion.button
                key={jins}
                type="button"
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                onClick={() => update({ gender: jins })}
                aria-pressed={selected}
                className={cn(
                  'relative flex items-center justify-center gap-2 rounded-md border px-4 py-3.5',
                  'font-display text-[15px] font-semibold transition-[color,background-color,border-color,box-shadow] duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
                  selected
                    ? 'border-accent bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-ink shadow-glow'
                    : 'glass text-ink-muted hover:border-line-strong hover:text-ink'
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-bold',
                    selected ? 'border-accent text-accent' : 'border-line text-ink-faint'
                  )}
                >
                  {isBoy ? 'O' : 'Q'}
                </span>
                {jins}

                {selected && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-solid text-accent-contrast shadow-glow"
                  >
                    <Check className="h-3 w-3 stroke-[3.5]" />
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Mahalla"
          htmlFor="mahalla"
          required
          error={errors.mahalla}
          hint="Ro'yxatda topilmasa, nomini o'zing yozishing mumkin"
        >
          <SearchableSelect
            id="mahalla"
            options={mahallalar}
            value={form.mahalla}
            onChange={(v) => update({ mahalla: v })}
            placeholder="Mahallangizni tanlang"
            searchPlaceholder="Mahalla nomini yozing..."
            emptyText="Bunday mahalla topilmadi"
            hasError={!!errors.mahalla}
            allowCustom
            customLabel={(q) => `«${q}» mahallasini qo'shish`}
          />
        </Field>

        <Field
          label="Maktab"
          htmlFor="school"
          required
          error={errors.school}
          hint="Maktab raqamini yozsang yetarli. Topilmasa — o'zing yoz"
        >
          <SearchableSelect
            id="school"
            options={maktablar}
            value={form.school}
            onChange={(v) => update({ school: v })}
            placeholder="Maktabingizni tanlang"
            searchPlaceholder="Maktab raqamini yozing..."
            emptyText="Bunday maktab topilmadi"
            hasError={!!errors.school}
            allowCustom
            customLabel={(q) => `«${q}» maktabini qo'shish`}
          />
        </Field>
      </div>

      <Field label="Nechanchi sinfdasan?" required error={errors.grade}>
        <div className="flex flex-wrap gap-2.5">
          {SINFLAR.map((sinf) => {
            const selected = String(form.grade) === String(sinf);
            return (
              <motion.button
                key={sinf}
                type="button"
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                onClick={() => update({ grade: sinf })}
                aria-pressed={selected}
                className={cn(
                  'h-12 w-12 rounded-md border font-mono text-base font-semibold tabular-nums',
                  'transition-[color,background-color,border-color,box-shadow] duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
                  selected
                    ? 'border-accent bg-accent-solid text-accent-contrast shadow-glow'
                    : 'glass text-ink-muted hover:border-line-strong hover:text-ink'
                )}
              >
                {sinf}
              </motion.button>
            );
          })}
        </div>
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Telefon raqaming"
          htmlFor="phone"
          error={errors.phone}
          hint="Majburiy emas. Format: +998 90 123 45 67"
        >
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => update({ phone: e.target.value })}
            placeholder="+998 90 123 45 67"
            className={cn(errors.phone && 'border-danger')}
          />
        </Field>

        <Field
          label="Ota-onang telefoni"
          htmlFor="parentPhone"
          error={errors.parentPhone}
          hint="Majburiy emas"
        >
          <Input
            id="parentPhone"
            type="tel"
            inputMode="tel"
            value={form.parentPhone}
            onChange={(e) => update({ parentPhone: e.target.value })}
            placeholder="+998 90 123 45 67"
            className={cn(errors.parentPhone && 'border-danger')}
          />
        </Field>
      </div>

      {/* Hudud oldindan belgilangan — o'quvchi o'zgartirmaydi */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-line bg-surface px-4 py-3 text-sm text-ink-muted">
        <MapPin className="h-4 w-4 shrink-0 text-ink-faint" />
        <span>
          Viloyat: <strong className="font-semibold text-ink">{VILOYAT}</strong>
        </span>
        <span className="text-ink-faint">·</span>
        <span>
          Tuman: <strong className="font-semibold text-ink">{TUMAN}</strong>
        </span>
      </div>
    </div>
  );
}
