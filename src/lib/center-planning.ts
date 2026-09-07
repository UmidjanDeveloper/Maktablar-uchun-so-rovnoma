/**
 * ============================================================
 *  TA'LIM MARKAZI OCHISH TAHLILI
 *
 *  Bu modul bitta savolga javob beradi:
 *  «Qayerda, qanday markaz ochsak, unga kim keladi?»
 *
 *  Asosiy tamoyil: kurs guruh bo'lganda ishlaydi. Ya'ni muhimi
 *  «nechta bola qiziqadi» emas, «bitta joyda nechta bola AYNAN BIR
 *  XIL kursni xohlaydi». Shuning uchun hisob birligi — (joy, kurs)
 *  juftligi.
 *
 *  Qamrov (kim qayerga bora oladi) o'quvchining o'z javobidan olinadi.
 *  Mahallalarning qo'shnichilik xaritasi bizda yo'q, shuning uchun
 *  «qo'shni mahallaga boraman» degan javob boshqa mahallaga
 *  o'tkazilmaydi — bu taxmin bo'lardi. Uch xil variant alohida
 *  hisoblanadi va qaror odamga qoldiriladi.
 * ============================================================
 */
import { TIL_KERAK_EMAS } from './constants';
import { percent } from './utils';

/** Tahlil uchun kerakli maydonlar — anketaning bir qismi */
export interface CenterRow {
  mahalla: string;
  school: string;
  wantedCourses: string[];
  wantedLanguages: string[];
  travelWillingness: string | null;
  barriers: string[];
  availableTimes: string[];
  homeTech: string | null;
}

/**
 * Guruh ishga tushishi uchun kerakli eng kam o'quvchi soni.
 *
 * 12 — bir o'qituvchi olib boradigan kursning odatiy eng kichik
 * guruhi. Bu raqamni o'zgartirsangiz, butun tahlil shunga moslashadi.
 */
export const MIN_GROUP = 12;

/** «Yaqin bo'lsa boraman» darajasidagi javoblar tartibi */
const TRAVEL_RANK: Record<string, number> = {
  'Faqat maktabimda': 0,
  Mahallamda: 1,
  "Qo'shni mahallaga ham": 2,
  'Tuman markazigacha': 3,
};

const TOSIQ_YAQINDA_YOQ = "Yaqin atrofda bunday to'garak yo'q";

export type Viability = 'viable' | 'close' | 'weak';

export interface CourseDemand {
  name: string;
  count: number;
}

export interface CenterOption {
  /** Markaz qayerda ochilishi ko'rib chiqilmoqda */
  kind: 'mahalla' | 'maktab' | 'tuman';
  location: string;
  /** Shu joyga kela oladigan jami o'quvchilar (kurs javobi berganlar) */
  reachable: number;
  /** Eng ko'p so'ralgan uchta kurs */
  courses: CourseDemand[];
  /** Eng ko'p so'ralgan kursni xohlaganlar soni — guruh hajmi */
  topDemand: number;
  /** «Yaqin atrofda to'garak yo'q» degan o'quvchilar ulushi (%) */
  unservedShare: number;
  /** Eng qulay vaqt */
  bestTime: string | null;
  /** Eng ko'p so'ralgan til (til markazi uchun) */
  topLanguage: string | null;
  viability: Viability;
}

export interface CenterPlan {
  /** Yangi savollarga javob bergan o'quvchilar soni */
  answered: number;
  /** Ulardan nechtasi hech qanday to'garakka qatnamaydi */
  withBarriers: number;
  /** Mahallada markaz ochish variantlari */
  byMahalla: CenterOption[];
  /** Maktab qoshida ochish variantlari */
  bySchool: CenterOption[];
  /** Tuman markazida bitta markaz ochilsa */
  district: CenterOption | null;
  /** Tumandagi umumiy kurs talabi */
  courseDemand: CourseDemand[];
  /** Til talabi */
  languageDemand: CourseDemand[];
  /** Hozir nega bormaydi */
  barriers: CourseDemand[];
  /** Qachon qatnasha oladi */
  times: CourseDemand[];
  /** Uydagi texnika */
  tech: CourseDemand[];
}

/* ------------------------------------------------------------------ */

function inc(map: Map<string, number>, key: string, by = 1) {
  map.set(key, (map.get(key) ?? 0) + by);
}

function sorted(map: Map<string, number>, limit?: number): CourseDemand[] {
  const list = Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  return limit ? list.slice(0, limit) : list;
}

function viabilityOf(count: number): Viability {
  if (count >= MIN_GROUP) return 'viable';
  if (count >= Math.ceil(MIN_GROUP * 0.66)) return 'close';
  return 'weak';
}

