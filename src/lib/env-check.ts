/**
 * ============================================================
 *  Muhit sozlamalarining xavfsizligini tekshirish
 *
 *  Eng katta xavf: loyihani `admin123` paroli bilan internetga
 *  chiqarib yuborish. Bunda birinchi qiziquvchan o'quvchi
 *  /admin/login ni topib, butun tumandagi ma'lumotni ko'radi.
 *
 *  Shu sababli ishlab chiqarish (production) rejimida standart
 *  qiymatlar qolib ketgan bo'lsa — tizimga kirishga umuman
 *  ruxsat berilmaydi.
 * ============================================================
 */

/** Hech qachon ishlab chiqarishda qolmasligi kerak bo'lgan qiymatlar */
const DEFAULT_PASSWORD = 'admin123';
const DEFAULT_SECRET = 'kelajak-egasi-development-secret-key-almashtiring';
const EXAMPLE_SECRET = 'bu-kalitni-albatta-ozgartiring-kamida-32-belgi';

/** Sessiya kaliti uchun eng kam uzunlik */
const MIN_SECRET_LENGTH = 32;

export interface EnvProblem {
  variable: string;
  message: string;
}

/**
 * Xavfsizlik muammolari ro'yxatini qaytaradi.
 * Bo'sh massiv — hammasi joyida degani.
 */
export function findEnvProblems(): EnvProblem[] {
  const problems: EnvProblem[] = [];

  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!password) {
    problems.push({
      variable: 'ADMIN_PASSWORD',
      message: "ADMIN_PASSWORD o'rnatilmagan",
    });
  } else if (password === DEFAULT_PASSWORD) {
    problems.push({
      variable: 'ADMIN_PASSWORD',
      message: `ADMIN_PASSWORD hali ham namunaviy "${DEFAULT_PASSWORD}" qiymatida`,
    });
  } else if (password.length < 12) {
    problems.push({
      variable: 'ADMIN_PASSWORD',
      message: "ADMIN_PASSWORD kamida 12 ta belgidan iborat bo'lishi kerak",
    });
  }

  if (!secret) {
    problems.push({
      variable: 'ADMIN_SESSION_SECRET',
      message: "ADMIN_SESSION_SECRET o'rnatilmagan",
    });
  } else if (secret === DEFAULT_SECRET || secret === EXAMPLE_SECRET) {
    problems.push({
      variable: 'ADMIN_SESSION_SECRET',
      message: 'ADMIN_SESSION_SECRET namunaviy qiymatda qolgan',
    });
  } else if (secret.length < MIN_SECRET_LENGTH) {
    problems.push({
      variable: 'ADMIN_SESSION_SECRET',
      message: `ADMIN_SESSION_SECRET kamida ${MIN_SECRET_LENGTH} ta belgi bo'lishi kerak`,
    });
  }

  return problems;
}

/**
 * Ishlab chiqarish rejimida sozlamalar xavfsizmi?
 * Ishlab chiqish (development) rejimida har doim `true` —
 * lokal ishlashga xalaqit bermaslik uchun.
 */
export function isAdminLoginAllowed(): boolean {
  if (process.env.NODE_ENV !== 'production') return true;
  return findEnvProblems().length === 0;
}

/**
 * Server ishga tushganda konsolga ogohlantirish chiqaradi.
 * Modul birinchi marta yuklanganda bir marta bajariladi.
 */
export function warnAboutEnvProblems(): void {
  const problems = findEnvProblems();
  if (problems.length === 0) return;

  const isProd = process.env.NODE_ENV === 'production';
  const title = isProd
    ? '🚨 XAVFSIZLIK: admin panelga kirish BLOKLANDI'
    : '⚠️  Ogohlantirish: standart xavfsizlik sozlamalari ishlatilmoqda';

  console.warn(`\n${'='.repeat(64)}\n${title}\n${'='.repeat(64)}`);
  for (const problem of problems) {
    console.warn(`  • ${problem.message}`);
  }
  console.warn('\n  Yechim: .env faylida (yoki Vercel Environment Variables da)');
  console.warn('  quyidagilarni o\'zgartiring:');
  console.warn('    ADMIN_PASSWORD="<kuchli parol>"');
  console.warn('    ADMIN_SESSION_SECRET="<openssl rand -base64 32 natijasi>"');
  console.warn(`${'='.repeat(64)}\n`);
}
