'use client';

import { Sparkles } from 'lucide-react';
import { ChipGroup } from '@/components/shared/chip-group';
import { Field } from './field';
import { FAN_GURUHLARI, TOGARAK_GURUHLARI } from '@/lib/constants';
import type { FormState } from './types';

interface StepInterestsProps {
  form: FormState;
  errors: Record<string, string>;
  update: (patch: Partial<FormState>) => void;
}

interface GroupedChipsProps {
  groups: { title: string; items: { name: string; icon: string }[] }[];
  values: string[];
  onChange: (values: string[]) => void;
  /** Tanlanganda qolgan hamma tanlovni bekor qiladigan variant */
  exclusiveOption?: string;
}

/**
 * Guruhlarga bo'lingan chiplar.
 *
 * Ro'yxat uzun bo'lgani uchun (22 ta fan, 30 ta to'garak) hammasini
 * bitta uzun qatorda ko'rsatish o'quvchini charchatadi — kerakligini
 * topolmaydi. Guruh sarlavhalari ro'yxatni ko'z bilan tez skanerlash
 * imkonini beradi.
 *
 * Har bir guruh bir xil `values` massivi bilan ishlaydi, shuning uchun
 * istisno variant («Hech qaysi») qaysi guruhda bo'lishidan qat'i nazar
 * barcha guruhlardagi tanlovlarni bekor qiladi.
 */
function GroupedChips({ groups, values, onChange, exclusiveOption }: GroupedChipsProps) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
            {group.title}
          </p>
          <ChipGroup
            options={group.items}
            values={values}
            onChange={onChange}
            exclusiveOption={exclusiveOption}
          />
        </div>
      ))}
    </div>
  );
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
        <GroupedChips
          groups={FAN_GURUHLARI}
          values={form.favoriteSubjects}
          onChange={(v) => update({ favoriteSubjects: v })}
        />
      </Field>

      <Field
        label="Qanday to'garaklarga borasan?"
        error={errors.clubs}
        hint="Agar bormasang, «Hech qaysi» ni tanla"
      >
        <GroupedChips
          groups={TOGARAK_GURUHLARI}
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
