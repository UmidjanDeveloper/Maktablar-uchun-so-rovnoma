'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ChipGroup } from '@/components/shared/chip-group';
import { Field } from './field';
import { cn } from '@/lib/utils';
import { ILHOMLANTIRUVCHILAR, CHET_EL_JAVOBLARI } from '@/lib/constants';
import type { FormState } from './types';

interface StepFutureProps {
  form: FormState;
  errors: Record<string, string>;
  update: (patch: Partial<FormState>) => void;
}

/** 4-qadam: kelajak rejalari va rozilik */
export function StepFuture({ form, errors, update }: StepFutureProps) {
  return (
    <div className="space-y-8">
      <Field label="Senga kim ilhom berdi?" error={errors.inspiration}>
        <ChipGroup
          options={ILHOMLANTIRUVCHILAR}
          values={form.inspiration ? [form.inspiration] : []}
          onChange={(v) => update({ inspiration: v[0] ?? '' })}
          single
        />
      </Field>

      <Field label="Chet elda o'qishni xohlaysanmi?" error={errors.studyAbroad}>
        <ChipGroup
          options={CHET_EL_JAVOBLARI}
          values={form.studyAbroad ? [form.studyAbroad] : []}
          onChange={(v) => update({ studyAbroad: v[0] ?? '' })}
          single
        />
      </Field>

      <Field
        label="Kelajakda o'z mahallang uchun nima qilmoqchisan?"
        htmlFor="futureContribution"
        error={errors.futureContribution}
        hint="Bir-ikki gapda yozsang kifoya"
      >
        <Textarea
          id="futureContribution"
          value={form.futureContribution}
          onChange={(e) => update({ futureContribution: e.target.value })}
          placeholder="Masalan: Mahallamizda bolalar uchun bepul IT to'garak ochmoqchiman..."
          maxLength={500}
        />
      </Field>

      {/* Rozilik — majburiy */}
      <div
        className={cn(
          'flex items-start gap-3 rounded-2xl border-2 p-4 transition-colors',
          errors.consent ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
        )}
      >
        <Checkbox
          id="consent"
          checked={form.consent}
          onCheckedChange={(checked) => update({ consent: checked === true })}
          className="mt-0.5 bg-white"
        />
        <label htmlFor="consent" className="cursor-pointer select-none text-sm leading-relaxed text-slate-700">
          <span className="font-semibold text-slate-900">
            Ma&apos;lumotlarim ta&apos;lim loyihalari uchun ishlatilishiga roziman
          </span>
          <span className="ml-1 text-red-500">*</span>
          <span className="mt-1 block text-slate-500">
            Ma&apos;lumotlaringiz faqat tumandagi to&apos;garaklar va o&apos;quv dasturlarini
            rejalashtirish uchun ishlatiladi.
          </span>
        </label>
      </div>
      {errors.consent && (
        <p className="-mt-6 text-sm font-medium text-red-600">{errors.consent}</p>
      )}
    </div>
  );
}
