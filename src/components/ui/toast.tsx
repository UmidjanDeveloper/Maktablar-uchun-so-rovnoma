'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (input: { title: string; description?: string; variant?: ToastVariant }) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, { icon: React.ElementType; ring: string; iconColor: string }> = {
  success: { icon: CheckCircle2, ring: 'border-emerald-200', iconColor: 'text-emerald-600' },
  error: { icon: AlertTriangle, ring: 'border-red-200', iconColor: 'text-red-600' },
  info: { icon: Info, ring: 'border-brand-200', iconColor: 'text-brand-600' },
};

/**
 * Yengil bildirishnoma (toast) tizimi.
 * Qo'shimcha kutubxonasiz, Framer Motion animatsiyasi bilan.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const counter = React.useRef(0);

  const remove = React.useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback<ToastContextValue['toast']>(
    ({ title, description, variant = 'info' }) => {
      const id = ++counter.current;
      setItems((prev) => [...prev, { id, title, description, variant }]);
      // 5 soniyadan so'ng avtomatik yopiladi
      setTimeout(() => remove(id), 5000);
    },
    [remove]
  );

  const value = React.useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const { icon: Icon, ring, iconColor } = VARIANT_STYLES[item.variant];
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.96 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className={cn(
                  'pointer-events-auto flex items-start gap-3 rounded-2xl border-2 bg-white p-4 shadow-soft-lg',
                  ring
                )}
              >
                <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', iconColor)} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">{item.title}</p>
                  {item.description ? (
                    <p className="mt-0.5 text-sm text-slate-600">{item.description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  aria-label="Yopish"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/** Bildirishnoma chiqarish uchun hook */
export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast faqat <ToastProvider> ichida ishlatilishi mumkin');
  }
  return ctx;
}
