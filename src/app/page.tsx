import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { SurveyWizard } from '@/components/survey/survey-wizard';
import { LogoLockup } from '@/components/shared/logo';
import { AuroraBackground } from '@/components/shared/aurora-background';
import { ThemeToggle } from '@/components/shared/theme-toggle';

/** Kiosk rejimida ekran har doim yangi ma'lumot ko'rsatishi uchun */
export const dynamic = 'force-dynamic';

/**
 * Bosh sahifa — o'quvchilar uchun anketa (login talab qilinmaydi).
 * Maktab kompyuterlarida kiosk rejimida ochiladi.
 */
export default function HomePage() {
  return (
    <main className="kiosk-noselect relative min-h-screen">
      <AuroraBackground />

      {/* Yuqori panel */}
      <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_srgb,var(--bg-canvas)_78%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/">
            <LogoLockup />
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/admin/login"
              className="glass flex h-11 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              title="Hokimiyat uchun boshqaruv paneli"
            >
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </header>

      <SurveyWizard />

      {/* Pastki matn */}
      <footer className="border-t border-line py-6">
        <p className="px-4 text-center text-xs text-ink-faint">
          © {new Date().getFullYear()} Xatirchi tumani hokimligi · Navoiy viloyati ·
          &laquo;Kelajak Egasi&raquo; loyihasi
        </p>
      </footer>
    </main>
  );
}
