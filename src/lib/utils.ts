import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind sinflarini xavfsiz birlashtiradi */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Sanani o'zbekcha formatda ko'rsatadi: 04.09.2026, 14:35 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Foizni butun songa yaxlitlaydi (0 ga bo'linishdan himoyalangan) */
export function percent(part: number, total: number): number {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

/**
 * Matndagi turli apostroflarni (' ' ʻ ʼ ` ´) bitta ko'rinishga keltiradi.
 * "Bog'ishamol" va "Bogʻishamol" bir xil yoziladi.
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’ʻʼ`´′]/g, "'")
    .trim();
}

/**
 * Qidiruv uchun kalit: apostrof, defis va bo'shliqlar butunlay
 * olib tashlanadi.
 *
 * Bu muhim, chunki o'quvchilar (va hokimiyat xodimlari) mahalla nomini
 * qanday yozishi oldindan ma'lum emas. Quyidagilarning barchasi bitta
 * mahallani topishi kerak:
 *
 *   "Bog'ishamol"  <- bogishamol, bogʻishamol
 *   "Oq-oltin"     <- oqoltin, oq oltin, oq-oltin
 *   "Chechak ota"  <- chechakota, chechak ota
 *   "Ikrom Karvon" <- karvon, ikromkarvon
 */
export function searchKey(text: string): string {
  return normalize(text).replace(/['\-\s]/g, '');
}

/** Ismning bosh harflari — avatar uchun */
export function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/** Telefon raqamini chiroyli ko'rinishga keltiradi: +998 90 123 45 67 */
export function formatPhone(phone?: string | null): string {
  if (!phone) return '—';
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 12) return phone;
  return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
}

/** Uzun matnni qisqartiradi */
export function truncate(text: string, max = 60): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
