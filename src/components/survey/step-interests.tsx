'use client';

import { Sparkles } from 'lucide-react';
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
        <div className="flex items-center gap-2 rounded-md border border-ok/40 bg-ok-bg px-4 py-3 text-sm font-medium text-ok">
          <Sparkles className="h-4 w-4 shrink-0" />
          Ajoyib! Sen{' '}
          <span className="font-mono font-semibold tabular-nums">
            {form.favoriteSubjects.length}
          </span>{' '}
          ta fanni yoqtirar ekansan.
        </div>
      )}
    </div>
  );
}
