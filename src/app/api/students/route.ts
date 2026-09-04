import { NextResponse, type NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { buildDedupeKey } from '@/lib/dedupe';
import { studentSchema, fieldErrors } from '@/lib/validation';
import { buildWhere, parseFilters } from '@/lib/filters';
import { requireAdmin } from '@/lib/api-auth';
import type { PaginatedStudents } from '@/types';

export const dynamic = 'force-dynamic';

/** Takroriy anketani aniqlash oynasi — 24 soat */
const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * POST /api/students — yangi anketani saqlash (ochiq, login talab qilinmaydi)
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "So'rov formati noto'g'ri" }, { status: 400 });
  }

  // 1. Validatsiya (o'zbekcha xato xabarlari bilan)
  const parsed = studentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Ma'lumotlarda xatolik bor",
        errors: fieldErrors(parsed.error),
      },
      { status: 422 }
    );
  }

  const data = parsed.data;

  try {
    // 2. Takroriy topshiruvni tekshirish:
    //    bir xil ism + familiya + maktab + sinf 24 soat ichida qayta kiritilmaydi
    const duplicate = await prisma.student.findFirst({
      where: {
        firstName: { equals: data.firstName, mode: 'insensitive' },
        lastName: { equals: data.lastName, mode: 'insensitive' },
        school: data.school,
        grade: data.grade,
        createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
      },
      select: { id: true, createdAt: true },
    });

    if (duplicate) {
      return NextResponse.json(
        {
          message:
            "Bu ma'lumotlar bilan anketa oxirgi 24 soat ichida allaqachon topshirilgan. Rahmat!",
          duplicate: true,
        },
        { status: 409 }
      );
    }

    // 3. Saqlash ("consent" bazaga yozilmaydi — u faqat forma sharti)
    const student = await prisma.student.create({
      data: {
        dedupeKey: buildDedupeKey(data.firstName, data.lastName, data.school, data.grade),
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        phone: data.phone ?? null,
        parentPhone: data.parentPhone ?? null,
        region: data.region,
        district: data.district,
        mahalla: data.mahalla,
        school: data.school,
        grade: data.grade,
        favoriteSubjects: data.favoriteSubjects,
        clubs: data.clubs,
        dreamJob: data.dreamJob,
        jobCategory: data.jobCategory,
        motivation: data.motivation ?? null,
        inspiration: data.inspiration ?? null,
        studyAbroad: data.studyAbroad ?? null,
        futureContribution: data.futureContribution ?? null,
      },
      select: { id: true, firstName: true, dreamJob: true },
    });

    return NextResponse.json({ message: 'Anketa qabul qilindi', student }, { status: 201 });
  } catch (error) {
    // Bazadagi `dedupeKey` cheklovi ishga tushdi — demak, xuddi shu anketa
    // ayni damda parallel so'rov orqali allaqachon yozilgan.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        {
          message:
            "Bu ma'lumotlar bilan anketa allaqachon topshirilgan. Rahmat!",
          duplicate: true,
        },
        { status: 409 }
      );
    }
    console.error('[POST /api/students]', error);
    return NextResponse.json(
      { message: "Serverda xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/students — anketalar ro'yxati (faqat admin uchun)
 * Query: filtrlar + `search`, `page`, `pageSize`, `all=1` (eksport uchun)
 */
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { searchParams } = request.nextUrl;
  const filters = parseFilters(searchParams);
  const search = searchParams.get('search');
  const where = buildWhere(filters, search);

  // Eksport rejimi: sahifalashsiz barcha yozuvlar
  const exportAll = searchParams.get('all') === '1';
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);
  const pageSize = exportAll
    ? 20000
    : Math.min(200, Math.max(5, Number(searchParams.get('pageSize') ?? '10') || 10));

  try {
    const [total, items] = await Promise.all([
      prisma.student.count({ where }),
      prisma.student.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: exportAll ? 0 : (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const payload: PaginatedStudents = {
      items: items.map((s) => ({ ...s, createdAt: s.createdAt.toISOString() })),
      total,
      page: exportAll ? 1 : page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error('[GET /api/students]', error);
    return NextResponse.json({ message: "Ma'lumotlarni yuklab bo'lmadi" }, { status: 500 });
  }
}
