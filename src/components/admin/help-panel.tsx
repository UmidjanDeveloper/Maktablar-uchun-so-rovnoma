'use client';

import { useCallback, useEffect, useState } from 'react';
import { HeartHandshake, Phone, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import { EntityIcon } from '@/lib/icons';
import { YORDAM_TOSIQLARI } from '@/lib/constants';
import { formatPhone } from '@/lib/utils';

interface Row {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  grade: number;
  school: string;
  mahalla: string;
  phone: string | null;
  parentPhone: string | null;
  barriers: string[];
  createdAt: string;
  needsHelp: boolean;
}

interface Javob {
  items: Row[];
  total: number;
  needHelp: number;
  byBarrier: { name: string; count: number }[];
}

const YORDAM = new Set<string>(YORDAM_TOSIQLARI as readonly string[]);

/**
 * «Yordam kerak bo'lgan o'quvchilar» paneli.
 *
 * Qolgan paneller umumlashtiradi — bu panel aksincha, aniq bolani
 * ko'rsatadi. Chunki "27 ta o'quvchining oilaviy sharoiti yo'q" degan
 * raqamdan hech kimga foyda yo'q: yordam berish uchun o'sha 27 tasining
 * ismi, maktabi, sinfi va ota-onasining telefoni kerak.
 *
 * Shu sababli jadval ataylab shaxsiy ma'lumot bilan ko'rsatiladi va
 * faqat boshqaruv panelida, parol ostida ochiladi.
 */
export function HelpPanel() {
  const { toast } = useToast();
  const [data, setData] = useState<Javob | null>(null);
  const [loading, setLoading] = useState(true);
  const [faqatYordam, setFaqatYordam] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/yordam');
      if (!res.ok) throw new Error('yordam');
      setData(await res.json());
    } catch {
      toast({ title: "Ro'yxatni yuklab bo'lmadi", variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <Skeleton className="h-64" />;
  if (!data) return null;

  if (data.total === 0) {
    return (
      <section className="glass rounded-lg p-5">
        <header className="mb-2 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-ok/40 bg-ok-bg text-ok">
            <HeartHandshake className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </span>
          <h2 className="font-display text-base font-semibold tracking-tight text-ink">
            Yordam kerak bo&apos;lgan o&apos;quvchilar
          </h2>
        </header>
        <p className="text-sm text-ink-muted">
          Hozircha to&apos;garakka qatnamayotgan o&apos;quvchi topilmadi.
        </p>
      </section>
    );
  }

  const rows = faqatYordam ? data.items.filter((r) => r.needsHelp) : data.items;

  return (
    <section className="glass rounded-lg p-4 sm:p-5">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-danger/40 bg-danger-bg text-danger">
            <HeartHandshake className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </span>
          <div>
            <h2 className="font-display text-base font-semibold tracking-tight text-ink">
              Yordam kerak bo&apos;lgan o&apos;quvchilar
            </h2>
            <p className="text-xs text-ink-faint">
              To&apos;garakka qatnamaydigan o&apos;quvchilar — sababi va
              bog&apos;lanish uchun raqami bilan
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="warning">
            {data.needHelp} ta aralashuv kerak
          </Badge>
          <Badge variant="secondary">{data.total} ta jami</Badge>
          <Button variant="ghost" size="sm" onClick={() => void load()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Sabablar bo'yicha yig'indi */}
      <div className="mb-4 flex flex-wrap gap-2">
        {data.byBarrier.map((b) => (
          <span
            key={b.name}
            className={`flex items-center gap-2 rounded-sm border px-2.5 py-1.5 text-[13px] ${
              YORDAM.has(b.name)
                ? 'border-danger/40 bg-danger-bg text-danger'
                : 'border-line text-ink-muted'
            }`}
          >
            <EntityIcon name={b.name} className="h-3.5 w-3.5" />
            {b.name}
            <span className="font-mono text-[11px] font-semibold tabular-nums">
              {b.count}
            </span>
          </span>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {[
          { k: true, label: 'Faqat aralashuv kerak bo\'lganlar' },
          { k: false, label: 'Hammasi' },
        ].map((t) => (
          <button
            key={String(t.k)}
            type="button"
            onClick={() => setFaqatYordam(t.k)}
            aria-pressed={faqatYordam === t.k}
            className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
              faqatYordam === t.k
                ? 'border-accent bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-ink'
                : 'border-line text-ink-faint hover:border-line-strong hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-md border border-line">
        <Table>
          <TableHeader className="bg-surface-solid">
            <TableRow>
              <TableHead>O&apos;quvchi</TableHead>
              <TableHead className="w-16">Sinf</TableHead>
              <TableHead>Maktab</TableHead>
              <TableHead>Mahalla</TableHead>
              <TableHead>Sabab</TableHead>
              <TableHead className="w-44">Bog&apos;lanish</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-ink-faint">
                  Bu shart bo&apos;yicha o&apos;quvchi topilmadi
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">
                  {r.firstName} {r.lastName}
                </TableCell>
                <TableCell className="font-mono tabular-nums text-ink-muted">
                  {r.grade}
                </TableCell>
                <TableCell className="text-[13px] text-ink-muted">{r.school}</TableCell>
                <TableCell className="text-[13px] text-ink-muted">{r.mahalla}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {r.barriers.map((b) => (
                      <Badge key={b} variant={YORDAM.has(b) ? 'warning' : 'secondary'}>
                        {b}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {r.parentPhone ? (
                    <a
                      href={`tel:${r.parentPhone}`}
                      className="flex items-center gap-1.5 rounded-sm font-mono text-[13px] tabular-nums text-accent hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      {formatPhone(r.parentPhone)}
                    </a>
                  ) : (
                    <span className="text-ink-faint">—</span>
                  )}
                  {r.phone && (
                    <span className="mt-0.5 block font-mono text-[11px] tabular-nums text-ink-faint">
                      {formatPhone(r.phone)} (o&apos;zi)
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
