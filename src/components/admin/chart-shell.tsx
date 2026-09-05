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
    <section className={cn('glass flex flex-col rounded-lg p-4 sm:p-5', className)}>
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink sm:text-base">
            {title}
          </h3>
          {description && <p className="mt-0.5 text-xs text-ink-faint">{description}</p>}
        </div>
        {action}
      </header>

      {empty ? (
        <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-line py-12 text-center text-sm text-ink-faint">
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
    <div className="rounded-md border border-line-strong bg-surface-solid px-3 py-2 shadow-float">
      {label && <p className="mb-1 text-xs font-bold text-ink">{label}</p>}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-ink-muted">{entry.name}:</span>
          <span className="font-mono font-semibold tabular-nums text-ink">
            {entry.value} {unit}
          </span>
        </div>
      ))}
    </div>
  );
}
