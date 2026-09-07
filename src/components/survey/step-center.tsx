'use client';

import { Lightbulb } from 'lucide-react';
import { ChipGroup } from '@/components/shared/chip-group';
import { Field } from './field';
import {
  KERAKLI_KURSLAR,
  MASOFA_JAVOBLARI,
  TILLAR,
  TIL_KERAK_EMAS,
  UY_TEXNIKASI,
  VAQT_JAVOBLARI,
} from '@/lib/constants';
import type { FormState } from './types';

interface StepCenterProps {
  form: FormState;
  errors: Record<string, string>;
  update: (patch: Partial<FormState>) => void;
}

/** Guruhlangan chiplar — 2-qadamdagi bilan bir xil uslubda */
function GroupedChips({
  groups,
  values,
  onChange,
}: {
  groups: { title: string; items: { name: string; icon: string }[] }[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
            {group.title}
          </p>
          <ChipGroup options={group.items} values={values} onChange={onChange} />
        </div>
      ))}
    </div>
  );
}

/**
 * 4-qadam: qanday ta'lim markazi kerak.
 *
 * Bu qadam anketaning boshqa qismlaridan maqsadi bilan farq qiladi.
 * Qolgan savollar «bola kim bo'lishni orzu qiladi?» degan savolga
 * javob beradi; bu qadam esa «qayerda, qanday markaz ochsak, kim
 * keladi?» degan qarorni raqam bilan ta'minlaydi.
 *
 * Shu sababli birinchi savol ataylab «qanday to'garakka borasan»
 * emas, «qanday kurs ochilsa borasan» tarzida qo'yilgan: birinchisi
 * mavjud imkoniyatni, ikkinchisi qondirilmagan talabni o'lchaydi.
 */
export function StepCenter({ form, errors, update }: StepCenterProps) {
  /** Til tanlash — «kerak emas» qolgan tillarni bekor qiladi */
  const handleLanguages = (next: string[]) => {
    const added = next.find((v) => !form.wantedLanguages.includes(v));
    if (added === TIL_KERAK_EMAS) {
      update({ wantedLanguages: [TIL_KERAK_EMAS] });
      return;
    }
    update({ wantedLanguages: next.filter((v) => v !== TIL_KERAK_EMAS) });
  };

  return (
    <div className="space-y-8">
      {/* Nima uchun so'ralayotganini ochiq aytamiz — bola bejiz
          bosmasligi uchun javobning oqibati bor ekanini bilsin */}
      <div className="flex items-start gap-3 rounded-md border border-accent/35 bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] p-4">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.9} />
        <p className="text-sm leading-relaxed text-ink-muted">
          Tumanimizda yangi o&apos;quv markazlari ochilishi rejalashtirilmoqda.{' '}
          <strong className="font-semibold text-ink">
            Qayerda va qanday markaz ochilishini aynan shu javoblar hal qiladi
          </strong>{' '}
          — o&apos;ylab javob ber.
        </p>
      </div>

      <Field
        label="Mahallangda qanday kurs ochilsa, borar eding?"
        required
        error={errors.wantedCourses}
        hint="Eng kerakli 2-3 tasini tanla"
      >
        <GroupedChips
          groups={KERAKLI_KURSLAR}
          values={form.wantedCourses}
          onChange={(v) => update({ wantedCourses: v })}
        />
      </Field>

      <Field
        label="Qaysi tilni o'rganmoqchisan?"
        error={errors.wantedLanguages}
        hint="Bir nechtasini tanlashing mumkin"
      >
        <ChipGroup
          options={TILLAR}
          values={form.wantedLanguages}
          onChange={handleLanguages}
        />
      </Field>

      <Field
        label="Kurs uchun qancha yo'l yurishga tayyorsan?"
        required
        error={errors.travelWillingness}
        hint="Markazni qayerga ochishni shu javob hal qiladi"
      >
        <ChipGroup
          options={MASOFA_JAVOBLARI}
          values={form.travelWillingness ? [form.travelWillingness] : []}
          onChange={(v) => update({ travelWillingness: v[0] ?? '' })}
          single
        />
      </Field>


      <Field
        label="Qachon qatnasha olasan?"
        error={errors.availableTimes}
        hint="Bir nechtasini tanlashing mumkin"
      >
        <ChipGroup
          options={VAQT_JAVOBLARI}
          values={form.availableTimes}
          onChange={(v) => update({ availableTimes: v })}
        />
      </Field>

      <Field
        label="Uyingda kompyuter va internet bormi?"
        error={errors.homeTech}
        hint="Onlayn dars berish mumkinligini bilish uchun"
      >
        <ChipGroup
          options={UY_TEXNIKASI}
          values={form.homeTech ? [form.homeTech] : []}
          onChange={(v) => update({ homeTech: v[0] ?? '' })}
          single
        />
      </Field>
    </div>
  );
}
