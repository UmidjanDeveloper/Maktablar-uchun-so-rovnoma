'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Confetti } from './confetti';
import { KASB_ICON_MAP } from '@/lib/constants';

/**
 * Kiosk rejimida ekran avtomatik tozalanadigan vaqt (soniya).
 * 12 soniya — bola o'z ismini va tanlagan kasbini o'qib ulgurishi,
 * lekin keyingi navbatdagi o'quvchi uzoq kutmasligi uchun.
 */
const AUTO_RESET_SECONDS = 12;

interface SuccessScreenProps {
  firstName: string;
  dreamJob: string;
  /** Anketa internetsiz saqlangan bo'lsa — ogohlantirish ko'rsatiladi */
  savedOffline: boolean;
  onReset: () => void;
}

/**
 * Anketa yuborilgandan keyingi tabrik ekrani.
 * KIOSK REJIMI: 7 soniyadan so'ng avtomatik ravishda bosh sahifaga
 * qaytadi va keyingi o'quvchi uchun forma tozalanadi.
 */
export function SuccessScreen({ firstName, dreamJob, savedOffline, onReset }: SuccessScreenProps) {
  const [seconds, setSeconds] = useState(AUTO_RESET_SECONDS);
  const icon = KASB_ICON_MAP[dreamJob] ?? '⭐';

  useEffect(() => {
    // Har soniyada hisoblagichni kamaytiramiz
    const tick = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    // Belgilangan vaqtdan so'ng formani tozalaymiz
    const timer = setTimeout(onReset, AUTO_RESET_SECONDS * 1000);

    return () => {
      clearInterval(tick);
      clearTimeout(timer);
    };
  }, [onReset]);

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <Confetti />

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-brand-100 text-7xl shadow-soft"
      >
        {icon}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
      >
        Rahmat, {firstName}!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.4 }}
        className="mt-3 max-w-xl text-lg text-slate-600 sm:text-xl"
      >
        Sen kelajakda ajoyib{' '}
        <span className="font-bold text-brand-700">{dreamJob}</span> bo&apos;lasan! 🎉
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-2 max-w-md text-sm text-slate-500"
      >
        Orzularing sari dadil qadam tashla. Xatirchi tumani sening muvaffaqiyating uchun
        yoningda!
      </motion.p>

      {savedOffline && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          <WifiOff className="h-4 w-4 shrink-0" />
          Internet yo&apos;q — anketang kompyuterda saqlandi va aloqa tiklanishi bilan
          yuboriladi.
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-10 flex flex-col items-center gap-3"
      >
        <Button
          size="xl"
          onClick={onReset}
          className="h-20 rounded-3xl px-12 text-xl shadow-soft-lg"
        >
          <RotateCcw className="h-6 w-6" />
          Yangi anketa to&apos;ldirish
        </Button>
        <p className="text-sm text-slate-400" aria-live="polite">
          {seconds} soniyadan so&apos;ng keyingi o&apos;quvchi uchun avtomatik tozalanadi
        </p>
      </motion.div>
    </div>
  );
}
