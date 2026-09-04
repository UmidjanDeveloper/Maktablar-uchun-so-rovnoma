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
const PRIORITY_STYLES: Record<RecommendationPriority, { bar: string; badge: 'default' | 'warning' | 'secondary' }> = {
  high: { bar: 'bg-red-500', badge: 'warning' },
  medium: { bar: 'bg-amber-500', badge: 'warning' },
  info: { bar: 'bg-slate-300', badge: 'secondary' },
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
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
            <Lightbulb className="h-5 w-5 text-amber-600" />
          </span>
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Tavsiyalar
            </h2>
            <p className="text-xs text-slate-500">
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
              className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5"
            >
              {/* Muhimlikni bildiruvchi rangli chiziq */}
              <span
                className={cn('mt-0.5 w-1 shrink-0 rounded-full', style.bar)}
                aria-hidden="true"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{rec.title}</h3>
                  <Badge variant={style.badge} className="shrink-0">
                    {PRIORITY_LABELS[rec.priority]}
                  </Badge>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{rec.action}</p>
                <p className="mt-1.5 text-xs font-medium text-slate-400">
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
          className="mt-3 w-full text-slate-500"
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
