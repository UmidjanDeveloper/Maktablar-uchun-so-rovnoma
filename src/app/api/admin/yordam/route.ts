import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { YORDAM_TOSIQLARI } from '@/lib/constants';

export const dynamic = 'force-dynamic';

/**
 * Jadvalda ko'rsatiladigan yozuvlar chegarasi.
 *
 * Hisoblagichlar bunga bog'liq emas — ular butun baza bo'yicha
 * hisoblanadi. Chegara faqat brauzerga yuboriladigan ro'yxatni
 * cheklaydi, aks holda sahifa sekinlashadi.
 */
const LIST_LIMIT = 2000;

/** Hokimiyat aralashuvi talab qiladigan sabab bormi */
function needsHelp(barriers: string[]): boolean {
  return barriers.some((b) => (YORDAM_TOSIQLARI as readonly string[]).includes(b));
}

/**
 * GET /api/admin/yordam
 *
 * To'garakka qatnamayotgan o'quvchilar ro'yxati — sababi bilan birga.
 *
 * Bu ro'yxatning maqsadi statistika emas, ARALASHUV: hokimiyat xodimi
 * bolani ismi, maktabi, sinfi va ota-onasining telefoni bilan topib,
 * aniq yordam ko'rsatishi kerak:
 *   - ota-onasi ruxsat bermasa   -> mahalla orqali suhbat
 *   - oilaviy sharoiti bo'lmasa  -> moddiy yordam, bepul o'rin
 *   - sog'lig'i yoki nogironligi -> maxsus sharoit
 *
 * Shuning uchun bu yerda shaxsiy ma'lumot qaytariladi va marshrut
 * faqat admin uchun ochiq.
 */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    /*
     * MUHIM: hisoblash BARCHA yozuvlar bo'yicha, ro'yxat esa
     * cheklangan holda qaytariladi.
     *
     * Ilgari ikkalasi ham bitta `take: 1000` so'roviga tayanardi.
     * Anketalar soni oshgach, hisoblagichlar jimgina noto'g'ri
     * bo'lib qolardi: "42 ta muammo" degan raqam aslida faqat
     * birinchi 1000 ta yozuv bo'yicha hisoblangan bo'lardi.
     */
    const all = await prisma.student.findMany({
      where: { NOT: { barriers: { isEmpty: true } } },
      select: { barriers: true, helpResolved: true },
    });

    const rows = await prisma.student.findMany({
      where: { NOT: { barriers: { isEmpty: true } } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        gender: true,
        grade: true,
        school: true,
        mahalla: true,
        phone: true,
        parentPhone: true,
        barriers: true,
        createdAt: true,
        helpResolved: true,
        helpResolvedAt: true,
      },
      // Kutayotganlar birinchi: ro'yxat cheklansa ham ish
      // talab qiladigan yozuvlar chetda qolmaydi
      orderBy: [{ helpResolved: 'asc' }, { createdAt: 'desc' }],
      take: LIST_LIMIT,
    });

    const items = rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      helpResolvedAt: r.helpResolvedAt?.toISOString() ?? null,
      needsHelp: needsHelp(r.barriers),
    }));

    /*
     * Sabablar bo'yicha yig'indi. Har bir sabab uchun ikkita raqam:
     * qancha bola shu muammoni aytgan va ulardan qanchasi hal qilingan.
     * Hokimga kerak bo'ladigan "shuncha edi, shunchasi hal qilindi"
     * qatori aynan shu yerdan chiqadi.
     */
    const byBarrier = new Map<string, { count: number; resolved: number }>();
    for (const r of all) {
      for (const b of r.barriers) {
        const cell = byBarrier.get(b) ?? { count: 0, resolved: 0 };
        cell.count += 1;
        if (r.helpResolved) cell.resolved += 1;
        byBarrier.set(b, cell);
      }
    }

    const aralashuv = all.filter((r) => needsHelp(r.barriers));

    return NextResponse.json({
      items,
      total: all.length,
      needHelp: aralashuv.length,
      resolved: aralashuv.filter((r) => r.helpResolved).length,
      pending: aralashuv.filter((r) => !r.helpResolved).length,
      /** Ro'yxatga hammasi sig'dimi — sig'masa panel ogohlantiradi */
      truncated: all.length > rows.length,
      byBarrier: Array.from(byBarrier.entries())
        .map(([name, v]) => ({ name, count: v.count, resolved: v.resolved }))
        .sort((a, b) => b.count - a.count),
    });
  } catch (error) {
    console.error('[GET /api/admin/yordam]', error);
    return NextResponse.json(
      { message: "Ro'yxatni yuklab bo'lmadi" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/yordam — bitta o'quvchining yordam holatini o'zgartiradi.
 *
 * Body: `{ id: string, resolved: boolean }`
 *
 * Anketaning o'ziga tegilmaydi — faqat hokimiyatning javobi yoziladi.
 * Shu sababli xatoni orqaga qaytarish ham mumkin: `resolved: false`
 * yuborilsa, yozuv yana "kutmoqda" holatiga tushadi.
 */
export async function PATCH(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as { id?: unknown; resolved?: unknown };

    if (typeof body.id !== 'string' || !body.id) {
      return NextResponse.json({ message: "O'quvchi tanlanmagan" }, { status: 400 });
    }
    if (typeof body.resolved !== 'boolean') {
      return NextResponse.json({ message: 'Holat noto\'g\'ri' }, { status: 400 });
    }

    const updated = await prisma.student.update({
      where: { id: body.id },
      data: {
        helpResolved: body.resolved,
        helpResolvedAt: body.resolved ? new Date() : null,
      },
      select: { id: true, helpResolved: true, helpResolvedAt: true },
    });

    return NextResponse.json({
      ...updated,
      helpResolvedAt: updated.helpResolvedAt?.toISOString() ?? null,
    });
  } catch (error) {
    console.error('[PATCH /api/admin/yordam]', error);
    return NextResponse.json(
      { message: "Holatni saqlab bo'lmadi" },
      { status: 500 }
    );
  }
}
