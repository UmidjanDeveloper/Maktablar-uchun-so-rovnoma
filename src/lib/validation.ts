/**
 * ============================================================
 *  Zod validatsiya sxemalari — barcha xato xabarlari o'zbekcha
 *  Bir xil sxema ham brauzerda, ham serverda (API) ishlatiladi.
 * ============================================================
 */
import { z } from 'zod';
import { JINSLAR, SINFLAR } from './constants';

/** +998 XX XXX XX XX formatidagi raqam (bo'shliq va tirelarga ruxsat) */
const PHONE_REGEX = /^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;

/** Ixtiyoriy telefon maydoni — bo'sh bo'lsa `undefined` ga aylanadi */
const optionalPhone = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v === '' ? undefined : v))
  .refine((v) => v === undefined || PHONE_REGEX.test(v), {
    message: "Telefon raqami +998 XX XXX XX XX ko'rinishida bo'lishi kerak",
  });

/** Ixtiyoriy uzun matn maydoni */
const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, { message: `${label} ${max} ta belgidan oshmasligi kerak` })
    .optional()
    .transform((v) => (v === '' ? undefined : v));

/** 1-qadam: shaxsiy ma'lumotlar */
export const step1Schema = z.object({
  firstName: z
    .string({ required_error: 'Ismingizni kiriting' })
    .trim()
    .min(2, { message: "Ism kamida 2 ta harfdan iborat bo'lishi kerak" })
    .max(50, { message: 'Ism 50 ta belgidan oshmasligi kerak' }),
  lastName: z
    .string({ required_error: 'Familiyangizni kiriting' })
    .trim()
    .min(2, { message: "Familiya kamida 2 ta harfdan iborat bo'lishi kerak" })
    .max(50, { message: 'Familiya 50 ta belgidan oshmasligi kerak' }),
  gender: z.enum(JINSLAR, {
    errorMap: () => ({ message: 'Jinsingizni tanlang' }),
  }),
  mahalla: z
    .string({ required_error: 'Mahallangizni tanlang' })
    .trim()
    .min(1, { message: 'Mahallangizni tanlang' }),
  school: z
    .string({ required_error: 'Maktabingizni tanlang' })
    .trim()
    .min(1, { message: 'Maktabingizni tanlang' }),
  grade: z.coerce
    .number({ required_error: 'Sinfingizni tanlang', invalid_type_error: 'Sinfingizni tanlang' })
    .refine((v) => SINFLAR.includes(v), { message: 'Sinf 5 dan 11 gacha bo\'lishi kerak' }),
  phone: optionalPhone,
  parentPhone: optionalPhone,
  region: z.string().trim().min(1).default('Navoiy'),
  district: z.string().trim().min(1).default('Xatirchi'),
});

/** 2-qadam: qiziqishlar */
export const step2Schema = z.object({
  favoriteSubjects: z
    .array(z.string())
    .min(1, { message: 'Kamida bitta fanni tanlang' })
    .max(10, { message: "Ko'pi bilan 10 ta fan tanlash mumkin" }),
  clubs: z.array(z.string()).default([]),
});

/** 3-qadam: orzu qilingan kasb */
export const step3Schema = z.object({
  dreamJob: z
    .string({ required_error: 'Orzuingizdagi kasbni tanlang' })
    .trim()
    .min(1, { message: 'Orzuingizdagi kasbni tanlang' }),
  jobCategory: z
    .string({ required_error: 'Kasb yo\'nalishi aniqlanmadi' })
    .trim()
    .min(1, { message: "Kasb yo'nalishi aniqlanmadi" }),
  motivation: optionalText(500, 'Javob'),
});

/** 4-qadam: kelajak rejalari va rozilik */
export const step4Schema = z.object({
  inspiration: optionalText(100, 'Javob'),
  studyAbroad: optionalText(50, 'Javob'),
  futureContribution: optionalText(500, 'Javob'),
  consent: z.literal(true, {
    errorMap: () => ({
      message: 'Anketani yuborish uchun rozilikni tasdiqlang',
    }),
  }),
});

/** Anketaning to'liq sxemasi — server tomonda shu ishlatiladi */
export const studentSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);

export type StudentInput = z.infer<typeof studentSchema>;
export type Step1Input = z.infer<typeof step1Schema>;
export type Step2Input = z.infer<typeof step2Schema>;
export type Step3Input = z.infer<typeof step3Schema>;
export type Step4Input = z.infer<typeof step4Schema>;

/** Admin panelga kirish sxemasi */
export const loginSchema = z.object({
  username: z
    .string({ required_error: 'Loginni kiriting' })
    .trim()
    .min(1, { message: 'Loginni kiriting' }),
  password: z
    .string({ required_error: 'Parolni kiriting' })
    .min(1, { message: 'Parolni kiriting' }),
});

/** Katalog elementi (mahalla/maktab) sxemasi */
export const catalogItemSchema = z.object({
  name: z
    .string({ required_error: 'Nomini kiriting' })
    .trim()
    .min(2, { message: "Nomi kamida 2 ta belgidan iborat bo'lishi kerak" })
    .max(100, { message: 'Nomi 100 ta belgidan oshmasligi kerak' }),
});

/** Kasb sxemasi */
export const professionSchema = z.object({
  name: z
    .string({ required_error: 'Kasb nomini kiriting' })
    .trim()
    .min(2, { message: "Kasb nomi kamida 2 ta belgidan iborat bo'lishi kerak" })
    .max(100, { message: 'Kasb nomi 100 ta belgidan oshmasligi kerak' }),
  category: z
    .string({ required_error: "Yo'nalishni tanlang" })
    .trim()
    .min(2, { message: "Yo'nalishni tanlang" }),
  icon: z
    .string({ required_error: 'Emoji belgisini kiriting' })
    .trim()
    .min(1, { message: 'Emoji belgisini kiriting' })
    .max(8, { message: 'Faqat bitta emoji kiriting' }),
});

/**
 * Zod xatolarini {maydon: xabar} ko'rinishidagi oddiy obyektga aylantiradi —
 * forma komponentlarida ishlatish qulay bo'lishi uchun.
 */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.errors) {
    const key = issue.path.join('.') || '_form';
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
