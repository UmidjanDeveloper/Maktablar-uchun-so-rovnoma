import { Suspense } from 'react';
import { LoginForm } from '@/components/admin/login-form';
import { AuroraBackground } from '@/components/shared/aurora-background';
import { ThemeToggle } from '@/components/shared/theme-toggle';

export const metadata = {
  title: 'Kirish — Kelajak Egasi admin paneli',
};

export const dynamic = 'force-dynamic';

/** Admin panelga kirish sahifasi */
export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <AuroraBackground />

      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
