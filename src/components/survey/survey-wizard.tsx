'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, Send, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StepNodes } from './step-nodes';
import { useToast } from '@/components/ui/toast';
import { StepPersonal } from './step-personal';
import { StepInterests } from './step-interests';
import { StepDreamJob } from './step-dream-job';
import { StepCenter } from './step-center';
import { StepFuture } from './step-future';
import { SuccessScreen } from './success-screen';
import { WelcomeScreen } from './welcome-screen';
import { EMPTY_FORM, type FormState } from './types';
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  studentSchema,
  fieldErrors,
} from '@/lib/validation';
import { enqueue, queueSize, syncQueue } from '@/lib/offline';
import { MAHALLALAR, MAKTABLAR, KASBLAR } from '@/lib/constants';
import type { CatalogsResponse } from '@/types';

/** Qadamlar sarlavhalari */
const STEPS = [
  { title: "Shaxsiy ma'lumot", subtitle: "O'zing haqingda qisqacha", short: 'Ma\'lumot' },
  { title: 'Qiziqishlar', subtitle: 'Nimalar seni qiziqtiradi?', short: 'Qiziqish' },
  { title: 'Orzu kasb', subtitle: "Kim bo'lishni orzu qilasan?", short: 'Kasb' },
  { title: 'Qanday kurs kerak?', subtitle: 'Mahallangda nima ochilsin?', short: 'Kurslar' },
  { title: 'Kelajak', subtitle: 'Rejalaring haqida', short: 'Kelajak' },
] as const;

/** Qadam nomlari — step-node ko'rsatkichi uchun */
const STEP_LABELS = STEPS.map((s) => s.short);

