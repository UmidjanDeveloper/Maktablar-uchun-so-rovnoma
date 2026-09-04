'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin/dashboard', label: 'Tahlil paneli', icon: BarChart3 },
  { href: '/admin/settings', label: 'Sozlamalar', icon: Settings },
];

/** Admin panelning umumiy karkasi: yuqori panel + navigatsiya */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50/70">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur no-print">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-4 px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-xl shadow-soft">
              🏛️
            </span>
            <span className="leading-tight">
              <span className="block text-base font-extrabold tracking-tight text-slate-900">
                Kelajak Egasi
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Hokimiyat paneli
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
                    active
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-2 text-slate-500">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Chiqish</span>
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-6">{children}</main>
    </div>
  );
}
