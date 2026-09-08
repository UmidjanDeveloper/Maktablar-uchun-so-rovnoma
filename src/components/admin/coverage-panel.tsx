'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, School, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate, searchKey } from '@/lib/utils';
import type { DashboardStats } from '@/types';

interface CoveragePanelProps {
  stats: DashboardStats | null;
  loading: boolean;
}

type Korinish = 'yubormagan' | 'hammasi';

/**
 * «Maktablar qamrovi» paneli.
 *
 * Qolgan panellar KELGAN javoblarni tahlil qiladi. Bu panel esa
 * aksincha — KELMAGAN javoblarni ko'rsatadi: qaysi maktab
 * so'rovnomani umuman o'tkazmadi va qaysi biri nechta o'quvchi bilan
 * qatnashdi. Hokimiyat maktabdan aynan shu raqam bilan hisobot
 * so'raydi.
 *
 * MUHIM: bu panel yuqoridagi filtrlarga BOG'LIQ EMAS. Sabab oddiy:
 * masalan 9-sinf filtri qo'yilganda faqat 5-8-sinflari bor maktab
 * ham "to'ldirmagan" bo'lib ko'rinardi va maktabga noo'rin tanbeh
 * berilardi.
 */
export function CoveragePanel({ stats, loading }: CoveragePanelProps) {
  const [korinish, setKorinish] = useState<Korinish>('yubormagan');
  const [qidiruv, setQidiruv] = useState('');

  const coverage = stats?.coverage;

  const rows = useMemo(() => {
    if (!coverage) return [];
    let list = coverage.schools;
    if (korinish === 'yubormagan') list = list.filter((s) => s.count === 0);

    const q = searchKey(qidiruv);
    if (q.length >= 1) list = list.filter((s) => searchKey(s.name).includes(q));

    return list;
  }, [coverage, korinish, qidiruv]);

  if (loading && !stats) return <Skeleton className="h-72" />;
  if (!coverage) return null;

  const foiz =
    coverage.totalSchools > 0
      ? Math.round((coverage.activeSchools / coverage.totalSchools) * 100)
      : 0;

  /** Ro'yxatda yo'q nom bilan kelgan anketalar bormi */
  const notoliq = coverage.schools.filter((s) => !s.inCatalog);

  return (
    <section className="glass rounded-lg p-4 sm:p-5">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-accent/40 bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-accent">
            <School className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </span>
          <div>
            <h2 className="font-display text-base font-semibold tracking-tight text-ink">
              Maktablar qamrovi
            </h2>
            <p className="text-xs text-ink-faint">
              Qaysi maktab qatnashdi, qaysi biri umuman to&apos;ldirmadi —
              butun tuman bo&apos;yicha, filtrlarga bog&apos;liq emas
            </p>
          </div>
        </div>
      </header>

      {/* Umumiy holat */}
      <div className="mb-4 rounded-md border border-line bg-surface p-3.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-sm text-ink">
            <span className="font-display text-lg font-bold tabular-nums text-ink">
              {coverage.totalSchools}
            </span>{' '}
            ta maktabdan{' '}
            <span className="font-display text-lg font-bold tabular-nums text-ok">
              {coverage.activeSchools}
            </span>{' '}
            tasi qatnashdi &middot;{' '}
            <span className="font-display text-lg font-bold tabular-nums text-danger">
              {coverage.silentSchools}
            </span>{' '}
            tasi umuman to&apos;ldirmadi
          </p>
          <span className="font-mono text-xs font-semibold tabular-nums text-ink-faint">
            {foiz}%
          </span>
        </div>

        <div
          className="mt-2.5 h-2 overflow-hidden rounded-full bg-surface-strong"
          role="progressbar"
          aria-valuenow={foiz}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Qatnashgan maktablar ulushi"
        >
          <div
            className="h-full rounded-full bg-ok transition-[width] duration-500"
            style={{ width: `${foiz}%` }}
          />
        </div>

        <p className="mt-2.5 text-xs text-ink-faint">
          Jami {coverage.totalStudents.toLocaleString('uz-UZ')} ta anketa
          {coverage.activeSchools > 0 && (
            <>
              {' '}
              &middot; qatnashgan maktabda o&apos;rtacha{' '}
              {Math.round(coverage.totalStudents / coverage.activeSchools)} tadan
            </>
          )}
        </p>
      </div>

      {/* Umuman anketa kelmagan mahallalar */}
      {coverage.silentMahallas.length > 0 && (
        <div className="mb-4 flex items-start gap-2.5 rounded-md border border-warn/40 bg-warn-bg p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
          <p className="text-[13px] leading-relaxed text-ink-muted">
            <strong className="font-semibold text-ink">
              {coverage.silentMahallas.length} ta mahalladan
            </strong>{' '}
            umuman anketa kelmagan: {coverage.silentMahallas.slice(0, 10).join(', ')}
            {coverage.silentMahallas.length > 10 && ' va boshqalar'}
          </p>
        </div>
      )}

      {/* Katalogda yo'q nomlar */}
      {notoliq.length > 0 && (
        <div className="mb-4 flex items-start gap-2.5 rounded-md border border-line bg-surface p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" />
          <p className="text-[13px] leading-relaxed text-ink-muted">
            {notoliq.length} ta anketada maktab nomi ro&apos;yxatdan tashqari
            yozilgan. Ular quyida{' '}
            <Badge variant="outline" className="mx-0.5 inline-flex">
              ro&apos;yxatda yo&apos;q
            </Badge>{' '}
            belgisi bilan turibdi — Sozlamalar bo&apos;limida katalogga
            qo&apos;shsangiz, hisob to&apos;g&apos;rilanadi.
          </p>
        </div>
      )}

      {/* Qidiruv va ko'rinish */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <Input
            value={qidiruv}
            onChange={(e) => setQidiruv(e.target.value)}
            placeholder="Maktab nomi yoki raqami"
            aria-label="Maktablar orasidan qidirish"
            className="h-11 pl-10 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { k: 'yubormagan' as const, label: "To'ldirmagan", soni: coverage.silentSchools },
              { k: 'hammasi' as const, label: 'Hammasi', soni: coverage.schools.length },
            ]
          ).map((t) => (
            <button
              key={t.k}
              type="button"
              onClick={() => setKorinish(t.k)}
              aria-pressed={korinish === t.k}
              className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
                korinish === t.k
                  ? 'border-accent bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-ink'
                  : 'border-line text-ink-faint hover:border-line-strong hover:text-ink'
              }`}
            >
              {t.label}
              <span className="font-mono text-[11px] tabular-nums opacity-70">{t.soni}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[520px] overflow-auto rounded-md border border-line">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-surface-solid">
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Maktab</TableHead>
              <TableHead className="w-28">Anketalar</TableHead>
              <TableHead className="w-44">Oxirgi anketa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-sm text-ink-faint">
                  {qidiruv
                    ? `«${qidiruv}» bo'yicha maktab topilmadi`
                    : 'Barcha maktablar so\'rovnomada qatnashgan'}
                </TableCell>
              </TableRow>
            )}
            {rows.map((s, i) => (
              <TableRow key={`${s.name}-${i}`}>
                <TableCell className="font-mono text-xs tabular-nums text-ink-faint">
                  {i + 1}
                </TableCell>
                <TableCell className="font-medium">
                  {s.name}
                  {!s.inCatalog && (
                    <Badge variant="outline" className="ml-2">
                      ro&apos;yxatda yo&apos;q
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {s.count === 0 ? (
                    <Badge variant="warning">to&apos;ldirmagan</Badge>
                  ) : (
                    <span className="flex items-center gap-1.5 font-mono font-semibold tabular-nums text-ink">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-ok" />
                      {s.count}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-[13px] text-ink-muted">
                  {s.lastAt ? formatDate(s.lastAt) : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
