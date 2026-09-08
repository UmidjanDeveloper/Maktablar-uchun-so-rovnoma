import { NextResponse, type NextRequest } from 'next/server';
import { checkCredentials, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth';
import { loginSchema, fieldErrors } from '@/lib/validation';
import { findEnvProblems, isAdminLoginAllowed, warnAboutEnvProblems } from '@/lib/env-check';
import { checkRateLimit, getClientIp, resetRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// Server ishga tushganda sozlamalarni bir marta tekshiramiz
warnAboutEnvProblems();

/**
 * Kirish urinishlari chegarasi.
 *
 * Sayt manzili ochiq (kelajakegasi.uz), parol esa odam eslab
 * qoladigan darajada oddiy. Chegarasiz bo'lsa, parolni daqiqasiga
 * minglab marta sinab ko'rish mumkin edi.
 *
 * 8 ta urinish 5 daqiqada: parolni unutgan xodimga yetarli,
 * avtomatik tanlashga esa umuman yetmaydi.
 */
const LOGIN_LIMIT = 8;
const LOGIN_WINDOW_MS = 5 * 60 * 1000;

/** POST /api/auth/login — admin panelga kirish */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`login:${ip}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        message: `Juda ko'p urinish. ${Math.ceil(limit.retryAfter / 60)} daqiqadan so'ng qayta urinib ko'ring.`,
      },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  // Ishlab chiqarishda standart parol/kalit qolib ketgan bo'lsa — kirishni
  // umuman taqiqlaymiz. Aks holda platforma ochiq qolib ketadi.
  if (!isAdminLoginAllowed()) {
    const problems = findEnvProblems().map((p) => p.message);
    console.error('[login] Xavfsiz bo\'lmagan sozlamalar:', problems);
    return NextResponse.json(
      {
        message:
          "Server sozlamalari xavfsiz emas: standart parol yoki sessiya kaliti o'zgartirilmagan. Tizim administratoriga murojaat qiling.",
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "So'rov formati noto'g'ri" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Ma'lumotlarni to'ldiring", errors: fieldErrors(parsed.error) },
      { status: 422 }
    );
  }

  const { username, password } = parsed.data;

  if (!checkCredentials(username, password)) {
    return NextResponse.json(
      { message: "Login yoki parol noto'g'ri" },
      { status: 401 }
    );
  }

  /*
   * Muvaffaqiyatli kirishdan keyin hisoblagichni tozalaymiz: xodim
   * parolni bir marta xato yozib, keyin to'g'ri kirsa, chegara uni
   * keyingi safar bloklab qo'ymasligi kerak.
   */
  resetRateLimit(`login:${ip}`);

  const token = await createSessionToken(username);
  const response = NextResponse.json({ message: 'Xush kelibsiz!' });

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}
