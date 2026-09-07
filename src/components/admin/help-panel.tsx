'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  HeartHandshake,
  Phone,
  RefreshCw,
  RotateCcw,
  Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import { EntityIcon } from '@/lib/icons';
import { YORDAM_TOSIQLARI } from '@/lib/constants';
import { formatDate, formatPhone } from '@/lib/utils';

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
  helpResolved: boolean;
  helpResolvedAt: string | null;
}

interface Javob {
  items: Row[];
  total: number;
  needHelp: number;
  resolved: number;
  pending: number;
  byBarrier: { name: string; count: number; resolved: number }[];
}

const YORDAM = new Set<string>(YORDAM_TOSIQLARI as readonly string[]);

/** Ko'rinishlar: qaysi o'quvchilar ro'yxatda chiqadi */
type Korinish = 'kutmoqda' | 'hal' | 'hammasi';

const KORINISHLAR: { k: Korinish; label: string }[] = [
  { k: 'kutmoqda', label: 'Kutmoqda' },
  { k: 'hal', label: 'Hal qilindi' },
  { k: 'hammasi', label: 'Hammasi' },
];

/**
 * Qidiruv uchun matnni soddalashtiradi.
 *
 * O'zbekchada apostrofning bir nechta ko'rinishi bor va telefon
 * raqami turlicha yoziladi — «G'ayrat» deb qidirgan xodim «Gayrat»
 * yozganda ham topishi, «90 123» deb qidirganda ham topishi kerak.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘ʻʼ`´']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * «Yordam kerak bo'lgan o'quvchilar» paneli.
 *
 * Qolgan paneller umumlashtiradi — bu panel aksincha, aniq bolani
 * ko'rsatadi. Chunki "27 ta o'quvchining oilaviy sharoiti yo'q" degan
 * raqamdan hech kimga foyda yo'q: yordam berish uchun o'sha 27 tasining
 * ismi, maktabi, sinfi va ota-onasining telefoni kerak.
 *
 * Ro'yxat uzayib ketganda ikkita narsa qutqaradi:
 *   - QIDIRUV — ism, maktab, mahalla yoki raqam bo'yicha;
 *   - «HAL QILINDI» — ish bitgan yozuv ro'yxatdan chiqib, faqat
 *     kutayotganlar qoladi. Yozuv o'chirilmaydi, shunchaki holati
 *     o'zgaradi, shuning uchun hisobotda "shuncha edi, shunchasi
 *     hal qilindi" degan qatorni chiqarish mumkin.
 */
