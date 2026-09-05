import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MAHALLALAR, MAKTABLAR, KASBLAR } from '@/lib/constants';
import { sortSchools } from '@/lib/utils';
import type { CatalogsResponse } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/catalogs — mahallalar, maktablar va kasblar ro'yxati.
 * Anketa sahifasi uchun ochiq (login talab qilinmaydi).
 *
 * Agar baza bo'sh bo'lsa yoki unga ulanib bo'lmasa — statik ro'yxat
 * qaytariladi, shunda anketa har qanday holatda ishlayveradi.
 */
export async function GET() {
  try {
    const [mahallalar, maktablar, kasblar] = await Promise.all([
      prisma.mahalla.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
      prisma.school.findMany({ select: { id: true, name: true } }),
      prisma.profession.findMany({
        select: { id: true, name: true, category: true, icon: true },
        orderBy: { name: 'asc' },
      }),
    ]);

    const payload: CatalogsResponse = {
      mahallalar: mahallalar.length
        ? mahallalar
        : MAHALLALAR.map((name) => ({ id: name, name })),
      // Maktablarni nom ichidagi raqam bo'yicha tartiblaymiz
      maktablar: maktablar.length
        ? sortSchools(maktablar, (m) => m.name)
        : MAKTABLAR.map((name) => ({ id: name, name })),
      kasblar: kasblar.length ? kasblar : KASBLAR.map((k) => ({ id: k.name, ...k })),
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error('[GET /api/catalogs]', error);
    // Bazaga ulanib bo'lmadi — zaxira (statik) ro'yxatni qaytaramiz
    return NextResponse.json({
      mahallalar: MAHALLALAR.map((name) => ({ id: name, name })),
      maktablar: MAKTABLAR.map((name) => ({ id: name, name })),
      kasblar: KASBLAR.map((k) => ({ id: k.name, ...k })),
    } satisfies CatalogsResponse);
  }
}
