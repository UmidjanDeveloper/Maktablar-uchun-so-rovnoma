/**
 * ============================================================
 *  Admin panel autentifikatsiyasi
 *  Oddiy, tashqi kutubxonasiz yechim: HMAC-SHA256 bilan
 *  imzolangan cookie. Web Crypto API ishlatilgani uchun kod
 *  ham Node.js, ham Edge (middleware) muhitida ishlaydi.
 * ============================================================
 */

export const SESSION_COOKIE = 'kelajak_admin_session';
/** Sessiya amal qilish muddati — 8 soat (bir ish kuni) */
export const SESSION_MAX_AGE = 60 * 60 * 8;

interface SessionPayload {
  /** Foydalanuvchi logini */
  u: string;
  /** Tugash vaqti (Unix, sekundlarda) */
  exp: number;
}

const encoder = new TextEncoder();

/** Muhitdan maxfiy kalitni oladi */
function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    // Zaxira qiymat — faqat lokal ishlab chiqish uchun.
    'kelajak-egasi-development-secret-key-almashtiring'
  );
}

/** base64url kodlash (cookie uchun xavfsiz) */
function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** base64url dekodlash */
function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** HMAC kalitini import qiladi */
async function importKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/** Berilgan login uchun imzolangan sessiya tokenini yaratadi */
export async function createSessionToken(username: string): Promise<string> {
  const payload: SessionPayload = {
    u: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await importKey();
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

/**
 * Tokenni tekshiradi. To'g'ri va muddati o'tmagan bo'lsa login qaytaradi,
 * aks holda `null`.
 */
export async function verifySessionToken(token?: string | null): Promise<string | null> {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  try {
    const key = await importKey();
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      fromBase64Url(signature),
      encoder.encode(body)
    );
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload.u;
  } catch {
    return null;
  }
}

/**
 * Login va parolni muhit o'zgaruvchilari bilan solishtiradi.
 * Vaqt hujumlaridan (timing attack) himoyalanish uchun taqqoslash
 * doimiy vaqtda bajariladi.
 */
export function checkCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME || 'hokimiyat';
  const expectedPass = process.env.ADMIN_PASSWORD || 'admin123';
  return safeEqual(username, expectedUser) && safeEqual(password, expectedPass);
}

/** Ikkita satrni doimiy vaqtda taqqoslaydi */
function safeEqual(a: string, b: string): boolean {
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  // Uzunliklar farq qilsa ham to'liq sikl bajariladi
  let diff = aBytes.length ^ bBytes.length;
  const len = Math.max(aBytes.length, bBytes.length);
  for (let i = 0; i < len; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return diff === 0;
}
