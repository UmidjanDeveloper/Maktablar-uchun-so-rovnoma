'use client';

import { motion } from 'framer-motion';
import { ArrowRight, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/logo';

/** Anketaning to'rt bosqichi — yo'l xaritasi sifatida ko'rsatiladi */
const JOURNEY = [
  { n: '1', title: "O'zing haqingda", hint: 'Ism, maktab, sinf' },
  { n: '2', title: 'Nima yoqadi', hint: 'Fanlar va to\'garaklar' },
  { n: '3', title: 'Orzu kasbing', hint: '35 ta kasbdan tanlash' },
  { n: '4', title: 'Kelajak rejang', hint: 'Mahallang uchun niyating' },
] as const;

interface WelcomeScreenProps {
  onStart: () => void;
  /** Yuborilishini kutayotgan anketalar soni */
  pendingCount: number;
}

/**
 * Kiosk rejimidagi kutib olish ekrani.
 *
 * Bu ekran maktab kompyuterida kun bo'yi ochiq turadi — o'quvchi
 * yoniga kelib o'tiradi va birinchi ko'radigan narsa shu. Shuning
 * uchun u chaqiruvchi va tushunarli bo'lishi kerak: kim uchun,
 * nima uchun va qancha vaqt oladi.
 */
export function WelcomeScreen({ onStart, pendingCount }: WelcomeScreenProps) {
  return (
    <div className="relative mx-auto flex min-h-[76vh] w-full max-w-5xl flex-col items-center justify-center px-4 py-10 text-center">
      {/* Gerb — quyosh chiqqandek ko'tarilib chiqadi */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <span className="absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-sun-200/60" />
        <Logo className="h-28 w-28 drop-shadow-sm sm:h-32 sm:w-32" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18, duration: 0.5 }}
        className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-brand-600 sm:text-sm"
      >
        Xatirchi tumani hokimligi
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.55 }}
        className="mt-2 font-display text-5xl font-extrabold leading-[1.02] text-ink sm:text-6xl lg:text-7xl"
      >
        Kelajak Egasi
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.55 }}
        className="mt-5 max-w-2xl text-balance text-lg leading-relaxed text-ink-soft sm:text-xl"
      >
        Har bir buyuk kasb bir vaqtlar oddiy orzu bo&apos;lgan.{' '}
        <strong className="font-semibold text-ink">Sening orzuying nima?</strong>{' '}
        Bir necha daqiqa vaqt ajrat — javoblaring tumanimiz kelajagini
        rejalashtirishda hisobga olinadi.
      </motion.p>

      {/* Yo'l xaritasi: to'rt qadam */}
      <motion.ol
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.55 }}
        className="mt-10 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {JOURNEY.map((step) => (
          <li
            key={step.n}
            className="rounded-2xl border border-cream-deep bg-white/80 p-4 text-left shadow-soft backdrop-blur-sm"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 font-display text-sm font-bold text-white">
              {step.n}
            </span>
            <p className="mt-3 font-display text-[15px] font-bold leading-tight text-ink">
              {step.title}
            </p>
            <p className="mt-0.5 text-xs leading-snug text-ink-faint">{step.hint}</p>
          </li>
        ))}
      </motion.ol>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.52, duration: 0.5 }}
        className="mt-10 flex flex-col items-center gap-3"
      >
        <Button
          onClick={onStart}
          className="h-[68px] rounded-[26px] px-12 text-xl"
          size="xl"
        >
          Boshlash
          <ArrowRight className="h-6 w-6" />
        </Button>
        <p className="text-sm text-ink-faint">
          Ro&apos;yxatdan o&apos;tish shart emas · atigi 2 daqiqa
        </p>
      </motion.div>

      {pendingCount > 0 && (
        <p className="mt-8 flex items-center gap-2 rounded-2xl border border-sun-200 bg-sun-50 px-4 py-2.5 text-sm font-medium text-sun-700">
          <WifiOff className="h-4 w-4" />
          {pendingCount} ta anketa yuborilishini kutmoqda
        </p>
      )}
    </div>
  );
}
