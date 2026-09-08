import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { searchKey } from '@/lib/utils';
import { hududBahosi } from '@/lib/hudud-qidiruv';

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
 *
 * Anketadagi qidiruv bilan BIR XIL moslashtirgich ishlatiladi:
 * "navruz" -> "Navro'z", "Mirzo Ulug'bek" -> "M.Ulug'bek".
 * Ilgari bu yerda oddiy "ichida bormi?" tekshiruvi turardi va
 * aynan shu nomlar uchun hech qanday taklif bermasdi.
 */
function findSuggestion(value: string, catalog: string[]): string | null {
  let eng: { nom: string; baho: number } | null = null;

  for (const item of catalog) {
    const baho = hududBahosi(item, value);
    // Faqat ishonchli mosliklarni taklif qilamiz — tasodifiy
    // o'xshashlik noto'g'ri birlashtirishga olib keladi
    if (baho >= 50 && (!eng || baho > eng.baho)) {
      eng = { nom: item, baho };
    }
  }

  return eng?.nom ?? null;
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


/**
 * POST /api/admin/unlisted — hammasini bir bosishda tuzatadi.
 *
 * Anketada qo'lda yozish yopilgunga qadar bazada 41 ta ro'yxatdan
 * tashqari nom to'plandi ("navruz", "Sangijumon", "mirzo ulug`bek").
 * Ularni bittalab birlashtirish 41 marta bosish demakdir, shuning
 * uchun bu amal hammasini o'zi bajaradi.
 *
 * Anketalar O'CHIRILMAYDI — faqat nomi katalogdagi to'g'ri nomga
 * ko'chiriladi, ya'ni o'quvchining javoblari saqlanib qoladi va
 * hisobotda o'z mahallasi/maktabi ostiga tushadi.
 *
 * Ishonchli moslik topilmagan nomlar tegilmaydi va javobda
 * `qolgan` ro'yxatida qaytariladi — ularni odam hal qiladi.
 */
export async function POST() {
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
    const mahallaKeys = new Set(mahallaNames.map(searchKey));
    const schoolKeys = new Set(schoolNames.map(searchKey));

    const tuzatildi: { type: 'mahalla' | 'school'; from: string; to: string; moved: number }[] = [];
    const qolgan: { type: 'mahalla' | 'school'; name: string; count: number }[] = [];

    /*
     * Har bir nom uchun alohida `updateMany` — bittasi xato bersa
     * qolganlari baribir tuzatilsin. Amal takrorlanaveradigan
     * (idempotent) bo'lgani uchun tugmani qayta bosish zarar qilmaydi.
     */
    for (const g of mahallaGroups) {
      if (mahallaKeys.has(searchKey(g.mahalla))) continue;
      const to = findSuggestion(g.mahalla, mahallaNames);
      if (!to) {
        qolgan.push({ type: 'mahalla', name: g.mahalla, count: g._count._all });
        continue;
      }
      const r = await prisma.student.updateMany({
        where: { mahalla: g.mahalla },
        data: { mahalla: to },
      });
      tuzatildi.push({ type: 'mahalla', from: g.mahalla, to, moved: r.count });
    }

    for (const g of schoolGroups) {
      if (schoolKeys.has(searchKey(g.school))) continue;
      const to = findSuggestion(g.school, schoolNames);
      if (!to) {
        qolgan.push({ type: 'school', name: g.school, count: g._count._all });
        continue;
      }
      const r = await prisma.student.updateMany({
        where: { school: g.school },
        data: { school: to },
      });
      tuzatildi.push({ type: 'school', from: g.school, to, moved: r.count });
    }

    return NextResponse.json({
      tuzatildi,
      qolgan,
      nomlar: tuzatildi.length,
      anketalar: tuzatildi.reduce((sum, t) => sum + t.moved, 0),
    });
  } catch (error) {
    console.error('[POST /api/admin/unlisted]', error);
    return NextResponse.json({ message: "Tuzatib bo'lmadi" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/unlisted — qo'lda yozilgan nomni katalogdagi
 * nomga birlashtiradi.
 *
 * Body: `{ type: 'mahalla' | 'school', from: string, to: string }`
 *
 * Nega kerak: bola "navruz" deb yozgan bo'lsa, uni katalogga
 * QO'SHISH xato bo'ladi — katalogda "Navro'z" allaqachon bor va
 * ikkitasi bitta mahalla. To'g'ri amal — anketalarni mavjud nomga
 * ko'chirish, shunda hisobot ham, qamrov ham to'g'ri bo'ladi.
 */
export async function PATCH(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "So'rov formati noto'g'ri" }, { status: 400 });
  }

  const { type, from, to } = (body ?? {}) as {
    type?: unknown;
    from?: unknown;
    to?: unknown;
  };

  if ((type !== 'mahalla' && type !== 'school') || typeof from !== 'string' || typeof to !== 'string') {
    return NextResponse.json({ message: "So'rov ma'lumotlari noto'g'ri" }, { status: 400 });
  }
  if (!from.trim() || !to.trim() || from === to) {
    return NextResponse.json({ message: 'Nomlar bir xil yoki bo\'sh' }, { status: 400 });
  }

  try {
    // Maqsad nom katalogda borligiga ishonch hosil qilamiz
    const mavjud =
      type === 'school'
        ? await prisma.school.findFirst({ where: { name: to } })
        : await prisma.mahalla.findFirst({ where: { name: to } });

    if (!mavjud) {
      return NextResponse.json(
        { message: 'Katalogda bunday nom topilmadi' },
        { status: 404 }
      );
    }

    const result =
      type === 'school'
        ? await prisma.student.updateMany({ where: { school: from }, data: { school: to } })
        : await prisma.student.updateMany({ where: { mahalla: from }, data: { mahalla: to } });

    return NextResponse.json({ moved: result.count });
  } catch (error) {
    console.error('[PATCH /api/admin/unlisted]', error);
    return NextResponse.json({ message: "Birlashtirib bo'lmadi" }, { status: 500 });
  }
}
