import { NextResponse, type NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { professionSchema, fieldErrors } from '@/lib/validation';
import { requireAdmin } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

/** GET /api/admin/kasblar — kasblar ro'yxati */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const items = await prisma.profession.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error('[GET /api/admin/kasblar]', error);
    return NextResponse.json({ message: "Ro'yxatni yuklab bo'lmadi" }, { status: 500 });
  }
}

/** POST /api/admin/kasblar — yangi kasb qo'shish */
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "So'rov formati noto'g'ri" }, { status: 400 });
  }

  const parsed = professionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Ma'lumotlarda xatolik bor", errors: fieldErrors(parsed.error) },
      { status: 422 }
    );
  }

  try {
    const item = await prisma.profession.create({ data: parsed.data });
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ message: "Bunday kasb allaqachon mavjud" }, { status: 409 });
    }
    console.error('[POST /api/admin/kasblar]', error);
    return NextResponse.json({ message: "Saqlab bo'lmadi" }, { status: 500 });
  }
}
