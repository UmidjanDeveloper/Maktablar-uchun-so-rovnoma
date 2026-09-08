'use client';

import * as React from 'react';
import { AlertCircle, Lightbulb } from 'lucide-react';
import { ChipGroup } from '@/components/shared/chip-group';
import { Input } from '@/components/ui/input';
import { Field } from './field';
import {
  BOSHQA_TIL,
  CHET_TILI_KURSI,
  KERAKLI_KURSLAR,
  MASOFA_JAVOBLARI,
  TILLAR,
  UY_TEXNIKASI,
  VAQT_JAVOBLARI,
} from '@/lib/constants';
import type { FormState } from './types';

/**
 * «Chet tili kursi» qaysi guruhda turibdi.
 *
 * Til savoli aynan shu guruhning tagida chiqadi. Guruh nomi
 * o'zgarsa ham ishlashi uchun ro'yxatdan topiladi, qo'lda yozilmaydi.
 */
const TIL_GURUHI = KERAKLI_KURSLAR.find((g) =>
  g.items.some((i) => i.name === CHET_TILI_KURSI)
)?.title;

/** Ro'yxatdagi tillar + «Boshqa til» — dunyoda til ko'p */
const TIL_TANLOVLARI = [...TILLAR, { name: BOSHQA_TIL, icon: '✏️' }];

interface StepCenterProps {
  form: FormState;
  errors: Record<string, string>;
  update: (patch: Partial<FormState>) => void;
}

/**
 * Guruhlangan chiplar — 2-qadamdagi bilan bir xil uslubda.
 *
 * `qoshimcha` — guruhdan keyin darhol chiqadigan ergash savol.
 * U aynan shu guruhning tagida turishi kerak: «Chet tili kursi» ni
 * bosgan bola tillar ro'yxatini o'sha yerda ko'rsin, beshta guruh
 * pastda emas.
 */
function GroupedChips({
  groups,
  values,
  onChange,
  qoshimcha,
}: {
  groups: { title: string; items: { name: string; icon: string }[] }[];
  values: string[];
  onChange: (values: string[]) => void;
  qoshimcha?: (title: string) => React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
            {group.title}
          </p>
          <ChipGroup options={group.items} values={values} onChange={onChange} />
          {qoshimcha?.(group.title)}
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
  /**
   * Til savoli faqat chet tili kursini tanlagan bolaga chiqadi.
   *
   * Asalarichi yoki payvandchi bo'lishni orzu qilgan, kurslardan esa
   * «Hunarmandchilik» ni tanlagan bolaga «qaysi tilni o'rganmoqchisan»
   * deb savol berish mantiqsiz — u savolni tashlab ketadi yoki tavakkal
   * bosadi, ikkalasi ham tahlilni buzadi.
   */
  const tilKursiTanlangan = form.wantedCourses.includes(CHET_TILI_KURSI);

  /*
   * Ro'yxatdagi tillar va qo'lda yozilgan til ajratiladi.
   *
   * `wantedLanguages` da qo'lda yozilgan til o'z nomi bilan turadi
   * ("Fransuz tili"), belgi emas — shunda hokimiyat hisobotida u
   * boshqa tillar bilan bir qatorda sanaladi. Belgi faqat bola
   * tugmani bosgan, lekin hali yozmagan paytda turadi.
   */
  const royxatdagi = React.useMemo(() => new Set(TILLAR.map((t) => t.name)), []);
  const boshqaMatn = form.wantedLanguages.find(
    (t) => t !== BOSHQA_TIL && !royxatdagi.has(t)
  );
  const boshqaTanlangan = boshqaMatn !== undefined || form.wantedLanguages.includes(BOSHQA_TIL);

  /** Ro'yxatdan tanlangan tillar (qo'lda yozilganidan tashqari) */
  const tanlanganTillar = form.wantedLanguages.filter((t) => royxatdagi.has(t));

  const handleTillar = (next: string[]) => {
    const royxat = next.filter((t) => royxatdagi.has(t));
    if (next.includes(BOSHQA_TIL)) royxat.push(boshqaMatn || BOSHQA_TIL);
    update({ wantedLanguages: royxat });
  };

  const handleBoshqaMatn = (matn: string) => {
    // Bo'sh bo'lsa belgi qoladi — chip tanlangan holatda turaveradi
    update({ wantedLanguages: [...tanlanganTillar, matn.trim() ? matn : BOSHQA_TIL] });
  };

  /**
   * Kurs ro'yxati o'zgarganda tillarni ham tekshiramiz.
   *
   * Bola avval chet tili kursini tanlab, til belgilab, keyin kursni
   * bekor qilsa — tanlangan tillar ko'rinmaydigan joyda qolib ketardi
   * va bazaga «til kursi kerak emas, lekin koreys tili kerak» degan
   * qarama-qarshi javob tushardi.
   */
  const handleCourses = (next: string[]) => {
    update({
      wantedCourses: next,
      ...(next.includes(CHET_TILI_KURSI) ? {} : { wantedLanguages: [] }),
    });
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
          onChange={handleCourses}
          qoshimcha={(title) =>
            title === TIL_GURUHI && tilKursiTanlangan ? (
              /*
                Savol aynan «Chet tili kursi» chipining tagida turadi.
                Ilgari u qadamning eng oxirida edi — bola chipni bosardi,
                tagida esa boshqa guruhlar chiqardi va tillar beshta
                guruh pastda qolib ketardi. Chapdagi chiziq savol
                ergash ekanini ko'rsatadi.
              */
              <div className="mt-3 border-l-2 border-accent/45 py-1 pl-4">
                <p className="mb-2 flex items-center gap-1 text-[15px] font-medium text-ink">
                  Qaysi tilni o&apos;rganmoqchisan?
                  <span className="text-danger">*</span>
                </p>

                <ChipGroup
                  options={TIL_TANLOVLARI}
                  values={boshqaTanlangan ? [...tanlanganTillar, BOSHQA_TIL] : tanlanganTillar}
                  onChange={handleTillar}
                />

                {boshqaTanlangan && (
                  <Input
                    className="mt-2.5 h-11 max-w-xs"
                    value={boshqaMatn ?? ''}
                    onChange={(e) => handleBoshqaMatn(e.target.value)}
                    placeholder="Masalan: Fransuz tili"
                    maxLength={40}
                    aria-label="Qaysi tilni o'rganmoqchisan"
                  />
                )}

                {errors.wantedLanguages ? (
                  <p data-xato className="mt-2 flex items-center gap-1.5 text-sm font-medium text-danger">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {errors.wantedLanguages}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-ink-faint">
                    Ro&apos;yxatda yo&apos;q bo&apos;lsa — «Boshqa til» ni bosib yoz
                  </p>
                )}
              </div>
            ) : null
          }
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
