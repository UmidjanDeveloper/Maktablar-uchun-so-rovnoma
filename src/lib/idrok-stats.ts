/**
 * ============================================================
 *  IDROK UCHUN YIG'MA STATISTIKA
 *
 *  Xatirchi tumani hokimligining IDROK AI yordamchisi platforma
 *  holatini GET /api/idrok/stats orqali oladi. Bu modul o'sha
 *  javobni tuzadi.
 *
 *  Raqamlar /admin/dashboard dagi bilan bir xil chiqishi kerak,
 *  shuning uchun hisob /api/stats dagi qoidalar bo'yicha (filtrsiz
 *  holatda) bajariladi va o'sha yordamchilar ishlatiladi:
 *  `percent`, `searchKey`, `buildCenterPlan`, `YORDAM_TOSIQLARI`.
 *
 *  FAQAT O'QISH: bazaga hech narsa yozilmaydi.
 *  SHAXSIY MA'LUMOT YO'Q: ism, familiya va telefonlar `select` ga
 *  umuman kiritilmagan — javobda faqat yig'indilar bor.
 *
 *  ERKIN MATN YO'Q: anketa ochiq (login yo'q), ya'ni so'rovni qo'lda
 *  yasab, fan, kasb, kurs yoki to'siq o'rniga istalgan matn — ism,
 *  telefon, IDROK uchun "buyruq" — yuborish mumkin. Shuning uchun
 *  jadvallarga faqat ro'yxatdagi (katalog yoki constants.ts dagi)
 *  nomlar chiqadi, qolgani bitta "Boshqa" qatoriga yig'iladi.
 * ============================================================
 */
import { prisma } from '@/lib/prisma';
import { buildCenterPlan, unservedPercent, type Viability } from '@/lib/center-planning';
import {
  BOSHQA_TIL,
  FANLAR,
  KASBLAR,
  KASB_KATEGORIYALARI,
  KERAKLI_KURSLAR_TEKIS,
  TILLAR,
  TIL_KERAK_EMAS,
  TOSIQLAR,
  YORDAM_TOSIQLARI,
} from '@/lib/constants';
import { kunBoshi, percent, searchKey, toshkentKuni, truncate } from '@/lib/utils';

/** Bitta ko'rsatkich: `qiymat` doim son (formatlangan satr emas) */
export interface IdrokKorsatkich {
  kalit: string;
  nomi: string;
  qiymat: number;
  birlik: string;
}

/** Bitta jadval: birinchi ustun — nom, keyingilari — qiymatlar */
export interface IdrokJadval {
  nomi: string;
  ustunlar: string[];
  qatorlar: (string | number)[][];
}

/** GET /api/idrok/stats javobi */
export interface IdrokStats {
  manba: string;
  nomi: string;
  vaqt: string;
  korsatkichlar: IdrokKorsatkich[];
  jadvallar: IdrokJadval[];
}

const MANBA = 'kelajakegasi.uz';
const NOMI = 'Kelajak Egasi — Xatirchi Tuman Kasb Platformasi';

/** Har bir jadvaldagi eng ko'p qatorlar soni */
const JADVAL_CHEGARASI = 30;

/** Kunlik dinamika jadvalida necha kun ko'rsatiladi */
const DINAMIKA_KUNLARI = 14;

const BIR_KUN = 24 * 60 * 60 * 1000;

/** Ro'yxatda yo'q javoblar shu nom ostida yig'iladi */
const BOSHQA = "Boshqa (ro'yxatda yo'q)";

/** Katalogda yo'q mahalla yoki maktab nomi (eski, qo'lda yozilganlar) */
const ROYXATDAN_TASHQARI = "Ro'yxatdan tashqari";

/** Jadval katagidagi matnning eng ko'p uzunligi — oxirgi himoya */
const MATN_CHEGARASI = 80;

/**
 * Ro'yxatdan olib tashlangan, lekin eski anketalarda qolgan to'siq
 * nomlari. Bular ham repodagi tayyor variant, foydalanuvchi matni emas.
 */
const ESKI_TOSIQLAR = ["Vaqtim yo'q", 'Hozir ham qatnayapman'];

/** Ruxsat etilgan nomlar: kalit — `searchKey`, qiymat — rasmiy yozilishi */
function royxat(nomlar: Iterable<string>): Map<string, string> {
  const map = new Map<string, string>();
  for (const nom of Array.from(nomlar)) {
    const kalit = searchKey(nom);
    if (kalit && !map.has(kalit)) map.set(kalit, nom);
  }
  return map;
}

