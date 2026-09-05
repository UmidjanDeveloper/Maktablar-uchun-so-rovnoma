'use client';

import { ChipGroup } from '@/components/shared/chip-group';
import { Field } from './field';
import { FANLAR, TOGARAKLAR } from '@/lib/constants';
import type { FormState } from './types';

interface StepInterestsProps {
  form: FormState;
  errors: Record<string, string>;
  update: (patch: Partial<FormState>) => void;
}

/** 2-qadam: qiziqishlar — fanlar va to'garaklar */
export function StepInterests({ form, errors, update }: StepInterestsProps) {
  return (
    <div className="space-y-8">
      <Field
        label="Qaysi fanlar yoqadi?"
        required
        error={errors.favoriteSubjects}
        hint="Bir nechtasini tanlashing mumkin"
      >
        <ChipGroup
          options={FANLAR}
          values={form.favoriteSubjects}
          onChange={(v) => update({ favoriteSubjects: v })}
        />
      </Field>

      <Field
        label="Qanday to'garaklarga borasan?"
        error={errors.clubs}
        hint="Agar bormasang, «Hech qaysi» ni tanla"
      >
        <ChipGroup
          options={TOGARAKLAR}
          values={form.clubs}
          onChange={(v) => update({ clubs: v })}
          exclusiveOption="Hech qaysi"
        />
      </Field>

      {form.favoriteSubjects.length > 0 && (
        <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-4 text-sm font-medium text-leaf-600">
          <span className="mr-1.5">✨</span>
          Ajoyib! Sen {form.favoriteSubjects.length} ta fanni yoqtirar ekansan.
        </div>
      )}
    </div>
  );
}