export function SurveyWizard() {
  const { toast } = useToast();

  // 0 — kutib olish ekrani, 1..5 — anketa qadamlari, 6 — tabrik ekrani
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [savedOffline, setSavedOffline] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  // Kataloglar: avval serverdan olinadi, xato bo'lsa statik ro'yxatga qaytadi
  const [mahallalar, setMahallalar] = useState<string[]>(MAHALLALAR);
  const [maktablar, setMaktablar] = useState<string[]>(MAKTABLAR);
  const [kasblar, setKasblar] = useState(KASBLAR);

  /** Kataloglarni serverdan yuklash (admin qo'shgan yangi yozuvlar bilan) */
  useEffect(() => {
    let cancelled = false;
    fetch('/api/catalogs')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('catalog'))))
      .then((data: CatalogsResponse) => {
        if (cancelled) return;
        if (data.mahallalar?.length) setMahallalar(data.mahallalar.map((m) => m.name));
        if (data.maktablar?.length) setMaktablar(data.maktablar.map((m) => m.name));
        if (data.kasblar?.length) setKasblar(data.kasblar);
      })
      .catch(() => {
        // Oflayn holat — statik ro'yxatlar bilan davom etamiz
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /** Internet holatini kuzatish va navbatni sinxronlash */
  useEffect(() => {
    setIsOnline(navigator.onLine);
    setPendingCount(queueSize());

    const trySync = async () => {
      setIsOnline(true);
      if (queueSize() === 0) return;
      const result = await syncQueue();
      setPendingCount(result.remaining);
      if (result.sent > 0) {
        toast({
          title: 'Saqlangan anketalar yuborildi',
          description: `${result.sent} ta anketa serverga muvaffaqiyatli jo'natildi.`,
          variant: 'success',
        });
      }
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', trySync);
    window.addEventListener('offline', handleOffline);

    // Sahifa ochilganda ham navbatni tekshiramiz
    if (navigator.onLine) void trySync();

    return () => {
      window.removeEventListener('online', trySync);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  /** Forma maydonlarini yangilaydi va tegishli xatoni tozalaydi */
  const update = useCallback((patch: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(patch)) delete next[key];
      return next;
    });
  }, []);

  /** Joriy qadamni tekshiradi */
  const validateStep = useCallback(
    (target: number): boolean => {
      const schemas = [step1Schema, step2Schema, step3Schema, step4Schema, step5Schema];
      const schema = schemas[target - 1] ?? step5Schema;
      const result = schema.safeParse(form);
      if (!result.success) {
        setErrors(fieldErrors(result.error));
        return false;
      }
      setErrors({});
      return true;
    },
    [form]
  );

  /** Kiosk rejimi: formani to'liq tozalab, boshiga qaytaradi */
  const resetAll = useCallback(() => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSavedOffline(false);
    setStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goNext = () => {
    if (!validateStep(step)) {
      toast({
        title: "Ma'lumotlarni tekshiring",
        description: "Belgilangan maydonlarni to'ldiring va davom eting.",
        variant: 'error',
      });
      return;
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /** Anketani serverga yuborish (internet bo'lmasa — navbatga saqlash) */
  const handleSubmit = async () => {
    if (!validateStep(5)) {
      toast({
        title: 'Rozilik kerak',
        description: "Anketani yuborish uchun rozilik katagini belgilang.",
        variant: 'error',
      });
      return;
    }

    // Yuborishdan oldin butun anketani yana bir bor to'liq tekshiramiz —
    // shunda oldingi qadamdagi xato ham e'tibordan chetda qolmaydi.
    const validated = studentSchema.safeParse({ ...form, grade: Number(form.grade) });
    if (!validated.success) {
      setErrors(fieldErrors(validated.error));
      toast({
        title: "Anketada to'ldirilmagan joylar bor",
        description: 'Iltimos, qadamlarni qayta tekshirib chiqing.',
        variant: 'error',
      });
      return;
    }

    setSubmitting(true);
    const payload = validated.data;

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSavedOffline(false);
        setStep(6);
        return;
      }

      const data = await res.json().catch(() => ({}));

      // Takroriy anketa — o'quvchiga tushunarli xabar beramiz
      if (res.status === 409) {
        toast({
          title: 'Bu anketa allaqachon topshirilgan',
          description:
            data?.message ?? "Siz bugun anketani to'ldirgansiz. Rahmat!",
          variant: 'info',
        });
        setSubmitting(false);
        return;
      }

      // Server validatsiyasi xato bergan bo'lsa — maydonlarni belgilaymiz
      if (res.status === 422 && data?.errors) {
        setErrors(data.errors as Record<string, string>);
        toast({
          title: "Ma'lumotlarda xatolik bor",
          description: "Iltimos, qadamlarni qayta tekshiring.",
          variant: 'error',
        });
        setSubmitting(false);
        return;
      }

      throw new Error(data?.message ?? 'server-error');
    } catch {
      // Tarmoq yoki server xatosi — anketani yo'qotmaslik uchun navbatga saqlaymiz
      const queued = enqueue(payload);

      if (!queued) {
        // Kompyuter xotirasiga ham saqlab bo'lmadi. Bu holatda o'quvchiga
        // "saqlandi" deb ko'rsatish yolg'on bo'lardi — rostini aytamiz va
        // uni oxirgi qadamda qoldiramiz, qayta urinishi mumkin.
        toast({
          title: "Anketani saqlab bo'lmadi",
          description:
            "Internet ham, kompyuter xotirasi ham ishlamayapti. Iltimos, o'qituvchingizga murojaat qiling.",
          variant: 'error',
        });
        setSubmitting(false);
        return;
      }

      setPendingCount(queueSize());
      setSavedOffline(true);
      setStep(6);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Tabrik ekrani ----------
  if (step === 6) {
    return (
      <SuccessScreen
        firstName={form.firstName}
        dreamJob={form.dreamJob}
        jobCategory={form.jobCategory}
        savedOffline={savedOffline}
        onReset={resetAll}
      />
    );
  }

  // ---------- Kutib olish ekrani (kiosk boshlanishi) ----------
  if (step === 0) {
    return <WelcomeScreen onStart={() => setStep(1)} pendingCount={pendingCount} />;
  }

  // ---------- Anketa qadamlari ----------
  const current = STEPS[step - 1];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
      {/* Qadam ko'rsatkichi */}
      <div className="mb-7">
        <StepNodes current={step} total={STEPS.length} labels={STEP_LABELS} />

        <div className="mt-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            {step}-qadam / {STEPS.length}
          </p>
          <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {current.title}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">{current.subtitle}</p>
        </div>
      </div>

      {/* Oflayn ogohlantirishi */}
      {!isOnline && (
        <div className="mb-6 flex items-center gap-2 rounded-md border border-warn/40 bg-warn-bg px-4 py-3 text-sm font-medium text-warn">
          <WifiOff className="h-4 w-4 shrink-0" />
          Internet aloqasi yo&apos;q. Xavotir olma — anketang saqlanadi va aloqa
          tiklanganda yuboriladi.
        </div>
      )}

      {/* Qadam kontenti */}
      <div className="glass rounded-lg p-4 sm:p-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 1 && (
              <StepPersonal
                form={form}
                errors={errors}
                update={update}
                mahallalar={mahallalar}
                maktablar={maktablar}
              />
            )}
            {step === 2 && <StepInterests form={form} errors={errors} update={update} />}
            {step === 3 && (
              <StepDreamJob form={form} errors={errors} update={update} kasblar={kasblar} />
            )}
            {step === 4 && <StepCenter form={form} errors={errors} update={update} />}
            {step === 5 && <StepFuture form={form} errors={errors} update={update} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigatsiya tugmalari */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <Button variant="outline" size="lg" onClick={goBack} disabled={submitting}>
          <ArrowLeft className="h-4 w-4" />
          Orqaga
        </Button>

        {step < STEPS.length ? (
          <Button size="lg" onClick={goNext} className="px-8">
            Davom etish
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="lg"
            variant="success"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Yuborilmoqda...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Anketani yuborish
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
