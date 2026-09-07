import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { YORDAM_TOSIQLARI } from '@/lib/constants';

export const dynamic = 'force-dynamic';

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
      },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });

    const items = rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      /** Hokimiyat aralashuvi talab qiladigan sabab bormi */
      needsHelp: r.barriers.some((b) =>
        (YORDAM_TOSIQLARI as readonly string[]).includes(b)
      ),
    }));

    // Sabablar bo'yicha yig'indi — qaysi muammo ko'p uchraydi
    const byBarrier = new Map<string, number>();
    for (const r of rows) {
      for (const b of r.barriers) byBarrier.set(b, (byBarrier.get(b) ?? 0) + 1);
    }

    return NextResponse.json({
      items,
      total: items.length,
      needHelp: items.filter((i) => i.needsHelp).length,
      byBarrier: Array.from(byBarrier.entries())
        .map(([name, count]) => ({ name, count }))
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
