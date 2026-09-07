/**
 * ============================================================
 *  Zod validatsiya sxemalari — barcha xato xabarlari o'zbekcha
 *  Bir xil sxema ham brauzerda, ham serverda (API) ishlatiladi.
 * ============================================================
 */
import { z } from 'zod';
import { HECH_QAYSI, JINSLAR, SINFLAR } from './constants';
import {
  ismniChiroyliQil,
  ismTekshir,
  telefonSaqlashUchun,
  telefonTekshir,
} from './inson-tekshiruvi';

/** Orzu kasb savoli shu sinfdan boshlab beriladi */
export const KASB_SAVOLI_SINFI = 10;

/** Berilgan sinfda orzu kasb savoli ko'rsatiladimi? */
export function kasbSavoliKerakmi(grade: number | ''): boolean {
  return typeof grade === 'number' && grade >= KASB_SAVOLI_SINFI;
}

/**
 * Ism maydoni.
 *
 * Maktabdagi sinovda bolalar "ajfjdjfjadfj" deb to'ldirdi — bunday
 * yozuv hokimiyat uchun foydasiz, chunki bolani topib bo'lmaydi.
 * `ismTekshir` haqiqiy ism tuzilishini tekshiradi va natijada
 * birinchi harf katta qilib saqlanadi.
 */
const ismMaydoni = (label: string) =>
  z
    .string({ required_error: `${label}ni kiriting` })
    .trim()
    .superRefine((v, ctx) => {
      const r = ismTekshir(v, label);
      if (!r.ok) ctx.addIssue({ code: z.ZodIssueCode.custom, message: r.xabar });
    })
    .transform(ismniChiroyliQil);

/**
 * Majburiy telefon maydoni.
 *
 * Ota-onaning raqami majburiy: hokimiyat to'siqqa uchragan bola
 * bo'yicha aynan ota-ona bilan bog'lanadi. Raqam qanday yozilishidan
 * qat'i nazar bazaga yagona ko'rinishda — `+998901234567` — tushadi.
 */
const majburiyTelefon = (label: string) =>
  z
    .string({ required_error: `${label}ni kiriting` })
    .trim()
    .superRefine((v, ctx) => {
      const r = telefonTekshir(v, label);
      if (!r.ok) ctx.addIssue({ code: z.ZodIssueCode.custom, message: r.xabar });
    })
    .transform((v) => telefonSaqlashUchun(v) ?? '');

/** Ixtiyoriy telefon — bo'sh qoldirilsa o'tadi, yozilsa tekshiriladi */
const ixtiyoriyTelefon = (label: string) =>
  z
    .string()
    .trim()
    .optional()
    .superRefine((v, ctx) => {
      if (!v) return;
      const r = telefonTekshir(v, label);
      if (!r.ok) ctx.addIssue({ code: z.ZodIssueCode.custom, message: r.xabar });
    })
    .transform((v) => (v ? (telefonSaqlashUchun(v) ?? undefined) : undefined));

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
  firstName: ismMaydoni('Ism'),
  lastName: ismMaydoni('Familiya'),
  gender: z.enum(JINSLAR, {
    errorMap: () => ({ message: 'Jinsingizni tanlang' }),
  }),
  // Mahalla va maktab ro'yxatdan tanlanadi, lekin ro'yxatda bo'lmasa
  // o'quvchi nomini qo'lda yozishi mumkin — shuning uchun uzunlik
  // chegarasi bor (bo'sh yoki bir harfli qiymat o'tmaydi).
  mahalla: z
    .string({ required_error: 'Mahallangizni tanlang' })
    .trim()
    .min(2, { message: "Mahallangizni tanlang yoki nomini yozing" })
    .max(120, { message: 'Mahalla nomi 120 ta belgidan oshmasligi kerak' }),
  school: z
    .string({ required_error: 'Maktabingizni tanlang' })
    .trim()
    .min(2, { message: "Maktabingizni tanlang yoki nomini yozing" })
    .max(250, { message: 'Maktab nomi 250 ta belgidan oshmasligi kerak' }),
  grade: z.coerce
    .number({ required_error: 'Sinfingizni tanlang', invalid_type_error: 'Sinfingizni tanlang' })
    .refine((v) => SINFLAR.includes(v), { message: 'Sinf 5 dan 11 gacha bo\'lishi kerak' }),
  phone: ixtiyoriyTelefon('Telefon raqami'),
  // Ota-onaning raqami MAJBURIY — to'siqqa uchragan bola bo'yicha
  // hokimiyat aynan ota-ona bilan bog'lanadi
  parentPhone: majburiyTelefon("Ota-onangiz telefon raqami"),
  region: z.string().trim().min(1).default('Navoiy'),
  district: z.string().trim().min(1).default('Xatirchi'),
});

