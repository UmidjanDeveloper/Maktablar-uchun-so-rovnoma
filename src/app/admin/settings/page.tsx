import { Info } from 'lucide-react';
import { AdminShell } from '@/components/admin/admin-shell';
import { CatalogManager } from '@/components/admin/catalog-manager';
import { ProfessionManager } from '@/components/admin/profession-manager';
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
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Sozlamalar</h1>
          <p className="text-sm text-slate-500">
            Anketada ko&apos;rinadigan ro&apos;yxatlarni boshqaring. O&apos;zgarishlar darhol
            kuchga kiradi.
          </p>
        </div>

        {/* Mahallalar ro'yxatining manbasi haqida ma'lumot */}
        <div className="flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
          <div className="text-sm text-brand-900">
            <p className="font-bold">
              Mahallalar ro&apos;yxati rasmiy hujjat asosida kiritilgan
            </p>
            <p className="mt-1 leading-relaxed">
              Tizimda Xatirchi tumanining <strong>{MAHALLALAR.length} ta</strong>{' '}
              fuqarolar yig&apos;ini (MFY) mavjud — manba: tuman hokimligining
              mahalla raislari ro&apos;yxati. Yangi MFY tashkil etilsa yoki nomi
              o&apos;zgarsa, o&apos;zgarishni shu yerdan kiriting: yangi yozuv
              anketada darhol ko&apos;rinadi.
            </p>
          </div>
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
