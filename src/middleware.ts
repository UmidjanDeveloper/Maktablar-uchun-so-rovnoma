import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';

/**
 * Admin panelni himoyalaydi: sessiyasiz foydalanuvchini /admin/login ga
 * yo'naltiradi, allaqachon kirgan bo'lsa — dashboardga.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const user = await verifySessionToken(token);

  // Kirish sahifasi: sessiya bor bo'lsa dashboardga o'tkazamiz
  if (pathname === '/admin/login') {
    if (user) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Qolgan barcha /admin/* sahifalari himoyalangan
  if (!user) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
