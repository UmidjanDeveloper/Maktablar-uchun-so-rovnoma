'use client';

import { Phone } from 'lucide-react';
import { faqatRaqam, milliyRaqam, raqamniChiroyliQil } from '@/lib/inson-tekshiruvi';
import { cn } from '@/lib/utils';

interface PhoneFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
}

/**
 * Telefon raqami maydoni.
 *
 * Maktabdagi sinovda bolalar bu maydonga harflar va tasodifiy
 * raqamlarni terib tashladi. Oddiy matn maydoni buni to'xtata olmaydi —
 * shuning uchun bu yerda uch xil himoya bor:
 *
 *   1. `+998` doimo maydonning chap tomonida turadi va o'chirib
 *      bo'lmaydi — bola uni yozib o'tirmaydi va noto'g'ri yozolmaydi
 *   2. Harf va belgi umuman kiritilmaydi: har bosishda faqat raqamlar
 *      qoldiriladi
 *   3. Raqam yozilishi bilan "90 123 45 67" ko'rinishiga keladi va
 *      9 tadan ortiq raqam qabul qilinmaydi
 *
 * Raqamning haqiqiyligi (operator kodi, takroriy raqamlar) esa
 * `telefonTekshir` orqali yuborishdan oldin tekshiriladi.
 */
export function PhoneField({ id, value, onChange, hasError }: PhoneFieldProps) {
  const raqamlar = milliyRaqam(value);

  const handle = (kiritilgan: string) => {
    // Barcha harf va belgilar tashlab yuboriladi
    const faqat = faqatRaqam(kiritilgan);
    onChange(milliyRaqam(faqat));
  };

  return (
    <div
      className={cn(
        'glass flex h-12 items-center gap-2 rounded-md border px-3 transition-colors',
        'focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/40',
        hasError && 'border-danger'
      )}
    >
      <Phone className="h-4 w-4 shrink-0 text-ink-faint" />

      {/* O'zgarmas mamlakat kodi — bola uni yozmaydi va o'chira olmaydi */}
      <span className="shrink-0 select-none font-mono text-base text-ink-muted">+998</span>

      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        // Mobil klaviaturada faqat raqam paneli ochiladi
        pattern="[0-9]*"
        value={raqamniChiroyliQil(raqamlar)}
        onChange={(e) => handle(e.target.value)}
        onPaste={(e) => {
          e.preventDefault();
          handle(e.clipboardData.getData('text'));
        }}
        placeholder="90 123 45 67"
        className="w-full min-w-0 bg-transparent font-mono text-base tracking-wide text-ink outline-none placeholder:text-ink-faint"
        aria-describedby={`${id}-hint`}
      />
    </div>
  );
}
