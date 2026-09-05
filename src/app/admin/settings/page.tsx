import { Info } from 'lucide-react';
import { AdminShell } from '@/components/admin/admin-shell';
import { CatalogManager } from '@/components/admin/catalog-manager';
import { ProfessionManager } from '@/components/admin/profession-manager';
import { UnlistedPanel } from '@/components/admin/unlisted-panel';
import { MAHALLALAR } from '@/lib/constants';

export const metadata = {
  title: 'Sozlamalar — Kelajak Egasi',
};

export const dynamic = 'force-dynamic';

/**
 * Sozlamalar sahifasi: mahallalar, maktablar va kasblar ro'yxatini
 * boshqarish. Anketada yetishmayotgan variantni admin shu yerdan qo'shadi.
 */
export default function SettingsPage() {
  return (
    <AdminShell>
      <div className="space-y-5">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            Xatirchi tumani hokimligi
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">
            Sozlamalar
          </h1>
          <p className="mt-0.5 text-sm text-ink-muted">
            Anketada ko&apos;rinadigan ro&apos;yxatlarni boshqaring. O&apos;zgarishlar darhol
            kuchga kiradi.
          </p>
        </div>

        {/* Mahallalar ro'yxatining manbasi haqida ma'lumot */}
        <div className="glass flex items-start gap-3 rounded-lg p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-accent/35 bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-accent">
            <Info className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </span>
          <div className="min-w-0 text-sm text-ink-muted">
            <p className="font-display font-semibold text-ink">
              Mahallalar ro&apos;yxati rasmiy hujjat asosida kiritilgan
            </p>
            <p className="mt-1 leading-relaxed">
              Tizimda Xatirchi tumanining{' '}
              <strong className="font-mono tabular-nums text-ink">{MAHALLALAR.length} ta</strong>{' '}
              fuqarolar yig&apos;ini (MFY) mavjud — manba: tuman hokimligining
              mahalla raislari ro&apos;yxati. Yangi MFY tashkil etilsa yoki nomi
              o&apos;zgarsa, o&apos;zgarishni shu yerdan kiriting: yangi yozuv
              anketada darhol ko&apos;rinadi.
            </p>
          </div>
        </div>

        {/* Anketada qo'lda kiritilgan nomlarni nazorat qilish */}
        <UnlistedPanel />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CatalogManager
            endpoint="/api/admin/mahallalar"
            title="Mahallalar"
            description="Xatirchi tumanidagi mahallalar ro'yxati"
            placeholder="Yangi mahalla nomi"
            icon="mahalla"
          />
          <CatalogManager
            endpoint="/api/admin/maktablar"
            title="Maktablar"
            description="Tumandagi umumta'lim maktablari"
            placeholder="Masalan: 51-maktab"
            icon="maktab"
          />
        </div>

        <ProfessionManager />
      </div>
    </AdminShell>
  );
}
