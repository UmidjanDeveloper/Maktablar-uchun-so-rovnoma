import { NextResponse, type NextRequest } from 'next/server';
import { checkCredentials, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth';
import { loginSchema, fieldErrors } from '@/lib/validation';

export const dynamic = 'force-dynamic';

/** POST /api/auth/login — admin panelga kirish */
export async function POST(request: NextRequest) {
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
