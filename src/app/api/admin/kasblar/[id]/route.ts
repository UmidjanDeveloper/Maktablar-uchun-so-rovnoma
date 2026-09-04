import { NextResponse, type NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { professionSchema, fieldErrors } from '@/lib/validation';
import { requireAdmin } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

/** PATCH /api/admin/kasblar/[id] — kasb ma'lumotlarini o'zgartirish */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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
    const item = await prisma.profession.update({ where: { id: params.id }, data: parsed.data });
    return NextResponse.json({ item });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ message: 'Bunday kasb allaqachon mavjud' }, { status: 409 });
      }
      if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Kasb topilmadi' }, { status: 404 });
      }
    }
    console.error('[PATCH /api/admin/kasblar/[id]]', error);
    return NextResponse.json({ message: "O'zgartirib bo'lmadi" }, { status: 500 });
  }
}

/** DELETE /api/admin/kasblar/[id] — kasbni o'chirish */
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await prisma.profession.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "O'chirildi" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ message: 'Kasb topilmadi' }, { status: 404 });
    }
    console.error('[DELETE /api/admin/kasblar/[id]]', error);
    return NextResponse.json({ message: "O'chirib bo'lmadi" }, { status: 500 });
  }
}
