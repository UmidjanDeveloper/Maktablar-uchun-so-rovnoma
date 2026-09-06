'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Home, MapPin, School } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EntityIcon } from '@/lib/icons';
import { MIN_GROUP, unservedPercent, type CenterOption } from '@/lib/center-planning';
import { cn } from '@/lib/utils';
import type { DashboardStats } from '@/types';

interface CenterPanelProps {
  stats: DashboardStats | null;
  loading: boolean;
}

/** Guruh to'lish holatiga qarab belgi */
const VIABILITY: Record<
  CenterOption['viability'],
  { label: string; variant: 'success' | 'warning' | 'secondary' }
> = {
  viable: { label: 'Guruh to’ladi', variant: 'success' },
  close: { label: 'Biroz yetmaydi', variant: 'warning' },
  weak: { label: 'Hozircha kam', variant: 'secondary' },
};

const TABS = [
  { key: 'mahalla', label: 'Mahallada', icon: MapPin, hint: "«Faqat maktabimda» deganlar hisobga olinmagan" },
  { key: 'maktab', label: 'Maktab qoshida', icon: School, hint: "Har bir o'quvchi o'z maktabiga bora oladi" },
  { key: 'tuman', label: 'Tuman markazida', icon: Building2, hint: 'Faqat shu masofaga tayyor deganlar' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

/**
 * «Qayerda markaz ochamiz?» paneli.
 *
 * Diagrammalar «nima bo'lyapti» degan savolga javob beradi, bu panel
 * esa «qayerga qancha pul qo'yamiz» degan savolga. Shuning uchun u
 * eng yuqorida turadi va bitta aniq raqamga tayanadi: bitta joyda
 * AYNAN BIR XIL kursni xohlagan o'quvchilar soni. Kurs guruh
 * to'lmasa ishlamaydi, shuning uchun qiziqish emas, guruh hajmi
 * o'lchanadi.
 */
export function CenterPanel({ stats, loading }: CenterPanelProps) {
  const [tab, setTab] = useState<TabKey>('mahalla');

  if (loading && !stats) return <Skeleton className="h-72" />;
  if (!stats) return null;

  const plan = stats.centerPlan;

  // Yangi savollar hali javobsiz — eski anketalar bilan tahlil qilib bo'lmaydi
  if (plan.answered === 0) {
    return (
      <section className="glass rounded-lg p-5">
        <header className="mb-3 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-accent/35 bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-accent">
            <Home className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </span>
          <h2 className="font-display text-base font-semibold tracking-tight text-ink">
            Ta&apos;lim markazi ochish tahlili
          </h2>
        </header>
        <p className="text-sm leading-relaxed text-ink-muted">
          Bu tahlil anketaning 4-qadamidagi javoblarga tayanadi. Tanlangan
          filtrlar bo&apos;yicha hali birorta o&apos;quvchi bu savollarga javob
          bermagan — yangi anketalar to&apos;plangach, bu yerda qayerda va qanday
          markaz ochish kerakligi ko&apos;rsatiladi.
        </p>
      </section>
    );
  }

  const options: CenterOption[] =
    tab === 'mahalla'
      ? plan.byMahalla.slice(0, 12)
      : tab === 'maktab'
        ? plan.bySchool.slice(0, 12)
        : plan.district
          ? [plan.district]
          : [];

  const active = TABS.find((t) => t.key === tab)!;
  const viableCount = plan.byMahalla.filter((o) => o.viability === 'viable').length;

  return (
    <section className="glass rounded-lg p-4 sm:p-5">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-accent/35 bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-accent">
            <Home className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </span>
          <div>
            <h2 className="font-display text-base font-semibold tracking-tight text-ink">
              Ta&apos;lim markazi ochish tahlili
            </h2>
            <p className="text-xs text-ink-faint">
              <span className="font-mono tabular-nums">{plan.answered}</span> ta
              o&apos;quvchi javobi asosida · guruh uchun kamida{' '}
              <span className="font-mono tabular-nums">{MIN_GROUP}</span> kishi kerak
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant={viableCount > 0 ? 'success' : 'secondary'}>
            {viableCount} ta mahallada guruh to&apos;ladi
          </Badge>
          <Badge variant="warning">
            {unservedPercent(plan)}% hech qayerga qatnamaydi
          </Badge>
        </div>
      </header>

      {/* Variant tanlash */}
      <div className="mb-1.5 flex flex-wrap gap-1.5">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = t.key === tab;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              aria-pressed={isActive}
              className={cn(
                'flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
                isActive
                  ? 'border-accent bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-ink'
                  : 'border-line text-ink-faint hover:border-line-strong hover:text-ink'
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>
      <p className="mb-3 text-[11px] text-ink-faint">{active.hint}</p>

      {options.length === 0 ? (
        <div className="rounded-md border border-dashed border-line py-10 text-center text-sm text-ink-faint">
          Bu variant bo&apos;yicha yetarli javob yig&apos;ilmagan
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-line">
          <Table>
            <TableHeader className="bg-surface-solid">
              <TableRow>
                <TableHead>Joy</TableHead>
                <TableHead>Eng ko&apos;p so&apos;ralgan kurslar</TableHead>
                <TableHead className="w-24 text-right">Guruh</TableHead>
                <TableHead className="w-28 text-right">To&apos;garaksiz</TableHead>
                <TableHead className="w-36">Qulay vaqt</TableHead>
                <TableHead className="w-32">Holat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {options.map((option, index) => (
                <motion.tr
                  key={option.location}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.2) }}
                  className="border-b border-line transition-colors last:border-0 hover:bg-surface/80"
                >
                  <TableCell className="font-medium">
                    {option.location}
                    <span className="mt-0.5 block font-mono text-[11px] tabular-nums text-ink-faint">
                      {option.reachable} ta o&apos;quvchi keladi
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {option.courses.map((course) => (
                        <span key={course.name} className="flex items-center gap-2 text-[13px]">
                          <EntityIcon
                            name={course.name}
                            className="h-3.5 w-3.5 shrink-0 text-accent"
                          />
                          <span className="text-ink-muted">{course.name}</span>
                          <span className="font-mono text-[11px] tabular-nums text-ink-faint">
                            {course.count}
                          </span>
                        </span>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="text-right font-mono text-base font-semibold tabular-nums text-ink">
                    {option.topDemand}
                  </TableCell>

                  <TableCell className="text-right font-mono tabular-nums text-ink-muted">
                    {option.unservedShare}%
                  </TableCell>

                  <TableCell className="text-[13px] text-ink-muted">
                    {option.bestTime ?? '—'}
                  </TableCell>

                  <TableCell>
                    <Badge variant={VIABILITY[option.viability].variant}>
                      {VIABILITY[option.viability].label}
                    </Badge>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Til talabi — til markazi uchun alohida */}
      {plan.languageDemand.length > 0 && (
        <div className="mt-4 rounded-md border border-line bg-surface p-3.5">
          <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
            Qaysi til so&apos;ralmoqda
          </p>
          <div className="flex flex-wrap gap-2">
            {plan.languageDemand.slice(0, 8).map((lang) => (
              <span
                key={lang.name}
                className="flex items-center gap-2 rounded-sm border border-line px-2.5 py-1.5 text-[13px] text-ink-muted"
              >
                <EntityIcon name={lang.name} className="h-3.5 w-3.5 text-accent" />
                {lang.name}
                <span className="font-mono text-[11px] font-semibold tabular-nums text-ink">
                  {lang.count}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* To'siqlar — markaz ochish muammoni yechadimi? */}
      {plan.barriers.length > 0 && (
        <div className="mt-3 rounded-md border border-line bg-surface p-3.5">
          <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
            Hozir nega qatnashmaydi
          </p>
          <ul className="space-y-1.5">
            {plan.barriers.map((barrier) => (
              <li key={barrier.name} className="flex items-center gap-2 text-[13px]">
                <EntityIcon name={barrier.name} className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
                <span className="min-w-0 flex-1 truncate text-ink-muted">{barrier.name}</span>
                <span className="font-mono text-[11px] font-semibold tabular-nums text-ink">
                  {barrier.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
