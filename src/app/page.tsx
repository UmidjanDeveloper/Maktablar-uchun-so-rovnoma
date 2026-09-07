import Link from 'next/link';
import { SurveyWizard } from '@/components/survey/survey-wizard';
import { LogoLockup } from '@/components/shared/logo';
import { AuroraBackground } from '@/components/shared/aurora-background';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { SiteFooter } from '@/components/shared/site-footer';

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
      <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_srgb,var(--bg-base)_78%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/">
            <LogoLockup />
          </Link>

          {/*
            Boshqaruv paneliga havola ataylab qo'yilmagan.

            Bu ekran maktab sinfida kun bo'yi ochiq turadi va uni
            o'quvchilar ko'radi — ularga hokimiyat paneli kerak emas,
            aksincha, ko'rinib turgan tugma chalg'itadi va ortiqcha
            e'tibor tortadi. Xodimlar panelga to'g'ridan-to'g'ri
            /admin manzilini yozib kiradi.
          */}
          <ThemeToggle />
        </div>
      </header>

      <SurveyWizard />

      <SiteFooter />
    </main>
  );
}
