'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Loader2, PencilLine, Plus, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';

interface UnlistedValue {
  name: string;
  count: number;
  suggestion: string | null;
}

interface UnlistedResponse {
  mahallalar: UnlistedValue[];
  maktablar: UnlistedValue[];
}

interface UnlistedPanelProps {
  /** Kataloglar o'zgargach ro'yxatlarni yangilash uchun */
  onCatalogChange?: () => void;
}

/**
 * "Ro'yxatdan tashqari kiritilgan nomlar" paneli.
 *
 * Anketada o'quvchi mahalla yoki maktabini ro'yxatdan topa olmasa,
 * nomini qo'lda yozishi mumkin. Bu foydali, lekin nazoratsiz qolsa
 * ma'lumot parchalanadi: "7-maktab", "7 maktab", "7-sonli maktab"
 * uchta alohida qiymat bo'lib qoladi va hokimning tahlili buziladi.
 *
 * Shu sababli qo'lda kiritilgan har bir yangi nom shu yerda ko'rinadi
 * va admin uni katalogga qo'shishi (yoki e'tiborsiz qoldirishi) mumkin.
 */
export function UnlistedPanel({ onCatalogChange }: UnlistedPanelProps) {
  const { toast } = useToast();
  const [data, setData] = useState<UnlistedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/unlisted');
      if (!res.ok) throw new Error('load');
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

  /** Qo'lda kiritilgan nomni tegishli katalogga qo'shadi */
  const addToCatalog = async (kind: 'mahallalar' | 'maktablar', name: string) => {
    setBusy(`${kind}:${name}`);
    try {
      const res = await fetch(`/api/admin/${kind}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast({ title: body?.message ?? "Qo'shib bo'lmadi", variant: 'error' });
        return;
      }

      toast({ title: `«${name}» katalogga qo'shildi`, variant: 'success' });
      await load();
      onCatalogChange?.();
    } catch {
      toast({ title: "Serverga ulanib bo'lmadi", variant: 'error' });
    } finally {
      setBusy(null);
    }
  };

  const total = (data?.mahallalar.length ?? 0) + (data?.maktablar.length ?? 0);

  if (loading) return <Skeleton className="h-40" />;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white shadow-soft">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
            <PencilLine className="h-5 w-5 text-amber-600" />
          </span>
          <div>
            <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900">
              Qo&apos;lda kiritilgan nomlar
              {total > 0 && <Badge variant="warning">{total} ta</Badge>}
            </h2>
            <p className="text-xs text-slate-500">
              O&apos;quvchilar ro&apos;yxatdan topa olmay, o&apos;zi yozgan mahalla va
              maktablar
            </p>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={() => void load()} className="text-slate-500">
          <RefreshCw className="h-4 w-4" />
          Yangilash
        </Button>
      </header>

      {total === 0 ? (
        <div className="flex items-center justify-center gap-2 p-8 text-sm text-slate-500">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          Barcha anketalar katalogdagi nomlar bilan to&apos;ldirilgan
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {(['mahallalar', 'maktablar'] as const).map((kind) => {
            const items = data?.[kind] ?? [];
            if (items.length === 0) return null;

            return (
              <div key={kind} className="p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  {kind === 'mahallalar' ? 'Mahallalar' : 'Maktablar'}
                </p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={item.name}
                      className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {item.count} ta anketada ishlatilgan
                          {item.suggestion && (
                            <>
                              {' · '}
                              <span className="text-amber-700">
                                katalogdagi o&apos;xshash nom: «{item.suggestion}»
                              </span>
                            </>
                          )}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0"
                        disabled={busy === `${kind}:${item.name}`}
                        onClick={() => addToCatalog(kind, item.name)}
                      >
                        {busy === `${kind}:${item.name}` ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        Katalogga qo&apos;shish
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
