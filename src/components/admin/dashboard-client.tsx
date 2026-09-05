'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FileSpreadsheet, FileText, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { FilterBar } from './filter-bar';
import { KpiCards } from './kpi-cards';
import {
  CategoryOverview,
  GenderJobsChart,
  GradesChart,
  MahallaChart,
  SchoolTopJobsTable,
  SubjectsChart,
  TopJobsChart,
} from './charts';
import { DashboardEmpty } from './dashboard-empty';
import { RecommendationsPanel } from './recommendations-panel';
import { SubmissionsTable } from './submissions-table';
import { StudentModal } from './student-modal';
import { activeFilterCount, filtersToQuery } from '@/lib/filters';
import { exportStudentsToExcel } from '@/lib/export-excel';
import { exportDashboardToPdf } from '@/lib/export-pdf';
import { MAHALLALAR, MAKTABLAR } from '@/lib/constants';
import {
  EMPTY_FILTERS,
  type CatalogsResponse,
  type DashboardFilters,
  type DashboardStats,
  type PaginatedStudents,
  type StudentRecord,
} from '@/types';

const PAGE_SIZE = 10;

/**
 * Tahlil panelining asosiy komponenti.
 * Filtrlar o'zgarganda statistika ham, jadval ham qayta yuklanadi —
 * shu sababli barcha diagrammalar doim bir xil ma'lumotni ko'rsatadi.
 */
