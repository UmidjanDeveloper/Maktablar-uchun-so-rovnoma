/**
 * ============================================================
 *  Admin paneldagi global filtrlarni URL parametrlari bilan
 *  Prisma so'rovi o'rtasida bir xil tarzda tarjima qilish.
 * ============================================================
 */
import type { Prisma } from '@prisma/client';
import { KASBLAR, MAHALLALAR, MAKTABLAR } from '@/lib/constants';
import { kunBoshi, kunOxiri, searchKey } from '@/lib/utils';
import type { DashboardFilters } from '@/types';

/** URL query parametrlaridan filtrlarni o'qiydi */
export function parseFilters(searchParams: URLSearchParams): DashboardFilters {
  const list = (key: string) =>
    (searchParams.get(key) ?? '')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

  return {
    mahallalar: list('mahalla'),
    maktablar: list('school'),
    sinflar: list('grade')
      .map((v) => Number(v))
      .filter((n) => Number.isFinite(n)),
    jinslar: list('gender'),
    kategoriyalar: list('category'),
    dateFrom: searchParams.get('dateFrom') || null,
    dateTo: searchParams.get('dateTo') || null,
  };
}

/** Filtrlarni Prisma `where` shartiga aylantiradi */
export function buildWhere(
  filters: DashboardFilters,
  search?: string | null
): Prisma.StudentWhereInput {
  const where: Prisma.StudentWhereInput = {};

  if (filters.mahallalar.length) where.mahalla = { in: filters.mahallalar };
  if (filters.maktablar.length) where.school = { in: filters.maktablar };
  if (filters.sinflar.length) where.grade = { in: filters.sinflar };
  if (filters.jinslar.length) where.gender = { in: filters.jinslar };
  if (filters.kategoriyalar.length) where.jobCategory = { in: filters.kategoriyalar };

  if (filters.dateFrom || filters.dateTo) {
    const createdAt: Prisma.DateTimeFilter = {};
    // Sana Toshkent vaqtida hisoblanadi: server UTC da ishlagani uchun
    // "bugun" degan filtr aks holda kechagi kunning yarmini qamrab olardi
    if (filters.dateFrom) createdAt.gte = kunBoshi(filters.dateFrom);
    if (filters.dateTo) createdAt.lte = kunOxiri(filters.dateTo);
    where.createdAt = createdAt;
  }

  // Jadval ustidagi qidiruv maydoni (ism, familiya, kasb, maktab, mahalla)
  const q = search?.trim();
  if (q) {
    const or: Prisma.StudentWhereInput[] = [
      { firstName: { contains: q, mode: 'insensitive' } },
      { lastName: { contains: q, mode: 'insensitive' } },
      { dreamJob: { contains: q, mode: 'insensitive' } },
      { school: { contains: q, mode: 'insensitive' } },
      { mahalla: { contains: q, mode: 'insensitive' } },
    ];

    // PostgreSQL apostrofni e'tiborsiz qoldira olmaydi, shuning uchun
    // "xojaqorgon" kabi apostrofsiz so'rov ham "Xo'jaqo'rg'on" ni topishi
    // uchun ma'lum kataloglardan mos nomlarni oldindan aniqlaymiz.
    const key = searchKey(q);
    if (key.length >= 2) {
      const matchedMahallas = MAHALLALAR.filter((m) => searchKey(m).includes(key));
      const matchedSchools = MAKTABLAR.filter((m) => searchKey(m).includes(key));
      const matchedJobs = KASBLAR.map((k) => k.name).filter((n) => searchKey(n).includes(key));

      if (matchedMahallas.length) or.push({ mahalla: { in: matchedMahallas } });
      if (matchedSchools.length) or.push({ school: { in: matchedSchools } });
      if (matchedJobs.length) or.push({ dreamJob: { in: matchedJobs } });
    }

    where.OR = or;
  }

  return where;
}

/** Filtrlarni URL query satriga aylantiradi (brauzer tomonda) */
export function filtersToQuery(filters: DashboardFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.mahallalar.length) params.set('mahalla', filters.mahallalar.join(','));
  if (filters.maktablar.length) params.set('school', filters.maktablar.join(','));
  if (filters.sinflar.length) params.set('grade', filters.sinflar.join(','));
  if (filters.jinslar.length) params.set('gender', filters.jinslar.join(','));
  if (filters.kategoriyalar.length) params.set('category', filters.kategoriyalar.join(','));
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.set('dateTo', filters.dateTo);
  return params;
}

/** Faol filtrlar sonini hisoblaydi (badge uchun) */
export function activeFilterCount(filters: DashboardFilters): number {
  return (
    filters.mahallalar.length +
    filters.maktablar.length +
    filters.sinflar.length +
    filters.jinslar.length +
    filters.kategoriyalar.length +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0)
  );
}
