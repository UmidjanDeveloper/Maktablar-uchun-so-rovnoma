'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Volume2, VolumeX, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Confetti } from './confetti';
import { categoryTheme, KASB_ICON_MAP } from '@/lib/constants';
import { isMuted, playCelebration, setMuted } from '@/lib/sound';

/**
 * Kiosk rejimida ekran avtomatik tozalanadigan vaqt (soniya).
 *
 * 40 soniya — bola tabrikni, o'z kasbini va unga atalgan jumlani
 * shoshilmasdan o'qib ulgurishi uchun. Amalda 12 soniya kam bo'lib
 * chiqdi: matn tugamasdan ekran tozalanardi.
 *
 * Keyingi o'quvchi kutib qolmaydi — "Yangi anketa to'ldirish"
 * tugmasi hisoblagichni kutmasdan darhol keyingisiga o'tkazadi.
 */
const AUTO_RESET_SECONDS = 40;

interface SuccessScreenProps {
  firstName: string;
  dreamJob: string;
  /** Kasb yo'nalishi — rang, ovoz va tabrik jumlasi shunga qarab tanlanadi */
  jobCategory: string;
  /** Anketa internetsiz saqlangan bo'lsa — ogohlantirish ko'rsatiladi */
  savedOffline: boolean;
  onReset: () => void;
}

/**
 * Anketa yakunidagi tabrik ekrani.
 *
 * Bu platformaning eng muhim daqiqasi: bola bir necha daqiqa vaqt
 * sarfladi va evaziga nima oladi? Shu ekran uning esida qoladi.
 *
 * Shuning uchun tabrik uch qatlamdan iborat:
 *   - RANG   — tanlangan yo'nalishning o'z rangi butun ekranni egallaydi
 *   - OVOZ   — militsiya tanlasa sirena, shifokor tanlasa yurak urishi
 *   - SO'Z   — har bir yo'nalish uchun alohida yozilgan jumla
 *
 * KIOSK REJIMI: hisoblagich tugagach ekran o'zi tozalanadi va keyingi
 * o'quvchini kutadi — o'qituvchi aralashuvi kerak emas.
 */
export function SuccessScreen({
  firstName,
  dreamJob,
  jobCategory,
  savedOffline,
  onReset,
}: SuccessScreenProps) {
  const [seconds, setSeconds] = useState(AUTO_RESET_SECONDS);
  const [muted, setMutedState] = useState(false);

  const theme = useMemo(() => categoryTheme(jobCategory), [jobCategory]);
  const icon = KASB_ICON_MAP[dreamJob] ?? '⭐';

  // Ovoz holatini o'qiymiz va tabrik ovozini chalamiz
  useEffect(() => {
    setMutedState(isMuted());
    playCelebration(theme.sound);
  }, [theme.sound]);

  // Kiosk hisoblagichi
  useEffect(() => {
    const tick = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    const timer = setTimeout(onReset, AUTO_RESET_SECONDS * 1000);
    return () => {
      clearInterval(tick);
      clearTimeout(timer);
    };
  }, [onReset]);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) playCelebration(theme.sound);
  };

  return (
    <div
      className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-12 text-center"
      style={{ backgroundColor: theme.soft }}
    >
      <Confetti count={80} />

      {/* Ovozni o'chirish — kompyuter sinfida shovqin bo'lmasligi uchun */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? 'Ovozni yoqish' : "Ovozni o'chirish"}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-ink-soft shadow-soft backdrop-blur transition-colors hover:bg-white"
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>

      {/* Kasb belgisi — tanlangan yo'nalish rangidagi halqa ichida */}
      <motion.div
        initial={{ scale: 0.3, rotate: -14, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 190, damping: 15 }}
        className="relative mb-7"
      >
        <span
          className="absolute inset-0 -z-10 animate-pulse-ring rounded-full"
          style={{ backgroundColor: theme.color, opacity: 0.28 }}
        />
        <span
          className="flex h-36 w-36 items-center justify-center rounded-full bg-white text-[68px] shadow-soft-lg sm:h-40 sm:w-40 sm:text-[76px]"
          style={{ boxShadow: `0 18px 44px -14px ${theme.color}66` }}
        >
          {icon}
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.45 }}
        className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl"
      >
        Rahmat, {firstName}!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.45 }}
        className="mt-4 max-w-2xl text-balance font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl"
      >
        Sen kelajakda ajoyib{' '}
        <span style={{ color: theme.color }}>{dreamJob}</span> bo&apos;lasan!
      </motion.p>

      {/* Yo'nalishga mos shaxsiy jumla */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.45 }}
        className="mt-4 max-w-xl text-balance text-lg text-ink-soft sm:text-xl"
      >
        {theme.cheer}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.56, duration: 0.45 }}
        className="mt-2 max-w-md text-sm text-ink-faint"
      >
        Orzularing sari dadil qadam tashla.
      </motion.p>

      {savedOffline && (
        <div className="mt-7 flex max-w-md items-center gap-2 rounded-2xl border-2 border-sun-200 bg-sun-50 px-4 py-3 text-sm font-medium text-sun-700">
          <WifiOff className="h-4 w-4 shrink-0" />
          Internet yo&apos;q — anketang kompyuterda saqlandi va aloqa
          tiklanishi bilan yuboriladi.
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.66, duration: 0.45 }}
        className="mt-11 flex flex-col items-center gap-3"
      >
        <Button
          onClick={onReset}
          size="xl"
          className="h-[76px] rounded-[28px] px-14 text-xl"
        >
          <RotateCcw className="h-6 w-6" />
          Yangi anketa to&apos;ldirish
        </Button>
        <p className="text-sm text-ink-faint" aria-live="polite">
          {seconds} soniyadan so&apos;ng keyingi o&apos;quvchi uchun tayyorlanadi
        </p>
      </motion.div>
    </div>
  );
}
