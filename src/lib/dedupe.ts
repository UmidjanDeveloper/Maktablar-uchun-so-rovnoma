/**
 * ============================================================
 *  Takroriy anketani aniqlash kaliti
 *
 *  Bir xil o'quvchi (ism + familiya + maktab + sinf) bir kunda
 *  faqat bitta anketa topshira oladi. Kalit ma'lumotlar bazasida
 *  `@unique` sifatida saqlanadi — shu sababli bir vaqtning o'zida
 *  kelgan ikkita bir xil so'rov ham ikkita yozuv yarata olmaydi
 *  (oflayn navbat sinxronlanayotganda bu real xavf).
 * ============================================================
 */
import { normalize } from './utils';

/**
 * Anketa uchun takrorlanmas kalit yasaydi.
 * @param date Anketa topshirilgan sana (standart: hozir)
 */
export function buildDedupeKey(
  firstName: string,
  lastName: string,
  school: string,
  grade: number,
  date: Date = new Date()
): string {
  // Sana faqat kun aniqligida — shu kun ichidagi takrorlar bloklanadi
  const day = date.toISOString().slice(0, 10);
  return [normalize(firstName), normalize(lastName), normalize(school), grade, day].join('|');
}
