'use client';

import { cn } from '@/lib/utils';

interface ChartShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  /** Diagramma o'ng tomonidagi qo'shimcha element (masalan, jami soni) */
  action?: React.ReactNode;
  /** Ma'lumot yo'qligini bildiruvchi holat */
  empty?: boolean;
}

/**
 * Barcha diagrammalar uchun yagona ramka: sarlavha, izoh va konteyner.
 * Bir xil ko'rinish tahlil panelini bir butun qilib ko'rsatadi.
 */
export function ChartShell({
  title,
  description,
  children,
  className,
  action,
  empty = false,
}: ChartShellProps) {
  return (
    <section className={cn('chart-card flex flex-col', className)}>
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold tracking-tight text-slate-900">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        </div>
        {action}
      </header>

      {empty ? (
        <div className="flex flex-1 items-center justify-center rounded-xl bg-slate-50 py-12 text-sm text-slate-400">
          Tanlangan filtrlar bo&apos;yicha ma&apos;lumot topilmadi
        </div>
      ) : (
        <div className="flex-1">{children}</div>
      )}
    </section>
  );
}

/** Diagramma uchun yagona ko'rinishdagi maslahat oynasi (tooltip) */
export function ChartTooltip({
  active,
  payload,
  label,
  unit = "o'quvchi",
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; dataKey?: string | number }[];
  label?: string;
  unit?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-soft-lg">
      {label && <p className="mb-1 text-xs font-bold text-slate-900">{label}</p>}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-bold text-slate-900">
            {entry.value} {unit}
          </span>
        </div>
      ))}
    </div>
  );
}
