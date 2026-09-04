import { Suspense } from 'react';
import { LoginForm } from '@/components/admin/login-form';

export const metadata = {
  title: 'Kirish — Kelajak Egasi admin paneli',
};

export const dynamic = 'force-dynamic';

/** Admin panelga kirish sahifasi */
export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-grid px-4 py-12">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
