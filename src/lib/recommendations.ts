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
import { MIN_GROUP } from './center-planning';
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
  // Kasb bilan bog'liq foizlar uchun maxraj (9-11-sinf javoblari)
  const withJob = stats.kpi.withJob;

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

  // ---------- 0-a. Umuman to'ldirmagan maktablar ----------
  /*
   * Bu tavsiya birinchi turadi, chunki u tahlilning O'ZIGA tegishli:
   * javob bermagan maktab qolgan barcha xulosani egri qiladi.
   */
  const cov = stats.coverage;
  if (cov.silentSchools > 0) {
    const silent = cov.schools.filter((s) => s.inCatalog && s.count === 0).map((s) => s.name);
    out.push({
      id: 'schools-silent',
      priority: 'high',
      title: `${cov.silentSchools} ta maktab so'rovnomani umuman o'tkazmagan`,
      action:
        `Quyidagi maktablardan bitta ham anketa kelmagan: ` +
        `${silent.slice(0, 8).join(', ')}${silent.length > 8 ? ` va yana ${silent.length - 8} ta` : ''}. ` +
        `Ushbu maktablar direktorlaridan hisobot so'rash kerak — ` +
        `ular qatnashmasa, tuman bo'yicha xulosa to'liq bo'lmaydi.`,
      evidence: `${cov.totalSchools} ta maktabdan ${cov.activeSchools} tasi qatnashdi`,
    });
  }

  // ---------- 0-b. Qatnashgan, lekin juda kam anketa bergan maktablar ----------
  const weakSchools = cov.schools.filter((s) => s.inCatalog && s.count > 0 && s.count < 5);
  if (weakSchools.length >= 3) {
    out.push({
      id: 'schools-weak',
      priority: 'medium',
      title: `${weakSchools.length} ta maktabda qamrov juda past`,
      action:
        `Bu maktablarda so'rovnoma boshlangan, lekin deyarli to'xtab qolgan: ` +
        `${weakSchools
          .slice(0, 8)
          .map((s) => `${s.name} (${s.count})`)
          .join(', ')}${weakSchools.length > 8 ? ' va boshqalar' : ''}. ` +
        `Sabab texnik bo'lishi mumkin — kompyuter sinfi yoki internet.`,
      evidence: `Har birida 5 tadan kam anketa`,
    });
  }

  // ---------- 0. MARKAZ OCHISH — eng amaliy tavsiya ----------
  // Bu qoidalar 4-qadam javoblariga tayanadi va boshqalaridan
  // ustun turadi: ular "qiziqish bor" emas, "guruh to'ladi" deydi.
  const plan = stats.centerPlan;

  if (plan.answered > 0) {
    const ready = plan.byMahalla.filter((o) => o.viability === 'viable');

    for (const option of ready.slice(0, 3)) {
      const course = option.courses[0];
      out.push({
        id: `center-${option.location}`,
        priority: 'high',
        title: `${option.location} mahallasida «${course.name}» kursini ochish mumkin`,
        action:
          `Guruh uchun yetarli o'quvchi bor. Eng qulay vaqt — ` +
          `${option.bestTime ?? "aniqlanmagan"}. ` +
          (option.topLanguage
            ? `Til yo'nalishi qo'shilsa, eng ko'p so'ralgani — ${option.topLanguage}.`
            : ''),
        evidence:
          `${option.topDemand} ta o'quvchi aynan shu kursni so'ragan ` +
          `(guruh uchun kamida ${MIN_GROUP} kishi kerak), ` +
          `${option.unservedShare}% hech qanday to'garakka qatnamaydi`,
      });
    }

    // Hech qayerda guruh to'lmasa — tuman markazi varianti
    if (ready.length === 0 && plan.district && plan.district.topDemand > 0) {
      const d = plan.district;
      out.push({
        id: 'center-district',
        priority: 'medium',
        title: "Alohida mahallada emas, tuman markazida bitta markaz ochish ma'qul",
        action:
          `Birorta mahallada guruh to'ladigan darajada talab to'planmadi, ` +
          `lekin tuman markaziga qatnashga tayyor o'quvchilar bor. ` +
          `Eng ko'p so'ralgan kurs — «${d.courses[0]?.name ?? '—'}».`,
        evidence:
          `Tuman markazigacha qatnashga ${d.reachable} ta o'quvchi tayyor, ` +
          `ulardan ${d.topDemand} tasi bitta kursni so'ragan`,
      });
    }

    // Talab bor, lekin sabab qatnov bo'lsa — yangi bino yechim emas
    const farBarrier = plan.barriers.find((b) => b.name === 'Uzoq, qatnash qiyin');
    if (farBarrier && percent(farBarrier.count, plan.answered) >= 25) {
      out.push({
        id: 'center-transport',
        priority: 'medium',
        title: "Asosiy to'siq — bino emas, qatnov",
        action:
          "Yangi markaz ochishdan oldin qatnov masalasini hal qiling: " +
          "maktab avtobusi, mahalladagi kichik filiallar yoki onlayn format.",
        evidence:
          `${farBarrier.count} ta o'quvchi (${percent(farBarrier.count, plan.answered)}%) ` +
          `«uzoq, qatnash qiyin» deb javob bergan`,
      });
    }

    // Onlayn format mumkinmi
    const noTech = plan.tech.find((t) => t.name === "Ikkalasi ham yo'q");
    if (noTech && percent(noTech.count, plan.answered) >= 30) {
      out.push({
        id: 'center-offline-only',
        priority: 'info',
        title: "Onlayn formatga tayanib bo'lmaydi",
        action:
          "Darslarni faqat jonli (oflayn) rejalashtiring, uy vazifalarini " +
          "kompyuter talab qilmaydigan shaklda bering.",
        evidence:
          `${noTech.count} ta o'quvchida (${percent(noTech.count, plan.answered)}%) ` +
          `uyda na kompyuter, na internet bor`,
      });
    }
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
  /*
   * Ilgari bu ro'yxat faqat ANKETA KELGAN mahallalardan tuzilardi,
   * ya'ni bitta ham javob kelmagan mahalla "qamrovi past" ro'yxatiga
   * umuman tushmasdi — eng yomon holat ko'rinmay qolardi.
   * Endi katalogdagi barcha mahallalar hisobga olinadi.
   */
  const lowCoverage = [
    ...cov.silentMahallas,
    ...stats.mahallaInsights
      .filter((m) => m.total < RULES.MAHALLA_LOW_COVERAGE)
      .map((m) => m.mahalla),
  ];

  if (lowCoverage.length > 0) {
    out.push({
      id: 'low-coverage',
      priority: 'high',
      title: `${lowCoverage.length} ta mahallada qamrov juda past`,
      action: `Quyidagi mahallalarda so'rovnoma deyarli o'tkazilmagan: ${lowCoverage.slice(0, 8).join(', ')}${lowCoverage.length > 8 ? ' va boshqalar' : ''}. Ushbu mahallalardagi maktablarga takroran murojaat qilish kerak — aks holda tahlil natijasi to'liq bo'lmaydi.`,
      evidence:
        `${cov.silentMahallas.length} tasidan umuman anketa kelmagan, ` +
        `qolganlarida ${RULES.MAHALLA_LOW_COVERAGE} tadan kam`,
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

  // ---------- 6. Kasb tanlovi va fanga qiziqish o'rtasidagi tafovut ----------
  for (const [category, subject] of Object.entries(CATEGORY_SUBJECT)) {
    const catStat = stats.byCategory.find((c) => c.name === category);
    const subjStat = stats.bySubject.find((s) => s.name === subject);
    if (!catStat || catStat.value < RULES.GENDER_MIN_STUDENTS) continue;

    /*
     * Ikkala ulush ham O'Z maxrajiga bo'linadi: kasb yo'nalishi
     * savoli faqat 9-11-sinfga beriladi, fan savoli esa hammaga.
     * Bir xil maxraj ishlatilsa, tafovut sun'iy chiqadi.
     */
    const catShare = percent(catStat.value, withJob);
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
  if (topJob && withJob > 0) {
    out.push({
      id: 'top-job',
      priority: 'info',
      title: `Tumandagi eng ommabop kasb — ${topJob.name}`,
      action: `Ushbu kasb egalari bilan maktablarda uchrashuvlar tashkil etish va tegishli oliy o'quv yurtlari bilan hamkorlik o'rnatish tavsiya etiladi.`,
      evidence:
        `Kasb tanlagan ${withJob} ta o'quvchidan ${topJob.value} tasi ` +
        `(${percent(topJob.value, withJob)}%) shu kasbni ko'rsatgan`,
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
