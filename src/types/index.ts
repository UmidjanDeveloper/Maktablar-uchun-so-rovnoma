/**
 * ============================================================
 *  Ilova bo'ylab ishlatiladigan umumiy TypeScript tiplari
 * ============================================================
 */

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
  dreamJob: string;
  jobCategory: string;
  motivation: string | null;
  inspiration: string | null;
  studyAbroad: string | null;
  futureContribution: string | null;
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
