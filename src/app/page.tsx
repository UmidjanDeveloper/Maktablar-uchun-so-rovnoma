import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { SurveyWizard } from '@/components/survey/survey-wizard';
import { LogoLockup } from '@/components/shared/logo';

/** Kiosk rejimida ekran har doim yangi ma'lumot ko'rsatishi uchun */
export const dynamic = 'force-dynamic';

/**
 * Bosh sahifa — o'quvchilar uchun anketa (login talab qilinmaydi).
 * Maktab kompyuterlarida kiosk rejimida ochiladi.
 */
export default function HomePage() {
  return (
    <main className="kiosk-noselect min-h-screen bg-sunrise">
      {/* Yuqori panel */}
      <header className="sticky top-0 z-40 border-b border-cream-deep bg-cream/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/">
            <LogoLockup />
          </Link>

          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-ink-faint transition-colors hover:bg-cream-deep hover:text-ink"
            title="Hokimiyat uchun boshqaruv paneli"
          >
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </header>

      <SurveyWizard />

      {/* Pastki matn */}
      <footer className="border-t border-cream-deep bg-white/50 py-6">
        <p className="text-center text-xs text-ink-faint">
          © {new Date().getFullYear()} Xatirchi tumani hokimligi · Navoiy viloyati ·
          &laquo;Kelajak Egasi&raquo; loyihasi
        </p>
      </footer>
    </main>
  );
}
