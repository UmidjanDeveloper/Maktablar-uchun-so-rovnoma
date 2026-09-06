import { NextResponse, type NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { buildDedupeKey, normalizePhone } from '@/lib/dedupe';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { studentSchema, fieldErrors } from '@/lib/validation';
import { buildWhere, parseFilters } from '@/lib/filters';
import { requireAdmin } from '@/lib/api-auth';
import type { PaginatedStudents } from '@/types';

export const dynamic = 'force-dynamic';

/** Takroriy anketani aniqlash oynasi — 24 soat */
const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Bitta IP manzildan bir daqiqada ruxsat etilgan anketalar soni.
 *
 * MUHIM: maktab kompyuter sinfidagi barcha kompyuterlar odatda BITTA
 * tashqi IP ortida (NAT) turadi. Ya'ni 15 ta o'quvchi bir dars davomida
 * anketani deyarli bir vaqtda tugatsa, ularning hammasi bitta IP dan
 * kelgandek ko'rinadi.
 *
 * Shu sababli chegara ataylab yuqori qo'yilgan: maqsad bir bolaning
 * F5 ni bosaverishini to'xtatish, sinfni bloklash emas. Bir xil
 * ma'lumotni qayta yuborish `dedupeKey` cheklovi bilan allaqachon
 * to'xtatiladi, shuning uchun tezlik chegarasi faqat qo'shimcha himoya.
 */
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60 * 1000;

/**
 * POST /api/students — yangi anketani saqlash (ochiq, login talab qilinmaydi)
 */
export async function POST(request: NextRequest) {
  // 0. Tezlik chegarasi — bitta kompyuterdan ketma-ket yuborishning oldini oladi
  const ip = getClientIp(request);
  const limit = checkRateLimit(`students:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        message: `Juda ko'p urinish. ${limit.retryAfter} soniyadan so'ng qayta urinib ko'ring.`,
      },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

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
    // 2. Takroriy topshiruvni tekshirish (24 soatlik oyna).
    //    Bir xil ism + familiya + maktab + sinf topilsa ham, telefon
    //    raqamlari har xil bo'lsa — bu ikki xil o'quvchi deb qabul qilinadi.
    const candidates = await prisma.student.findMany({
      where: {
        firstName: { equals: data.firstName, mode: 'insensitive' },
        lastName: { equals: data.lastName, mode: 'insensitive' },
        school: data.school,
        grade: data.grade,
        createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
      },
      select: { id: true, phone: true },
      take: 20,
    });

    const incomingPhone = normalizePhone(data.phone);
    const duplicate = candidates.some((c) => normalizePhone(c.phone) === incomingPhone);

    if (duplicate) {
      return NextResponse.json(
        {
          message: incomingPhone
            ? "Bu ma'lumotlar bilan anketa oxirgi 24 soat ichida allaqachon topshirilgan. Rahmat!"
            : "Bu ism va familiya bilan anketa oxirgi 24 soat ichida topshirilgan. Agar siz boshqa o'quvchi bo'lsangiz, telefon raqamingizni kiriting va qayta urinib ko'ring.",
          duplicate: true,
        },
        { status: 409 }
      );
    }

    // 3. Saqlash ("consent" bazaga yozilmaydi — u faqat forma sharti)
    const student = await prisma.student.create({
      data: {
        dedupeKey: buildDedupeKey(
          data.firstName,
          data.lastName,
          data.school,
          data.grade,
          data.phone
        ),
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
        wantedCourses: data.wantedCourses,
        wantedLanguages: data.wantedLanguages,
        travelWillingness: data.travelWillingness,
        barriers: data.barriers,
        availableTimes: data.availableTimes,
        homeTech: data.homeTech ?? null,
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
          message: data.phone
            ? "Bu ma'lumotlar bilan anketa allaqachon topshirilgan. Rahmat!"
            : "Bu ism va familiya bilan anketa allaqachon topshirilgan. Agar siz boshqa o'quvchi bo'lsangiz, telefon raqamingizni kiriting.",
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
