import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { SurveyWizard } from '@/components/survey/survey-wizard';

/** Kiosk rejimida ekran har doim yangi ma'lumot ko'rsatishi uchun */
export const dynamic = 'force-dynamic';

/**
 * Bosh sahifa — o'quvchilar uchun anketa (login talab qilinmaydi).
 * Maktab kompyuterlarida kiosk rejimida ochiladi.
 */
export default function HomePage() {
  return (
    <main className="kiosk-noselect min-h-screen bg-grid">
      {/* Yuqori panel */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-xl shadow-soft">
              🎓
            </span>
            <span className="leading-tight">
              <span className="block text-base font-extrabold tracking-tight text-slate-900">
                Kelajak Egasi
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Xatirchi tumani
              </span>
            </span>
          </Link>

          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            title="Hokimiyat uchun boshqaruv paneli"
          >
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </header>

      <SurveyWizard />

      {/* Pastki matn */}
      <footer className="border-t border-slate-200/70 bg-white/60 py-6">
        <p className="text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Xatirchi tumani hokimligi · Navoiy viloyati ·
          &laquo;Kelajak Egasi&raquo; loyihasi
        </p>
      </footer>
    </main>
  );
}
