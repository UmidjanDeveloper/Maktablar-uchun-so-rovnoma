'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Sahifa pastki qismi: hamkor logotipi va muallif.
 *
 * IT Shaharcha logotipi `public/it-shaharcha.png` faylidan olinadi.
 * Fayl hali qo'yilmagan bo'lsa, rasm o'rnida buzilgan belgi
 * ko'rinmasligi uchun blok butunlay yashiriladi — sayt hech qachon
 * "sinib turgan" ko'rinishga tushmaydi.
 */
export function SiteFooter() {
  const [logoBor, setLogoBor] = useState(true);
  const rasm = useRef<HTMLImageElement>(null);

  /**
   * `onError` ba'zan ishlamaydi: rasm React hidratsiyasidan OLDIN
   * yuklanmay qolsa, xato hodisasi allaqachon o'tib ketgan bo'ladi va
   * React uni ushlamaydi. Natijada ekranda buzilgan rasm belgisi va
   * alt matni qolib ketadi.
   *
   * Shuning uchun yuklangandan keyin qo'shimcha tekshiruv:
   * `naturalWidth === 0` — rasm yuklanmagani aniq belgisi.
   */
  useEffect(() => {
    const el = rasm.current;
    if (el && el.complete && el.naturalWidth === 0) setLogoBor(false);
  }, []);

  return (
    <footer className="mt-4 border-t border-line py-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 text-center">
        {logoBor && (
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
              Hamkorlikda
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={rasm}
              src="/it-shaharcha.png"
              alt="IT Shaharcha — Yoshlar Axborot Texnologiyalari Markazi"
              className="h-12 w-auto opacity-90 transition-opacity hover:opacity-100 sm:h-14"
              onError={() => setLogoBor(false)}
              onLoad={(e) => {
                if (e.currentTarget.naturalWidth === 0) setLogoBor(false);
              }}
            />
          </div>
        )}

        <p className="text-xs leading-relaxed text-ink-faint">
          © {new Date().getFullYear()} Xatirchi tumani hokimligi · Navoiy viloyati
          <span className="mx-1.5 hidden sm:inline">·</span>
          <br className="sm:hidden" />
          &laquo;Kelajak Egasi&raquo; loyihasi
        </p>

        {/* Muallif — nozik, lekin ko'rinadigan joyda */}
        <p className="flex items-center gap-2 text-[11px] text-ink-faint">
          <span
            aria-hidden="true"
            className="h-px w-8"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--border-strong))',
            }}
          />
          Made by{' '}
          <span className="font-display font-semibold text-ink-muted">
            Umidjan Zaxiddinovich
          </span>
          <span
            aria-hidden="true"
            className="h-px w-8"
            style={{
              background: 'linear-gradient(90deg, var(--border-strong), transparent)',
            }}
          />
        </p>
      </div>
    </footer>
  );
}
