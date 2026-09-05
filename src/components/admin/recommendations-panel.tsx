'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { buildRecommendations, PRIORITY_LABELS, type RecommendationPriority } from '@/lib/recommendations';
import { cn } from '@/lib/utils';
import type { DashboardStats } from '@/types';

/** Muhimlik darajasiga qarab ranglar */
const PRIORITY_STYLES: Record<
  RecommendationPriority,
  { bar: string; badge: 'default' | 'warning' | 'secondary' }
> = {
  high: { bar: 'bg-danger', badge: 'warning' },
  medium: { bar: 'bg-warn', badge: 'warning' },
  info: { bar: 'bg-line-strong', badge: 'secondary' },
};

/** Boshida ko'rsatiladigan tavsiyalar soni */
const INITIAL_COUNT = 4;

interface RecommendationsPanelProps {
  stats: DashboardStats | null;
  loading: boolean;
}

/**
 * Tavsiyalar paneli — tahlil panelining eng muhim qismi.
 *
 * Diagrammalar "nima bo'lyapti" degan savolga javob beradi,
 * bu panel esa "endi nima qilish kerak" degan savolga.
 * Har bir tavsiya raqamli dalil bilan birga ko'rsatiladi.
 */
export function RecommendationsPanel({ stats, loading }: RecommendationsPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const recommendations = useMemo(
    () => (stats ? buildRecommendations(stats) : []),
    [stats]
  );

  if (loading && !stats) {
    return <Skeleton className="h-52" />;
  }

  if (!stats || recommendations.length === 0) return null;

  const highCount = recommendations.filter((r) => r.priority === 'high').length;
  const visible = expanded ? recommendations : recommendations.slice(0, INITIAL_COUNT);

  return (
    <section className="glass rounded-lg p-4 sm:p-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-warn/40 bg-warn-bg text-warn">
            <Lightbulb className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </span>
          <div>
            <h2 className="font-display text-base font-semibold tracking-tight text-ink">
              Tavsiyalar
            </h2>
            <p className="text-xs text-ink-faint">
              Filtrlangan ma&apos;lumot asosida avtomatik shakllantirildi
            </p>
          </div>
        </div>

        {highCount > 0 && (
          <Badge variant="warning">{highCount} ta yuqori muhimlikdagi</Badge>
        )}
      </header>

      <ul className="space-y-2.5">
        {visible.map((rec, index) => {
          const style = PRIORITY_STYLES[rec.priority];
          return (
            <motion.li
              key={rec.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: Math.min(index * 0.04, 0.24) }}
              className="flex gap-3 rounded-md border border-line bg-surface p-3.5"
            >
              {/* Muhimlikni bildiruvchi rangli chiziq */}
              <span
                className={cn('mt-0.5 w-1 shrink-0 rounded-full', style.bar)}
                aria-hidden="true"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-display text-sm font-semibold text-ink">{rec.title}</h3>
                  <Badge variant={style.badge} className="shrink-0">
                    {PRIORITY_LABELS[rec.priority]}
                  </Badge>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{rec.action}</p>
                <p className="mt-1.5 font-mono text-[11px] tabular-nums text-ink-faint">
                  Dalil: {rec.evidence}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ul>

      {recommendations.length > INITIAL_COUNT && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 w-full"
          onClick={() => setExpanded((v) => !v)}
        >
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
          />
          {expanded
            ? 'Yig\'ish'
            : `Yana ${recommendations.length - INITIAL_COUNT} ta tavsiyani ko'rish`}
        </Button>
      )}
    </section>
  );
}
