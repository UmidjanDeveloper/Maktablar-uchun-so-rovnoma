/**
 * ============================================================
 *  TAVSIYALAR MOTORI
 *
 *  Bu fayl "150 ta anketa yig'ildi" degan quruq raqamni hokim
 *  ertaga bajara oladigan aniq qarorga aylantiradi.
 *
 *  Har bir tavsiya haqiqiy shartga (threshold) asoslanadi va
 *  yoniga dalil (necha o'quvchi, necha foiz) qo'shiladi —
 *  shunda hokim raqamni tekshirib ko'ra oladi.
 *
 *  Chegaralarni o'zgartirish uchun faqat quyidagi RULES
 *  konstantasini tahrirlash kifoya.
 * ============================================================
 */
import { percent } from './utils';
import type { DashboardStats } from '@/types';

/** Qoidalarning sozlanuvchi chegaralari */
export const RULES = {
  /** Mahallada bitta yo'nalish shu ulushdan oshsa — markaz ochish tavsiya etiladi */
  MAHALLA_DOMINANT_SHARE: 40,
  /** ...lekin kamida shuncha o'quvchi bo'lishi kerak (tasodifni istisno qilish) */
  MAHALLA_MIN_STUDENTS: 5,
  /** Mahallada shundan kam anketa bo'lsa — qamrov past deb hisoblanadi */
  MAHALLA_LOW_COVERAGE: 3,
  /** Yo'nalishda bir jins ulushi shundan oshsa — nomutanosiblik */
  GENDER_IMBALANCE_SHARE: 70,
  /** ...kamida shuncha o'quvchi bo'lganda */
  GENDER_MIN_STUDENTS: 8,
  /** To'garakka bormaydiganlar ulushi shundan oshsa — qamrov past */
  NO_CLUB_SHARE: 45,
  /** Chet elda o'qish istagi shundan oshsa — til dasturlari kerak */
  STUDY_ABROAD_SHARE: 45,
  /** Kasb yo'nalishi va tegishli fan orasidagi tafovut (foiz punkt) */
  SUBJECT_GAP: 15,
} as const;

export type RecommendationPriority = 'high' | 'medium' | 'info';

export interface Recommendation {
  /** Takrorlanmas identifikator */
  id: string;
  priority: RecommendationPriority;
  /** Qisqa sarlavha — hokim shuni o'qiydi */
  title: string;
  /** Nima qilish kerakligi */
  action: string;
  /** Raqamli dalil — tavsiya qayerdan chiqqani */
  evidence: string;
}

/** Yo'nalish nomiga mos to'garak/markaz nomi */
const CENTER_NAMES: Record<string, string> = {
  'IT & Texnologiya': 'IT va dasturlash markazi',
  Tibbiyot: 'tibbiyot yo\'nalishidagi to\'garak',
  "Ta'lim & Ilm": 'ilmiy-tadqiqot to\'garagi',
  'Harbiy & Huquq': 'harbiy-vatanparvarlik va huquq to\'garagi',
  Muhandislik: 'texnika va robototexnika to\'garagi',
  Ijodkorlik: 'ijod va san\'at studiyasi',
  Tadbirkorlik: 'yosh tadbirkorlar maktabi',
};

/** Yo'nalish uchun asosiy maktab fani — mos kelishini tekshirish uchun */
const CATEGORY_SUBJECT: Record<string, string> = {
  'IT & Texnologiya': 'Informatika',
  Tibbiyot: 'Biologiya',
  Muhandislik: 'Fizika',
  Ijodkorlik: 'Rasm',
};

function centerName(category: string): string {
  return CENTER_NAMES[category] ?? `${category} yo'nalishidagi to'garak`;
}

/**
 * Statistika asosida tavsiyalar ro'yxatini quradi.
 * Muhimlik darajasi bo'yicha tartiblangan holda qaytaradi.
 */
