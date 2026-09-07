'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Volume2, VolumeX, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Confetti } from './confetti';
import { jobTheme } from '@/lib/constants';
import { useTheme } from '@/components/shared/theme-provider';
import { EntityIcon } from '@/lib/icons';
import { isMuted, playCelebration, setMuted, stopCelebration } from '@/lib/sound';

/**
 * Kiosk rejimida ekran avtomatik tozalanadigan vaqt (soniya).
 *
 * 25 soniya — bola tabrikni, o'z kasbini va unga atalgan jumlani
 * shoshilmasdan o'qib ulgurishi uchun. Amalda 12 soniya kam bo'lib
 * chiqdi: matn tugamasdan ekran tozalanardi.
 *
 * Keyingi o'quvchi kutib qolmaydi — "Yangi anketa to'ldirish"
 * tugmasi hisoblagichni kutmasdan darhol keyingisiga o'tkazadi.
 */
const AUTO_RESET_SECONDS = 25;

interface SuccessScreenProps {
  firstName: string;
  dreamJob: string;
  /** Kasb yo'nalishi — rang shunga qarab tanlanadi (jumla va ovoz kasbning o'zidan) */
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
  const [lite, setLite] = useState(false);

  const { resolved } = useTheme();
  const theme = useMemo(() => jobTheme(dreamJob, jobCategory), [dreamJob, jobCategory]);

  /**
   * Kasb rangi temaga qarab tanlanadi.
   * Qorong'i fonda to'q rang butunlay yo'qoladi — ikona qora doiraga
   * aylanib qoladi va tabrik "porlamaydi".
   */
  const accent = resolved === 'dark' ? theme.colorDark : theme.color;

  /*
   * Ovoz holatini o'qiymiz va tabrik ovozini chalamiz.
   *
   * Ekran yopilganda musiqa albatta to'xtatiladi: `public/tabrik.mp3`
   * hisoblagichdan uzunroq bo'lsa, u keyingi o'quvchining anketasi
   * ustidan chalinib turishi mumkin edi.
   */
  useEffect(() => {
    setMutedState(isMuted());
    setLite(document.documentElement.dataset.fx === 'lite');
    playCelebration(theme.sound);
    return () => stopCelebration();
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
    // O'chirilsa — darhol jim bo'lsin, yoqilsa — boshidan chalinsin
    if (next) stopCelebration();
    else playCelebration(theme.sound);
  };

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-12 text-center">
      {/* Tanlangan yo'nalish rangidagi porlash — butun ekranni egallaydi */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(90vmin 70vmin at 50% 32%, color-mix(in srgb, ${accent} 42%, transparent) 0%, transparent 70%)`,
        }}
      />
      {/* Zaif kompyuterda bo'laklar soni kamayadi — [data-fx="lite"]
          rejimida animatsiya og'irlik qilmasligi uchun */}
      <Confetti count={lite ? 45 : 140} />

      {/* Ovozni o'chirish — kompyuter sinfida shovqin bo'lmasligi uchun */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? 'Ovozni yoqish' : "Ovozni o'chirish"}
        className="glass absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-md text-ink-muted transition-colors hover:text-ink"
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
          className="absolute inset-0 -z-10 rounded-full blur-2xl"
          style={{ backgroundColor: accent, opacity: 0.55 }}
        />
        <span
          className="glass-strong flex h-32 w-32 items-center justify-center rounded-full sm:h-40 sm:w-40"
          style={{
            // Doira ichi ham kasb rangiga bo'yaladi — aks holda u
            // qorong'i fonda "qora tuynuk" bo'lib ko'rinadi
            backgroundColor: `color-mix(in srgb, ${accent} 16%, transparent)`,
            borderColor: `color-mix(in srgb, ${accent} 60%, transparent)`,
            boxShadow: `0 0 0 1px color-mix(in srgb, ${accent} 45%, transparent), 0 24px 60px -14px ${accent}`,
          }}
        >
          <EntityIcon
            name={dreamJob || 'Kelajak'}
            strokeWidth={1.6}
            className="h-14 w-14 sm:h-16 sm:w-16"
            style={{ color: accent }}
          />
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.45 }}
        className="font-display text-[2rem] font-bold tracking-tight text-ink xs:text-4xl sm:text-5xl"
      >
        Rahmat, {firstName}!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.45 }}
        className="mt-4 max-w-2xl text-balance font-display text-xl font-semibold leading-snug text-ink xs:text-2xl sm:text-3xl"
      >
        {dreamJob ? (
          <>
            Sen kelajakda ajoyib{' '}
            <span style={{ color: accent }}>{dreamJob}</span> bo&apos;lasan!
          </>
        ) : (
          <>
            Sening <span style={{ color: accent }}>ovozing eshitildi!</span>
          </>
        )}
      </motion.p>

      {/* Shaxsiy jumla: kasb tanlagan bo'lsa — o'sha kasbniki */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.45 }}
        className="mt-4 max-w-xl text-balance text-[15px] text-ink-muted sm:text-lg"
      >
        {dreamJob
          ? theme.cheer
          : "Mahallangda qanday to'garak va kurs ochilishini aynan sen kabi o'quvchilarning javobi hal qiladi."}
      </motion.p>

      {/* Yakuniy chaqiriq — bola shu gap bilan o'rnidan turadi */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 flex max-w-xl flex-col items-center gap-2"
      >
        <span
          aria-hidden="true"
          className="h-px w-24"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />
        <p className="font-display text-lg font-bold leading-snug text-ink sm:text-xl">
          Bugun sen shunchaki anketa to&apos;ldirmading —
          <br className="hidden sm:block" />{' '}
          <span style={{ color: accent }}>
            {dreamJob
              ? "orzuingni ovoz chiqarib aytding."
              : "nima kerakligini ovoz chiqarib aytding."}
          </span>
        </p>
        <p className="text-sm text-ink-muted sm:text-[15px]">
          {dreamJob
            ? 'Endi unga qarab yur. Xatirchi sendan kuchli odam chiqishini kutmoqda.'
            : 'Xatirchi seni eshitdi — va sen uchun ish boshlaydi.'}
        </p>
        <span
          aria-hidden="true"
          className="h-px w-24"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />
      </motion.div>

      {savedOffline && (
        <div className="mt-7 flex max-w-md items-center gap-2 rounded-md border border-warn/40 bg-warn-bg px-4 py-3 text-sm font-medium text-warn">
          <WifiOff className="h-4 w-4 shrink-0" />
          Internet yo&apos;q — anketang kompyuterda saqlandi va aloqa
          tiklanishi bilan yuboriladi.
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.45 }}
        className="mt-9 flex flex-col items-center gap-3"
      >
        <Button onClick={onReset} size="xl" className="h-14 px-10 text-base">
          <RotateCcw className="h-5 w-5" />
          Yangi anketa to&apos;ldirish
        </Button>
        <p className="font-mono text-xs tabular-nums text-ink-faint" aria-live="polite">
          {seconds} soniyadan so&apos;ng keyingi o&apos;quvchi uchun tayyorlanadi
        </p>
      </motion.div>
    </div>
  );
}
