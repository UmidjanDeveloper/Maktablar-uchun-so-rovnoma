import { createHash, timingSafeEqual } from 'crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { buildIdrokStats } from '@/lib/idrok-stats';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Javob hech qayerda (Vercel, brauzer, proksi) keshlanmasligi kerak */
const NO_STORE = { 'Cache-Control': 'no-store' };

/**
 * Kalit uchun eng kam uzunlik. Qisqa kalit bilan endpoint ochiq
 * qolgandan ko'ra umuman o'chiq turgani xavfsizroq.
 */
const MIN_KEY_LENGTH = 16;

/**
 * Kalitlarni doimiy vaqtda taqqoslaydi.
 * Ikkalasi ham avval SHA-256 ga aylantiriladi — shunda uzunliklar
 * har doim teng bo'ladi va kalit uzunligi ham sizib chiqmaydi.
 */
function keyMatches(given: string, expected: string): boolean {
  const a = createHash('sha256').update(given, 'utf8').digest();
  const b = createHash('sha256').update(expected, 'utf8').digest();
  return timingSafeEqual(a, b);
}

/**
 * GET /api/idrok/stats — IDROK AI yordamchisi uchun yashirin statistika.
 *
 * Himoya: `X-IDROK-Key` sarlavhasi muhitdagi `IDROK_API_KEY` ga teng
 * bo'lishi kerak. Kalit sozlanmagan bo'lsa endpoint o'chiq (404).
 * Javobda faqat yig'indilar bor — ism, telefon va boshqa shaxsiy
 * ma'lumot qaytarilmaydi. Bazaga hech narsa yozilmaydi.
 */
export async function GET(request: NextRequest) {
  const expected = process.env.IDROK_API_KEY?.trim() ?? '';
  if (!expected) {
    return NextResponse.json({ xato: 'Topilmadi' }, { status: 404, headers: NO_STORE });
  }
  if (expected.length < MIN_KEY_LENGTH) {
    console.error(`[GET /api/idrok/stats] IDROK_API_KEY juda qisqa (kamida ${MIN_KEY_LENGTH} belgi kerak) — endpoint o'chiq`);
    return NextResponse.json({ xato: 'Topilmadi' }, { status: 404, headers: NO_STORE });
  }

  const given = request.headers.get('x-idrok-key') ?? '';
  if (!keyMatches(given, expected)) {
    return NextResponse.json({ xato: "Ruxsat yo'q" }, { status: 401, headers: NO_STORE });
  }

  try {
    const stats = await buildIdrokStats();
    return NextResponse.json(stats, { headers: NO_STORE });
  } catch (error) {
    console.error('[GET /api/idrok/stats]', error);
    return NextResponse.json(
      { xato: "Statistikani hisoblab bo'lmadi" },
      { status: 500, headers: NO_STORE }
    );
  }
}