export function buildRecommendations(stats: DashboardStats): Recommendation[] {
  const out: Recommendation[] = [];
  const total = stats.kpi.totalStudents;

  // Ma'lumot juda kam bo'lsa tahlil qilishning ma'nosi yo'q
  if (total < 10) {
    return [
      {
        id: 'insufficient-data',
        priority: 'info',
        title: "Tahlil uchun ma'lumot yetarli emas",
        action:
          "Xulosa chiqarish uchun kamida 10 ta anketa kerak. Maktablarda so'rovnomani davom ettiring.",
        evidence: `Hozircha ${total} ta anketa mavjud`,
      },
    ];
  }

  // ---------- 1. Mahallada bitta yo'nalish ustunlik qilsa ----------
  const dominant = stats.mahallaInsights
    .filter(
      (m) =>
        m.total >= RULES.MAHALLA_MIN_STUDENTS &&
        m.topCategoryShare >= RULES.MAHALLA_DOMINANT_SHARE
    )
    .sort((a, b) => b.topCategoryShare - a.topCategoryShare || b.total - a.total)
    .slice(0, 5);

  for (const m of dominant) {
    out.push({
      id: `mahalla-center-${m.mahalla}`,
      priority: 'high',
      title: `${m.mahalla} mahallasida ${centerName(m.topCategory)} ochish`,
      action: `Ushbu mahallada "${m.topCategory}" yo'nalishi aniq ustunlik qilmoqda. Mahalla markazida yoki eng yaqin maktabda shu yo'nalishdagi to'garak ochish maqsadga muvofiq.`,
      evidence: `${m.total} ta o'quvchidan ${m.topCategoryCount} tasi (${m.topCategoryShare}%) shu yo'nalishni tanlagan`,
    });
  }

  // ---------- 2. Yo'nalishdagi jins nomutanosibligi ----------
  for (const cat of stats.categoryGender) {
    const catTotal = cat.ogil + cat.qiz;
    if (catTotal < RULES.GENDER_MIN_STUDENTS) continue;

    const girlShare = percent(cat.qiz, catTotal);
    const boyShare = percent(cat.ogil, catTotal);

    if (girlShare >= RULES.GENDER_IMBALANCE_SHARE) {
      out.push({
        id: `gender-girls-${cat.name}`,
        priority: 'medium',
        title: `"${cat.name}" yo'nalishi asosan qizlarni qiziqtirmoqda`,
        action: `Qizlar uchun ushbu yo'nalishda maxsus guruh ochish va tajribali mutaxassislar bilan uchrashuv tashkil etish tavsiya etiladi. Ayni paytda o'g'il bolalarni ham jalb qilish choralarini ko'rish kerak.`,
        evidence: `${catTotal} ta o'quvchidan ${cat.qiz} tasi (${girlShare}%) — qizlar`,
      });
    } else if (boyShare >= RULES.GENDER_IMBALANCE_SHARE) {
      out.push({
        id: `gender-boys-${cat.name}`,
        priority: 'medium',
        title: `"${cat.name}" yo'nalishida qizlar ishtiroki past`,
        action: `Qizlarni ushbu yo'nalishga jalb qilish uchun muvaffaqiyatli ayol mutaxassislar bilan uchrashuvlar va maxsus qabul kvotasi ko'rib chiqilsin.`,
        evidence: `${catTotal} ta o'quvchidan ${cat.ogil} tasi (${boyShare}%) — o'g'il bolalar`,
      });
    }
  }

  // ---------- 3. Qamrovi past mahallalar ----------
  const lowCoverage = stats.mahallaInsights
    .filter((m) => m.total < RULES.MAHALLA_LOW_COVERAGE)
    .map((m) => m.mahalla);

  if (lowCoverage.length > 0) {
    out.push({
      id: 'low-coverage',
      priority: 'high',
      title: `${lowCoverage.length} ta mahallada qamrov juda past`,
      action: `Quyidagi mahallalarda so'rovnoma deyarli o'tkazilmagan: ${lowCoverage.slice(0, 8).join(', ')}${lowCoverage.length > 8 ? ' va boshqalar' : ''}. Ushbu mahallalardagi maktablarga takroran murojaat qilish kerak — aks holda tahlil natijasi to'liq bo'lmaydi.`,
      evidence: `Har birida ${RULES.MAHALLA_LOW_COVERAGE} tadan kam anketa`,
    });
  }

  // ---------- 4. To'garaklar qamrovi ----------
  const noClub = stats.byClub.find((c) => c.name === 'Hech qaysi');
  if (noClub) {
    const share = percent(noClub.value, total);
    if (share >= RULES.NO_CLUB_SHARE) {
      out.push({
        id: 'club-coverage',
        priority: 'high',
        title: "O'quvchilarning yarmi hech qanday to'garakka qatnamaydi",
        action: `Mavjud to'garaklar soni yoki ular haqidagi xabardorlik yetarli emas. Maktablarda to'garaklar ro'yxatini e'lon qilish va yangi guruhlar ochish tavsiya etiladi.`,
        evidence: `${total} ta o'quvchidan ${noClub.value} tasi (${share}%) "Hech qaysi" deb javob bergan`,
      });
    }
  }

  // ---------- 5. Chet elda o'qish istagi ----------
  const abroadYes = stats.studyAbroad.find((s) => s.name === 'Ha');
  if (abroadYes) {
    const share = percent(abroadYes.value, total);
    if (share >= RULES.STUDY_ABROAD_SHARE) {
      out.push({
        id: 'study-abroad',
        priority: 'medium',
        title: "Chet elda o'qish istagi yuqori",
        action: `Ingliz tili va xalqaro imtihonlarga (IELTS, SAT) tayyorlov kurslarini kengaytirish, shuningdek davlat stipendiya dasturlari haqida tanishtiruv tadbirlarini o'tkazish tavsiya etiladi.`,
        evidence: `${abroadYes.value} ta o'quvchi (${share}%) chet elda o'qishni xohlaydi`,
      });
    }
  }

  // ---------- 6. Kasb tanlovi va fanga qiziqish o'rtasidagi tafovut ----------
  for (const [category, subject] of Object.entries(CATEGORY_SUBJECT)) {
    const catStat = stats.byCategory.find((c) => c.name === category);
    const subjStat = stats.bySubject.find((s) => s.name === subject);
    if (!catStat || catStat.value < RULES.GENDER_MIN_STUDENTS) continue;

    const catShare = percent(catStat.value, total);
    const subjShare = percent(subjStat?.value ?? 0, total);

    if (catShare - subjShare >= RULES.SUBJECT_GAP) {
      out.push({
        id: `subject-gap-${category}`,
        priority: 'medium',
        title: `"${category}" ni tanlaganlar ko'p, lekin ${subject} faniga qiziqish past`,
        action: `O'quvchilar bu kasbni tanlayapti, ammo unga zarur bo'lgan ${subject} fanini yoqtirmayapti. ${subject} fanini o'qitish uslubini qayta ko'rib chiqish va amaliy mashg'ulotlarni ko'paytirish kerak.`,
        evidence: `Kasb yo'nalishi: ${catShare}% · ${subject} fani: ${subjShare}% (tafovut ${catShare - subjShare} punkt)`,
      });
    }
  }

  // ---------- 7. Tumandagi eng ommabop kasb ----------
  const topJob = stats.topJobs[0];
  if (topJob) {
    out.push({
      id: 'top-job',
      priority: 'info',
      title: `Tumandagi eng ommabop kasb — ${topJob.name}`,
      action: `Ushbu kasb egalari bilan maktablarda uchrashuvlar tashkil etish va tegishli oliy o'quv yurtlari bilan hamkorlik o'rnatish tavsiya etiladi.`,
      evidence: `${topJob.value} ta o'quvchi (${percent(topJob.value, total)}%) shu kasbni tanlagan`,
    });
  }

  // ---------- 8. Umumiy jins nisbati ----------
  out.push({
    id: 'gender-ratio',
    priority: 'info',
    title: 'Ishtirokchilarning jins nisbati',
    action: `To'garak va tadbirlarni rejalashtirishda ushbu nisbatni hisobga olish lozim.`,
    evidence: `Qizlar — ${stats.kpi.girlsCount} ta (${stats.kpi.girlsPercent}%), o'g'il bolalar — ${stats.kpi.boysCount} ta (${stats.kpi.boysPercent}%)`,
  });

  // Muhimlik darajasi bo'yicha tartiblaymiz
  const order: Record<RecommendationPriority, number> = { high: 0, medium: 1, info: 2 };
  return out.sort((a, b) => order[a.priority] - order[b.priority]);
}

/** Muhimlik darajasining o'zbekcha nomi */
export const PRIORITY_LABELS: Record<RecommendationPriority, string> = {
  high: 'Yuqori',
  medium: "O'rta",
  info: "Ma'lumot",
};