/** Nomni ro'yxatdagi yozilishiga keltiradi; ro'yxatda yo'q bo'lsa — `zaxira` */
function tanla(map: Map<string, string>, nom: string, zaxira: string): string {
  return map.get(searchKey(nom)) ?? zaxira;
}

/** Ko'p tanlovli javobni ro'yxatga keltiradi (bir xil nom bir marta sanaladi) */
function tanlaHammasi(map: Map<string, string>, nomlar: string[], zaxira: string): string[] {
  return Array.from(new Set(nomlar.map((n) => tanla(map, n, zaxira))));
}

/** Markaz tahlilidagi holat nomlari — admin paneldagi bilan bir xil */
const HOLAT: Record<Viability, string> = {
  viable: "Guruh to'ladi",
  close: 'Biroz yetmaydi',
  weak: 'Hozircha kam',
};

/** Xaritadagi qiymatni oshiradi (bo'sh kalit hisobga olinmaydi) */
function inc(map: Map<string, number>, key: string, by = 1): void {
  if (!key) return;
  map.set(key, (map.get(key) ?? 0) + by);
}

/** Kamayish tartibidagi ro'yxat; teng bo'lsa alifbo bo'yicha */
function toSorted(map: Map<string, number>): [string, number][] {
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/** Xaritadagi eng katta yozuv nomi; bo'sh bo'lsa "—" */
function topName(map: Map<string, number>): string {
  return toSorted(map)[0]?.[0] ?? '—';
}

/** Mahalla yoki maktab kesimidagi sanoqlar */
interface Hudud {
  jami: number;
  qizlar: number;
  kasbli: number;
  kasblar: Map<string, number>;
  yonalishlar: Map<string, number>;
  kurslar: Map<string, number>;
}

function hudud(map: Map<string, Hudud>, key: string): Hudud {
  let cell = map.get(key);
  if (!cell) {
    cell = {
      jami: 0,
      qizlar: 0,
      kasbli: 0,
      kasblar: new Map(),
      yonalishlar: new Map(),
      kurslar: new Map(),
    };
    map.set(key, cell);
  }
  return cell;
}

/** Hududlarni anketalar soni bo'yicha kamayish tartibida beradi */
function hududlarTartibi(map: Map<string, Hudud>): [string, Hudud][] {
  return Array.from(map.entries()).sort(
    (a, b) => b[1].jami - a[1].jami || a[0].localeCompare(b[0])
  );
}

/** Jins kesimidagi sanoq: [o'g'il, qiz] */
function jinsInc(map: Map<string, [number, number]>, key: string, isGirl: boolean): void {
  const cell = map.get(key) ?? [0, 0];
  cell[isGirl ? 1 : 0] += 1;
  map.set(key, cell);
}

/**
 * IDROK uchun to'liq javobni tuzadi.
 * Faqat `findMany`/`count` ishlatiladi — hech qanday yozish yo'q.
 */
export async function buildIdrokStats(now: Date = new Date()): Promise<IdrokStats> {
  const [rows, schoolCatalog, mahallaCatalog, kasbCatalog] = await Promise.all([
    // /api/stats dagi kabi faqat hisob uchun kerakli ustunlar
    prisma.student.findMany({
      select: {
        gender: true,
        mahalla: true,
        school: true,
        grade: true,
        dreamJob: true,
        jobCategory: true,
        favoriteSubjects: true,
        studyAbroad: true,
        wantedCourses: true,
        wantedLanguages: true,
        travelWillingness: true,
        barriers: true,
        availableTimes: true,
        homeTech: true,
        helpResolved: true,
        helpResolvedAt: true,
        createdAt: true,
      },
    }),
    prisma.school.findMany({ select: { name: true } }),
    prisma.mahalla.findMany({ select: { name: true } }),
    prisma.profession.findMany({ select: { name: true, category: true } }),
  ]);

  /*
   * Ruxsat etilgan nomlar ro'yxatlari. Katalog (admin kiritgan) va
   * constants.ts dagi variantlar — ishonchli manba. Anketadagi matn
   * faqat shulardan biriga mos kelsa jadvalga chiqadi.
   */
  const maktabRoyxati = royxat(schoolCatalog.map((s) => s.name));
  const mahallaRoyxati = royxat(mahallaCatalog.map((m) => m.name));
  const kasbRoyxati = royxat(kasbCatalog.map((k) => k.name).concat(KASBLAR.map((k) => k.name)));
  const yonalishRoyxati = royxat(
    kasbCatalog.map((k) => k.category).concat(KASB_KATEGORIYALARI.map((k) => k.value))
  );
  const fanRoyxati = royxat(FANLAR.map((f) => f.name));
  const kursRoyxati = royxat(KERAKLI_KURSLAR_TEKIS.map((k) => k.name));
  // «Til kursi kerak emas» saqlanadi — markaz tahlili uni o'zi chiqarib tashlaydi
  const tilRoyxati = royxat(TILLAR.map((t) => t.name).concat(TIL_KERAK_EMAS));
  const tosiqRoyxati = royxat(TOSIQLAR.map((t) => t.name).concat(ESKI_TOSIQLAR));

  /*
   * Jadvallar uchun tozalangan anketalar: nom beruvchi har bir maydon
   * ro'yxatga keltiriladi. Ko'rsatkichlar (faqat sonlar) esa dashboard
   * bilan bir xil chiqishi uchun xom `rows` dan hisoblanadi.
   */
  const toza = rows.map((r) => ({
    ...r,
    mahalla: tanla(mahallaRoyxati, r.mahalla, ROYXATDAN_TASHQARI),
    school: tanla(maktabRoyxati, r.school, ROYXATDAN_TASHQARI),
    dreamJob: r.dreamJob ? tanla(kasbRoyxati, r.dreamJob, BOSHQA) : null,
    jobCategory: r.jobCategory ? tanla(yonalishRoyxati, r.jobCategory, BOSHQA) : null,
    favoriteSubjects: tanlaHammasi(fanRoyxati, r.favoriteSubjects, BOSHQA),
    wantedCourses: tanlaHammasi(kursRoyxati, r.wantedCourses, BOSHQA),
    // Qo'lda yozilgan til nomi ham erkin matn — «Boshqa til» ga yig'iladi
    wantedLanguages: tanlaHammasi(tilRoyxati, r.wantedLanguages, BOSHQA_TIL),
    barriers: tanlaHammasi(tosiqRoyxati, r.barriers, BOSHQA),
  }));

  const jobs = new Map<string, number>();
  const categories = new Map<string, number>();
  const grades = new Map<string, number>();
  const subjects = new Map<string, number>();
  const jobGender = new Map<string, [number, number]>();
  const categoryGender = new Map<string, [number, number]>();
  const mahallalar = new Map<string, Hudud>();
  const maktablar = new Map<string, Hudud>();
  /** Toshkent vaqti bo'yicha kun -> anketalar soni */
  const kunlar = new Map<string, number>();

  let girls = 0;
  let withJob = 0;
  let chetEl = 0;

  for (const row of toza) {
    // Dashboard bilan bir xil: "Qiz bola" bo'lmagan barchasi o'g'il bola
    const isGirl = row.gender === 'Qiz bola';
    if (isGirl) girls += 1;

    // Orzu kasb faqat 9-11-sinfda so'raladi — kichiklarda bo'sh
    const dreamJob = row.dreamJob;
    const jobCategory = row.jobCategory;
    if (dreamJob) {
      withJob += 1;
      inc(jobs, dreamJob);
      jinsInc(jobGender, dreamJob, isGirl);
    }
    if (jobCategory) {
      inc(categories, jobCategory);
      jinsInc(categoryGender, jobCategory, isGirl);
    }
    if (row.studyAbroad === 'Ha') chetEl += 1;

    inc(grades, `${row.grade}-sinf`);
    for (const subject of row.favoriteSubjects) inc(subjects, subject);
    inc(kunlar, toshkentKuni(row.createdAt));

    for (const cell of [hudud(mahallalar, row.mahalla), hudud(maktablar, row.school)]) {
      cell.jami += 1;
      if (isGirl) cell.qizlar += 1;
      if (dreamJob) {
        cell.kasbli += 1;
        inc(cell.kasblar, dreamJob);
      }
      if (jobCategory) inc(cell.yonalishlar, jobCategory);
      for (const course of row.wantedCourses) inc(cell.kurslar, course);
    }
  }

  const total = rows.length;
  const girlsPercent = percent(girls, total);
  // Dashboard KPI si kabi (xom nomlar bo'yicha): bo'sh nom hudud sifatida sanalmaydi
  const maktablarSoni = new Set(rows.map((r) => r.school).filter(Boolean)).size;
  const mahallalarSoni = new Set(rows.map((r) => r.mahalla).filter(Boolean)).size;

  /*
   * Qamrov — /api/stats dagi buildCoverage bilan bir xil: anketadagi
   * maktab nomi katalogdagi nom bilan normallashtirilgan kalit
   * (apostrof/defissiz) bo'yicha solishtiriladi.
   */
  const schoolByKey = new Map<string, string>();
  for (const s of schoolCatalog) schoolByKey.set(searchKey(s.name), s.name);
  const activeNames = new Set<string>();
  for (const row of rows) {
    const katalogNomi = schoolByKey.get(searchKey(row.school));
    if (katalogNomi) activeNames.add(katalogNomi);
  }
  const activeSchools = schoolCatalog.filter((s) => activeNames.has(s.name)).length;
  const mahallaKeys = new Set(rows.map((r) => searchKey(r.mahalla)));
  const silentMahallas = mahallaCatalog.filter((m) => !mahallaKeys.has(searchKey(m.name))).length;

  /*
   * Yordam bo'yicha bajarilgan ish — /api/stats dagi `help` bloki
   * bilan bir xil qoidalar.
   */
  const yordamRows = rows.filter((r) => r.barriers.length > 0);
  const aralashuvRows = yordamRows.filter((r) =>
    r.barriers.some((b) => (YORDAM_TOSIQLARI as readonly string[]).includes(b))
  );
  // Sabablar jadvali nom beradi — shuning uchun tozalangan to'siqlardan
  const barrierStats = new Map<string, { count: number; resolved: number }>();
  for (const r of toza) {
    for (const b of r.barriers) {
      const cell = barrierStats.get(b) ?? { count: 0, resolved: 0 };
      cell.count += 1;
      if (r.helpResolved) cell.resolved += 1;
      barrierStats.set(b, cell);
    }
  }
  const resolved = aralashuvRows.filter((r) => r.helpResolved).length;

  // Dinamika: kunlar Toshkent vaqti bo'yicha (server UTC da ishlaydi)
  const kun = (orqaga: number) => toshkentKuni(new Date(now.getTime() - orqaga * BIR_KUN));
  const oxirgiKunlar = (soni: number) =>
    Array.from({ length: soni }, (_, i) => kunlar.get(kun(i)) ?? 0).reduce((s, n) => s + n, 0);
  const haftaBoshi = kunBoshi(kun(6));
  const haftadaHalQilingan = aralashuvRows.filter(
    (r) => r.helpResolved && r.helpResolvedAt && r.helpResolvedAt >= haftaBoshi
  ).length;

  // Ko'rsatkichlar uchun — dashboard bilan bir xil (xom ma'lumot)
  const plan = buildCenterPlan(rows);
  const viableCount = plan.byMahalla.filter((o) => o.viability === 'viable').length;
  // Jadvallar uchun — faqat ro'yxatdagi nomlar bilan
  const tozaPlan = buildCenterPlan(toza);

  /*
   * Tartib muhim: IDROK birinchi ko'rsatkichlarni kartochka va
   * qisqa xulosada ishlatadi, shuning uchun eng asosiylari boshida.
   */
  const korsatkichlar: IdrokKorsatkich[] = [
    { kalit: 'jami_oquvchilar', nomi: "Jami o'quvchilar (anketalar)", qiymat: total, birlik: 'kishi' },
    { kalit: 'bugungi_anketalar', nomi: 'Bugun topshirilgan anketalar', qiymat: oxirgiKunlar(1), birlik: 'ta' },
    { kalit: 'songgi_7_kun_anketalar', nomi: "So'nggi 7 kunda topshirilgan anketalar", qiymat: oxirgiKunlar(7), birlik: 'ta' },
    { kalit: 'qamrab_olingan_maktablar', nomi: 'Qamrab olingan maktablar', qiymat: maktablarSoni, birlik: 'ta' },
    { kalit: 'qamrab_olingan_mahallalar', nomi: 'Qamrab olingan mahallalar', qiymat: mahallalarSoni, birlik: 'ta' },
    { kalit: 'qizlar_foizi', nomi: 'Qizlar ulushi', qiymat: girlsPercent, birlik: 'foiz' },
    // Ikki foiz yig'indisi doim 100 bo'lishi uchun dashboard kabi ayirib olinadi
    { kalit: 'ogil_bolalar_foizi', nomi: "O'g'il bolalar ulushi", qiymat: total ? 100 - girlsPercent : 0, birlik: 'foiz' },
    { kalit: 'yordam_kutmoqda', nomi: "Yordam kutayotgan o'quvchilar", qiymat: aralashuvRows.length - resolved, birlik: 'kishi' },
    { kalit: 'qizlar_soni', nomi: 'Qizlar', qiymat: girls, birlik: 'kishi' },
    { kalit: 'ogil_bolalar_soni', nomi: "O'g'il bolalar", qiymat: total - girls, birlik: 'kishi' },
    { kalit: 'orzu_kasb_korsatganlar', nomi: "Orzu kasbini ko'rsatganlar (9-11-sinf)", qiymat: withJob, birlik: 'kishi' },
    { kalit: 'kechagi_anketalar', nomi: 'Kecha topshirilgan anketalar', qiymat: kunlar.get(kun(1)) ?? 0, birlik: 'ta' },
    { kalit: 'songgi_30_kun_anketalar', nomi: "So'nggi 30 kunda topshirilgan anketalar", qiymat: oxirgiKunlar(30), birlik: 'ta' },
    { kalit: 'katalogdagi_maktablar', nomi: "Ro'yxatdagi maktablar", qiymat: schoolCatalog.length, birlik: 'ta' },
    { kalit: 'anketa_yuborgan_maktablar', nomi: 'Anketa yuborgan maktablar', qiymat: activeSchools, birlik: 'ta' },
    { kalit: 'anketa_yubormagan_maktablar', nomi: 'Umuman anketa yubormagan maktablar', qiymat: schoolCatalog.length - activeSchools, birlik: 'ta' },
    { kalit: 'maktablar_qamrovi', nomi: 'Maktablar qamrovi', qiymat: percent(activeSchools, schoolCatalog.length), birlik: 'foiz' },
    { kalit: 'katalogdagi_mahallalar', nomi: "Ro'yxatdagi mahallalar", qiymat: mahallaCatalog.length, birlik: 'ta' },
    { kalit: 'anketa_kelmagan_mahallalar', nomi: 'Anketa kelmagan mahallalar', qiymat: silentMahallas, birlik: 'ta' },
    { kalit: 'katalogdagi_kasblar', nomi: "Ro'yxatdagi kasblar", qiymat: kasbCatalog.length, birlik: 'ta' },
    { kalit: 'tosiq_belgilaganlar', nomi: "To'garakka qatnamaslik sababini aytganlar", qiymat: yordamRows.length, birlik: 'kishi' },
    { kalit: 'yordam_kerak', nomi: "Hokimiyat aralashuvi kerak bo'lganlar", qiymat: aralashuvRows.length, birlik: 'kishi' },
    { kalit: 'yordam_hal_qilingan', nomi: 'Muammosi hal qilinganlar', qiymat: resolved, birlik: 'kishi' },
    { kalit: 'yordam_7_kunda_hal_qilingan', nomi: "So'nggi 7 kunda hal qilinganlar", qiymat: haftadaHalQilingan, birlik: 'kishi' },
    { kalit: 'kurs_javobi_berganlar', nomi: 'Kurs savoliga javob berganlar', qiymat: plan.answered, birlik: 'kishi' },
    { kalit: 'hech_qayerga_qatnamaydiganlar', nomi: "Hech qaysi to'garakka qatnamaydiganlar", qiymat: plan.withBarriers, birlik: 'kishi' },
    { kalit: 'hech_qayerga_qatnamaydiganlar_foizi', nomi: "Hech qaysi to'garakka qatnamaydiganlar ulushi", qiymat: unservedPercent(plan), birlik: 'foiz' },
    { kalit: 'guruh_toladigan_mahallalar', nomi: "Kurs guruhi to'ladigan mahallalar", qiymat: viableCount, birlik: 'ta' },
    { kalit: 'chet_elda_oqish_istagi', nomi: "Chet elda o'qishni xohlaydiganlar", qiymat: chetEl, birlik: 'kishi' },
  ];

  /*
   * Jadvallar: birinchi ustun — nom, ikkinchisi — asosiy son
   * (IDROK ustunli diagrammani shu ikki ustundan chizadi).
   * Eng muhimlari boshida.
   */
  const jadvallar: IdrokJadval[] = [
    {
      nomi: "Maktablar bo'yicha anketalar",
      ustunlar: ['Maktab', 'Anketalar', "Orzu kasb ko'rsatganlar", 'Eng ommabop kasb', "Eng ko'p so'ralgan kurs"],
      qatorlar: hududlarTartibi(maktablar).map(([name, h]) => [
        name,
        h.jami,
        h.kasbli,
        topName(h.kasblar),
        topName(h.kurslar),
      ]),
    },
    {
      nomi: "Mahallalar bo'yicha anketalar",
      ustunlar: ['Mahalla', 'Anketalar', 'Qizlar', "O'g'il bolalar", "Eng ommabop yo'nalish", "Eng ko'p so'ralgan kurs"],
      qatorlar: hududlarTartibi(mahallalar).map(([name, h]) => [
        name,
        h.jami,
        h.qizlar,
        h.jami - h.qizlar,
        topName(h.yonalishlar),
        topName(h.kurslar),
      ]),
    },
    {
      nomi: 'Eng ommabop orzu kasblar',
      ustunlar: ['Kasb', 'Tanlaganlar', "O'g'il bolalar", 'Qizlar'],
      qatorlar: toSorted(jobs).map(([name, value]) => {
        const [ogil, qiz] = jobGender.get(name) ?? [0, 0];
        return [name, value, ogil, qiz];
      }),
    },
    {
      nomi: "Kasb yo'nalishlari",
      ustunlar: ["Yo'nalish", 'Tanlaganlar', "O'g'il bolalar", 'Qizlar'],
      qatorlar: toSorted(categories).map(([name, value]) => {
        const [ogil, qiz] = categoryGender.get(name) ?? [0, 0];
        return [name, value, ogil, qiz];
      }),
    },
    {
      nomi: "Sinflar bo'yicha anketalar",
      ustunlar: ['Sinf', 'Anketalar'],
      // 5 dan 11 gacha tabiiy tartibda
      qatorlar: toSorted(grades)
        .sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10))
        .map(([name, value]) => [name, value]),
    },
    {
      nomi: "Ta'lim markazi: mahallalar bo'yicha guruh hajmi",
      ustunlar: ['Mahalla', 'Guruh hajmi', 'Yetib kela oladiganlar', "Eng ko'p so'ralgan kurs", 'Holat'],
      qatorlar: tozaPlan.byMahalla.map((o) => [
        o.location,
        o.topDemand,
        o.reachable,
        o.courses[0]?.name ?? '—',
        HOLAT[o.viability],
      ]),
    },
    {
      nomi: "Eng ko'p so'ralgan kurslar",
      ustunlar: ['Kurs', 'Xohlovchilar'],
      qatorlar: tozaPlan.courseDemand.map((c) => [c.name, c.count]),
    },
    {
      nomi: "To'garakka qatnamaslik sabablari",
      ustunlar: ['Sabab', "O'quvchilar", 'Hal qilingan'],
      qatorlar: Array.from(barrierStats.entries())
        .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))
        .map(([name, v]) => [name, v.count, v.resolved]),
    },
    {
      nomi: `Kunlik anketalar (so'nggi ${DINAMIKA_KUNLARI} kun)`,
      ustunlar: ['Sana', 'Anketalar'],
      // Eskidan yangiga — vaqt o'qi chapdan o'ngga
      qatorlar: Array.from({ length: DINAMIKA_KUNLARI }, (_, i) => {
        const day = kun(DINAMIKA_KUNLARI - 1 - i);
        return [day, kunlar.get(day) ?? 0];
      }),
    },
    {
      nomi: 'Yoqtirgan fanlar',
      ustunlar: ['Fan', 'Tanlaganlar'],
      qatorlar: toSorted(subjects).map(([name, value]) => [name, value]),
    },
    {
      nomi: "O'rganmoqchi bo'lgan tillar",
      ustunlar: ['Til', 'Xohlovchilar'],
      qatorlar: tozaPlan.languageDemand.map((l) => [l.name, l.count]),
    },
  ].map((t) => ({
    ...t,
    // Oxirgi himoya: har qanday matnli katak qisqartiriladi
    qatorlar: t.qatorlar
      .slice(0, JADVAL_CHEGARASI)
      .map((qator) => qator.map((c) => (typeof c === 'string' ? truncate(c, MATN_CHEGARASI) : c))),
  }));

  return {
    manba: MANBA,
    nomi: NOMI,
    vaqt: now.toISOString(),
    korsatkichlar,
    jadvallar,
  };
}
