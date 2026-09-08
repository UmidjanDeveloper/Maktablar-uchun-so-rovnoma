/**
 * ============================================================
 *  Takroriy anketani aniqlash kaliti
 *
 *  Muammo: bitta sinfda bir xil ismli ikkita o'quvchi bo'lishi
 *  mumkin ("Jasur Islomov" Xatirchida kam uchraydigan ism emas).
 *  Faqat ism + familiya + maktab + sinf bo'yicha tekshirilsa,
 *  ikkinchi bolaga anketa to'ldirishga ruxsat berilmasdi.
 *
 *  Yechim: kalitga telefon raqami ham qo'shildi.
 *    • Ikki bir xil ismli o'quvchi turli raqam kiritsa — ikkalasi ham o'tadi
 *    • Bitta o'quvchi ikki marta yuborsa — ikkinchisi bloklanadi
 *
 *  Kalit bazada `@unique` — shu sababli bir vaqtning o'zida kelgan
 *  ikkita bir xil so'rov ham ikkita yozuv yarata olmaydi (oflayn
 *  navbat sinxronlanayotganda bu real xavf).
 * ============================================================
 */
import { normalize, toshkentKuni } from './utils';

/**
 * Telefon raqamini taqqoslash uchun normallashtiradi:
 * faqat raqamlar qoladi. "+998 90 123 45 67" va "998901234567"
 * bir xil deb hisoblanadi.
 */
export function normalizePhone(phone?: string | null): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

/**
 * Anketa uchun takrorlanmas kalit yasaydi.
 *
 * @param phone Telefon raqami (ixtiyoriy). Kiritilmagan bo'lsa,
 *              kalit faqat ism/maktab/sinf asosida quriladi.
 * @param date  Anketa topshirilgan sana (standart: hozir)
 */
export function buildDedupeKey(
  firstName: string,
  lastName: string,
  school: string,
  grade: number,
  phone?: string | null,
  date: Date = new Date()
): string {
  // Sana faqat kun aniqligida — shu kun ichidagi takrorlar bloklanadi.
  // Kun Toshkent vaqti bo'yicha, ya'ni maktab kuni bilan bir xil
  // chegarada tugaydi (UTC da bo'lsa kun soat 05:00 da almashardi).
  const day = toshkentKuni(date);
  return [
    normalize(firstName),
    normalize(lastName),
    normalize(school),
    grade,
    normalizePhone(phone),
    day,
  ].join('|');
}
