'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Tuman gerbining rasm fayli.
 *
 * Fayl qo'yilsa — o'sha ishlatiladi, qo'yilmasa quyidagi chizilgan
 * SVG qoladi. Shu sababli gerbni almashtirish uchun kodga tegish
 * shart emas: GitHub'da `public/` papkasiga shu nom bilan rasm
 * yuklash kifoya.
 */
const GERB_FAYLI = '/hokimiyat-logo.png';

/**
 * Xatirchi tumani gerbi.
 *
 * Tarkibi: chiqayotgan quyosh, tog'lar, daryo va o'sayotgan nihol —
 * yosh avlod ramzi. SVG sifatida chizilgani uchun 40 pikseldan
 * 400 pikselgacha bir xil aniqlikda ko'rinadi va oflayn ishlaydi.
 *
 * `clipPath` identifikatori bir sahifada bir necha logotip bo'lsa ham
 * to'qnashmasligi kerak. Buni oddiy hisoblagich bilan qilib bo'lmaydi:
 * server va brauzer bir xil tartibda sanamaydi va React "id mos
 * kelmadi" deb ogohlantiradi. `useId` ikkala tomonda bir xil qiymat
 * beradi.
 */
function ChizilganGerb({ className }: { className?: string }) {
  // `useId` qiymatida ikki nuqta bo'ladi (":r1:") — `url(#...)` da
  // muammo tug'dirmasligi uchun olib tashlaymiz
  const clipId = `logo-disc-${useId().replace(/:/g, '')}`;

  return (
    <svg
      viewBox="0 0 200 200"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="100" cy="100" r="88" />
        </clipPath>
      </defs>

      {/* Manzara — doira ichiga kesib qo'yiladi */}
      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="200" height="200" fill="#FBF8F1" />

        {/* Chiqayotgan quyosh */}
        <circle cx="100" cy="78" r="43" fill="#F2B01E" />

        {/* Tog'lar */}
        <path d="M4 146 L52 84 L82 126 L104 98 L150 146 Z" fill="#2E9B3F" />
        <path d="M4 146 L52 84 L68 106 L36 146 Z" fill="#25842F" />

        {/* Daryo */}
        <rect x="0" y="146" width="200" height="54" fill="#17559B" />
        <path
          d="M8 162 q22 -9 44 0 t44 0 t44 0 t44 0"
          fill="none"
          stroke="#FBF8F1"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>

      {/* Quyosh nurlari — doiradan tashqariga chiqadi */}
      <g stroke="#F2B01E" strokeWidth="7" strokeLinecap="round">
        <line x1="100" y1="6" x2="100" y2="20" />
        <line x1="153" y1="27" x2="145" y2="38" />
        <line x1="47" y1="27" x2="55" y2="38" />
        <line x1="182" y1="72" x2="169" y2="74" />
        <line x1="18" y1="72" x2="31" y2="74" />
      </g>

      {/* Nihol — o'sayotgan avlod. Krem chegara uni quyosh fonida ajratadi */}
      <g
        fill="#1F7A2D"
        stroke="#FBF8F1"
        strokeWidth="4.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M100 152 V74" fill="none" />
        <path d="M100 106 C110 82 134 68 152 72 C150 98 126 116 100 106 Z" />
        <path d="M100 128 C92 108 72 96 56 100 C58 122 78 138 100 128 Z" />
      </g>

      {/* Doira chegarasi */}
      <circle cx="100" cy="100" r="88" fill="none" stroke="#0F3E75" strokeWidth="5" />
    </svg>
  );
}

/**
 * Tuman gerbi.
 *
 * Ikki manba: `public/hokimiyat-logo.png` fayli va yuqoridagi
 * chizilgan SVG.
 *
 * Tartib ataylab shunday: AVVAL chizilgan gerb ko'rsatiladi, rasm
 * yuklangandan keyingina u almashtiriladi. Aksincha qilinsa, fayl
 * yo'q bo'lgan holatda har safar sahifa ochilganda bir zumga
 * "buzilgan rasm" belgisi ko'rinib ketardi.
 */
export function Logo({ className }: { className?: string }) {
  const [rasmTayyor, setRasmTayyor] = useState(false);
  const rasm = useRef<HTMLImageElement>(null);

  /*
   * `onLoad` rasm React hidratsiyasidan OLDIN yuklansa ishlamaydi —
   * hodisa allaqachon o'tib ketgan bo'ladi. Shuning uchun ulangandan
   * keyin holatni bir marta o'zimiz tekshiramiz.
   */
  useEffect(() => {
    const el = rasm.current;
    if (el && el.complete && el.naturalWidth > 0) setRasmTayyor(true);
  }, []);

  return (
    <span
      className={cn('relative inline-block shrink-0', className)}
      role="img"
      aria-label="Xatirchi tumani gerbi"
    >
      {!rasmTayyor && <ChizilganGerb className="absolute inset-0 h-full w-full" />}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={rasm}
        src={GERB_FAYLI}
        alt=""
        aria-hidden="true"
        className={cn(
          'h-full w-full object-contain transition-opacity',
          rasmTayyor ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={(e) => {
          if (e.currentTarget.naturalWidth > 0) setRasmTayyor(true);
        }}
        onError={() => setRasmTayyor(false)}
      />
    </span>
  );
}

/** Logotip + nom — yuqori panellar uchun */
export function LogoLockup({
  subtitle = 'Xatirchi tumani',
  className,
}: {
  subtitle?: string;
  className?: string;
}) {
  return (
    <span className={cn('flex items-center gap-3', className)}>
      <Logo className="h-11 w-11" />
      <span className="leading-tight">
        <span className="block font-display text-[17px] font-extrabold tracking-tight text-ink">
          Kelajak Egasi
        </span>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          {subtitle}
        </span>
      </span>
    </span>
  );
}
