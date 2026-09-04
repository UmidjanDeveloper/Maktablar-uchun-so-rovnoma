import { AdminShell } from '@/components/admin/admin-shell';
import { DashboardClient } from '@/components/admin/dashboard-client';

export const metadata = {
  title: 'Tahlil paneli — Kelajak Egasi',
};

export const dynamic = 'force-dynamic';

/** Hokimiyat uchun asosiy tahlil paneli */
export default function DashboardPage() {
  return (
    <AdminShell>
      <DashboardClient />
    </AdminShell>
  );
}
