'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus, Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchableSelect } from '@/components/shared/searchable-select';
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

type Kind = 'mahallalar' | 'maktablar';

/**
 * "Ro'yxatga tushmagan nomlar" paneli — VAQTINCHA.
 *
 * Anketada mahalla va maktabni qo'lda yozish yopildi, ya'ni yangi
 * bunday nom paydo bo'lmaydi. Lekin yopilgunga qadar bazada 41 ta
 * to'plangan edi ("navruz", "Sangijumon", "mirzo ulug`bek") va
 * ularning har biri hisobotda alohida mahalla bo'lib ko'rinardi.
 *
 * Panel aynan shu qoldiqni tozalash uchun turibdi va tozalanib
 * bo'lgach O'ZI YO'QOLADI (`null` qaytaradi). Ya'ni hokim boshqaruv
 * panelida bu bo'limni umuman ko'rmaydi.
 */
export function UnlistedPanel({ onCatalogChange }: UnlistedPanelProps) {
  const { toast } = useToast();
  const [data, setData] = useState<UnlistedResponse | null>(null);
  const [katalog, setKatalog] = useState<{ mahallalar: string[]; maktablar: string[] }>({
    mahallalar: [],
    maktablar: [],
  });
  const [tanlov, setTanlov] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [hammasi, setHammasi] = useState(false);

  const load = useCallback(async () => {
    try {
      const [royxat, kat] = await Promise.all([
        fetch('/api/admin/unlisted'),
        fetch('/api/catalogs'),
      ]);
      if (!royxat.ok) throw new Error('load');
      setData(await royxat.json());

      if (kat.ok) {
        const k = await kat.json();
        setKatalog({
          mahallalar: (k.mahallalar ?? []).map((m: { name: string }) => m.name),
          maktablar: (k.maktablar ?? []).map((m: { name: string }) => m.name),
        });
      }
    } catch {
      toast({ title: "Ro'yxatni yuklab bo'lmadi", variant: 'error' });
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  /**
   * Hammasini bir bosishda tuzatadi.
   *
   * Anketalar o'chirilmaydi — faqat nomi katalogdagi to'g'ri nomga
   * ko'chiriladi. Ishonchli moslik topilmaganlari qoladi va pastda
   * qo'lda tanlash uchun ko'rsatiladi.
   */
  const tuzat = async () => {
    setHammasi(true);
    try {
      const res = await fetch('/api/admin/unlisted', { method: 'POST' });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast({ title: body?.message ?? "Tuzatib bo'lmadi", variant: 'error' });
        return;
      }

      const qoldi = body?.qolgan?.length ?? 0;
      toast({
        title: `${body?.nomlar ?? 0} ta nom to'g'rilandi`,
        description:
          `${body?.anketalar ?? 0} ta anketa o'z joyiga ko'chirildi` +
          (qoldi ? ` · ${qoldi} tasiga mos nom topilmadi` : ''),
        variant: 'success',
      });
      await load();
      onCatalogChange?.();
    } catch {
      toast({ title: "Serverga ulanib bo'lmadi", variant: 'error' });
    } finally {
      setHammasi(false);
    }
  };

  /** Bitta nomni katalogdagi tanlangan nomga birlashtiradi */
  const merge = async (kind: Kind, from: string, to: string) => {
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

  /** Haqiqatan yangi mahalla/maktab bo'lsa — katalogga qo'shadi */
  const addToCatalog = async (kind: Kind, name: string) => {
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

  /*
   * Tozalanib bo'lgach panel butunlay yo'qoladi. Hokim uchun bu
   * bo'lim ma'nosiz: qo'lda yozish yopilgan, ya'ni yangi nom
   * qo'shilmaydi va ro'yxat boshqa to'lmaydi.
   */
  if (!data || total === 0) return null;

  return (
    <section className="glass rounded-lg border border-warn/40">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-warn/40 bg-warn-bg text-warn">
            <Wand2 className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </span>
          <div>
            <h2 className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-ink">
              Ro&apos;yxatga tushmagan nomlar
              <Badge variant="warning">{total} ta</Badge>
            </h2>
            <p className="text-xs text-ink-faint">
              Eski anketalarda qolgan nomlar. Tuzatilgach bu bo&apos;lim yo&apos;qoladi —
              anketalar o&apos;chirilmaydi, faqat o&apos;z joyiga ko&apos;chiriladi.
            </p>
          </div>
        </div>

        <Button onClick={() => void tuzat()} disabled={hammasi}>
          {hammasi ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          Hammasini tuzatish
        </Button>
      </header>

      <div className="divide-y divide-line">
        {(['mahallalar', 'maktablar'] as const).map((kind) => {
          const items = data[kind];
          if (items.length === 0) return null;

          return (
            <div key={kind} className="p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                {kind === 'mahallalar' ? 'Mahallalar' : 'Maktablar'}
              </p>
              <ul className="space-y-2">
                {items.map((item) => {
                  const kalit = `${kind}:${item.name}`;
                  const ishlayapti = busy === kalit;
                  // Taklif bo'lmasa, qaysi nomga ko'chirishni odam tanlaydi
                  const maqsad = tanlov[kalit] ?? item.suggestion ?? '';

                  return (
                    <li
                      key={item.name}
                      className="flex flex-wrap items-center gap-2 rounded-md border border-line bg-surface p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-semibold text-ink">{item.name}</p>
                        <p className="mt-0.5 text-xs text-ink-faint">
                          <span className="font-mono tabular-nums">{item.count}</span> ta anketada
                          ishlatilgan
                          {!item.suggestion && (
                            <span className="text-warn">
                              {' · '}mos nom topilmadi — qaysi nomga ko&apos;chirishni tanlang
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">
                        <SearchableSelect
                          options={katalog[kind]}
                          value={maqsad}
                          onChange={(v) => setTanlov((p) => ({ ...p, [kalit]: v }))}
                          placeholder="Qaysi nomga?"
                          searchPlaceholder="Nomni yozing..."
                          emptyText="Topilmadi"
                          className="h-9 w-full text-sm sm:w-64"
                        />

                        <Button
                          size="sm"
                          disabled={ishlayapti || !maqsad}
                          onClick={() => void merge(kind, item.name, maqsad)}
                        >
                          {ishlayapti && <Loader2 className="h-4 w-4 animate-spin" />}
                          Ko&apos;chirish
                        </Button>

                        {/*
                          Haqiqatan yangi mahalla/maktab bo'lsagina —
                          "sdfsdfds" ni katalogga qo'shish xato bo'lardi
                        */}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={ishlayapti}
                          onClick={() => void addToCatalog(kind, item.name)}
                        >
                          <Plus className="h-4 w-4" />
                          Yangi
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
