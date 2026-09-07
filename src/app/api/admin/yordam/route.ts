import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { YORDAM_TOSIQLARI } from '@/lib/constants';

export const dynamic = 'force-dynamic';

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
      orderBy: { createdAt: 'desc' },
      take: 1000,
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
    for (const r of rows) {
      for (const b of r.barriers) {
        const cell = byBarrier.get(b) ?? { count: 0, resolved: 0 };
        cell.count += 1;
        if (r.helpResolved) cell.resolved += 1;
        byBarrier.set(b, cell);
      }
    }

    const aralashuv = items.filter((i) => i.needsHelp);

    return NextResponse.json({
      items,
      total: items.length,
      needHelp: aralashuv.length,
      resolved: aralashuv.filter((i) => i.helpResolved).length,
      pending: aralashuv.filter((i) => !i.helpResolved).length,
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
