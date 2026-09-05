'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Loader2, Lock, LogIn, User } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** Hokimiyat xodimlari uchun kirish formasi */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/admin/dashboard';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // Middleware yangi cookie'ni ko'rishi uchun to'liq yangilanish
        router.replace(nextUrl);
        router.refresh();
        return;
      }

      const data = await res.json().catch(() => ({}));
      setError(data?.message ?? "Kirishda xatolik yuz berdi");
    } catch {
      setError("Serverga ulanib bo'lmadi. Internetni tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md"
    >
      <div className="mb-8 text-center">
        <Logo className="mx-auto mb-5 h-16 w-16" />
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Boshqaruv paneli
        </h1>
        <p className="mt-1 text-sm text-ink-faint">
          &laquo;Kelajak Egasi&raquo; — Xatirchi tumani
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Login</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border-2 border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Tekshirilmoqda...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Kirish
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Anketa sahifasiga qaytish
        </Link>
      </div>
    </motion.div>
  );
}