/** Bitta joy uchun variant tuzadi */
function buildOption(
  kind: CenterOption['kind'],
  location: string,
  rows: CenterRow[]
): CenterOption {
  const courses = new Map<string, number>();
  const languages = new Map<string, number>();
  const times = new Map<string, number>();
  let unserved = 0;

  for (const row of rows) {
    for (const course of row.wantedCourses) inc(courses, course);
    for (const lang of row.wantedLanguages) {
      if (lang !== TIL_KERAK_EMAS) inc(languages, lang);
    }
    for (const time of row.availableTimes) inc(times, time);
    if (row.barriers.includes(TOSIQ_YAQINDA_YOQ)) unserved += 1;
  }

  const topCourses = sorted(courses, 3);
  const topDemand = topCourses[0]?.count ?? 0;

  return {
    kind,
    location,
    reachable: rows.length,
    courses: topCourses,
    topDemand,
    unservedShare: percent(unserved, rows.length),
    bestTime: sorted(times, 1)[0]?.name ?? null,
    topLanguage: sorted(languages, 1)[0]?.name ?? null,
    viability: viabilityOf(topDemand),
  };
}

/**
 * Variantlarni tartiblaydi.
 *
 * Birinchi mezon — guruh hajmi, chunki kurs guruh to'lmasa
 * ishlamaydi. Teng bo'lganda «yaqin atrofda hech narsa yo'q»
 * degan joy oldinga chiqadi: u yerda markaz ko'proq narsani
 * o'zgartiradi.
 */
function rank(a: CenterOption, b: CenterOption) {
  return (
    b.topDemand - a.topDemand ||
    b.unservedShare - a.unservedShare ||
    a.location.localeCompare(b.location)
  );
}

/**
 * Markaz ochish tahlilini quradi.
 *
 * Uch xil variant alohida hisoblanadi, chunki ular bir-birini
 * almashtirmaydi:
 *   - maktab qoshida  — hamma o'quvchi bora oladi, lekin joy tor
 *   - mahallada       — «faqat maktabimda» deganlar hisobga olinmaydi
 *   - tuman markazida — faqat shu masofaga tayyorlar hisobga olinadi
 */
export function buildCenterPlan(rows: CenterRow[]): CenterPlan {
  // Yangi savollarga javob bermagan (eski) anketalarni chetlab o'tamiz —
  // aks holda ular talabni sun'iy ravishda pasaytiradi
  const answered = rows.filter((r) => r.wantedCourses.length > 0);

  const courseDemand = new Map<string, number>();
  const languageDemand = new Map<string, number>();
  const barriers = new Map<string, number>();
  const times = new Map<string, number>();
  const tech = new Map<string, number>();

  const byMahallaRows = new Map<string, CenterRow[]>();
  const bySchoolRows = new Map<string, CenterRow[]>();
  const districtRows: CenterRow[] = [];

  for (const row of answered) {
    for (const course of row.wantedCourses) inc(courseDemand, course);
    for (const lang of row.wantedLanguages) {
      if (lang !== TIL_KERAK_EMAS) inc(languageDemand, lang);
    }
    for (const barrier of row.barriers) inc(barriers, barrier);
    for (const time of row.availableTimes) inc(times, time);
    if (row.homeTech) inc(tech, row.homeTech);

    // Maktab qoshida: o'z maktabiga hamma bora oladi
    const school = bySchoolRows.get(row.school) ?? [];
    school.push(row);
    bySchoolRows.set(row.school, school);

    const reach = TRAVEL_RANK[row.travelWillingness ?? ''] ?? 0;

    // Mahallada: «faqat maktabimda» deganlar kelmaydi
    if (reach >= 1) {
      const mahalla = byMahallaRows.get(row.mahalla) ?? [];
      mahalla.push(row);
      byMahallaRows.set(row.mahalla, mahalla);
    }

    // Tuman markazida: faqat shu masofaga tayyorlar
    if (reach >= 3) districtRows.push(row);
  }

  const byMahalla = Array.from(byMahallaRows.entries())
    .map(([name, rs]) => buildOption('mahalla', name, rs))
    .sort(rank);

  const bySchool = Array.from(bySchoolRows.entries())
    .map(([name, rs]) => buildOption('maktab', name, rs))
    .sort(rank);

  return {
    answered: answered.length,
    withBarriers: answered.filter((r) => r.barriers.length > 0).length,
    byMahalla,
    bySchool,
    district: districtRows.length
      ? buildOption('tuman', 'Tuman markazi', districtRows)
      : null,
    courseDemand: sorted(courseDemand),
    languageDemand: sorted(languageDemand),
    barriers: sorted(barriers),
    times: sorted(times),
    tech: sorted(tech),
  };
}

/**
 * Hozir hech qanday to'garakka qatnamayotganlar ulushi (%).
 *
 * To'siq savoli faqat «Hech qaysi» deganlarga beriladi, shuning uchun
 * to'siq javobi borlar — aynan qatnamayotganlar.
 */
export function unservedPercent(plan: CenterPlan): number {
  if (!plan.answered) return 0;
  return percent(plan.withBarriers, plan.answered);
}