export function HelpPanel() {
  const { toast } = useToast();
  const [data, setData] = useState<Javob | null>(null);
  const [loading, setLoading] = useState(true);
  const [korinish, setKorinish] = useState<Korinish>('kutmoqda');
  const [qidiruv, setQidiruv] = useState('');
  /** Ayni damda saqlanayotgan yozuv — tugma ikki marta bosilmasligi uchun */
  const [saqlanmoqda, setSaqlanmoqda] = useState<string | null>(null);

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

  /** Holatni o'zgartirish — ekranda darhol, bazada esa fonda */
  const holatniOzgartir = useCallback(
    async (row: Row, resolved: boolean) => {
      setSaqlanmoqda(row.id);
      try {
        const res = await fetch('/api/admin/yordam', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: row.id, resolved }),
        });
        if (!res.ok) throw new Error('patch');
        const saqlangan = (await res.json()) as {
          helpResolved: boolean;
          helpResolvedAt: string | null;
        };

        setData((oldin) => {
          if (!oldin) return oldin;
          const items = oldin.items.map((i) =>
            i.id === row.id
              ? {
                  ...i,
                  helpResolved: saqlangan.helpResolved,
                  helpResolvedAt: saqlangan.helpResolvedAt,
                }
              : i
          );
          // Hisoblagichlarni qayta sanaymiz — sahifani yangilash shart emas
          const aralashuv = items.filter((i) => i.needsHelp);
          const byBarrier = oldin.byBarrier.map((b) => ({
            ...b,
            resolved: items.filter(
              (i) => i.helpResolved && i.barriers.includes(b.name)
            ).length,
          }));
          return {
            ...oldin,
            items,
            byBarrier,
            resolved: aralashuv.filter((i) => i.helpResolved).length,
            pending: aralashuv.filter((i) => !i.helpResolved).length,
          };
        });

        toast({
          title: resolved
            ? `${row.firstName} ${row.lastName} — hal qilindi`
            : 'Yana kutayotganlar ro\'yxatiga qaytarildi',
          variant: resolved ? 'success' : 'info',
        });
      } catch {
        toast({ title: "Holatni saqlab bo'lmadi", variant: 'error' });
      } finally {
        setSaqlanmoqda(null);
      }
    },
    [toast]
  );

  const rows = useMemo(() => {
    if (!data) return [];

    // Bu panel hokimiyat aralashuvi kerak bo'lganlar uchun
    let list = data.items.filter((r) => r.needsHelp);

    if (korinish === 'kutmoqda') list = list.filter((r) => !r.helpResolved);
    else if (korinish === 'hal') list = list.filter((r) => r.helpResolved);

    const q = normalize(qidiruv);
    if (q) {
      list = list.filter((r) => {
        const haystack = normalize(
          [
            r.firstName,
            r.lastName,
            r.school,
            r.mahalla,
            `${r.grade}-sinf`,
            r.parentPhone ?? '',
            r.phone ?? '',
            r.barriers.join(' '),
          ].join(' ')
        );
        // Raqam qidirilsa bo'shliqlarni ham e'tiborsiz qoldiramiz
        return haystack.includes(q) || haystack.replace(/\s/g, '').includes(q.replace(/\s/g, ''));
      });
    }

    return list;
  }, [data, korinish, qidiruv]);

  if (loading) return <Skeleton className="h-64" />;
  if (!data) return null;

  if (data.needHelp === 0) {
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
          Hokimiyat aralashuvi talab qiladigan o&apos;quvchi topilmadi.
        </p>
      </section>
    );
  }

  const foiz = data.needHelp > 0 ? Math.round((data.resolved / data.needHelp) * 100) : 0;

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

        <Button variant="ghost" size="sm" onClick={() => void load()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </header>

      {/* ── Ish holati: shuncha edi, shunchasi hal qilindi ── */}
      <div className="mb-4 rounded-md border border-line bg-surface p-3.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-sm text-ink">
            <span className="font-display text-lg font-bold tabular-nums text-ink">
              {data.needHelp}
            </span>{' '}
            ta muammo aniqlandi &middot;{' '}
            <span className="font-display text-lg font-bold tabular-nums text-ok">
              {data.resolved}
            </span>{' '}
            tasi hal qilindi &middot;{' '}
            <span className="font-display text-lg font-bold tabular-nums text-warn">
              {data.pending}
            </span>{' '}
            tasi kutmoqda
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
          aria-label="Hal qilingan muammolar ulushi"
        >
          <div
            className="h-full rounded-full bg-ok transition-[width] duration-500"
            style={{ width: `${foiz}%` }}
          />
        </div>
      </div>

      {/* Sabablar bo'yicha yig'indi — «hal qilingan / jami» ko'rinishida */}
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
              {b.resolved}/{b.count}
            </span>
          </span>
        ))}
      </div>

      {/* ── Qidiruv va ko'rinish ── */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <Input
            value={qidiruv}
            onChange={(e) => setQidiruv(e.target.value)}
            placeholder="Ism, familiya, maktab, mahalla yoki telefon raqami"
            aria-label="Yordam kerak bo'lgan o'quvchilar orasidan qidirish"
            className="h-11 pl-10 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {KORINISHLAR.map((t) => {
            const soni =
              t.k === 'kutmoqda'
                ? data.pending
                : t.k === 'hal'
                  ? data.resolved
                  : data.needHelp;
            return (
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
                <span className="font-mono text-[11px] tabular-nums opacity-70">{soni}</span>
              </button>
            );
          })}
        </div>
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
              <TableHead className="w-48">Bog&apos;lanish</TableHead>
              <TableHead className="w-40">Holat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-ink-faint">
                  {qidiruv
                    ? `«${qidiruv}» bo'yicha o'quvchi topilmadi`
                    : korinish === 'kutmoqda'
                      ? "Kutayotgan muammo qolmadi — hammasi hal qilingan"
                      : "Bu shart bo'yicha o'quvchi topilmadi"}
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id} className={r.helpResolved ? 'opacity-60' : undefined}>
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
                      className="flex items-center gap-1.5 whitespace-nowrap rounded-sm font-mono text-[13px] tabular-nums text-accent hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      {formatPhone(r.parentPhone)}
                    </a>
                  ) : (
                    <span className="text-ink-faint">—</span>
                  )}
                  {r.phone && (
                    <span className="mt-0.5 block whitespace-nowrap font-mono text-[11px] tabular-nums text-ink-faint">
                      {formatPhone(r.phone)} (o&apos;zi)
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {r.helpResolved ? (
                    <div className="space-y-1">
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Hal qilindi
                      </Badge>
                      {r.helpResolvedAt && (
                        <span className="block font-mono text-[10px] tabular-nums text-ink-faint">
                          {formatDate(r.helpResolvedAt)}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => void holatniOzgartir(r, false)}
                        disabled={saqlanmoqda === r.id}
                        className="flex items-center gap-1 rounded-sm text-[11px] text-ink-faint underline-offset-2 hover:text-ink hover:underline disabled:opacity-50"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Qaytarish
                      </button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => void holatniOzgartir(r, true)}
                      disabled={saqlanmoqda === r.id}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Hal qilindi
                    </Button>
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
