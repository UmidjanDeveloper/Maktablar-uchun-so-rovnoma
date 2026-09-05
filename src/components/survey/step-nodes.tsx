'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepNodesProps {
  /** Joriy qadam (1 dan boshlanadi) */
  current: number;
  /** Jami qadamlar soni */
  total: number;
  /** Qadamlarning qisqa nomlari — faqat kengroq ekranda ko'rinadi */
  labels: readonly string[];
}

/**
 * Qadam ko'rsatkichi — "circuit" uslubidagi tugunlar zanjiri.
 *
 * Oddiy progress-bar o'rniga har bir qadam alohida tugun sifatida
 * ko'rsatiladi: o'tilgani belgilangan, jorisi porlab turadi, keyingisi
 * so'nik. Shu tarzda o'quvchi qayerdaligini va yana qancha qolganini
 * bir qarashda tushunadi.
 *
 * Mobil (360px) da nomlar yashiriladi, faqat tugunlar qoladi —
 * shunda zanjir siqilib ketmaydi.
 */
export function StepNodes({ current, total, labels }: StepNodesProps) {
  return (
    <nav aria-label="Anketa bosqichlari" className="w-full">
      <ol className="flex items-start">
        {Array.from({ length: total }, (_, i) => {
          const step = i + 1;
          const done = step < current;
          const active = step === current;
          const isLast = step === total;

          return (
            <li
              key={step}
              className={cn('flex min-w-0 items-start', !isLast && 'flex-1')}
              aria-current={active ? 'step' : undefined}
            >
              {/* Tugun */}
              <div className="flex shrink-0 flex-col items-center gap-2">
                <div className="relative flex h-9 w-9 items-center justify-center">
                  {/* Joriy qadam atrofidagi porlash */}
                  {active && (
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{ animation: 'node-pulse 2.4s ease-out infinite' }}
                    />
                  )}

                  <motion.span
                    initial={false}
                    animate={{
                      scale: active ? 1 : 0.86,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                    className={cn(
                      'relative flex h-9 w-9 items-center justify-center rounded-full border text-[13px] font-bold',
                      'font-mono tabular-nums transition-colors duration-300',
                      done && 'border-accent bg-accent-solid text-accent-contrast',
                      active &&
                        'border-accent bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-ink shadow-glow',
                      !done && !active && 'border-line bg-surface text-ink-faint'
                    )}
                  >
                    {done ? <Check className="h-4 w-4 stroke-[3]" /> : step}
                  </motion.span>
                </div>

                {/* Nom — mobilda yashirin */}
                <span
                  className={cn(
                    'hidden max-w-[9rem] text-center text-[11px] font-medium leading-tight sm:block',
                    active ? 'text-ink' : 'text-ink-faint'
                  )}
                >
                  {labels[i]}
                </span>
              </div>

              {/* Bog'lovchi chiziq */}
              {!isLast && (
                <div className="mt-[18px] h-[2px] flex-1 overflow-hidden rounded-full bg-line">
                  <motion.div
                    initial={false}
                    animate={{ scaleX: done ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    style={{ originX: 0 }}
                    className="h-full w-full bg-[linear-gradient(90deg,var(--accent-solid),var(--accent-3))]"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
