'use client';

import { ShieldCheck } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { FormState } from './types';

interface StepFutureProps {
  form: FormState;
  errors: Record<string, string>;
  update: (patch: Partial<FormState>) => void;
}

/**
 * 5-qadam: rozilik.
 *
 * Ilgari bu qadamda "kim ilhom berdi", "chet elda o'qish istagi" va
 * "mahalla uchun rejang" savollari ham bor edi. Ular qarorga hech
 * narsa qo'shmadi — hokimiyat ularga qarab biror ish qilmasdi — lekin
 * anketani uzaytirdi va bolani charchatdi. Shuning uchun olib
 * tashlandi va bu qadamda faqat rozilik qoldi.
 */
export function StepFuture({ form, errors, update }: StepFutureProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-md border border-ok/35 bg-ok-bg p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-ok" strokeWidth={1.9} />
        <div className="text-sm leading-relaxed text-ink-muted">
          <p className="font-semibold text-ink">Deyarli tayyor!</p>
          <p className="mt-1">
            Javoblaring tumanimizda qanday to&apos;garak va kurslar ochish
            kerakligini aniqlashda ishlatiladi. Boshqa hech qanday maqsadda
            ishlatilmaydi va tashqi shaxslarga berilmaydi.
          </p>
        </div>
      </div>

      {/* Rozilik — majburiy */}
      <div
        className={cn(
          'flex items-start gap-3 rounded-md border p-4 transition-colors',
          errors.consent ? 'border-danger bg-danger-bg' : 'border-line bg-surface'
        )}
      >
        <Checkbox
          id="consent"
          checked={form.consent}
          onCheckedChange={(v) => update({ consent: v === true })}
          className="mt-0.5"
        />
        <label htmlFor="consent" className="cursor-pointer text-sm leading-relaxed">
          <span className="font-semibold text-ink">
            Ma&apos;lumotlarim ta&apos;lim loyihalari uchun ishlatilishiga roziman
          </span>
          <span className="ml-1 text-danger">*</span>
          <span className="mt-1 block text-ink-faint">
            Ma&apos;lumotlaringiz faqat tumandagi to&apos;garak va o&apos;quv
            dasturlarini rejalashtirish uchun ishlatiladi.
          </span>
        </label>
      </div>

      {errors.consent && (
        <p className="text-sm font-medium text-danger">{errors.consent}</p>
      )}
    </div>
  );
}
