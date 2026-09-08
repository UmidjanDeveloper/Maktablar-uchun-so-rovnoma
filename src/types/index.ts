/**
 * ============================================================
 *  Ilova bo'ylab ishlatiladigan umumiy TypeScript tiplari
 * ============================================================
 */
import type { CenterPlan } from '@/lib/center-planning';

export type { CenterPlan };

/** API orqali qaytadigan o'quvchi yozuvi (sanalar ISO satr ko'rinishida) */
export interface StudentRecord {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string | null;
  parentPhone: string | null;
  region: string;
  district: string;
  mahalla: string;
  school: string;
  grade: number;
  favoriteSubjects: string[];
  clubs: string[];
  /** Faqat 9-11-sinfda so'raladi — kichik sinflarda bo'sh */
  dreamJob: string | null;
  jobCategory: string | null;
  motivation: string | null;
  inspiration: string | null;
  studyAbroad: string | null;
  futureContribution: string | null;
  wantedCourses: string[];
  wantedLanguages: string[];
  travelWillingness: string | null;
  barriers: string[];
  availableTimes: string[];
  homeTech: string | null;
  /** Hokimiyat aralashuvi bo'yicha ish bajarildimi */
  helpResolved: boolean;
  helpResolvedAt: string | null;
  createdAt: string;
}

/** Admin paneldagi global filtrlar */
export interface DashboardFilters {
  mahallalar: string[];
  maktablar: string[];
  sinflar: number[];
  jinslar: string[];
  kategoriyalar: string[];
  dateFrom: string | null;
  dateTo: string | null;
}

/** Bo'sh (filtrsiz) holat */
export const EMPTY_FILTERS: DashboardFilters = {
  mahallalar: [],
  maktablar: [],
  sinflar: [],
  jinslar: [],
  kategoriyalar: [],
  dateFrom: null,
  dateTo: null,
};

/** Nom–qiymat juftligi (diagrammalar uchun) */
export interface NameValue {
  name: string;
  value: number;
}

/** Jins bo'yicha ajratilgan kasb statistikasi */
export interface GenderJobStat {
  name: string;
  ogil: number;
  qiz: number;
}

/** Maktab bo'yicha eng ommabop kasb (jadval uchun) */
export interface SchoolTopJob {
  school: string;
  total: number;
  topJob: string;
  topJobCount: number;
  topJobIcon: string;
}

/** Mahalla kesimidagi tahlil — tavsiyalar uchun asos */
export interface MahallaInsight {
  mahalla: string;
  total: number;
  /** Shu mahallada eng ko'p tanlangan kasb yo'nalishi */
  topCategory: string;
  topCategoryCount: number;
  /** Ushbu yo'nalishning mahalladagi ulushi (%) */
  topCategoryShare: number;
  girls: number;
  boys: number;
}

/**
 * Bitta hudud (mahalla yoki maktab) kesimidagi talab.
 *
 * Hisobotning amaliy qismi shu: hokim uchun "tumanda Arxeolog
 * ommabop" degan raqamdan ko'ra "Oqtepada 6 ta bola dasturlashni
 * so'rayapti" degan qator qimmatroq — qaror shunga ko'ra chiqadi.
 */
export interface AreaDemand {
  name: string;
  total: number;
  /** Eng ko'p tanlangan orzu kasb (9-11-sinf javoblari) */
  topJob: string | null;
  topJobCount: number;
  /** Eng ko'p tanlangan kasb yo'nalishi */
  topCategory: string | null;
  topCategoryCount: number;
  /** Eng qiziqarli fan */
  topSubject: string | null;
  topSubjectCount: number;
  /** Eng ko'p so'ralgan kurs — ochilishi kerak bo'lgan to'garak */
  topCourse: string | null;
  topCourseCount: number;
}

/**
 * Hokimiyat aralashuvi statistikasi.
 *
 * Diagrammalardan farqi: bu yerda «holat» emas, «bajarilgan ish»
 * o'lchanadi — nechta muammo aniqlangan va nechtasi yopilgan.
 */
export interface HelpStats {
  /** Umuman to'siq belgilagan o'quvchilar */
  withBarriers: number;
  /** Ulardan hokimiyat aralashuvi talab qiladiganlari */
  needHelp: number;
  /** Hal qilindi deb belgilanganlari */
  resolved: number;
  /** Hali kutayotganlari */
  pending: number;
  /** Sabab kesimida: nechta bola aytgan va nechtasi yopilgan */
  byBarrier: { name: string; count: number; resolved: number }[];
}

/** Yo'nalish bo'yicha jins taqsimoti */
export interface CategoryGenderStat {
  name: string;
  ogil: number;
  qiz: number;
}

/** /api/stats javobi */
export interface DashboardStats {
  kpi: {
    totalStudents: number;
    totalSchools: number;
    totalMahallas: number;
    girlsCount: number;
    boysCount: number;
    girlsPercent: number;
    boysPercent: number;
    totalAll: number;
  };
  topJobs: NameValue[];
  genderJobs: GenderJobStat[];
  byMahalla: NameValue[];
  bySchool: SchoolTopJob[];
  byGrade: NameValue[];
  bySubject: NameValue[];
  byCategory: NameValue[];
  byInspiration: NameValue[];
  studyAbroad: NameValue[];
  byClub: NameValue[];
  mahallaInsights: MahallaInsight[];
  /** Ta'lim markazi ochish tahlili (5-qadam javoblari asosida) */
  centerPlan: CenterPlan;
  categoryGender: CategoryGenderStat[];
  /** Yordam kerak bo'lgan o'quvchilar bo'yicha bajarilgan ish */
  help: HelpStats;
  /** Mahallalar kesimida talab: qaysi kasb, fan va kursga */
  demandByMahalla: AreaDemand[];
  /** Maktablar kesimida talab */
  demandBySchool: AreaDemand[];
}

/** Ro'yxat (jadval) uchun sahifalangan javob */
export interface PaginatedStudents {
  items: StudentRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Kataloglar javobi */
export interface CatalogsResponse {
  mahallalar: { id: string; name: string }[];
  maktablar: { id: string; name: string }[];
  kasblar: { id: string; name: string; category: string; icon: string }[];
}
