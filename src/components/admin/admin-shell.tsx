'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoLockup } from '@/components/shared/logo';
import { AuroraBackground } from '@/components/shared/aurora-background';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin/dashboard', label: 'Tahlil paneli', icon: BarChart3 },
  { href: '/admin/settings', label: 'Sozlamalar', icon: Settings },
];

/**
 * Admin panelning umumiy karkasi: yuqori panel + navigatsiya.
 *
 * Asosiy sayt bilan bir xil dizayn tizimidan foydalanadi (aurora fon,
 * shisha yuzalar, bir xil tokenlar), lekin zichligi boshqacha —
 * bu yerda bezak emas, ma'lumot birinchi o'rinda turadi.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />

      <header className="glass sticky top-0 z-40 rounded-none border-x-0 border-t-0 no-print">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-3 px-3 sm:px-4">
          <Link href="/admin/dashboard" className="min-w-0 rounded-sm">
            <LogoLockup subtitle="Boshqaruv paneli" />
          </Link>

          <nav className="flex shrink-0 items-center gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors',
                    active
                      ? 'border border-accent/40 bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-ink'
                      : 'text-ink-faint hover:bg-surface hover:text-ink'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}

            <ThemeToggle className="ml-1" />

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="ml-1 h-11 px-3"
              aria-label="Tizimdan chiqish"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Chiqish</span>
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-3 py-5 sm:px-4 sm:py-6">{children}</main>
    </div>
  );
}
