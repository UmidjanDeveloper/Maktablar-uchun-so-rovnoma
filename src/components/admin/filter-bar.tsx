'use client';

import { CalendarDays, FilterX, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/shared/multi-select';
import { activeFilterCount } from '@/lib/filters';
import { JINSLAR, KASB_KATEGORIYALARI, SINFLAR } from '@/lib/constants';
import { EMPTY_FILTERS, type DashboardFilters } from '@/types';

interface FilterBarProps {
  filters: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
  mahallalar: string[];
  maktablar: string[];
}

/**
 * Global filtr paneli.
 * Bu yerdagi har qanday o'zgarish barcha KPI, diagramma va jadvallarga
 * bir vaqtning o'zida ta'sir qiladi.
 */
export function FilterBar({ filters, onChange, mahallalar, maktablar }: FilterBarProps) {
  const count = activeFilterCount(filters);

  const patch = (part: Partial<DashboardFilters>) => onChange({ ...filters, ...part });

  return (
    <div className="glass rounded-lg p-4 no-print">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
          <SlidersHorizontal className="h-4 w-4 text-ink-faint" />
          Filtrlar
          {count > 0 && <Badge>{count} ta faol</Badge>}
        </h2>
        {count > 0 && (
          <Button variant="ghost" size="sm" onClick={() => onChange(EMPTY_FILTERS)}>
            <FilterX className="h-4 w-4" />
            Tozalash
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="space-y-1.5">
          <Label className="text-xs">Mahalla</Label>
          <MultiSelect
            options={mahallalar}
            values={filters.mahallalar}
            onChange={(v) => patch({ mahallalar: v })}
            placeholder="Barcha mahallalar"
            searchPlaceholder="Mahalla qidirish..."
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Maktab</Label>
          <MultiSelect
            options={maktablar}
            values={filters.maktablar}
            onChange={(v) => patch({ maktablar: v })}
            placeholder="Barcha maktablar"
            searchPlaceholder="Maktab qidirish..."
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Sinf</Label>
          <MultiSelect
            options={SINFLAR.map((s) => `${s}`)}
            values={filters.sinflar.map((s) => `${s}`)}
            onChange={(v) => patch({ sinflar: v.map(Number) })}
            placeholder="Barcha sinflar"
            hideSearch
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Jins</Label>
          <MultiSelect
            options={[...JINSLAR]}
            values={filters.jinslar}
            onChange={(v) => patch({ jinslar: v })}
            placeholder="Barchasi"
            hideSearch
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Kasb yo&apos;nalishi</Label>
          <MultiSelect
            options={KASB_KATEGORIYALARI.map((c) => c.value)}
            values={filters.kategoriyalar}
            onChange={(v) => patch({ kategoriyalar: v })}
            placeholder="Barcha yo'nalishlar"
            hideSearch
          />
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1 text-xs">
            <CalendarDays className="h-3.5 w-3.5" />
            Sana oralig&apos;i
          </Label>
          <div className="flex min-w-0 items-center gap-1.5">
            <Input
              type="date"
              value={filters.dateFrom ?? ''}
              onChange={(e) => patch({ dateFrom: e.target.value || null })}
              className="h-10 min-w-0 px-2 text-xs"
              aria-label="Boshlanish sanasi"
            />
            <span className="text-ink-faint">–</span>
            <Input
              type="date"
              value={filters.dateTo ?? ''}
              onChange={(e) => patch({ dateTo: e.target.value || null })}
              className="h-10 min-w-0 px-2 text-xs"
              aria-label="Tugash sanasi"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
