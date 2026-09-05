import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { searchKey } from '@/lib/utils';

export const dynamic = 'force-dynamic';

/** Ro'yxatdan tashqari kiritilgan bitta qiymat */
interface UnlistedValue {
  name: string;
  count: number;
  /** Katalogdagi eng yaqin nom (agar topilsa) — bu imlo xatosimi yoki yangi nommi */
  suggestion: string | null;
}

/**
 * Katalogdagi eng o'xshash nomni topadi.
 * Oddiy usul: normallashtirilgan matnlardan biri ikkinchisining
 * ichida bo'lsa yoki boshlanishi mos kelsa — taklif sifatida beramiz.
 */
function findSuggestion(value: string, catalog: string[]): string | null {
  const key = searchKey(value);
  if (key.length < 2) return null;

  for (const item of catalog) {
    const itemKey = searchKey(item);
    if (itemKey.includes(key) || key.includes(itemKey)) return item;
  }
  return null;
}

/**
 * GET /api/admin/unlisted
 *
 * O'quvchilar qo'lda kiritgan, lekin katalogda mavjud bo'lmagan
 * mahalla va maktab nomlarini qaytaradi.
 *
 * Bu nazorat halqasi: anketada erkin yozishga ruxsat berilgani uchun
 * ma'lumot parchalanib ketishi mumkin ("7-maktab", "7 maktab", ...).
 * Admin bu ro'yxatni ko'rib, haqiqiylarini katalogga qo'shadi.
 */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const [mahallaGroups, schoolGroups, mahallaCatalog, schoolCatalog] = await Promise.all([
      prisma.student.groupBy({ by: ['mahalla'], _count: { _all: true } }),
      prisma.student.groupBy({ by: ['school'], _count: { _all: true } }),
      prisma.mahalla.findMany({ select: { name: true } }),
      prisma.school.findMany({ select: { name: true } }),
    ]);

    const mahallaNames = mahallaCatalog.map((m) => m.name);
    const schoolNames = schoolCatalog.map((s) => s.name);

    // Taqqoslash normallashtirilgan ko'rinishda — apostrof/defis farqi
    // tufayli bir xil nom "ro'yxatdan tashqari" deb ko'rinmasligi uchun
    const mahallaKeys = new Set(mahallaNames.map(searchKey));
    const schoolKeys = new Set(schoolNames.map(searchKey));

    const mahallalar: UnlistedValue[] = mahallaGroups
      .filter((g) => !mahallaKeys.has(searchKey(g.mahalla)))
      .map((g) => ({
        name: g.mahalla,
        count: g._count._all,
        suggestion: findSuggestion(g.mahalla, mahallaNames),
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    const maktablar: UnlistedValue[] = schoolGroups
      .filter((g) => !schoolKeys.has(searchKey(g.school)))
      .map((g) => ({
        name: g.school,
        count: g._count._all,
        suggestion: findSuggestion(g.school, schoolNames),
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    return NextResponse.json({ mahallalar, maktablar });
  } catch (error) {
    console.error('[GET /api/admin/unlisted]', error);
    return NextResponse.json(
      { message: "Ro'yxatdan tashqari nomlarni yuklab bo'lmadi" },
      { status: 500 }
    );
  }
}
