import { AlertTriangle } from 'lucide-react';
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

        {/* Mahallalar ro'yxatining to'liqligi haqida ogohlantirish.
            Ro'yxat rasmiy MFY reyestri bilan solishtirilishi shart —
            aks holda ba'zi mahallalar tahlildan tushib qoladi. */}
        <div className="flex items-start gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-sm text-amber-900">
            <p className="font-bold">
              Mahallalar ro&apos;yxatini rasmiy reyestr bilan solishtiring
            </p>
            <p className="mt-1 leading-relaxed">
              Tizimga dastlab <strong>{MAHALLALAR.length} ta</strong> mahalla
              kiritilgan. Xatirchi tumanidagi fuqarolar yig&apos;ini (MFY) soni
              bundan ko&apos;proq bo&apos;lishi mumkin. So&apos;rovnomani
              boshlashdan <strong>oldin</strong> tuman hokimligidan rasmiy
              ro&apos;yxatni oling va yetishmayotganlarini quyidan
              qo&apos;shing — aks holda o&apos;sha mahallalardagi
              o&apos;quvchilar anketada o&apos;z mahallasini topa olmaydi va
              tahlil to&apos;liq bo&apos;lmaydi.
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
