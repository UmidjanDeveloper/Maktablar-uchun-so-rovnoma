import { AdminShell } from '@/components/admin/admin-shell';
import { CatalogManager } from '@/components/admin/catalog-manager';
import { ProfessionManager } from '@/components/admin/profession-manager';

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
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Sozlamalar</h1>
          <p className="text-sm text-slate-500">
            Anketada ko&apos;rinadigan ro&apos;yxatlarni boshqaring. O&apos;zgarishlar darhol
            kuchga kiradi.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <CatalogManager
            endpoint="/api/admin/mahallalar"
            title="Mahallalar"
            description="Xatirchi tumanidagi mahallalar ro'yxati"
            placeholder="Yangi mahalla nomi"
            icon="📍"
          />
          <CatalogManager
            endpoint="/api/admin/maktablar"
            title="Maktablar"
            description="Tumandagi umumta'lim maktablari"
            placeholder="Masalan: 51-maktab"
            icon="🏫"
          />
        </div>

        <ProfessionManager />
      </div>
    </AdminShell>
  );
}