/**
 * 2-qadam: qiziqishlar.
 *
 * To'siq savoli («nega bormaysan») faqat «Hech qaysi» tanlanganda
 * majburiy bo'ladi. To'garakka qatnaydigan bolaga bu savolni berish
 * ma'nosiz, qatnamaydiganidan esa sababini bilish shart — hokimiyat
 * aynan shu javob asosida yordam ko'rsatadi.
 */
export const step2Schema = z.object({
  favoriteSubjects: z
    .array(z.string())
    .min(1, { message: 'Kamida bitta fanni tanlang' })
    .max(10, { message: "Ko'pi bilan 10 ta fan tanlash mumkin" }),
  clubs: z.array(z.string()).min(1, { message: "To'garak javobini tanlang" }),
  barriers: z.array(z.string()).max(10).default([]),
});

/**
 * «Hech qaysi» tanlanganda to'siq sababi majburiy bo'ladi.
 *
 * Zod'da `.superRefine()` natijasini `.merge()` qilib bo'lmaydi,
 * shuning uchun qoida alohida saqlanadi va ikki joyda ishlatiladi:
 * qadam tekshiruvida va to'liq anketa tekshiruvida.
 */
function tosiqQoidasi(
  v: { clubs: string[]; barriers: string[] },
  ctx: z.RefinementCtx
): void {
  if (v.clubs.includes(HECH_QAYSI) && v.barriers.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['barriers'],
      message: "Nega qatnamasligingizni belgilang — bu yordam berish uchun kerak",
    });
  }
}

/** 2-qadamning o'zini tekshirish uchun */
export const step2FormSchema = step2Schema.superRefine(tosiqQoidasi);

/**
 * 3-qadam: orzu qilingan kasb.
 *
 * Bu qadam faqat 10-11-sinf o'quvchilariga ko'rsatiladi, shuning uchun
 * maydonlar ixtiyoriy. Kichik sinf o'quvchisi hali kasb tanlay olmaydi
 * va tasodifiy javob butun tahlilni buzadi.
 */
export const step3Schema = z.object({
  dreamJob: z.string().trim().max(100).optional(),
  jobCategory: z.string().trim().max(100).optional(),
});

/** Qadam ko'rsatilganda kasb tanlanganini talab qiladi */
export const step3RequiredSchema = z.object({
  dreamJob: z
    .string({ required_error: 'Orzuingizdagi kasbni tanlang' })
    .trim()
    .min(1, { message: 'Orzuingizdagi kasbni tanlang' }),
  jobCategory: z
    .string({ required_error: "Kasb yo'nalishi aniqlanmadi" })
    .trim()
    .min(1, { message: "Kasb yo'nalishi aniqlanmadi" }),
});

/**
 * 4-qadam: ta'lim markazi.
 *
 * Faqat ikkita savol majburiy — qanday kurs kerak va qancha yo'l
 * yurishga tayyor. Aynan shu ikkisi «qayerda, qanday markaz ochamiz»
 * degan qarorni hal qiladi; qolganlari qarorni aniqlashtiradi,
 * lekin ularsiz ham qaror chiqarish mumkin.
 */
export const step4Schema = z.object({
  wantedCourses: z
    .array(z.string())
    .min(1, { message: 'Kamida bitta kursni tanlang' })
    .max(10, { message: "Ko'pi bilan 10 ta kurs tanlash mumkin" }),
  wantedLanguages: z.array(z.string()).max(10).default([]),
  travelWillingness: z
    .string({ required_error: 'Qancha yo\'l yurishga tayyorligingizni tanlang' })
    .trim()
    .min(1, { message: "Qancha yo'l yurishga tayyorligingizni tanlang" })
    .max(60),
  availableTimes: z.array(z.string()).max(10).default([]),
  homeTech: optionalText(60, 'Javob'),
});

/**
 * 5-qadam: rozilik.
 *
 * Ilgari bu qadamda "kim ilhom berdi", "chet elda o'qish" va
 * "mahalla uchun rejang" savollari ham bor edi. Ular qarorga hech
 * narsa qo'shmadi, faqat anketani uzaytirdi — olib tashlandi.
 */
export const step5Schema = z.object({
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
  .merge(step4Schema)
  .merge(step5Schema)
  .superRefine((v, ctx) => {
    tosiqQoidasi(v, ctx);

    // 10-11-sinf o'quvchisiga orzu kasb savoli berilgan — javob shart
    if (kasbSavoliKerakmi(v.grade) && !v.dreamJob) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dreamJob'],
        message: 'Orzuingizdagi kasbni tanlang',
      });
    }
  });

export type StudentInput = z.infer<typeof studentSchema>;
export type Step1Input = z.infer<typeof step1Schema>;
export type Step2Input = z.infer<typeof step2Schema>;
export type Step3Input = z.infer<typeof step3Schema>;
export type Step4Input = z.infer<typeof step4Schema>;
export type Step5Input = z.infer<typeof step5Schema>;

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
    .max(250, { message: 'Nomi 250 ta belgidan oshmasligi kerak' }),
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
