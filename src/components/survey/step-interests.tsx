'use client';

import { Sparkles } from 'lucide-react';
import { ChipGroup } from '@/components/shared/chip-group';
import { Field } from './field';
import { FAN_GURUHLARI, HECH_QAYSI, TOGARAK_GURUHLARI, TOSIQLAR } from '@/lib/constants';
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
  const qatnamaydi = form.clubs.includes(HECH_QAYSI);

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
        required
        error={errors.clubs}
        hint="Agar bormasang, «Hech qaysi» ni tanla"
      >
        <GroupedChips
          groups={TOGARAK_GURUHLARI}
          values={form.clubs}
          onChange={(v) =>
            update({
              clubs: v,
              // To'garakka qatnaydigan bo'lsa, oldin belgilangan
              // sabablar keraksiz — tozalab yuboramiz
              barriers: v.includes(HECH_QAYSI) ? form.barriers : [],
            })
          }
          exclusiveOption={HECH_QAYSI}
        />
      </Field>

      {/*
        To'siq savoli faqat hech qanday to'garakka qatnamaydiganlarga
        beriladi. Qatnaydigan bolaga "nega bormaysan" deb so'rash
        ma'nosiz; qatnamaydiganidan esa sababini bilish shart, chunki
        hokimiyat aynan shu javob asosida yordam ko'rsatadi:
        ota-onasi ruxsat bermasa — suhbat, sharoiti bo'lmasa — yordam.
      */}
      {qatnamaydi && (
        <div className="rounded-md border border-warn/40 bg-warn-bg p-4">
          <Field
            label="Nega hech qanday to'garakka bormaysan?"
            required
            error={errors.barriers}
            hint="Rostini ayt — bu senga yordam berish uchun so'ralyapti"
          >
            <ChipGroup
              options={TOSIQLAR}
              values={form.barriers}
              onChange={(v) => update({ barriers: v })}
            />
          </Field>
        </div>
      )}

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
