'use client';

import { motion } from 'framer-motion';
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
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Ism" htmlFor="firstName" required error={errors.firstName}>
          <Input
            id="firstName"
            value={form.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            placeholder="Masalan: Javohir"
            autoComplete="off"
            className={cn(errors.firstName && 'border-red-400')}
          />
        </Field>

        <Field label="Familiya" htmlFor="lastName" required error={errors.lastName}>
          <Input
            id="lastName"
            value={form.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            placeholder="Masalan: Karimov"
            autoComplete="off"
            className={cn(errors.lastName && 'border-red-400')}
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
                onClick={() => update({ gender: jins })}
                aria-pressed={selected}
                className={cn(
                  'flex items-center justify-center gap-2.5 rounded-2xl border-2 px-4 py-4 text-base font-semibold transition-colors',
                  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100',
                  selected
                    ? isBoy
                      ? 'border-brand-600 bg-brand-600 text-white shadow-soft'
                      : 'border-[#C21E7A] bg-[#C21E7A] text-white shadow-soft'
                    : 'border-cream-deep bg-white text-ink-soft hover:border-brand-200 hover:bg-brand-50'
                )}
              >
                <span className="text-2xl leading-none">{isBoy ? '👦' : '👧'}</span>
                {jins}
              </motion.button>
            );
          })}
        </div>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
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
                onClick={() => update({ grade: sinf })}
                aria-pressed={selected}
                className={cn(
                  'h-14 w-16 rounded-2xl border-2 text-lg font-bold transition-colors',
                  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100',
                  selected
                    ? 'border-brand-600 bg-brand-600 text-white shadow-soft'
                    : 'border-cream-deep bg-white text-ink-soft hover:border-brand-200 hover:bg-brand-50'
                )}
              >
                {sinf}
              </motion.button>
            );
          })}
        </div>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
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
            className={cn(errors.phone && 'border-red-400')}
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
            className={cn(errors.parentPhone && 'border-red-400')}
          />
        </Field>
      </div>

      {/* Hudud oldindan belgilangan — o'quvchi o'zgartirmaydi */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-cream-deep/60 p-4 text-sm text-ink-soft">
        <span className="text-lg">📍</span>
        <span>
          Viloyat: <strong className="text-ink">{VILOYAT}</strong>
        </span>
        <span className="text-ink-faint">•</span>
        <span>
          Tuman: <strong className="text-ink">{TUMAN}</strong>
        </span>
      </div>
    </div>
  );
}
