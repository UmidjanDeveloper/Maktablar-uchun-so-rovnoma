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
      <section className="glass flex flex-col items-center justify-center rounded-lg px-6 py-16 text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-line bg-surface-strong text-ink-faint">
          <FilterX className="h-6 w-6" strokeWidth={1.7} />
        </span>
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
          Tanlangan shartlarga mos anketa topilmadi
        </h2>
        <p className="mt-1.5 max-w-md text-sm text-ink-muted">
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
    <section className="glass rounded-lg px-5 py-12 text-center sm:px-6 sm:py-14">
      <span className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-lg border border-accent/35 bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-accent">
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-lg blur-xl"
          style={{ background: 'radial-gradient(circle, var(--mesh-1), transparent 70%)' }}
        />
        <Inbox className="h-7 w-7" strokeWidth={1.7} />
      </span>

      <h2 className="font-display text-xl font-bold tracking-tight text-ink">
        Hali birorta anketa to&apos;ldirilmagan
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink-muted">
        Tizim ishga tayyor. O&apos;quvchilar anketani to&apos;ldira boshlashi
        bilan bu sahifada diagrammalar, tahlil va tavsiyalar avtomatik paydo
        bo&apos;ladi.
      </p>

      {/* Keyingi qadamlar — hokimiyat xodimi nima qilishini bilsin */}
      <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
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
            text: "Brauzerni kiosk rejimida oching — o'quvchilar navbat bilan to'ldiradi",
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
            <div key={item.step} className="rounded-md border border-line bg-surface p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[11px] font-semibold tabular-nums text-accent">
                  0{item.step}
                </span>
                <Icon className="h-4 w-4 text-ink-faint" />
              </div>
              <p className="font-display text-sm font-semibold text-ink">{item.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-faint">{item.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
