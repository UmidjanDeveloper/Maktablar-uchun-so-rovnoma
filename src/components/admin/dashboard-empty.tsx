'use client';

import { FilterX, Inbox, School } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardEmptyProps {
  /**
   * `first-run` — bazada umuman anketa yo'q (tizim endi ishga tushirilgan)
   * `no-results` — anketalar bor, lekin tanlangan filtrlarga mos kelmadi
   */
  variant: 'first-run' | 'no-results';
  onClearFilters?: () => void;
}

/**
 * Tahlil panelining bo'sh holati.
 *
 * Ma'lumot bo'lmaganda 6 ta diagrammani nol bilan ko'rsatish tizim
 * buzuq degan taassurot qoldiradi. Buning o'rniga nima bo'layotganini
 * va keyingi qadamni tushuntiramiz.
 */
export function DashboardEmpty({ variant, onClearFilters }: DashboardEmptyProps) {
  if (variant === 'no-results') {
    return (
      <section className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-6 py-16 text-center shadow-soft">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <FilterX className="h-7 w-7 text-slate-400" />
        </span>
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          Tanlangan shartlarga mos anketa topilmadi
        </h2>
        <p className="mt-1.5 max-w-md text-sm text-slate-500">
          Filtrlar juda tor bo&apos;lishi mumkin. Bir nechta shartni olib tashlab
          qayta ko&apos;ring.
        </p>
        {onClearFilters && (
          <Button variant="outline" className="mt-6" onClick={onClearFilters}>
            <FilterX className="h-4 w-4" />
            Barcha filtrlarni tozalash
          </Button>
        )}
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white px-6 py-14 text-center shadow-soft">
      <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
        <Inbox className="h-8 w-8 text-brand-600" />
      </span>

      <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
        Hali birorta anketa to&apos;ldirilmagan
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
        Tizim ishga tayyor. O&apos;quvchilar anketani to&apos;ldira boshlashi
        bilan bu sahifada diagrammalar, tahlil va tavsiyalar avtomatik paydo
        bo&apos;ladi.
      </p>

      {/* Keyingi qadamlar — hokimiyat xodimi nima qilishini bilsin */}
      <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
        {[
          {
            step: '1',
            icon: School,
            title: 'Maktabga yuboring',
            text: "Anketa manzilini maktab kompyuter sinfiga bering",
          },
          {
            step: '2',
            icon: Inbox,
            title: 'Kiosk rejimini yoqing',
            text: 'Brauzerni kiosk rejimida oching — o\'quvchilar navbat bilan to\'ldiradi',
          },
          {
            step: '3',
            icon: FilterX,
            title: 'Natijani kuzating',
            text: "Bu sahifa har yangilanishda so'nggi ma'lumotni ko'rsatadi",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
                  {item.step}
                </span>
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-sm font-bold text-slate-800">{item.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
