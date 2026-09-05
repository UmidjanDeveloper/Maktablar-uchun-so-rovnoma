'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock3, ShieldOff, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/logo';
import { EntityIcon } from '@/lib/icons';

/** Anketaning to'rt bosqichi — yo'l xaritasi sifatida ko'rsatiladi */
const JOURNEY = [
  { n: '1', title: "O'zing haqingda", hint: 'Ism, maktab, sinf', icon: 'Otam/Onam' },
  { n: '2', title: 'Nima yoqadi', hint: 'Fanlar va to\'garaklar', icon: 'Matematika' },
  { n: '3', title: 'Orzu kasbing', hint: '35 ta kasbdan tanlash', icon: 'Dasturchi' },
  { n: '4', title: 'Kelajak rejang', hint: 'Mahallang uchun niyating', icon: 'Ha' },
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
 * yoniga kelib o'tiradi va birinchi ko'radigan narsa shu.
 * Mobil-first: 360px da ham hamma narsa joyiga tushadi.
 */
export function WelcomeScreen({ onStart, pendingCount }: WelcomeScreenProps) {
  return (
    <div className="mx-auto flex min-h-[78vh] w-full max-w-5xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
      {/* Gerb */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <span
          className="absolute inset-0 -z-10 rounded-full blur-2xl"
          style={{ background: 'radial-gradient(circle, var(--mesh-1), transparent 70%)' }}
        />
        <Logo className="h-24 w-24 sm:h-28 sm:w-28" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="mt-6 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-accent xs:text-[11px] sm:text-xs"
      >
        Xatirchi tumani hokimligi
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.55 }}
        className="text-gradient mt-3 font-display text-[2.6rem] font-bold leading-[1.02] xs:text-5xl sm:text-6xl lg:text-7xl"
      >
        Kelajak Egasi
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.55 }}
        className="mt-5 max-w-2xl text-balance text-[15px] leading-relaxed text-ink-muted sm:text-lg"
      >
        Har bir buyuk kasb bir vaqtlar oddiy orzu bo&apos;lgan.{' '}
        <strong className="font-semibold text-ink">Sening orzuying nima?</strong> Bir necha
        daqiqa vaqt ajrat — javoblaring tumanimiz kelajagini rejalashtirishda hisobga
        olinadi.
      </motion.p>

      {/* Yo'l xaritasi */}
      <motion.ol
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.55 }}
        className="mt-9 grid w-full max-w-3xl grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3"
      >
        {JOURNEY.map((step) => (
          <li key={step.n} className="glass rounded-md p-3.5 text-left sm:p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold tabular-nums text-accent">
                0{step.n}
              </span>
              <EntityIcon name={step.icon} className="h-4 w-4 text-ink-faint" />
            </div>
            <p className="mt-2.5 font-display text-[13px] font-semibold leading-tight text-ink sm:text-[15px]">
              {step.title}
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-ink-faint sm:text-xs">
              {step.hint}
            </p>
          </li>
        ))}
      </motion.ol>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-9 flex w-full flex-col items-center gap-4"
      >
        <Button onClick={onStart} size="xl" className="h-14 w-full max-w-xs text-base sm:w-auto sm:px-12">
          Boshlash
          <ArrowRight className="h-5 w-5" />
        </Button>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-ink-faint">
          <span className="flex items-center gap-1.5">
            <ShieldOff className="h-3.5 w-3.5" />
            Ro&apos;yxatdan o&apos;tish shart emas
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" />
            Atigi 2 daqiqa
          </span>
        </div>
      </motion.div>

      {pendingCount > 0 && (
        <p className="mt-7 flex items-center gap-2 rounded-md border border-warn/40 bg-warn-bg px-3.5 py-2 text-xs font-medium text-warn">
          <WifiOff className="h-3.5 w-3.5 shrink-0" />
          {pendingCount} ta anketa yuborilishini kutmoqda
        </p>
      )}
    </div>
  );
}