export function DashboardClient() {
  const { toast } = useToast();

  const [filters, setFilters] = useState<DashboardFilters>(EMPTY_FILTERS);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [students, setStudents] = useState<PaginatedStudents | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null);
  const [selected, setSelected] = useState<StudentRecord | null>(null);

  // Filtr ro'yxatlari (mahalla/maktab) — admin qo'shganlari bilan birga
  const [mahallalar, setMahallalar] = useState<string[]>(MAHALLALAR);
  const [maktablar, setMaktablar] = useState<string[]>(MAKTABLAR);

  const query = useMemo(() => filtersToQuery(filters).toString(), [filters]);

  /** Filtrlar qo'llanilganmi? Bo'sh holat matnini tanlash uchun kerak */
  const hasFilters = useMemo(() => activeFilterCount(filters) > 0, [filters]);

  /** Ma'lumot umuman yo'qmi (yoki filtrlarga mos kelmadimi) */
  const isEmpty = !statsLoading && !!stats && stats.kpi.totalStudents === 0;

  /** Qidiruvni "debounce" qilamiz — har bosilgan harfda so'rov ketmasligi uchun */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  /** Filtr o'zgarsa — birinchi sahifaga qaytamiz */
  const handleFiltersChange = useCallback((next: DashboardFilters) => {
    setFilters(next);
    setPage(1);
  }, []);

  /** Kataloglarni yuklash */
  useEffect(() => {
    fetch('/api/catalogs')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('catalogs'))))
      .then((data: CatalogsResponse) => {
        if (data.mahallalar?.length) setMahallalar(data.mahallalar.map((m) => m.name));
        if (data.maktablar?.length) setMaktablar(data.maktablar.map((m) => m.name));
      })
      .catch(() => {
        // Statik ro'yxat bilan davom etamiz
      });
  }, []);

  /** Statistikani yuklash */
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch(`/api/stats?${query}`);
      if (!res.ok) throw new Error('stats');
      setStats(await res.json());
    } catch {
      toast({
        title: "Statistikani yuklab bo'lmadi",
        description: 'Internet aloqasini tekshiring va sahifani yangilang.',
        variant: 'error',
      });
    } finally {
      setStatsLoading(false);
    }
  }, [query, toast]);

  /** Jadvalni yuklash */
  const loadStudents = useCallback(async () => {
    setTableLoading(true);
    try {
      const params = new URLSearchParams(query);
      params.set('page', String(page));
      params.set('pageSize', String(PAGE_SIZE));
      if (debouncedSearch) params.set('search', debouncedSearch);

      const res = await fetch(`/api/students?${params.toString()}`);
      if (!res.ok) throw new Error('students');
      setStudents(await res.json());
    } catch {
      toast({
        title: "Anketalarni yuklab bo'lmadi",
        description: 'Internet aloqasini tekshiring va qayta urinib ko\'ring.',
        variant: 'error',
      });
    } finally {
      setTableLoading(false);
    }
  }, [query, page, debouncedSearch, toast]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  /** Excel eksporti — filtrlangan barcha yozuvlar bilan */
  const handleExcelExport = async () => {
    setExporting('excel');
    try {
      const params = new URLSearchParams(query);
      params.set('all', '1');
      if (debouncedSearch) params.set('search', debouncedSearch);

      const res = await fetch(`/api/students?${params.toString()}`);
      if (!res.ok) throw new Error('export');
      const data: PaginatedStudents = await res.json();

      if (data.items.length === 0) {
        toast({
          title: 'Eksport uchun ma\'lumot yo\'q',
          description: 'Filtrlarni o\'zgartiring va qayta urinib ko\'ring.',
          variant: 'info',
        });
        return;
      }

      await exportStudentsToExcel(data.items, stats);
      toast({
        title: 'Excel fayl tayyor',
        description: `${data.items.length} ta anketa yuklab olindi.`,
        variant: 'success',
      });
    } catch {
      toast({
        title: "Eksport amalga oshmadi",
        description: "Birozdan so'ng qayta urinib ko'ring.",
        variant: 'error',
      });
    } finally {
      setExporting(null);
    }
  };

  /** PDF hisobot — hokim uchun tayyor tahliliy hujjat */
  const handlePdfExport = async () => {
    if (!stats || stats.kpi.totalStudents === 0) {
      toast({
        title: "Hisobot uchun ma'lumot yo'q",
        description: "Filtrlarni o'zgartiring va qayta urinib ko'ring.",
        variant: 'info',
      });
      return;
    }

    setExporting('pdf');
    try {
      await exportDashboardToPdf(stats, filters);
      toast({
        title: 'PDF hisobot tayyor',
        description: 'Fayl yuklab olindi va chop etishga tayyor.',
        variant: 'success',
      });
    } catch {
      toast({
        title: "Hisobotni yaratib bo'lmadi",
        description: "Birozdan so'ng qayta urinib ko'ring.",
        variant: 'error',
      });
    } finally {
      setExporting(null);
    }
  };

  /** Barcha ma'lumotni qayta yuklash */
  const handleRefresh = () => {
    void loadStats();
    void loadStudents();
  };

  return (
    <div className="space-y-5">
      {/* Sarlavha va amallar */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Tahlil paneli
          </h1>
          <p className="text-sm text-slate-500">
            Xatirchi tumani o&apos;quvchilarining kasb tanlovi bo&apos;yicha jonli statistika
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={statsLoading}>
            <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
            Yangilash
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleExcelExport()}
            disabled={!!exporting}
          >
            {exporting === 'excel' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4" />
            )}
            Excelga yuklash
          </Button>
          <Button size="sm" onClick={() => void handlePdfExport()} disabled={!!exporting}>
            {exporting === 'pdf' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            PDF hisobot
          </Button>
        </div>
      </div>

      {/* Bazada umuman ma'lumot bo'lmasa, nol to'la kartochkalar va
          filtrlarni ko'rsatishning ma'nosi yo'q */}
      {!(isEmpty && !hasFilters) && (
        <>
          <KpiCards stats={stats} loading={statsLoading} />

          <FilterBar
            filters={filters}
            onChange={handleFiltersChange}
            mahallalar={mahallalar}
            maktablar={maktablar}
          />
        </>
      )}

      {/* Bo'sh holat: diagrammalar o'rniga tushuntirish ko'rsatiladi */}
      {isEmpty ? (
        <DashboardEmpty
          variant={hasFilters ? 'no-results' : 'first-run'}
          onClearFilters={hasFilters ? () => handleFiltersChange(EMPTY_FILTERS) : undefined}
        />
      ) : (
        <>
      {/* Tavsiyalar — diagrammalardan oldin, chunki hokim uchun
          "nima qilish kerak" degan savol birinchi o'rinda turadi */}
      <RecommendationsPanel stats={stats} loading={statsLoading} />

      {/* Diagrammalar */}
      {statsLoading && !stats ? (
        <div className="grid gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="chart-card h-[340px] animate-pulse lg:col-span-2" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-4 lg:grid-cols-4">
          <TopJobsChart data={stats.topJobs} />
          <GenderJobsChart data={stats.genderJobs} />
          <MahallaChart data={stats.byMahalla} />
          <SchoolTopJobsTable data={stats.bySchool} />
          <GradesChart data={stats.byGrade} />
          <SubjectsChart data={stats.bySubject} />
          <CategoryOverview data={stats.byCategory} />
          <ExtraInsights stats={stats} />
        </div>
      ) : null}
        </>
      )}

      {/* Jadval faqat ma'lumot bo'lganda yoki filtr qo'llanilganda ko'rinadi */}
      {!(isEmpty && !hasFilters) && (
      <SubmissionsTable
        data={students}
        loading={tableLoading}
        search={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
        onSelect={setSelected}
      />
      )}

      <StudentModal student={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

/** Qo'shimcha tahlil: ilhom manbalari va chet elda o'qish istagi */
function ExtraInsights({ stats }: { stats: DashboardStats }) {
  const blocks = [
    { title: 'Kim ilhom berdi?', data: stats.byInspiration },
    { title: "Chet elda o'qish istagi", data: stats.studyAbroad },
  ];

  return (
    <section className="chart-card">
      <h3 className="text-base font-bold tracking-tight text-slate-900">
        Qo&apos;shimcha ko&apos;rsatkichlar
      </h3>
      <p className="mt-0.5 text-xs text-slate-500">O&apos;quvchilarning kelajak haqidagi javoblari</p>

      <div className="mt-4 space-y-5">
        {blocks.map((block) => {
          const total = block.data.reduce((sum, item) => sum + item.value, 0);
          return (
            <div key={block.title}>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                {block.title}
              </p>
              {block.data.length === 0 ? (
                <p className="text-sm text-slate-400">Ma&apos;lumot yo&apos;q</p>
              ) : (
                <ul className="space-y-2">
                  {block.data.map((item) => (
                    <li key={item.name} className="flex items-center gap-2 text-sm">
                      <span className="min-w-0 flex-1 truncate text-slate-600">{item.name}</span>
                      <span className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-slate-100">
                        <span
                          className="block h-full rounded-full bg-brand-600"
                          style={{ width: `${total ? (item.value / total) * 100 : 0}%` }}
                        />
                      </span>
                      <span className="w-9 shrink-0 text-right font-bold tabular-nums text-slate-900">
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
