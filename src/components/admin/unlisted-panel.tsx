'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, PencilLine, Plus, RefreshCw } from 'lucide-react';
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

  /**
   * Qo'lda yozilgan nomni katalogdagi mavjud nomga birlashtiradi.
   *
   * "navruz" ni katalogga QO'SHISH xato bo'lardi: katalogda
   * "Navro'z" allaqachon bor va ikkitasi bitta mahalla. To'g'ri
   * amal — anketalarni mavjud nomga ko'chirish.
   */
  const merge = async (
    kind: 'mahallalar' | 'maktablar',
    from: string,
    to: string
  ) => {
    setBusy(`${kind}:${from}`);
    try {
      const res = await fetch('/api/admin/unlisted', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: kind === 'mahallalar' ? 'mahalla' : 'school',
          from,
          to,
        }),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast({ title: body?.message ?? "Birlashtirib bo'lmadi", variant: 'error' });
        return;
      }

      toast({
        title: `«${from}» -> «${to}»`,
        description: `${body?.moved ?? 0} ta anketa ko'chirildi`,
        variant: 'success',
      });
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
    <section className="glass rounded-lg">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-warn/40 bg-warn-bg text-warn">
            <PencilLine className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </span>
          <div>
            <h2 className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-ink">
              Qo&apos;lda kiritilgan nomlar
              {total > 0 && <Badge variant="warning">{total} ta</Badge>}
            </h2>
            <p className="text-xs text-ink-faint">
              O&apos;quvchilar ro&apos;yxatdan topa olmay, o&apos;zi yozgan mahalla va
              maktablar
            </p>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={() => void load()}>
          <RefreshCw className="h-4 w-4" />
          Yangilash
        </Button>
      </header>

      {total === 0 ? (
        <div className="flex items-center justify-center gap-2 p-8 text-sm text-ink-muted">
          <CheckCircle2 className="h-5 w-5 text-ok" />
          Barcha anketalar katalogdagi nomlar bilan to&apos;ldirilgan
        </div>
      ) : (
        <div className="divide-y divide-line">
          {(['mahallalar', 'maktablar'] as const).map((kind) => {
            const items = data?.[kind] ?? [];
            if (items.length === 0) return null;

            return (
              <div key={kind} className="p-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                  {kind === 'mahallalar' ? 'Mahallalar' : 'Maktablar'}
                </p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={item.name}
                      className="flex flex-wrap items-center gap-2 rounded-md border border-line bg-surface p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-semibold text-ink">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-faint">
                          <span className="font-mono tabular-nums">{item.count}</span> ta anketada
                          ishlatilgan
                          {item.suggestion && (
                            <>
                              {' · '}
                              <span className="text-warn">
                                katalogdagi o&apos;xshash nom: «{item.suggestion}»
                              </span>
                            </>
                          )}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        {/*
                          Taklif bor bo'lsa — birlashtirish ASOSIY amal.
                          Bunday yozuvlarning aksariyati katalogdagi
                          nomning boshqacha yozilishi, ya'ni ularni
                          katalogga qo'shish nusxa yaratardi.
                        */}
                        {item.suggestion && (
                          <Button
                            size="sm"
                            disabled={busy === `${kind}:${item.name}`}
                            onClick={() => merge(kind, item.name, item.suggestion as string)}
                          >
                            {busy === `${kind}:${item.name}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ArrowRight className="h-4 w-4" />
                            )}
                            «{item.suggestion}» ga birlashtirish
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy === `${kind}:${item.name}`}
                          onClick={() => addToCatalog(kind, item.name)}
                        >
                          {busy === `${kind}:${item.name}` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          Yangi deb qo&apos;shish
                        </Button>
                      </div>
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
