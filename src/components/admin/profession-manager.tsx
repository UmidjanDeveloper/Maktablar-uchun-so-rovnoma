'use client';

import { useCallback, useEffect, useState } from 'react';
import { Briefcase, Check, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { KASB_KATEGORIYALARI } from '@/lib/constants';
import { EntityIcon } from '@/lib/icons';

interface Profession {
  id: string;
  name: string;
  category: string;
  icon: string;
}

interface Draft {
  name: string;
  category: string;
  icon: string;
}

const EMPTY_DRAFT: Draft = {
  name: '',
  category: KASB_KATEGORIYALARI[0].value,
  icon: '⭐',
};

/** Kasblar katalogini boshqarish: qo'shish, tahrirlash, o'chirish */
export function ProfessionManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<Profession[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(EMPTY_DRAFT);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/kasblar');
      if (!res.ok) throw new Error('load');
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      toast({ title: "Kasblar ro'yxatini yuklab bo'lmadi", variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim()) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/kasblar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...draft, name: draft.name.trim() }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast({ title: data?.message ?? "Qo'shib bo'lmadi", variant: 'error' });
        return;
      }

      setDraft(EMPTY_DRAFT);
      await load();
      toast({ title: "Kasb qo'shildi", variant: 'success' });
    } catch {
      toast({ title: "Serverga ulanib bo'lmadi", variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editDraft.name.trim()) return;

    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/kasblar/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editDraft, name: editDraft.name.trim() }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast({ title: data?.message ?? "O'zgartirib bo'lmadi", variant: 'error' });
        return;
      }

      setEditingId(null);
      await load();
      toast({ title: "O'zgartirildi", variant: 'success' });
    } catch {
      toast({ title: "Serverga ulanib bo'lmadi", variant: 'error' });
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (item: Profession) => {
    const confirmed = window.confirm(
      `"${item.name}" kasbi ro'yxatdan o'chirilsinmi?\n\nEslatma: allaqachon topshirilgan anketalar o'zgarmaydi.`
    );
    if (!confirmed) return;

    setBusyId(item.id);
    try {
      const res = await fetch(`/api/admin/kasblar/${item.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast({ title: data?.message ?? "O'chirib bo'lmadi", variant: 'error' });
        return;
      }
      await load();
      toast({ title: "O'chirildi", variant: 'success' });
    } catch {
      toast({ title: "Serverga ulanib bo'lmadi", variant: 'error' });
    } finally {
      setBusyId(null);
    }
  };

  /** Mavjud yo'nalishlar: standart 7 ta + bazadagi qo'shimchalari */
  const categories = Array.from(
    new Set([...KASB_KATEGORIYALARI.map((c) => c.value), ...items.map((i) => i.category)])
  );

  return (
    <section className="glass rounded-lg">
      <header className="border-b border-line p-4 sm:p-5">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-accent/35 bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-accent">
            <Briefcase className="h-[17px] w-[17px]" strokeWidth={1.9} />
          </span>
          Kasblar
          {!loading && (
            <span className="font-mono text-xs font-normal tabular-nums text-ink-faint">
              ({items.length} ta)
            </span>
          )}
        </h2>
        <p className="mt-1 text-xs text-ink-faint">
          Anketaning 3-qadamida o&apos;quvchilarga ko&apos;rsatiladigan kasblar ro&apos;yxati
        </p>

        <form onSubmit={handleAdd} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_88px_auto]">
          <div className="space-y-1.5">
            <Label className="text-xs">Kasb nomi</Label>
            <Input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Masalan: Robototexnik"
              className="h-10 text-sm"
              maxLength={100}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Yo&apos;nalish</Label>
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              className="h-10 w-full rounded-md border border-line bg-surface-solid px-3 text-sm text-ink transition-colors focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/*
            Anketada endi emoji emas, bir uslubdagi SVG ikona ko'rsatiladi
            (ikona kasb nomi bo'yicha topiladi). Bu maydon eksport
            fayllarida ishlatiladigan zaxira belgi sifatida saqlanib qoldi.
          */}
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="kasb-belgi">
              Belgi
            </Label>
            <Input
              id="kasb-belgi"
              value={draft.icon}
              onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
              className="h-10 text-center text-lg"
              maxLength={8}
            />
          </div>

          <div className="flex items-end">
            <Button type="submit" size="sm" disabled={saving || !draft.name.trim()} className="h-10 w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Qo&apos;shish
            </Button>
          </div>
        </form>
      </header>

      <div className="max-h-[480px] overflow-y-auto p-2">
        {loading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-11" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-faint">
            Kasblar ro&apos;yxati bo&apos;sh. Avval <code>npm run db:seed</code> buyrug&apos;ini
            bajaring.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <li key={item.id} className="px-3 py-2">
                {editingId === item.id ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_72px_auto]">
                    <Input
                      value={editDraft.name}
                      onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                      className="h-9 text-sm"
                      autoFocus
                      maxLength={100}
                    />
                    <select
                      value={editDraft.category}
                      onChange={(e) => setEditDraft({ ...editDraft, category: e.target.value })}
                      className="h-9 rounded-md border border-line bg-surface-solid px-2 text-sm text-ink focus:border-accent focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <Input
                      value={editDraft.icon}
                      onChange={(e) => setEditDraft({ ...editDraft, icon: e.target.value })}
                      className="h-9 text-center text-base"
                      maxLength={8}
                    />
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-ok"
                        onClick={() => handleUpdate(item.id)}
                        disabled={busyId === item.id}
                        aria-label="Saqlash"
                      >
                        {busyId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => setEditingId(null)}
                        aria-label="Bekor qilish"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-strong text-accent">
                      <EntityIcon name={item.name} className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                      {item.name}
                    </span>
                    <Badge variant="secondary" className="hidden shrink-0 sm:inline-flex">
                      {item.category}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 hover:text-accent"
                      onClick={() => {
                        setEditingId(item.id);
                        setEditDraft({
                          name: item.name,
                          category: item.category,
                          icon: item.icon,
                        });
                      }}
                      aria-label="Tahrirlash"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 hover:text-danger"
                      onClick={() => handleDelete(item)}
                      disabled={busyId === item.id}
                      aria-label="O'chirish"
                    >
                      {busyId === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
