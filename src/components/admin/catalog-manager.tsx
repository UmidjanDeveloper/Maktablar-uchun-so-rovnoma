'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';

interface CatalogItem {
  id: string;
  name: string;
}

interface CatalogManagerProps {
  /** API manzili, masalan: /api/admin/mahallalar */
  endpoint: string;
  title: string;
  description: string;
  /** Yangi yozuv maydonidagi namuna matn */
  placeholder: string;
  icon: string;
}

/**
 * Mahallalar va Maktablar ro'yxatini boshqarish (qo'shish, tahrirlash,
 * o'chirish). Ikkala katalog bir xil tuzilishga ega bo'lgani uchun
 * bitta komponent ishlatiladi.
 */
export function CatalogManager({
  endpoint,
  title,
  description,
  placeholder,
  icon,
}: CatalogManagerProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('load');
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      toast({ title: "Ro'yxatni yuklab bo'lmadi", variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [endpoint, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Yangi yozuv qo'shish */
  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newName.trim()) return;

    setSaving(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast({ title: data?.message ?? "Qo'shib bo'lmadi", variant: 'error' });
        return;
      }

      setNewName('');
      await load();
      toast({ title: "Muvaffaqiyatli qo'shildi", variant: 'success' });
    } catch {
      toast({ title: "Serverga ulanib bo'lmadi", variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  /** Nomni saqlash */
  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;

    setBusyId(id);
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingName.trim() }),
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

  /** Yozuvni o'chirish */
  const handleDelete = async (item: CatalogItem) => {
    const confirmed = window.confirm(
      `"${item.name}" ro'yxatdan o'chirilsinmi?\n\nEslatma: allaqachon topshirilgan anketalar o'zgarmaydi.`
    );
    if (!confirmed) return;

    setBusyId(item.id);
    try {
      const res = await fetch(`${endpoint}/${item.id}`, { method: 'DELETE' });
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

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white shadow-soft">
      <header className="border-b border-slate-100 p-5">
        <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900">
          <span aria-hidden="true">{icon}</span>
          {title}
          {!loading && (
            <span className="text-sm font-normal text-slate-400">({items.length} ta)</span>
          )}
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>

        <form onSubmit={handleAdd} className="mt-4 flex gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={placeholder}
            className="h-10 text-sm"
            maxLength={100}
          />
          <Button type="submit" size="sm" disabled={saving || !newName.trim()} className="h-10 shrink-0">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Qo&apos;shish
          </Button>
        </form>
      </header>

      <div className="max-h-[420px] overflow-y-auto p-2">
        {loading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-400">Ro&apos;yxat bo&apos;sh</p>
        ) : (
          <ul className="divide-y divide-slate-50">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-2 px-3 py-2">
                {editingId === item.id ? (
                  <>
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') void handleUpdate(item.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="h-9 text-sm"
                      autoFocus
                      maxLength={100}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 text-emerald-600"
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
                      className="h-9 w-9 shrink-0 text-slate-400"
                      onClick={() => setEditingId(null)}
                      aria-label="Bekor qilish"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                      {item.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 text-slate-400 hover:text-brand-600"
                      onClick={() => {
                        setEditingId(item.id);
                        setEditingName(item.name);
                      }}
                      aria-label="Tahrirlash"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 text-slate-400 hover:text-red-600"
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
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
